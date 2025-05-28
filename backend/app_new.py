@app.route('/api/courses', methods=['GET'])
def get_courses_list():
    # Parameters for filtering and sorting
    search_term = request.args.get('search', '').strip()
    category_id_str = request.args.get('category', '').strip()
    difficulty = request.args.get('difficulty', '').strip()
    sort_by = request.args.get('sortBy', 'newest').strip() # popular, newest, rating
    limit_str = request.args.get('limit')
    
    limit = None
    if limit_str and limit_str.isdigit():
        limit = int(limit_str)

    conn = get_db_connection()
    if not conn: return jsonify({"success": False, "error": "Lỗi kết nối server."}), 500
    cursor = conn.cursor()
    
    params = []
    
    # Start with SELECT TOP if limit is provided
    select_clause = "SELECT "
    if limit:
        select_clause += f"TOP ({limit}) "

    query = select_clause + """
        c.CourseID, c.Title, c.ShortDescription, c.Description, c.Price, c.OriginalPrice,
        c.ImageURL, c.PromoVideoURL, c.Difficulty, c.Status, c.EnrollmentsCount, c.AverageRating,
        u.Name AS InstructorName, u.UserID AS CreatorUserID,
        cat.Name AS CategoryName, cat.CategoryID
        FROM Courses c
        JOIN Users u ON c.CreatorUserID = u.UserID
        LEFT JOIN Categories cat ON c.CategoryID = cat.CategoryID
        WHERE c.Status = 'published'
    """

    if search_term:
        query += " AND (c.Title LIKE ? OR c.Description LIKE ? OR u.Name LIKE ?)"
        search_like = f'%{search_term}%'
        params.extend([search_like, search_like, search_like])
    
    if category_id_str and category_id_str.isdigit():
        query += " AND c.CategoryID = ?"
        params.append(int(category_id_str))

    if difficulty:
        query += " AND c.Difficulty = ?"
        params.append(difficulty)

    if sort_by == 'popular':
        # Popular courses = high enrollment + good rating + relatively new
        query += """ ORDER BY 
            (c.EnrollmentsCount * 0.5 + c.AverageRating * 20) * 
            CASE 
                WHEN DATEDIFF(day, c.CreatedAt, GETDATE()) <= 30 THEN 1.5  -- Boost new courses
                WHEN DATEDIFF(day, c.CreatedAt, GETDATE()) <= 90 THEN 1.2  -- Slightly boost recent courses
                ELSE 1.0 
            END DESC"""
    elif sort_by == 'rating':
        query += " ORDER BY c.AverageRating DESC, c.EnrollmentsCount DESC"
    elif sort_by == 'newest':
        query += " ORDER BY c.CreatedAt DESC"
    else:
        query += " ORDER BY c.CreatedAt DESC"

    try:
        cursor.execute(query, params)
        courses_rows = cursor.fetchall()
        courses_list = []
        for row in courses_rows:
            courses_list.append({
                "id": row.CourseID,
                "title": row.Title,
                "short_description": row.ShortDescription,
                "description": row.Description,
                "price": float(row.Price) if row.Price is not None else 0.0,
                "original_price": float(row.OriginalPrice) if row.OriginalPrice is not None else None,
                "image_url": row.ImageURL,
                "promo_video_url": row.PromoVideoURL,
                "difficulty": row.Difficulty,
                "status": row.Status,
                "enrollments_count": row.EnrollmentsCount,
                "average_rating": float(row.AverageRating) if row.AverageRating is not None else 0.0,
                "instructor_name": row.InstructorName,
                "creator_user_id": row.CreatorUserID,
                "category_name": row.CategoryName,
                "category_id": row.CategoryID
            })
        return jsonify({"success": True, "data": courses_list}), 200
    except pyodbc.Error as e:
        logger.error(f"DB Error on get_courses_list: {e}")
        return jsonify({"success": False, "error": f"Lỗi server khi lấy danh sách khóa học: {e}"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()
