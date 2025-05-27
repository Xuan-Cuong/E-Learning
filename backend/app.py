# backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pyodbc
import datetime
from db_config import get_db_connection
import logging
from uploads import init_upload_folder, save_uploaded_file, UPLOAD_FOLDER
import os

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] - %(message)s', 
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.before_request
def log_request_info():
    logger.debug('Headers: %s', request.headers)
    logger.debug('Body: %s', request.get_data())

def init_database():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            
            # Xóa bảng cũ nếu tồn tại (theo thứ tự đúng)
            logger.info("Dropping existing tables if they exist...")
            cursor.execute("IF OBJECT_ID('dbo.UserEnrollments', 'U') IS NOT NULL DROP TABLE dbo.UserEnrollments")
            cursor.execute("IF OBJECT_ID('dbo.Lessons', 'U') IS NOT NULL DROP TABLE dbo.Lessons")
            cursor.execute("IF OBJECT_ID('dbo.Chapters', 'U') IS NOT NULL DROP TABLE dbo.Chapters")
            cursor.execute("IF OBJECT_ID('dbo.Courses', 'U') IS NOT NULL DROP TABLE dbo.Courses")
            cursor.execute("IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories")
            cursor.execute("IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users")
            conn.commit()
            logger.info("Old tables dropped.")

            # Tạo bảng Users mới (không có cột Role)
            logger.info("Creating Users table...")
            cursor.execute("""
                CREATE TABLE Users (
                    UserID INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL,
                    Email NVARCHAR(100) NOT NULL,
                    Password NVARCHAR(100) NOT NULL,
                    CreatedAt DATETIME DEFAULT GETDATE()
                );
                CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);
            """)
            logger.info("Users table created.")
            
            # Tạo bảng Categories
            logger.info("Creating Categories table...")
            cursor.execute("""
                CREATE TABLE Categories (
                    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL,
                    Description NVARCHAR(500),
                    IconClass NVARCHAR(50),
                    Slug NVARCHAR(100),
                    CreatedAt DATETIME DEFAULT GETDATE()
                )
            """)
            logger.info("Categories table created.")
            
            # Insert default categories
            logger.info("Inserting default categories...")
            cursor.execute("""
                INSERT INTO Categories (Name, Description, IconClass, Slug) VALUES
                ('Lập trình Web', 'Học phát triển web từ cơ bản đến nâng cao', 'fas fa-code', 'lap-trinh-web'),
                ('Lập trình Mobile', 'Phát triển ứng dụng di động đa nền tảng', 'fas fa-mobile-alt', 'lap-trinh-mobile'),
                ('Khoa học Dữ liệu', 'Phân tích dữ liệu và học máy', 'fas fa-chart-bar', 'khoa-hoc-du-lieu'),
                ('Marketing Số', 'Chiến lược marketing online', 'fas fa-bullhorn', 'marketing-so'),
                ('Thiết kế đồ họa', 'Thiết kế và xử lý hình ảnh chuyên nghiệp', 'fas fa-palette', 'thiet-ke-do-hoa'),
                ('Ngoại ngữ', 'Các khóa học ngoại ngữ', 'fas fa-language', 'ngoai-ngu'),
                ('Kinh doanh', 'Khởi nghiệp và phát triển doanh nghiệp', 'fas fa-briefcase', 'kinh-doanh'),
                ('Phát triển cá nhân', 'Kỹ năng mềm và phát triển bản thân', 'fas fa-user-graduate', 'phat-trien-ca-nhan')
            """)
            logger.info("Default categories inserted.")
            
            # Tạo bảng Courses với thêm CategoryID
            logger.info("Creating Courses table...")
            cursor.execute("""
                CREATE TABLE Courses (
                    CourseID INT IDENTITY(1,1) PRIMARY KEY,
                    Title NVARCHAR(200) NOT NULL,
                    Description NVARCHAR(MAX),
                    Price NVARCHAR(50),
                    ImageURL NVARCHAR(500),
                    CategoryID INT,
                    CreatorUserID INT NOT NULL,
                    Status NVARCHAR(20) DEFAULT 'draft',
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    UpdatedAt DATETIME DEFAULT GETDATE(),
                    FOREIGN KEY (CreatorUserID) REFERENCES Users(UserID) ON DELETE CASCADE,
                    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
                )
            """)
            logger.info("Courses table created.")

            # Tạo bảng Chapters
            logger.info("Creating Chapters table...")
            cursor.execute("""
                CREATE TABLE Chapters (
                    ChapterID INT IDENTITY(1,1) PRIMARY KEY,
                    CourseID INT NOT NULL,
                    Title NVARCHAR(200) NOT NULL,
                    Description NVARCHAR(MAX),
                    SortOrder INT DEFAULT 0,
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    UpdatedAt DATETIME DEFAULT GETDATE(),
                    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE
                )
            """)
            logger.info("Chapters table created.")
            
            # Tạo bảng Lessons
            logger.info("Creating Lessons table...")
            cursor.execute("""
                CREATE TABLE Lessons (
                    LessonID INT IDENTITY(1,1) PRIMARY KEY,
                    ChapterID INT NOT NULL,
                    Title NVARCHAR(200) NOT NULL,
                    Description NVARCHAR(MAX),
                    VideoURL NVARCHAR(500),
                    MediaFileName NVARCHAR(200),
                    AttachmentURL NVARCHAR(500),
                    AttachmentFileName NVARCHAR(200),
                    SortOrder INT DEFAULT 0,
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    UpdatedAt DATETIME DEFAULT GETDATE(),
                    FOREIGN KEY (ChapterID) REFERENCES Chapters(ChapterID) ON DELETE CASCADE
                )
            """)
            logger.info("Lessons table created.")
            
            # Bảng UserEnrollments không còn cần thiết
            conn.commit()
            logger.info("Database initialized successfully!")
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
        finally:
            conn.close()

init_database()


# Khởi tạo folder upload
init_upload_folder()

@app.route('/uploads/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory(os.path.join(UPLOAD_FOLDER, 'videos'), filename)

@app.route('/uploads/attachments/<path:filename>')
def serve_attachment(filename):
    return send_from_directory(os.path.join(UPLOAD_FOLDER, 'attachments'), filename)

@app.route('/api/lessons/upload', methods=['POST'])
def upload_files():
    try:
        video_file = request.files.get('video')
        attachment_file = request.files.get('attachment')
        response = {}

        if video_file:
            video_filename = save_uploaded_file(video_file, 'videos')
            if video_filename:
                response['videoUrl'] = f'/uploads/videos/{video_filename}'
                response['videoFileName'] = video_filename
                logger.info(f"Video file uploaded successfully: {video_filename}")

        if attachment_file:
            attachment_filename = save_uploaded_file(attachment_file, 'attachments')
            if attachment_filename:
                response['attachmentUrl'] = f'/uploads/attachments/{attachment_filename}'
                response['attachmentFileName'] = attachment_filename
                logger.info(f"Attachment file uploaded successfully: {attachment_filename}")

        if response:
            return jsonify({"success": True, "data": response}), 200
        else:
            return jsonify({"success": False, "error": "Không có file nào được upload thành công"}), 400

    except Exception as e:
        logger.error(f"Error uploading files: {e}")
        return jsonify({"error": str(e)}), 500

# --- Authentication Routes ---
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        # role = data.get('role') -- ĐÃ XÓA

        logger.debug(f"Received registration data: name={name}, email={email}")

        if not all([name, email, password]): # Bỏ role
            return jsonify({"error": "Vui lòng điền đủ thông tin (tên, email, mật khẩu)."}), 400

        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed during registration")
            return jsonify({"error": "Lỗi kết nối database."}), 500
        
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT UserID FROM Users WHERE Email = ?", email)
            if cursor.fetchone():
                return jsonify({"error": "Email này đã được sử dụng."}), 409

            logger.info("Inserting new user into database...")
            # Bỏ Role khỏi câu lệnh INSERT
            cursor.execute("""
                INSERT INTO Users (Name, Email, Password) 
                VALUES (?, ?, ?)
                """, (name, email, password))
            conn.commit()
            logger.info(f"User {email} registration successful")
            return jsonify({"message": f"Đăng ký thành công. Vui lòng đăng nhập."}), 201
        except pyodbc.Error as e:
            conn.rollback()
            logger.error(f"Database error during registration: {str(e)}")
            return jsonify({"error": f"Lỗi database: {str(e)}"}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        return jsonify({"error": f"Lỗi không mong đợi: {str(e)}"}), 500

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
    try:
        # Kiểm tra user
        cursor.execute("""
            SELECT UserID, Name, Email 
            FROM Users 
            WHERE Email = ? AND Password = ?
        """, email, password)
        user_row = cursor.fetchone()

        if user_row:
            # Lấy danh sách khóa học đã tạo
            cursor.execute("""
                SELECT CourseID
                FROM Courses
                WHERE CreatorUserID = ?
            """, user_row.UserID)
            created_courses = [row.CourseID for row in cursor.fetchall()]

            user_data = {
                "id": user_row.UserID,
                "name": user_row.Name,
                "email": user_row.Email,
                "createdCourseIds": created_courses,
                "enrolledCourseIds": [],  # Sẽ cập nhật sau khi có bảng Enrollments
                "wishlist": []  # Sẽ cập nhật sau khi có bảng Wishlist
            }
            return jsonify({"message": "Đăng nhập thành công", "user": user_data}), 200
        else:
            return jsonify({"error": "Email hoặc mật khẩu không đúng."}), 401
    except pyodbc.Error as e:
        logger.error(f"DB Error on login: {e}")
        return jsonify({"error": "Lỗi server khi đăng nhập."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Serve static files
@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

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
        params.extend([f'%{search_term}%', f'%{search_term}%', f'%{search_term}%'])
    
    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)
    
    base_query += " ORDER BY c.CreatedAt DESC"

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
                "instructor": row.InstructorName, # Giữ lại tên người tạo
                "creatorEmail": row.CreatorEmail,
                "price": row.Price,
                "image": row.ImageURL,
                "description": row.Description,
                "creatorUserID": row.CreatorUserID
            })
        return jsonify(courses), 200
    except pyodbc.Error as e:
        logger.error(f"DB Error on get_courses: {e}")
        return jsonify({"error": "Lỗi server khi lấy danh sách khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT c.CourseID, c.Title, c.Description, c.Price, c.ImageURL, c.CreatorUserID,
                   u.Name as InstructorName, u.Email as CreatorEmail
            FROM Courses c
            JOIN Users u ON c.CreatorUserID = u.UserID
            WHERE c.CourseID = ?
        """, course_id)
        course_row = cursor.fetchone()
        
        if not course_row:
            return jsonify({"error": "Không tìm thấy khóa học."}), 404

        course_detail = {
            "id": course_row.CourseID,
            "title": course_row.Title,
            "description": course_row.Description,
            "price": course_row.Price,
            "image": course_row.ImageURL,
            "instructor": course_row.InstructorName,
            "creatorEmail": course_row.CreatorEmail,
            "creatorUserID": course_row.CreatorUserID,
            "files": [],
            "structure": []
        }

        # Get chapters
        cursor.execute("""
            SELECT ChapterID, Title, Description, SortOrder 
            FROM Chapters 
            WHERE CourseID = ? 
            ORDER BY SortOrder, ChapterID
        """, course_id)
        chapters = cursor.fetchall()

        # For each chapter, get its lessons
        for chapter in chapters:
            chapter_data = {
                "id": chapter.ChapterID,
                "title": chapter.Title,
                "description": chapter.Description,
                "lessons": []
            }

            cursor.execute("""
                SELECT LessonID, Title, Description, VideoURL, MediaFileName, 
                       AttachmentURL, AttachmentFileName, SortOrder
                FROM Lessons 
                WHERE ChapterID = ? 
                ORDER BY SortOrder, LessonID
            """, chapter.ChapterID)
            lessons = cursor.fetchall()

            for lesson in lessons:
                lesson_data = {
                    "id": lesson.LessonID,
                    "title": lesson.Title,
                    "description": lesson.Description,
                    "content": {
                        "mediaUrl": f"/uploads/videos/{lesson.MediaFileName}" if lesson.MediaFileName else lesson.VideoURL,
                        "mediaFileName": lesson.MediaFileName,
                        "attachmentUrl": f"/uploads/attachments/{lesson.AttachmentFileName}" if lesson.AttachmentFileName else lesson.AttachmentURL,
                        "attachmentFileName": lesson.AttachmentFileName
                    }
                }
                chapter_data["lessons"].append(lesson_data)

            course_detail["structure"].append(chapter_data)

        return jsonify({"success": True, "data": course_detail}), 200

    except Exception as e:
        logger.error(f"Error getting course detail: {str(e)}")
        return jsonify({"error": "Lỗi khi lấy thông tin khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    creator_user_id = data.get('creatorUserID')
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    image_url = data.get('image')

    if not all([creator_user_id, title, description]):
        return jsonify({"error": "Thiếu thông tin cần thiết (creatorUserID, title, description)."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        # Không cần kiểm tra Role nữa
        # cursor.execute("SELECT Role FROM Users WHERE UserID = ?", creator_user_id)
        # user_role_row = cursor.fetchone()
        # if not user_role_row or user_role_row.Role != 'Giảng viên':
        #     return jsonify({"error": "Chỉ Giảng viên mới có thể tạo khóa học."}), 403
        cursor.execute("SELECT UserID FROM Users WHERE UserID = ?", creator_user_id)
        if not cursor.fetchone():
            return jsonify({"error": "Người tạo không tồn tại."}), 404


        cursor.execute("""
            INSERT INTO Courses (Title, Description, Price, ImageURL, CreatorUserID)
            OUTPUT INSERTED.CourseID, INSERTED.Title, INSERTED.Description, INSERTED.Price, INSERTED.ImageURL, INSERTED.CreatorUserID
            VALUES (?, ?, ?, ?, ?);
        """, title, description, price, image_url, creator_user_id)
        
        new_course_row = cursor.fetchone()
        conn.commit()

        if new_course_row:
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
                    "instructor": instructor_name_for_response,
                    "creatorUserID": new_course_row.CreatorUserID,
                    "structure": [],
                    "files": []
                }
            }), 201
        else:
            conn.rollback()
            return jsonify({"error": "Không thể tạo khóa học."}), 500

    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on create_course: {e}")
        return jsonify({"error": "Lỗi server khi tạo khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.get_json()
    current_user_id = data.get('currentUserID')
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
        
        if cursor.rowcount == 0:
             return jsonify({"message": "Không có thay đổi nào được thực hiện hoặc không tìm thấy khóa học."}), 200

        return jsonify({"message": "Khóa học đã được cập nhật thành công."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on update_course: {e}")
        return jsonify({"error": "Lỗi server khi cập nhật khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course_by_id(course_id):
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

        cursor.execute("DELETE FROM Courses WHERE CourseID = ?", course_id)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Không tìm thấy khóa học để xóa."}), 404
        
        return jsonify({"message": "Khóa học đã được xóa thành công."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on delete_course: {e}")
        return jsonify({"error": "Lỗi server khi xóa khóa học."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- Chapter Routes (Tương tự, chỉ kiểm tra CreatorUserID của Course) ---
@app.route('/api/courses/<int:course_id>/chapters', methods=['POST'])
def add_chapter_to_course(course_id):
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
        logger.error(f"DB Error on add_chapter: {e}")
        return jsonify({"error": "Lỗi server khi thêm chương."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/chapters/<int:chapter_id>', methods=['PUT'])
def update_chapter_by_id(chapter_id):
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
            UPDATE Chapters SET Title = ?, Description = ?, UpdatedAt = GETDATE() WHERE ChapterID = ?
        """, title, description, chapter_id)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Không có thay đổi hoặc không tìm thấy chương."}), 200
        return jsonify({"message": "Chương đã được cập nhật."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on update_chapter: {e}")
        return jsonify({"error": "Lỗi server khi cập nhật chương."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/chapters/<int:chapter_id>', methods=['DELETE'])
def delete_chapter_by_id(chapter_id):
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

        cursor.execute("DELETE FROM Chapters WHERE ChapterID = ?", chapter_id)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Không tìm thấy chương để xóa."}), 404
        return jsonify({"message": "Chương đã được xóa."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on delete_chapter: {e}")
        return jsonify({"error": "Lỗi server khi xóa chương."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- Lesson Routes (Tương tự) ---
@app.route('/api/chapters/<int:chapter_id>/lessons', methods=['POST'])
def add_lesson_to_chapter_by_id(chapter_id):
    data = request.get_json()
    current_user_id = data.get('currentUserID')
    title = data.get('title')
    description = data.get('description', '')
    content = data.get('content', {})
    
    # Extract media and attachment info from content
    video_url = content.get('mediaUrl', '')
    media_file_name = content.get('mediaFileName', '')
    attachment_url = content.get('attachmentUrl', '')
    attachment_file_name = content.get('attachmentFileName', '')

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
                "message": "Bài giảng mới đã được thêm.",                "lesson": {
                    "id": new_lesson_row.LessonID,
                    "title": new_lesson_row.Title,
                    "description": new_lesson_row.Description,
                    "content": {
                        "mediaUrl": f"/uploads/videos/{new_lesson_row.MediaFileName}" if new_lesson_row.MediaFileName else new_lesson_row.VideoURL,
                        "mediaFileName": new_lesson_row.MediaFileName,
                        "attachmentUrl": f"/uploads/attachments/{new_lesson_row.AttachmentFileName}" if new_lesson_row.AttachmentFileName else new_lesson_row.AttachmentURL,
                        "attachmentFileName": new_lesson_row.AttachmentFileName
                    }
                }
            }), 201
        else:
            conn.rollback()
            return jsonify({"error": "Không thể thêm bài giảng."}), 500
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on add_lesson: {e}")
        return jsonify({"error": "Lỗi server khi thêm bài giảng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/lessons/<int:lesson_id>', methods=['PUT'])
def update_lesson_by_id(lesson_id):
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
            SET Title = ?, Description = ?, VideoURL = ?, MediaFileName = ?, AttachmentURL = ?, AttachmentFileName = ?, UpdatedAt = GETDATE()
            WHERE LessonID = ?;
        """, title, description, video_url, media_file_name, attachment_url, attachment_file_name, lesson_id)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Không có thay đổi hoặc không tìm thấy bài giảng."}), 200
        return jsonify({"message": "Bài giảng đã được cập nhật."}), 200
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"DB Error on update_lesson: {e}")
        return jsonify({"error": "Lỗi server khi cập nhật bài giảng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/lessons/<int:lesson_id>', methods=['DELETE'])
def delete_lesson_by_id(lesson_id):
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
        logger.error(f"DB Error on delete_lesson: {e}")
        return jsonify({"error": "Lỗi server khi xóa bài giảng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- User Specific Routes ---
@app.route('/api/users/<int:user_id>/courses', methods=['GET'])
def get_user_courses_by_id(user_id): # Bây giờ chỉ trả về các khóa học do người dùng tạo
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT UserID FROM Users WHERE UserID = ?", user_id)
        if not cursor.fetchone():
            return jsonify({"error": "Người dùng không tồn tại."}), 404
        
        courses_list = []
        # Chỉ lấy các khóa học do người dùng này tạo
        cursor.execute("""
            SELECT c.CourseID, c.Title, c.Price, c.ImageURL, u_creator.Name AS InstructorName, c.Description
            FROM Courses c
            JOIN Users u_creator ON c.CreatorUserID = u_creator.UserID
            WHERE c.CreatorUserID = ?
            ORDER BY c.CreatedAt DESC
        """, user_id)
        
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
        logger.error(f"DB Error on get_user_courses (created by user): {e}")
        return jsonify({"error": "Lỗi server khi lấy khóa học của người dùng."}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Initialize storage for courses and enrollments
courses_data = []
enrolled_courses_by_user = {}

# User course management routes
@app.route('/api/users/<user_id>/courses', methods=['GET'])
def get_user_courses(user_id):
    try:
        # Get all courses where the user is the creator
        user_courses = [course for course in courses_data if course.get('creatorUserID') == user_id]
        return jsonify(user_courses)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<user_id>/enrolled-courses', methods=['GET'])
def get_user_enrolled_courses(user_id):
    try:
        # Get all courses that the user is enrolled in
        enrolled_courses = enrolled_courses_by_user.get(user_id, [])
        enrolled_course_details = [course for course in courses_data if course.get('id') in enrolled_courses]
        return jsonify(enrolled_course_details)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses/<course_id>/enroll', methods=['POST'])
def enroll_in_course():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        course_id = request.view_args.get('course_id')
        
        if not user_id or not course_id:
            return jsonify({'error': 'Missing user ID or course ID'}), 400

        # Initialize the enrolled courses list for this user if it doesn't exist
        if user_id not in enrolled_courses_by_user:
            enrolled_courses_by_user[user_id] = []

        # Check if user is already enrolled
        if course_id in enrolled_courses_by_user[user_id]:
            return jsonify({'error': 'User is already enrolled in this course'}), 400

        # Add the course to user's enrolled courses
        enrolled_courses_by_user[user_id].append(course_id)
        
        return jsonify({'message': 'Successfully enrolled in course'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize enrolled courses storage
enrolled_courses_by_user = {}

# --- Categories API Routes ---
@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Lỗi kết nối server."}), 500
    
    cursor = conn.cursor()
    try:
        # Kiểm tra xem bảng Categories đã tồn tại chưa
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
            CREATE TABLE Categories (
                CategoryID INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(100) NOT NULL,
                Description NVARCHAR(500),
                IconClass NVARCHAR(50),
                Slug NVARCHAR(100),
                CreatedAt DATETIME DEFAULT GETDATE()
            )
        """)
        
        # Kiểm tra xem đã có dữ liệu chưa
        cursor.execute("SELECT COUNT(*) as count FROM Categories")
        count = cursor.fetchone().count

        # Nếu chưa có dữ liệu, thêm các danh mục mặc định
        if count == 0:
            default_categories = [
                ("Lập trình Web", "Học phát triển web từ cơ bản đến nâng cao", "fas fa-code", "lap-trinh-web"),
                ("Lập trình Mobile", "Phát triển ứng dụng di động đa nền tảng", "fas fa-mobile-alt", "lap-trinh-mobile"),
                ("Khoa học Dữ liệu", "Phân tích dữ liệu và học máy", "fas fa-chart-bar", "khoa-hoc-du-lieu"),
                ("Marketing Số", "Chiến lược marketing online", "fas fa-bullhorn", "marketing-so"),
                ("Thiết kế đồ họa", "Thiết kế và xử lý hình ảnh chuyên nghiệp", "fas fa-palette", "thiet-ke-do-hoa"),
                ("Ngoại ngữ", "Các khóa học ngoại ngữ", "fas fa-language", "ngoai-ngu"),
                ("Kinh doanh", "Khởi nghiệp và phát triển doanh nghiệp", "fas fa-briefcase", "kinh-doanh"),
                ("Phát triển cá nhân", "Kỹ năng mềm và phát triển bản thân", "fas fa-user-graduate", "phat-trien-ca-nhan")
            ]
            
            cursor.executemany("""
                INSERT INTO Categories (Name, Description, IconClass, Slug)
                VALUES (?, ?, ?, ?)
            """, default_categories)
            conn.commit()

        # Lấy tất cả danh mục
        cursor.execute("""
            SELECT CategoryID, Name, Description, IconClass, Slug
            FROM Categories
            ORDER BY Name
        """)
        
        categories = []
        for row in cursor.fetchall():
            categories.append({
                "id": row.CategoryID,
                "name": row.Name,
                "description": row.Description,
                "iconClass": row.IconClass,
                "slug": row.Slug
            })
            
        return jsonify(categories), 200

    except Exception as e:
        logger.error(f"Error in get_categories: {str(e)}")
        return jsonify({"error": f"Lỗi server: {str(e)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()
        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)