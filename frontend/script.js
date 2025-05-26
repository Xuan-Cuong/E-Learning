// frontend/script.js

// --- Global State ---
let isLoggedIn = false;
let loggedInUser = { // Bỏ role và enrolledCourses
    id: null,
    name: "",
    email: ""
};
let currentSection = 'homepage';
let currentDetailCourseId = null;
let currentLoadedCourseDetail = null;
let editingChapterId = null;
let editingLessonId = null;

// --- Get DOM Elements ---
const homepageSection = document.getElementById('homepage');
const allCoursesSection = document.getElementById('all-courses-section');
// const learningPlanSection = document.getElementById('learning-plan-section'); // ĐÃ XÓA
const userProfileSection = document.getElementById('user-profile-section');
const createCourseSection = document.getElementById('create-course-section');
const courseDetailSection = document.getElementById('course-detail-section');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const chapterFormModal = document.getElementById('chapter-form-modal');
const lessonFormModal = document.getElementById('lesson-form-modal');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const logoutBtn = document.querySelector('.logout-btn');
const authButtonsDiv = document.querySelector('.auth-buttons');
const userInfoDiv = document.querySelector('.user-info');
const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');
const userDisplayNameSpan = document.getElementById('user-display-name');
const profileDisplayNameSpan = document.getElementById('profile-display-name');
const profileDisplayEmailSpan = document.getElementById('profile-display-email');
// const profileDisplayRoleSpan = document.getElementById('profile-display-role'); // ĐÃ XÓA
const profileActionsDiv = document.getElementById('profile-actions');
const profileCoursesSection = document.getElementById('profile-courses-section');
const closeModalButtons = document.querySelectorAll('.modal .close-button');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const createCourseForm = document.getElementById('create-course-form');
const chapterForm = document.getElementById('chapter-form');
const lessonForm = document.getElementById('lesson-form');
const ctaTrialBtn = document.querySelector('.cta-trial');
const ctaCreateBtn = document.querySelector('.cta-create'); // Nút "Tạo khóa học ngay"
const featuredCourseListDiv = document.getElementById('featured-course-list');
const allCourseListDiv = document.getElementById('all-course-list');
const courseSearchInput = document.getElementById('course-search-input');
const courseSearchButton = document.getElementById('course-search-button');
const detailCourseTitle = document.getElementById('detail-course-title');
const detailCourseInstructor = document.getElementById('detail-course-instructor');
const detailCoursePrice = document.getElementById('detail-course-price');
const detailCourseDescription = document.getElementById('detail-course-description');
const instructorCourseAside = document.getElementById('instructor-course-aside');
const instructorAsideActionsList = document.getElementById('instructor-aside-actions');
const studentCourseActionsDiv = document.getElementById('student-course-actions'); // Sẽ không có nút đăng ký
const courseContentDisplayArea = document.getElementById('course-content-display-area');
const courseStructureRenderArea = document.getElementById('course-structure-render-area');
const instructorLessonManagementTools = document.getElementById('instructor-lesson-management-tools');
const detailCourseFilesList = document.getElementById('detail-course-files');
const detailCourseVideoPlayer = courseDetailSection.querySelector('.course-video-player-lw');
const backToListOrHomeButton = document.getElementById('back-to-list-or-home');
const lessonContentVideoUrlInput = document.getElementById('lesson-content-video-url');
const logoHomeLink = document.getElementById('home-link');
let navLinks = document.querySelectorAll('.main-nav a.nav-link'); // Sẽ cập nhật sau khi DOM load
const lessonContentMediaFile = document.getElementById('lesson-content-media-file');
const lessonMediaFileNameDisplay = document.getElementById('lesson-media-file-name-display');
const lessonContentAttachmentFile = document.getElementById('lesson-content-attachment-file');
const lessonAttachmentFileNameDisplay = document.getElementById('lesson-attachment-file-name-display');
// const navManageCoursesItem = document.querySelector('.main-nav ul li.nav-manage-courses-item'); // ĐÃ XÓA
// const navLinkManageCourses = document.getElementById('nav-link-manage-courses'); // ĐÃ XÓA

function showSection(sectionElement, state, pushHistory = true) {
    const sections = [homepageSection, allCoursesSection, userProfileSection, createCourseSection, courseDetailSection];
    // learningPlanSection đã bị xóa
    let sectionIdToShow = null;

    sections.forEach(section => {
        if (section === sectionElement) {
            section.classList.remove('hidden');
            sectionIdToShow = section.id;
        } else {
            section.classList.add('hidden');
        }
    });
    
    navLinks.forEach(link => {
        // Bỏ learning-plan khỏi mảng kiểm tra
        if (link.dataset.section === sectionIdToShow && ['homepage', 'all-courses'].includes(link.dataset.section)) {
            link.classList.add('active-nav');
        } else {
            link.classList.remove('active-nav');
        }
    });
    // Bỏ logic navLinkManageCourses

    if (pushHistory) {
        const historyState = { section: sectionIdToShow, courseId: state ? state.courseId : undefined };
        let hash = `#${sectionIdToShow}`;
        if (sectionIdToShow === 'course-detail-section' && state && state.courseId) {
            hash = `#detail-${state.courseId}`;
        }
        history.pushState(historyState, '', hash);
    }
    currentSection = sectionIdToShow; 
    if (sectionIdToShow === 'course-detail-section') {
        if(backToListOrHomeButton) backToListOrHomeButton.innerHTML = '<i class="fas fa-arrow-left"></i> Trở về Danh sách';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'block';
        document.body.classList.add('modal-open');
    }
}

function closeModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
        const forms = modalElement.querySelectorAll('form');
        forms.forEach(form => {
            if (form) form.reset();
        });

        // Không còn role selection để reset
        if (modalElement.id === 'lesson-form-modal') {
            if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.textContent = '';
            if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.textContent = '';
            if(lessonContentMediaFile) lessonContentMediaFile.value = '';
            if(lessonContentAttachmentFile) lessonContentAttachmentFile.value = '';
        }
        editingChapterId = null;
        editingLessonId = null;
    }
}

function updateAuthUI() {
    if (isLoggedIn && loggedInUser && loggedInUser.id) {
        if (authButtonsDiv) authButtonsDiv.classList.add('hidden');
        if (userInfoDiv) userInfoDiv.classList.remove('hidden');
        if (userDisplayNameSpan) userDisplayNameSpan.textContent = loggedInUser.name;
        if (userAvatarPlaceholder) userAvatarPlaceholder.textContent = loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : '?';
        if (profileDisplayNameSpan) profileDisplayNameSpan.textContent = loggedInUser.name;
        if (profileDisplayEmailSpan) profileDisplayEmailSpan.textContent = loggedInUser.email;
        // Bỏ profileDisplayRoleSpan
        // Bỏ navManageCoursesItem logic
        updateProfileContent();
    } else {
        if (authButtonsDiv) authButtonsDiv.classList.remove('hidden');
        if (userInfoDiv) userInfoDiv.classList.add('hidden');
        if (userDisplayNameSpan) userDisplayNameSpan.textContent = "";
        if (userAvatarPlaceholder) userAvatarPlaceholder.textContent = "";
        if (profileDisplayNameSpan) profileDisplayNameSpan.textContent = "";
        if (profileDisplayEmailSpan) profileDisplayEmailSpan.textContent = "";
        // Bỏ profileDisplayRoleSpan
        if (profileActionsDiv) profileActionsDiv.innerHTML = "";
        if (profileCoursesSection) profileCoursesSection.innerHTML = "";
        // Bỏ navManageCoursesItem logic
    }
}

async function updateProfileContent() {
    if (!profileActionsDiv || !profileCoursesSection) return;
    profileActionsDiv.innerHTML = "";
    profileCoursesSection.innerHTML = "";

    if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
        profileCoursesSection.innerHTML = "<p>Đăng nhập để xem thông tin cá nhân và các khóa học bạn đã tạo.</p>";
        return;
    }
    
    // Bất kỳ ai đăng nhập cũng có thể tạo khóa học
    const createCourseBtnProfile = document.createElement('button');
    createCourseBtnProfile.classList.add('btn', 'btn-primary');
    createCourseBtnProfile.innerHTML = '<i class="fas fa-plus-circle"></i> Tạo Khóa học mới';
    createCourseBtnProfile.addEventListener('click', () => {
        navigateToSection('create-course');
    });
    profileActionsDiv.appendChild(createCourseBtnProfile);

    // Hiển thị các khóa học người dùng đã tạo
    profileCoursesSection.innerHTML += `<h3><i class="fas fa-chalkboard-teacher"></i> Khóa học của tôi (Đã tạo)</h3>`;

    const apiResponse = await window.api.getUserCoursesApi(loggedInUser.id);

    if (apiResponse.success && apiResponse.data) {
        const userCourses = apiResponse.data;
        if (userCourses.length > 0) {
            const coursesGrid = document.createElement('div');
            coursesGrid.classList.add('user-course-list-grid');
            profileCoursesSection.appendChild(coursesGrid);
            displayCourses(userCourses, coursesGrid);
        } else {
            profileCoursesSection.innerHTML += `<p>Bạn chưa tạo khóa học nào. <a href="#" data-section="create-course" class="nav-link profile-nav-link">Tạo khóa học đầu tiên!</a></p>`;
        }
    } else {
        profileCoursesSection.innerHTML += `<p>Lỗi khi tải danh sách khóa học: ${apiResponse.error || 'Không rõ lỗi'}</p>`;
    }

    const createCourseLink = profileCoursesSection.querySelector('a.profile-nav-link[data-section="create-course"]');
    if (createCourseLink) {
        createCourseLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection('create-course');
        });
    }
}

function displayCourses(coursesToDisplay, targetElement) {
    if (!targetElement) return;
    targetElement.innerHTML = '';
    if (!coursesToDisplay || coursesToDisplay.length === 0) {
        targetElement.innerHTML = '<p style="text-align: center; width: 100%;">Không tìm thấy khóa học nào phù hợp.</p>';
        return;
    }

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card-lw');
        courseCard.dataset.courseId = course.id;

        courseCard.innerHTML = `
            <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}" alt="${course.title}">
            <div class="card-info-lw">
                <h3>${course.title}</h3>
                <p class="instructor">Người tạo: ${course.instructor}</p> <!-- Sửa text -->
                <p class="price">${course.price}</p>
            </div>
        `;
        targetElement.appendChild(courseCard);
        courseCard.addEventListener('click', () => {
            localStorage.setItem('previousSectionBeforeDetail', currentSection);
            showCourseDetail(course.id);
        });
    });
}

async function showCourseDetail(courseId, pushHistory = true) {
    currentDetailCourseId = courseId;
    const apiResponse = await window.api.getCourseDetailApi(courseId);

    if (!apiResponse.success || !apiResponse.data) {
        alert(`Không tìm thấy thông tin khóa học: ${apiResponse.error || 'Lỗi không xác định'}`);
        currentLoadedCourseDetail = null;
        if (history.length > 1 && history.state && history.state.section !== 'course-detail-section') history.back();
        else navigateToSection('homepage', null, false);
        return;
    }

    const course = apiResponse.data;
    currentLoadedCourseDetail = course; 

    if(detailCourseTitle) detailCourseTitle.textContent = course.title;
    if(detailCourseInstructor) detailCourseInstructor.textContent = `Người tạo: ${course.instructor}`; // Sửa text
    if(detailCoursePrice) detailCoursePrice.textContent = `Giá: ${course.price}`;
    if(detailCourseDescription) detailCourseDescription.textContent = course.description;
    if(studentCourseActionsDiv) studentCourseActionsDiv.innerHTML = ''; // Xóa nút đăng ký
    if(instructorCourseAside) instructorCourseAside.classList.add('hidden');
    if(instructorLessonManagementTools) instructorLessonManagementTools.classList.add('hidden');

    // Logic quản lý khóa học cho người tạo
    if (isLoggedIn && loggedInUser && loggedInUser.id && course.creatorUserID === loggedInUser.id) {
        if(instructorCourseAside) instructorCourseAside.classList.remove('hidden');
        const allAsideLinks = instructorAsideActionsList.querySelectorAll('a');
        allAsideLinks.forEach(link => link.classList.remove('active-aside-link'));
        const manageLessonsLink = instructorAsideActionsList.querySelector('a[data-action="manage-lessons"]');
        if (manageLessonsLink) {
            manageLessonsLink.classList.add('active-aside-link');
            setTimeout(() => handleInstructorAsideAction("manage-lessons", course.id, false), 0);
        }
    }
    // Bỏ logic cho "Học viên" và nút "Đăng ký học"

    renderCourseStructure(course);

    if(detailCourseFilesList) detailCourseFilesList.innerHTML = '';
    if (course.files && course.files.length > 0) {
        course.files.forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="event.preventDefault(); alert('Tải xuống file chung: ${file.fileName || file}')"><i class="fas fa-file-download"></i> ${file.fileName || file}</a>`;
            if(detailCourseFilesList) detailCourseFilesList.appendChild(li);
        });
    } else {
        if(detailCourseFilesList) detailCourseFilesList.innerHTML = '<li>Không có tài liệu chung cho khóa học.</li>';
    }

    if (course.structure && course.structure.length > 0 && course.structure[0].lessons && course.structure[0].lessons.length > 0) {
        displayLessonContent(course, course.structure[0].id, course.structure[0].lessons[0].id);
    } else {
        if(detailCourseVideoPlayer) detailCourseVideoPlayer.innerHTML = `<div class="placeholder-video-lw"><i class="fas fa-play-circle"></i> <p>Chọn một bài giảng từ cấu trúc khóa học để xem nội dung.</p></div>`;
    }

    showSection(courseDetailSection, { section: 'course-detail-section', courseId: courseId }, pushHistory);
}

function renderCourseStructure(course) {
    if (!courseStructureRenderArea || !course) return;
    courseStructureRenderArea.innerHTML = '';
    if (!course.structure || course.structure.length === 0) {
        courseStructureRenderArea.innerHTML = '<p>Khóa học này hiện chưa có nội dung bài giảng chi tiết.</p>';
        return;
    }

    course.structure.forEach(chapter => {
        const chapterDiv = document.createElement('div');
        chapterDiv.classList.add('chapter-block');
        chapterDiv.dataset.chapterId = chapter.id;

        const chapterHeader = document.createElement('div');
        chapterHeader.classList.add('chapter-header');
        const cleanChapterTitle = chapter.title.trim();
        chapterHeader.innerHTML = `
            <h4>
                <i class="fas fa-folder-open"></i> ${cleanChapterTitle}
                <span class="chapter-toggle-icon"><i class="fas fa-chevron-down"></i></span>
            </h4>
        `;
        // Chỉ hiển thị nút quản lý cho người tạo khóa học
        if (isLoggedIn && loggedInUser && loggedInUser.id === course.creatorUserID) { 
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
            chapter.lessons.forEach(lesson => {
                const lessonItem = document.createElement('li');
                lessonItem.classList.add('lesson-item');
                lessonItem.dataset.lessonId = lesson.id;

                let iconClass = 'fa-chalkboard-teacher';
                if (lesson.content && (lesson.content.mediaUrl || lesson.content.mediaFileName)) {
                    const fileNameForIcon = lesson.content.mediaFileName || (lesson.content.mediaUrl && lesson.content.mediaUrl.startsWith('http') ? lesson.content.mediaUrl.split('/').pop() : 'unknown.file');
                    const ext = fileNameForIcon.split('.').pop().toLowerCase();
                    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) iconClass = 'fa-video';
                    else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) iconClass = 'fa-image';
                    else if (lesson.content.mediaUrl && lesson.content.mediaUrl.includes("youtube.com/embed")) iconClass = 'fa-youtube fab';
                } else if (lesson.content && (lesson.content.attachmentUrl || lesson.content.attachmentFileName)) {
                    iconClass = 'fa-paperclip';
                }
                const cleanLessonTitle = lesson.title.trim();
                lessonItem.innerHTML = `
                    <div class="lesson-info">
                        <i class="fas ${iconClass} lesson-icon"></i>
                        <span class="lesson-title">${cleanLessonTitle}</span>
                        ${lesson.description && lesson.description.length > 50 ? `<small class="lesson-short-desc">${lesson.description.substring(0,50)}...</small>` : (lesson.description ? `<small class="lesson-short-desc">${lesson.description}</small>` : '')}
                    </div>
                    <div class="lesson-meta">
                        ${isLoggedIn && loggedInUser && loggedInUser.id === course.creatorUserID ? ` 
                            <div class="content-actions lesson-actions-inline">
                                <button class="btn btn-xs btn-outline btn-edit-lesson" data-chapter-id="${chapter.id}" data-lesson-id="${lesson.id}"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-xs btn-danger btn-delete-lesson" data-chapter-id="${chapter.id}" data-lesson-id="${lesson.id}"><i class="fas fa-trash"></i></button>
                            </div>` : ''}
                    </div>`;
                const lessonTitleElement = lessonItem.querySelector('.lesson-info .lesson-title');
                if (lessonTitleElement) {
                    lessonTitleElement.addEventListener('click', () => {
                        displayLessonContent(course, chapter.id, lesson.id);
                    });
                }
                lessonList.appendChild(lessonItem);
            });
            lessonListDiv.appendChild(lessonList);
        } else {
            lessonListDiv.innerHTML = '<p class="no-lessons-msg">Chưa có bài học nào trong chương này.</p>';
        }
        chapterDiv.appendChild(lessonListDiv);
        courseStructureRenderArea.appendChild(chapterDiv);

        const chapterTitleElement = chapterHeader.querySelector('h4');
        if(chapterTitleElement){
            chapterTitleElement.addEventListener('click', (e) => {
                if (!e.target.closest('button')) { 
                    lessonListDiv.classList.toggle('collapsed');
                    const icon = chapterHeader.querySelector('.chapter-toggle-icon i');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-down');
                        icon.classList.toggle('fa-chevron-up');
                    }
                }
            });
        }
    });
    addStructureActionListeners(course.id, course.creatorUserID);
}

function displayLessonContent(course, chapterId, lessonId) {
    if (!detailCourseVideoPlayer || !course || !course.structure) return;

    const chapter = course.structure.find(ch => ch.id === chapterId);
    if (!chapter || !chapter.lessons) { console.error("Chapter not found in displayLessonContent", chapterId, course); return; }
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (!lesson) { console.error("Lesson not found in displayLessonContent", lessonId, chapter); return; }

    detailCourseVideoPlayer.innerHTML = '';
    let contentHTML = '';
    let hasMediaOrText = false;

    if (lesson.description) {
        hasMediaOrText = true;
        contentHTML += `<div class="text-content-display"><h4>Nội dung bài giảng:</h4><p>${lesson.description.replace(/\n/g, '<br>')}</p></div>`;
    }

    if (lesson.content && lesson.content.mediaUrl) {
        hasMediaOrText = true;
        const mediaUrl = lesson.content.mediaUrl;
        const mediaFileName = lesson.content.mediaFileName || "Media File";
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
            mediaDisplayHTML = `<video controls width="100%" style="max-height: 400px; border-radius: var(--border-radius);"><source src="${mediaUrl}" type="video/${mediaUrl.split('.').pop().toLowerCase()}">Trình duyệt của bạn không hỗ trợ thẻ video.</video>`;
        } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl) && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
            mediaDisplayHTML = `<img src="${mediaUrl}" alt="${mediaFileName}" style="max-width: 100%; max-height: 400px; border-radius: var(--border-radius); object-fit: contain;" />`;
        } else if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
             mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-link"></i><p>Media từ URL: <a href="${mediaUrl}" target="_blank" rel="noopener noreferrer">${mediaFileName}</a></p><small>Nội dung này có thể cần được mở trong tab mới hoặc tải xuống.</small></div>`;
        } else if (mediaFileName) {
            const fileExtension = mediaFileName.split('.').pop().toLowerCase();
            if (['mp4', 'webm', 'ogv', 'ogg', 'mov'].includes(fileExtension)) {
                mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-film"></i><p>Video (Cần URL thực tế): ${mediaFileName}</p></div>`;
            } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension)) {
                mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-image"></i><p>Ảnh (Cần URL thực tế): ${mediaFileName}</p><img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(mediaFileName.substring(0,20))}" alt="${mediaFileName}" /></div>`;
            } else {
                 mediaDisplayHTML = `<div class="placeholder-video-lw simulated-file"><i class="fas fa-file-audio"></i><p>Media (Cần URL thực tế): ${mediaFileName}</p></div>`;
            }
        }
        contentHTML = `<div class="lesson-media-wrapper" style="margin-bottom: 20px;">${mediaDisplayHTML}</div>` + contentHTML;
    }

    if (lesson.content && lesson.content.attachmentUrl) {
        hasMediaOrText = true;
        const attachmentUrl = lesson.content.attachmentUrl;
        const attachmentFileName = lesson.content.attachmentFileName || "Tải file";
        const downloadButton = (attachmentUrl.startsWith('http://') || attachmentUrl.startsWith('https://'))
            ? `<a href="${attachmentUrl}" target="_blank" download="${attachmentFileName}" class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Tải xuống</a>`
            : `<button class="btn btn-secondary btn-sm" disabled><i class="fas fa-download"></i> Tải xuống (Cần URL)</button>`;
        contentHTML += `<div class="course-attachment-section"><h4><i class="fas fa-paperclip"></i> File đính kèm:</h4><p><i class="fas fa-file"></i> ${attachmentFileName} ${downloadButton}</p></div>`;
    }

    if (!hasMediaOrText) {
        contentHTML = `<div class="placeholder-video-lw"><i class="fas fa-info-circle"></i> <p>Bài giảng "${lesson.title}" hiện chưa có nội dung media, mô tả hoặc file đính kèm.</p></div>`;
    }
    detailCourseVideoPlayer.innerHTML = contentHTML;

    courseStructureRenderArea.querySelectorAll('.lesson-item.active-lesson').forEach(item => item.classList.remove('active-lesson'));
    const activeLessonElement = courseStructureRenderArea.querySelector(`.lesson-item[data-lesson-id="${lessonId}"]`);
    if (activeLessonElement) activeLessonElement.classList.add('active-lesson');
}

async function handleInstructorAsideAction(action, courseId, showAlert = true) {
    if (!instructorAsideActionsList || !instructorLessonManagementTools || !courseStructureRenderArea) return;

    const allAsideLinks = instructorAsideActionsList.querySelectorAll('a');
    allAsideLinks.forEach(link => link.classList.remove('active-aside-link'));
    const clickedLink = instructorAsideActionsList.querySelector(`a[data-action="${action}"]`);
    if (clickedLink) clickedLink.classList.add('active-aside-link');

    instructorLessonManagementTools.classList.add('hidden');
    courseStructureRenderArea.classList.remove('editing-mode');

    switch (action) {
        case 'manage-lessons':
        case 'add-content':
            const detailResp = await window.api.getCourseDetailApi(courseId);
            if(detailResp.success && detailResp.data) {
                currentLoadedCourseDetail = detailResp.data; 
                renderCourseStructure(detailResp.data);
                // Chỉ hiển thị nếu là người tạo
                if (isLoggedIn && loggedInUser && loggedInUser.id === currentLoadedCourseDetail.creatorUserID) {
                    instructorLessonManagementTools.classList.remove('hidden');
                    courseStructureRenderArea.classList.add('editing-mode');
                }
                if (action === 'add-content' && showAlert) {
                    alert(`Sẵn sàng thêm nội dung. Sử dụng các nút trong phần Nội dung Khóa học.`);
                    const addChapterBtn = instructorLessonManagementTools.querySelector('.btn-add-chapter');
                    if(addChapterBtn) addChapterBtn.focus();
                } else if (action === 'manage-lessons' && showAlert) {
                     alert(`Chế độ Quản lý Bài giảng. Sử dụng các nút trong phần Nội dung Khóa học.`);
                }
            } else {
                alert("Lỗi khi tải lại cấu trúc khóa học.");
            }
            break;
        case 'edit-course-info':
            setupEditCourseForm(courseId);
            break;
        case 'delete-course':
            const courseInfoForDelete = await window.api.getCourseDetailApi(courseId);
            if (courseInfoForDelete.success && courseInfoForDelete.data) {
                if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ khóa học "${courseInfoForDelete.data.title}" không? Việc này không thể hoàn tác.`)) {
                    const deleteResponse = await window.api.deleteCourseApi(courseId, loggedInUser.id);
                    if (deleteResponse.success) {
                        alert(deleteResponse.data.message || `Khóa học đã bị xóa.`);
                        currentLoadedCourseDetail = null;
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
                 currentLoadedCourseDetail = defaultDetailResp.data;
                 renderCourseStructure(defaultDetailResp.data);
            }
            break;
    }
}

async function navigateToSection(sectionId, entityId = null, pushHistory = true) {
    let sectionElement;
    let state = { section: sectionId, courseId: (sectionId === 'course-detail-section' ? entityId : null) };
    currentDetailCourseId = (sectionId === 'course-detail-section' ? entityId : null);
    if (sectionId !== 'course-detail-section') currentLoadedCourseDetail = null; 

    switch (sectionId) {
        case 'homepage':
            sectionElement = homepageSection;
            const homeCoursesResp = await window.api.getCoursesApi(6);
            if (homeCoursesResp.success) {
                displayCourses(homeCoursesResp.data, featuredCourseListDiv);
            } else {
                if (featuredCourseListDiv) featuredCourseListDiv.innerHTML = `<p>Lỗi khi tải khóa học: ${homeCoursesResp.error}</p>`;
            }
            break;
        case 'all-courses':
            sectionElement = allCoursesSection;
            const allCoursesResp = await window.api.getCoursesApi();
            if (allCoursesResp.success) {
                displayCourses(allCoursesResp.data, allCourseListDiv);
            } else {
                if (allCourseListDiv) allCourseListDiv.innerHTML = `<p>Lỗi khi tải khóa học: ${allCoursesResp.error}</p>`;
            }
            break;
        // case 'learning-plan': // Đã xóa
        //     sectionElement = learningPlanSection;
        //     if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
        //         alert("Vui lòng đăng nhập để xem kế hoạch học tập.");
        //         openModal(loginModal);
        //         return;
        //     }
        //     break;
        case 'user-profile':
            if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
                alert("Vui lòng đăng nhập để xem thông tin cá nhân.");
                openModal(loginModal);
                return;
            }
            sectionElement = userProfileSection;
            updateProfileContent(); 
            break;
        case 'create-course':
            // Bất kỳ ai đăng nhập cũng có thể tạo khóa học
            if (!isLoggedIn || !loggedInUser || !loggedInUser.id) {
                alert("Vui lòng đăng nhập để tạo khóa học.");
                openModal(loginModal);
                return; 
            } 
            sectionElement = createCourseSection;
            if (createCourseForm) createCourseForm.reset();
            const createCourseTitleH2 = document.getElementById('create-course-section')?.querySelector('h2');
            if(createCourseTitleH2) createCourseTitleH2.textContent = "Tạo khóa học mới";

            const existingIdInput = createCourseForm?.querySelector('input[name="editing_course_id"]');
            if (existingIdInput) existingIdInput.remove();
            const createCourseSubmitBtn = createCourseForm?.querySelector('.submit-course-btn');
            if(createCourseSubmitBtn) createCourseSubmitBtn.textContent = "Tạo khóa học";
            break;
        case 'course-detail-section':
             if (entityId !== null) {
                showCourseDetail(entityId, pushHistory); 
            } else {
                console.error("navigateToSection: courseId is null for course-detail-section");
                navigateToSection('homepage'); 
            }
            return; 
        default:
            sectionElement = homepageSection;
            const defaultCoursesResp = await window.api.getCoursesApi(6);
            if (defaultCoursesResp.success) {
                displayCourses(defaultCoursesResp.data, featuredCourseListDiv);
            }
          sectionId = 'homepage'; 
            state = { section: sectionId, courseId: null }; // Hoàn thành dòng này
            break;
    }
    if (sectionElement && sectionId !== 'course-detail-section') { 
        showSection(sectionElement, state, pushHistory);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    navLinks = document.querySelectorAll('.main-nav a.nav-link'); // Cập nhật navLinks sau khi DOM load

    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        try {
            loggedInUser = JSON.parse(storedUser);
            isLoggedIn = true;
        } catch (e) {
            console.error("Error parsing stored user data:", e);
            localStorage.removeItem('loggedInUser');
            isLoggedIn = false;
            loggedInUser = { id: null, name: "", email: "" }; // Bỏ role
        }
    }
    updateAuthUI(); 

    const initialHash = window.location.hash ? window.location.hash.substring(1) : '';
    let initialSectionId = 'homepage', initialCourseId = null;

    if (initialHash.startsWith('detail-')) {
        const parts = initialHash.split('-');
        if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
            initialSectionId = 'course-detail-section';
            initialCourseId = parseInt(parts[1]);
        }
    } else if (initialHash) {
        // Bỏ learning-plan
        const knownSections = ['homepage', 'all-courses', 'user-profile', 'create-course'];
        if (knownSections.includes(initialHash)) initialSectionId = initialHash;
    }
    navigateToSection(initialSectionId || 'homepage', initialCourseId, false); 

    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.section) {
            navigateToSection(state.section, state.courseId, false); 
        } else {
            navigateToSection('homepage', null, false);
        }
    });

    if(loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if(signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalElement = document.getElementById(button.dataset.modal);
            if (modalElement) closeModal(modalElement);
        });
    });
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) closeModal(loginModal);
        if (event.target === signupModal) closeModal(signupModal);
        if (event.target === chapterFormModal) closeModal(chapterFormModal);
        if (event.target === lessonFormModal) closeModal(lessonFormModal);
    });
    if(showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); closeModal(loginModal); openModal(signupModal); });
    if(showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); closeModal(signupModal); openModal(loginModal); });

    if(loginForm) loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) { alert("Vui lòng nhập đủ email và mật khẩu."); return; }

        const apiResponse = await window.api.loginUserApi(email, password); 
        if (apiResponse.success && apiResponse.data.user) {
            loggedInUser = apiResponse.data.user; // Không còn role trong user data
            isLoggedIn = true;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            updateAuthUI();
            closeModal(loginModal);
            if (currentSection === 'homepage' || currentSection === 'all-courses' || !currentSection) {
                navigateToSection('user-profile', null, false); 
            } else if (currentSection === 'course-detail-section' && currentDetailCourseId) {
                showCourseDetail(currentDetailCourseId, false); 
            } else {
                navigateToSection(currentSection, currentDetailCourseId, false); 
            }
        } else {
            alert(`Đăng nhập thất bại: ${apiResponse.error || apiResponse.data.error || 'Email hoặc mật khẩu không đúng.'}`);
            localStorage.removeItem('loggedInUser'); 
        }
    });   

    if(signupForm) signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        // const roleInput = signupForm.querySelector('input[name="signup-role"]:checked'); // ĐÃ XÓA
        // const role = roleInput ? roleInput.value : 'Học viên'; // ĐÃ XÓA
        
        console.log('Signup Data being sent to API:', { name, email, password }); // Bỏ role

        if (!name || !email || !password || !confirmPassword) { alert("Vui lòng điền đủ thông tin."); return; }
        if (password !== confirmPassword) { alert("Mật khẩu xác nhận không khớp."); return; }

        // Gọi API đăng ký không có role
        const apiResponse = await window.api.registerUserApi(name, email, password);
        if (apiResponse.success) {
            alert(apiResponse.data.message || "Đăng ký thành công. Vui lòng đăng nhập.");
            closeModal(signupModal);
            openModal(loginModal); 
        } else {
            alert(`Đăng ký thất bại: ${apiResponse.error || apiResponse.data.error || 'Lỗi không rõ'}`);
        }
    });

    if(logoutBtn) logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        loggedInUser = { id: null, name: "", email: "" }; // Bỏ role
        currentLoadedCourseDetail = null;
        localStorage.removeItem('loggedInUser');
        updateAuthUI();
        if(instructorCourseAside) instructorCourseAside.classList.add('hidden');
        if(instructorLessonManagementTools) instructorLessonManagementTools.classList.add('hidden');
        if(courseStructureRenderArea) courseStructureRenderArea.classList.remove('editing-mode');
        currentDetailCourseId = null;
        editingChapterId = null;
        editingLessonId = null;
        navigateToSection('homepage', null, false); 
    });

    if(userInfoDiv) userInfoDiv.addEventListener('click', (e) => {
        if (!e.target.closest('.logout-btn') && isLoggedIn) navigateToSection('user-profile');
    });
    if(ctaTrialBtn) ctaTrialBtn.addEventListener('click', () => navigateToSection('all-courses'));
    
    if(ctaCreateBtn) ctaCreateBtn.addEventListener('click', () => { // Nút "Tạo khóa học ngay"
        if (isLoggedIn && loggedInUser && loggedInUser.id) { // Bất kỳ ai đăng nhập cũng có thể tạo
            navigateToSection('create-course');
        } else {
            alert('Vui lòng đăng nhập để tạo khóa học.'); 
            openModal(loginModal);
        }
    });

    if(createCourseForm) createCourseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('course-title').value.trim();
        const description = document.getElementById('course-description').value.trim();
        const price = document.getElementById('course-price').value.trim() || "Chưa xác định";
        const imageUrl = document.getElementById('course-image-url').value.trim();
        if (!title || !description) { alert("Vui lòng nhập đủ Tiêu đề và Mô tả khóa học."); return; }
        
        // Bất kỳ ai đăng nhập cũng có thể tạo/sửa
        if (!isLoggedIn || !loggedInUser || !loggedInUser.id) { 
            alert("Bạn phải đăng nhập để thực hiện hành động này.");
            return;
        }
        const courseData = { title, description, price, image: imageUrl || `https://via.placeholder.com/400x250?text=${encodeURIComponent(title.substring(0,15))}` };
        const editingIdInput = createCourseForm.querySelector('input[name="editing_course_id"]');
        let apiResponse;
        if (editingIdInput && editingIdInput.value) {
            const courseIdToEdit = parseInt(editingIdInput.value);
            apiResponse = await window.api.updateCourseApi(courseIdToEdit, courseData, loggedInUser.id);
            if (apiResponse.success) {
                alert(apiResponse.data.message || `Khóa học "${title}" đã được cập nhật thành công.`);
                createCourseForm.reset(); 
                if (editingIdInput) editingIdInput.remove(); 
                 const createCourseTitleH2 = document.getElementById('create-course-section')?.querySelector('h2');
                if(createCourseTitleH2) createCourseTitleH2.textContent = "Tạo khóa học mới";
                const createCourseSubmitBtn = createCourseForm?.querySelector('.submit-course-btn');
                if(createCourseSubmitBtn) createCourseSubmitBtn.textContent = "Tạo khóa học";
                showCourseDetail(courseIdToEdit, false); 
            } else {
                alert(`Cập nhật khóa học thất bại: ${apiResponse.error || apiResponse.data.error || 'Lỗi không rõ'}`);
            }
        } else {
            apiResponse = await window.api.createCourseApi(courseData, loggedInUser.id);
            if (apiResponse.success && apiResponse.data.course) {
                alert(apiResponse.data.message || `Khóa học "${title}" đã được tạo thành công.`);
                createCourseForm.reset();
                showCourseDetail(apiResponse.data.course.id, true); 
            } else {
                alert(`Tạo khóa học thất bại: ${apiResponse.error || apiResponse.data.error || 'Lỗi không rõ'}`);
            }
        }
    });

    if(backToListOrHomeButton) backToListOrHomeButton.addEventListener('click', () => {
        const previousSection = localStorage.getItem('previousSectionBeforeDetail');
        localStorage.removeItem('previousSectionBeforeDetail'); 

        if (previousSection && previousSection !== 'course-detail-section') {
            navigateToSection(previousSection, null, false);
        } else if (history.length > 1 && history.state && history.state.section !== 'course-detail-section') {
             history.back();
        }
        else {
            navigateToSection('all-courses', null, false); 
        }
    });
    if(logoHomeLink) logoHomeLink.addEventListener('click', (e) => { e.preventDefault(); navigateToSection('homepage'); });

    const mainNavUl = document.querySelector('.main-nav ul');
    if (mainNavUl) {
        mainNavUl.addEventListener('click', (e) => {
            const link = e.target.closest('a.nav-link');
            if (link && link.dataset.section) {
                e.preventDefault();
                // Bỏ logic navLinkManageCourses
                navigateToSection(link.dataset.section);
            }
        });
    }

    if (instructorAsideActionsList) {
        instructorAsideActionsList.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link && link.dataset.action && currentDetailCourseId !== null) {
                handleInstructorAsideAction(link.dataset.action, currentDetailCourseId);
            }
        });
    }
    const addChapterBtnGlobal = instructorLessonManagementTools?.querySelector('.btn-add-chapter');
    if (addChapterBtnGlobal) {
        addChapterBtnGlobal.addEventListener('click', () => {
            if (currentDetailCourseId !== null) openChapterForm(currentDetailCourseId);
        });
    }

    if(lessonContentMediaFile) {
        lessonContentMediaFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.innerHTML = `<i class="fas fa-photo-video"></i> ${this.files[0].name}`;
            } else {
                if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.textContent = '';
            }
        });
    }
    if(lessonContentAttachmentFile) {
        lessonContentAttachmentFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.innerHTML = `<i class="fas fa-paperclip"></i> ${this.files[0].name}`;
            } else {
                if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.textContent = '';
            }
        });
    }

    if(courseSearchButton) courseSearchButton.addEventListener('click', performFrontendSearchWithApi);
    if(courseSearchInput) courseSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performFrontendSearchWithApi(); }});

}); // END DOMContentLoaded

async function setupEditCourseForm(courseId) {
    const apiResponse = await window.api.getCourseDetailApi(courseId);
    if (!apiResponse.success || !apiResponse.data) {
        alert("Lỗi khi tải thông tin khóa học để sửa.");
        navigateToSection('user-profile'); 
        return;
    }
    const course = apiResponse.data;
    currentLoadedCourseDetail = course; 

    // Kiểm tra người tạo khóa học
    if (!isLoggedIn || !loggedInUser || loggedInUser.id !== course.creatorUserID) {
        alert("Bạn không có quyền sửa khóa học này.");
        showCourseDetail(courseId, false); 
        return;
    }
    navigateToSection('create-course', null, true); 
    
    setTimeout(() => {
        const createCourseSectionTitle = document.getElementById('create-course-section')?.querySelector('h2');
        if(createCourseSectionTitle) createCourseSectionTitle.textContent = `Sửa Khóa học: ${course.title}`;
        
        const courseTitleInput = document.getElementById('course-title');
        if(courseTitleInput) courseTitleInput.value = course.title;
        
        const courseDescInput = document.getElementById('course-description');
        if(courseDescInput) courseDescInput.value = course.description;
        
        const coursePriceInput = document.getElementById('course-price');
        if(coursePriceInput) coursePriceInput.value = course.price;
        
        const courseImgUrlInput = document.getElementById('course-image-url');
        if(courseImgUrlInput) courseImgUrlInput.value = course.image || '';
        
        const submitButton = createCourseForm?.querySelector('.submit-course-btn');
        if(submitButton) submitButton.textContent = "Lưu thay đổi";
        
        let idInput = createCourseForm?.querySelector('input[name="editing_course_id"]');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden'; 
            idInput.name = 'editing_course_id';
            if(createCourseForm) createCourseForm.appendChild(idInput);
        }
        idInput.value = course.id;
    }, 50); 
}

async function performFrontendSearchWithApi() {
    if (!courseSearchInput) return;
    const searchTerm = courseSearchInput.value.toLowerCase().trim();
    const onHomepage = currentSection === 'homepage';
    const onAllCourses = currentSection === 'all-courses';
    let targetList;
    let limit = null;

    if (onHomepage && !searchTerm) { 
        targetList = featuredCourseListDiv;
        limit = 6;
    } else { 
        targetList = allCourseListDiv;
        if (!onAllCourses) {
            navigateToSection('all-courses', null, true);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    
    const apiResponse = await window.api.getCoursesApi(limit, searchTerm);
    if (apiResponse.success) {
        displayCourses(apiResponse.data, targetList);
    } else {
        if (targetList) targetList.innerHTML = `<p>Lỗi khi tìm kiếm/tải khóa học: ${apiResponse.error}</p>`;
    }
}

function openChapterForm(courseId, chapterToEditId = null) {
    if (!chapterFormModal || !chapterForm) return;
    editingChapterId = chapterToEditId; 
    
    let courseIdInput = document.getElementById('chapter-form-course-id');
    if (!courseIdInput) { 
        console.error("chapter-form-course-id input not found!"); return;
    }
    courseIdInput.value = courseId;

    let chapterIdHiddenInput = document.getElementById('chapter-form-chapter-id');
    if (!chapterIdHiddenInput) { 
        console.error("chapter-form-chapter-id input not found!"); return;
    }

    const modalTitle = chapterFormModal.querySelector('h2');
    const submitBtn = chapterForm.querySelector('button[type="submit"]');
    const chapterTitleInput = document.getElementById('chapter-title');
    const chapterDescriptionInput = document.getElementById('chapter-description');

    chapterForm.reset(); 

    if (editingChapterId && currentLoadedCourseDetail && currentLoadedCourseDetail.structure) {
        if (modalTitle) modalTitle.textContent = "Sửa Chương";
        const chapterObj = currentLoadedCourseDetail.structure.find(ch => ch.id === editingChapterId);
        if (chapterObj) {
            if(chapterTitleInput) chapterTitleInput.value = chapterObj.title;
            if(chapterDescriptionInput) chapterDescriptionInput.value = chapterObj.description || '';
        } else {
            console.warn("Không tìm thấy chapter để sửa trong currentLoadedCourseDetail. ID:", editingChapterId);
            editingChapterId = null; 
            if (modalTitle) modalTitle.textContent = "Thêm Chương Mới";
            if (submitBtn) submitBtn.textContent = "Thêm Chương";
            chapterIdHiddenInput.value = '';
            openModal(chapterFormModal); 
            return;
        }
        chapterIdHiddenInput.value = editingChapterId; 
        if(submitBtn) submitBtn.textContent = "Lưu Thay Đổi";
    } else {
        editingChapterId = null; 
        if(modalTitle) modalTitle.textContent = "Thêm Chương Mới";
        chapterIdHiddenInput.value = ''; 
        if(submitBtn) submitBtn.textContent = "Thêm Chương";
    }
    openModal(chapterFormModal);
}

if (chapterForm) {
    chapterForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const courseId = parseInt(document.getElementById('chapter-form-course-id').value);
        const chapterIdToEditValue = document.getElementById('chapter-form-chapter-id').value;
        const chapterIdToEdit = chapterIdToEditValue ? parseInt(chapterIdToEditValue) : null;

        const title = document.getElementById('chapter-title').value.trim();
        const description = document.getElementById('chapter-description').value.trim();

        if (!title) { alert("Vui lòng nhập Tên Chương."); return; }
        if (!isLoggedIn || !loggedInUser || !loggedInUser.id) { alert("Vui lòng đăng nhập để thực hiện."); return; }

        const chapterData = { title, description };
        let apiResponse;

        if (chapterIdToEdit) { 
            apiResponse = await window.api.updateChapterApi(chapterIdToEdit, chapterData, loggedInUser.id);
        } else { 
            apiResponse = await window.api.createChapterApi(courseId, chapterData, loggedInUser.id);
        }

        if (apiResponse.success) {
            alert(apiResponse.data.message || (chapterIdToEdit ? "Chương đã được cập nhật." : "Chương mới đã được thêm."));
            closeModal(chapterFormModal);
            if (currentDetailCourseId) { 
                showCourseDetail(currentDetailCourseId, false); 
            }
        } else {
            alert(`Lỗi: ${apiResponse.error || apiResponse.data.message || 'Thao tác thất bại.'}`);
        }
    });
}

function openLessonForm(courseId, chapterId, lessonToEditId = null) {
    if (!lessonFormModal || !lessonForm) return;
    editingLessonId = lessonToEditId; 
    
    document.getElementById('lesson-form-course-id').value = courseId; 
    document.getElementById('lesson-form-chapter-id').value = chapterId;
    
    let lessonIdHiddenInput = document.getElementById('lesson-form-lesson-id');
    if (!lessonIdHiddenInput) { console.error("lesson-form-lesson-id input not found!"); return; }

    const modalTitle = lessonFormModal.querySelector('h2');
    const submitBtn = lessonForm.querySelector('button[type="submit"]');
    const lessonTitleInput = document.getElementById('lesson-title');
    const lessonDescriptionInput = document.getElementById('lesson-description');
    
    lessonForm.reset(); 
    if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.textContent = '';
    if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.textContent = '';
    if(lessonContentMediaFile) lessonContentMediaFile.value = ''; 
    if(lessonContentAttachmentFile) lessonContentAttachmentFile.value = ''; 

    if (editingLessonId && currentLoadedCourseDetail && currentLoadedCourseDetail.structure) {
        if(modalTitle) modalTitle.textContent = "Sửa Bài giảng";
        if(submitBtn) submitBtn.textContent = "Lưu Thay Đổi";
        lessonIdHiddenInput.value = editingLessonId;

        const chapterObj = currentLoadedCourseDetail.structure.find(ch => ch.id === chapterId);
        if (chapterObj && chapterObj.lessons) {
            const lessonObj = chapterObj.lessons.find(l => l.id === editingLessonId);
            if (lessonObj) {
                if(lessonTitleInput) lessonTitleInput.value = lessonObj.title;
                if(lessonDescriptionInput) lessonDescriptionInput.value = lessonObj.description || '';
                if (lessonObj.content) {
                    if(lessonContentVideoUrlInput) lessonContentVideoUrlInput.value = lessonObj.content.mediaUrl || '';
                    if(lessonMediaFileNameDisplay && lessonObj.content.mediaFileName) {
                        lessonMediaFileNameDisplay.innerHTML = `<i class="fas fa-info-circle" style="color:var(--text-medium)"></i> Media hiện tại: ${lessonObj.content.mediaFileName} (Chọn file mới hoặc nhập URL để thay thế)`;
                    }
                    if(lessonAttachmentFileNameDisplay && lessonObj.content.attachmentFileName) {
                        lessonAttachmentFileNameDisplay.innerHTML = `<i class="fas fa-info-circle" style="color:var(--text-medium)"></i> Đính kèm hiện tại: ${lessonObj.content.attachmentFileName} (Chọn file mới để thay thế)`;
                    }
                }
            } else { 
                console.warn("Không tìm thấy lesson để sửa. ID:", editingLessonId);
                editingLessonId = null; 
                if (modalTitle) modalTitle.textContent = "Thêm Bài giảng mới";
                if (submitBtn) submitBtn.textContent = "Thêm Bài giảng";
                lessonIdHiddenInput.value = '';
                openModal(lessonFormModal);
                return;
            }
        } else { 
            console.warn("Không tìm thấy chapter chứa lesson để sửa. Chapter ID:", chapterId);
            closeModal(lessonFormModal); 
            return;
        }
    } else {
        editingLessonId = null; 
        if(modalTitle) modalTitle.textContent = "Thêm Bài giảng mới";
        lessonIdHiddenInput.value = '';
        if(submitBtn) submitBtn.textContent = "Thêm Bài giảng";
    }
    openModal(lessonFormModal);
}

if (lessonForm) {
    lessonForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const chapterId = parseInt(document.getElementById('lesson-form-chapter-id').value);
        const lessonIdToEditValue = document.getElementById('lesson-form-lesson-id').value;
        const lessonIdToEdit = lessonIdToEditValue ? parseInt(lessonIdToEditValue) : null;

        const title = document.getElementById('lesson-title').value.trim();
        const description = document.getElementById('lesson-description').value.trim();
        const videoUrl = lessonContentVideoUrlInput.value.trim();
        const mediaFile = lessonContentMediaFile.files[0];
        const attachmentFile = lessonContentAttachmentFile.files[0];

        if (!title) { alert("Vui lòng nhập Tên Bài giảng."); return; }
        if (!isLoggedIn || !loggedInUser || !loggedInUser.id) { alert("Vui lòng đăng nhập để thực hiện."); return; }

        let lessonPayloadContent = {};
        if (lessonIdToEdit && currentLoadedCourseDetail) {
            const chap = currentLoadedCourseDetail.structure.find(c => c.id === chapterId);
            if (chap && chap.lessons) {
                const oldLesson = chap.lessons.find(l => l.id === lessonIdToEdit);
                if (oldLesson && oldLesson.content) {
                    lessonPayloadContent = {...oldLesson.content}; 
                }
            }
        }

        if (videoUrl) { 
            lessonPayloadContent.mediaUrl = videoUrl;
            try { 
                const urlObj = new URL(videoUrl);
                const pathParts = urlObj.pathname.split('/');
                lessonPayloadContent.mediaFileName = decodeURIComponent(pathParts[pathParts.length - 1]) || "Video từ URL";
            } catch (e) { 
                lessonPayloadContent.mediaFileName = "Video từ URL"; 
            }
        } else if (mediaFile) { 
            lessonPayloadContent.mediaFileName = mediaFile.name;
            alert("Chức năng upload file media chỉ là giả lập. Tên file sẽ được ghi nhận, không có URL thực tế.");
        } else if (lessonIdToEdit && !videoUrl && !mediaFile) {
            // Giữ nguyên media cũ nếu đang sửa và không có input mới
        } else { 
            delete lessonPayloadContent.mediaUrl;
            delete lessonPayloadContent.mediaFileName;
        }

        if (attachmentFile) {
            lessonPayloadContent.attachmentFileName = attachmentFile.name;
            alert("Chức năng upload file đính kèm chỉ là giả lập. Tên file sẽ được ghi nhận, không có URL thực tế.");
        } else if (lessonIdToEdit && !attachmentFile) {
            // Giữ nguyên attachment cũ nếu đang sửa và không có input mới
        } else { 
            delete lessonPayloadContent.attachmentUrl;
            delete lessonPayloadContent.attachmentFileName;
        }

        const lessonData = { 
            title, 
            description, 
            content: Object.keys(lessonPayloadContent).length > 0 ? lessonPayloadContent : null 
        };
        let apiResponse;

        if (lessonIdToEdit) { 
            apiResponse = await window.api.updateLessonApi(lessonIdToEdit, lessonData, loggedInUser.id);
        } else { 
            apiResponse = await window.api.createLessonApi(chapterId, lessonData, loggedInUser.id);
        }

        if (apiResponse.success) {
            alert(apiResponse.data.message || (lessonIdToEdit ? "Bài giảng đã được cập nhật." : "Bài giảng mới đã được thêm."));
            closeModal(lessonFormModal);
            if (currentDetailCourseId) { 
                showCourseDetail(currentDetailCourseId, false); 
            }
        } else {
            alert(`Lỗi: ${apiResponse.error || apiResponse.data.message || 'Thao tác thất bại.'}`);
        }
    });
}

function addStructureActionListeners(courseId, courseCreatorUserId) {
    if (!courseStructureRenderArea) return;
    
    const oldElement = courseStructureRenderArea;
    const newElement = oldElement.cloneNode(true); 
    oldElement.parentNode.replaceChild(newElement, oldElement);
    
    const renderAreaForListeners = newElement; 

    // Chỉ thêm listener nếu là người tạo khóa học
    if (isLoggedIn && loggedInUser && loggedInUser.id === courseCreatorUserId) {
        renderAreaForListeners.querySelectorAll('.btn-edit-chapter').forEach(btn => {
            btn.addEventListener('click', (e) => { 
                const chapId = parseInt(e.currentTarget.dataset.chapterId);
                openChapterForm(courseId, chapId);
            });
        });
        renderAreaForListeners.querySelectorAll('.btn-delete-chapter').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const chapId = parseInt(e.currentTarget.dataset.chapterId);
                if (confirm("Bạn có chắc chắn muốn xóa chương này và tất cả bài giảng bên trong không?")) {
                    const apiResponse = await window.api.deleteChapterApi(chapId, loggedInUser.id);
                    if (apiResponse.success) {
                        alert(apiResponse.data.message || "Chương đã được xóa.");
                        showCourseDetail(courseId, false); 
                    } else {
                        alert(`Xóa chương thất bại: ${apiResponse.error || apiResponse.data.message || 'Lỗi không rõ'}`);
                    }
                }
            });
        });
        renderAreaForListeners.querySelectorAll('.btn-add-lesson-to-chapter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chapId = parseInt(e.currentTarget.dataset.chapterId);
                openLessonForm(courseId, chapId); 
            });
        });
        renderAreaForListeners.querySelectorAll('.btn-edit-lesson').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const chapId = parseInt(button.dataset.chapterId);
                const lessId = parseInt(button.dataset.lessonId);
                openLessonForm(courseId, chapId, lessId); 
            });
        });
        renderAreaForListeners.querySelectorAll('.btn-delete-lesson').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.currentTarget;
                const lessId = parseInt(button.dataset.lessonId);
                if (confirm("Bạn có chắc chắn muốn xóa bài giảng này không?")) {
                    const apiResponse = await window.api.deleteLessonApi(lessId, loggedInUser.id);
                    if (apiResponse.success) {
                        alert(apiResponse.data.message || "Bài giảng đã được xóa.");
                        showCourseDetail(courseId, false); 
                    } else {
                        alert(`Xóa bài giảng thất bại: ${apiResponse.error || apiResponse.data.message || 'Lỗi không rõ'}`);
                    }
                }
            });
        });
    }
}