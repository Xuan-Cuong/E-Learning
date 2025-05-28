# backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pyodbc
import datetime # Required for GETDATE() equivalent or manual timestamping
import os
import logging

from db_config import get_db_connection
from uploads import init_upload_folder, save_uploaded_file, UPLOAD_FOLDER #, VIDEO_FOLDER, ATTACHMENT_FOLDER, IMAGE_FOLDER (not directly used here)

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] - %(module)s:%(lineno)d - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

init_upload_folder()

def execute_db_query(query, params=None, fetch_one=False, fetch_all=False, commit=False, get_rowcount=False, cursor_obj=None):
    """Helper function to execute database queries.
       Can use an existing cursor or create a new connection.
    """
    conn = None
    internal_cursor = False
    if cursor_obj is None:
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed.")
            return None, "Database connection error"
        cursor_obj = conn.cursor()
        internal_cursor = True

    try:
        if params:
            cursor_obj.execute(query, params)
        else:
            cursor_obj.execute(query)

        result = None
        if fetch_one:
            result = cursor_obj.fetchone()
        elif fetch_all:
            result = cursor_obj.fetchall()

        if get_rowcount:
            result = cursor_obj.rowcount

        if commit and conn: # Only commit if we created the connection here
            conn.commit()

        return result, None # Data, No error
    except pyodbc.Error as e:
        if commit and conn:
            conn.rollback()
        logger.error(f"Database query error: {e}. Query: {query}, Params: {params}")
        return None, str(e)
    finally:
        if internal_cursor: # Only close if we created them here
            if cursor_obj:
                cursor_obj.close()
            if conn:
                conn.close()

def init_database():
    logger.info("Initializing database schema...")

    all_possible_tables_to_drop = [
        "dbo.Reviews",
        "dbo.UserWishlist",
        "dbo.UserEnrollments",
        "dbo.Lessons",
        "dbo.Chapters",
        "dbo.Courses",
        "dbo.Categories",
        "dbo.Users",
    ]

    create_statements = [
        """
        CREATE TABLE Users (
            UserID INT IDENTITY(1,1) PRIMARY KEY,
            Name NVARCHAR(100) NOT NULL,
            Email NVARCHAR(100) NOT NULL UNIQUE,
            Password NVARCHAR(255) NOT NULL,
            AvatarURL NVARCHAR(500),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
        """,
        """
        CREATE TABLE Categories (
            CategoryID INT IDENTITY(1,1) PRIMARY KEY,
            Name NVARCHAR(100) NOT NULL UNIQUE,
            Description NVARCHAR(500),
            IconClass NVARCHAR(50) DEFAULT 'fas fa-shapes',
            Slug NVARCHAR(100) UNIQUE,
            CreatedAt DATETIME DEFAULT GETDATE()
        );
        """,
        """
        CREATE TABLE Courses (
            CourseID INT IDENTITY(1,1) PRIMARY KEY,
            Title NVARCHAR(200) NOT NULL,
            ShortDescription NVARCHAR(500),
            Description NVARCHAR(MAX),
            Price FLOAT DEFAULT 0,
            OriginalPrice FLOAT,
            ImageURL NVARCHAR(500),
            BannerImageURL NVARCHAR(500),
            PromoVideoURL NVARCHAR(500),
            WhatYouWillLearn NVARCHAR(MAX),
            Requirements NVARCHAR(MAX),
            CategoryID INT,
            CreatorUserID INT NOT NULL,
            Difficulty NVARCHAR(50) DEFAULT 'beginner',
            Language NVARCHAR(50) DEFAULT 'Tiếng Việt',
            Status NVARCHAR(20) DEFAULT 'draft',
            AverageRating FLOAT DEFAULT 0,
            ReviewsCount INT DEFAULT 0,
            EnrollmentsCount INT DEFAULT 0,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (CreatorUserID) REFERENCES Users(UserID) ON DELETE CASCADE,
            FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE SET NULL
        );
        """,
        """
        CREATE TABLE Chapters (
            ChapterID INT IDENTITY(1,1) PRIMARY KEY,
            CourseID INT NOT NULL,
            Title NVARCHAR(200) NOT NULL,
            Description NVARCHAR(MAX),
            SortOrder INT DEFAULT 0,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE
        );
        """,
        """
        CREATE TABLE Lessons (
            LessonID INT IDENTITY(1,1) PRIMARY KEY,
            ChapterID INT NOT NULL,
            Title NVARCHAR(200) NOT NULL,
            Type NVARCHAR(20) NOT NULL DEFAULT 'video',
            ContentURL NVARCHAR(MAX),
            ContentText NVARCHAR(MAX),
            MediaFileName NVARCHAR(255),
            DurationMinutes INT,
            IsPreviewable BIT DEFAULT 0,
            SortOrder INT DEFAULT 0,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (ChapterID) REFERENCES Chapters(ChapterID) ON DELETE CASCADE
        );
        """,
        """
        CREATE TABLE UserEnrollments (
            EnrollmentID INT IDENTITY(1,1) PRIMARY KEY,
            UserID INT NOT NULL,
            CourseID INT NOT NULL,
            EnrolledAt DATETIME DEFAULT GETDATE(),
            Progress INT DEFAULT 0,
            CompletedAt DATETIME,
            FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
            FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE NO ACTION,
            UNIQUE (UserID, CourseID)
        );
        """,
        """
        CREATE TABLE UserWishlist (
            WishlistID INT IDENTITY(1,1) PRIMARY KEY,
            UserID INT NOT NULL,
            CourseID INT NOT NULL,
            AddedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
            FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE NO ACTION,
            UNIQUE (UserID, CourseID)
        );
        """,
        """
        CREATE TABLE Reviews (
            ReviewID INT IDENTITY(1,1) PRIMARY KEY,
            CourseID INT NOT NULL,
            UserID INT NOT NULL,
            Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
            Comment NVARCHAR(MAX),
            CreatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE,
            FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE NO ACTION
        );
        """
    ]
    
    # Seed data statements (only for categories, others are in the SQL script)
    # You can expand this to include other seed data if you prefer it here.
    seed_statements = [
        """
        INSERT INTO Categories (Name, Description, IconClass, Slug) VALUES
        ('Lập trình Web', 'Học phát triển web từ cơ bản đến nâng cao', 'fas fa-code', 'lap-trinh-web'),
        ('Lập trình Mobile', 'Phát triển ứng dụng di động đa nền tảng', 'fas fa-mobile-alt', 'lap-trinh-mobile'),
        ('Khoa học Dữ liệu', 'Phân tích dữ liệu và học máy', 'fas fa-chart-bar', 'khoa-hoc-du-lieu'),
        ('Marketing Số', 'Chiến lược marketing online', 'fas fa-bullhorn', 'marketing-so'),
        ('Thiết kế đồ họa', 'Thiết kế và xử lý hình ảnh chuyên nghiệp', 'fas fa-palette', 'thiet-ke-do-hoa'),
        ('Ngoại ngữ', 'Các khóa học ngoại ngữ', 'fas fa-language', 'ngoai-ngu'),
        ('Kinh doanh', 'Khởi nghiệp và phát triển doanh nghiệp', 'fas fa-briefcase', 'kinh-doanh'),
        ('Phát triển cá nhân', 'Kỹ năng mềm và phát triển bản thân', 'fas fa-user-graduate', 'phat-trien-ca-nhan');
        """
        # You would add INSERTs for Users, Courses, etc. here if you want app.py to handle all seeding.
        # For now, I'm assuming the provided SQL script handles most seeding.
    ]


    conn = get_db_connection()
    if not conn:
        logger.error("Failed to connect to database for schema initialization.")
        return

    cursor = conn.cursor()
    failed_stmt_log = ""
    try:
        logger.info("Dropping existing tables (if they exist)...")
        for table_name_with_schema in all_possible_tables_to_drop:
            parts = table_name_with_schema.split('.')
            table_name = parts[-1]
            schema_name = parts[0] if len(parts) > 1 else 'dbo'
            drop_sql = f"IF OBJECT_ID('{schema_name}.{table_name}', 'U') IS NOT NULL DROP TABLE {schema_name}.{table_name}"
            try:
                logger.debug(f"Executing drop: {drop_sql}")
                cursor.execute(drop_sql)
                conn.commit()
            except pyodbc.Error as e:
                logger.warning(f"Warning dropping table {schema_name}.{table_name}: {e}")
                conn.rollback()

        logger.info("Creating new tables...")
        for stmt in create_statements:
            failed_stmt_log = stmt[:200] # Store current stmt for error logging
            logger.debug(f"Executing create: {stmt[:100]}...")
            cursor.execute(stmt)
        
        logger.info("Inserting seed data for categories...")
        for stmt in seed_statements:
            failed_stmt_log = stmt[:200]
            logger.debug(f"Executing seed: {stmt[:100]}...")
            cursor.execute(stmt)

        conn.commit()
        logger.info("Database schema and category seed data initialized successfully!")
    except pyodbc.Error as e:
        conn.rollback()
        logger.error(f"Error initializing database: {e}")
        logger.error(f"Failed statement (approx): {failed_stmt_log}")
    finally:
        cursor.close()
        conn.close()


@app.before_request
def log_request_info():
    if request.path.startswith('/api/'):
        logger.debug(f"Request: {request.method} {request.url}")
        logger.debug(f"Headers: {request.headers}")
        if request.data:
            try:
                logger.debug(f"Body (JSON): {request.get_json()}")
            except:
                logger.debug(f"Body (Raw): {request.get_data(as_text=True)}")

@app.route('/uploads/<path:subfolder>/<path:filename>')
def serve_uploaded_file(subfolder, filename):
    valid_subfolders = ['videos', 'attachments', 'images']
    if subfolder not in valid_subfolders:
        return jsonify({"error": "Invalid file path"}), 400
    directory = os.path.join(UPLOAD_FOLDER, subfolder)
    return send_from_directory(directory, filename)

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"success": False, "error": "Vui lòng điền đủ thông tin."}), 400
    if len(password) < 6:
        return jsonify({"success": False, "error": "Mật khẩu phải có ít nhất 6 ký tự."}), 400

    existing_user, err = execute_db_query("SELECT UserID FROM Users WHERE Email = ?", (email,), fetch_one=True)
    if err: return jsonify({"success": False, "error": f"Lỗi database: {err}"}), 500
    if existing_user:
        return jsonify({"success": False, "error": "Email này đã được sử dụng."}), 409

    _, err = execute_db_query("INSERT INTO Users (Name, Email, Password, CreatedAt, UpdatedAt) VALUES (?, ?, ?, GETDATE(), GETDATE())",
                              (name, email, password), commit=True) # Password should be hashed
    if err:
        return jsonify({"success": False, "error": f"Lỗi đăng ký: {err}"}), 500
    return jsonify({"success": True, "message": "Đăng ký thành công! Vui lòng đăng nhập."}), 201

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "error": "Vui lòng nhập đủ email và mật khẩu."}), 400

    user_row, err = execute_db_query(
        "SELECT UserID, Name, Email, AvatarURL FROM Users WHERE Email = ? AND Password = ?",
        (email, password), fetch_one=True # Password comparison should be hashed
    )
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500

    if user_row:
        created_courses_rows, _ = execute_db_query(
            "SELECT CourseID FROM Courses WHERE CreatorUserID = ?", (user_row.UserID,), fetch_all=True
        )
        created_course_ids = [row.CourseID for row in created_courses_rows] if created_courses_rows else []

        enrolled_courses_rows, _ = execute_db_query(
            "SELECT CourseID FROM UserEnrollments WHERE UserID = ?", (user_row.UserID,), fetch_all=True
        )
        enrolled_course_ids = [row.CourseID for row in enrolled_courses_rows] if enrolled_courses_rows else []
        
        wishlist_rows, _ = execute_db_query(
            "SELECT CourseID FROM UserWishlist WHERE UserID = ?", (user_row.UserID,), fetch_all=True
        )
        wishlist_ids = [row.CourseID for row in wishlist_rows] if wishlist_rows else []

        user_data = {
            "id": user_row.UserID, "name": user_row.Name, "email": user_row.Email,
            "avatarUrl": user_row.AvatarURL, "createdCourseIds": created_course_ids,
            "enrolledCourseIds": enrolled_course_ids, "wishlist": wishlist_ids
        }
        return jsonify({"success": True, "message": "Đăng nhập thành công", "user": user_data}), 200
    else:
        return jsonify({"success": False, "error": "Email hoặc mật khẩu không đúng."}), 401

@app.route('/api/users/profile', methods=['PUT'])
def update_user_profile():
    data = request.get_json()
    user_id = data.get('userId')
    name = data.get('name')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not user_id: return jsonify({"success": False, "error": "UserID là bắt buộc."}), 400
    if not name: return jsonify({"success": False, "error": "Tên là bắt buộc."}), 400

    user, err = execute_db_query("SELECT Password FROM Users WHERE UserID = ?", (user_id,), fetch_one=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    if not user: return jsonify({"success": False, "error": "Người dùng không tồn tại."}), 404

    update_fields = ["Name = ?", "UpdatedAt = GETDATE()"]
    params = [name]

    if new_password:
        if not current_password:
            return jsonify({"success": False, "error": "Mật khẩu hiện tại là bắt buộc."}), 400
        if user.Password != current_password: # Should compare hashed passwords
            return jsonify({"success": False, "error": "Mật khẩu hiện tại không đúng."}), 400
        if len(new_password) < 6:
            return jsonify({"success": False, "error": "Mật khẩu mới phải có ít nhất 6 ký tự."}), 400
        update_fields.insert(1, "Password = ?") # Insert before UpdatedAt
        params.insert(1, new_password) # Password should be hashed
    
    params.append(user_id) # For WHERE clause
    query = f"UPDATE Users SET {', '.join(update_fields)} WHERE UserID = ?"

    _, err = execute_db_query(query, tuple(params), commit=True)
    if err: return jsonify({"success": False, "error": f"Lỗi cập nhật: {err}"}), 500
    return jsonify({"success": True, "message": "Thông tin tài khoản đã được cập nhật."}), 200

@app.route('/api/courses', methods=['GET'])
def get_courses_list():
    search_term = request.args.get('search', '')
    category_id_str = request.args.get('category', '')
    difficulty = request.args.get('difficulty', '')
    sort_by = request.args.get('sortBy', 'newest')
    limit_str = request.args.get('limit', '')

    query_parts = ["""
        SELECT c.CourseID, c.Title, c.ShortDescription, c.Price, c.OriginalPrice, c.ImageURL, 
               c.Difficulty, c.AverageRating, c.EnrollmentsCount,
               u.Name AS InstructorName, cat.Name AS CategoryName, cat.CategoryID
        FROM Courses c
        JOIN Users u ON c.CreatorUserID = u.UserID
        LEFT JOIN Categories cat ON c.CategoryID = cat.CategoryID
    """]
    conditions = ["c.Status = 'published'"]
    params = []

    if search_term:
        conditions.append("(c.Title LIKE ? OR c.Description LIKE ? OR u.Name LIKE ?)")
        term_like = f"%{search_term}%"
        params.extend([term_like, term_like, term_like])
    if category_id_str:
        try:
            category_id = int(category_id_str)
            conditions.append("c.CategoryID = ?")
            params.append(category_id)
        except ValueError:
            logger.warning(f"Invalid category ID received: {category_id_str}") # Log and ignore
    if difficulty:
        conditions.append("c.Difficulty = ?")
        params.append(difficulty)

    if conditions:
        query_parts.append("WHERE " + " AND ".join(conditions))
    
    order_by_clause = "ORDER BY c.CreatedAt DESC" # Default
    if sort_by == 'popular': order_by_clause = "ORDER BY c.EnrollmentsCount DESC, c.AverageRating DESC"
    elif sort_by == 'rating': order_by_clause = "ORDER BY c.AverageRating DESC, c.ReviewsCount DESC"
    query_parts.append(order_by_clause)

    final_query = " ".join(query_parts)
    if limit_str:
        try:
            limit = int(limit_str)
            final_query = final_query.replace("SELECT", f"SELECT TOP ({limit})", 1)
        except ValueError:
            logger.warning(f"Invalid limit value received: {limit_str}")


    course_rows, err = execute_db_query(final_query, tuple(params), fetch_all=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500

    courses_list = []
    if course_rows:
        for row in course_rows:
            courses_list.append({
                "id": row.CourseID, "title": row.Title, "short_description": row.ShortDescription,
                "price": row.Price, "original_price": row.OriginalPrice, "image_url": row.ImageURL,
                "instructor_name": row.InstructorName, "category_name": row.CategoryName,
                "category_id": row.CategoryID, "difficulty": row.Difficulty,
                "average_rating": row.AverageRating, "enrollments_count": row.EnrollmentsCount
            })
    return jsonify({"success": True, "data": courses_list}), 200

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    course_query = """
        SELECT c.*, u.Name AS InstructorName, u.Email AS InstructorEmail, u.AvatarURL AS InstructorAvatarURL,
               cat.Name AS CategoryName
        FROM Courses c
        JOIN Users u ON c.CreatorUserID = u.UserID
        LEFT JOIN Categories cat ON c.CategoryID = cat.CategoryID
        WHERE c.CourseID = ?
    """
    course_row, err = execute_db_query(course_query, (course_id,), fetch_one=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    if not course_row: return jsonify({"success": False, "error": "Không tìm thấy khóa học."}), 404

    # Fetch reviews for the course
    reviews_query = """
        SELECT r.Rating, r.Comment, r.CreatedAt, u.Name as UserName
        FROM Reviews r
        JOIN Users u ON r.UserID = u.UserID
        WHERE r.CourseID = ?
        ORDER BY r.CreatedAt DESC
    """
    review_rows, err_rev = execute_db_query(reviews_query, (course_id,), fetch_all=True)
    reviews_list = []
    if not err_rev and review_rows:
        for rev_row in review_rows:
            reviews_list.append({
                "user_name": rev_row.UserName,
                "rating": rev_row.Rating,
                "comment": rev_row.Comment,
                "created_at": rev_row.CreatedAt.isoformat() if rev_row.CreatedAt else None
            })

    course_data = {
        "id": course_row.CourseID, "title": course_row.Title, "shortDescription": course_row.ShortDescription,
        "description": course_row.Description, "price": course_row.Price, "originalPrice": course_row.OriginalPrice,
        "image": course_row.ImageURL, "bannerImage": course_row.BannerImageURL,
        "promoVideoUrl": course_row.PromoVideoURL,
        "whatYouWillLearn": course_row.WhatYouWillLearn.split(';') if course_row.WhatYouWillLearn else [],
        "requirements": course_row.Requirements.split(';') if course_row.Requirements else [],
        "category_id": course_row.CategoryID, "category_name": course_row.CategoryName,
        "creatorUserID": course_row.CreatorUserID,
        "instructorName": course_row.InstructorName, # Kept for simple display if needed
        "instructor": {
            "name": course_row.InstructorName,
            "email": course_row.InstructorEmail,
            "avatar_url": course_row.InstructorAvatarURL,
            "title": "Chuyên gia đào tạo", # Placeholder, consider adding to Users table
            "bio": "Thông tin giảng viên..." # Placeholder, consider adding to Users table
        },
        "difficulty": course_row.Difficulty, "language": course_row.Language, "status": course_row.Status,
        "rating": course_row.AverageRating, "reviewsCount": course_row.ReviewsCount, "enrollments": course_row.EnrollmentsCount,
        "chapters": [],
        "reviews": reviews_list
    }

    chapters_query = "SELECT * FROM Chapters WHERE CourseID = ? ORDER BY SortOrder"
    chapter_rows, err_ch = execute_db_query(chapters_query, (course_id,), fetch_all=True)
    if err_ch: return jsonify({"success": False, "error": f"Lỗi lấy chương: {err_ch}"}), 500

    if chapter_rows:
        for ch_row in chapter_rows:
            chapter_data = {
                "id": ch_row.ChapterID, "title": ch_row.Title, "description": ch_row.Description,
                "sort_order": ch_row.SortOrder, "lessons": []
            }
            lessons_query = "SELECT * FROM Lessons WHERE ChapterID = ? ORDER BY SortOrder"
            lesson_rows, err_ls = execute_db_query(lessons_query, (ch_row.ChapterID,), fetch_all=True)
            if err_ls: return jsonify({"success": False, "error": f"Lỗi lấy bài giảng: {err_ls}"}), 500

            if lesson_rows:
                for ls_row in lesson_rows:
                    lesson_content_url = ls_row.ContentURL # Use directly if it's an external URL
                    if ls_row.MediaFileName: # If it's an uploaded file, construct server path
                         media_subfolder = 'videos' # Default
                         if ls_row.Type == 'document': media_subfolder = 'attachments'
                         elif ls_row.Type == 'audio': media_subfolder = 'videos' # Or specific audio folder
                         # The URL should be relative to the domain, served by /uploads/
                         lesson_content_url = f"/uploads/{media_subfolder}/{ls_row.MediaFileName}"

                    chapter_data["lessons"].append({
                        "id": ls_row.LessonID, "title": ls_row.Title, "type": ls_row.Type,
                        "content_url": lesson_content_url,
                        "content_text": ls_row.ContentText,
                        "media_file_name": ls_row.MediaFileName, # Frontend might need this
                        "duration_minutes": ls_row.DurationMinutes,
                        "is_previewable": bool(ls_row.IsPreviewable),
                        "sort_order": ls_row.SortOrder
                    })
            course_data["chapters"].append(chapter_data)
    return jsonify({"success": True, "data": course_data}), 200

@app.route('/api/courses', methods=['POST'])
def create_course_with_structure():
    data = request.get_json()
    required_fields = ['title', 'category_id', 'creator_user_id', 'price', 'status'] # Simplified for brevity
    for field in required_fields:
        if field not in data or (isinstance(data[field], str) and not data[field].strip() and data.get(field) is not None):
            if field == 'price' and data.get(field) == 0: continue
            return jsonify({"success": False, "error": f"Thiếu thông tin bắt buộc: {field}"}), 400

    creator_user_id = data.get('creator_user_id')
    user, err = execute_db_query("SELECT UserID FROM Users WHERE UserID = ?", (creator_user_id,), fetch_one=True)
    if err or not user: return jsonify({"success": False, "error": "Người tạo không hợp lệ."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"success": False, "error": "Lỗi kết nối database."}), 500
    cursor = conn.cursor()

    try:
        course_query = """
            INSERT INTO Courses (Title, ShortDescription, Description, Price, OriginalPrice, ImageURL, BannerImageURL,
                                 PromoVideoURL, WhatYouWillLearn, Requirements, CategoryID, CreatorUserID,
                                 Difficulty, Language, Status, CreatedAt, UpdatedAt)
            OUTPUT INSERTED.CourseID
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
        """
        course_params = (
            data.get('title'), data.get('short_description'), data.get('description'), float(data.get('price', 0)),
            data.get('original_price') if data.get('original_price') is not None else None,
            data.get('image_url'), data.get('banner_image_url'), data.get('promo_video_url'),
            ";".join(data.get('whatYouWillLearn', [])), ";".join(data.get('requirements', [])),
            int(data.get('category_id')) if data.get('category_id') else None,
            int(creator_user_id), data.get('difficulty', 'beginner'),
            data.get('language', 'Tiếng Việt'), data.get('status', 'draft')
        )
        cursor.execute(course_query, course_params)
        course_id_row = cursor.fetchone()
        if not course_id_row: raise Exception("Không thể tạo khóa học - không có CourseID trả về.")
        new_course_id = course_id_row.CourseID

        chapters_data = data.get('chapters', [])
        for chapter_idx, chap_data in enumerate(chapters_data):
            chap_query = """
                INSERT INTO Chapters (CourseID, Title, Description, SortOrder, CreatedAt, UpdatedAt)
                OUTPUT INSERTED.ChapterID VALUES (?, ?, ?, ?, GETDATE(), GETDATE());
            """
            cursor.execute(chap_query, (new_course_id, chap_data.get('title'), chap_data.get('description'), chapter_idx))
            chapter_id_row = cursor.fetchone()
            if not chapter_id_row: raise Exception("Không thể tạo chương.")
            new_chapter_id = chapter_id_row.ChapterID

            lessons_data = chap_data.get('lessons', [])
            for lesson_idx, less_data in enumerate(lessons_data):
                less_query = """
                    INSERT INTO Lessons (ChapterID, Title, Type, ContentURL, ContentText, MediaFileName,
                                         DurationMinutes, IsPreviewable, SortOrder, CreatedAt, UpdatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
                """
                cursor.execute(less_query, (
                    new_chapter_id, less_data.get('title'), less_data.get('type'),
                    less_data.get('content_url'), less_data.get('content_text'), less_data.get('media_file_name'),
                    less_data.get('duration_minutes'), bool(less_data.get('is_previewable', False)), lesson_idx
                ))
        conn.commit()
        created_course_info, _ = execute_db_query("SELECT Title, Status FROM Courses WHERE CourseID = ?", (new_course_id,), fetch_one=True)
        return jsonify({"success": True, "message": "Khóa học đã được tạo!", "course": {"id": new_course_id, "title": created_course_info.Title, "status": created_course_info.Status}}), 201
    except Exception as e:
        conn.rollback()
        logger.error(f"Lỗi tạo khóa học: {e}")
        return jsonify({"success": False, "error": f"Lỗi server: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course_with_structure(course_id):
    data = request.get_json()
    creator_user_id = data.get('creator_user_id')
    if not creator_user_id: return jsonify({"success": False, "error": "Thiếu creator_user_id."}), 400

    conn = get_db_connection()
    if not conn: return jsonify({"success": False, "error": "Lỗi kết nối database."}), 500
    cursor = conn.cursor()

    try:
        existing_course, _ = execute_db_query("SELECT CreatorUserID FROM Courses WHERE CourseID = ?", (course_id,), fetch_one=True, cursor_obj=cursor)
        if not existing_course: return jsonify({"success": False, "error": "Khóa học không tồn tại."}), 404
        if existing_course.CreatorUserID != int(creator_user_id):
            return jsonify({"success": False, "error": "Không có quyền chỉnh sửa."}), 403

        course_query = """
            UPDATE Courses SET Title = ?, ShortDescription = ?, Description = ?, Price = ?, OriginalPrice = ?,
                ImageURL = ?, BannerImageURL = ?, PromoVideoURL = ?, WhatYouWillLearn = ?, Requirements = ?,
                CategoryID = ?, Difficulty = ?, Language = ?, Status = ?, UpdatedAt = GETDATE()
            WHERE CourseID = ?;
        """
        course_params = (
            data.get('title'), data.get('short_description'), data.get('description'), float(data.get('price',0)),
            data.get('original_price') if data.get('original_price') is not None else None,
            data.get('image_url'), data.get('banner_image_url'), data.get('promo_video_url'),
            ";".join(data.get('whatYouWillLearn', [])), ";".join(data.get('requirements', [])),
            int(data.get('category_id')) if data.get('category_id') else None,
            data.get('difficulty'), data.get('language'), data.get('status'), course_id
        )
        cursor.execute(course_query, course_params)

        cursor.execute("DELETE FROM Lessons WHERE ChapterID IN (SELECT ChapterID FROM Chapters WHERE CourseID = ?)", (course_id,))
        cursor.execute("DELETE FROM Chapters WHERE CourseID = ?", (course_id,))

        chapters_data = data.get('chapters', [])
        for chapter_idx, chap_data in enumerate(chapters_data):
            chap_query = """
                INSERT INTO Chapters (CourseID, Title, Description, SortOrder, CreatedAt, UpdatedAt)
                OUTPUT INSERTED.ChapterID VALUES (?, ?, ?, ?, GETDATE(), GETDATE());
            """
            cursor.execute(chap_query, (course_id, chap_data.get('title'), chap_data.get('description'), chapter_idx))
            chapter_id_row = cursor.fetchone()
            if not chapter_id_row: raise Exception("Không thể cập nhật chương.")
            new_chapter_id = chapter_id_row.ChapterID

            lessons_data = chap_data.get('lessons', [])
            for lesson_idx, less_data in enumerate(lessons_data):
                less_query = """
                    INSERT INTO Lessons (ChapterID, Title, Type, ContentURL, ContentText, MediaFileName,
                                         DurationMinutes, IsPreviewable, SortOrder, CreatedAt, UpdatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
                """
                cursor.execute(less_query, (
                    new_chapter_id, less_data.get('title'), less_data.get('type'),
                    less_data.get('content_url'), less_data.get('content_text'), less_data.get('media_file_name'),
                    less_data.get('duration_minutes'), bool(less_data.get('is_previewable', False)), lesson_idx
                ))
        conn.commit()
        updated_course_info, _ = execute_db_query("SELECT Title, Status FROM Courses WHERE CourseID = ?", (course_id,), fetch_one=True)
        return jsonify({"success": True, "message": "Khóa học đã cập nhật!", "course": {"id": course_id, "title": updated_course_info.Title, "status": updated_course_info.Status}}), 200
    except Exception as e:
        conn.rollback()
        logger.error(f"Lỗi cập nhật khóa học {course_id}: {e}")
        return jsonify({"success": False, "error": f"Lỗi server: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course_by_id(course_id):
    data = request.get_json()
    requesting_user_id = data.get('creator_user_id') if data else None
    if not requesting_user_id: return jsonify({"success": False, "error": "Thiếu UserID xác thực."}), 400

    course, err = execute_db_query("SELECT CreatorUserID FROM Courses WHERE CourseID = ?", (course_id,), fetch_one=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    if not course: return jsonify({"success": False, "error": "Khóa học không tồn tại."}), 404
    if course.CreatorUserID != int(requesting_user_id):
        return jsonify({"success": False, "error": "Không có quyền xóa."}), 403

    rowcount, err = execute_db_query("DELETE FROM Courses WHERE CourseID = ?", (course_id,), commit=True, get_rowcount=True)
    if err: return jsonify({"success": False, "error": f"Lỗi xóa khóa học: {err}"}), 500
    if rowcount == 0: return jsonify({"success": False, "error": "Không tìm thấy khóa học để xóa."}), 404
    return jsonify({"success": True, "message": "Khóa học đã xóa."}), 200

@app.route('/api/categories', methods=['GET'])
def get_categories():
    query = """
        SELECT c.CategoryID, c.Name, c.Description, c.IconClass, c.Slug, COUNT(co.CourseID) as CourseCount
        FROM Categories c
        LEFT JOIN Courses co ON c.CategoryID = co.CategoryID AND co.Status = 'published'
        GROUP BY c.CategoryID, c.Name, c.Description, c.IconClass, c.Slug
        ORDER BY c.Name
    """
    category_rows, err = execute_db_query(query, fetch_all=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    categories_list = []
    if category_rows:
        for row in category_rows:
            categories_list.append({
                "id": row.CategoryID, "name": row.Name, "description": row.Description,
                "icon": row.IconClass, "slug": row.Slug, "course_count": row.CourseCount
            })
    return jsonify({"success": True, "data": categories_list}), 200

@app.route('/api/users/<int:user_id>/courses/created', methods=['GET'])
def get_user_created_courses(user_id):
    query = """
        SELECT c.CourseID, c.Title, c.ShortDescription, c.ImageURL, c.Price, c.OriginalPrice, c.Status, c.Difficulty,
               c.AverageRating, c.EnrollmentsCount,
               u.Name as InstructorName, cat.Name as CategoryName
        FROM Courses c
        JOIN Users u ON c.CreatorUserID = u.UserID
        LEFT JOIN Categories cat ON c.CategoryID = cat.CategoryID
        WHERE c.CreatorUserID = ?
        ORDER BY c.CreatedAt DESC
    """
    course_rows, err = execute_db_query(query, (user_id,), fetch_all=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    courses_list = []
    if course_rows:
        for row in course_rows:
            courses_list.append({
                "id": row.CourseID, "title": row.Title, "short_description": row.ShortDescription,
                "image_url": row.ImageURL, "price": row.Price, "original_price": row.OriginalPrice,
                "status": row.Status, "difficulty": row.Difficulty,
                "average_rating": row.AverageRating, "enrollments_count": row.EnrollmentsCount,
                "instructor_name": row.InstructorName, "category_name": row.CategoryName,
                "creatorUserID": user_id # Add this for frontend logic
            })
    return jsonify({"success": True, "data": courses_list}), 200

@app.route('/api/users/<int:user_id>/courses/enrolled', methods=['GET'])
def get_user_enrolled_courses_list(user_id):
    query = """
        SELECT c.CourseID, c.Title, c.ShortDescription, c.ImageURL, c.Price, c.OriginalPrice, c.Difficulty,
               c.AverageRating, c.EnrollmentsCount,
               u.Name as InstructorName, cat.Name as CategoryName, ue.Progress
        FROM UserEnrollments ue
        JOIN Courses c ON ue.CourseID = c.CourseID
        JOIN Users u ON c.CreatorUserID = u.UserID
        LEFT JOIN Categories cat ON c.CategoryID = cat.CategoryID
        WHERE ue.UserID = ? AND c.Status = 'published'
        ORDER BY ue.EnrolledAt DESC
    """
    course_rows, err = execute_db_query(query, (user_id,), fetch_all=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    courses_list = []
    if course_rows:
        for row in course_rows:
            courses_list.append({
                "id": row.CourseID, "title": row.Title, "short_description": row.ShortDescription,
                "image_url": row.ImageURL, "price": row.Price, "original_price": row.OriginalPrice,
                "difficulty": row.Difficulty, "average_rating": row.AverageRating,
                "enrollments_count": row.EnrollmentsCount,
                "instructor_name": row.InstructorName, "category_name": row.CategoryName, "progress": row.Progress
            })
    return jsonify({"success": True, "data": courses_list}), 200

@app.route('/api/users/<int:user_id>/wishlist', methods=['GET'])
def get_user_wishlist_items(user_id):
    query = """
        SELECT c.CourseID, c.Title, c.ShortDescription, c.ImageURL, c.Price, c.OriginalPrice, c.Difficulty,
               c.AverageRating, c.EnrollmentsCount,
               u.Name as InstructorName, cat.Name as CategoryName
        FROM UserWishlist uw
        JOIN Courses c ON uw.CourseID = c.CourseID
        JOIN Users u ON c.CreatorUserID = u.UserID
        LEFT JOIN Categories cat ON c.CategoryID = cat.CategoryID
        WHERE uw.UserID = ? AND c.Status = 'published'
        ORDER BY uw.AddedAt DESC
    """
    course_rows, err = execute_db_query(query, (user_id,), fetch_all=True)
    if err: return jsonify({"success": False, "error": f"Lỗi server: {err}"}), 500
    courses_list = []
    if course_rows:
        for row in course_rows:
            courses_list.append({
                "id": row.CourseID, "title": row.Title, "short_description": row.ShortDescription,
                "image_url": row.ImageURL, "price": row.Price, "original_price": row.OriginalPrice,
                "difficulty": row.Difficulty, "average_rating": row.AverageRating,
                "enrollments_count": row.EnrollmentsCount,
                "instructor_name": row.InstructorName, "category_name": row.CategoryName
            })
    return jsonify({"success": True, "data": courses_list}), 200

@app.route('/api/courses/<int:course_id>/enroll', methods=['POST'])
def enroll_in_course(course_id):
    data = request.get_json()
    user_id = data.get('userId')
    if not user_id: return jsonify({"success": False, "error": "Thiếu UserID."}), 400

    existing, err = execute_db_query("SELECT EnrollmentID FROM UserEnrollments WHERE UserID = ? AND CourseID = ?",
                                     (user_id, course_id), fetch_one=True)
    if err: return jsonify({"success": False, "error": f"Lỗi DB: {err}"}), 500
    if existing: return jsonify({"success": False, "error": "Bạn đã đăng ký khóa học này rồi."}), 409

    _, err = execute_db_query("INSERT INTO UserEnrollments (UserID, CourseID) VALUES (?, ?)",
                              (user_id, course_id), commit=True)
    if err: return jsonify({"success": False, "error": f"Lỗi đăng ký: {err}"}), 500
    
    _, err_count = execute_db_query("UPDATE Courses SET EnrollmentsCount = EnrollmentsCount + 1, UpdatedAt = GETDATE() WHERE CourseID = ?", (course_id,), commit=True)
    if err_count: logger.warning(f"Lỗi cập nhật số lượt đăng ký {course_id}: {err_count}")
    return jsonify({"success": True, "message": "Đăng ký khóa học thành công!"}), 200

@app.route('/api/users/<int:user_id>/wishlist/toggle', methods=['POST'])
def toggle_wishlist_item(user_id):
    data = request.get_json()
    course_id = data.get('courseId')
    add_action = data.get('add', True)
    if not course_id: return jsonify({"success": False, "error": "Thiếu CourseID."}), 400

    existing, err = execute_db_query("SELECT WishlistID FROM UserWishlist WHERE UserID = ? AND CourseID = ?",
                                     (user_id, course_id), fetch_one=True)
    if err: return jsonify({"success": False, "error": f"Lỗi DB: {err}"}), 500

    message = ""
    if add_action:
        if existing:
            message = "Đã có trong yêu thích."
        else:
            _, err = execute_db_query("INSERT INTO UserWishlist (UserID, CourseID) VALUES (?, ?)",
                                      (user_id, course_id), commit=True)
            message = "Đã thêm vào Yêu thích."
    else: # Remove action
        if not existing:
            message = "Không có trong yêu thích để xóa."
        else:
            _, err = execute_db_query("DELETE FROM UserWishlist WHERE UserID = ? AND CourseID = ?",
                                      (user_id, course_id), commit=True)
            message = "Đã xóa khỏi Yêu thích."
    if err: return jsonify({"success": False, "error": f"Lỗi Yêu thích: {err}"}), 500
    return jsonify({"success": True, "message": message}), 200

@app.route('/api/lessons/upload', methods=['POST'])
def upload_lesson_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "Không có file."}), 400
    file = request.files['file']
    file_type_from_form = request.form.get('fileType', 'videos') # Default to videos
    if file.filename == '':
        return jsonify({"success": False, "error": "Tên file trống."}), 400

    saved_filename = save_uploaded_file(file, file_type_from_form)
    if saved_filename:
        file_url = f"/uploads/{file_type_from_form}/{saved_filename}" # Relative path
        return jsonify({"success": True, "fileName": saved_filename, "url": file_url}), 200
    else:
        return jsonify({"success": False, "error": "Lưu file thất bại."}), 500

if __name__ == '__main__':
    if app.debug:
        # init_database() # CAREFUL: Wipes and recreates schema + category seeds.
                        # If you ran the full SQL script, you might not need this,
                        # or run it once and then comment out.
        pass # Comment init_database() if schema is already set up by SQL script
    app.run(host='0.0.0.0', port=5000, debug=True)