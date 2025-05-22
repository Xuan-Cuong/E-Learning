// --- Global State ---
let isLoggedIn = false;
let loggedInUser = {
    name: "",
    email: "",
    role: "",
    enrolledCourses: [],
};
let currentSection = 'homepage';
let currentDetailCourseId = null;
let editingChapterId = null;
let editingLessonId = null;

// Mock user data
let mockUsers = [
    { name: "Giang Vien A", email: "giangvien.a@giangvien.com", password: "password123", role: "Giảng viên", enrolledCourses: [] },
    { name: "Giang Vien B", email: "giangvien.b@giangvien.com", password: "password123", role: "Giảng viên", enrolledCourses: [] },
    { name: "Hoc Vien X", email: "hocvien.x@example.com", password: "password123", role: "Học viên", enrolledCourses: [2] },
    { name: "Test User", email: "a@gmail.com", password: "123", role: "Giảng viên", enrolledCourses: [] }
];

// Mock course data
let mockCourses = [
    {
        id: 1,
        title: "Lập trình Web cơ bản",
        instructor: "Giảng viên A",
        price: "Miễn phí",
        image: "https://via.placeholder.com/400x250?text=Web+Basics",
        description: "Khóa học giới thiệu các kiến thức cơ bản về HTML, CSS, JavaScript...",
        files: ["gioi_thieu_khoa_hoc.pdf"],
        creatorEmail: "giangvien.a@giangvien.com",
        structure: [
            {
                id: "c1", title: "Chương 1: Nhập môn HTML", description: "Giới thiệu HTML...",
                lessons: [
                    { id: "l1-1", title: "Bài 1.1: Video Giới thiệu HTML", description: "Tổng quan HTML.", content: { mediaUrl: "intro_html.mp4", mediaFileName: "intro_html.mp4" } },
                    { id: "l1-2", title: "Bài 1.2: Tài liệu HTML", description: "Tham khảo thẻ HTML.", content: { attachmentUrl: "html_tags.pdf", attachmentFileName: "html_tags.pdf" } }
                ]
            },
            {
                id: "c2", title: "Chương 2: Làm quen với CSS", description: "Tìm hiểu CSS...",
                lessons: [
                    { id: "l2-1", title: "Bài 2.1: Video CSS là gì?", description: "Giới thiệu CSS.", content: { mediaUrl: "https://www.youtube.com/embed/OEV8gHsW_c4", mediaFileName: "Video YouTube CSS" } }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Thiết kế Đồ họa với Photoshop",
        instructor: "Giảng viên B",
        price: "599.000 VNĐ",
        image: "https://via.placeholder.com/400x250?text=Photoshop",
        description: "Học cách sử dụng công cụ Photoshop để chỉnh sửa ảnh...",
        files: [],
        creatorEmail: "giangvien.b@giangvien.com",
        structure: [
            {
                id: "c1_ps", title: "Chương 1: Giới thiệu Photoshop", description: "Làm quen với Photoshop.",
                lessons: [
                    { id: "l1-1_ps", title: "Bài 1.1: Video Giao diện", description: "Không gian làm việc.", content: { mediaUrl: "ps_interface_sim.mp4", mediaFileName: "ps_interface_sim.mp4" } }
                ]
            }
        ]
    },
];

// --- Get DOM Elements ---
const homepageSection = document.getElementById('homepage');
const allCoursesSection = document.getElementById('all-courses-section');
const learningPlanSection = document.getElementById('learning-plan-section');
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
const profileDisplayRoleSpan = document.getElementById('profile-display-role');
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
const ctaCreateBtn = document.querySelector('.cta-create');
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
const studentCourseActionsDiv = document.getElementById('student-course-actions');
const courseContentDisplayArea = document.getElementById('course-content-display-area');
const courseStructureRenderArea = document.getElementById('course-structure-render-area');
const instructorLessonManagementTools = document.getElementById('instructor-lesson-management-tools');
const detailCourseFilesList = document.getElementById('detail-course-files');
const detailCourseVideoPlayer = courseDetailSection.querySelector('.course-video-player-lw');
const backToListOrHomeButton = document.getElementById('back-to-list-or-home');
const lessonContentVideoUrlInput = document.getElementById('lesson-content-video-url'); // THÊM MỚI
const logoHomeLink = document.getElementById('home-link');
const navLinks = document.querySelectorAll('.main-nav a.nav-link');
const lessonContentMediaFile = document.getElementById('lesson-content-media-file');
const lessonMediaFileNameDisplay = document.getElementById('lesson-media-file-name-display');
const lessonContentAttachmentFile = document.getElementById('lesson-content-attachment-file');
const lessonAttachmentFileNameDisplay = document.getElementById('lesson-attachment-file-name-display');

// Header action elements (updated structure)
const navManageCoursesItem = document.querySelector('.main-nav ul li.nav-manage-courses-item');
const navLinkManageCourses = document.getElementById('nav-link-manage-courses');
// ĐÃ XÓA: const instructorCreateButtonContainer = document.getElementById('instructor-create-button-container');
// ĐÃ XÓA: const headerBtnCreateCourse = document.getElementById('header-btn-create-course');


// --- Functions to manage view and history ---
function showSection(sectionElement, state, pushHistory = true) {
    const sections = [homepageSection, allCoursesSection, learningPlanSection, userProfileSection, createCourseSection, courseDetailSection];
    let sectionId = null;

    sections.forEach(section => {
        if (section === sectionElement) {
            section.classList.remove('hidden');
            sectionId = section.id;
        } else {
            section.classList.add('hidden');
        }
    });

    navLinks.forEach(link => {
        if (link.dataset.section === sectionId && ['homepage', 'all-courses', 'learning-plan', 'user-profile'].includes(link.dataset.section) ) {
            link.classList.add('active-nav');
        } else {
            link.classList.remove('active-nav');
        }
    });
    if (sectionId === 'user-profile' && navLinkManageCourses && navLinkManageCourses.dataset.section === 'user-profile') {
        navLinkManageCourses.classList.add('active-nav');
    }


    if (pushHistory) {
        const historyState = { section: sectionId, courseId: state ? state.courseId : undefined };
        let hash = `#${sectionId}`;
        if (sectionId === 'course-detail-section' && state && state.courseId) {
            hash = `#detail-${state.courseId}`;
        }
        history.pushState(historyState, '', hash);
    }
    currentSection = sectionId;
    currentDetailCourseId = (sectionId === 'course-detail-section' && state) ? state.courseId : null;

    if (sectionId === 'course-detail-section') {
        backToListOrHomeButton.innerHTML = '<i class="fas fa-arrow-left"></i> Trở về Danh sách';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(modalElement) {
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeModal(modalElement) {
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
    const forms = modalElement.querySelectorAll('form');
    forms.forEach(form => {
        form.reset();
    });

    if (modalElement.id === 'login-modal') {
        const defaultLoginRole = loginForm.querySelector('input[name="login-role"][value="Học viên"]');
        if (defaultLoginRole) defaultLoginRole.checked = true;
    }
    if (modalElement.id === 'signup-modal') {
        const defaultSignupRole = signupForm.querySelector('input[name="signup-role"][value="Học viên"]');
        if (defaultSignupRole) defaultSignupRole.checked = true;
    }
    if (modalElement.id === 'lesson-form-modal') {
        if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.textContent = '';
        if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.textContent = '';
        if(lessonContentMediaFile) lessonContentMediaFile.value = '';
        if(lessonContentAttachmentFile) lessonContentAttachmentFile.value = '';
    }
    editingChapterId = null;
    editingLessonId = null;
}

function updateAuthUI() {
    if (isLoggedIn) {
        authButtonsDiv.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        userDisplayNameSpan.textContent = loggedInUser.name;
        userAvatarPlaceholder.textContent = loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : '?';
        profileDisplayNameSpan.textContent = loggedInUser.name;
        profileDisplayEmailSpan.textContent = loggedInUser.email;
        profileDisplayRoleSpan.textContent = loggedInUser.role;

        if (loggedInUser.role === "Giảng viên") {
            if (navManageCoursesItem) navManageCoursesItem.classList.remove('hidden');
            // ĐÃ XÓA: if (instructorCreateButtonContainer) instructorCreateButtonContainer.classList.remove('hidden');
            
            if (navLinkManageCourses) {
                navLinkManageCourses.onclick = (e) => { 
                    e.preventDefault();
                    navigateToSection('user-profile'); 
                };
            }
            // ĐÃ XÓA: if (headerBtnCreateCourse) { ... }
        } else { 
            if (navManageCoursesItem) navManageCoursesItem.classList.add('hidden');
            // ĐÃ XÓA: if (instructorCreateButtonContainer) instructorCreateButtonContainer.classList.add('hidden');
        }
        updateProfileContent();

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
        // ĐÃ XÓA: if (instructorCreateButtonContainer) instructorCreateButtonContainer.classList.add('hidden');
    }
}

function updateProfileContent() {
    profileActionsDiv.innerHTML = ""; 
    profileCoursesSection.innerHTML = "";

    if (!isLoggedIn) {
        profileCoursesSection.innerHTML = "<p>Đăng nhập để xem thông tin cá nhân và các khóa học của bạn.</p>";
        return;
    }

    if (loggedInUser.role === "Học viên") {
        profileCoursesSection.innerHTML += `<h3><i class="fas fa-book-reader"></i> Khóa học của tôi (Đã đăng ký)</h3>`;
        const enrolledCourses = mockCourses.filter(course =>
            loggedInUser.enrolledCourses.includes(course.id)
        );

        if (enrolledCourses.length > 0) {
            const coursesGrid = document.createElement('div');
            coursesGrid.classList.add('user-course-list-grid');
            profileCoursesSection.appendChild(coursesGrid);
            displayCourses(enrolledCourses, coursesGrid);
        } else {
            profileCoursesSection.innerHTML += `<p>Bạn chưa đăng ký khóa học nào. <a href="#" data-section="all-courses" class="nav-link profile-nav-link">Khám phá các khóa học ngay!</a></p>`;
            profileCoursesSection.querySelector('a.profile-nav-link').addEventListener('click', (e) => {
                 e.preventDefault();
                 navigateToSection('all-courses');
            });
        }
    } else if (loggedInUser.role === "Giảng viên") {
        const createCourseBtnProfile = document.createElement('button');
        createCourseBtnProfile.classList.add('btn', 'btn-primary');
        createCourseBtnProfile.innerHTML = '<i class="fas fa-plus-circle"></i> Tạo Khóa học mới từ Profile';
        createCourseBtnProfile.addEventListener('click', () => {
            navigateToSection('create-course');
        });
        profileActionsDiv.appendChild(createCourseBtnProfile);

        profileCoursesSection.innerHTML += `<h3><i class="fas fa-chalkboard-teacher"></i> Khóa học của tôi (Đã tạo)</h3>`;
        const createdCourses = mockCourses.filter(course =>
            course.creatorEmail === loggedInUser.email
        );

        if (createdCourses.length > 0) {
            const coursesGrid = document.createElement('div');
            coursesGrid.classList.add('user-course-list-grid');
            profileCoursesSection.appendChild(coursesGrid);
            displayCourses(createdCourses, coursesGrid);
        } else {
            profileCoursesSection.innerHTML += `<p>Bạn chưa tạo khóa học nào. Sử dụng nút "Tạo mới" để bắt đầu.</p>`;
        }
    } else {
        profileCoursesSection.innerHTML += `<p>Không có thông tin khóa học hoặc hành động phù hợp với vai trò của bạn.</p>`;
    }
}

function displayCourses(coursesToDisplay, targetElement) {
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
                <p class="instructor">Giảng viên: ${course.instructor}</p>
                <p class="price">${course.price}</p>
            </div>
        `;
        targetElement.appendChild(courseCard);
        courseCard.addEventListener('click', () => {
            showCourseDetail(course.id);
        });
    });
}

function renderCourseStructure(course) {
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
        chapterHeader.innerHTML = `
            <h4>
                <i class="fas fa-folder-open"></i> ${chapter.title}
                <span class="chapter-toggle-icon"><i class="fas fa-chevron-down"></i></span>
            </h4>
        `;
        if (isLoggedIn && loggedInUser.role === "Giảng viên" && course.creatorEmail === loggedInUser.email) {
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
                if (lesson.content && lesson.content.mediaFileName) {
                    const ext = lesson.content.mediaFileName.split('.').pop().toLowerCase();
                    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) iconClass = 'fa-video';
                    else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) iconClass = 'fa-image';
                    else if (lesson.content.mediaUrl && lesson.content.mediaUrl.includes("youtube.com/embed")) iconClass = 'fa-youtube fab'; 
                } else if (lesson.content && lesson.content.attachmentFileName) {
                    iconClass = 'fa-paperclip'; 
                }


                lessonItem.innerHTML = `
                    <div class="lesson-info">
                        <i class="fas ${iconClass} lesson-icon"></i>
                        <span class="lesson-title">${lesson.title}</span>
                        ${lesson.description && lesson.description.length > 50 ? `<small class="lesson-short-desc">${lesson.description.substring(0,50)}...</small>` : (lesson.description ? `<small class="lesson-short-desc">${lesson.description}</small>` : '')}
                    </div>
                    <div class="lesson-meta">
                        ${isLoggedIn && loggedInUser.role === "Giảng viên" && course.creatorEmail === loggedInUser.email ? `
                            <div class="content-actions lesson-actions-inline">
                                <button class="btn btn-xs btn-outline btn-edit-lesson" data-chapter-id="${chapter.id}" data-lesson-id="${lesson.id}"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-xs btn-danger btn-delete-lesson" data-chapter-id="${chapter.id}" data-lesson-id="${lesson.id}"><i class="fas fa-trash"></i></button>
                            </div>` : ''}
                    </div>`;
                lessonItem.querySelector('.lesson-info .lesson-title').addEventListener('click', () => {
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
    addStructureActionListeners(course.id);
}

function displayLessonContent(course, chapterId, lessonId) {
    const chapter = course.structure.find(ch => ch.id === chapterId);
    if (!chapter) return;
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    detailCourseVideoPlayer.innerHTML = ''; 

    let contentHTML = '';
    let hasMediaOrText = false;

    if (lesson.content && lesson.content.mediaUrl) {
        hasMediaOrText = true;
        const mediaUrl = lesson.content.mediaUrl;
        const mediaFileName = lesson.content.mediaFileName || "Media File";

        if (mediaUrl.includes("youtube.com/embed") || mediaUrl.includes("youtu.be")) {
            // Xử lý link YouTube thông thường thành embed link
            let embedUrl = mediaUrl;
            if (mediaUrl.includes("youtu.be/")) {
                const videoId = mediaUrl.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (mediaUrl.includes("youtube.com/watch?v=")) {
                const videoId = mediaUrl.split('watch?v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
             contentHTML += `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        } 
        // Kiểm tra nếu là URL video trực tiếp (mp4, webm, ogg)
        else if (/\.(mp4|webm|ogg|mov)$/i.test(mediaUrl) && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
            contentHTML += `
                <video controls width="100%" style="max-height: 400px; border-radius: var(--border-radius);">
                    <source src="${mediaUrl}" type="video/${mediaUrl.split('.').pop().toLowerCase()}">
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>`;
        }
        // Các URL media khác (ví dụ: Vimeo) có thể cần embed code riêng, hiện tại chỉ hiển thị là link
        else if ((mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
             contentHTML += `
                <div class="placeholder-video-lw simulated-file">
                    <i class="fas fa-link"></i>
                    <p>Media từ URL: <a href="${mediaUrl}" target="_blank" rel="noopener noreferrer">${mediaFileName}</a></p>
                    <small>Nội dung này có thể cần được mở trong tab mới.</small>
                </div>`;
        }
        // Logic giả lập file upload cũ
        else if (mediaFileName) {
            const fileExtension = mediaFileName.split('.').pop().toLowerCase();
            if (['mp4', 'webm', 'ogv', 'ogg', 'mov'].includes(fileExtension)) {
                contentHTML += `
                    <div class="placeholder-video-lw simulated-file">
                        <i class="fas fa-film"></i>
                        <p>Video (Giả lập): ${mediaFileName}</p>
                        <button class="btn btn-primary btn-sm" onclick="alert('Giả lập phát video: ${mediaFileName}')"><i class="fas fa-play"></i> Phát Video</button>
                    </div>`;
            } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension)) {
                contentHTML += `
                    <div class="placeholder-video-lw simulated-file">
                        <i class="fas fa-image"></i>
                        <p>Ảnh (Giả lập): ${mediaFileName}</p>
                        <img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(mediaFileName.substring(0,20))}" alt="${mediaFileName}" />
                    </div>`;
            } else { 
                contentHTML += `
                    <div class="placeholder-video-lw simulated-file">
                        <i class="fas fa-file-audio"></i>
                        <p>Media (Giả lập): ${mediaFileName}</p>
                         <button class="btn btn-primary btn-sm" onclick="alert('Giả lập mở media file: ${mediaFileName}')"><i class="fas fa-external-link-alt"></i> Mở Media</button>
                    </div>`;
            }
        }
    }

    if (lesson.description) {
        hasMediaOrText = true;
        contentHTML += `<div class="text-content-display" style="${(lesson.content && lesson.content.mediaUrl) ? 'margin-top:20px; padding-top:20px; border-top:1px solid var(--border-color);' : ''}"><h4>Nội dung bài giảng:</h4><p>${lesson.description.replace(/\n/g, '<br>')}</p></div>`;
    }

    if (lesson.content && lesson.content.attachmentUrl) {
        hasMediaOrText = true;
        const attachmentFileName = lesson.content.attachmentFileName || "Tải file";
        contentHTML += `
            <div class="course-attachment-section">
                <h4><i class="fas fa-paperclip"></i> File đính kèm:</h4>
                <p>
                    <i class="fas fa-file"></i> ${attachmentFileName}
                    <button class="btn btn-secondary btn-sm" onclick="alert('Giả lập tải file đính kèm: ${attachmentFileName}')"><i class="fas fa-download"></i> Tải xuống</button>
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

function showCourseDetail(courseId, pushHistory = true) {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
        alert("Không tìm thấy thông tin khóa học!");
        if (history.length > 1 && history.state && history.state.section !== 'course-detail-section') history.back();
        else navigateToSection('homepage', null, false);
        return;
    }
    currentDetailCourseId = course.id;
    detailCourseTitle.textContent = course.title;
    detailCourseInstructor.textContent = `Giảng viên: ${course.instructor}`;
    detailCoursePrice.textContent = `Giá: ${course.price}`;
    detailCourseDescription.textContent = course.description;
    studentCourseActionsDiv.innerHTML = '';
    instructorCourseAside.classList.add('hidden');
    instructorLessonManagementTools.classList.add('hidden');

    if (isLoggedIn) {
        if (loggedInUser.role === "Giảng viên" && course.creatorEmail === loggedInUser.email) {
            instructorCourseAside.classList.remove('hidden');
            const allAsideLinks = instructorAsideActionsList.querySelectorAll('a');
            allAsideLinks.forEach(link => link.classList.remove('active-aside-link'));
            const manageLessonsLink = instructorAsideActionsList.querySelector('a[data-action="manage-lessons"]');
            if (manageLessonsLink) {
                manageLessonsLink.classList.add('active-aside-link');
                setTimeout(() => handleInstructorAsideAction("manage-lessons", course.id, false), 0);
            }
        } else if (loggedInUser.role === "Học viên") {
            instructorCourseAside.classList.add('hidden');
            if (loggedInUser.enrolledCourses.includes(course.id)) {
                const accessButton = document.createElement('button');
                accessButton.classList.add('btn', 'btn-success');
                accessButton.innerHTML = '<i class="fas fa-play-circle"></i> Vào học ngay';
                accessButton.addEventListener('click', () => alert(`(Giả lập) Bắt đầu học khóa: ${course.title}`));
                studentCourseActionsDiv.appendChild(accessButton);
            } else {
                const enrollButton = document.createElement('button');
                enrollButton.classList.add('btn', 'btn-primary', 'btn-enroll-course');
                enrollButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Đăng ký học (${course.price})`;
                enrollButton.addEventListener('click', () => {
                    if (confirm(`Bạn có muốn đăng ký khóa học "${course.title}" với giá ${course.price}? (Giả lập)`)) {
                        loggedInUser.enrolledCourses.push(course.id);
                        alert("Đăng ký thành công!");
                        updateAuthUI();
                        showCourseDetail(course.id, false);
                    }
                });
                studentCourseActionsDiv.appendChild(enrollButton);
            }
        }
    } else {
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

    renderCourseStructure(course);

    detailCourseFilesList.innerHTML = ''; 
    if (course.files && course.files.length > 0) {
        course.files.forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="event.preventDefault(); alert('Tải xuống file chung: ${file}')"><i class="fas fa-file-download"></i> ${file}</a>`;
            detailCourseFilesList.appendChild(li);
        });
    } else {
        detailCourseFilesList.innerHTML = '<li>Không có tài liệu chung cho khóa học.</li>';
    }
    
    if (course.structure && course.structure.length > 0 && course.structure[0].lessons && course.structure[0].lessons.length > 0) {
        displayLessonContent(course, course.structure[0].id, course.structure[0].lessons[0].id);
    } else {
        detailCourseVideoPlayer.innerHTML = `<div class="placeholder-video-lw"><i class="fas fa-play-circle"></i> <p>Chọn một bài giảng từ cấu trúc khóa học để xem nội dung.</p></div>`;
    }


    showSection(courseDetailSection, { section: 'course-detail-section', courseId: courseId }, pushHistory);
}

function handleInstructorAsideAction(action, courseId, showAlert = true) {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return;
    const allAsideLinks = instructorAsideActionsList.querySelectorAll('a');
    allAsideLinks.forEach(link => link.classList.remove('active-aside-link'));
    const clickedLink = instructorAsideActionsList.querySelector(`a[data-action="${action}"]`);
    if (clickedLink) clickedLink.classList.add('active-aside-link');

    instructorLessonManagementTools.classList.add('hidden');
    courseStructureRenderArea.classList.remove('editing-mode');

    switch (action) {
        case 'manage-lessons':
            if(showAlert) alert(`(Giả lập) Chế độ Quản lý Bài giảng cho: ${course.title}.`);
            renderCourseStructure(course); 
            instructorLessonManagementTools.classList.remove('hidden');
            courseStructureRenderArea.classList.add('editing-mode');
            break;
        case 'add-content': 
            if(showAlert) alert(`(Giả lập) Sẵn sàng thêm nội dung. Sử dụng các nút trong phần Nội dung Khóa học.`);
            renderCourseStructure(course);
            instructorLessonManagementTools.classList.remove('hidden');
            courseStructureRenderArea.classList.add('editing-mode');
            const addChapterBtn = instructorLessonManagementTools.querySelector('.btn-add-chapter');
            if(addChapterBtn) addChapterBtn.focus();
            break;
        case 'edit-course-info':
            setupEditCourseForm(courseId);
            break;
        case 'delete-course':
            if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ khóa học "${course.title}" không? Việc này không thể hoàn tác.`)) {
                mockCourses = mockCourses.filter(c => c.id !== courseId);
                alert(`Khóa học "${course.title}" đã bị xóa (Giả lập).`);
                navigateToSection('user-profile'); 
            }
            break;
        default:
            renderCourseStructure(course); 
            break;
    }
}

function navigateToSection(sectionId, courseId = null, pushHistory = true) {
    let sectionElement;
    let state = { section: sectionId, courseId: courseId };
    switch (sectionId) {
        case 'homepage':
            sectionElement = homepageSection;
            displayCourses(mockCourses.slice(0, 6), featuredCourseListDiv);
            break;
        case 'all-courses':
            sectionElement = allCoursesSection;
            displayCourses(mockCourses, allCourseListDiv);
            break;
        case 'learning-plan':
            sectionElement = learningPlanSection;
            if (!isLoggedIn) { alert("Vui lòng đăng nhập để xem kế hoạch học tập."); openModal(loginModal); return; }
            break;
        case 'user-profile':
            if (!isLoggedIn) { alert("Vui lòng đăng nhập để xem thông tin cá nhân."); openModal(loginModal); return; }
            sectionElement = userProfileSection;
            updateProfileContent();
            break;
        case 'create-course':
            if (!isLoggedIn || loggedInUser.role !== "Giảng viên") {
                alert("Chỉ giảng viên mới có thể tạo khóa học.");
                if (!isLoggedIn) openModal(loginModal);
                else navigateToSection('homepage'); 
                return;
            }
            sectionElement = createCourseSection;
            if (createCourseForm) createCourseForm.reset();
            document.getElementById('create-course-section').querySelector('h2').textContent = "Tạo khóa học mới";
            const existingIdInput = createCourseForm.querySelector('input[name="editing_course_id"]');
            if (existingIdInput) existingIdInput.remove();
            createCourseForm.querySelector('.submit-course-btn').textContent = "Tạo khóa học";
            break;
        default:
            sectionElement = homepageSection;
            displayCourses(mockCourses.slice(0, 6), featuredCourseListDiv);
            sectionId = 'homepage'; 
            state = { section: sectionId };
            break;
    }
    if (sectionId === 'course-detail-section' && courseId !== null) {
        showCourseDetail(courseId, pushHistory);
    } else if (sectionElement) {
        showSection(sectionElement, state, pushHistory);
    }
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
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
    navigateToSection(initialSectionId, initialCourseId, false);

    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.section) navigateToSection(state.section, state.courseId, false);
        else navigateToSection('homepage', null, false);
    });

    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    document.querySelectorAll('.modal .close-button').forEach(button => {
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
    showSignupLink.addEventListener('click', (e) => { e.preventDefault(); closeModal(loginModal); openModal(signupModal); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); closeModal(signupModal); openModal(loginModal); });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        const selectedRole = loginForm.querySelector('input[name="login-role"]:checked').value;
        if (!email || !password) { alert("Vui lòng nhập đủ email và mật khẩu."); return; }

        const foundUser = mockUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            loggedInUser.email = foundUser.email;
            loggedInUser.name = foundUser.name;
            loggedInUser.role = selectedRole; 
            loggedInUser.enrolledCourses = foundUser.enrolledCourses || [];
            if (selectedRole === "Giảng viên") { 
                loggedInUser.enrolledCourses = [];
            }
        } else {
            loggedInUser.name = email.split('@')[0];
            loggedInUser.email = email;
            loggedInUser.role = selectedRole;
            loggedInUser.enrolledCourses = (selectedRole === "Học viên") ? [] : []; 
            if(!mockUsers.find(u => u.email === email)) {
                mockUsers.push({name: loggedInUser.name, email: loggedInUser.email, password: password, role: loggedInUser.role, enrolledCourses: loggedInUser.enrolledCourses});
            }
            console.warn(`User ${email} not found in mockUsers. Logged in with selected role for testing. You might want to sign up first.`);
        }

        isLoggedIn = true;
        updateAuthUI();
        closeModal(loginModal);
        if(currentSection === 'homepage' && !loggedInUser.role === "Giảng viên") navigateToSection('user-profile'); 
        else if(currentSection === 'homepage' && loggedInUser.role === "Giảng viên") navigateToSection('user-profile');
        else navigateToSection(currentSection, currentDetailCourseId, false); 
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const role = signupForm.querySelector('input[name="signup-role"]:checked').value;
        if (!name || !email || !password || !confirmPassword) { alert("Vui lòng điền đủ thông tin."); return; }
        if (password !== confirmPassword) { alert("Mật khẩu xác nhận không khớp."); return; }
        if (password.length < 3) { alert("Mật khẩu phải có ít nhất 3 ký tự."); return; } 
        if (!email.includes('@')) { alert("Email không hợp lệ."); return; }
        if (mockUsers.find(u => u.email === email)) { alert("Email này đã được sử dụng. Vui lòng chọn email khác."); return; }
        mockUsers.push({ name, email, password, role, enrolledCourses: [] });
        alert(`Đăng ký thành công với vai trò ${role}. Vui lòng đăng nhập.`);
        closeModal(signupModal);
        openModal(loginModal);
    });

    logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        loggedInUser = { name: "", email: "", role: "", enrolledCourses: [] };
        updateAuthUI(); 
        
        if(instructorCourseAside) instructorCourseAside.classList.add('hidden');
        if(instructorLessonManagementTools) instructorLessonManagementTools.classList.add('hidden');
        if(courseStructureRenderArea) courseStructureRenderArea.classList.remove('editing-mode');
        
        currentDetailCourseId = null;
        editingChapterId = null;
        editingLessonId = null;
        navigateToSection('homepage');
    });

    userInfoDiv.addEventListener('click', (e) => { 
        if (!e.target.closest('.logout-btn') && isLoggedIn) navigateToSection('user-profile'); 
    });
    ctaTrialBtn.addEventListener('click', () => navigateToSection('all-courses'));
    ctaCreateBtn.addEventListener('click', () => {
        if (isLoggedIn && loggedInUser.role === "Giảng viên") navigateToSection('create-course');
        else if (!isLoggedIn) { alert('Vui lòng đăng nhập và đăng ký với vai trò Giảng viên để chia sẻ kiến thức.'); openModal(loginModal); }
        else alert('Chức năng này chỉ dành cho Giảng viên. Tài khoản của bạn không có quyền này.');
    });

    createCourseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('course-title').value.trim();
        const description = document.getElementById('course-description').value.trim();
        const price = document.getElementById('course-price').value.trim() || "Chưa xác định";
        const imageUrl = document.getElementById('course-image-url').value.trim();
        if (!title || !description || !price) { alert("Vui lòng nhập đủ Tiêu đề, Mô tả và Giá khóa học."); return; }

        const editingIdInput = createCourseForm.querySelector('input[name="editing_course_id"]');
        if (editingIdInput) { 
            const courseId = parseInt(editingIdInput.value);
            const courseIndex = mockCourses.findIndex(c => c.id === courseId);
            if (courseIndex > -1) {
                mockCourses[courseIndex] = { ...mockCourses[courseIndex], title, description, price, image: imageUrl || mockCourses[courseIndex].image, instructor: loggedInUser.name };
                alert(`Khóa học "${title}" đã được cập nhật thành công.`);
                createCourseForm.reset(); editingIdInput.remove();
                document.getElementById('create-course-section').querySelector('h2').textContent = "Tạo khóa học mới";
                createCourseForm.querySelector('.submit-course-btn').textContent = "Tạo khóa học";
                showCourseDetail(courseId);
            }
        } else { 
            const newCourse = { id: mockCourses.length > 0 ? Math.max(...mockCourses.map(c => c.id)) + 1 : 1, title, description, price, image: imageUrl || `https://via.placeholder.com/400x250?text=${encodeURIComponent(title.substring(0,15))}`, instructor: loggedInUser.name, creatorEmail: loggedInUser.email, files: [], structure: [] };
            mockCourses.push(newCourse);
            alert(`Khóa học "${title}" đã được tạo thành công.`);
            createCourseForm.reset();
            showCourseDetail(newCourse.id);
        }
    });

    backToListOrHomeButton.addEventListener('click', () => {
        if (history.state && history.state.section === 'course-detail-section' && history.length > 1) {
            history.back();
        } else {
            navigateToSection('all-courses'); 
        }
    });
    logoHomeLink.addEventListener('click', (e) => { e.preventDefault(); navigateToSection('homepage'); });
    
    document.querySelector('.main-nav ul').addEventListener('click', (e) => {
        const link = e.target.closest('a.nav-link');
        if (link && link.dataset.section) { 
            e.preventDefault(); 
            navigateToSection(link.dataset.section); 
        }
    });

    if (instructorAsideActionsList) {
        instructorAsideActionsList.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link && link.dataset.action && currentDetailCourseId !== null) handleInstructorAsideAction(link.dataset.action, currentDetailCourseId);
        });
    }
    const addChapterBtnGlobal = instructorLessonManagementTools.querySelector('.btn-add-chapter');
    if (addChapterBtnGlobal) addChapterBtnGlobal.addEventListener('click', () => { if (currentDetailCourseId !== null) openChapterForm(currentDetailCourseId); });

    if(lessonContentMediaFile) {
        lessonContentMediaFile.addEventListener('change', function() {
            if (this.files && this.files[0]) lessonMediaFileNameDisplay.innerHTML = `<i class="fas fa-photo-video"></i> ${this.files[0].name}`;
            else lessonMediaFileNameDisplay.textContent = '';
        });
    }
    if(lessonContentAttachmentFile) {
        lessonContentAttachmentFile.addEventListener('change', function() {
            if (this.files && this.files[0]) lessonAttachmentFileNameDisplay.innerHTML = `<i class="fas fa-paperclip"></i> ${this.files[0].name}`;
            else lessonAttachmentFileNameDisplay.textContent = '';
        });
    }

    courseSearchButton.addEventListener('click', performFrontendSearch);
    courseSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performFrontendSearch(); }});
    if (currentSection === 'homepage' && featuredCourseListDiv) displayCourses(mockCourses.slice(0, 6), featuredCourseListDiv);
});


function setupEditCourseForm(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return;
    navigateToSection('create-course', null, true); 
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
        idInput.value = course.id;
    }, 0); 
}

function performFrontendSearch() {
    const searchTerm = courseSearchInput.value.toLowerCase().trim();
    const results = mockCourses.filter(c => 
        c.title.toLowerCase().includes(searchTerm) || 
        c.instructor.toLowerCase().includes(searchTerm) || 
        (c.description && c.description.toLowerCase().includes(searchTerm))
    );
    if (currentSection === 'homepage' || currentSection === 'all-courses') {
        const targetList = (currentSection === 'homepage') ? featuredCourseListDiv : allCourseListDiv;
        if (currentSection !== 'all-courses' && searchTerm) { 
            navigateToSection('all-courses', null, true);
            setTimeout(() => displayCourses(results, allCourseListDiv), 50);
        } else {
            displayCourses(results, targetList);
        }
    } else { 
        navigateToSection('all-courses', null, true);
        setTimeout(() => displayCourses(results, allCourseListDiv), 50);
    }
}


function openChapterForm(courseId, chapterToEditId = null) {
    editingChapterId = chapterToEditId;
    document.getElementById('chapter-form-course-id').value = courseId;
    const modalTitle = chapterFormModal.querySelector('h2');
    const submitBtn = chapterForm.querySelector('button[type="submit"]');
    if (editingChapterId) {
        const course = mockCourses.find(c => c.id === courseId);
        const chapter = course?.structure.find(ch => ch.id === editingChapterId);
        if (chapter) {
            modalTitle.textContent = "Sửa Chương";
            document.getElementById('chapter-title').value = chapter.title;
            document.getElementById('chapter-description').value = chapter.description || '';
            document.getElementById('chapter-form-chapter-id').value = chapter.id;
            submitBtn.textContent = "Lưu Thay Đổi";
        } else { alert("Lỗi: Không tìm thấy chương để sửa."); return; }
    } else {
        modalTitle.textContent = "Thêm Chương Mới";
        chapterForm.reset(); 
        document.getElementById('chapter-form-chapter-id').value = ''; 
        submitBtn.textContent = "Thêm Chương";
    }
    openModal(chapterFormModal);
}

if (chapterForm) {
    chapterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const courseId = parseInt(document.getElementById('chapter-form-course-id').value);
        const chapterId = document.getElementById('chapter-form-chapter-id').value; 
        const title = document.getElementById('chapter-title').value.trim();
        const description = document.getElementById('chapter-description').value.trim();
        if (!title) { alert("Vui lòng nhập Tên Chương."); return; }
        const course = mockCourses.find(c => c.id === courseId);
        if (!course) { alert("Lỗi: Không tìm thấy khóa học."); return; }

        if (chapterId) { 
            const chapter = course.structure.find(ch => ch.id === chapterId);
            if (chapter) { 
                chapter.title = title; 
                chapter.description = description; 
                alert("Chương đã được cập nhật thành công."); 
            }
        } else { 
            course.structure.push({ id: `c${Date.now()}`, title, description, lessons: [] });
            alert("Chương mới đã được thêm thành công.");
        }
        renderCourseStructure(course); 
        closeModal(chapterFormModal);
    });
}

function openLessonForm(courseId, chapterId, lessonToEditId = null) {
    editingLessonId = lessonToEditId;
    document.getElementById('lesson-form-course-id').value = courseId;
    document.getElementById('lesson-form-chapter-id').value = chapterId;

    const modalTitle = lessonFormModal.querySelector('h2');
    const submitBtn = lessonForm.querySelector('button[type="submit"]');
    const lessonTitleInput = document.getElementById('lesson-title');
    const lessonDescriptionInput = document.getElementById('lesson-description');
    
    lessonForm.reset();
    if(lessonMediaFileNameDisplay) lessonMediaFileNameDisplay.textContent = '';
    if(lessonAttachmentFileNameDisplay) lessonAttachmentFileNameDisplay.textContent = '';
    if(lessonContentMediaFile) lessonContentMediaFile.value = ''; 
    if(lessonContentAttachmentFile) lessonContentAttachmentFile.value = '';
    if(lessonContentVideoUrlInput) lessonContentVideoUrlInput.value = ''; // Reset input URL

    if (editingLessonId) {
        const course = mockCourses.find(c => c.id === courseId);
        const chapter = course?.structure.find(ch => ch.id === chapterId);
        const lesson = chapter?.lessons.find(l => l.id === editingLessonId);

        if (lesson) {
            modalTitle.textContent = "Sửa Bài giảng";
            lessonTitleInput.value = lesson.title;
            lessonDescriptionInput.value = lesson.description || '';
            document.getElementById('lesson-form-lesson-id').value = lesson.id;
            submitBtn.textContent = "Lưu Thay Đổi";

            if (lesson.content) {
                // Ưu tiên hiển thị URL nếu có và là URL thực
                if (lesson.content.mediaUrl && (lesson.content.mediaUrl.startsWith('http://') || lesson.content.mediaUrl.startsWith('https://'))) {
                    lessonContentVideoUrlInput.value = lesson.content.mediaUrl;
                } 
                // Nếu không có URL thực sự, kiểm tra mediaFileName (cho file upload cũ)
                else if (lesson.content.mediaFileName) {
                    lessonMediaFileNameDisplay.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Giữ lại file media: ${lesson.content.mediaFileName}`;
                }

                if (lesson.content.attachmentFileName) {
                    lessonAttachmentFileNameDisplay.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Giữ lại file đính kèm: ${lesson.content.attachmentFileName}`;
                }
            }
        } else {
            alert("Lỗi: Không tìm thấy bài giảng để sửa.");
            return; 
        }
    } else {
        modalTitle.textContent = "Thêm Bài giảng mới";
        document.getElementById('lesson-form-lesson-id').value = ''; 
        submitBtn.textContent = "Thêm Bài giảng";
    }
    openModal(lessonFormModal);
}


if (lessonForm) {
    lessonForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const courseId = parseInt(document.getElementById('lesson-form-course-id').value);
        const chapterId = document.getElementById('lesson-form-chapter-id').value;
        const lessonId = document.getElementById('lesson-form-lesson-id').value; 

        const title = document.getElementById('lesson-title').value.trim();
        const description = document.getElementById('lesson-description').value.trim();
        const videoUrl = lessonContentVideoUrlInput.value.trim(); // Lấy URL video
        const mediaFile = lessonContentMediaFile.files[0];
        const attachmentFile = lessonContentAttachmentFile.files[0];

        if (!title) {
            alert("Vui lòng nhập Tên Bài giảng.");
            return;
        }

        const course = mockCourses.find(c => c.id === courseId);
        if (!course) { alert("Lỗi: Không tìm thấy khóa học."); return; }
        const chapter = course.structure.find(ch => ch.id === chapterId);
        if (!chapter) { alert("Lỗi: Không tìm thấy chương."); return; }

        let lessonContent = {};

        // Khôi phục content cũ nếu đang sửa
        if (lessonId) { 
            const existingLesson = chapter.lessons.find(l => l.id === lessonId);
            if (existingLesson && existingLesson.content) {
                lessonContent = { ...existingLesson.content }; 
            }
        }

        // Ưu tiên URL video nếu được cung cấp
        if (videoUrl) {
            lessonContent.mediaUrl = videoUrl;
            // Xác định mediaFileName dựa trên loại URL
            if (videoUrl.includes("youtube.com/embed") || videoUrl.includes("youtu.be")) {
                lessonContent.mediaFileName = "Video từ YouTube";
            } else if (videoUrl.includes("vimeo.com")) {
                lessonContent.mediaFileName = "Video từ Vimeo";
            } else {
                // Cố gắng lấy tên file từ URL nếu có
                try {
                    const urlParts = new URL(videoUrl);
                    const pathnameParts = urlParts.pathname.split('/');
                    lessonContent.mediaFileName = decodeURIComponent(pathnameParts[pathnameParts.length - 1]) || "Video từ URL";
                } catch (e) {
                    lessonContent.mediaFileName = "Video từ URL";
                }
            }
            // Nếu có URL, không sử dụng file upload cho media nữa
            if (mediaFile) {
                alert("Đã cung cấp URL video, file upload sẽ được bỏ qua cho phần media chính.");
            }
        } 
        // Nếu không có URL video, kiểm tra file upload
        else if (mediaFile) {
            lessonContent.mediaUrl = mediaFile.name; // Giả lập URL là tên file
            lessonContent.mediaFileName = mediaFile.name;
        } 
        // Nếu cả URL và file mới đều không có, nhưng đang sửa và có mediaUrl cũ không phải URL đầy đủ, giữ lại nó
        else if (lessonId && lessonContent.mediaUrl && !(lessonContent.mediaUrl.startsWith('http://') || lessonContent.mediaUrl.startsWith('https://'))) {
            // Giữ nguyên mediaUrl và mediaFileName đã có (trường hợp file upload cũ)
        }
        // Nếu không có gì cả (cả mới và cũ cho media chính)
        else if (!lessonId && !videoUrl && !mediaFile) {
             delete lessonContent.mediaUrl;
             delete lessonContent.mediaFileName;
        }


        if (attachmentFile) {
            lessonContent.attachmentUrl = attachmentFile.name; 
            lessonContent.attachmentFileName = attachmentFile.name;
        } else if (lessonId && !attachmentFile && lessonContent.attachmentFileName) {
            // Giữ lại attachment cũ nếu không có file mới được chọn
        } else if (!lessonId && !attachmentFile) {
             delete lessonContent.attachmentUrl;
             delete lessonContent.attachmentFileName;
        }


        if (lessonId) { 
            const lessonIndex = chapter.lessons.findIndex(l => l.id === lessonId);
            if (lessonIndex > -1) {
                chapter.lessons[lessonIndex] = {
                    ...chapter.lessons[lessonIndex], 
                    title,
                    description,
                    content: Object.keys(lessonContent).length > 0 ? lessonContent : undefined // Xóa content nếu rỗng
                };
                alert("Bài giảng đã được cập nhật thành công.");
            }
        } else { 
            const newLesson = {
                id: `l${Date.now()}`,
                title,
                description,
                content: Object.keys(lessonContent).length > 0 ? lessonContent : undefined, // Xóa content nếu rỗng
            };
            if (!chapter.lessons) chapter.lessons = []; 
            chapter.lessons.push(newLesson);
            alert("Bài giảng mới đã được thêm thành công.");
        }
        renderCourseStructure(course);
        closeModal(lessonFormModal);
    });
}


function addStructureActionListeners(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return;
    
    courseStructureRenderArea.querySelectorAll('.btn-edit-chapter, .btn-delete-chapter, .btn-add-lesson-to-chapter, .btn-edit-lesson, .btn-delete-lesson')
        .forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });


    courseStructureRenderArea.querySelectorAll('.btn-edit-chapter').forEach(btn => btn.onclick = (e) => openChapterForm(courseId, e.target.closest('button').dataset.chapterId));
    courseStructureRenderArea.querySelectorAll('.btn-delete-chapter').forEach(btn => btn.onclick = (e) => {
        const chapId = e.target.closest('button').dataset.chapterId;
        if (confirm("Bạn có chắc chắn muốn xóa chương này và tất cả bài giảng bên trong không?")) {
            course.structure = course.structure.filter(ch => ch.id !== chapId);
            renderCourseStructure(course); alert("Chương đã được xóa.");
        }
    });
    courseStructureRenderArea.querySelectorAll('.btn-add-lesson-to-chapter').forEach(btn => btn.onclick = (e) => openLessonForm(courseId, e.target.closest('button').dataset.chapterId));
    
    courseStructureRenderArea.querySelectorAll('.btn-edit-lesson').forEach(btn => btn.onclick = (e) => {
        const button = e.target.closest('button');
        openLessonForm(courseId, button.dataset.chapterId, button.dataset.lessonId);
    });
    courseStructureRenderArea.querySelectorAll('.btn-delete-lesson').forEach(btn => btn.onclick = (e) => {
        const button = e.target.closest('button');
        const chapId = button.dataset.chapterId;
        const lessId = button.dataset.lessonId;
        const chapter = course.structure.find(ch => ch.id === chapId);
        if (chapter && confirm("Bạn có chắc chắn muốn xóa bài giảng này không?")) {
            chapter.lessons = chapter.lessons.filter(l => l.id !== lessId);
            renderCourseStructure(course); alert("Bài giảng đã được xóa.");
        }
    });
}