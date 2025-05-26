# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import datetime # Thêm import này
from db_config import get_db_connection
# from utils import json_serial # Nếu bạn tạo file utils.py

app = Flask(__name__)
# Cho phép CORS từ frontend của bạn (thay đổi port nếu cần)
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}})


# --- Authentication Routes ---
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password') # Lưu plain text theo yêu cầu
    role = data.get('role')

    if not all([name, email, password, role]):
        return jsonify({"error": "Vui lòng điền đủ thông tin."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Lỗi kết nối server."}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT UserID FROM Users WHERE Email = ?", email)
        if cursor.fetchone():
            return jsonify({"error": "Email này đã được sử dụng."}), 409

        cursor.execute("INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
                       name, email, password, role)
        conn.commit()
        return jsonify({"message": f"Đăng ký thành công với vai trò {role}. Vui lòng đăng nhập."}), 201
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on register: {e}")
        return jsonify({"error": "Lỗi server khi đăng ký."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Vui lòng nhập đủ email và mật khẩu."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Lỗi kết nối server."}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT UserID, Name, Email, Role FROM Users WHERE Email = ? AND Password = ?",
                       email, password)
        user_row = cursor.fetchone()

        if user_row:
            user_data = {
                "id": user_row.UserID,
                "name": user_row.Name,
                "email": user_row.Email,
                "role": user_row.Role
            }
            # Lấy các khóa học đã đăng ký nếu là học viên
            if user_data['role'] == 'Học viên':
                cursor.execute("SELECT CourseID FROM UserEnrollments WHERE UserID = ?", user_data['id'])
                enrolled_courses_rows = cursor.fetchall()
                user_data['enrolledCourses'] = [row.CourseID for row in enrolled_courses_rows]
            else:
                 user_data['enrolledCourses'] = []

            return jsonify({"message": "Đăng nhập thành công", "user": user_data}), 200
        else:
            return jsonify({"error": "Email hoặc mật khẩu không đúng."}), 401
    except pyodbc.Error as e:
        print(f"DB Error on login: {e}")
        return jsonify({"error": "Lỗi server khi đăng nhập."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- Course Routes ---
@app.route('/api/courses', methods=['GET'])
def get_courses():
    search_term = request.args.get('search', '')
    limit_str = request.args.get('limit')
    limit = None
    if limit_str and limit_str.isdigit():
        limit = int(limit_str)

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    
    base_query = """
        SELECT c.CourseID, c.Title, c.Price, c.ImageURL, u.Name AS InstructorName, c.Description, c.CreatorUserID, u.Email as CreatorEmail
        FROM Courses c
        JOIN Users u ON c.CreatorUserID = u.UserID
    """
    params = []
    conditions = []

    if search_term:
        conditions.append("(c.Title LIKE ? OR u.Name LIKE ? OR c.Description LIKE ?)")
        # SQL Server không phân biệt hoa thường mặc định cho LIKE nếu collation là case-insensitive
        params.extend([f'%{search_term}%', f'%{search_term}%', f'%{search_term}%'])
    
    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)
    
    base_query += " ORDER BY c.CreatedAt DESC"

    # SQL Server dùng TOP cho limit, không phải OFFSET/LIMIT như PostgreSQL/MySQL
    # Nếu có limit, ta phải xử lý query hơi khác
    final_query = base_query
    if limit is not None:
        final_query = final_query.replace("SELECT", f"SELECT TOP ({limit})", 1)


    try:
        cursor.execute(final_query, params)
        courses_rows = cursor.fetchall()
        courses = []
        for row in courses_rows:
            courses.append({
                "id": row.CourseID,
                "title": row.Title,
                "instructor": row.InstructorName,
                "creatorEmail": row.CreatorEmail,
                "price": row.Price,
                "image": row.ImageURL,
                "description": row.Description,
                "creatorUserID": row.CreatorUserID
            })
        return jsonify(courses), 200
    except pyodbc.Error as e:
        print(f"DB Error on get_courses: {e}")
        return jsonify({"error": "Lỗi server khi lấy danh sách khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    
    course_data = {}
    try:
        cursor.execute("""
            SELECT c.CourseID, c.Title, c.Description, c.Price, c.ImageURL, 
                   u.Name AS InstructorName, u.Email AS CreatorEmail, c.CreatorUserID
            FROM Courses c
            JOIN Users u ON c.CreatorUserID = u.UserID
            WHERE c.CourseID = ?
        """, course_id)
        course_row = cursor.fetchone()
        if not course_row:
            return jsonify({"error": "Không tìm thấy khóa học."}), 404

        course_data = {
            "id": course_row.CourseID,
            "title": course_row.Title,
            "description": course_row.Description,
            "price": course_row.Price,
            "image": course_row.ImageURL,
            "instructor": course_row.InstructorName,
            "creatorEmail": course_row.CreatorEmail,
            "creatorUserID": course_row.CreatorUserID,
            "files": [], # Sẽ lấy từ CourseFiles nếu bạn implement
            "structure": []
        }

        # Lấy Chapters và Lessons
        cursor.execute("SELECT ChapterID, Title, Description FROM Chapters WHERE CourseID = ? ORDER BY SortOrder, ChapterID", course_id)
        chapters_rows = cursor.fetchall()
        
        for chap_row in chapters_rows:
            chapter_obj = {
                "id": chap_row.ChapterID, # Frontend đang dùng string, ở đây là INT
                "title": chap_row.Title,
                "description": chap_row.Description,
                "lessons": []
            }
            cursor.execute("""
                SELECT LessonID, Title, Description, VideoURL, MediaFileName, AttachmentURL, AttachmentFileName
                FROM Lessons 
                WHERE ChapterID = ? 
                ORDER BY SortOrder, LessonID
            """, chap_row.ChapterID)
            lessons_rows = cursor.fetchall()
            for less_row in lessons_rows:
                lesson_content = {}
                if less_row.VideoURL: lesson_content['mediaUrl'] = less_row.VideoURL
                if less_row.MediaFileName: lesson_content['mediaFileName'] = less_row.MediaFileName # Để frontend biết file cũ
                if less_row.AttachmentURL: lesson_content['attachmentUrl'] = less_row.AttachmentURL
                if less_row.AttachmentFileName: lesson_content['attachmentFileName'] = less_row.AttachmentFileName
                
                chapter_obj["lessons"].append({
                    "id": less_row.LessonID, # Frontend đang dùng string, ở đây là INT
                    "title": less_row.Title,
                    "description": less_row.Description, # Nội dung text của bài giảng
                    "content": lesson_content if lesson_content else None
                })
            course_data["structure"].append(chapter_obj)
            
        return jsonify(course_data), 200

    except pyodbc.Error as e:
        print(f"DB Error on get_course_detail for ID {course_id}: {e}")
        return jsonify({"error": f"Lỗi server khi lấy chi tiết khóa học ID {course_id}."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    creator_user_id = data.get('creatorUserID') # Frontend sẽ gửi UserID của người đang đăng nhập
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    image_url = data.get('image') # Front gửi là 'image'
    # instructor_name = data.get('instructorName') # Tên giảng viên, front sẽ lấy từ loggedInUser.name

    if not all([creator_user_id, title, description]): # Price có thể là "Miễn phí"
        return jsonify({"error": "Thiếu thông tin cần thiết (creatorUserID, title, description)."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT Role FROM Users WHERE UserID = ?", creator_user_id)
        user_role_row = cursor.fetchone()
        if not user_role_row or user_role_row.Role != 'Giảng viên':
            return jsonify({"error": "Chỉ Giảng viên mới có thể tạo khóa học."}), 403

        cursor.execute("""
            INSERT INTO Courses (Title, Description, Price, ImageURL, CreatorUserID)
            OUTPUT INSERTED.CourseID, INSERTED.Title, INSERTED.Description, INSERTED.Price, INSERTED.ImageURL, INSERTED.CreatorUserID
            VALUES (?, ?, ?, ?, ?);
        """, title, description, price, image_url, creator_user_id)
        
        new_course_row = cursor.fetchone()
        conn.commit()

        if new_course_row:
             # Lấy tên giảng viên để trả về cho frontend
            cursor.execute("SELECT Name FROM Users WHERE UserID = ?", new_course_row.CreatorUserID)
            instructor_name_row = cursor.fetchone()
            instructor_name_for_response = instructor_name_row.Name if instructor_name_row else "N/A"

            return jsonify({
                "message": "Khóa học đã được tạo thành công.", 
                "course": {
                    "id": new_course_row.CourseID,
                    "title": new_course_row.Title,
                    "description": new_course_row.Description,
                    "price": new_course_row.Price,
                    "image": new_course_row.ImageURL,
                    "instructor": instructor_name_for_response, # Tên giảng viên
                    "creatorUserID": new_course_row.CreatorUserID,
                    "structure": [], # Khóa mới chưa có structure
                    "files": []      # Khóa mới chưa có files
                }
            }), 201
        else:
            conn.rollback()
            return jsonify({"error": "Không thể tạo khóa học."}), 500

    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on create_course: {e}")
        return jsonify({"error": "Lỗi server khi tạo khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.get_json()
    current_user_id = data.get('currentUserID') # ID của người dùng đang thực hiện request
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    image_url = data.get('image')

    if not all([title, description, price is not None, current_user_id]):
        return jsonify({"error": "Thiếu thông tin cập nhật hoặc UserID."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT CreatorUserID FROM Courses WHERE CourseID = ?", course_id)
        course_owner_row = cursor.fetchone()
        if not course_owner_row:
            return jsonify({"error": "Không tìm thấy khóa học."}), 404
        if course_owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Bạn không có quyền sửa khóa học này."}), 403

        cursor.execute("""
            UPDATE Courses
            SET Title = ?, Description = ?, Price = ?, ImageURL = ?, UpdatedAt = GETDATE()
            WHERE CourseID = ?;
        """, title, description, price, image_url, course_id)
        conn.commit()
        
        if cursor.rowcount == 0: # Không có dòng nào được cập nhật
             return jsonify({"message": "Không có thay đổi nào được thực hiện hoặc không tìm thấy khóa học."}), 200 # Hoặc 404 nếu không tìm thấy

        return jsonify({"message": "Khóa học đã được cập nhật thành công."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on update_course: {e}")
        return jsonify({"error": "Lỗi server khi cập nhật khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course_by_id(course_id): # Đổi tên hàm để tránh trùng với biến global
    data = request.get_json() 
    current_user_id = data.get('currentUserID') if data else None

    if not current_user_id:
        return jsonify({"error": "Xác thực thất bại (Thiếu UserID)."}), 401

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT CreatorUserID FROM Courses WHERE CourseID = ?", course_id)
        course_owner_row = cursor.fetchone()
        if not course_owner_row:
            return jsonify({"error": "Không tìm thấy khóa học."}), 404
        if course_owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Bạn không có quyền xóa khóa học này."}), 403

        cursor.execute("DELETE FROM Courses WHERE CourseID = ?", course_id) # ON DELETE CASCADE sẽ xử lý các bảng liên quan
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Không tìm thấy khóa học để xóa."}), 404
        
        return jsonify({"message": "Khóa học đã được xóa thành công."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on delete_course: {e}")
        return jsonify({"error": "Lỗi server khi xóa khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- Chapter Routes ---
@app.route('/api/courses/<int:course_id>/chapters', methods=['POST'])
def add_chapter_to_course(course_id):
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    title = data.get('title')
    description = data.get('description', '') # Mặc định là chuỗi rỗng nếu không có

    if not all([title, current_user_id]):
        return jsonify({"error": "Thiếu thông tin (title, currentUserID)."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT CreatorUserID FROM Courses WHERE CourseID = ?", course_id)
        course_owner_row = cursor.fetchone()
        if not course_owner_row: return jsonify({"error": "Khóa học không tồn tại."}), 404
        if course_owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Không có quyền thêm chương vào khóa học này."}), 403

        cursor.execute("""
            INSERT INTO Chapters (CourseID, Title, Description)
            OUTPUT INSERTED.ChapterID, INSERTED.Title, INSERTED.Description
            VALUES (?, ?, ?);
        """, course_id, title, description)
        new_chapter_row = cursor.fetchone()
        conn.commit()
        
        if new_chapter_row:
            return jsonify({
                "message": "Chương mới đã được thêm thành công.", 
                "chapter": {
                    "id": new_chapter_row.ChapterID, 
                    "title": new_chapter_row.Title, 
                    "description": new_chapter_row.Description, 
                    "lessons": []
                }
            }), 201
        else:
            conn.rollback()
            return jsonify({"error": "Không thể thêm chương."}), 500
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on add_chapter: {e}")
        return jsonify({"error": "Lỗi server khi thêm chương."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/chapters/<int:chapter_id>', methods=['PUT'])
def update_chapter_by_id(chapter_id): # Đổi tên hàm
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    title = data.get('title')
    description = data.get('description', '')

    if not all([title, current_user_id]):
        return jsonify({"error": "Thiếu thông tin (title, currentUserID)."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.CreatorUserID 
            FROM Chapters ch
            JOIN Courses c ON ch.CourseID = c.CourseID
            WHERE ch.ChapterID = ?
        """, chapter_id)
        owner_row = cursor.fetchone()
        if not owner_row: return jsonify({"error": "Chương không tồn tại."}), 404
        if owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Không có quyền sửa chương này."}), 403
            
        cursor.execute("""
            UPDATE Chapters SET Title = ?, Description = ? WHERE ChapterID = ?
        """, title, description, chapter_id)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Không có thay đổi hoặc không tìm thấy chương."}), 200
        return jsonify({"message": "Chương đã được cập nhật."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on update_chapter: {e}")
        return jsonify({"error": "Lỗi server khi cập nhật chương."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/chapters/<int:chapter_id>', methods=['DELETE'])
def delete_chapter_by_id(chapter_id): # Đổi tên hàm
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    if not current_user_id: return jsonify({"error": "Xác thực thất bại."}), 401

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.CreatorUserID 
            FROM Chapters ch
            JOIN Courses c ON ch.CourseID = c.CourseID
            WHERE ch.ChapterID = ?
        """, chapter_id)
        owner_row = cursor.fetchone()
        if not owner_row: return jsonify({"error": "Chương không tồn tại."}), 404
        if owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Không có quyền xóa chương này."}), 403

        cursor.execute("DELETE FROM Chapters WHERE ChapterID = ?", chapter_id) # ON DELETE CASCADE
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Không tìm thấy chương để xóa."}), 404
        return jsonify({"message": "Chương đã được xóa."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on delete_chapter: {e}")
        return jsonify({"error": "Lỗi server khi xóa chương."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- Lesson Routes ---
@app.route('/api/chapters/<int:chapter_id>/lessons', methods=['POST'])
def add_lesson_to_chapter_by_id(chapter_id): # Đổi tên hàm
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    title = data.get('title')
    description = data.get('description', '') # Nội dung text
    content = data.get('content', {}) # Object chứa mediaUrl, mediaFileName, etc.

    if not all([title, current_user_id]):
        return jsonify({"error": "Thiếu thông tin (title, currentUserID)."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT co.CreatorUserID
            FROM Chapters ch
            JOIN Courses co ON ch.CourseID = co.CourseID
            WHERE ch.ChapterID = ?
        """, chapter_id)
        owner_row = cursor.fetchone()
        if not owner_row: return jsonify({"error": "Chương không tồn tại."}), 404
        if owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Không có quyền thêm bài giảng vào chương này."}), 403

        video_url = content.get('mediaUrl')
        media_file_name = content.get('mediaFileName')
        attachment_url = content.get('attachmentUrl')
        attachment_file_name = content.get('attachmentFileName')

        cursor.execute("""
            INSERT INTO Lessons (ChapterID, Title, Description, VideoURL, MediaFileName, AttachmentURL, AttachmentFileName)
            OUTPUT INSERTED.LessonID, INSERTED.Title, INSERTED.Description, 
                   INSERTED.VideoURL, INSERTED.MediaFileName, INSERTED.AttachmentURL, INSERTED.AttachmentFileName
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, chapter_id, title, description, video_url, media_file_name, attachment_url, attachment_file_name)
        new_lesson_row = cursor.fetchone()
        conn.commit()

        if new_lesson_row:
            returned_content = {}
            if new_lesson_row.VideoURL: returned_content['mediaUrl'] = new_lesson_row.VideoURL
            if new_lesson_row.MediaFileName: returned_content['mediaFileName'] = new_lesson_row.MediaFileName
            if new_lesson_row.AttachmentURL: returned_content['attachmentUrl'] = new_lesson_row.AttachmentURL
            if new_lesson_row.AttachmentFileName: returned_content['attachmentFileName'] = new_lesson_row.AttachmentFileName
            
            return jsonify({
                "message": "Bài giảng mới đã được thêm.",
                "lesson": {
                    "id": new_lesson_row.LessonID,
                    "title": new_lesson_row.Title,
                    "description": new_lesson_row.Description,
                    "content": returned_content if returned_content else None
                }
            }), 201
        else:
            conn.rollback()
            return jsonify({"error": "Không thể thêm bài giảng."}), 500
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on add_lesson: {e}")
        return jsonify({"error": "Lỗi server khi thêm bài giảng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/lessons/<int:lesson_id>', methods=['PUT'])
def update_lesson_by_id(lesson_id): # Đổi tên hàm
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    title = data.get('title')
    description = data.get('description', '')
    content = data.get('content', {})

    if not all([title, current_user_id]):
        return jsonify({"error": "Thiếu thông tin (title, currentUserID)."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT co.CreatorUserID
            FROM Lessons l
            JOIN Chapters ch ON l.ChapterID = ch.ChapterID
            JOIN Courses co ON ch.CourseID = co.CourseID
            WHERE l.LessonID = ?
        """, lesson_id)
        owner_row = cursor.fetchone()
        if not owner_row: return jsonify({"error": "Bài giảng không tồn tại."}), 404
        if owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Không có quyền sửa bài giảng này."}), 403

        video_url = content.get('mediaUrl')
        media_file_name = content.get('mediaFileName')
        attachment_url = content.get('attachmentUrl')
        attachment_file_name = content.get('attachmentFileName')

        cursor.execute("""
            UPDATE Lessons 
            SET Title = ?, Description = ?, VideoURL = ?, MediaFileName = ?, AttachmentURL = ?, AttachmentFileName = ?
            WHERE LessonID = ?;
        """, title, description, video_url, media_file_name, attachment_url, attachment_file_name, lesson_id)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Không có thay đổi hoặc không tìm thấy bài giảng."}), 200
        return jsonify({"message": "Bài giảng đã được cập nhật."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on update_lesson: {e}")
        return jsonify({"error": "Lỗi server khi cập nhật bài giảng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/lessons/<int:lesson_id>', methods=['DELETE'])
def delete_lesson_by_id(lesson_id): # Đổi tên hàm
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    if not current_user_id: return jsonify({"error": "Xác thực thất bại."}), 401

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT co.CreatorUserID
            FROM Lessons l
            JOIN Chapters ch ON l.ChapterID = ch.ChapterID
            JOIN Courses co ON ch.CourseID = co.CourseID
            WHERE l.LessonID = ?
        """, lesson_id)
        owner_row = cursor.fetchone()
        if not owner_row: return jsonify({"error": "Bài giảng không tồn tại."}), 404
        if owner_row.CreatorUserID != current_user_id:
            return jsonify({"error": "Không có quyền xóa bài giảng này."}), 403
        
        cursor.execute("DELETE FROM Lessons WHERE LessonID = ?", lesson_id)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Không tìm thấy bài giảng để xóa."}), 404
        return jsonify({"message": "Bài giảng đã được xóa."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on delete_lesson: {e}")
        return jsonify({"error": "Lỗi server khi xóa bài giảng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- User Specific Routes ---
@app.route('/api/users/<int:user_id>/courses', methods=['GET'])
def get_user_courses_by_id(user_id): # Đổi tên hàm
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT Role FROM Users WHERE UserID = ?", user_id)
        user_role_row = cursor.fetchone()
        if not user_role_row:
            return jsonify({"error": "Người dùng không tồn tại."}), 404
        
        role = user_role_row.Role
        courses_list = [] # Đổi tên biến để tránh trùng

        if role == 'Học viên':
            cursor.execute("""
                SELECT c.CourseID, c.Title, c.Price, c.ImageURL, u_instructor.Name AS InstructorName, c.Description
                FROM UserEnrollments ue
                JOIN Courses c ON ue.CourseID = c.CourseID
                JOIN Users u_instructor ON c.CreatorUserID = u_instructor.UserID
                WHERE ue.UserID = ?
            """, user_id)
        elif role == 'Giảng viên':
            cursor.execute("""
                SELECT c.CourseID, c.Title, c.Price, c.ImageURL, u_creator.Name AS InstructorName, c.Description
                FROM Courses c
                JOIN Users u_creator ON c.CreatorUserID = u_creator.UserID
                WHERE c.CreatorUserID = ?
            """, user_id)
        else: # Vai trò không xác định
            return jsonify(courses_list), 200

        courses_rows = cursor.fetchall()
        for row in courses_rows:
            courses_list.append({
                "id": row.CourseID,
                "title": row.Title,
                "instructor": row.InstructorName,
                "price": row.Price,
                "image": row.ImageURL,
                "description": row.Description
            })
        return jsonify(courses_list), 200

    except pyodbc.Error as e:
        print(f"DB Error on get_user_courses: {e}")
        return jsonify({"error": "Lỗi server khi lấy khóa học của người dùng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>/enroll', methods=['POST'])
def enroll_in_course(course_id): # Đổi tên hàm
    data = request.get_json()
    user_id = data.get('userID') # Frontend gửi là 'userID'

    if not user_id:
        return jsonify({"error": "Thiếu UserID."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT UserID FROM Users WHERE UserID = ?", user_id)
        if not cursor.fetchone():
            return jsonify({"error": "Người dùng không tồn tại."}), 404
        
        cursor.execute("SELECT CourseID FROM Courses WHERE CourseID = ?", course_id)
        if not cursor.fetchone():
            return jsonify({"error": "Khóa học không tồn tại."}), 404

        cursor.execute("SELECT EnrollmentID FROM UserEnrollments WHERE UserID = ? AND CourseID = ?", user_id, course_id)
        if cursor.fetchone():
            return jsonify({"message": "Bạn đã đăng ký khóa học này rồi."}), 200 

        cursor.execute("INSERT INTO UserEnrollments (UserID, CourseID) VALUES (?, ?)", user_id, course_id)
        conn.commit()
        return jsonify({"message": "Đăng ký khóa học thành công."}), 201
    except pyodbc.IntegrityError: 
        conn.rollback() # Quan trọng nếu có lỗi unique constraint
        return jsonify({"message": "Bạn đã đăng ký khóa học này rồi (Lỗi trùng lặp)."}), 409 # Conflict
    except pyodbc.Error as e:
        conn.rollback()
        print(f"DB Error on enroll_course: {e}")
        return jsonify({"error": "Lỗi server khi đăng ký khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=5000)