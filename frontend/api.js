// frontend/api.js
const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend

async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = {
        // 'Content-Type': 'application/json' // Will be set specifically below
    };
    // const token = localStorage.getItem('authToken'); // If using token-based auth
    // if (requiresAuth && token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }
    
    const config = { 
        method: method,
        headers: headers,
    };

    if (body) {
        if (body instanceof FormData) {
            // Don't set Content-Type for FormData, browser handles it with boundary
            config.body = body;
        } else if (typeof body === 'object' && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        } else {
            // For GET requests with body (less common, but possible for search)
            // Or if body is not an object for POST/PUT
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }
    }


    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        // Try to parse as JSON, but handle cases where response might not be JSON (e.g., 204 No Content)
        let responseData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            responseData = await response.json();
        } else if (response.status === 204) {
            responseData = { message: "Operation successful, no content returned." }; // Or handle as needed
        }
         else {
            responseData = { error: await response.text() || response.statusText }; // Fallback for non-JSON error
        }


        if (!response.ok) {
            console.error(`API Error (${response.status}) for ${method} ${API_BASE_URL}${endpoint}:`, responseData);
            return { success: false, status: response.status, error: responseData.error || responseData.message || response.statusText, data: responseData };
        }
        return { success: true, status: response.status, data: responseData };
    } catch (error) {
        console.error('Network error or server is down:', error);
        return { success: false, error: 'Lỗi mạng hoặc không thể kết nối đến server.', data: null };
    }
}

// --- Auth API Calls ---
async function registerUserApi(name, email, password) { 
    try {
        const response = await apiRequest('/auth/register', 'POST', { 
            name, 
            email, 
            password 
        });
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function loginUserApi(email, password) {
    try {
        const response = await apiRequest('/auth/login', 'POST', { 
            email, 
            password 
        });
        if (response.error) {
            throw new Error(response.error);
        }
        // Lưu thông tin người dùng vào localStorage
        if (response.id) {
            localStorage.setItem('userId', response.id);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.name);
        }
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function updateUserProfileApi(userData) {
    try {
        return await apiRequest(`/users/${userData.userId}/profile`, 'PUT', userData);
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
}

// --- Course API Calls ---
async function getCoursesApi(limit = null, searchTerm = null, categoryId = null, difficulty = null, sortBy = null) {
    let endpoint = '/courses';
    const params = new URLSearchParams();
    if (limit !== null && limit !== undefined) params.append('limit', limit);
    if (searchTerm) params.append('search', searchTerm);
    if (categoryId) params.append('category_id', categoryId);
    if (difficulty) params.append('difficulty', difficulty);
    if (sortBy) params.append('sort_by', sortBy);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return apiRequest(endpoint, 'GET');
}

async function getCourseDetailApi(courseId) {
    return apiRequest(`/courses/${courseId}`, 'GET');
}

async function createCourseApi(courseData) { // creator_user_id is now part of courseData
    return apiRequest('/courses', 'POST', courseData);
}

async function updateCourseApi(courseData) { // ID is now part of courseData, currentUserID is also in courseData
    if (!courseData.id) return { success: false, error: "Course ID is required for update." };
    return apiRequest(`/courses/${courseData.id}`, 'PUT', courseData);
}

async function deleteCourseApi(courseId, currentUserID) {
    // Backend should verify ownership using currentUserID (if sessions/tokens are not used for auth on backend)
    return apiRequest(`/courses/${courseId}`, 'DELETE', { current_user_id: currentUserID });
}

// --- Categories API ---
async function getCategoriesApi() {
    return apiRequest('/categories', 'GET');
}


// --- Chapter & Lesson API Calls (Assumed structure from original, adjust if backend differs) ---
// These might not be needed if chapters/lessons are managed entirely within the course update
// but keeping them for potential granular control.

async function createChapterApi(courseId, chapterData) { // creator_user_id is now part of chapterData or courseData
    return apiRequest(`/courses/${courseId}/chapters`, 'POST', chapterData);
}

async function updateChapterApi(chapterId, chapterData) {
    return apiRequest(`/chapters/${chapterId}`, 'PUT', chapterData);
}

async function deleteChapterApi(chapterId, currentUserID) {
    return apiRequest(`/chapters/${chapterId}`, 'DELETE', { current_user_id: currentUserID });
}

async function createLessonApi(chapterId, lessonData) {
    return apiRequest(`/chapters/${chapterId}/lessons`, 'POST', lessonData);
}

async function updateLessonApi(lessonId, lessonData) {
    return apiRequest(`/lessons/${lessonId}`, 'PUT', lessonData);
}

async function deleteLessonApi(lessonId, currentUserID) {
    return apiRequest(`/lessons/${lessonId}`, 'DELETE', { current_user_id: currentUserID });
}

// --- User Course Management API Calls ---
async function getUserCoursesApi(userId, type = 'created') { // type can be 'created' or 'enrolled'
    return apiRequest(`/users/${userId}/courses?type=${type}`, 'GET'); // Assuming backend supports ?type=
}

async function getUserEnrolledCoursesApi(userId) { // Kept for explicitness if needed, or merge with above
    return apiRequest(`/users/${userId}/enrolled-courses`, 'GET');
}

async function getUserWishlistApi(userId) { // New API
    return apiRequest(`/users/${userId}/wishlist`, 'GET');
}


async function enrollInCourseApi(userId, courseId) {
    return apiRequest(`/courses/${courseId}/enroll`, 'POST', { user_id: userId }); // Match snake_case if backend expects it
}

async function toggleWishlistApi(userId, courseId, addToWishlist) { // addToWishlist is boolean
    return apiRequest(`/users/${userId}/wishlist/${courseId}`, addToWishlist ? 'POST' : 'DELETE');
}

// Upload files function (example, might need adjustment based on backend implementation)
async function uploadLessonFileApi(lessonId, fileData, fileType = 'video') { // fileType: 'video', 'document', 'audio'
    const formData = new FormData();
    formData.append(fileType, fileData); // e.g., 'video': fileObject

    // This endpoint needs to be defined in your backend for handling file uploads for lessons
    return apiRequest(`/lessons/${lessonId}/upload/${fileType}`, 'POST', formData, true); // requiresAuth might be needed
}


window.api = {
    registerUserApi,
    loginUserApi,
    updateUserProfileApi,
    getCoursesApi,
    getCourseDetailApi,
    createCourseApi,
    updateCourseApi,
    deleteCourseApi,
    getCategoriesApi,
    // Chapter/Lesson APIs (if used directly)
    createChapterApi,
    updateChapterApi,
    deleteChapterApi,
    createLessonApi,
    updateLessonApi,
    deleteLessonApi,
    // User specific
    getUserCoursesApi,
    getUserEnrolledCoursesApi,
    getUserWishlistApi,
    enrollInCourseApi,
    toggleWishlistApi,
    uploadLessonFileApi 
};
