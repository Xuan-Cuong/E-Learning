// --- GLOBAL STATE & CONFIGURATION ---
let currentUser = null; 
let currentSection = 'homepage';
let currentCourseDetailId = null;
let currentDashboardTab = 'dashboard-overview';
let currentCreateEditCourseId = null; 
let coursesDataCache = []; 
let categoriesDataCache = []; 

// --- DOM ELEMENT SELECTORS ---
const DOMElements = {
    // Sections
    allSections: document.querySelectorAll('.content-section'),
    homepageSection: document.getElementById('homepage'),
    allCoursesSection: document.getElementById('all-courses'),
    courseDetailSection: document.getElementById('course-detail'),
    userDashboardSection: document.getElementById('user-dashboard'),
    createEditCourseSection: document.getElementById('create-edit-course'),
    categoriesSection: document.getElementById('categories'),
    aboutUsSection: document.getElementById('about-us'),

    // Header
    header: document.querySelector('.site-header'),
    homeLink: document.getElementById('home-link'),
    footerHomeLink: document.getElementById('footer-home-link'),
    mainNavLinks: document.querySelectorAll('.main-nav .nav-link'),
    globalSearchInput: document.getElementById('global-search-input'),
    globalSearchButton: document.getElementById('global-search-button'),
    authActions: document.querySelector('.auth-actions'), // Parent of buttons and user menu
    authButtonsContainer: document.querySelector('.auth-actions .auth-buttons'),
    userMenuContainer: document.querySelector('.auth-actions .user-menu'),
    userAvatarContainer: document.getElementById('user-avatar-container'),
    userAvatarPlaceholderHeader: document.getElementById('user-avatar-placeholder-header'),
    userAvatarPlaceholderDropdown: document.getElementById('user-avatar-placeholder-dropdown'),
    userDisplayNameDropdown: document.getElementById('user-display-name-dropdown'),
    userDropdownMenu: document.querySelector('.user-dropdown-menu'),
    logoutButton: document.querySelector('.btn-logout'),
    mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),

    // Modals
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    chapterFormModal: document.getElementById('chapter-form-modal'),
    lessonFormModal: document.getElementById('lesson-form-modal'),
    lessonPreviewModal: document.getElementById('lesson-preview-modal'),
    lessonPreviewTitle: document.getElementById('lesson-preview-title'),
    lessonPreviewContent: document.getElementById('lesson-preview-content'),
    allModals: document.querySelectorAll('.modal'),
    closeModalButtons: document.querySelectorAll('.modal .close-button'),

    // Forms
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    courseForm: document.getElementById('course-form'), 
    chapterForm: document.getElementById('chapter-form'), 
    lessonForm: document.getElementById('lesson-form'),   

    // Homepage
    exploreCoursesBtn: document.querySelector('.explore-courses-btn'),
    becomeInstructorBtnHomepage: document.querySelector('.hero-cta .become-instructor-btn'),
    becomeInstructorBtnCTA: document.querySelector('.cta-become-instructor .become-instructor-btn'),
    featuredCourseList: document.getElementById('featured-course-list'),

    // All Courses Page
    allCourseListContainer: document.getElementById('all-course-list-container'),
    categoryFilter: document.getElementById('category-filter'),
    difficultyFilter: document.getElementById('difficulty-filter'),
    sortCourses: document.getElementById('sort-courses'),
    gridViewBtn: document.getElementById('grid-view-btn'),
    listViewBtn: document.getElementById('list-view-btn'),
    paginationControls: document.querySelector('.pagination-controls'),

    // Course Detail Page
    courseDetailBanner: document.getElementById('course-detail-banner'),
    detailCourseTitleBanner: document.getElementById('detail-course-title-banner'),
    detailCourseShortDescBanner: document.getElementById('detail-course-short-desc-banner'),
    detailCourseInstructorBanner: document.getElementById('detail-course-instructor-banner'),
    detailCourseRatingBanner: document.getElementById('detail-course-rating-banner'),
    detailCourseReviewsCountBanner: document.getElementById('detail-course-reviews-count-banner'),
    detailCourseEnrollmentsBanner: document.getElementById('detail-course-enrollments-banner'),
    detailCourseImageMain: document.getElementById('detail-course-image-main'),
    courseVideoPreviewPlayer: document.getElementById('course-video-preview-player'),
    courseDetailTabs: document.querySelector('.course-detail-tabs'),
    courseTabContentContainer: document.getElementById('course-tab-content'),
    detailCoursePriceSidebar: document.getElementById('detail-course-price-sidebar'),
    detailCourseOriginalPriceSidebar: document.getElementById('detail-course-original-price-sidebar'),
    enrollNowSidebarBtn: document.getElementById('enroll-now-sidebar-btn'),
    goToCourseBtn: document.getElementById('go-to-course-btn'),
    addToWishlistBtn: document.getElementById('add-to-wishlist-btn'),
    courseIncludesList: document.getElementById('course-includes-list'),
    instructorManagementSidebar: document.getElementById('instructor-management-sidebar'),
    editCourseInfoBtn: document.getElementById('edit-course-info-btn'),
    manageCourseContentBtn: document.getElementById('manage-course-content-btn'),
    deleteCourseDetailBtn: document.getElementById('delete-course-detail-btn'),

    // User Dashboard
    dashboardSidebar: document.querySelector('.dashboard-sidebar'),
    dashboardAvatar: document.getElementById('dashboard-avatar'),
    dashboardUsername: document.getElementById('dashboard-username'),
    dashboardUserEmail: document.getElementById('dashboard-useremail'),
    dashboardNavLinks: document.querySelectorAll('.dashboard-nav-link'),
    dashboardMainContent: document.querySelector('.dashboard-main-content'),

    // Create/Edit Course Form
    createEditCourseTitle: document.getElementById('create-edit-course-title'),
    courseFormCourseId: document.getElementById('course-form-course-id'),
    courseFormTabs: document.querySelectorAll('.form-tab-link'),
    courseFormTabContents: document.querySelectorAll('.form-tab-content'),
    courseTitleInput: document.getElementById('course-title-input'),
    courseSubtitleInput: document.getElementById('course-subtitle-input'),
    courseDescriptionInput: document.getElementById('course-description-input'),
    courseCategorySelect: document.getElementById('course-category-select'),
    courseDifficultySelect: document.getElementById('course-difficulty-select'),
    courseLanguageInput: document.getElementById('course-language-input'),
    curriculumBuilderArea: document.getElementById('curriculum-builder-area'),
    addChapterBtnForm: document.getElementById('add-chapter-btn-form'),
    courseImageUrlInput: document.getElementById('course-image-url-input'),
    coursePromoVideoUrlInput: document.getElementById('course-promo-video-url-input'),
    coursePriceInput: document.getElementById('course-price-input'),
    courseDiscountPriceInput: document.getElementById('course-discount-price-input'),
    courseStatusSelect: document.getElementById('course-status-select'),
    saveCourseBtn: document.getElementById('save-course-btn'),
    publishCourseBtn: document.getElementById('publish-course-btn'),
    publishChecklist: document.getElementById('publish-checklist'),


    // Chapter/Lesson Modals 
    chapterModalTitle: document.getElementById('chapter-modal-title'),
    chapterFormCourseIdModal: document.getElementById('chapter-form-course-id-modal'),
    chapterFormChapterIdModal: document.getElementById('chapter-form-chapter-id-modal'),
    chapterTitleModalInput: document.getElementById('chapter-title-modal'),
    chapterDescriptionModalInput: document.getElementById('chapter-description-modal'),
    saveChapterBtnModal: document.getElementById('save-chapter-btn-modal'),

    lessonModalTitle: document.getElementById('lesson-modal-title'),
    lessonFormCourseIdModal: document.getElementById('lesson-form-course-id-modal'),
    lessonFormChapterIdModal: document.getElementById('lesson-form-chapter-id-modal'),
    lessonFormLessonIdModal: document.getElementById('lesson-form-lesson-id-modal'),
    lessonTitleModalInput: document.getElementById('lesson-title-modal'),
    lessonTypeModalSelect: document.getElementById('lesson-type-modal'),
    lessonContentFieldsContainerModal: document.getElementById('lesson-content-fields'),
    lessonDurationModalInput: document.getElementById('lesson-duration-modal'),
    lessonPreviewableModalCheckbox: document.getElementById('lesson-previewable-modal'),
    saveLessonBtnModal: document.getElementById('save-lesson-btn-modal'),

    // Categories Page
    categoryListDisplay: document.getElementById('category-list-display'),

    // Footer
    currentYearSpan: document.getElementById('current-year'),

    // Toast Notifications
    toastNotificationsArea: document.getElementById('toast-notifications-area'),

    // Mobile Navigation
    mobileNavOverlay: null, 
    mobileMainNav: null,    
    closeMobileMenuBtn: null, 
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    loadCurrentUser();
    updateAuthUI();
    setupEventListeners();
    await loadInitialData(); 
    handleInitialNavigation();
    if (DOMElements.currentYearSpan) {
        DOMElements.currentYearSpan.textContent = new Date().getFullYear();
    }
}

async function loadInitialData() {
    try {
        const categoriesPromise = window.api.getCategoriesApi();
        const coursesPromise = window.api.getCoursesApi(); 

        const [categoriesResponse, coursesResponse] = await Promise.all([categoriesPromise, coursesPromise]);

        if (categoriesResponse.success) {
            categoriesDataCache = categoriesResponse.data;
            populateCategoryFilter(categoriesDataCache);
            populateCourseFormCategorySelect(categoriesDataCache);
        } else {
            console.error("Failed to load categories:", categoriesResponse.error);
        }

        if (coursesResponse.success) {
            coursesDataCache = coursesResponse.data;
            // console.log("Courses loaded into cache:", coursesDataCache.length);
        } else {
            console.error("Failed to load courses:", coursesResponse.error);
        }
    } catch (error) {
        console.error("Error loading initial data:", error);
        showToast("Lỗi tải dữ liệu ban đầu.", "error");
    }
}


function handleInitialNavigation() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const [sectionId, param, subParam] = hash.split('/');
        if (sectionId === 'course-detail' && param) {
            navigateTo('course-detail', { courseId: param }, false);
        } else if (sectionId === 'user-dashboard' && param) {
            navigateTo('user-dashboard', { tab: param }, false);
        } else if (sectionId === 'create-edit-course') {
             navigateTo('create-edit-course', { courseId: param, formTab: subParam }, false);
        } else if (sectionId) {
            navigateTo(sectionId, null, false);
        } else {
            navigateTo('homepage', null, false);
        }
    } else {
        navigateTo('homepage', null, false);
    }
}

// --- AUTHENTICATION & USER STATE ---
function loadCurrentUser() {
    const storedUser = localStorage.getItem('trithucHubUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('trithucHubUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('trithucHubUser');
    }
}

function updateAuthUI() {
    if (currentUser) {
        DOMElements.authButtonsContainer.classList.add('hidden');
        DOMElements.userMenuContainer.classList.remove('hidden');
        const avatarChar = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?';
        DOMElements.userAvatarPlaceholderHeader.textContent = avatarChar;
        DOMElements.userAvatarPlaceholderDropdown.textContent = avatarChar;
        DOMElements.userDisplayNameDropdown.textContent = currentUser.name;

        if (currentSection === 'user-dashboard') {
            DOMElements.dashboardAvatar.textContent = avatarChar;
            DOMElements.dashboardUsername.textContent = currentUser.name;
            DOMElements.dashboardUserEmail.textContent = currentUser.email;
        }
    } else {
        DOMElements.authButtonsContainer.classList.remove('hidden');
        DOMElements.userMenuContainer.classList.add('hidden');
        if (DOMElements.userDropdownMenu.classList.contains('open')) {
             DOMElements.userAvatarContainer.classList.remove('active');
             DOMElements.userDropdownMenu.classList.add('hidden');
             DOMElements.userDropdownMenu.classList.remove('open');
        }
    }
}

function handleLogin(userData) {
    currentUser = {
        ...userData,
        avatarChar: userData.name ? userData.name.charAt(0).toUpperCase() : '?',
        enrolledCourseIds: userData.enrolledCourseIds || [],
        createdCourseIds: userData.createdCourseIds || [],
        wishlist: userData.wishlist || [],
    };
    saveCurrentUser();
    updateAuthUI();
    closeModal(DOMElements.loginModal);
    showToast(`Chào mừng trở lại, ${currentUser.name}!`, "success");
    
    if (['course-detail', 'user-dashboard', 'create-edit-course'].includes(currentSection) || (currentSection === 'all-courses' && DOMElements.globalSearchInput.value)) {
        loadSectionContent(currentSection, { courseId: currentCourseDetailId, tab: currentDashboardTab, courseIdForEdit: currentCreateEditCourseId });
    } else {
        navigateTo('user-dashboard', { tab: 'dashboard-overview' });
    }
}

function handleLogout() {
    currentUser = null;
    saveCurrentUser();
    updateAuthUI();
    showToast("Bạn đã đăng xuất.", "info");
    if (DOMElements.userDropdownMenu.classList.contains('open')) {
        DOMElements.userAvatarContainer.classList.remove('active');
        DOMElements.userDropdownMenu.classList.add('hidden');
        DOMElements.userDropdownMenu.classList.remove('open');
    }
    if (['user-dashboard', 'create-edit-course'].includes(currentSection)) {
        navigateTo('homepage');
    } else if (currentSection === 'course-detail' && currentCourseDetailId) {
        renderCourseDetail(currentCourseDetailId); // Re-render to update buttons
    } else if (currentSection === 'all-courses') {
        renderAllCoursesPage(); // Re-render to update wishlist icons
    }
}

// --- NAVIGATION ---
function navigateTo(sectionId, params = {}, pushState = true) {
    // console.log(`Navigating to: ${sectionId}`, params);
    currentSection = sectionId;
    currentCourseDetailId = (sectionId === 'course-detail' && params.courseId) ? params.courseId : null;
    currentDashboardTab = (sectionId === 'user-dashboard' && params.tab) ? params.tab : (sectionId === 'user-dashboard' ? 'dashboard-overview' : currentDashboardTab);
    currentCreateEditCourseId = (sectionId === 'create-edit-course' && params.courseId) ? params.courseId : null;


    DOMElements.allSections.forEach(section => section.classList.add('hidden'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    } else {
        console.warn(`Section with ID "${sectionId}" not found. Defaulting to homepage.`);
        DOMElements.homepageSection.classList.remove('hidden');
        currentSection = 'homepage';
    }

    DOMElements.mainNavLinks.forEach(link => {
        link.classList.toggle('active-nav', link.dataset.section === currentSection);
    });
    if (DOMElements.mobileMainNav) { // Update mobile nav too
        DOMElements.mobileMainNav.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active-nav', link.dataset.section === currentSection);
        });
    }

    if (currentSection === 'user-dashboard') {
        DOMElements.dashboardNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.tab === currentDashboardTab);
        });
    }

    loadSectionContent(currentSection, params);

    if (pushState) {
        let historyUrl = `#${currentSection}`;
        if (currentCourseDetailId) historyUrl += `/${currentCourseDetailId}`;
        else if (currentSection === 'user-dashboard' && currentDashboardTab) historyUrl += `/${currentDashboardTab}`;
        else if (currentSection === 'create-edit-course' && currentCreateEditCourseId) historyUrl += `/${currentCreateEditCourseId}`;
        else if (currentSection === 'create-edit-course' && params.formTab) historyUrl += `/_/${params.formTab}`; // For new course, specific tab
        history.pushState({ section: currentSection, params }, '', historyUrl);
    }
    window.scrollTo(0, 0);
}

window.onpopstate = (event) => {
    if (event.state && event.state.section) {
        navigateTo(event.state.section, event.state.params, false);
    } else {
        handleInitialNavigation();
    }
};

async function loadSectionContent(sectionId, params) {
    switch (sectionId) {
        case 'homepage':
            renderHomepage();
            break;
        case 'all-courses':
            // params can include category from category page click
            renderAllCoursesPage(params); 
            break;
        case 'course-detail':
            if (params.courseId) renderCourseDetail(params.courseId);
            break;
        case 'user-dashboard':
            if (!currentUser) { navigateTo('homepage'); showToast("Vui lòng đăng nhập.", "info"); return; }
            renderUserDashboard(params.tab || 'dashboard-overview');
            break;
        case 'create-edit-course':
            if (!currentUser) { navigateTo('homepage'); showToast("Vui lòng đăng nhập.", "info"); return; }
            renderCreateEditCourseForm(params.courseId, params.formTab); 
            break;
        case 'categories':
            renderCategoriesPage();
            break;
        case 'about-us':
            break;
        default:
            renderHomepage(); 
    }
}

// --- UI RENDERING FUNCTIONS ---

// Homepage
async function renderHomepage() {
    if (DOMElements.featuredCourseList) {
        DOMElements.featuredCourseList.innerHTML = '<p>Đang tải khóa học...</p>'; // Loading state
        const response = await window.api.getCoursesApi(6); // Get 6, assume API sorts by featured/popular
        if (response.success) {
            renderCourseGrid(response.data, DOMElements.featuredCourseList);
        } else {
            DOMElements.featuredCourseList.innerHTML = `<p class="empty-state-message">Không thể tải khóa học nổi bật.</p>`;
        }
    }
}

// All Courses Page
async function renderAllCoursesPage(filters = {}) {
    DOMElements.allCourseListContainer.innerHTML = '<p>Đang tìm kiếm khóa học...</p>'; // Loading state
    const queryParams = {
        category: filters.category || DOMElements.categoryFilter.value, // Use passed filter first
        difficulty: DOMElements.difficultyFilter.value,
        sortBy: DOMElements.sortCourses.value,
        search: DOMElements.globalSearchInput.value.trim(),
        ...filters // Allows passing other params like page number later
    };
    
    // Always fetch from API for All Courses page to ensure fresh data and server-side filtering/sorting
    const response = await window.api.getCoursesApi(null, queryParams.search, queryParams.category, queryParams.difficulty, queryParams.sortBy);

    if (response.success) {
        coursesDataCache = response.data; // Update cache with latest full/filtered list
        renderCourseGrid(response.data, DOMElements.allCourseListContainer);
    } else {
        DOMElements.allCourseListContainer.innerHTML = `<p class="empty-state-message">Không thể tải danh sách khóa học.</p>`;
    }
    // renderPagination(response.data.totalPages, response.data.currentPage); // If API supports pagination
}

// Course Detail Page
async function renderCourseDetail(courseId) {
    DOMElements.courseTabContentContainer.innerHTML = "<p>Đang tải chi tiết khóa học...</p>";
    const response = await window.api.getCourseDetailApi(courseId);
    if (!response.success || !response.data) {
        showToast("Không tìm thấy thông tin khóa học.", "error");
        navigateTo('all-courses');
        return;
    }
    const course = response.data;
    currentCourseDetailId = course.id; // Ensure it's set

    DOMElements.detailCourseTitleBanner.textContent = course.title;
    DOMElements.detailCourseShortDescBanner.textContent = course.shortDescription || '';
    DOMElements.detailCourseInstructorBanner.innerHTML = `<i class="fas fa-user-tie"></i> ${course.instructorName || 'N/A'}`;
    DOMElements.detailCourseRatingBanner.textContent = (course.rating || 0).toFixed(1);
    DOMElements.detailCourseReviewsCountBanner.textContent = course.reviewsCount || 0;
    DOMElements.detailCourseEnrollmentsBanner.textContent = course.enrollments || 0;
    
    const bannerImageUrl = course.bannerImage || course.image; // Use bannerImage if available, else course image
    if (bannerImageUrl) {
      DOMElements.courseDetailBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${bannerImageUrl}')`;
    } else {
      DOMElements.courseDetailBanner.style.backgroundImage = ''; // fallback to CSS bg
    }

    DOMElements.detailCourseImageMain.src = course.image || getPlaceholderImage(course.title);
    DOMElements.detailCourseImageMain.alt = course.title;
    
    const playPreviewBtn = DOMElements.courseVideoPreviewPlayer.querySelector('.play-preview-btn');
    if (course.promoVideoUrl) {
        playPreviewBtn.classList.remove('hidden');
        playPreviewBtn.onclick = () => showLessonPreviewModal({
            title: `Preview: ${course.title}`,
            type: 'video',
            contentUrl: course.promoVideoUrl, // Assuming promoVideoUrl is embeddable or direct link
        });
    } else {
        playPreviewBtn.classList.add('hidden');
    }


    DOMElements.detailCoursePriceSidebar.textContent = formatPrice(course.price);
    if (course.originalPrice && course.originalPrice > course.price) {
        DOMElements.detailCourseOriginalPriceSidebar.textContent = formatPrice(course.originalPrice);
        DOMElements.detailCourseOriginalPriceSidebar.classList.remove('hidden');
    } else {
        DOMElements.detailCourseOriginalPriceSidebar.textContent = '';
        DOMElements.detailCourseOriginalPriceSidebar.classList.add('hidden');
    }

    updateCourseDetailButtons(course);

    DOMElements.courseIncludesList.innerHTML = (course.whatYouWillLearn || course.includes || []) // Prefer 'whatYouWillLearn' if available
        .map(item => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join('') || '<li>Thông tin đang được cập nhật.</li>';

    if (currentUser && currentUser.id === course.creatorUserID) {
        DOMElements.instructorManagementSidebar.classList.remove('hidden');
    } else {
        DOMElements.instructorManagementSidebar.classList.add('hidden');
    }

    const activeTabLink = DOMElements.courseDetailTabs.querySelector('.tab-link.active') || DOMElements.courseDetailTabs.querySelector('.tab-link[data-tab="overview"]');
    renderCourseDetailTab(activeTabLink.dataset.tab, course);
    DOMElements.courseDetailTabs.querySelectorAll('.tab-link').forEach(tl => tl.classList.remove('active'));
    activeTabLink.classList.add('active');
}

function updateCourseDetailButtons(course) {
    const isEnrolled = currentUser && currentUser.enrolledCourseIds && currentUser.enrolledCourseIds.includes(course.id);
    const isWishlisted = currentUser && currentUser.wishlist && currentUser.wishlist.includes(course.id);
    const isCreator = currentUser && currentUser.id === course.creatorUserID;

    if (isCreator) {
        DOMElements.enrollNowSidebarBtn.classList.add('hidden');
        DOMElements.goToCourseBtn.classList.add('hidden'); 
        DOMElements.addToWishlistBtn.classList.add('hidden');
        DOMElements.instructorManagementSidebar.classList.remove('hidden');
    } else {
        DOMElements.instructorManagementSidebar.classList.add('hidden');
        if (isEnrolled) {
            DOMElements.enrollNowSidebarBtn.classList.add('hidden');
            DOMElements.goToCourseBtn.classList.remove('hidden');
            DOMElements.goToCourseBtn.onclick = () => { showToast("Chức năng vào học đang phát triển!", "info"); /* TODO: Navigate to learning interface */ };
        } else {
            DOMElements.enrollNowSidebarBtn.classList.remove('hidden');
            DOMElements.enrollNowSidebarBtn.innerHTML = `<i class="fas fa-bolt"></i> Đăng ký ngay`;
            DOMElements.enrollNowSidebarBtn.disabled = false;
            DOMElements.enrollNowSidebarBtn.onclick = () => handleEnrollCourse(course.id);
            DOMElements.goToCourseBtn.classList.add('hidden');
        }

        DOMElements.addToWishlistBtn.classList.remove('hidden');
        DOMElements.addToWishlistBtn.innerHTML = isWishlisted ?
            `<i class="fas fa-heart"></i> Đã Yêu thích` :
            `<i class="far fa-heart"></i> Thêm vào Yêu thích`;
        DOMElements.addToWishlistBtn.classList.toggle('active', isWishlisted);
        DOMElements.addToWishlistBtn.onclick = () => handleToggleWishlist(course.id);
    }
}

function renderCourseDetailTab(tabId, course) {
    let content = '';
    switch (tabId) {
        case 'overview':
            content = `
                <h3>Mô tả khóa học</h3>
                <div class="course-description-content">${course.description || '<p>Chưa có mô tả cho khóa học này.</p>'}</div>
                ${course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? `
                    <h4>Bạn sẽ học được gì?</h4>
                    <ul class="fa-ul">${course.whatYouWillLearn.map(item => `<li><span class="fa-li"><i class="fas fa-check"></i></span> ${item}</li>`).join('')}</ul>
                ` : ''}
                ${course.requirements && course.requirements.length > 0 ? `
                    <h4>Yêu cầu</h4>
                    <ul class="fa-ul">${course.requirements.map(item => `<li><span class="fa-li"><i class="fas fa-angle-right"></i></span> ${item}</li>`).join('')}</ul>
                ` : '<h4>Yêu cầu</h4><p>Không có yêu cầu đặc biệt.</p>'}
            `;
            break;
        case 'curriculum':
            content = `<h3>Nội dung khóa học</h3>`;
            if (course.chapters && course.chapters.length > 0) { // Assuming API returns 'chapters' array
                course.chapters.forEach((chapter, index) => {
                    content += `
                        <div class="curriculum-section ${index === 0 ? 'open' : ''}">
                            <div class="curriculum-section-header" data-chapter-id="${chapter.id}">
                                <h4>${chapter.title}</h4>
                                <span class="section-meta">${chapter.lessons_count || (chapter.lessons ? chapter.lessons.length : 0)} bài giảng • ${calculateChapterDuration(chapter.lessons)}</span>
                                <i class="fas fa-chevron-down toggle-icon"></i>
                            </div>
                            <ul class="curriculum-lessons-list">
                                ${(chapter.lessons || []).map(lesson => `
                                    <li class="curriculum-lesson-item" data-lesson-id="${lesson.id}">
                                        <i class="fas ${getLessonIcon(lesson.type)} lesson-type-icon"></i>
                                        <span class="lesson-title-curriculum">${lesson.title}</span>
                                        ${lesson.is_previewable ? `<button class="btn btn-xs btn-outline lesson-preview-btn-curriculum" data-lesson-type="${lesson.type}" data-lesson-content="${lesson.content_url || escape(lesson.content_text || '')}" data-lesson-title="${escape(lesson.title)}">Xem trước</button>` : ''}
                                        <span class="lesson-duration-curriculum">${lesson.duration_minutes ? formatDuration(lesson.duration_minutes) : ''}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                });
            } else {
                content += `<p>Nội dung khóa học đang được cập nhật.</p>`;
            }
            break;
        case 'instructor':
            const instructor = course.instructor; // Assuming API returns instructor object
            if (instructor) {
                content = `
                    <h3>Về Giảng viên</h3>
                    <div class="instructor-profile-box">
                        <div class="instructor-avatar">
                            <img src="${instructor.avatar_url || getPlaceholderAvatar(instructor.name)}" alt="${instructor.name}">
                        </div>
                        <div class="instructor-info">
                            <h4>${instructor.name}</h4>
                            <p class="instructor-title">${instructor.title || 'Chuyên gia đào tạo'}</p>
                            <!-- Add stats like total students, reviews, courses if available -->
                        </div>
                    </div>
                    <div class="instructor-bio">${instructor.bio || 'Chưa có thông tin giới thiệu về giảng viên.'}</div>
                `;
            } else {
                content = `<p>Thông tin giảng viên đang được cập nhật.</p>`;
            }
            break;
        case 'reviews':
            content = `<h3>Đánh giá từ học viên (${course.reviews_count || 0})</h3>`;
            if (course.reviews && course.reviews.length > 0) {
                 // TODO: Add rating summary (stars breakdown) if API provides it
                content += `<div class="review-list">`;
                course.reviews.forEach(review => {
                    content += `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="review-avatar">${review.user_name ? review.user_name.charAt(0).toUpperCase() : '?'}</span>
                                <span class="review-author-name">${review.user_name}</span>
                                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                                <span class="review-date">${formatDate(review.created_at)}</span>
                            </div>
                            <p class="review-content">${review.comment}</p>
                        </div>
                    `;
                });
                content += `</div>`;
            } else {
                content += `<p>Chưa có đánh giá nào cho khóa học này.</p>`;
            }
            // TODO: Add "Write a review" button if user is enrolled and hasn't reviewed
            break;
        case 'qna':
             content = `<h3>Hỏi & Đáp</h3><p>Tính năng Hỏi & Đáp sắp ra mắt. Đặt câu hỏi và nhận câu trả lời từ giảng viên và cộng đồng.</p>`;
            break;
    }
    DOMElements.courseTabContentContainer.innerHTML = `<div class="tab-pane active">${content}</div>`;

    if (tabId === 'curriculum') {
        document.querySelectorAll('.curriculum-section-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('open');
            });
        });
        document.querySelectorAll('.lesson-preview-btn-curriculum').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lessonTitle = unescape(e.currentTarget.dataset.lessonTitle);
                const lessonType = e.currentTarget.dataset.lessonType;
                const lessonContent = e.currentTarget.dataset.lessonContent;
                showLessonPreviewModal({
                    title: lessonTitle,
                    type: lessonType,
                    contentUrl: lessonType === 'video' ? lessonContent : null, // Assuming content is URL for video
                    contentText: lessonType === 'text' ? unescape(lessonContent) : null,
                });
            });
        });
    }
}

// User Dashboard
async function renderUserDashboard(tabId = 'dashboard-overview') {
    currentDashboardTab = tabId;
    DOMElements.dashboardNavLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.tab === tabId);
    });
     if (currentUser) {
        DOMElements.dashboardAvatar.textContent = currentUser.avatarChar;
        DOMElements.dashboardUsername.textContent = currentUser.name;
        DOMElements.dashboardUserEmail.textContent = currentUser.email;
    }
    DOMElements.dashboardMainContent.innerHTML = `<div class="dashboard-tab-content active"><p>Đang tải nội dung...</p></div>`;

    let content = '';
    switch (tabId) {
        case 'dashboard-overview':
            content = `<h2>Chào mừng, ${currentUser.name}!</h2><p>Đây là bảng điều khiển của bạn. Theo dõi tiến độ học tập và quản lý các khóa học.</p>`;
            // TODO: Add widgets
            break;
        case 'my-courses':
            content = `<h2>Khóa học đã tạo</h2>`;
            const createdResponse = await window.api.getUserCoursesApi(currentUser.id, 'created');
            if (createdResponse.success && createdResponse.data.length > 0) {
                content += `<div class="course-grid dashboard-course-grid">`;
                createdResponse.data.forEach(course => content += generateCourseCardHTML(course, { showManageButton: true }));
                content += `</div>`;
            } else if (createdResponse.success) {
                 content += `<div class="empty-state-message">
                                <i class="fas fa-chalkboard"></i>
                                <p>Bạn chưa tạo khóa học nào.</p>
                                <button class="btn btn-primary create-course-from-dashboard-btn"><i class="fas fa-plus"></i> Tạo khóa học mới</button>
                            </div>`;
            } else {
                content += `<p class="text-danger">Lỗi tải khóa học đã tạo.</p>`;
            }
            break;
        case 'enrolled-courses':
            content = `<h2>Khóa học đã đăng ký</h2>`;
            const enrolledResponse = await window.api.getUserEnrolledCoursesApi(currentUser.id);
            if (enrolledResponse.success && enrolledResponse.data.length > 0) {
                content += `<div class="course-grid dashboard-course-grid">`;
                enrolledResponse.data.forEach(course => content += generateCourseCardHTML(course, { showProgress: true })); // Assuming API returns course objects
                content += `</div>`;
            } else if (enrolledResponse.success) {
                content += `<div class="empty-state-message">
                                <i class="fas fa-book-reader"></i>
                                <p>Bạn chưa đăng ký khóa học nào.</p>
                                <button class="btn btn-primary browse-courses-from-dashboard-btn"><i class="fas fa-search"></i> Duyệt khóa học</button>
                            </div>`;
            } else {
                 content += `<p class="text-danger">Lỗi tải khóa học đã đăng ký.</p>`;
            }
            break;
        case 'wishlist':
            content = `<h2>Danh sách Yêu thích</h2>`;
            const wishlistResponse = await window.api.getUserWishlistApi(currentUser.id); // Needs new API endpoint
            if (wishlistResponse.success && wishlistResponse.data.length > 0) {
                content += `<div class="course-grid dashboard-course-grid">`;
                wishlistResponse.data.forEach(course => content += generateCourseCardHTML(course));
                content += `</div>`;
            } else if (wishlistResponse.success) {
                content += `<div class="empty-state-message">
                                <i class="far fa-heart"></i>
                                <p>Danh sách yêu thích của bạn trống.</p>
                            </div>`;
            } else {
                content += `<p class="text-danger">Lỗi tải danh sách yêu thích.</p>`;
            }
            break;
        case 'order-history':
            content = `<h2>Lịch sử Mua hàng</h2><p>Tính năng này đang được phát triển.</p>`;
            break;
        case 'profile-settings':
            content = `<h2>Cài đặt Tài khoản</h2>
                <form id="profile-settings-form" class="modern-form" style="max-width: 600px; margin: 20px auto;">
                    <div class="form-group">
                        <label for="profile-name">Họ và tên:</label>
                        <input type="text" id="profile-name" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="profile-email">Email:</label>
                        <input type="email" id="profile-email" value="${currentUser.email}" required disabled>
                         <small>Email không thể thay đổi.</small>
                    </div>
                    <div class="form-group">
                        <label for="profile-current-password">Mật khẩu hiện tại (nếu muốn đổi):</label>
                        <input type="password" id="profile-current-password" placeholder="Để trống nếu không đổi">
                    </div>
                    <div class="form-group">
                        <label for="profile-new-password">Mật khẩu mới:</label>
                        <input type="password" id="profile-new-password" minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="profile-confirm-new-password">Xác nhận mật khẩu mới:</label>
                        <input type="password" id="profile-confirm-new-password">
                    </div>
                    <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                </form>
            `;
            break;
    }
    DOMElements.dashboardMainContent.innerHTML = `<div class="dashboard-tab-content active">${content}</div>`;

    if (tabId === 'my-courses') {
        const createBtn = DOMElements.dashboardMainContent.querySelector('.create-course-from-dashboard-btn');
        if (createBtn) createBtn.addEventListener('click', () => navigateTo('create-edit-course'));
    }
    if (tabId === 'enrolled-courses') {
        const browseBtn = DOMElements.dashboardMainContent.querySelector('.browse-courses-from-dashboard-btn');
        if (browseBtn) browseBtn.addEventListener('click', () => navigateTo('all-courses'));
    }
    if (tabId === 'profile-settings') {
        const profileForm = document.getElementById('profile-settings-form');
        if (profileForm) profileForm.addEventListener('submit', handleProfileSettingsUpdate);
    }
}

// Create/Edit Course Form
function renderCreateEditCourseForm(courseId = null, targetTab = 'basic-info') {
    currentCreateEditCourseId = courseId;
    DOMElements.courseForm.reset(); 
    DOMElements.curriculumBuilderArea.innerHTML = ''; 
    
    // Reset tabs
    DOMElements.courseFormTabs.forEach(tab => tab.classList.remove('active'));
    DOMElements.courseFormTabContents.forEach(content => content.classList.remove('active'));
    
    const activeTabButton = Array.from(DOMElements.courseFormTabs).find(tab => tab.dataset.formTab === targetTab) || DOMElements.courseFormTabs[0];
    const activeTabContent = Array.from(DOMElements.courseFormTabContents).find(content => content.dataset.formTabId === targetTab) || DOMElements.courseFormTabContents[0];
    
    activeTabButton.classList.add('active');
    activeTabContent.classList.add('active');

    DOMElements.publishChecklist.classList.add('hidden'); // Hide checklist initially
    DOMElements.publishCourseBtn.classList.add('hidden');
    DOMElements.courseStatusSelect.value = 'draft'; // Default to draft

    if (courseId) {
        DOMElements.createEditCourseTitle.textContent = "Chỉnh sửa Khóa học";
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Thay đổi';
        loadCourseDataForEditing(courseId);
    } else {
        DOMElements.createEditCourseTitle.textContent = "Tạo Khóa Học Mới";
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Bản Nháp';
        DOMElements.courseFormCourseId.value = ''; 
        DOMElements.courseLanguageInput.value = "Tiếng Việt";
        updatePublishButtonState(); // Check if new course can be published
    }
    // Add listeners to form inputs to update publish button state dynamically
    ['input', 'change'].forEach(eventType => {
        DOMElements.courseForm.addEventListener(eventType, updatePublishButtonState);
    });
}

async function loadCourseDataForEditing(courseId) {
    const response = await window.api.getCourseDetailApi(courseId); 
    if (response.success && response.data) {
        const course = response.data;
        DOMElements.courseFormCourseId.value = course.id;
        DOMElements.courseTitleInput.value = course.title;
        DOMElements.courseSubtitleInput.value = course.short_description || '';
        DOMElements.courseDescriptionInput.value = course.description || '';
        DOMElements.courseCategorySelect.value = course.category_id || ''; // Assuming API returns category_id
        DOMElements.courseDifficultySelect.value = course.difficulty || 'beginner';
        DOMElements.courseLanguageInput.value = course.language || 'Tiếng Việt';

        DOMElements.curriculumBuilderArea.innerHTML = ''; 
        if (course.chapters && course.chapters.length > 0) {
            course.chapters.forEach(chapter => {
                // API returns lessons within chapter
                addChapterToFormUI(chapter.id, chapter.title, chapter.description, chapter.lessons);
            });
        }

        DOMElements.courseImageUrlInput.value = course.image_url || '';
        DOMElements.coursePromoVideoUrlInput.value = course.promo_video_url || '';
        DOMElements.coursePriceInput.value = course.price || 0;
        DOMElements.courseDiscountPriceInput.value = course.original_price > course.price ? course.original_price : '';

        DOMElements.courseStatusSelect.value = course.status || 'draft';
        updatePublishButtonState(); // Update based on loaded data

    } else {
        showToast("Lỗi tải dữ liệu khóa học để chỉnh sửa.", "error");
        navigateTo('user-dashboard', { tab: 'my-courses' });
    }
}


// Categories Page
async function renderCategoriesPage() {
    DOMElements.categoryListDisplay.innerHTML = "<p>Đang tải danh mục...</p>";
    if (categoriesDataCache.length === 0) {
        const response = await window.api.getCategoriesApi();
        if (response.success) categoriesDataCache = response.data;
        else {
            DOMElements.categoryListDisplay.innerHTML = `<p class="empty-state-message">Không thể tải danh mục.</p>`;
            return;
        }
    }

    if (categoriesDataCache.length > 0) {
        DOMElements.categoryListDisplay.innerHTML = categoriesDataCache.map(cat => `
            <a href="#" class="category-card" data-category-id="${cat.id}">
                <i class="${cat.icon || 'fas fa-shapes'}"></i>
                <h3>${cat.name}</h3>
                <p>${cat.course_count || 0} khóa học</p>
            </a>
        `).join('');
        DOMElements.categoryListDisplay.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('all-courses', { category: card.dataset.categoryId });
            });
        });
    } else {
        DOMElements.categoryListDisplay.innerHTML = `<p class="empty-state-message">Không có danh mục nào.</p>`;
    }
}

// --- HELPER & UTILITY FUNCTIONS ---

function formatPrice(price) {
    if (price === null || price === undefined || price < 0) return "N/A"; // Handle null/undefined
    if (price === 0 || price === '0') return "Miễn phí";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
        return dateString; // Fallback if date is invalid
    }
}

function formatDuration(minutes) {
    if (!minutes || minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? h + ' giờ ' : ''}${m > 0 ? m + ' phút' : ''}`.trim();
}

function calculateChapterDuration(lessons = []) {
    const totalMinutes = lessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0);
    return formatDuration(totalMinutes);
}

function getLessonIcon(type) {
    switch (type) {
        case 'video': return 'fa-play-circle';
        case 'text': return 'fa-file-alt';
        case 'quiz': return 'fa-question-circle';
        case 'document': return 'fa-file-pdf'; 
        case 'audio': return 'fa-volume-up';
        default: return 'fa-book-reader';
    }
}

function getPlaceholderImage(text = 'Course') {
    const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, '').substring(0,20); // Sanitize and shorten
    return `https://via.placeholder.com/750x422/E0E0E0/777777?text=${encodeURIComponent(cleanText)}`;
}
function getPlaceholderAvatar(name = 'User') {
    return `https://via.placeholder.com/100/4A90E2/FFFFFF?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`;
}

function populateCategoryFilter(categories) {
    if (DOMElements.categoryFilter) {
        DOMElements.categoryFilter.innerHTML = `<option value="">Tất cả Danh mục</option>`; 
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id; 
            option.textContent = cat.name;
            DOMElements.categoryFilter.appendChild(option);
        });
    }
}
function populateCourseFormCategorySelect(categories) {
     if (DOMElements.courseCategorySelect) {
        DOMElements.courseCategorySelect.innerHTML = `<option value="">Chọn danh mục</option>`; 
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            DOMElements.courseCategorySelect.appendChild(option);
        });
    }
}


function generateCourseCardHTML(course, options = {}) {
    const isWishlisted = currentUser && currentUser.wishlist && currentUser.wishlist.includes(course.id);
    let footerContent = `
        <span class="course-card-price">
            ${formatPrice(course.price)}
            ${(course.original_price && course.original_price > course.price) ? `<span class="original">${formatPrice(course.original_price)}</span>` : ''}
        </span>
        <i class="wishlist-icon ${isWishlisted ? 'fas fa-heart active' : 'far fa-heart'}" data-course-id="${course.id}" title="${isWishlisted ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích'}"></i>
    `;

    if (options.showManageButton && currentUser && course.creator_user_id === currentUser.id) {
        footerContent = `<button class="btn btn-sm btn-primary manage-course-btn-card" data-course-id="${course.id}"><i class="fas fa-edit"></i> Quản lý</button>`;
    } else if (options.showProgress && currentUser && currentUser.enrolledCourseIds.includes(course.id)) {
        const progress = currentUser.courseProgress ? (currentUser.courseProgress[course.id] || 0) : 0; // Placeholder
        footerContent = `
            <div class="course-progress-bar" style="width:100%; background:#e0e0e0; border-radius:4px; height:8px; margin-bottom:5px;">
                <div style="width:${progress}%; background:var(--success-color); height:100%; border-radius:4px;"></div>
            </div>
            <small>${progress}% hoàn thành</small>
            <button class="btn btn-sm btn-primary continue-learning-btn-card" data-course-id="${course.id}">Tiếp tục học</button>
        `;
    }


    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-card-image">
                <img src="${course.image_url || getPlaceholderImage(course.title)}" alt="${course.title}">
            </div>
            <div class="course-card-content">
                ${course.category_name ? `<span class="course-card-category">${course.category_name}</span>` : ''}
                <h3 class="course-card-title" title="${course.title}">${course.title}</h3>
                <p class="course-card-instructor"><i class="fas fa-chalkboard-teacher"></i> ${course.instructor_name || 'N/A'}</p>
                <div class="course-card-meta">
                    <span class="course-card-rating"><i class="fas fa-star"></i> ${(course.average_rating || course.rating || 0).toFixed(1)}</span>
                    <span><i class="fas fa-users"></i> ${course.enrollments_count || course.enrollments || 0}</span>
                    ${course.difficulty ? `<span><i class="fas fa-layer-group"></i> ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}</span>` : ''}
                </div>
                <div class="course-card-footer">
                    ${footerContent}
                </div>
            </div>
        </div>
    `;
}

function renderCourseGrid(courses, containerElement) {
    if (!containerElement) return;
    if (courses && courses.length > 0) {
        containerElement.innerHTML = courses.map(course => generateCourseCardHTML(course)).join('');
    } else {
        containerElement.innerHTML = `<p class="empty-state-message" style="grid-column: 1 / -1;">Không tìm thấy khóa học nào.</p>`;
    }
}

function showToast(message, type = 'info', duration = 3500) { 
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    if (type === 'error') iconClass = 'fas fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';


    toast.innerHTML = `<i class="${iconClass}"></i> <p>${message}</p>`;
    DOMElements.toastNotificationsArea.appendChild(toast);

    // Override animation duration for this specific toast
    if (duration !== 3500) {
      toast.style.animation = `toastInRight 0.5s forwards, toastOutRight 0.5s ${duration / 1000 - 0.5}s forwards`;
    }


    setTimeout(() => {
        toast.remove();
    }, duration); 
}

// --- MODAL HANDLING ---
function openModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'block';
        document.body.classList.add('modal-open');
        const firstInput = modalElement.querySelector('input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 50); 
        }
    }
}

function closeModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none';
        const form = modalElement.querySelector('form');
        // Don't reset form for lesson preview modal
        if (form && modalElement.id !== 'lesson-preview-modal') {
            form.reset(); 
        }
        if (modalElement.id === 'lesson-form-modal') {
            DOMElements.lessonContentFieldsContainerModal.innerHTML = ''; 
        }
        if (modalElement.id === 'lesson-preview-modal') {
            DOMElements.lessonPreviewContent.innerHTML = ''; // Clear preview content
        }
         // Only remove modal-open if no other modals are open
        const anyModalOpen = Array.from(DOMElements.allModals).some(m => m.style.display === 'block');
        if (!anyModalOpen) {
            document.body.classList.remove('modal-open');
        }
    }
}

// --- EVENT LISTENERS SETUP ---
function setupEventListeners() {
    DOMElements.homeLink.addEventListener('click', (e) => { e.preventDefault(); navigateTo('homepage'); });
    DOMElements.footerHomeLink.addEventListener('click', (e) => { e.preventDefault(); navigateTo('homepage'); });
    DOMElements.mainNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            if (sectionId) navigateTo(sectionId);
        });
    });

    // Fix: Ensure authActions exists before adding listener
    if (DOMElements.authActions) {
        DOMElements.authActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('login-btn')) {
                openModal(DOMElements.loginModal);
            } else if (e.target.classList.contains('signup-btn')) {
                openModal(DOMElements.signupModal);
            }
        });
    }
    
    DOMElements.userAvatarContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from closing it immediately
        DOMElements.userAvatarContainer.classList.toggle('active');
        DOMElements.userDropdownMenu.classList.toggle('hidden');
        DOMElements.userDropdownMenu.classList.toggle('open', !DOMElements.userDropdownMenu.classList.contains('hidden'));
    });
    document.addEventListener('click', (e) => {
        if (DOMElements.userMenuContainer && !DOMElements.userMenuContainer.contains(e.target) && DOMElements.userDropdownMenu.classList.contains('open')) {
            DOMElements.userAvatarContainer.classList.remove('active');
            DOMElements.userDropdownMenu.classList.add('hidden');
            DOMElements.userDropdownMenu.classList.remove('open');
        }
    });

    DOMElements.userDropdownMenu.addEventListener('click', (e) => {
        const target = e.target.closest('.dropdown-item');
        if (!target) return;
        e.preventDefault();
         DOMElements.userAvatarContainer.classList.remove('active');
         DOMElements.userDropdownMenu.classList.add('hidden');
         DOMElements.userDropdownMenu.classList.remove('open');

        if (target.classList.contains('btn-logout')) {
            handleLogout();
        } else {
            const section = target.dataset.section;
            const tab = target.dataset.tab;
            if (section) navigateTo(section, { tab });
        }
    });

    DOMElements.closeModalButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(document.getElementById(button.dataset.modal)));
    });
    DOMElements.allModals.forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });
    document.getElementById('show-signup-link')?.addEventListener('click', (e) => { e.preventDefault(); closeModal(DOMElements.loginModal); openModal(DOMElements.signupModal); });
    document.getElementById('show-login-link')?.addEventListener('click', (e) => { e.preventDefault(); closeModal(DOMElements.signupModal); openModal(DOMElements.loginModal); });

    DOMElements.loginForm?.addEventListener('submit', handleLoginFormSubmit);
    DOMElements.signupForm?.addEventListener('submit', handleSignupFormSubmit);

    DOMElements.exploreCoursesBtn?.addEventListener('click', () => navigateTo('all-courses'));
    DOMElements.becomeInstructorBtnHomepage?.addEventListener('click', handleBecomeInstructorClick);
    DOMElements.becomeInstructorBtnCTA?.addEventListener('click', handleBecomeInstructorClick);

    DOMElements.categoryFilter?.addEventListener('change', () => renderAllCoursesPage({ category: DOMElements.categoryFilter.value }));
    DOMElements.difficultyFilter?.addEventListener('change', () => renderAllCoursesPage());
    DOMElements.sortCourses?.addEventListener('change', () => renderAllCoursesPage());
    DOMElements.globalSearchButton?.addEventListener('click', () => {
      if (currentSection !== 'all-courses') navigateTo('all-courses', { search: DOMElements.globalSearchInput.value.trim() });
      else renderAllCoursesPage();
    });
    DOMElements.globalSearchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        if (currentSection !== 'all-courses') navigateTo('all-courses', { search: DOMElements.globalSearchInput.value.trim() });
        else renderAllCoursesPage();
      }
    });
    DOMElements.gridViewBtn?.addEventListener('click', () => {
        DOMElements.allCourseListContainer.classList.remove('list-view');
        // DOMElements.allCourseListContainer.classList.add('grid-view'); // grid-view is default
        DOMElements.gridViewBtn.classList.add('active');
        DOMElements.listViewBtn.classList.remove('active');
    });
    DOMElements.listViewBtn?.addEventListener('click', () => {
        // DOMElements.allCourseListContainer.classList.remove('grid-view');
        DOMElements.allCourseListContainer.classList.add('list-view');
        DOMElements.listViewBtn.classList.add('active');
        DOMElements.gridViewBtn.classList.remove('active');
    });

    document.getElementById('main-content-area').addEventListener('click', (e) => {
        const courseCard = e.target.closest('.course-card');
        const wishlistIcon = e.target.closest('.wishlist-icon');
        const manageBtn = e.target.closest('.manage-course-btn-card');
        const continueBtn = e.target.closest('.continue-learning-btn-card');

        if (wishlistIcon) {
            e.stopPropagation(); 
            handleToggleWishlist(wishlistIcon.dataset.courseId);
            return;
        }
        if (manageBtn) {
             e.stopPropagation();
             navigateTo('create-edit-course', {courseId: manageBtn.dataset.courseId});
             return;
        }
        if (continueBtn) {
            e.stopPropagation();
            showToast(`Tiếp tục học khóa ID: ${continueBtn.dataset.courseId}`, 'info');
            // For now, just go to detail. TODO: Navigate to learning interface for this course
            navigateTo('course-detail', {courseId: continueBtn.dataset.courseId}); 
            return;
        }
        if (courseCard && !e.target.closest('button, .wishlist-icon')) { // Ensure not clicking a button inside card
            navigateTo('course-detail', { courseId: courseCard.dataset.courseId });
        }
    });

    DOMElements.courseDetailTabs?.addEventListener('click', (e) => {
        e.preventDefault();
        const tabLink = e.target.closest('.tab-link');
        if (tabLink && !tabLink.classList.contains('active')) {
            DOMElements.courseDetailTabs.querySelector('.tab-link.active').classList.remove('active');
            tabLink.classList.add('active');
            window.api.getCourseDetailApi(currentCourseDetailId).then(response => {
                if(response.success) renderCourseDetailTab(tabLink.dataset.tab, response.data);
            });
        }
    });
    
    DOMElements.editCourseInfoBtn?.addEventListener('click', () => navigateTo('create-edit-course', { courseId: currentCourseDetailId }));
    DOMElements.manageCourseContentBtn?.addEventListener('click', () => navigateTo('create-edit-course', { courseId: currentCourseDetailId, formTab: 'curriculum' }));
    DOMElements.deleteCourseDetailBtn?.addEventListener('click', () => handleDeleteCourse(currentCourseDetailId));

    DOMElements.dashboardSidebar?.addEventListener('click', (e) => {
        const navLink = e.target.closest('.dashboard-nav-link');
        if (navLink) {
            e.preventDefault();
            navigateTo('user-dashboard', { tab: navLink.dataset.tab });
        }
    });

    DOMElements.courseFormTabs.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            DOMElements.courseFormTabs.forEach(btn => btn.classList.remove('active'));
            tabButton.classList.add('active');
            DOMElements.courseFormTabContents.forEach(content => {
                content.classList.toggle('active', content.dataset.formTabId === tabButton.dataset.formTab);
            });
        });
    });
    DOMElements.courseForm?.addEventListener('submit', (e) => handleCourseFormSubmit(e, 'save'));
    DOMElements.publishCourseBtn?.addEventListener('click', (e) => handleCourseFormSubmit(e, 'publish'));

    DOMElements.addChapterBtnForm?.addEventListener('click', () => {
        openChapterFormModal(DOMElements.courseFormCourseId.value || null);
    });

    DOMElements.chapterForm?.addEventListener('submit', handleChapterModalFormSubmit);
    DOMElements.lessonForm?.addEventListener('submit', handleLessonModalFormSubmit);
    DOMElements.lessonTypeModalSelect?.addEventListener('change', renderLessonContentFieldsModal);

    DOMElements.mobileMenuToggle.addEventListener('click', toggleMobileNav);
}

// --- FORM SUBMISSION HANDLERS ---
async function handleLoginFormSubmit(e) {
    e.preventDefault();
    const email = DOMElements.loginForm.querySelector('#login-email').value;
    const password = DOMElements.loginForm.querySelector('#login-password').value;
    if (!email || !password) {
        showToast("Vui lòng nhập email và mật khẩu.", "error");
        return;
    }
    const response = await window.api.loginUserApi(email, password);
    if (response.success) {
        handleLogin(response.data.user); // Assuming API returns user object in data.user
    } else {
        showToast(response.error || "Đăng nhập thất bại. Kiểm tra lại email hoặc mật khẩu.", "error");
    }
}

async function handleSignupFormSubmit(e) {
    e.preventDefault();
    const name = DOMElements.signupForm.querySelector('#signup-name').value;
    const email = DOMElements.signupForm.querySelector('#signup-email').value;
    const password = DOMElements.signupForm.querySelector('#signup-password').value;
    const confirmPassword = DOMElements.signupForm.querySelector('#signup-confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        showToast("Vui lòng điền đầy đủ thông tin.", "error");
        return;
    }
    if (password.length < 6) {
        showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");
        return;
    }
    if (password !== confirmPassword) {
        showToast("Mật khẩu xác nhận không khớp.", "error");
        return;
    }
    const response = await window.api.registerUserApi(name, email, password);
    if (response.success) {
        showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
        closeModal(DOMElements.signupModal);
        openModal(DOMElements.loginModal);
    } else {
        showToast(response.error || "Đăng ký thất bại. Email có thể đã tồn tại.", "error");
    }
}

async function handleCourseFormSubmit(e, actionType = 'save') { // actionType can be 'save' or 'publish'
    e.preventDefault();
    if (!currentUser) {
        showToast("Vui lòng đăng nhập để thực hiện.", "error");
        return;
    }

    const courseId = DOMElements.courseFormCourseId.value;
    const courseData = {
        // id: courseId ? parseInt(courseId) : undefined, // Backend should handle new ID generation
        title: DOMElements.courseTitleInput.value.trim(),
        short_description: DOMElements.courseSubtitleInput.value.trim(),
        description: DOMElements.courseDescriptionInput.value.trim(), // Use a rich text editor in future
        category_id: DOMElements.courseCategorySelect.value,
        difficulty: DOMElements.courseDifficultySelect.value,
        language: DOMElements.courseLanguageInput.value || 'Tiếng Việt', // Default if hidden
        image_url: DOMElements.courseImageUrlInput.value.trim() || getPlaceholderImage(DOMElements.courseTitleInput.value.trim()),
        promo_video_url: DOMElements.coursePromoVideoUrlInput.value.trim(),
        price: parseFloat(DOMElements.coursePriceInput.value) || 0,
        original_price: parseFloat(DOMElements.courseDiscountPriceInput.value) || undefined,
        status: actionType === 'publish' ? 'published' : (DOMElements.courseStatusSelect.value || 'draft'),
        creator_user_id: currentUser.id,
        chapters: getCurriculumDataFromForm() // Get chapters and lessons
    };
    
    // Validation for required fields
    if (!courseData.title || !courseData.description || !courseData.category_id || courseData.price === null || courseData.price === undefined) {
        showToast("Vui lòng điền đầy đủ các trường bắt buộc (*).", "error", 5000);
        // Highlight first error tab/field if possible
        if(!courseData.title) DOMElements.courseTitleInput.focus();
        else if(!courseData.description) DOMElements.courseDescriptionInput.focus();
        else if(!courseData.category_id) DOMElements.courseCategorySelect.focus();
        else if(courseData.price === null || courseData.price === undefined) DOMElements.coursePriceInput.focus();
        return;
    }
    if (actionType === 'publish' && !checkPublishPrerequisites(courseData, true)) { // true to show toasts
        return; // Prerequisites not met
    }


    const apiFunction = courseId ? window.api.updateCourseApi : window.api.createCourseApi;
    const payload = courseId ? { ...courseData, id: parseInt(courseId) } : courseData; // Add ID only for update
    
    DOMElements.saveCourseBtn.disabled = true;
    DOMElements.publishCourseBtn.disabled = true;
    DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';


    const response = await apiFunction(payload); // Pass payload directly

    DOMElements.saveCourseBtn.disabled = false;
    DOMElements.publishCourseBtn.disabled = false;
    DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Khóa học';


    if (response.success && response.data.course) {
        const savedCourse = response.data.course;
        showToast(actionType === 'publish' ? "Khóa học đã được xuất bản!" : (courseId ? "Khóa học đã được cập nhật!" : "Khóa học đã được lưu làm bản nháp!"), "success");
        
        const courseIndex = coursesDataCache.findIndex(c => c.id === savedCourse.id);
        if (courseIndex > -1) coursesDataCache[courseIndex] = savedCourse;
        else coursesDataCache.push(savedCourse);

        if (currentUser && !currentUser.createdCourseIds.includes(savedCourse.id)) {
            currentUser.createdCourseIds.push(savedCourse.id);
            saveCurrentUser();
        }
        
        navigateTo('course-detail', { courseId: savedCourse.id });
    } else {
        showToast(response.error || "Lưu khóa học thất bại.", "error", 5000);
    }
}

async function handleProfileSettingsUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;

    const name = document.getElementById('profile-name').value;
    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    const confirmNewPassword = document.getElementById('profile-confirm-new-password').value;

    let updateData = { userId: currentUser.id, name };

    if (newPassword) {
        if (!currentPassword) {
            showToast("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.", "error");
            return;
        }
        if (newPassword.length < 6) {
            showToast("Mật khẩu mới phải có ít nhất 6 ký tự.", "error");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showToast("Mật khẩu mới và xác nhận không khớp.", "error");
            return;
        }
        updateData.current_password = currentPassword; // Match backend snake_case
        updateData.new_password = newPassword;
    }

    const response = await window.api.updateUserProfileApi(updateData);
    if (response.success) {
        currentUser.name = name; 
        currentUser.avatarChar = name.charAt(0).toUpperCase();
        saveCurrentUser();
        updateAuthUI(); 
        showToast("Thông tin tài khoản đã được cập nhật.", "success");
        if(document.getElementById('profile-current-password')) document.getElementById('profile-current-password').value = '';
        if(document.getElementById('profile-new-password')) document.getElementById('profile-new-password').value = '';
        if(document.getElementById('profile-confirm-new-password')) document.getElementById('profile-confirm-new-password').value = '';
    } else {
        showToast(response.error || "Cập nhật thất bại.", "error");
    }
}

// --- COURSE ACTIONS (ENROLL, WISHLIST, DELETE) ---
async function handleEnrollCourse(courseId) {
    if (!currentUser) {
        showToast("Vui lòng đăng nhập để đăng ký.", "info");
        openModal(DOMElements.loginModal);
        return;
    }
    const numericCourseId = parseInt(courseId);
    const response = await window.api.enrollInCourseApi(currentUser.id, numericCourseId);
    if (response.success) {
        if (!currentUser.enrolledCourseIds.includes(numericCourseId)) {
            currentUser.enrolledCourseIds.push(numericCourseId);
        }
        saveCurrentUser();
        showToast("Đăng ký khóa học thành công!", "success");
        if (currentSection === 'course-detail' && currentCourseDetailId == numericCourseId) {
            const courseResponse = await window.api.getCourseDetailApi(numericCourseId);
            if(courseResponse.success) updateCourseDetailButtons(courseResponse.data);
        }
    } else {
        showToast(response.error || "Đăng ký thất bại.", "error");
    }
}

async function handleToggleWishlist(courseId) {
    if (!currentUser) {
        showToast("Vui lòng đăng nhập.", "info");
        openModal(DOMElements.loginModal);
        return;
    }
    const numericCourseId = parseInt(courseId); 
    const isWishlisted = currentUser.wishlist.includes(numericCourseId);
    const response = await window.api.toggleWishlistApi(currentUser.id, numericCourseId, !isWishlisted);

    if (response.success) {
        if (isWishlisted) {
            currentUser.wishlist = currentUser.wishlist.filter(id => id !== numericCourseId);
            showToast("Đã xóa khỏi Yêu thích.", "info");
        } else {
            currentUser.wishlist.push(numericCourseId);
            showToast("Đã thêm vào Yêu thích!", "success");
        }
        saveCurrentUser();

        const wishlistIcons = document.querySelectorAll(`.wishlist-icon[data-course-id="${numericCourseId}"]`);
        wishlistIcons.forEach(icon => {
            icon.classList.toggle('fas', !isWishlisted);
            icon.classList.toggle('far', isWishlisted);
            icon.classList.toggle('active', !isWishlisted);
            icon.title = !isWishlisted ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích';
        });
         if (currentSection === 'course-detail' && currentCourseDetailId == numericCourseId) {
            DOMElements.addToWishlistBtn.innerHTML = !isWishlisted ?
            `<i class="fas fa-heart"></i> Đã Yêu thích` :
            `<i class="far fa-heart"></i> Thêm vào Yêu thích`;
            DOMElements.addToWishlistBtn.classList.toggle('active', !isWishlisted);
        }
        if(currentSection === 'user-dashboard' && currentDashboardTab === 'wishlist') {
            renderUserDashboard('wishlist'); 
        }

    } else {
        showToast(response.error || "Thao tác thất bại.", "error");
    }
}

async function handleDeleteCourse(courseId) {
    if (!currentUser || !courseId) return;
    const numericCourseId = parseInt(courseId);
    const courseToDelete = coursesDataCache.find(c => c.id == numericCourseId);
    
    if (!courseToDelete) { // If not in cache, fetch minimal info or assume ownership based on dashboard context
        if (currentSection === 'user-dashboard' && currentDashboardTab === 'my-courses') {
            // Likely safe to proceed with confirmation
        } else {
             showToast("Không tìm thấy thông tin khóa học để xóa.", "warning");
             return;
        }
    } else if (courseToDelete.creator_user_id !== currentUser.id) {
        showToast("Bạn không có quyền xóa khóa học này.", "error");
        return;
    }

    const courseTitle = courseToDelete ? courseToDelete.title : `ID ${numericCourseId}`;
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}" không? Hành động này không thể hoàn tác.`)) {
        return;
    }

    const response = await window.api.deleteCourseApi(numericCourseId, currentUser.id);
    if (response.success) {
        showToast("Khóa học đã được xóa.", "success");
        coursesDataCache = coursesDataCache.filter(c => c.id != numericCourseId);
        if (currentUser.createdCourseIds.includes(numericCourseId)) {
            currentUser.createdCourseIds = currentUser.createdCourseIds.filter(id => id != numericCourseId);
            saveCurrentUser();
        }
        if (currentSection === 'course-detail' && currentCourseDetailId == numericCourseId) {
            navigateTo('user-dashboard', { tab: 'my-courses' });
        } else if (currentSection === 'user-dashboard' && currentDashboardTab === 'my-courses') {
            renderUserDashboard('my-courses');
        }
    } else {
        showToast(response.error || "Xóa khóa học thất bại.", "error");
    }
}

function handleBecomeInstructorClick() {
    if (!currentUser) {
        showToast("Vui lòng đăng nhập hoặc đăng ký để trở thành giảng viên.", "info");
        openModal(DOMElements.signupModal); // Direct to signup if not logged in
    } else {
        navigateTo('create-edit-course');
    }
}


// --- CURRICULUM BUILDER UI (for Create/Edit Course Form) ---
let chapterCounter = 0; 
let lessonCounter = 0;  // For unique temporary IDs for new items

function getCurriculumDataFromForm() {
    const chapters = [];
    DOMElements.curriculumBuilderArea.querySelectorAll('.chapter-form-item').forEach(chapterDiv => {
        const chapterData = {
            id: chapterDiv.dataset.backendId || undefined, // Backend ID if editing, else undefined for new
            ui_id: chapterDiv.dataset.chapterUiId, // Always have UI ID
            title: chapterDiv.querySelector('.chapter-title-form-input').value.trim(),
            description: chapterDiv.querySelector('.chapter-desc-form-input').value.trim(),
            lessons: []
        };
        chapterDiv.querySelectorAll('.lesson-form-item').forEach(lessonDiv => {
            chapterData.lessons.push({
                id: lessonDiv.dataset.backendId || undefined,
                ui_id: lessonDiv.dataset.lessonUiId,
                title: lessonDiv.querySelector('.lesson-form-title').textContent.trim(), // Get from display
                type: lessonDiv.dataset.lessonType,
                content_url: lessonDiv.dataset.lessonContentUrl,
                content_text: lessonDiv.dataset.lessonContentText,
                duration_minutes: parseInt(lessonDiv.dataset.lessonDuration) || null,
                is_previewable: lessonDiv.dataset.lessonPreviewable === 'true'
            });
        });
        chapters.push(chapterData);
    });
    return chapters;
}


function addChapterToFormUI(backendChapterId = null, title = '', description = '', lessons = []) {
    chapterCounter++;
    const chapterUiId = backendChapterId ? `ch_be_${backendChapterId}` : `temp_ch_${chapterCounter}`;

    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'chapter-form-item';
    chapterDiv.dataset.chapterUiId = chapterUiId; 
    if (backendChapterId) chapterDiv.dataset.backendId = backendChapterId;

    chapterDiv.innerHTML = `
        <div class="chapter-form-header">
            <h4>
                <i class="fas fa-grip-vertical" title="Kéo thả để sắp xếp (chưa hoạt động)"></i>
                <input type="text" class="chapter-title-form-input" placeholder="Tên chương (VD: Giới thiệu về Python)" value="${title}">
            </h4>
            <div class="chapter-form-actions">
                <button type="button" class="btn btn-xs btn-success btn-add-lesson-to-chapter" title="Thêm bài giảng"><i class="fas fa-plus"></i> Bài giảng</button>
                <button type="button" class="btn btn-xs btn-outline btn-edit-chapter-in-form" title="Sửa chương"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-xs btn-danger btn-remove-chapter-from-form" title="Xóa chương"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="form-group">
            <textarea class="chapter-desc-form-input" rows="2" placeholder="Mô tả ngắn về chương (tùy chọn)">${description}</textarea>
        </div>
        <div class="lessons-form-list">
            <!-- Lessons will be added here -->
        </div>
    `;
    DOMElements.curriculumBuilderArea.appendChild(chapterDiv);

    lessons.forEach(lesson => {
        addLessonToChapterFormUI(chapterDiv.querySelector('.lessons-form-list'), chapterUiId, lesson.id, lesson.title, lesson.type, lesson.content_url, lesson.content_text, lesson.duration_minutes, lesson.is_previewable);
    });

    chapterDiv.querySelector('.btn-add-lesson-to-chapter').addEventListener('click', () => {
        openLessonFormModal(DOMElements.courseFormCourseId.value, chapterUiId);
    });
    chapterDiv.querySelector('.btn-edit-chapter-in-form').addEventListener('click', () => {
        openChapterFormModal(DOMElements.courseFormCourseId.value, chapterUiId, {
            title: chapterDiv.querySelector('.chapter-title-form-input').value,
            description: chapterDiv.querySelector('.chapter-desc-form-input').value,
        });
    });
    chapterDiv.querySelector('.btn-remove-chapter-from-form').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa chương này và tất cả bài giảng bên trong?')) {
            chapterDiv.remove();
            updatePublishButtonState(); // Update after removing
        }
    });
    // Update publish state whenever chapter/lesson structure changes
    new MutationObserver(updatePublishButtonState).observe(DOMElements.curriculumBuilderArea, { childList: true, subtree: true });

}

function addLessonToChapterFormUI(lessonsListContainer, chapterUiId, backendLessonId = null, title = '', type='video', contentUrl='', contentText='', duration=null, previewable=false) {
    lessonCounter++;
    const lessonUiId = backendLessonId ? `lsn_be_${backendLessonId}` : `temp_lsn_${lessonCounter}`;

    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'lesson-form-item';
    lessonDiv.dataset.lessonUiId = lessonUiId;
    if (backendLessonId) lessonDiv.dataset.backendId = backendLessonId;
    
    // Store all lesson data in dataset attributes for retrieval
    lessonDiv.dataset.lessonTitle = title;
    lessonDiv.dataset.lessonType = type;
    lessonDiv.dataset.lessonContentUrl = contentUrl || '';
    lessonDiv.dataset.lessonContentText = contentText || '';
    lessonDiv.dataset.lessonDuration = duration || '';
    lessonDiv.dataset.lessonPreviewable = previewable || false;


    lessonDiv.innerHTML = `
        <div class="lesson-form-title-container">
            <i class="fas ${getLessonIcon(type)}"></i>
            <span class="lesson-form-title">${title || 'Bài giảng mới'}</span>
            ${previewable ? '<i class="fas fa-eye text-success" title="Có thể xem trước"></i>' : ''}
        </div>
        <div class="lesson-form-meta">
            <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            ${duration ? `<span>&bull; ${formatDuration(duration)}</span>` : ''}
        </div>
        <div class="lesson-form-actions">
            <button type="button" class="btn btn-xs btn-outline btn-edit-lesson-detail" title="Sửa bài giảng"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-xs btn-danger btn-remove-lesson-from-form" title="Xóa bài giảng"><i class="fas fa-trash"></i></button>
        </div>
    `;
    lessonsListContainer.appendChild(lessonDiv);

    lessonDiv.querySelector('.btn-edit-lesson-detail').addEventListener('click', () => {
        openLessonFormModal(
            DOMElements.courseFormCourseId.value, 
            chapterUiId, 
            lessonUiId, 
            { // Pass current data to modal
                title: lessonDiv.dataset.lessonTitle,
                type: lessonDiv.dataset.lessonType,
                contentUrl: lessonDiv.dataset.lessonContentUrl,
                contentText: lessonDiv.dataset.lessonContentText,
                duration: lessonDiv.dataset.lessonDuration,
                previewable: lessonDiv.dataset.lessonPreviewable === 'true'
            }
        );
    });
    lessonDiv.querySelector('.btn-remove-lesson-from-form').addEventListener('click', () => {
         if (confirm('Bạn có chắc muốn xóa bài giảng này?')) {
            lessonDiv.remove();
            updatePublishButtonState(); // Update after removing
        }
    });
}

// --- Chapter/Lesson MODAL Form Handlers ---
function openChapterFormModal(courseId, chapterUiIdToEdit = null, existingData = {}) {
    DOMElements.chapterFormCourseIdModal.value = courseId || DOMElements.courseFormCourseId.value; 
    DOMElements.chapterFormChapterIdModal.value = chapterUiIdToEdit || ''; 

    if (chapterUiIdToEdit) {
        DOMElements.chapterModalTitle.textContent = "Sửa Chương";
        DOMElements.chapterTitleModalInput.value = existingData.title || '';
        DOMElements.chapterDescriptionModalInput.value = existingData.description || '';
    } else {
        DOMElements.chapterModalTitle.textContent = "Thêm Chương Mới";
        DOMElements.chapterForm.reset(); // Reset form for new chapter
    }
    openModal(DOMElements.chapterFormModal);
}

function handleChapterModalFormSubmit(e) {
    e.preventDefault();
    const chapterUiId = DOMElements.chapterFormChapterIdModal.value;
    const title = DOMElements.chapterTitleModalInput.value.trim();
    const description = DOMElements.chapterDescriptionModalInput.value.trim();

    if (!title) {
        showToast("Vui lòng nhập tên chương.", "error");
        DOMElements.chapterTitleModalInput.focus();
        return;
    }

    if (chapterUiId) { 
        const chapterDiv = DOMElements.curriculumBuilderArea.querySelector(`.chapter-form-item[data-chapter-ui-id="${chapterUiId}"]`);
        if (chapterDiv) {
            chapterDiv.querySelector('.chapter-title-form-input').value = title;
            chapterDiv.querySelector('.chapter-desc-form-input').value = description;
        } else {
             console.warn("Could not find chapter UI element to update:", chapterUiId);
        }
    } else { 
        addChapterToFormUI(null, title, description); 
    }
    closeModal(DOMElements.chapterFormModal);
    updatePublishButtonState(); // Update after adding/editing chapter
}

function openLessonFormModal(courseId, chapterUiId, lessonUiIdToEdit = null, existingData = {}) {
    DOMElements.lessonFormCourseIdModal.value = courseId || DOMElements.courseFormCourseId.value;
    DOMElements.lessonFormChapterIdModal.value = chapterUiId;
    DOMElements.lessonFormLessonIdModal.value = lessonUiIdToEdit || '';

    if (lessonUiIdToEdit) {
        DOMElements.lessonModalTitle.textContent = "Sửa Bài giảng";
        DOMElements.lessonTitleModalInput.value = existingData.title || '';
        DOMElements.lessonTypeModalSelect.value = existingData.type || 'video';
        DOMElements.lessonDurationModalInput.value = existingData.duration || '';
        DOMElements.lessonPreviewableModalCheckbox.checked = existingData.previewable || false;
        // Content fields will be populated by renderLessonContentFieldsModal based on type
    } else {
        DOMElements.lessonModalTitle.textContent = "Thêm Bài giảng Mới";
        DOMElements.lessonForm.reset(); 
    }
    renderLessonContentFieldsModal(existingData); // Pass existing data to populate content fields
    openModal(DOMElements.lessonFormModal);
}

function renderLessonContentFieldsModal(existingData = {}) {
    const type = DOMElements.lessonTypeModalSelect.value;
    let fieldsHTML = '';
    const contentUrl = existingData.contentUrl || '';
    const contentText = existingData.contentText || '';

    switch (type) {
        case 'video':
            fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-video-url-modal">URL Video (YouTube, Vimeo, etc.):</label>
                    <input type="url" id="lesson-video-url-modal" placeholder="https://youtube.com/watch?v=..." value="${type === 'video' ? contentUrl : ''}">
                </div>
                <div class="form-group">
                    <label for="lesson-video-file-modal">Hoặc Upload Video (tính năng giả lập, không hoạt động thực tế):</label>
                    <input type="file" id="lesson-video-file-modal" accept="video/*">
                </div>`;
            break;
        case 'text':
            fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-text-content-modal">Nội dung văn bản:</label>
                    <textarea id="lesson-text-content-modal" rows="8" placeholder="Nhập nội dung bài giảng...">${type === 'text' ? contentText : ''}</textarea>
                </div>`;
            break;
        case 'document':
             fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-document-url-modal">URL Tài liệu (VD: Google Drive, Dropbox):</label>
                    <input type="url" id="lesson-document-url-modal" placeholder="https://example.com/document.pdf" value="${type === 'document' ? contentUrl : ''}">
                </div>
                <div class="form-group">
                    <label for="lesson-document-file-modal">Hoặc Upload Tài liệu (giả lập):</label>
                    <input type="file" id="lesson-document-file-modal" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt">
                </div>`;
            break;
        case 'quiz':
            fieldsHTML = `<p>Trình tạo Quiz sẽ được tích hợp ở đây (Coming soon).</p>`;
            break;
        case 'audio':
             fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-audio-url-modal">URL Audio (SoundCloud, etc.):</label>
                    <input type="url" id="lesson-audio-url-modal" placeholder="https://soundcloud.com/track" value="${type === 'audio' ? contentUrl : ''}">
                </div>
                 <div class="form-group">
                    <label for="lesson-audio-file-modal">Hoặc Upload Audio (giả lập):</label>
                    <input type="file" id="lesson-audio-file-modal" accept="audio/*">
                </div>`;
            break;
    }
    DOMElements.lessonContentFieldsContainerModal.innerHTML = fieldsHTML;
}

function handleLessonModalFormSubmit(e) {
    e.preventDefault();
    const chapterUiId = DOMElements.lessonFormChapterIdModal.value;
    const lessonUiId = DOMElements.lessonFormLessonIdModal.value; 
    const title = DOMElements.lessonTitleModalInput.value.trim();
    const type = DOMElements.lessonTypeModalSelect.value;
    const duration = parseInt(DOMElements.lessonDurationModalInput.value) || null;
    const previewable = DOMElements.lessonPreviewableModalCheckbox.checked;
    
    let contentUrl = '';
    let contentText = '';

    if (type === 'video' && document.getElementById('lesson-video-url-modal')) {
        contentUrl = document.getElementById('lesson-video-url-modal').value.trim();
    } else if (type === 'text' && document.getElementById('lesson-text-content-modal')) {
        contentText = document.getElementById('lesson-text-content-modal').value.trim();
    } else if (type === 'document' && document.getElementById('lesson-document-url-modal')) {
        contentUrl = document.getElementById('lesson-document-url-modal').value.trim();
    } else if (type === 'audio' && document.getElementById('lesson-audio-url-modal')) {
        contentUrl = document.getElementById('lesson-audio-url-modal').value.trim();
    }
    // TODO: Handle file uploads if implementing actual file storage

    if (!title) {
        showToast("Vui lòng nhập tên bài giảng.", "error");
        DOMElements.lessonTitleModalInput.focus();
        return;
    }
    if (!chapterUiId) {
        showToast("Lỗi: Không xác định được chương.", "error");
        return;
    }

    const chapterDiv = DOMElements.curriculumBuilderArea.querySelector(`.chapter-form-item[data-chapter-ui-id="${chapterUiId}"]`);
    if (!chapterDiv) {
        showToast("Lỗi: Không tìm thấy chương trong biểu mẫu.", "error");
        return;
    }
    const lessonsListContainer = chapterDiv.querySelector('.lessons-form-list');

    if (lessonUiId) { 
        const lessonDiv = lessonsListContainer.querySelector(`.lesson-form-item[data-lesson-ui-id="${lessonUiId}"]`);
        if (lessonDiv) {
            // Update displayed info and data attributes
            lessonDiv.querySelector('.lesson-form-title').textContent = title;
            lessonDiv.querySelector('.lesson-form-title-container i:first-child').className = `fas ${getLessonIcon(type)}`;
            lessonDiv.querySelector('.lesson-form-meta span:first-child').textContent = type.charAt(0).toUpperCase() + type.slice(1);
            const durationSpan = lessonDiv.querySelector('.lesson-form-meta span:nth-child(2)');
            if(durationSpan) durationSpan.textContent = duration ? `• ${formatDuration(duration)}` : '';
            
            const previewIcon = lessonDiv.querySelector('.lesson-form-title-container .fa-eye');
            if (previewable && !previewIcon) {
                const newPreviewIcon = document.createElement('i');
                newPreviewIcon.className = 'fas fa-eye text-success';
                newPreviewIcon.title = 'Có thể xem trước';
                lessonDiv.querySelector('.lesson-form-title-container').appendChild(newPreviewIcon);
            } else if (!previewable && previewIcon) {
                previewIcon.remove();
            }


            lessonDiv.dataset.lessonTitle = title;
            lessonDiv.dataset.lessonType = type;
            lessonDiv.dataset.lessonContentUrl = contentUrl;
            lessonDiv.dataset.lessonContentText = contentText;
            lessonDiv.dataset.lessonDuration = duration || '';
            lessonDiv.dataset.lessonPreviewable = previewable;
        }
    } else { 
        addLessonToChapterFormUI(lessonsListContainer, chapterUiId, null, title, type, contentUrl, contentText, duration, previewable);
    }
    closeModal(DOMElements.lessonFormModal);
    updatePublishButtonState(); // Update after adding/editing lesson
}

// --- MOBILE NAVIGATION ---
function createMobileNav() {
    if (DOMElements.mobileNavOverlay) return; // Already created

    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    DOMElements.mobileNavOverlay = overlay;

    const nav = document.createElement('nav');
    nav.className = 'mobile-main-nav';
    DOMElements.mobileMainNav = nav;

    const header = document.createElement('div');
    header.className = 'mobile-nav-header';
    header.innerHTML = `
        <div class="logo"><a href="#" id="mobile-logo-link"><i class="fas fa-brain"></i> TriThuc Hub</a></div>
        <button class="close-mobile-menu" aria-label="Đóng menu">×</button>
    `;
    DOMElements.closeMobileMenuBtn = header.querySelector('.close-mobile-menu');

    const ul = document.createElement('ul');
    DOMElements.mainNavLinks.forEach(link => {
        const li = document.createElement('li');
        const clonedLink = link.cloneNode(true);
        li.appendChild(clonedLink);
        ul.appendChild(li);
    });

    nav.appendChild(header);
    nav.appendChild(ul);
    document.body.appendChild(overlay);
    document.body.appendChild(nav);

    DOMElements.closeMobileMenuBtn.addEventListener('click', closeMobileNav);
    DOMElements.mobileNavOverlay.addEventListener('click', closeMobileNav);
    nav.querySelector('#mobile-logo-link').addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileNav();
        navigateTo('homepage');
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileNav();
            const sectionId = link.dataset.section;
            if (sectionId) navigateTo(sectionId);
        });
    });
}

function toggleMobileNav() {
    if (!DOMElements.mobileNavOverlay) createMobileNav(); // Create if not exists
    document.body.classList.toggle('mobile-menu-open');
    DOMElements.mobileNavOverlay.classList.toggle('open');
    DOMElements.mobileMainNav.classList.toggle('open');
}
function closeMobileNav() {
    if (!DOMElements.mobileNavOverlay || !DOMElements.mobileNavOverlay.classList.contains('open')) return;
    document.body.classList.remove('mobile-menu-open');
    DOMElements.mobileNavOverlay.classList.remove('open');
    DOMElements.mobileMainNav.classList.remove('open');
}

// --- PUBLISH COURSE LOGIC ---

function checkPublishPrerequisites(courseData, showToasts = false) {
    const checklistItems = DOMElements.publishChecklist.querySelector('ul');
    const messages = [];

    const conditions = {
        title: courseData.title.trim() !== '',
        description: courseData.description.trim() !== '',
        category: !!courseData.category_id,
        price: courseData.price !== null && courseData.price !== undefined && courseData.price >= 0,
        hasChapters: courseData.chapters && courseData.chapters.length > 0,
        chaptersValid: false, // Sẽ được cập nhật bên dưới
        lessonsValid: false   // Sẽ được cập nhật bên dưới
    };

    if (conditions.hasChapters) {
        conditions.chaptersValid = courseData.chapters.every(ch => ch.title.trim() !== '');
        if (conditions.chaptersValid) { // Chỉ kiểm tra lesson nếu chapter valid
            conditions.lessonsValid = courseData.chapters.every(ch => 
                ch.lessons && ch.lessons.length > 0 && 
                ch.lessons.every(l => l.title.trim() !== '')
            );
        }
    }
    
    let allMet = true;

    const updateChecklistItem = (conditionMet, textMet, textNotMet, iconSelectorBase) => {
        const li = document.createElement('li');
        const icon = document.createElement('i');
        icon.className = `fas ${conditionMet ? 'fa-check-circle text-success' : 'fa-times-circle text-warning'}`;
        li.appendChild(icon);
        li.appendChild(document.createTextNode(` ${conditionMet ? textMet : textNotMet}`));
        if (!conditionMet) allMet = false;
        return li;
    };
    
    if (checklistItems) checklistItems.innerHTML = ''; // Xóa checklist cũ

    let li;
    li = updateChecklistItem(
        conditions.title && conditions.description && conditions.category,
        "Tiêu đề, mô tả và danh mục đã điền.",
        "Cần có: Tiêu đề, mô tả, danh mục."
    );
    if (checklistItems) checklistItems.appendChild(li);
    if (!(conditions.title && conditions.description && conditions.category) && showToasts) messages.push("Vui lòng điền Tiêu đề, Mô tả và chọn Danh mục.");


    li = updateChecklistItem(
        conditions.hasChapters,
        "Đã có chương.",
        "Cần có: Ít nhất 1 chương."
    );
    if (checklistItems) checklistItems.appendChild(li);
    if (!conditions.hasChapters && showToasts) messages.push("Khóa học cần ít nhất 1 chương.");

    if (conditions.hasChapters) { // Chỉ hiển thị các check liên quan đến chapter/lesson nếu có chapter
        li = updateChecklistItem(
            conditions.chaptersValid,
            "Tất cả các chương đều có tên.",
            "Cần có: Mỗi chương phải có tên."
        );
        if (checklistItems) checklistItems.appendChild(li);
        if (!conditions.chaptersValid && showToasts) messages.push("Một số chương chưa có tên.");


        li = updateChecklistItem(
            conditions.lessonsValid,
            "Mỗi chương có ít nhất 1 bài giảng và mỗi bài giảng đều có tên.",
            "Cần có: Mỗi chương có ít nhất 1 bài giảng và mỗi bài giảng phải có tên."
        );
        if (checklistItems) checklistItems.appendChild(li);
        if (!conditions.lessonsValid && showToasts) messages.push("Một số chương thiếu bài giảng, hoặc bài giảng chưa có tên.");
    }


    li = updateChecklistItem(
        true, // Ảnh bìa luôn được coi là 'met' vì có placeholder
        "Ảnh bìa (sẽ dùng ảnh mặc định nếu trống).",
        "" // Sẽ không bao giờ hiển thị vì luôn met
    );
    if (checklistItems) checklistItems.appendChild(li);

    li = updateChecklistItem(
        conditions.price,
        "Giá khóa học hợp lệ.",
        "Cần có: Giá khóa học hợp lệ (lớn hơn hoặc bằng 0)."
    );
    if (checklistItems) checklistItems.appendChild(li);
    if (!conditions.price && showToasts) messages.push("Vui lòng nhập giá khóa học hợp lệ.");
    
    if (showToasts && messages.length > 0) {
        showToast(messages.join("<br>"), "warning", 5000 + messages.length * 1000);
    }

    return allMet && conditions.hasChapters && conditions.chaptersValid && conditions.lessonsValid;
}


function updatePublishButtonState() {
    if (currentSection !== 'create-edit-course' || !DOMElements.courseForm) return;

    const courseDataForCheck = { // Chỉ lấy các trường cần thiết cho checkPublishPrerequisites
        title: DOMElements.courseTitleInput.value,
        description: DOMElements.courseDescriptionInput.value,
        category_id: DOMElements.courseCategorySelect.value,
        price: parseFloat(DOMElements.coursePriceInput.value), // parseFloat có thể trả về NaN
        chapters: getCurriculumDataFromForm()
    };
    // Đảm bảo price là số hoặc null/undefined, không phải NaN
    if (isNaN(courseDataForCheck.price)) courseDataForCheck.price = null;


    const isCurrentlyPublished = DOMElements.courseStatusSelect.value === 'published';
    const canPublishNow = checkPublishPrerequisites(courseDataForCheck, false);

    DOMElements.publishCourseBtn.classList.toggle('hidden', isCurrentlyPublished || !canPublishNow);
    DOMElements.publishCourseBtn.disabled = isCurrentlyPublished || !canPublishNow;

    DOMElements.publishChecklist.classList.toggle('hidden', isCurrentlyPublished || canPublishNow);

    if (isCurrentlyPublished) {
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Cập nhật Khóa học';
        DOMElements.courseStatusSelect.disabled = true; // Giữ disabled nếu đã published
    } else {
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Bản Nháp';
        DOMElements.courseStatusSelect.disabled = true; // Luôn disabled, chỉ thay đổi qua nút
    }
}

async function handleCourseFormSubmit(e, actionType = 'save') {
    e.preventDefault();
    if (!currentUser) {
        showToast("Vui lòng đăng nhập để thực hiện.", "error");
        return;
    }

    const courseId = DOMElements.courseFormCourseId.value;
    // Lấy dữ liệu từ form để kiểm tra và gửi đi
    const courseData = {
        title: DOMElements.courseTitleInput.value.trim(),
        short_description: DOMElements.courseSubtitleInput.value.trim(),
        description: DOMElements.courseDescriptionInput.value.trim(),
        category_id: DOMElements.courseCategorySelect.value,
        difficulty: DOMElements.courseDifficultySelect.value,
        language: DOMElements.courseLanguageInput.value || 'Tiếng Việt',
        image_url: DOMElements.courseImageUrlInput.value.trim() || getPlaceholderImage(DOMElements.courseTitleInput.value.trim()),
        promo_video_url: DOMElements.coursePromoVideoUrlInput.value.trim(),
        price: parseFloat(DOMElements.coursePriceInput.value), // Sẽ được validate sau
        original_price: parseFloat(DOMElements.courseDiscountPriceInput.value) || undefined,
        chapters: getCurriculumDataFromForm(),
        creator_user_id: currentUser.id, // Luôn gửi creator_user_id
        status: DOMElements.courseStatusSelect.value // Status ban đầu từ select (thường là 'draft')
    };
    
    // Validate giá
    if (isNaN(courseData.price) || courseData.price < 0) {
        showToast("Giá khóa học không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 0.", "error", 5000);
        DOMElements.coursePriceInput.focus();
        return;
    }
    if (courseData.original_price !== undefined && (isNaN(courseData.original_price) || courseData.original_price < 0)) {
        showToast("Giá gốc (khuyến mãi) không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 0 hoặc để trống.", "error", 5000);
        DOMElements.courseDiscountPriceInput.focus();
        return;
    }
     if (courseData.original_price !== undefined && courseData.original_price <= courseData.price) {
        showToast("Giá gốc (khuyến mãi) phải lớn hơn giá bán hiện tại.", "error", 5000);
        DOMElements.courseDiscountPriceInput.focus();
        return;
    }


    // Gán status dựa trên actionType
    if (actionType === 'publish') {
        courseData.status = 'published';
    } else { // actionType === 'save'
        // Nếu khóa học đã được published trước đó (khi edit), thì lưu vẫn giữ status là published
        // Nếu là draft, thì vẫn là draft.
        // DOMElements.courseStatusSelect.value sẽ phản ánh điều này nếu loadCourseDataForEditing chạy đúng.
        courseData.status = DOMElements.courseStatusSelect.value || 'draft';
    }
    
    // Kiểm tra các trường bắt buộc cơ bản
    if (!courseData.title || !courseData.description || !courseData.category_id) {
        showToast("Vui lòng điền đầy đủ Tiêu đề, Mô tả và chọn Danh mục.", "error", 5000);
        if(!courseData.title) DOMElements.courseTitleInput.focus();
        else if(!courseData.description) {
            DOMElements.courseFormTabs.forEach(t => t.classList.remove('active'));
            DOMElements.courseFormTabContents.forEach(c => c.classList.remove('active'));
            DOMElements.courseFormTabs[0].classList.add('active'); // Mở tab Basic Info
            DOMElements.courseFormTabContents[0].classList.add('active');
            DOMElements.courseDescriptionInput.focus();
        }
        else if(!courseData.category_id) DOMElements.courseCategorySelect.focus();
        return;
    }

    // Nếu hành động là 'publish', kiểm tra các điều kiện tiên quyết đầy đủ
    if (actionType === 'publish') {
        if (!checkPublishPrerequisites(courseData, true)) { // true để hiển thị toast nếu có lỗi
            // Không cần làm gì thêm ở đây vì checkPublishPrerequisites đã show toast
            return;
        }
    }

    const originalSaveBtnText = DOMElements.saveCourseBtn.innerHTML;
    const originalPublishBtnText = DOMElements.publishCourseBtn.innerHTML;
    DOMElements.saveCourseBtn.disabled = true;
    DOMElements.publishCourseBtn.disabled = true;
    const loadingText = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    DOMElements.saveCourseBtn.innerHTML = loadingText;
    if (!DOMElements.publishCourseBtn.classList.contains('hidden')) {
        DOMElements.publishCourseBtn.innerHTML = loadingText;
    }

    const apiFunction = courseId ? window.api.updateCourseApi : window.api.createCourseApi;
    // Nếu là update, đảm bảo gửi ID
    const payload = courseId ? { ...courseData, id: parseInt(courseId) } : courseData;

    const response = await apiFunction(payload);

    // Khôi phục trạng thái nút sau khi API trả về
    DOMElements.saveCourseBtn.disabled = false;
    // Trạng thái của publishCourseBtn sẽ được updatePublishButtonState() xử lý ngay sau đây
    // hoặc nếu navigateTo thì không cần nữa.

    if (response.success && response.data.course) {
        const savedCourse = response.data.course;
        showToast(
            actionType === 'publish' ? "Khóa học đã được xuất bản thành công!" : 
            (courseId ? "Khóa học đã được cập nhật thành công!" : "Khóa học đã được lưu làm bản nháp!"), 
            "success"
        );
        
        const courseIndex = coursesDataCache.findIndex(c => c.id === savedCourse.id);
        if (courseIndex > -1) {
            coursesDataCache[courseIndex] = { ...coursesDataCache[courseIndex], ...savedCourse }; // Merge, giữ lại các key chưa có trong savedCourse nếu cần
        } else {
            coursesDataCache.push(savedCourse);
        }

        if (currentUser && !currentUser.createdCourseIds.includes(savedCourse.id)) {
            currentUser.createdCourseIds.push(savedCourse.id);
            saveCurrentUser();
        }
        
        // Cập nhật DOMElements.courseStatusSelect.value TRƯỚC KHI navigate
        // để nếu có quay lại edit ngay, nó đã đúng status
        DOMElements.courseStatusSelect.value = savedCourse.status;
        currentCreateEditCourseId = savedCourse.id; // Cập nhật ID nếu là tạo mới

        navigateTo('course-detail', { courseId: savedCourse.id });
    } else {
        showToast(response.error || "Thao tác với khóa học thất bại.", "error", 7000);
        // Khôi phục text nút nếu thất bại và ở lại trang
        DOMElements.saveCourseBtn.innerHTML = originalSaveBtnText;
        if (!DOMElements.publishCourseBtn.classList.contains('hidden')) {
             DOMElements.publishCourseBtn.innerHTML = originalPublishBtnText;
        }
        updatePublishButtonState(); // Cập nhật lại trạng thái nút publish và checklist
    }
}
function updatePublishButtonState() {
    if (currentSection !== 'create-edit-course') return;

    const courseData = {
        title: DOMElements.courseTitleInput.value.trim(),
        description: DOMElements.courseDescriptionInput.value.trim(),
        category_id: DOMElements.courseCategorySelect.value,
        price: parseFloat(DOMElements.coursePriceInput.value),
        chapters: getCurriculumDataFromForm()
    };
    const isPublished = DOMElements.courseStatusSelect.value === 'published';
    const canPublish = checkPublishPrerequisites(courseData, false); // false: don't show toasts on every input change

    DOMElements.publishCourseBtn.classList.toggle('hidden', isPublished || !canPublish);
    DOMElements.publishChecklist.classList.toggle('hidden', isPublished || canPublish); // Show checklist if not published AND cannot publish

    if (isPublished) {
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Cập nhật Khóa học (Đã xuất bản)';
    } else {
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Bản Nháp';
    }
}


// --- LESSON PREVIEW MODAL ---
function showLessonPreviewModal(lessonData) { // lessonData: { title, type, contentUrl, contentText }
    DOMElements.lessonPreviewTitle.textContent = `Xem trước: ${lessonData.title}`;
    let previewHTML = '';
    switch (lessonData.type) {
        case 'video':
            if (lessonData.contentUrl) {
                if (lessonData.contentUrl.includes('youtube.com') || lessonData.contentUrl.includes('youtu.be')) {
                    const videoId = lessonData.contentUrl.split('v=')[1]?.split('&')[0] || lessonData.contentUrl.split('/').pop();
                    previewHTML = `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else if (lessonData.contentUrl.includes('vimeo.com')) {
                    const videoId = lessonData.contentUrl.split('/').pop();
                    previewHTML = `<iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="450" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
                } else { // Assume direct video link
                    previewHTML = `<video controls width="100%" style="max-height: 450px;"><source src="${lessonData.contentUrl}" type="video/mp4">Trình duyệt của bạn không hỗ trợ thẻ video.</video>`;
                }
            } else {
                previewHTML = `<p class="text-warning">Không có URL video để xem trước.</p>`;
            }
            break;
        case 'text':
            previewHTML = `<div class="text-content-preview">${lessonData.contentText || '<p class="text-warning">Không có nội dung văn bản để xem trước.</p>'}</div>`;
            break;
        case 'document':
             if (lessonData.contentUrl) {
                // Attempt to embed PDF, otherwise provide a link
                if (lessonData.contentUrl.toLowerCase().endsWith('.pdf')) {
                    previewHTML = `<iframe src="${lessonData.contentUrl}" width="100%" height="500px" style="border: none;"></iframe><p class="text-center mt-2"><a href="${lessonData.contentUrl}" target="_blank" class="btn btn-sm btn-secondary">Mở tài liệu trong tab mới</a></p>`;
                } else {
                    previewHTML = `<p>Không thể nhúng trực tiếp loại tài liệu này. <a href="${lessonData.contentUrl}" target="_blank" class="btn btn-sm btn-primary">Xem tài liệu</a></p>`;
                }
            } else {
                previewHTML = `<p class="text-warning">Không có URL tài liệu để xem trước.</p>`;
            }
            break;
        default:
            previewHTML = `<p class="text-info">Không hỗ trợ xem trước cho loại bài giảng này.</p>`;
    }
    DOMElements.lessonPreviewContent.innerHTML = previewHTML;
    openModal(DOMElements.lessonPreviewModal);
}