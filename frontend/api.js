// frontend/api.js
const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Your Flask backend

window.api = {
    // --- Auth ---
    registerUserApi: async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        return response.json();
    },
    loginUserApi: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    },
    updateUserProfileApi: async (userData) => { // { userId, name, current_password, new_password }
        const response = await fetch(`${API_BASE_URL}/users/profile`, { // Backend uses /users/profile
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData), // Ensure userData contains 'userId'
        });
        return response.json();
    },

    // --- Courses ---
    getCoursesApi: async (limit = null, search = '', category = '', difficulty = '', sortBy = 'newest') => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (difficulty) params.append('difficulty', difficulty);
        if (sortBy) params.append('sortBy', sortBy);
        
        // The backend /api/courses handles these query params
        const response = await fetch(`${API_BASE_URL}/courses?${params.toString()}`);
        return response.json();
    },
    getCourseDetailApi: async (courseId) => {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        return response.json();
    },
    createCourseApi: async (courseData) => { // courseData includes creator_user_id and full structure
        const response = await fetch(`${API_BASE_URL}/courses`, { // Single POST endpoint handles structure
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });
        return response.json();
    },
    updateCourseApi: async (courseData) => { // courseData must have id and creator_user_id
        if (!courseData.id) throw new Error("Course ID is required for update.");
        if (!courseData.creator_user_id) throw new Error("Creator User ID is required for update verification.");
        const response = await fetch(`${API_BASE_URL}/courses/${courseData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData), // Backend expects full courseData including creator_user_id
        });
        return response.json();
    },
    deleteCourseApi: async (courseId, creatorUserID) => { // Backend expects creator_user_id for verification
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            // Backend expects creator_user_id in the body for this specific delete route I provided
            body: JSON.stringify({ creator_user_id: creatorUserID }) 
        });
        return response.json();
    },

    // --- Categories ---
    getCategoriesApi: async () => {
        const response = await fetch(`${API_BASE_URL}/categories`);
        return response.json();
    },

    // --- User Specific ---
    // `getUserCoursesApi` is split for clarity based on the backend provided
    getUserCreatedCoursesApi: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/courses/created`);
        return response.json();
    },
    getUserEnrolledCoursesApi: async (userId) => { // This one was correct in your original
        const response = await fetch(`${API_BASE_URL}/users/${userId}/courses/enrolled`);
        return response.json();
    },
    getUserWishlistApi: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/wishlist`);
        return response.json();
    },
    enrollInCourseApi: async (userId, courseId) => {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }), // Backend expects userId in body
        });
        return response.json();
    },
    toggleWishlistApi: async (userId, courseId, addAction = true) => { // `add` is boolean
        const response = await fetch(`${API_BASE_URL}/users/${userId}/wishlist/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId, add: addAction }), // Backend expects courseId and add flag
        });
        return response.json();
    },

    // --- File Upload (for lesson media) ---
    // If you have a separate course image upload, you'd add another function for `/api/upload/image`
    uploadLessonMediaApi: async (file, fileType = 'video') => { // fileType: 'video' or 'attachment'
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType); // Backend /api/lessons/upload expects this form field

        const response = await fetch(`${API_BASE_URL}/lessons/upload`, {
            method: 'POST',
            body: formData, 
        });
        return response.json(); // Expects { success: true, fileName: "...", url: "..." }
    }
};