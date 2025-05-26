// frontend/script.js (phần đầu, giữ nguyên các DOM elements)
// --- Global State ---
let isLoggedIn = false; // Sẽ được quản lý bằng token hoặc session sau này nếu cần
let loggedInUser = {
    id: null, // Sẽ là UserID từ DB
    name: "",
    email: "",
    role: "",
    enrolledCourses: [], // Mảng các courseID
};
let currentSection = 'homepage';
let currentDetailCourseId = null;
let editingChapterId = null; // Dùng cho việc biết đang sửa chapter nào (INT từ DB)
let editingLessonId = null;  // Dùng cho việc biết đang sửa lesson nào (INT từ DB)

// XÓA HOẶC COMMENT OUT: mockUsers và mockCourses
// let mockUsers = [ ... ];
// let mockCourses = [ ... ];

// --- Get DOM Elements (giữ nguyên) ---
// ... (tất cả các const bạn đã định nghĩa)


// --- Functions to manage view and history (giữ nguyên) ---
// function showSection(...) { ... }
// function openModal(...) { ... }
// function closeModal(...) { ... }

// --- Cập nhật UI dựa trên trạng thái đăng nhập ---
function updateAuthUI() {
    if (isLoggedIn && loggedInUser && loggedInUser.id) { // Kiểm tra loggedInUser.id
        authButtonsDiv.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        userDisplayNameSpan.textContent = loggedInUser.name;
        userAvatarPlaceholder.textContent = loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : '?';
        profileDisplayNameSpan.textContent = loggedInUser.name;
        profileDisplayEmailSpan.textContent = loggedInUser.email;
        profileDisplayRoleSpan.textContent = loggedInUser.role;

        if (loggedInUser.role === "Giảng viên") {
            if (navManageCoursesItem) navManageCoursesItem.classList.remove('hidden');
            if (navLinkManageCourses) {
                navLinkManageCourses.onclick = (e) => {
                    e.preventDefault();
                    navigateToSection('user-profile');
                };
            }
        } else {
            if (navManageCoursesItem) navManageCoursesItem.classList.add('hidden');
        }
        updateProfileContent(); // Gọi sau khi đã có loggedInUser

    } else {
        authButtonsDiv.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
        userDisplayNameSpan.textContent = "";
        userAvatarPlaceholder.textContent = "";
        profileDisplayNameSpan.textContent = "";
        profileDisplayEmailSpan.textContent = "";
        profileDisplayRoleSpan.textContent = "";
        profileActionsDiv.innerHTML = "";
        profileCoursesSection.innerHTML = "";
        if (navManageCoursesItem) navManageCoursesItem.classList.add('hidden');
    }
}

async function updateProfileContent() {
    profileActionsDiv.innerHTML = "";
    profileCoursesSection.innerHTML = "";

    if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
        profileCoursesSection.innerHTML = "<p>Đăng nhập để xem thông tin cá nhân và các khóa học của bạn.</p>";
        return;
    }

    profileCoursesSection.innerHTML += `<h3><i class="fas ${loggedInUser.role === "Học viên" ? 'fa-book-reader' : 'fa-chalkboard-teacher'}"></i> Khóa học của tôi (${loggedInUser.role === "Học viên" ? "Đã đăng ký" : "Đã tạo"})</h3>`;

    const apiResponse = await window.api.getUserCoursesApi(loggedInUser.id);

    if (apiResponse.success && apiResponse.data) {
        const userCourses = apiResponse.data;
        if (userCourses.length > 0) {
            const coursesGrid = document.createElement('div');
            coursesGrid.classList.add('user-course-list-grid');
            profileCoursesSection.appendChild(coursesGrid);
            displayCourses(userCourses, coursesGrid); // displayCourses giờ sẽ nhận data từ API
        } else {
            if (loggedInUser.role === "Học viên") {
                profileCoursesSection.innerHTML += `<p>Bạn chưa đăng ký khóa học nào. <a href="#" data-section="all-courses" class="nav-link profile-nav-link">Khám phá các khóa học ngay!</a></p>`;
            } else {
                profileCoursesSection.innerHTML += `<p>Bạn chưa tạo khóa học nào.</p>`;
            }
        }
    } else {
        profileCoursesSection.innerHTML += `<p>Lỗi khi tải danh sách khóa học: ${apiResponse.error || 'Không rõ lỗi'}</p>`;
    }
    
    if (loggedInUser.role === "Giảng viên") {
        const createCourseBtnProfile = document.createElement('button');
        createCourseBtnProfile.classList.add('btn', 'btn-primary');
        createCourseBtnProfile.innerHTML = '<i class="fas fa-plus-circle"></i> Tạo Khóa học mới từ Profile';
        createCourseBtnProfile.addEventListener('click', () => {
            navigateToSection('create-course');
        });
        profileActionsDiv.appendChild(createCourseBtnProfile);
    }
    
    // Event listener cho link khám phá khóa học nếu có
    const exploreLink = profileCoursesSection.querySelector('a.profile-nav-link');
    if (exploreLink) {
        exploreLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection('all-courses');
        });
    }
}


// --- Hiển thị danh sách khóa học (giữ nguyên, chỉ thay đổi nguồn data) ---
function displayCourses(coursesToDisplay, targetElement) {
    targetElement.innerHTML = '';
    if (!coursesToDisplay || coursesToDisplay.length === 0) {
        targetElement.innerHTML = '<p style="text-align: center; width: 100%;">Không tìm thấy khóa học nào phù hợp.</p>';
        return;
    }

    coursesToDisplay.forEach(course => { // course giờ là object từ API
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card-lw');
        courseCard.dataset.courseId = course.id; // course.id từ API

        courseCard.innerHTML = `
            <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}" alt="${course.title}">
            <div class="card-info-lw">
                <h3>${course.title}</h3>
                <p class="instructor">Giảng viên: ${course.instructor}</p> {/* course.instructor từ API */}
                <p class="price">${course.price}</p>
            </div>
        `;
        targetElement.appendChild(courseCard);
        courseCard.addEventListener('click', () => {
            showCourseDetail(course.id); // Gọi showCourseDetail với course.id
        });
    });
}

// --- Hiển thị chi tiết khóa học (MAJOR CHANGES) ---
async function showCourseDetail(courseId, pushHistory = true) {
    currentDetailCourseId = courseId; // Lưu ID hiện tại
    const apiResponse = await window.api.getCourseDetailApi(courseId);

    if (!apiResponse.success || !apiResponse.data) {
        alert(`Không tìm thấy thông tin khóa học: ${apiResponse.error || 'Lỗi không xác định'}`);
        if (history.length > 1 && history.state && history.state.section !== 'course-detail-section') history.back();
        else navigateToSection('homepage', null, false);
        return;
    }

    const course = apiResponse.data; // Dữ liệu khóa học từ API (bao gồm cả structure)

    detailCourseTitle.textContent = course.title;
    detailCourseInstructor.textContent = `Giảng viên: ${course.instructor}`;
    detailCoursePrice.textContent = `Giá: ${course.price}`;
    detailCourseDescription.textContent = course.description;
    studentCourseActionsDiv.innerHTML = '';
    instructorCourseAside.classList.add('hidden');
    instructorLessonManagementTools.classList.add('hidden');

    if (isLoggedIn && loggedInUser && loggedInUser.id) {
        if (loggedInUser.role === "Giảng viên" && course.creatorUserID === loggedInUser.id) {
            instructorCourseAside.classList.remove('hidden');
            const allAsideLinks = instructorAsideActionsList.querySelectorAll('a');
            allAsideLinks.forEach(link => link.classList.remove('active-aside-link'));
            const manageLessonsLink = instructorAsideActionsList.querySelector('a[data-action="manage-lessons"]');
            if (manageLessonsLink) {
                manageLessonsLink.classList.add('active-aside-link');
                // Gọi hàm render lại cấu trúc và hiển thị tool cho giảng viên
                setTimeout(() => handleInstructorAsideAction("manage-lessons", course.id, false), 0);
            }
        } else if (loggedInUser.role === "Học viên") {
            instructorCourseAside.classList.add('hidden');
            // Kiểm tra xem user đã enroll khóa học này chưa.
            // loggedInUser.enrolledCourses giờ là mảng các courseID từ DB
            const isEnrolled = loggedInUser.enrolledCourses && loggedInUser.enrolledCourses.includes(course.id);

            if (isEnrolled) {
                const accessButton = document.createElement('button');
                accessButton.classList.add('btn', 'btn-success');
                accessButton.innerHTML = '<i class="fas fa-play-circle"></i> Vào học ngay';
                accessButton.addEventListener('click', () => alert(`(Giả lập) Bắt đầu học khóa: ${course.title}`));
                studentCourseActionsDiv.appendChild(accessButton);
            } else {
                const enrollButton = document.createElement('button');
                enrollButton.classList.add('btn', 'btn-primary', 'btn-enroll-course');
                enrollButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Đăng ký học (${course.price})`;
                enrollButton.addEventListener('click', async () => {
                    if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
                        alert("Vui lòng đăng nhập để đăng ký khóa học.");
                        openModal(loginModal);
                        return;
                    }
                    if (confirm(`Bạn có muốn đăng ký khóa học "${course.title}" với giá ${course.price}?`)) {
                        const enrollResponse = await window.api.enrollCourseApi(course.id, loggedInUser.id);
                        if (enrollResponse.success) {
                            alert(enrollResponse.data.message || "Đăng ký thành công!");
                            // Cập nhật lại thông tin user (enrolledCourses)
                            if (!loggedInUser.enrolledCourses.includes(course.id)) {
                                 loggedInUser.enrolledCourses.push(course.id);
                            }
                            updateAuthUI(); // Cập nhật lại nút enroll/access
                            showCourseDetail(course.id, false); // Tải lại chi tiết để cập nhật nút
                        } else {
                            alert(`Đăng ký thất bại: ${enrollResponse.error || enrollResponse.data.message || 'Lỗi không rõ'}`);
                        }
                    }
                });
                studentCourseActionsDiv.appendChild(enrollButton);
            }
        }
    } else { // Chưa đăng nhập
        instructorCourseAside.classList.add('hidden');
        const enrollButton = document.createElement('button');
        enrollButton.classList.add('btn', 'btn-primary', 'btn-enroll-course');
        enrollButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Đăng ký học (${course.price})`;
        enrollButton.addEventListener('click', () => {
            alert("Vui lòng đăng nhập để đăng ký khóa học.");
            openModal(loginModal);
        });
        studentCourseActionsDiv.appendChild(enrollButton);
    }

    renderCourseStructure(course); // Hàm này giờ nhận course từ API

    detailCourseFilesList.innerHTML = '';
    if (course.files && course.files.length > 0) { // files này sẽ lấy từ DB nếu bạn implement CourseFiles
        course.files.forEach(file => {
            const li = document.createElement('li');
            // Cần URL thực tế để tải file từ backend sau này
            li.innerHTML = `<a href="#" onclick="event.preventDefault(); alert('Tải xuống file chung: ${file.fileName || file}')"><i class="fas fa-file-download"></i> ${file.fileName || file}</a>`;
            detailCourseFilesList.appendChild(li);
        });
    } else {
        detailCourseFilesList.innerHTML = '<li>Không có tài liệu chung cho khóa học.</li>';
    }

    // Hiển thị bài học đầu tiên nếu có
    if (course.structure && course.structure.length > 0 && course.structure[0].lessons && course.structure[0].lessons.length > 0) {
        displayLessonContent(course, course.structure[0].id, course.structure[0].lessons[0].id);
    } else {
        detailCourseVideoPlayer.innerHTML = `<div class="placeholder-video-lw"><i class="fas fa-play-circle"></i> <p>Chọn một bài giảng từ cấu trúc khóa học để xem nội dung.</p></div>`;
    }

    showSection(courseDetailSection, { section: 'course-detail-section', courseId: courseId }, pushHistory);
}


// --- Render Cấu trúc Khóa học (MAJOR CHANGES) ---
function renderCourseStructure(course) { // `course` là object từ API, `course.structure` là mảng chapters
    courseStructureRenderArea.innerHTML = '';
    if (!course.structure || course.structure.length === 0) {
        courseStructureRenderArea.innerHTML = '<p>Khóa học này hiện chưa có nội dung bài giảng chi tiết.</p>';
        return;
    }

    course.structure.forEach(chapter => { // chapter.id, lesson.id giờ là INT từ DB
        const chapterDiv = document.createElement('div');
        chapterDiv.classList.add('chapter-block');
        chapterDiv.dataset.chapterId = chapter.id; // chapter.id từ API

        const chapterHeader = document.createElement('div');
        chapterHeader.classList.add('chapter-header');
        chapterHeader.innerHTML = `
            <h4>
                <i class="fas fa-folder-open"></i> ${chapter.title}
                <span class="chapter-toggle-icon"><i class="fas fa-chevron-down"></i></span>
            </h4>
        `;
        // Chỉ hiển thị nút quản lý nếu là giảng viên tạo khóa học
        if (isLoggedIn && loggedInUser && loggedInUser.role === "Giảng viên" && course.creatorUserID === loggedInUser.id) {
            chapterHeader.innerHTML += `
                <div class="content-actions chapter-actions">
                    <button class="btn btn-sm btn-outline btn-edit-chapter" data-chapter-id="${chapter.id}"><i class="fas fa-edit"></i> Sửa Chương</button>
                    <button class="btn btn-sm btn-danger btn-delete-chapter" data-chapter-id="${chapter.id}"><i class="fas fa-trash"></i> Xóa Chương</button>
                    <button class="btn btn-sm btn-success btn-add-lesson-to-chapter" data-chapter-id="${chapter.id}"><i class="fas fa-plus-circle"></i> Thêm Bài giảng</button>
                </div>`;
        }
        chapterDiv.appendChild(chapterHeader);

        if (chapter.description) {
            const chapterDesc = document.createElement('p');
            chapterDesc.classList.add('chapter-description');
            chapterDesc.textContent = chapter.description;
            chapterDiv.appendChild(chapterDesc);
        }

        const lessonListDiv = document.createElement('div');
        lessonListDiv.classList.add('lesson-list-container', 'collapsed');

        if (chapter.lessons && chapter.lessons.length > 0) {
            const lessonList = document.createElement('ul');
            lessonList.classList.add('lesson-list');
            chapter.lessons.forEach(lesson => { // lesson.id từ API
                const lessonItem = document.createElement('li');
                lessonItem.classList.add('lesson-item');
                lessonItem.dataset.lessonId = lesson.id; // lesson.id từ API

                let iconClass = 'fa-chalkboard-teacher';
                if (lesson.content && (lesson.content.mediaUrl || lesson.content.mediaFileName)) { // mediaFileName để tương thích
                    const fileNameForIcon = lesson.content.mediaFileName || (lesson.content.mediaUrl && lesson.content.mediaUrl.startsWith('http') ? lesson.content.mediaUrl.split('/').pop() : 'unknown.file');
                    const ext = fileNameForIcon.split('.').pop().toLowerCase();
                    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) iconClass = 'fa-video';
                    else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) iconClass = 'fa-image';
                    else if (lesson.content.mediaUrl && lesson.content.mediaUrl.includes("youtube.com/embed")) iconClass = 'fa-youtube fab';
                } else if (lesson.content && (lesson.content.attachmentUrl || lesson.content.attachmentFileName)) {
                    iconClass = 'fa-paperclip';
                }

                lessonItem.innerHTML = `
                    <div class="lesson-info">
                        <i class="fas ${iconClass} lesson-icon"></i>
                        <span class="lesson-title">${lesson.title}</span>
                        ${lesson.description && lesson.description.length > 50 ? `<small class="lesson-short-desc">${lesson.description.substring(0,50)}...</small>` : (lesson.description ? `<small class="lesson-short-desc">${lesson.description}</small>` : '')}
                    </div>
                    <div class="lesson-meta">
                        ${isLoggedIn && loggedInUser && loggedInUser.role === "Giảng viên" && course.creatorUserID === loggedInUser.id ? `
                            <div class="content-actions lesson-actions-inline">
                                <button class="btn btn-xs btn-outline btn-edit-lesson" data-chapter-id="${chapter.id}" data-lesson-id="${lesson.id}"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-xs btn-danger btn-delete-lesson" data-chapter-id="${chapter.id}" data-lesson-id="${lesson.id}"><i class="fas fa-trash"></i></button>
                            </div>` : ''}
                    </div>`;
                lessonItem.querySelector('.lesson-info .lesson-title').addEventListener('click', () => {
                    // Cần truyền toàn bộ object course để displayLessonContent có thể tìm lesson
                    displayLessonContent(course, chapter.id, lesson.id);
                });
                lessonList.appendChild(lessonItem);
            });
            lessonListDiv.appendChild(lessonList);
        } else {
            lessonListDiv.innerHTML = '<p class="no-lessons-msg">Chưa có bài học nào trong chương này.</p>';
        }
        chapterDiv.appendChild(lessonListDiv);
        courseStructureRenderArea.appendChild(chapterDiv);

        chapterHeader.querySelector('h4').addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                lessonListDiv.classList.toggle('collapsed');
                const icon = chapterHeader.querySelector('.chapter-toggle-icon i');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    });
    addStructureActionListeners(course.id, course.creatorUserID); // Truyền creatorUserID để kiểm tra quyền
}


// --- Hiển thị nội dung bài học (Giữ nguyên logic, data từ object course truyền vào) ---
function displayLessonContent(course, chapterId, lessonId) { // `course` là object đầy đủ từ API
    const chapter = course.structure.find(ch => ch.id === chapterId);
    if (!chapter) { console.error("Chapter not found in displayLessonContent", chapterId, course); return; }
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (!lesson) { console.error("Lesson not found in displayLessonContent", lessonId, chapter); return; }

    detailCourseVideoPlayer.innerHTML = '';
    let contentHTML = '';
    let hasMediaOrText = false;

    // Nội dung text của bài giảng (từ lesson.description)
    // Backend lưu nội dung text bài giảng vào trường Description của bảng Lessons
    if (lesson.description) { // Đây là nội dung chính của bài giảng dạng text
        hasMediaOrText = true;
        contentHTML += `<div class="text-content-display"><h4>Nội dung bài giảng:</h4><p>${lesson.description.replace(/\n/g, '<br>')}</p></div>`;
    }

    // Media (Video/Image) từ lesson.content
    if (lesson.content && lesson.content.mediaUrl) {
        hasMediaOrText = true;
        const mediaUrl = lesson.content.mediaUrl;
        const mediaFileName = lesson.content.mediaFileName || "Media File"; // Dùng cho hiển thị tên, không phải để phát
        let mediaDisplayHTML = '';

        if (mediaUrl.includes("youtube.com/embed") || mediaUrl.includes("youtu.be")) {
            let embedUrl = mediaUrl;
            if (mediaUrl.includes("youtu.be/")) {
                const videoId = mediaUrl.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (mediaUrl.includes("youtube.com/watch?v=")) {
                const videoId = mediaUrl.split('watch?v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
            mediaDisplayHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        } else if (/\.(mp4|webm|ogg|mov)$/i.test(mediaUrl) && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
            mediaDisplayHTML = `
                <video controls width="100%" style="max-height: 400px; border-radius: var(--border-radius);">
                    <source src="${mediaUrl}" type="video/${mediaUrl.split('.').pop().toLowerCase()}">
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>`;
        } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl) && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
            mediaDisplayHTML = `<img src="${mediaUrl}" alt="${mediaFileName}" style="max-width: 100%; max-height: 400px; border-radius: var(--border-radius); object-fit: contain;" />`;
        }
        // Xử lý URL không phải video/image trực tiếp hoặc YouTube (có thể là link file media cần tải)
        else if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
             mediaDisplayHTML = `
                <div class="placeholder-video-lw simulated-file">
                    <i class="fas fa-link"></i>
                    <p>Media từ URL: <a href="${mediaUrl}" target="_blank" rel="noopener noreferrer">${mediaFileName}</a></p>
                    <small>Nội dung này có thể cần được mở trong tab mới hoặc tải xuống.</small>
                </div>`;
        }
        // Xử lý trường hợp mediaFileName cũ (giả lập) nếu mediaUrl không phải là URL thực
        else if (mediaFileName) { // mediaUrl lúc này có thể chỉ là tên file cũ
            const fileExtension = mediaFileName.split('.').pop().toLowerCase();
            if (['mp4', 'webm', 'ogv', 'ogg', 'mov'].includes(fileExtension)) {
                mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-film"></i><p>Video (Cần URL thực tế): ${mediaFileName}</p></div>`;
            } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension)) {
                mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-image"></i><p>Ảnh (Cần URL thực tế): ${mediaFileName}</p><img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(mediaFileName.substring(0,20))}" alt="${mediaFileName}" /></div>`;
            } else {
                 mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-file-audio"></i><p>Media (Cần URL thực tế): ${mediaFileName}</p></div>`;
            }
        }
        // Chèn media vào đầu nếu có và có nội dung text
        contentHTML = `<div class="lesson-media-wrapper" style="margin-bottom: 20px;">${mediaDisplayHTML}</div>` + contentHTML;
    }

    // File đính kèm từ lesson.content
    if (lesson.content && lesson.content.attachmentUrl) {
        hasMediaOrText = true;
        const attachmentUrl = lesson.content.attachmentUrl;
        const attachmentFileName = lesson.content.attachmentFileName || "Tải file";
        // Nếu attachmentUrl là URL đầy đủ, cho phép tải. Nếu không, chỉ hiển thị tên.
        const downloadButton = (attachmentUrl.startsWith('http://') || attachmentUrl.startsWith('https://'))
            ? `<a href="${attachmentUrl}" target="_blank" download="${attachmentFileName}" class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Tải xuống</a>`
            : `<button class="btn btn-secondary btn-sm" disabled><i class="fas fa-download"></i> Tải xuống (Cần URL)</button>`;

        contentHTML += `
            <div class="course-attachment-section">
                <h4><i class="fas fa-paperclip"></i> File đính kèm:</h4>
                <p>
                    <i class="fas fa-file"></i> ${attachmentFileName}
                    ${downloadButton}
                </p>
            </div>`;
    }

    if (!hasMediaOrText) {
        contentHTML = `<div class="placeholder-video-lw"><i class="fas fa-info-circle"></i> <p>Bài giảng "${lesson.title}" hiện chưa có nội dung media, mô tả hoặc file đính kèm.</p></div>`;
    }

    detailCourseVideoPlayer.innerHTML = contentHTML;

    courseStructureRenderArea.querySelectorAll('.lesson-item.active-lesson').forEach(item => item.classList.remove('active-lesson'));
    const activeLessonElement = courseStructureRenderArea.querySelector(`.lesson-item[data-lesson-id="${lessonId}"]`);
    if (activeLessonElement) activeLessonElement.classList.add('active-lesson');
}

// --- Các hành động của Giảng viên (MAJOR CHANGES) ---
async function handleInstructorAsideAction(action, courseId, showAlert = true) {
    // const course = mockCourses.find(c => c.id === courseId); // XÓA
    // THAY THẾ: Lấy course detail từ API nếu cần, nhưng tốt hơn là truyền object course vào
    // Tuy nhiên, để đơn giản, chúng ta giả định courseId là đủ cho các action này
    // Nếu cần dữ liệu khóa học (như title), thì phải gọi API
    // Hoặc, hàm showCourseDetail đã gọi API rồi, chúng ta có thể lấy course object từ global state nếu lưu trữ nó.

    const allAsideLinks = instructorAsideActionsList.querySelectorAll('a');
    allAsideLinks.forEach(link => link.classList.remove('active-aside-link'));
    const clickedLink = instructorAsideActionsList.querySelector(`a[data-action="${action}"]`);
    if (clickedLink) clickedLink.classList.add('active-aside-link');

    instructorLessonManagementTools.classList.add('hidden');
    courseStructureRenderArea.classList.remove('editing-mode');

    switch (action) {
        case 'manage-lessons':
        case 'add-content': // Gộp chung vì đều cần render lại cấu trúc để hiển thị nút
            // Cần tải lại chi tiết khóa học để có cấu trúc mới nhất nếu có thay đổi từ nơi khác
            const detailResp = await window.api.getCourseDetailApi(courseId);
            if(detailResp.success && detailResp.data) {
                renderCourseStructure(detailResp.data); // Dùng data từ API
                instructorLessonManagementTools.classList.remove('hidden');
                courseStructureRenderArea.classList.add('editing-mode');
                if (action === 'add-content' && showAlert) {
                    alert(`(Giả lập) Sẵn sàng thêm nội dung. Sử dụng các nút trong phần Nội dung Khóa học.`);
                    const addChapterBtn = instructorLessonManagementTools.querySelector('.btn-add-chapter');
                    if(addChapterBtn) addChapterBtn.focus();
                } else if (action === 'manage-lessons' && showAlert) {
                     alert(`(Giả lập) Chế độ Quản lý Bài giảng. Sử dụng các nút trong phần Nội dung Khóa học.`);
                }
            } else {
                alert("Lỗi khi tải lại cấu trúc khóa học.");
            }
            break;
        case 'edit-course-info':
            // setupEditCourseForm sẽ gọi API để lấy chi tiết và điền form
            setupEditCourseForm(courseId);
            break;
        case 'delete-course':
            // Cần lấy title để confirm, nên gọi API trước
            const courseInfoForDelete = await window.api.getCourseDetailApi(courseId);
            if (courseInfoForDelete.success && courseInfoForDelete.data) {
                if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ khóa học "${courseInfoForDelete.data.title}" không? Việc này không thể hoàn tác.`)) {
                    const deleteResponse = await window.api.deleteCourseApi(courseId, loggedInUser.id);
                    if (deleteResponse.success) {
                        alert(deleteResponse.data.message || `Khóa học đã bị xóa.`);
                        navigateToSection('user-profile');
                    } else {
                        alert(`Xóa khóa học thất bại: ${deleteResponse.error || deleteResponse.data.message || 'Lỗi không rõ'}`);
                    }
                }
            } else {
                 alert("Không thể lấy thông tin khóa học để xóa.");
            }
            break;
        default:
            const defaultDetailResp = await window.api.getCourseDetailApi(courseId);
            if(defaultDetailResp.success && defaultDetailResp.data) {
                 renderCourseStructure(defaultDetailResp.data);
            }
            break;
    }
}

// --- Điều hướng (MAJOR CHANGES for initial load) ---
async function navigateToSection(sectionId, entityId = null, pushHistory = true) { // entityId có thể là courseId
    let sectionElement;
    let state = { section: sectionId, courseId: (sectionId === 'course-detail-section' ? entityId : null) };
    currentDetailCourseId = (sectionId === 'course-detail-section' ? entityId : null);


    switch (sectionId) {
        case 'homepage':
            sectionElement = homepageSection;
            const homeCoursesResp = await window.api.getCoursesApi(6); // Lấy 6 khóa học nổi bật
            if (homeCoursesResp.success) {
                displayCourses(homeCoursesResp.data, featuredCourseListDiv);
            } else {
                featuredCourseListDiv.innerHTML = `<p>Lỗi khi tải khóa học: ${homeCoursesResp.error}</p>`;
            }
            break;
        case 'all-courses':
            sectionElement = allCoursesSection;
            const allCoursesResp = await window.api.getCoursesApi(); // Lấy tất cả khóa học
            if (allCoursesResp.success) {
                displayCourses(allCoursesResp.data, allCourseListDiv);
            } else {
                allCourseListDiv.innerHTML = `<p>Lỗi khi tải khóa học: ${allCoursesResp.error}</p>`;
            }
            break;
        case 'learning-plan':
            sectionElement = learningPlanSection;
            if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
                alert("Vui lòng đăng nhập để xem kế hoạch học tập.");
                openModal(loginModal);
                return; // Dừng thực thi nếu chưa đăng nhập
            }
            // TODO: Implement logic for learning plan if needed
            break;
        case 'user-profile':
            if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
                alert("Vui lòng đăng nhập để xem thông tin cá nhân.");
                openModal(loginModal);
                return; // Dừng thực thi
            }
            sectionElement = userProfileSection;
            updateProfileContent(); // Hàm này đã gọi API
            break;
        case 'create-course':
            if (!isLoggedIn || !loggedInUser || loggedInUser.role !== "Giảng viên") {
                alert("Chỉ giảng viên mới có thể tạo khóa học.");
                if (!isLoggedIn) openModal(loginModal);
                else navigateToSection('homepage');
                return; // Dừng thực thi
            }
            sectionElement = createCourseSection;
            if (createCourseForm) createCourseForm.reset();
            document.getElementById('create-course-section').querySelector('h2').textContent = "Tạo khóa học mới";
            const existingIdInput = createCourseForm.querySelector('input[name="editing_course_id"]');
            if (existingIdInput) existingIdInput.remove();
            createCourseForm.querySelector('.submit-course-btn').textContent = "Tạo khóa học";
            break;
        case 'course-detail-section': // Trường hợp này sẽ được xử lý riêng bởi showCourseDetail
             if (entityId !== null) {
                showCourseDetail(entityId, pushHistory); // showCourseDetail sẽ gọi showSection
            } else {
                console.error("navigateToSection: courseId is null for course-detail-section");
                navigateToSection('homepage'); // Fallback
            }
            return; // Không gọi showSection ở đây nữa vì showCourseDetail đã gọi
        default:
            sectionElement = homepageSection;
            const defaultCoursesResp = await window.api.getCoursesApi(6);
            if (defaultCoursesResp.success) {
                displayCourses(defaultCoursesResp.data, featuredCourseListDiv);
            }
            sectionId = 'homepage';
            state = { section: sectionId };
            break;
    }
    if (sectionElement && sectionId !== 'course-detail-section') { // Chỉ gọi showSection nếu không phải detail
        showSection(sectionElement, state, pushHistory);
    }
}


// --- DOMContentLoaded (MAJOR CHANGES for initial load and login/signup) ---
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra nếu có thông tin user trong localStorage (ví dụ sau khi refresh)
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        try {
            loggedInUser = JSON.parse(storedUser);
            isLoggedIn = true; // Giả định user vẫn còn "đăng nhập"
        } catch (e) {
            localStorage.removeItem('loggedInUser'); // Xóa nếu lỗi parse
            isLoggedIn = false;
            loggedInUser = { id: null, name: "", email: "", role: "", enrolledCourses: [] };
        }
    }
    updateAuthUI(); // Cập nhật UI dựa trên trạng thái đã load

    const initialHash = window.location.hash ? window.location.hash.substring(1) : 'homepage';
    let initialSectionId = 'homepage', initialCourseId = null;

    if (initialHash.startsWith('detail-')) {
        const parts = initialHash.split('-');
        if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
            initialSectionId = 'course-detail-section';
            initialCourseId = parseInt(parts[1]);
        }
    } else {
        const knownSections = ['homepage', 'all-courses', 'learning-plan', 'user-profile', 'create-course'];
        if (knownSections.includes(initialHash)) initialSectionId = initialHash;
    }
    navigateToSection(initialSectionId, initialCourseId, false); // Tải section ban đầu

    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.section) {
            navigateToSection(state.section, state.courseId, false);
        } else {
            navigateToSection('homepage', null, false);
        }
    });

    // Event listeners cho modal (giữ nguyên)
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    // ... (các event listener khác cho modal)

    // Login Form (MAJOR CHANGE)
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        // const selectedRole = loginForm.querySelector('input[name="login-role"]:checked').value; // Role không cần gửi lên, backend tự xác định

        if (!email || !password) { alert("Vui lòng nhập đủ email và mật khẩu."); return; }

        const apiResponse = await window.api.loginUserApi(email, password);

        if (apiResponse.success && apiResponse.data.user) {
            loggedInUser = apiResponse.data.user; // user từ API response
            isLoggedIn = true;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Lưu vào localStorage
            updateAuthUI();
            closeModal(loginModal);
            // Điều hướng sau khi login thành công
            if (currentSection === 'homepage' || currentSection === 'all-courses' || !currentSection) {
                navigateToSection('user-profile');
            } else if (currentSection === 'course-detail-section' && currentDetailCourseId) {
                showCourseDetail(currentDetailCourseId, false); // Tải lại chi tiết để cập nhật nút đăng ký/vào học
            } else {
                navigateToSection(currentSection, currentDetailCourseId, false);
            }
        } else {
            alert(`Đăng nhập thất bại: ${apiResponse.error || apiResponse.data.error || 'Email hoặc mật khẩu không đúng.'}`);
            localStorage.removeItem('loggedInUser');
        }
    });

    // Signup Form (MAJOR CHANGE)
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const role = signupForm.querySelector('input[name="signup-role"]:checked').value;

        if (!name || !email || !password || !confirmPassword) { alert("Vui lòng điền đủ thông tin."); return; }
        if (password !== confirmPassword) { alert("Mật khẩu xác nhận không khớp."); return; }
        // Có thể thêm các validate khác ở frontend

        const apiResponse = await window.api.registerUserApi(name, email, password, role);

        if (apiResponse.success) {
            alert(apiResponse.data.message || "Đăng ký thành công. Vui lòng đăng nhập.");
            closeModal(signupModal);
            openModal(loginModal);
        } else {
            alert(`Đăng ký thất bại: ${apiResponse.error || apiResponse.data.error || 'Lỗi không rõ'}`);
        }
    });

    // Logout Button (MAJOR CHANGE)
    logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        loggedInUser = { id: null, name: "", email: "", role: "", enrolledCourses: [] };
        localStorage.removeItem('loggedInUser'); // Xóa user khỏi localStorage
        updateAuthUI();

        if(instructorCourseAside) instructorCourseAside.classList.add('hidden');
        if(instructorLessonManagementTools) instructorLessonManagementTools.classList.add('hidden');
        if(courseStructureRenderArea) courseStructureRenderArea.classList.remove('editing-mode');

        currentDetailCourseId = null;
        editingChapterId = null;
        editingLessonId = null;
        navigateToSection('homepage');
    });

    // User Info Click (giữ nguyên)
    userInfoDiv.addEventListener('click', (e) => {
        if (!e.target.closest('.logout-btn') && isLoggedIn) navigateToSection('user-profile');
    });
    // CTA Buttons (giữ nguyên)
    ctaTrialBtn.addEventListener('click', () => navigateToSection('all-courses'));
    ctaCreateBtn.addEventListener('click', () => {
        // ... (logic giữ nguyên, chỉ là điều kiện isLoggedIn và role đã được cập nhật)
        if (isLoggedIn && loggedInUser && loggedInUser.role === "Giảng viên") navigateToSection('create-course');
        else if (!isLoggedIn) { alert('Vui lòng đăng nhập và đăng ký với vai trò Giảng viên để chia sẻ kiến thức.'); openModal(loginModal); }
        else alert('Chức năng này chỉ dành cho Giảng viên. Tài khoản của bạn không có quyền này.');
    });

    // Create/Edit Course Form (MAJOR CHANGE)
    createCourseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('course-title').value.trim();
        const description = document.getElementById('course-description').value.trim();
        const price = document.getElementById('course-price').value.trim() || "Chưa xác định";
        const imageUrl = document.getElementById('course-image-url').value.trim();

        if (!title || !description) { alert("Vui lòng nhập đủ Tiêu đề và Mô tả khóa học."); return; }
        if (!isLoggedIn || !loggedInUser || !loggedInUser.id || loggedInUser.role !== "Giảng viên") {
            alert("Bạn phải đăng nhập với vai trò Giảng viên để thực hiện hành động này.");
            return;
        }

        const courseData = {
            title,
            description,
            price,
            image: imageUrl || `https://via.placeholder.com/400x250?text=${encodeURIComponent(title.substring(0,15))}`
            // creatorUserID sẽ được thêm trong hàm API call
        };

        const editingIdInput = createCourseForm.querySelector('input[name="editing_course_id"]');
        let apiResponse;

        if (editingIdInput && editingIdInput.value) { // Đang sửa
            const courseIdToEdit = parseInt(editingIdInput.value);
            apiResponse = await window.api.updateCourseApi(courseIdToEdit, courseData, loggedInUser.id);
            if (apiResponse.success) {
                alert(apiResponse.data.message || `Khóa học "${title}" đã được cập nhật thành công.`);
                createCourseForm.reset(); editingIdInput.remove();
                document.getElementById('create-course-section').querySelector('h2').textContent = "Tạo khóa học mới";
                createCourseForm.querySelector('.submit-course-btn').textContent = "Tạo khóa học";
                showCourseDetail(courseIdToEdit); // Hiển thị lại chi tiết khóa học vừa sửa
            } else {
                alert(`Cập nhật khóa học thất bại: ${apiResponse.error || apiResponse.data.error || 'Lỗi không rõ'}`);
            }
        } else { // Đang tạo mới
            apiResponse = await window.api.createCourseApi(courseData, loggedInUser.id);
            if (apiResponse.success && apiResponse.data.course) {
                alert(apiResponse.data.message || `Khóa học "${title}" đã được tạo thành công.`);
                createCourseForm.reset();
                showCourseDetail(apiResponse.data.course.id); // Hiển thị chi tiết khóa học vừa tạo
            } else {
                alert(`Tạo khóa học thất bại: ${apiResponse.error || apiResponse.data.error || 'Lỗi không rõ'}`);
            }
        }
    });

    // Back Button (giữ nguyên)
    backToListOrHomeButton.addEventListener('click', () => { /* ... */ });
    // Logo Home Link (giữ nguyên)
    logoHomeLink.addEventListener('click', (e) => { /* ... */ });
    // Main Nav Click (giữ nguyên)
    document.querySelector('.main-nav ul').addEventListener('click', (e) => { /* ... */ });
    // Instructor Aside Actions (giữ nguyên)
    if (instructorAsideActionsList) { /* ... */ }
    // Add Chapter Button Global (giữ nguyên)
    const addChapterBtnGlobal = instructorLessonManagementTools.querySelector('.btn-add-chapter');
    if (addChapterBtnGlobal) {
        addChapterBtnGlobal.addEventListener('click', () => {
            if (currentDetailCourseId !== null) openChapterForm(currentDetailCourseId);
        });
    }
    // File input listeners (giữ nguyên)
    // Search (MAJOR CHANGE)
    courseSearchButton.addEventListener('click', performFrontendSearchWithApi);
    courseSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performFrontendSearchWithApi(); }});

    // Tải khóa học ban đầu cho trang chủ nếu không có hash
    if (currentSection === 'homepage' && !window.location.hash && featuredCourseListDiv) {
        navigateToSection('homepage', null, false); // Sẽ gọi API
    }
}); // END DOMContentLoaded

// --- Sửa form chỉnh sửa khóa học (MAJOR CHANGE) ---
async function setupEditCourseForm(courseId) {
    const apiResponse = await window.api.getCourseDetailApi(courseId);
    if (!apiResponse.success || !apiResponse.data) {
        alert("Lỗi khi tải thông tin khóa học để sửa.");
        navigateToSection('user-profile'); // Hoặc trang trước đó
        return;
    }
    const course = apiResponse.data;

    // Chỉ cho phép sửa nếu là người tạo khóa học
    if (!isLoggedIn || !loggedInUser || loggedInUser.id !== course.creatorUserID) {
        alert("Bạn không có quyền sửa khóa học này.");
        showCourseDetail(courseId); // Quay lại trang chi tiết
        return;
    }

    navigateToSection('create-course', null, true); // Điều hướng đến trang form

    // Dùng setTimeout để đảm bảo DOM của create-course-section đã được render
    setTimeout(() => {
        const createCourseSectionTitle = document.getElementById('create-course-section').querySelector('h2');
        if(createCourseSectionTitle) createCourseSectionTitle.textContent = `Sửa Khóa học: ${course.title}`;

        const courseTitleInput = document.getElementById('course-title');
        if(courseTitleInput) courseTitleInput.value = course.title;

        const courseDescInput = document.getElementById('course-description');
        if(courseDescInput) courseDescInput.value = course.description;

        const coursePriceInput = document.getElementById('course-price');
        if(coursePriceInput) coursePriceInput.value = course.price;

        const courseImgUrlInput = document.getElementById('course-image-url');
        if(courseImgUrlInput) courseImgUrlInput.value = course.image || '';

        const submitButton = createCourseForm.querySelector('.submit-course-btn');
        if(submitButton) submitButton.textContent = "Lưu thay đổi";

        let idInput = createCourseForm.querySelector('input[name="editing_course_id"]');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden'; idInput.name = 'editing_course_id';
            createCourseForm.appendChild(idInput);
        }
        idInput.value = course.id; // Lưu ID của khóa học đang sửa
    }, 0);
}

// --- Tìm kiếm khóa học (MAJOR CHANGE) ---
async function performFrontendSearchWithApi() {
    const searchTerm = courseSearchInput.value.toLowerCase().trim();
    const targetList = (currentSection === 'homepage' && !searchTerm) ? featuredCourseListDiv : allCourseListDiv;
    const limit = (currentSection === 'homepage' && !searchTerm) ? 6 : null;

    // Nếu đang ở trang chủ và có search term, hoặc không ở trang chủ/all-courses, thì chuyển sang all-courses
    if ((currentSection === 'homepage' && searchTerm) || !['homepage', 'all-courses'].includes(currentSection)) {
        navigateToSection('all-courses', null, true); // Chuyển trang trước
         // Đợi DOM của all-courses render xong rồi mới gọi API và hiển thị
        setTimeout(async () => {
            const apiResponse = await window.api.getCoursesApi(null, searchTerm); // Tìm kiếm trên tất cả
            if (apiResponse.success) {
                displayCourses(apiResponse.data, allCourseListDiv);
            } else {
                allCourseListDiv.innerHTML = `<p>Lỗi khi tìm kiếm khóa học: ${apiResponse.error}</p>`;
            }
        }, 50); // Delay nhỏ để đảm bảo trang đã chuyển
    } else { // Đang ở trang chủ (không search) hoặc all-courses
        const apiResponse = await window.api.getCoursesApi(limit, searchTerm);
        if (apiResponse.success) {
            displayCourses(apiResponse.data, targetList);
        } else {
            targetList.innerHTML = `<p>Lỗi khi tìm kiếm/tải khóa học: ${apiResponse.error}</p>`;
        }
    }
}

// --- Form Chương (MAJOR CHANGES) ---
function openChapterForm(courseId, chapterToEditId = null) { // chapterToEditId là INT từ DB
    editingChapterId = chapterToEditId; // Lưu ID chương đang sửa (nếu có)
    document.getElementById('chapter-form-course-id').value = courseId;
    const modalTitle = chapterFormModal.querySelector('h2');
    const submitBtn = chapterForm.querySelector('button[type="submit"]');

    if (editingChapterId) {
        // Cần lấy thông tin chương từ cấu trúc khóa học hiện tại (đã tải từ API)
        // Để làm điều này, chúng ta cần truy cập currentDetailCourseId và sau đó tìm chương
        // Hoặc, lý tưởng hơn, khi click nút "Sửa chương", chúng ta đã có object chương đó.
        // Tạm thời, giả sử chúng ta cần lấy lại chi tiết khóa học để tìm chương.
        // (Cách tốt hơn là truyền object chapter vào đây nếu có sẵn)

        // Tìm chương trong cấu trúc khóa học hiện tại (nếu có)
        // Giả sử `currentLoadedCourseDetail` là biến global lưu trữ chi tiết khóa học hiện tại
        // (Bạn cần đảm bảo biến này được cập nhật khi showCourseDetail)
        // Để đơn giản, hàm này sẽ không tự động điền form khi sửa nữa, người dùng tự nhập lại
        // Hoặc bạn có thể tìm trong cấu trúc DOM đã render.
        // Ví dụ đơn giản nhất là clear form và yêu cầu nhập lại:
        modalTitle.textContent = "Sửa Chương";
        chapterForm.reset(); // Xóa form
        document.getElementById('chapter-form-chapter-id').value = editingChapterId; // Vẫn set ID để biết là sửa
         // Lấy chapter title và description từ DOM nếu đang hiển thị:
        const chapterBlock = courseStructureRenderArea.querySelector(`.chapter-block[data-chapter-id="${editingChapterId}"]`);
        if (chapterBlock) {
            const titleElement = chapterBlock.querySelector('.chapter-header h4');
            // Cần loại bỏ icon và span toggle ra khỏi title
            let titleText = titleElement ? titleElement.innerText.trim() : '';
            // Loại bỏ phần icon và chevron
            const iElement = titleElement.querySelector('i.fa-folder-open');
            const spanElement = titleElement.querySelector('span.chapter-toggle-icon');
            if (iElement) titleText = titleText.replace(iElement.innerText, '').trim();
            if (spanElement) titleText = titleText.replace(spanElement.innerText, '').trim();

            document.getElementById('chapter-title').value = titleText;

            const descElement = chapterBlock.querySelector('.chapter-description');
            document.getElementById('chapter-description').value = descElement ? descElement.textContent.trim() : '';
        }

        submitBtn.textContent = "Lưu Thay Đổi";

    } else { // Thêm mới
        modalTitle.textContent = "Thêm Chương Mới";
        chapterForm.reset();
        document.getElementById('chapter-form-chapter-id').value = ''; // Rỗng cho thêm mới
        submitBtn.textContent = "Thêm Chương";
    }
    openModal(chapterFormModal);
}

if (chapterForm) {
    chapterForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const courseId = parseInt(document.getElementById('chapter-form-course-id').value);
        const chapterIdToEdit = document.getElementById('chapter-form-chapter-id').value; // Đây là string, có thể rỗng
        const title = document.getElementById('chapter-title').value.trim();
        const description = document.getElementById('chapter-description').value.trim();

        if (!title) { alert("Vui lòng nhập Tên Chương."); return; }
        if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
            alert("Vui lòng đăng nhập để thực hiện."); return;
        }

        const chapterData = { title, description };
        let apiResponse;

        if (chapterIdToEdit) { // Đang sửa chương
            apiResponse = await window.api.updateChapterApi(parseInt(chapterIdToEdit), chapterData, loggedInUser.id);
        } else { // Thêm chương mới
            apiResponse = await window.api.createChapterApi(courseId, chapterData, loggedInUser.id);
        }

        if (apiResponse.success) {
            alert(apiResponse.data.message || (chapterIdToEdit ? "Chương đã được cập nhật." : "Chương mới đã được thêm."));
            closeModal(chapterFormModal);
            // Tải lại chi tiết khóa học để cập nhật cấu trúc
            if (currentDetailCourseId) {
                showCourseDetail(currentDetailCourseId, false); // false để không push history mới
            }
        } else {
            alert(`Lỗi: ${apiResponse.error || apiResponse.data.message || 'Thao tác thất bại.'}`);
        }
    });
}

// --- Form Bài giảng (MAJOR CHANGES) ---
function openLessonForm(courseId, chapterId, lessonToEditId = null) { // lessonToEditId là INT từ DB
    editingLessonId = lessonToEditId; // Lưu ID bài giảng đang sửa
    document.getElementById('lesson-form-course-id').value = courseId;
    document.getElementById('lesson-form-chapter-id').value = chapterId;

    const modalTitle = lessonFormModal.querySelector('h2');
    const submitBtn = lessonForm.querySelector('button[type="submit"]');
    const lessonTitleInput = document.getElementById('lesson-title');
    const lessonDescriptionInput = document.getElementById('lesson-description'); // Nội dung text bài giảng
    const lessonVideoUrlInput = document.getElementById('lesson-content-video-url');
    const lessonMediaFileInput = document.getElementById('lesson-content-media-file');
    const lessonAttachmentFileInput = document.getElementById('lesson-content-attachment-file');


    lessonForm.reset(); // Reset form trước
    if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.textContent = '';
    if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.textContent = '';
    if(lessonMediaFileInput) lessonMediaFileInput.value = '';
    if(lessonAttachmentFileInput) lessonAttachmentFileInput.value = '';
    if(lessonVideoUrlInput) lessonVideoUrlInput.value = '';


    if (editingLessonId) {
        modalTitle.textContent = "Sửa Bài giảng";
        submitBtn.textContent = "Lưu Thay Đổi";
        document.getElementById('lesson-form-lesson-id').value = editingLessonId;

        // Lấy thông tin bài giảng từ DOM để điền form (cách đơn giản)
        // Cách tốt hơn: nếu có object `course` đầy đủ, tìm lesson trong đó
        const lessonItemElement = courseStructureRenderArea.querySelector(`.lesson-item[data-lesson-id="${editingLessonId}"]`);
        if (lessonItemElement) {
            const titleElement = lessonItemElement.querySelector('.lesson-title');
            lessonTitleInput.value = titleElement ? titleElement.textContent.trim() : '';

            // Để lấy description và content, cần phải click vào bài học đó để displayLessonContent chạy
            // Điều này hơi phức tạp. Tạm thời, người dùng sẽ phải nhập lại content cho video/attachment khi sửa.
            // Hoặc, bạn có thể thêm một bước lấy chi tiết bài giảng từ API nếu cần.
            // Backend đã trả về lesson.description và lesson.content.mediaUrl, etc. trong getCourseDetailApi
            // Chúng ta cần tìm lesson đó trong cấu trúc `course` đã tải.
            // Giả sử bạn có `currentLoadedCourseDetail`
            // const currentCourse = currentLoadedCourseDetail; // Giả định biến này tồn tại
            // if (currentCourse && currentCourse.structure) {
            //    const chapterObj = currentCourse.structure.find(ch => ch.id === parseInt(chapterId));
            //    if (chapterObj && chapterObj.lessons) {
            //        const lessonObj = chapterObj.lessons.find(l => l.id === parseInt(editingLessonId));
            //        if (lessonObj) {
            //            lessonDescriptionInput.value = lessonObj.description || ''; // description là nội dung text
            //            if (lessonObj.content) {
            //                lessonVideoUrlInput.value = lessonObj.content.mediaUrl || '';
            //                // Không thể tự động điền file input, chỉ hiển thị tên file cũ
            //                if(lessonObj.content.mediaFileName) lessonMediaFileNameDisplay.innerHTML = `<i class="fas fa-check-circle"></i> Giữ lại media: ${lessonObj.content.mediaFileName}`;
            //                if(lessonObj.content.attachmentFileName) lessonAttachmentFileNameDisplay.innerHTML = `<i class="fas fa-check-circle"></i> Giữ lại đính kèm: ${lessonObj.content.attachmentFileName}`;
            //            }
            //        }
            //    }
            // }
             alert("Khi sửa bài giảng, vui lòng nhập lại các URL/chọn lại file nếu muốn thay đổi media hoặc file đính kèm. Nội dung text sẽ được tải (nếu có).");
             // Trong thực tế, bạn sẽ lấy lessonObj từ course object đã load
             // lessonDescriptionInput.value = lessonObj.description || '';
             // lessonVideoUrlInput.value = lessonObj.content?.mediaUrl || '';

        } else {
            alert("Lỗi: Không tìm thấy thông tin bài giảng để sửa trên giao diện.");
            // return; // Có thể dừng ở đây
        }
    } else { // Thêm mới
        modalTitle.textContent = "Thêm Bài giảng mới";
        document.getElementById('lesson-form-lesson-id').value = ''; // Rỗng cho thêm mới
        submitBtn.textContent = "Thêm Bài giảng";
    }
    openModal(lessonFormModal);
}

if (lessonForm) {
    lessonForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const courseId = parseInt(document.getElementById('lesson-form-course-id').value); // Để tải lại khóa học
        const chapterId = parseInt(document.getElementById('lesson-form-chapter-id').value);
        const lessonIdToEdit = document.getElementById('lesson-form-lesson-id').value; // String, có thể rỗng

        const title = document.getElementById('lesson-title').value.trim();
        const description = document.getElementById('lesson-description').value.trim(); // Nội dung text bài giảng
        const videoUrl = lessonContentVideoUrlInput.value.trim(); // URL video
        // Xử lý file upload (chỉ lấy tên file, backend không lưu file thực tế trong DB)
        const mediaFile = lessonContentMediaFile.files[0];
        const attachmentFile = lessonContentAttachmentFile.files[0];

        if (!title) { alert("Vui lòng nhập Tên Bài giảng."); return; }
        if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
            alert("Vui lòng đăng nhập để thực hiện."); return;
        }

        let lessonPayloadContent = {};
        if (videoUrl) { // Ưu tiên URL
            lessonPayloadContent.mediaUrl = videoUrl;
            try { // Cố gắng lấy tên file từ URL
                const urlObj = new URL(videoUrl);
                const pathParts = urlObj.pathname.split('/');
                lessonPayloadContent.mediaFileName = decodeURIComponent(pathParts[pathParts.length - 1]) || "Video từ URL";
            } catch (e) { lessonPayloadContent.mediaFileName = "Video từ URL"; }
        } else if (mediaFile) {
            // lessonPayloadContent.mediaUrl = mediaFile.name; // Backend sẽ không lưu file, chỉ tên
            lessonPayloadContent.mediaFileName = mediaFile.name;
            // Trong thực tế, bạn sẽ upload file này lên server và lấy URL trả về
            // Tạm thời, backend chỉ lưu mediaFileName để tham khảo
            alert("Chức năng upload file media chỉ là giả lập. Tên file sẽ được ghi nhận, nhưng không có file thực sự được tải lên server trong bản demo này. Hãy sử dụng URL video nếu có.");
        }

        if (attachmentFile) {
            // lessonPayloadContent.attachmentUrl = attachmentFile.name;
            lessonPayloadContent.attachmentFileName = attachmentFile.name;
            alert("Chức năng upload file đính kèm chỉ là giả lập. Tên file sẽ được ghi nhận.");
        }

        const lessonData = {
            title,
            description, // Nội dung text
            content: Object.keys(lessonPayloadContent).length > 0 ? lessonPayloadContent : null
        };

        let apiResponse;
        if (lessonIdToEdit) { // Sửa bài giảng
            apiResponse = await window.api.updateLessonApi(parseInt(lessonIdToEdit), lessonData, loggedInUser.id);
        } else { // Thêm bài giảng mới
            apiResponse = await window.api.createLessonApi(chapterId, lessonData, loggedInUser.id);
        }

        if (apiResponse.success) {
            alert(apiResponse.data.message || (lessonIdToEdit ? "Bài giảng đã được cập nhật." : "Bài giảng mới đã được thêm."));
            closeModal(lessonFormModal);
            if (currentDetailCourseId) {
                showCourseDetail(currentDetailCourseId, false); // Tải lại chi tiết khóa học
            }
        } else {
            alert(`Lỗi: ${apiResponse.error || apiResponse.data.message || 'Thao tác thất bại.'}`);
        }
    });
}

// --- Gắn Event Listener cho các nút Sửa/Xóa trong cấu trúc (MAJOR CHANGE) ---
function addStructureActionListeners(courseId, courseCreatorUserId) {
    // Xóa event listener cũ trước khi thêm mới để tránh bị gọi nhiều lần
    courseStructureRenderArea.querySelectorAll('.btn-edit-chapter, .btn-delete-chapter, .btn-add-lesson-to-chapter, .btn-edit-lesson, .btn-delete-lesson')
        .forEach(btn => {
            const newBtn = btn.cloneNode(true); // Tạo clone để xóa listener
            btn.parentNode.replaceChild(newBtn, btn);
        });

    // Chỉ thêm listener nếu là người tạo khóa học
    if (isLoggedIn && loggedInUser && loggedInUser.id === courseCreatorUserId) {
        courseStructureRenderArea.querySelectorAll('.btn-edit-chapter').forEach(btn => {
            btn.onclick = (e) => {
                const chapId = parseInt(e.target.closest('button').dataset.chapterId);
                openChapterForm(courseId, chapId);
            };
        });

        courseStructureRenderArea.querySelectorAll('.btn-delete-chapter').forEach(btn => {
            btn.onclick = async (e) => {
                const chapId = parseInt(e.target.closest('button').dataset.chapterId);
                if (confirm("Bạn có chắc chắn muốn xóa chương này và tất cả bài giảng bên trong không?")) {
                    const apiResponse = await window.api.deleteChapterApi(chapId, loggedInUser.id);
                    if (apiResponse.success) {
                        alert(apiResponse.data.message || "Chương đã được xóa.");
                        showCourseDetail(courseId, false); // Tải lại
                    } else {
                        alert(`Xóa chương thất bại: ${apiResponse.error || apiResponse.data.message || 'Lỗi không rõ'}`);
                    }
                }
            };
        });

        courseStructureRenderArea.querySelectorAll('.btn-add-lesson-to-chapter').forEach(btn => {
            btn.onclick = (e) => {
                const chapId = parseInt(e.target.closest('button').dataset.chapterId);
                openLessonForm(courseId, chapId); // lessonToEditId là null
            };
        });

        courseStructureRenderArea.querySelectorAll('.btn-edit-lesson').forEach(btn => {
            btn.onclick = (e) => {
                const button = e.target.closest('button');
                const chapId = parseInt(button.dataset.chapterId);
                const lessId = parseInt(button.dataset.lessonId);
                openLessonForm(courseId, chapId, lessId);
            };
        });

        courseStructureRenderArea.querySelectorAll('.btn-delete-lesson').forEach(btn => {
            btn.onclick = async (e) => {
                const button = e.target.closest('button');
                // const chapId = parseInt(button.dataset.chapterId); // Không cần chapterId cho API delete lesson
                const lessId = parseInt(button.dataset.lessonId);
                if (confirm("Bạn có chắc chắn muốn xóa bài giảng này không?")) {
                    const apiResponse = await window.api.deleteLessonApi(lessId, loggedInUser.id);
                    if (apiResponse.success) {
                        alert(apiResponse.data.message || "Bài giảng đã được xóa.");
                        showCourseDetail(courseId, false); // Tải lại
                    } else {
                        alert(`Xóa bài giảng thất bại: ${apiResponse.error || apiResponse.data.message || 'Lỗi không rõ'}`);
                    }
                }
            };
        });
    }
}