// frontend/api.js
const API_BASE_URL = 'http://localhost:5000/api'; // URL của backend Flask

async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const config = { 
        method: method,
        headers: headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const responseData = await response.json(); 

        if (!response.ok) {
            console.error(`API Error (${response.status}) for ${method} ${endpoint}:`, responseData);
            return { success: false, status: response.status, error: responseData.error || response.statusText, data: responseData };
        }
        return { success: true, status: response.status, data: responseData };
    } catch (error) {
        console.error('Network error or server is down:', error);
        return { success: false, error: 'Lỗi mạng hoặc không thể kết nối đến server.', data: null };
    }
}

// --- Auth API Calls ---
async function registerUserApi(name, email, password) { // Bỏ role
    console.log('Making registration request:', { name, email }); // Bỏ role
    return apiRequest('/auth/register', 'POST', { name, email, password }); // Bỏ role
}

async function loginUserApi(email, password) {
    return apiRequest('/auth/login', 'POST', { email, password });
}

// --- Course API Calls ---
async function getCoursesApi(limit = null, searchTerm = null) {
    let endpoint = '/courses';
    const params = new URLSearchParams();
    if (limit !== null && limit !== undefined) params.append('limit', limit);
    if (searchTerm) params.append('search', searchTerm);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return apiRequest(endpoint, 'GET');
}

async function getCourseDetailApi(courseId) {
    return apiRequest(`/courses/${courseId}`, 'GET');
}

async function createCourseApi(courseData, creatorUserID) {
    const payload = { ...courseData, creatorUserID: creatorUserID };
    return apiRequest('/courses', 'POST', payload);
}

async function updateCourseApi(courseId, courseData, currentUserID) {
    const payload = { ...courseData, currentUserID: currentUserID };
    return apiRequest(`/courses/${courseId}`, 'PUT', payload);
}

async function deleteCourseApi(courseId, currentUserID) {
    return apiRequest(`/courses/${courseId}`, 'DELETE', { currentUserID: currentUserID });
}

// --- Chapter API Calls ---
async function createChapterApi(courseId, chapterData, currentUserID) {
    const payload = { ...chapterData, currentUserID: currentUserID };
    return apiRequest(`/courses/${courseId}/chapters`, 'POST', payload);
}

async function updateChapterApi(chapterId, chapterData, currentUserID) {
    const payload = { ...chapterData, currentUserID: currentUserID };
    return apiRequest(`/chapters/${chapterId}`, 'PUT', payload);
}

async function deleteChapterApi(chapterId, currentUserID) {
    return apiRequest(`/chapters/${chapterId}`, 'DELETE', { currentUserID: currentUserID });
}

// --- Lesson API Calls ---
async function createLessonApi(chapterId, lessonData, currentUserID) {
    const payload = { ...lessonData, currentUserID: currentUserID };
    return apiRequest(`/chapters/${chapterId}/lessons`, 'POST', payload);
}

async function updateLessonApi(lessonId, lessonData, currentUserID) {
    const payload = { ...lessonData, currentUserID: currentUserID };
    return apiRequest(`/lessons/${lessonId}`, 'PUT', payload);
}

async function deleteLessonApi(lessonId, currentUserID) {
    return apiRequest(`/lessons/${lessonId}`, 'DELETE', { currentUserID: currentUserID });
}

// --- User Specific API Calls ---
async function getUserCoursesApi(userId) { // Sẽ lấy các khóa học do user tạo
    return apiRequest(`/users/${userId}/courses`, 'GET');
}

// enrollCourseApi không còn cần thiết nữa
// async function enrollCourseApi(courseId, userId) { ... }

window.api = {
    registerUserApi,
    loginUserApi,
    getCoursesApi,
    getCourseDetailApi,
    createCourseApi,
    updateCourseApi,
    deleteCourseApi,
    createChapterApi,
    updateChapterApi,
    deleteChapterApi,
    createLessonApi,
    updateLessonApi,
    deleteLessonApi,
    getUserCoursesApi
    // enrollCourseApi -- ĐÃ XÓA
};