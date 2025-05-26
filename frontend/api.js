// frontend/api.js
const API_BASE_URL = 'http://127.0.0.1:5000/api'; // URL của backend Flask

async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
    };
    // Nếu API yêu cầu token, bạn sẽ thêm vào đây sau này
    // const token = localStorage.getItem('authToken');
    // if (requiresAuth && token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }

    const config = {
        method: method,
        headers: headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) { // DELETE có thể có body
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const responseData = await response.json(); // Luôn cố gắng parse JSON

        if (!response.ok) {
            console.error(`API Error (${response.status}) for ${method} ${endpoint}:`, responseData);
            return { success: false, status: response.status, error: responseData.error || response.statusText, data: responseData };
        }
        // responseData có thể là { "message": "...", "user": {...} } hoặc mảng courses, hoặc course detail
        return { success: true, status: response.status, data: responseData };
    } catch (error) {
        console.error('Network error or server is down:', error);
        return { success: false, error: 'Lỗi mạng hoặc không thể kết nối đến server.', data: null };
    }
}

// --- Auth API Calls ---
async function registerUserApi(name, email, password, role) {
    return apiRequest('/auth/register', 'POST', { name, email, password, role });
}

async function loginUserApi(email, password) {
    return apiRequest('/auth/login', 'POST', { email, password });
}

// --- Course API Calls ---
async function getCoursesApi(limit = null, searchTerm = null) {
    let endpoint = '/courses';
    const params = new URLSearchParams();
    if (limit !== null && limit !== undefined) params.append('limit', limit); // Kiểm tra kỹ null/undefined
    if (searchTerm) params.append('search', searchTerm);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return apiRequest(endpoint, 'GET');
}


async function getCourseDetailApi(courseId) {
    return apiRequest(`/courses/${courseId}`, 'GET');
}
// frontend/api.js (tiếp theo)
    async function createCourseApi(courseData, creatorUserID) {
        // Đảm bảo creatorUserID được gửi trong body theo yêu cầu của backend
        const payload = { ...courseData, creatorUserID: creatorUserID };
        return apiRequest('/courses', 'POST', payload);
    }

    async function updateCourseApi(courseId, courseData, currentUserID) {
        const payload = { ...courseData, currentUserID: currentUserID };
        return apiRequest(`/courses/${courseId}`, 'PUT', payload);
    }

    async function deleteCourseApi(courseId, currentUserID) {
        // Backend yêu cầu currentUserID trong body cho DELETE
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
        // lessonData nên chứa: title, description (là nội dung text), và content (object chứa mediaUrl, etc.)
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
    async function getUserCoursesApi(userId) { // Lấy các khóa học của user (đã đăng ký hoặc đã tạo)
        return apiRequest(`/users/${userId}/courses`, 'GET');
    }

    async function enrollCourseApi(courseId, userId) {
        return apiRequest(`/courses/${courseId}/enroll`, 'POST', { userID: userId });
    }

    // Export các hàm để script.js có thể sử dụng
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
        getUserCoursesApi,
        enrollCourseApi
    };