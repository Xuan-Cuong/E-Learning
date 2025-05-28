let currentUser = null;
let currentSection = 'homepage';
let currentCourseDetailId = null; // ID of course being viewed
let currentDashboardTab = 'dashboard-overview';
let currentCreateEditCourseId = null; // ID of course being edited/created
let isEditingCourse = false; // Flag to differentiate create vs edit mode


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
    authActions: document.querySelector('.auth-actions'),
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
    courseFormTabs: document.querySelectorAll('#create-edit-course .form-tab-link'),
    courseFormTabContents: document.querySelectorAll('#create-edit-course .form-tab-content'),
    courseTitleInput: document.getElementById('course-title-input'),
    courseSubtitleInput: document.getElementById('course-subtitle-input'),
    courseDescriptionInput: document.getElementById('course-description-input'),
    courseCategorySelect: document.getElementById('course-category-select'),
    courseDifficultySelect: document.getElementById('course-difficulty-select'),
    courseLanguageInput: document.getElementById('course-language-input'),
    courseWhatYouWillLearnTextarea: document.getElementById('course-what-you-will-learn'),
    courseRequirementsTextarea: document.getElementById('course-requirements'),
    curriculumBuilderArea: document.getElementById('curriculum-builder-area'),
    addChapterBtnForm: document.getElementById('add-chapter-btn-form'),
    courseImageUrlInput: document.getElementById('course-image-url-input'),
    courseBannerImageUrlInput: document.getElementById('course-banner-image-url-input'),
    coursePromoVideoUrlInput: document.getElementById('course-promo-video-url-input'),
    coursePriceInput: document.getElementById('course-price-input'),
    courseOriginalPriceInput: document.getElementById('course-original-price-input'),
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
    console.log("App Initializing...");
    loadCurrentUser();
    updateAuthUI();
    setupEventListeners();
    await loadInitialData();
    handleInitialNavigation();
    if (DOMElements.currentYearSpan) {
        DOMElements.currentYearSpan.textContent = new Date().getFullYear();
    }
    console.log("App Initialized.");
}

async function loadInitialData() {
    try {
        const categoriesPromise = window.api.getCategoriesApi();
        const [categoriesResponse] = await Promise.all([categoriesPromise]);

        if (categoriesResponse.success) {
            categoriesDataCache = categoriesResponse.data;
            populateCategoryFilter(categoriesDataCache);
            populateCourseFormCategorySelect(categoriesDataCache);
        } else {
            console.error("Failed to load categories:", categoriesResponse.error);
            showToast("Lỗi tải danh mục.", "error");
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
            navigateTo(sectionId, { courseId: param }, false);
        } else if (sectionId === 'user-dashboard' && param) {
            navigateTo(sectionId, { tab: param }, false);
        } else if (sectionId === 'create-edit-course') {
            const courseIdFromHash = (param && param !== '_') ? param : null;
            // isEditingCourse and currentCreateEditCourseId will be set correctly by navigateTo
            navigateTo(sectionId, { courseId: courseIdFromHash, formTab: subParam || 'basic-info' }, false);
        } else if (document.getElementById(sectionId)) { // Check if section exists
            navigateTo(sectionId, null, false);
        } else {
            navigateTo('homepage', null, false); // Fallback if section in hash doesn't exist
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
        const avatarChar = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?');

        DOMElements.userAvatarPlaceholderHeader.textContent = avatarChar;
        DOMElements.userAvatarPlaceholderDropdown.textContent = avatarChar;
        DOMElements.userDisplayNameDropdown.textContent = currentUser.name || currentUser.email;

        if (currentSection === 'user-dashboard' && DOMElements.dashboardAvatar) {
            DOMElements.dashboardAvatar.textContent = avatarChar;
            DOMElements.dashboardUsername.textContent = currentUser.name || currentUser.email;
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

function handleLogin(userDataFromApi) {
    currentUser = {
        id: userDataFromApi.id,
        name: userDataFromApi.name,
        email: userDataFromApi.email,
        avatarUrl: userDataFromApi.avatarUrl,
        createdCourseIds: userDataFromApi.createdCourseIds || [],
        enrolledCourseIds: userDataFromApi.enrolledCourseIds || [],
        wishlist: userDataFromApi.wishlist || [],
    };
    saveCurrentUser();
    updateAuthUI();
    closeModal(DOMElements.loginModal);
    showToast(`Chào mừng trở lại, ${currentUser.name || currentUser.email}!`, "success");

    if (currentSection === 'course-detail' && currentCourseDetailId) {
        renderCourseDetail(currentCourseDetailId);
    } else if (currentSection === 'all-courses') {
        renderAllCoursesPage();
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

    if (currentSection === 'create-edit-course') {
        currentCreateEditCourseId = null;
        isEditingCourse = false;
    }

    if (['user-dashboard', 'create-edit-course'].includes(currentSection)) {
        navigateTo('homepage');
    } else if (currentSection === 'course-detail' && currentCourseDetailId) {
        renderCourseDetail(currentCourseDetailId);
    } else if (currentSection === 'all-courses') {
        renderAllCoursesPage();
    }
}

// --- NAVIGATION ---
function navigateTo(sectionId, params = {}, pushState = true) {
    console.log(`Navigating to: ${sectionId} with params:`, params);
    currentSection = sectionId;

    // Update global state variables based on navigation target
    currentCourseDetailId = (sectionId === 'course-detail' && params && params.courseId) ? params.courseId : null;
    currentDashboardTab = (sectionId === 'user-dashboard' && params && params.tab) ? params.tab : (sectionId === 'user-dashboard' ? 'dashboard-overview' : currentDashboardTab);

    if (sectionId === 'create-edit-course') {
        isEditingCourse = !!(params && params.courseId); // True if courseId is present (editing)
        currentCreateEditCourseId = (params && params.courseId) ? params.courseId : null; // Store the ID being edited or null for new
    }
    // Note: currentCreateEditCourseId and isEditingCourse are NOT reset when navigating AWAY from create-edit-course.
    // They are only set/cleared when navigating TO create-edit-course or explicitly (e.g., logout).

    // Hide all sections, then show the target one
    DOMElements.allSections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active-section');
    } else {
        console.warn(`Section with ID "${sectionId}" not found. Defaulting to homepage.`);
        DOMElements.homepageSection.classList.remove('hidden');
        DOMElements.homepageSection.classList.add('active-section');
        currentSection = 'homepage'; // Update currentSection to reflect fallback
    }

    // Update active state for main navigation links
    DOMElements.mainNavLinks.forEach(link => {
        link.classList.toggle('active-nav', link.dataset.section === currentSection);
    });
    if (DOMElements.mobileMainNav) {
        DOMElements.mobileMainNav.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active-nav', link.dataset.section === currentSection);
        });
    }

    // Update active state for dashboard navigation links
    if (currentSection === 'user-dashboard' && DOMElements.dashboardNavLinks) {
        DOMElements.dashboardNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.tab === currentDashboardTab);
        });
    }

    loadSectionContent(currentSection, params); // Load content for the new section

    // Update browser history and URL
    if (pushState) {
        let historyUrl = `#${currentSection}`;
        if (currentCourseDetailId) {
            historyUrl += `/${currentCourseDetailId}`;
        } else if (sectionId === 'user-dashboard' && currentDashboardTab) {
            historyUrl += `/${currentDashboardTab}`;
        } else if (sectionId === 'create-edit-course') {
            if (currentCreateEditCourseId) { // Editing existing
                historyUrl += `/${currentCreateEditCourseId}`;
            } else { // Creating new
                historyUrl += `/_`; // Placeholder for new course ID
            }
            // Append form tab if provided
            if (params && params.formTab) {
                historyUrl += `/${params.formTab}`;
            }
        }
        // Only push state if URL actually changes from current hash to avoid redundant entries
        if (window.location.hash !== historyUrl) {
            history.pushState({ section: currentSection, params: params }, '', historyUrl);
        }
    }
    window.scrollTo(0, 0); // Scroll to top of page on navigation
}


window.onpopstate = (event) => {
    if (event.state && event.state.section) {
        // When using browser back/forward, params are in event.state.params
        navigateTo(event.state.section, event.state.params || {}, false);
    } else {
        // If no state, might be initial load or manual hash change
        handleInitialNavigation();
    }
};

async function loadSectionContent(sectionId, params) {
    console.log(`Loading content for section: ${sectionId} with params:`, params);
    // Hide all tab contents before loading new one
    DOMElements.allSections.forEach(s => {
      if(s.id !== sectionId) s.classList.remove('active-section'); // Remove active from others
    });

    switch (sectionId) {
        case 'homepage':
            renderHomepage();
            break;
        case 'all-courses':
            renderAllCoursesPage(params);
            break;
        case 'course-detail':
            if (params && params.courseId) renderCourseDetail(params.courseId);
            else {
                console.warn("Course ID missing for course-detail section.");
                navigateTo('all-courses');
            }
            break;
        case 'user-dashboard':
            if (!currentUser) { navigateTo('homepage'); showToast("Vui lòng đăng nhập.", "info"); return; }
            renderUserDashboard((params && params.tab) ? params.tab : 'dashboard-overview');
            break;
        case 'create-edit-course':
            if (!currentUser) { navigateTo('homepage'); showToast("Vui lòng đăng nhập.", "info"); return; }
            renderCreateEditCourseForm(currentCreateEditCourseId, (params && params.formTab) ? params.formTab : 'basic-info');
            break;
        case 'categories':
            renderCategoriesPage();
            break;
        case 'about-us':
            // Static content, no specific load function needed
            break;
        default:
            console.warn("Unhandled section:", sectionId);
            renderHomepage(); // Fallback to homepage
    }
}

// --- UI RENDERING FUNCTIONS ---

// Homepage
async function renderHomepage() {
    if (DOMElements.featuredCourseList) {
        DOMElements.featuredCourseList.innerHTML = '<p>Đang tải khóa học...</p>';
        const response = await window.api.getCoursesApi(6, '', '', '', 'popular');
        if (response.success) {
            renderCourseGrid(response.data, DOMElements.featuredCourseList);
        } else {
            DOMElements.featuredCourseList.innerHTML = `<p class="empty-state-message">Không thể tải khóa học nổi bật.</p>`;
        }
    }
}

// All Courses Page
async function renderAllCoursesPage(filters = {}) {
    DOMElements.allCourseListContainer.innerHTML = '<p>Đang tìm kiếm khóa học...</p>';
    const queryParams = {
        categoryId: filters.category || DOMElements.categoryFilter.value,
        difficulty: DOMElements.difficultyFilter.value,
        sortBy: DOMElements.sortCourses.value,
        search: filters.search || DOMElements.globalSearchInput.value.trim(), // Use passed search first
        ...filters
    };

    const response = await window.api.getCoursesApi(null, queryParams.search, queryParams.categoryId, queryParams.difficulty, queryParams.sortBy);

    if (response.success) {
        coursesDataCache = response.data;
        renderCourseGrid(response.data, DOMElements.allCourseListContainer);
    } else {
        DOMElements.allCourseListContainer.innerHTML = `<p class="empty-state-message">Không thể tải danh sách khóa học.</p>`;
    }
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
    currentCourseDetailId = course.id;

    DOMElements.detailCourseTitleBanner.textContent = course.title;
    DOMElements.detailCourseShortDescBanner.textContent = course.shortDescription || '';
    DOMElements.detailCourseInstructorBanner.innerHTML = `<i class="fas fa-user-tie"></i> ${escapeHTML(course.instructorName || 'N/A')}`;
    DOMElements.detailCourseRatingBanner.textContent = (course.rating || 0).toFixed(1);
    DOMElements.detailCourseReviewsCountBanner.textContent = course.reviewsCount || 0;
    DOMElements.detailCourseEnrollmentsBanner.textContent = course.enrollments || 0;

    const bannerImageUrl = course.bannerImage || course.image;
    if (bannerImageUrl) {
      DOMElements.courseDetailBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('${escapeHTML(bannerImageUrl)}')`;
    } else {
      DOMElements.courseDetailBanner.style.backgroundImage = `linear-gradient(135deg, var(--primary-color) 0%, #2980B9 100%)`;
    }

    DOMElements.detailCourseImageMain.src = course.image || getPlaceholderImage(course.title);
    DOMElements.detailCourseImageMain.alt = course.title;

    const playPreviewBtn = DOMElements.courseVideoPreviewPlayer.querySelector('.play-preview-btn');
    if (course.promoVideoUrl) {
        playPreviewBtn.classList.remove('hidden');
        playPreviewBtn.onclick = () => showLessonPreviewModal({
            title: `Preview: ${course.title}`,
            type: 'video',
            contentUrl: course.promoVideoUrl,
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

    DOMElements.courseIncludesList.innerHTML = (course.whatYouWillLearn || [])
        .map(item => `<li><i class="fas fa-check-circle text-success"></i> ${escapeHTML(item)}</li>`).join('') || '<li>Thông tin đang được cập nhật.</li>';

    if (currentUser && currentUser.id === course.creatorUserID) {
        DOMElements.instructorManagementSidebar.classList.remove('hidden');
    } else {
        DOMElements.instructorManagementSidebar.classList.add('hidden');
    }

    const activeTabLink = DOMElements.courseDetailTabs.querySelector('.tab-link.active') || DOMElements.courseDetailTabs.querySelector('.tab-link[data-tab="overview"]');
    DOMElements.courseDetailTabs.querySelectorAll('.tab-link').forEach(tl => tl.classList.remove('active'));
    activeTabLink.classList.add('active');
    renderCourseDetailTab(activeTabLink.dataset.tab, course);
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
            DOMElements.goToCourseBtn.onclick = () => { navigateTo('course-detail', { courseId: course.id }); /* TODO: Navigate to learning interface */ };
        } else {
            DOMElements.enrollNowSidebarBtn.classList.remove('hidden');
            DOMElements.enrollNowSidebarBtn.innerHTML = `<i class="fas fa-bolt"></i> Đăng ký ngay`;
            DOMElements.enrollNowSidebarBtn.disabled = false;
            DOMElements.enrollNowSidebarBtn.onclick = () => handleEnrollCourse(course.id);
            DOMElements.goToCourseBtn.classList.add('hidden');
        }

        DOMElements.addToWishlistBtn.classList.remove('hidden');
        DOMElements.addToWishlistBtn.innerHTML = isWishlisted ?
            `<i class="fas fa-heart text-danger"></i> Đã Yêu thích` :
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
                    <ul class="fa-ul">${course.whatYouWillLearn.map(item => `<li><span class="fa-li"><i class="fas fa-check text-success"></i></span> ${escapeHTML(item)}</li>`).join('')}</ul>
                ` : ''}
                ${course.requirements && course.requirements.length > 0 ? `
                    <h4>Yêu cầu</h4>
                    <ul class="fa-ul">${course.requirements.map(item => `<li><span class="fa-li"><i class="fas fa-angle-right"></i></span> ${escapeHTML(item)}</li>`).join('')}</ul>
                ` : '<h4>Yêu cầu</h4><p>Không có yêu cầu đặc biệt.</p>'}
            `;
            break;
        case 'curriculum':
            content = `<h3>Nội dung khóa học</h3>`;
            if (course.chapters && course.chapters.length > 0) {
                course.chapters.forEach((chapter, index) => {
                    content += `
                        <div class="curriculum-section ${index === 0 ? 'open' : ''}">
                            <div class="curriculum-section-header" data-chapter-id="${chapter.id}">
                                <h4>${escapeHTML(chapter.title)}</h4>
                                <span class="section-meta">${chapter.lessons_count || (chapter.lessons ? chapter.lessons.length : 0)} bài giảng • ${calculateChapterDuration(chapter.lessons)}</span>
                                <i class="fas fa-chevron-down toggle-icon"></i>
                            </div>
                            <ul class="curriculum-lessons-list">
                                ${(chapter.lessons || []).map(lesson => `
                                    <li class="curriculum-lesson-item" data-lesson-id="${lesson.id}">
                                        <i class="fas ${getLessonIcon(lesson.type)} lesson-type-icon"></i>
                                        <span class="lesson-title-curriculum">${escapeHTML(lesson.title)}</span>
                                        ${lesson.is_previewable ? `<button class="btn btn-xs btn-outline lesson-preview-btn-curriculum"
                                            data-lesson-title="${escapeHTML(lesson.title)}"
                                            data-lesson-type="${lesson.type}"
                                            data-lesson-content-url="${lesson.content_url || ''}"
                                            data-lesson-content-text="${escapeHTML(lesson.content_text || '')}"
                                            >Xem trước</button>` : ''}
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
            const instructor = course.instructor;
            if (instructor) {
                content = `
                    <h3>Về Giảng viên</h3>
                    <div class="instructor-profile-box">
                        <div class="instructor-avatar">
                            <img src="${instructor.avatar_url || getPlaceholderAvatar(instructor.name)}" alt="${escapeHTML(instructor.name)}">
                        </div>
                        <div class="instructor-info">
                            <h4>${escapeHTML(instructor.name)}</h4>
                            <p class="instructor-title">${escapeHTML(instructor.title || 'Chuyên gia đào tạo')}</p>
                        </div>
                    </div>
                    <div class="instructor-bio">${instructor.bio || 'Chưa có thông tin giới thiệu về giảng viên.'}</div>
                `;
            } else {
                content = `<p>Thông tin giảng viên đang được cập nhật.</p>`;
            }
            break;
        case 'reviews':
            content = `<h3>Đánh giá từ học viên (${course.reviewsCount || 0})</h3>`;
            if (course.reviews && course.reviews.length > 0) {
                content += `<div class="review-list">`;
                course.reviews.forEach(review => {
                    content += `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="review-avatar">${review.user_name ? review.user_name.charAt(0).toUpperCase() : '?'}</span>
                                <span class="review-author-name">${escapeHTML(review.user_name)}</span>
                                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                                <span class="review-date">${formatDate(review.created_at)}</span>
                            </div>
                            <p class="review-content">${escapeHTML(review.comment)}</p>
                        </div>
                    `;
                });
                content += `</div>`;
            } else {
                content += `<p>Chưa có đánh giá nào cho khóa học này.</p>`;
            }
            break;
        case 'qna':
             content = `<h3>Hỏi & Đáp</h3><p>Tính năng Hỏi & Đáp sắp ra mắt.</p>`;
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
                const lessonTitle = e.currentTarget.dataset.lessonTitle;
                const lessonType = e.currentTarget.dataset.lessonType;
                const lessonContentUrl = e.currentTarget.dataset.lessonContentUrl;
                const lessonContentText = e.currentTarget.dataset.lessonContentText;
                showLessonPreviewModal({
                    title: unescapeHTML(lessonTitle),
                    type: lessonType,
                    contentUrl: lessonContentUrl,
                    contentText: unescapeHTML(lessonContentText),
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
        const avatarChar = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?');
        DOMElements.dashboardAvatar.textContent = avatarChar;
        DOMElements.dashboardUsername.textContent = currentUser.name || currentUser.email;
        DOMElements.dashboardUserEmail.textContent = currentUser.email;
    }
    DOMElements.dashboardMainContent.innerHTML = `<div class="dashboard-tab-content active"><p>Đang tải nội dung...</p></div>`;

    let content = '';
    let responseData;

    switch (tabId) {
        case 'dashboard-overview':
            content = `<h2>Chào mừng, ${escapeHTML(currentUser.name || currentUser.email)}!</h2><p>Đây là bảng điều khiển của bạn. Theo dõi tiến độ học tập và quản lý các khóa học.</p>`;
            break;
        case 'my-courses':
            content = `<h2>Khóa học đã tạo</h2>`;
            responseData = await window.api.getUserCreatedCoursesApi(currentUser.id);
            if (responseData.success && responseData.data.length > 0) {
                content += `<div class="course-grid dashboard-course-grid">`;
                responseData.data.forEach(course => content += generateCourseCardHTML(course, { showManageButton: true, showStatus: true }));
                content += `</div>`;
            } else if (responseData.success) {
                 content += `<div class="empty-state-message">
                                <i class="fas fa-chalkboard"></i>
                                <p>Bạn chưa tạo khóa học nào.</p>
                                <button class="btn btn-primary create-course-from-dashboard-btn"><i class="fas fa-plus"></i> Tạo khóa học mới</button>
                            </div>`;
            } else {
                content += `<p class="text-danger">Lỗi tải khóa học đã tạo: ${responseData.error || 'Unknown error'}</p>`;
            }
            break;
        case 'enrolled-courses':
            content = `<h2>Khóa học đã đăng ký</h2>`;
            responseData = await window.api.getUserEnrolledCoursesApi(currentUser.id);
            if (responseData.success && responseData.data.length > 0) {
                content += `<div class="course-grid dashboard-course-grid">`;
                responseData.data.forEach(course => content += generateCourseCardHTML(course, { showProgress: true }));
                content += `</div>`;
            } else if (responseData.success) {
                content += `<div class="empty-state-message">
                                <i class="fas fa-book-reader"></i>
                                <p>Bạn chưa đăng ký khóa học nào.</p>
                                <button class="btn btn-primary browse-courses-from-dashboard-btn"><i class="fas fa-search"></i> Duyệt khóa học</button>
                            </div>`;
            } else {
                 content += `<p class="text-danger">Lỗi tải khóa học đã đăng ký: ${responseData.error || 'Unknown error'}</p>`;
            }
            break;
        case 'wishlist':
            content = `<h2>Danh sách Yêu thích</h2>`;
            responseData = await window.api.getUserWishlistApi(currentUser.id);
            if (responseData.success && responseData.data.length > 0) {
                content += `<div class="course-grid dashboard-course-grid">`;
                responseData.data.forEach(course => content += generateCourseCardHTML(course));
                content += `</div>`;
            } else if (responseData.success) {
                content += `<div class="empty-state-message">
                                <i class="far fa-heart"></i>
                                <p>Danh sách yêu thích của bạn trống.</p>
                            </div>`;
            } else {
                content += `<p class="text-danger">Lỗi tải danh sách yêu thích: ${responseData.error || 'Unknown error'}</p>`;
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
                        <input type="text" id="profile-name" value="${escapeHTML(currentUser.name || '')}" required>
                    </div>
                    <div class="form-group">
                        <label for="profile-email">Email:</label>
                        <input type="email" id="profile-email" value="${escapeHTML(currentUser.email)}" required disabled>
                         <small>Email không thể thay đổi.</small>
                    </div>
                    <div class="form-group">
                        <label for="profile-current-password">Mật khẩu hiện tại (nếu muốn đổi):</label>
                        <input type="password" id="profile-current-password" placeholder="Để trống nếu không đổi">
                    </div>
                    <div class="form-group">
                        <label for="profile-new-password">Mật khẩu mới:</label>
                        <input type="password" id="profile-new-password" minlength="6" placeholder="Ít nhất 6 ký tự">
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
        if (createBtn) createBtn.addEventListener('click', () => {
            currentCreateEditCourseId = null;
            isEditingCourse = false;
            navigateTo('create-edit-course');
        });
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


async function renderCreateEditCourseForm(courseIdToUse = null, targetTab = 'basic-info') {
    console.log(`renderCreateEditCourseForm: courseIdToUse=${courseIdToUse}, isEditingCourse=${isEditingCourse}, targetTab=${targetTab}`);

    if (!isEditingCourse) { // Tạo mới
        console.log("Rendering NEW course form.");
        DOMElements.courseForm.reset();
        DOMElements.courseFormCourseId.value = '';
        DOMElements.curriculumBuilderArea.innerHTML = '';
        DOMElements.createEditCourseTitle.textContent = "Tạo Khóa Học Mới";
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Bản Nháp';
        DOMElements.courseLanguageInput.value = "Tiếng Việt";
        DOMElements.courseStatusSelect.value = 'draft';
    } else if (courseIdToUse) { // Chỉnh sửa
        console.log(`Rendering EDIT course form for ID: ${courseIdToUse}`);
        DOMElements.createEditCourseTitle.textContent = "Chỉnh sửa Khóa học";
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Thay đổi';
        DOMElements.courseFormCourseId.value = courseIdToUse;
        await loadCourseDataForEditing(courseIdToUse);
    } else {
        console.error("State error in renderCreateEditCourseForm: isEditingCourse is true but courseIdToUse is null.");
        showToast("Lỗi tải form. Vui lòng thử lại.", "error");
        navigateTo('user-dashboard', { tab: 'my-courses' });
        return;
    }

    DOMElements.courseFormTabs.forEach(tab => tab.classList.remove('active'));
    DOMElements.courseFormTabContents.forEach(content => content.classList.remove('active'));

    let validTargetTab = targetTab;
    const availableTabs = Array.from(DOMElements.courseFormTabs).map(t => t.dataset.formTab);
    if (!availableTabs.includes(targetTab)) {
        validTargetTab = 'basic-info';
    }

    const activeTabButton = Array.from(DOMElements.courseFormTabs).find(tab => tab.dataset.formTab === validTargetTab);
    const activeTabContent = Array.from(DOMElements.courseFormTabContents).find(content => content.dataset.formTabId === validTargetTab);

    if(activeTabButton) activeTabButton.classList.add('active');
    if(activeTabContent) activeTabContent.classList.add('active');

    updatePublishButtonState();

    if (!DOMElements.courseForm.dataset.listenersAttached) {
        ['input', 'change'].forEach(eventType => {
            DOMElements.courseForm.addEventListener(eventType, updatePublishButtonState);
        });
        DOMElements.curriculumBuilderArea.addEventListener('chapterAdded', updatePublishButtonState);
        DOMElements.curriculumBuilderArea.addEventListener('chapterRemoved', updatePublishButtonState);
        DOMElements.curriculumBuilderArea.addEventListener('lessonAdded', updatePublishButtonState);
        DOMElements.curriculumBuilderArea.addEventListener('lessonRemoved', updatePublishButtonState);
        DOMElements.curriculumBuilderArea.addEventListener('lessonUpdated', updatePublishButtonState);
        DOMElements.courseForm.dataset.listenersAttached = 'true';
    }
}
async function loadCourseDataForEditing(courseId) {
    const response = await window.api.getCourseDetailApi(courseId);
    if (response.success && response.data) {
        const course = response.data;
        DOMElements.courseFormCourseId.value = course.id;
        DOMElements.courseTitleInput.value = course.title || '';
        DOMElements.courseSubtitleInput.value = course.shortDescription || '';
        DOMElements.courseDescriptionInput.value = course.description || '';
        DOMElements.courseCategorySelect.value = course.category_id || '';
        DOMElements.courseDifficultySelect.value = course.difficulty || 'beginner';
        DOMElements.courseLanguageInput.value = course.language || 'Tiếng Việt';

        DOMElements.courseWhatYouWillLearnTextarea.value = (course.whatYouWillLearn || []).join('\n');
        DOMElements.courseRequirementsTextarea.value = (course.requirements || []).join('\n');

        DOMElements.curriculumBuilderArea.innerHTML = '';
        if (course.chapters && course.chapters.length > 0) {
            course.chapters.forEach(chapter => {
                addChapterToFormUI(chapter.id, chapter.title, chapter.description, chapter.lessons);
            });
        }

        DOMElements.courseImageUrlInput.value = course.image || '';
        DOMElements.courseBannerImageUrlInput.value = course.bannerImage || '';
        DOMElements.coursePromoVideoUrlInput.value = course.promoVideoUrl || '';
        DOMElements.coursePriceInput.value = course.price === null || course.price === undefined ? '' : course.price;
        DOMElements.courseOriginalPriceInput.value = course.originalPrice === null || course.originalPrice === undefined ? '' : course.originalPrice;

        DOMElements.courseStatusSelect.value = course.status || 'draft';
        updatePublishButtonState();

    } else {
        showToast("Lỗi tải dữ liệu khóa học để chỉnh sửa.", "error");
        navigateTo('user-dashboard', { tab: 'my-courses' });
    }
}

// Categories Page
async function renderCategoriesPage() {
    DOMElements.categoryListDisplay.innerHTML = "<p>Đang tải danh mục...</p>";
    const response = await window.api.getCategoriesApi();
    if (response.success) {
        categoriesDataCache = response.data;
    } else {
        DOMElements.categoryListDisplay.innerHTML = `<p class="empty-state-message">Không thể tải danh mục.</p>`;
        return;
    }

    if (categoriesDataCache.length > 0) {
        DOMElements.categoryListDisplay.innerHTML = categoriesDataCache.map(cat => `
            <a href="#" class="category-card" data-category-id="${cat.id}">
                <i class="${cat.icon || 'fas fa-shapes'}"></i>
                <h3>${escapeHTML(cat.name)}</h3>
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
    if (price === null || price === undefined || price < 0) return "N/A";
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

function formatDuration(minutes) {
    if (!minutes || minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let parts = [];
    if (h > 0) parts.push(`${h} giờ`);
    if (m > 0) parts.push(`${m} phút`);
    return parts.join(' ');
}

function calculateChapterDuration(lessons = []) {
    const totalMinutes = lessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0);
    return formatDuration(totalMinutes) || '0 phút';
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
    const cleanText = text.replace(/[^a-zA-Z0-9\sÀ-ỹ]/gu, '').substring(0,20);
    return `https://via.placeholder.com/750x422/E0E0E0/777777?text=${encodeURIComponent(cleanText || 'TriThucHub')}`;
}
function getPlaceholderAvatar(name = 'User') {
    const char = name ? name.charAt(0).toUpperCase() : '?';
    return `https://via.placeholder.com/100/4A90E2/FFFFFF?text=${encodeURIComponent(char)}`;
}

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}
function unescapeHTML(str) {
    if (str === null || str === undefined) return '';
    const doc = new DOMParser().parseFromString(String(str), 'text/html');
    return doc.documentElement.textContent;
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

    let footerContent;
    if (options.showManageButton && currentUser && course.creatorUserID === currentUser.id) {
        footerContent = `<button class="btn btn-sm btn-primary manage-course-btn-card" data-course-id="${course.id}"><i class="fas fa-edit"></i> Quản lý</button>`;
        if(options.showStatus && course.status) {
             footerContent += `<span class="badge badge-${course.status === 'published' ? 'success' : 'warning'} ml-2">${course.status === 'published' ? 'Đã Xuất bản' : 'Bản nháp'}</span>`;
        }
    } else if (options.showProgress && currentUser && currentUser.enrolledCourseIds.includes(course.id)) {
        const progress = course.progress || 0;
        footerContent = `
            <div class="course-progress-bar">
                <div style="width:${progress}%;"></div>
            </div>
            <small>${progress}% hoàn thành</small>
            <button class="btn btn-sm btn-primary continue-learning-btn-card" data-course-id="${course.id}">Tiếp tục học</button>
        `;
    } else {
        footerContent = `
            <span class="course-card-price">
                ${formatPrice(course.price)}
                ${(course.original_price && course.original_price > course.price) ? `<span class="original">${formatPrice(course.original_price)}</span>` : ''}
            </span>
            <i class="wishlist-icon ${isWishlisted ? 'fas fa-heart text-danger' : 'far fa-heart'}" data-course-id="${course.id}" title="${isWishlisted ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích'}"></i>
        `;
    }

    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-card-image">
                <img src="${course.image_url || getPlaceholderImage(course.title)}" alt="${escapeHTML(course.title)}">
            </div>
            <div class="course-card-content">
                ${course.category_name ? `<span class="course-card-category">${escapeHTML(course.category_name)}</span>` : ''}
                <h3 class="course-card-title" title="${escapeHTML(course.title)}">${escapeHTML(course.title)}</h3>
                <p class="course-card-instructor"><i class="fas fa-chalkboard-teacher"></i> ${escapeHTML(course.instructor_name || 'N/A')}</p>
                <div class="course-card-meta">
                    <span class="course-card-rating"><i class="fas fa-star"></i> ${(course.average_rating || 0).toFixed(1)}</span>
                    <span><i class="fas fa-users"></i> ${course.enrollments_count || 0}</span>
                    ${course.difficulty ? `<span><i class="fas fa-layer-group"></i> ${escapeHTML(course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1))}</span>` : ''}
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
    if (type === 'error') iconClass = 'fas fa-times-circle';
    if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';

    toast.innerHTML = `<i class="${iconClass}"></i> <p>${message}</p>`;
    DOMElements.toastNotificationsArea.appendChild(toast);

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
        modalElement.style.display = 'flex';
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
        if (form && modalElement.id !== 'lesson-preview-modal') {
            form.reset();
        }
        if (modalElement.id === 'lesson-form-modal') {
            DOMElements.lessonContentFieldsContainerModal.innerHTML = '';
        }
        if (modalElement.id === 'lesson-preview-modal') {
            DOMElements.lessonPreviewContent.innerHTML = '';
        }
        const anyModalOpen = Array.from(DOMElements.allModals).some(m => m.style.display === 'flex' || m.style.display === 'block');
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

    if (DOMElements.authActions) {
        DOMElements.authActions.addEventListener('click', (e) => {
            const loginBtn = e.target.closest('.login-btn');
            const signupBtn = e.target.closest('.signup-btn');
            if (loginBtn) {
                openModal(DOMElements.loginModal);
            } else if (signupBtn) {
                openModal(DOMElements.signupModal);
            }
        });
    }

    DOMElements.userAvatarContainer.addEventListener('click', (e) => {
        e.stopPropagation();
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

        DOMElements.userAvatarContainer.classList.remove('active');
        DOMElements.userDropdownMenu.classList.add('hidden');
        DOMElements.userDropdownMenu.classList.remove('open');

        if (target.classList.contains('btn-logout')) {
            e.preventDefault();
            handleLogout();
        } else {
            const section = target.dataset.section;
            const tab = target.dataset.tab;
            if (section) {
                e.preventDefault();
                navigateTo(section, { tab });
            }
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

    const performGlobalSearch = () => {
        if (currentSection !== 'all-courses') {
            navigateTo('all-courses', { search: DOMElements.globalSearchInput.value.trim() });
        } else {
            renderAllCoursesPage({search: DOMElements.globalSearchInput.value.trim()});
        }
    };
    DOMElements.globalSearchButton?.addEventListener('click', performGlobalSearch);
    DOMElements.globalSearchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performGlobalSearch();
    });

    DOMElements.gridViewBtn?.addEventListener('click', () => {
        DOMElements.allCourseListContainer.classList.remove('list-view');
        DOMElements.gridViewBtn.classList.add('active');
        DOMElements.listViewBtn.classList.remove('active');
    });
    DOMElements.listViewBtn?.addEventListener('click', () => {
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
            navigateTo('course-detail', {courseId: continueBtn.dataset.courseId});
            return;
        }
        if (courseCard && !e.target.closest('button, .wishlist-icon, a')) {
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

    DOMElements.editCourseInfoBtn?.addEventListener('click', () => navigateTo('create-edit-course', { courseId: currentCourseDetailId, formTab: 'basic-info' }));
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
            if(currentSection === 'create-edit-course' && history.pushState) {
                let newUrl = `#create-edit-course`;
                newUrl += `/${currentCreateEditCourseId || '_'}`;
                newUrl += `/${tabButton.dataset.formTab}`;
                // history.replaceState(null, '', newUrl); // Gây ra reload không mong muốn khi back
            }
        });
    });
    DOMElements.courseForm?.addEventListener('submit', (e) => handleCourseFormSubmit(e, 'save'));
    DOMElements.publishCourseBtn?.addEventListener('click', (e) => handleCourseFormSubmit(e, 'publish'));

    DOMElements.addChapterBtnForm?.addEventListener('click', () => {
        openChapterFormModal(currentCreateEditCourseId);
    });

    DOMElements.chapterForm?.addEventListener('submit', handleChapterModalFormSubmit);
    DOMElements.lessonForm?.addEventListener('submit', handleLessonModalFormSubmit);
    DOMElements.lessonTypeModalSelect?.addEventListener('change', () => {
        const lessonUiId = DOMElements.lessonFormLessonIdModal.value;
        let existingDataForContent = {};
        if (lessonUiId) {
            const lessonDiv = DOMElements.curriculumBuilderArea.querySelector(`.lesson-form-item[data-lesson-ui-id="${lessonUiId}"]`);
            if (lessonDiv) {
                 existingDataForContent = {
                    contentUrl: lessonDiv.dataset.lessonContentUrl,
                    contentText: lessonDiv.dataset.lessonContentText,
                    mediaFileName: lessonDiv.dataset.lessonMediaFileName, // Pass mediaFileName
                 };
            }
        }
        renderLessonContentFieldsModal(existingDataForContent);
    });

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
    if (response.success && response.user) {
        handleLogin(response.user);
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
        showToast("Vui lòng điền đầy đủ thông tin.", "error"); return;
    }
    if (password.length < 6) {
        showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error"); return;
    }
    if (password !== confirmPassword) {
        showToast("Mật khẩu xác nhận không khớp.", "error"); return;
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
            showToast("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.", "error"); return;
        }
        if (newPassword.length < 6) {
            showToast("Mật khẩu mới phải có ít nhất 6 ký tự.", "error"); return;
        }
        if (newPassword !== confirmNewPassword) {
            showToast("Mật khẩu mới và xác nhận không khớp.", "error"); return;
        }
        updateData.current_password = currentPassword;
        updateData.new_password = newPassword;
    }

    const response = await window.api.updateUserProfileApi(updateData);
    if (response.success) {
        currentUser.name = name;
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
            if(courseResponse.success) {
                updateCourseDetailButtons(courseResponse.data);
                DOMElements.detailCourseEnrollmentsBanner.textContent = courseResponse.data.enrollments || 0;
            }
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
            icon.classList.toggle('text-danger', !isWishlisted);
            icon.title = !isWishlisted ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích';
        });

         if (currentSection === 'course-detail' && currentCourseDetailId == numericCourseId) {
            DOMElements.addToWishlistBtn.innerHTML = !isWishlisted ?
            `<i class="fas fa-heart text-danger"></i> Đã Yêu thích` :
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

async function handleDeleteCourse(courseIdToDelete) {
    if (!currentUser || !courseIdToDelete) return;
    const numericCourseId = parseInt(courseIdToDelete);

    const courseInCache = coursesDataCache.find(c => c.id == numericCourseId);
    const courseTitle = courseInCache ? courseInCache.title : `ID ${numericCourseId}`;

    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${escapeHTML(courseTitle)}" không? Hành động này không thể hoàn tác.`)) {
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
        } else if (currentSection === 'all-courses') {
            renderAllCoursesPage();
        }
    } else {
        showToast(response.error || "Xóa khóa học thất bại.", "error");
    }
}

function handleBecomeInstructorClick() {
    if (!currentUser) {
        showToast("Vui lòng đăng nhập hoặc đăng ký để trở thành giảng viên.", "info");
        openModal(DOMElements.loginModal);
    } else {
        currentCreateEditCourseId = null;
        isEditingCourse = false;
        navigateTo('create-edit-course');
    }
}


// --- CURRICULUM BUILDER UI (for Create/Edit Course Form) ---
let chapterCounter = 0;
let lessonCounter = 0;

function getCurriculumDataFromForm() {
    const chapters = [];
    DOMElements.curriculumBuilderArea.querySelectorAll('.chapter-form-item').forEach((chapterDiv, chapterIndex) => {
        const chapterData = {
            title: chapterDiv.querySelector('.chapter-title-form-input').value.trim(),
            description: chapterDiv.querySelector('.chapter-desc-form-input').value.trim(),
            sort_order: chapterIndex,
            lessons: []
        };
        chapterDiv.querySelectorAll('.lesson-form-item').forEach((lessonDiv, lessonIndex) => {
            chapterData.lessons.push({
                title: lessonDiv.dataset.lessonTitle,
                type: lessonDiv.dataset.lessonType,
                content_url: lessonDiv.dataset.lessonContentUrl || null,
                content_text: lessonDiv.dataset.lessonContentText || null,
                media_file_name: lessonDiv.dataset.lessonMediaFileName || null,
                duration_minutes: parseInt(lessonDiv.dataset.lessonDuration) || null,
                is_previewable: lessonDiv.dataset.lessonPreviewable === 'true',
                sort_order: lessonIndex
            });
        });
        chapters.push(chapterData);
    });
    return chapters;
}


function addChapterToFormUI(backendChapterId = null, title = '', description = '', lessons = []) {
    chapterCounter++;
    const chapterUiId = backendChapterId ? `ch_be_${backendChapterId}` : `temp_ch_${Date.now()}_${chapterCounter}`;

    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'chapter-form-item';
    chapterDiv.dataset.chapterUiId = chapterUiId;
    if (backendChapterId) chapterDiv.dataset.backendId = backendChapterId;

    chapterDiv.innerHTML = `
        <div class="chapter-form-header">
            <h4>
                <i class="fas fa-grip-vertical chapter-drag-handle" title="Kéo thả để sắp xếp (chưa hoạt động)"></i>
                <input type="text" class="chapter-title-form-input" placeholder="Tên chương (VD: Giới thiệu về Python)" value="${escapeHTML(title)}">
            </h4>
            <div class="chapter-form-actions">
                <button type="button" class="btn btn-xs btn-success btn-add-lesson-to-chapter" title="Thêm bài giảng"><i class="fas fa-plus"></i> Bài giảng</button>
                <button type="button" class="btn btn-xs btn-outline btn-edit-chapter-in-form" title="Sửa chương"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-xs btn-danger btn-remove-chapter-from-form" title="Xóa chương"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="form-group">
            <textarea class="chapter-desc-form-input" rows="2" placeholder="Mô tả ngắn về chương (tùy chọn)">${escapeHTML(description)}</textarea>
        </div>
        <div class="lessons-form-list"></div>
    `;
    DOMElements.curriculumBuilderArea.appendChild(chapterDiv);

    if (lessons && lessons.length > 0) {
        lessons.forEach(lesson => {
            addLessonToChapterFormUI(
                chapterDiv.querySelector('.lessons-form-list'),
                chapterUiId,
                lesson.id,
                lesson.title,
                lesson.type,
                lesson.content_url,
                lesson.content_text,
                lesson.media_file_name,
                lesson.duration_minutes,
                lesson.is_previewable
            );
        });
    }


    chapterDiv.querySelector('.btn-add-lesson-to-chapter').addEventListener('click', () => {
        openLessonFormModal(currentCreateEditCourseId, chapterUiId);
    });
    chapterDiv.querySelector('.btn-edit-chapter-in-form').addEventListener('click', () => {
        openChapterFormModal(currentCreateEditCourseId, chapterUiId, {
            title: chapterDiv.querySelector('.chapter-title-form-input').value,
            description: chapterDiv.querySelector('.chapter-desc-form-input').value,
        });
    });
    chapterDiv.querySelector('.btn-remove-chapter-from-form').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa chương này và tất cả bài giảng bên trong?')) {
            chapterDiv.remove();
            DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('chapterRemoved'));
        }
    });

    chapterDiv.querySelector('.chapter-title-form-input').addEventListener('input', () => {
      DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('chapterUpdated'));
    });
}

function addLessonToChapterFormUI(
    lessonsListContainer, chapterUiId, backendLessonId = null,
    title = '', type='video', contentUrl='', contentText='', mediaFileName='',
    duration=null, previewable=false
) {
    lessonCounter++;
    const lessonUiId = backendLessonId ? `lsn_be_${backendLessonId}` : `temp_lsn_${Date.now()}_${lessonCounter}`;

    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'lesson-form-item';
    lessonDiv.dataset.lessonUiId = lessonUiId;
    if (backendLessonId) lessonDiv.dataset.backendId = backendLessonId;

    lessonDiv.dataset.lessonTitle = title;
    lessonDiv.dataset.lessonType = type;
    lessonDiv.dataset.lessonContentUrl = contentUrl || '';
    lessonDiv.dataset.lessonContentText = contentText || '';
    lessonDiv.dataset.lessonMediaFileName = mediaFileName || '';
    lessonDiv.dataset.lessonDuration = duration || '';
    lessonDiv.dataset.lessonPreviewable = previewable || false;


    lessonDiv.innerHTML = `
        <div class="lesson-form-title-container">
            <i class="fas fa-grip-vertical lesson-drag-handle" title="Kéo thả (chưa hoạt động)"></i>
            <i class="fas ${getLessonIcon(type)}"></i>
            <span class="lesson-form-title">${escapeHTML(title) || 'Bài giảng mới'}</span>
            ${previewable ? '<i class="fas fa-eye text-success ml-1" title="Có thể xem trước"></i>' : ''}
        </div>
        <div class="lesson-form-meta">
            <span>${escapeHTML(type.charAt(0).toUpperCase() + type.slice(1))}</span>
            ${duration ? `<span>• ${formatDuration(duration)}</span>` : ''}
            ${mediaFileName ? `<span class="text-muted small ml-1" title="${escapeHTML(mediaFileName)}">• <i class="fas fa-paperclip"></i></span>` : ''}
        </div>
        <div class="lesson-form-actions">
            <button type="button" class="btn btn-xs btn-outline btn-edit-lesson-detail" title="Sửa bài giảng"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-xs btn-danger btn-remove-lesson-from-form" title="Xóa bài giảng"><i class="fas fa-trash"></i></button>
        </div>
    `;
    lessonsListContainer.appendChild(lessonDiv);

    lessonDiv.querySelector('.btn-edit-lesson-detail').addEventListener('click', () => {
        openLessonFormModal(
            currentCreateEditCourseId,
            chapterUiId,
            lessonUiId,
            {
                title: lessonDiv.dataset.lessonTitle,
                type: lessonDiv.dataset.lessonType,
                contentUrl: lessonDiv.dataset.lessonContentUrl,
                contentText: lessonDiv.dataset.lessonContentText,
                mediaFileName: lessonDiv.dataset.lessonMediaFileName,
                duration: lessonDiv.dataset.lessonDuration,
                previewable: lessonDiv.dataset.lessonPreviewable === 'true'
            }
        );
    });
    lessonDiv.querySelector('.btn-remove-lesson-from-form').addEventListener('click', () => {
         if (confirm('Bạn có chắc muốn xóa bài giảng này?')) {
            lessonDiv.remove();
             DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('lessonRemoved'));
        }
    });
}

// --- Chapter/Lesson MODAL Form Handlers ---
function openChapterFormModal(courseId, chapterUiIdToEdit = null, existingData = {}) {
    DOMElements.chapterFormChapterIdModal.value = chapterUiIdToEdit || '';

    if (chapterUiIdToEdit) {
        DOMElements.chapterModalTitle.textContent = "Sửa Chương";
        DOMElements.chapterTitleModalInput.value = existingData.title || '';
        DOMElements.chapterDescriptionModalInput.value = existingData.description || '';
    } else {
        DOMElements.chapterModalTitle.textContent = "Thêm Chương Mới";
        DOMElements.chapterForm.reset();
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
            DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('chapterUpdated'));
        }
    } else {
        addChapterToFormUI(null, title, description);
        DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('chapterAdded'));
    }
    closeModal(DOMElements.chapterFormModal);
}

function openLessonFormModal(courseId, chapterUiId, lessonUiIdToEdit = null, existingData = {}) {
    DOMElements.lessonFormChapterIdModal.value = chapterUiId;
    DOMElements.lessonFormLessonIdModal.value = lessonUiIdToEdit || '';

    if (lessonUiIdToEdit) {
        DOMElements.lessonModalTitle.textContent = "Sửa Bài giảng";
        DOMElements.lessonTitleModalInput.value = existingData.title || '';
        DOMElements.lessonTypeModalSelect.value = existingData.type || 'video';
        DOMElements.lessonDurationModalInput.value = existingData.duration || '';
        DOMElements.lessonPreviewableModalCheckbox.checked = existingData.previewable || false;
    } else {
        DOMElements.lessonModalTitle.textContent = "Thêm Bài giảng Mới";
        DOMElements.lessonForm.reset();
        DOMElements.lessonTypeModalSelect.value = 'video';
    }
    renderLessonContentFieldsModal(existingData);
    openModal(DOMElements.lessonFormModal);
}

function renderLessonContentFieldsModal(existingData = {}) {
    const type = DOMElements.lessonTypeModalSelect.value;
    let fieldsHTML = '';
    const contentUrl = existingData.contentUrl || '';
    const contentText = existingData.contentText || '';
    const mediaFileName = existingData.mediaFileName || '';

    switch (type) {
        case 'video':
            fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-video-url-modal">URL Video (YouTube, Vimeo, etc.):</label>
                    <input type="url" id="lesson-video-url-modal" placeholder="Dán URL nếu dùng video hosted bên ngoài" value="${type === 'video' ? contentUrl : ''}">
                </div>
                <div class="form-group">
                    <label for="lesson-video-file-modal">Hoặc Upload Video Mới:</label>
                    <input type="file" id="lesson-video-file-modal" class="lesson-file-input" accept="video/mp4,video/webm,video/ogg">
                    ${mediaFileName && type === 'video' ? `<small class="text-success">File hiện tại: ${escapeHTML(mediaFileName)}</small>` : ''}
                </div>`;
            break;
        case 'text':
            fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-text-content-modal">Nội dung văn bản:</label>
                    <textarea id="lesson-text-content-modal" rows="8" placeholder="Nhập nội dung bài giảng...">${type === 'text' ? escapeHTML(contentText) : ''}</textarea>
                </div>`;
            break;
        case 'document':
             fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-document-url-modal">URL Tài liệu (VD: Google Drive, Dropbox):</label>
                    <input type="url" id="lesson-document-url-modal" placeholder="Dán URL nếu dùng tài liệu hosted bên ngoài" value="${type === 'document' ? contentUrl : ''}">
                </div>
                <div class="form-group">
                    <label for="lesson-document-file-modal">Hoặc Upload Tài liệu Mới:</label>
                    <input type="file" id="lesson-document-file-modal" class="lesson-file-input" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip">
                     ${mediaFileName && type === 'document' ? `<small class="text-success">File hiện tại: ${escapeHTML(mediaFileName)}</small>` : ''}
                </div>`;
            break;
        case 'audio':
             fieldsHTML = `
                <div class="form-group">
                    <label for="lesson-audio-url-modal">URL Audio (SoundCloud, etc.):</label>
                    <input type="url" id="lesson-audio-url-modal" placeholder="Dán URL nếu dùng audio hosted bên ngoài" value="${type === 'audio' ? contentUrl : ''}">
                </div>
                 <div class="form-group">
                    <label for="lesson-audio-file-modal">Hoặc Upload Audio Mới:</label>
                    <input type="file" id="lesson-audio-file-modal" class="lesson-file-input" accept="audio/mpeg,audio/ogg,audio/wav">
                     ${mediaFileName && type === 'audio' ? `<small class="text-success">File hiện tại: ${escapeHTML(mediaFileName)}</small>` : ''}
                </div>`;
            break;
        case 'quiz':
            fieldsHTML = `<p>Trình tạo Quiz sẽ được tích hợp ở đây (Coming soon).</p>`;
            break;
    }
    DOMElements.lessonContentFieldsContainerModal.innerHTML = fieldsHTML;
}

async function handleLessonModalFormSubmit(e) {
    e.preventDefault();
    const chapterUiId = DOMElements.lessonFormChapterIdModal.value;
    const lessonUiId = DOMElements.lessonFormLessonIdModal.value;
    const title = DOMElements.lessonTitleModalInput.value.trim();
    const type = DOMElements.lessonTypeModalSelect.value;
    const duration = parseInt(DOMElements.lessonDurationModalInput.value) || null;
    const previewable = DOMElements.lessonPreviewableModalCheckbox.checked;

    let contentUrl = '';
    let contentText = '';
    let mediaFileName = '';
    let fileToUpload = null;

    const fileInput = DOMElements.lessonContentFieldsContainerModal.querySelector('.lesson-file-input');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        fileToUpload = fileInput.files[0];
    } else if (lessonUiId) {
        const existingLessonDiv = DOMElements.curriculumBuilderArea.querySelector(`.lesson-form-item[data-lesson-ui-id="${lessonUiId}"]`);
        if (existingLessonDiv) mediaFileName = existingLessonDiv.dataset.lessonMediaFileName || '';
    }


    if (type === 'video' && document.getElementById('lesson-video-url-modal')) {
        contentUrl = document.getElementById('lesson-video-url-modal').value.trim();
    } else if (type === 'text' && document.getElementById('lesson-text-content-modal')) {
        contentText = document.getElementById('lesson-text-content-modal').value.trim();
    } else if (type === 'document' && document.getElementById('lesson-document-url-modal')) {
        contentUrl = document.getElementById('lesson-document-url-modal').value.trim();
    } else if (type === 'audio' && document.getElementById('lesson-audio-url-modal')) {
        contentUrl = document.getElementById('lesson-audio-url-modal').value.trim();
    }

    if (!title) {
        showToast("Vui lòng nhập tên bài giảng.", "error"); DOMElements.lessonTitleModalInput.focus(); return;
    }
    if (!chapterUiId) {
        showToast("Lỗi: Không xác định được chương.", "error"); return;
    }

    const chapterDiv = DOMElements.curriculumBuilderArea.querySelector(`.chapter-form-item[data-chapter-ui-id="${chapterUiId}"]`);
    if (!chapterDiv) {
        showToast("Lỗi: Không tìm thấy chương trong biểu mẫu.", "error"); return;
    }
    const lessonsListContainer = chapterDiv.querySelector('.lessons-form-list');

    if (fileToUpload) {
        DOMElements.saveLessonBtnModal.disabled = true;
        DOMElements.saveLessonBtnModal.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải lên...';

        let fileTypeContext = 'videos';
        if (type === 'document') fileTypeContext = 'attachments';
        else if (type === 'audio') fileTypeContext = 'videos';

        const uploadResponse = await window.api.uploadLessonMediaApi(fileToUpload, fileTypeContext);

        DOMElements.saveLessonBtnModal.disabled = false;
        DOMElements.saveLessonBtnModal.innerHTML = 'Lưu Bài giảng';

        if (uploadResponse.success && uploadResponse.fileName) {
            mediaFileName = uploadResponse.fileName;
            contentUrl = '';
            showToast("Tải file lên thành công!", "success");
        } else {
            showToast(`Lỗi tải file: ${uploadResponse.error || 'Không thành công.'}`, "error", 5000);
            return;
        }
    }


    if (lessonUiId) {
        const lessonDiv = lessonsListContainer.querySelector(`.lesson-form-item[data-lesson-ui-id="${lessonUiId}"]`);
        if (lessonDiv) {
            lessonDiv.dataset.lessonTitle = title;
            lessonDiv.dataset.lessonType = type;
            lessonDiv.dataset.lessonContentUrl = contentUrl;
            lessonDiv.dataset.lessonContentText = contentText;
            lessonDiv.dataset.lessonMediaFileName = mediaFileName;
            lessonDiv.dataset.lessonDuration = duration || '';
            lessonDiv.dataset.lessonPreviewable = previewable;

            lessonDiv.querySelector('.lesson-form-title').textContent = escapeHTML(title);
            lessonDiv.querySelector('.lesson-form-title-container i:nth-child(2)').className = `fas ${getLessonIcon(type)}`;
            const metaSpans = lessonDiv.querySelectorAll('.lesson-form-meta span');
            if(metaSpans[0]) metaSpans[0].textContent = escapeHTML(type.charAt(0).toUpperCase() + type.slice(1));
            if(metaSpans[1]) metaSpans[1].innerHTML = duration ? `• ${formatDuration(duration)}` : '';

            const paperclipIcon = lessonDiv.querySelector('.lesson-form-meta .fa-paperclip');
            if (mediaFileName && !paperclipIcon) {
                 const newPaperclip = document.createElement('span');
                 newPaperclip.className = 'text-muted small ml-1';
                 newPaperclip.title = escapeHTML(mediaFileName);
                 newPaperclip.innerHTML = `• <i class="fas fa-paperclip"></i>`;
                 lessonDiv.querySelector('.lesson-form-meta').appendChild(newPaperclip);
            } else if (!mediaFileName && paperclipIcon) {
                 paperclipIcon.parentElement.remove();
            } else if (mediaFileName && paperclipIcon) {
                 paperclipIcon.parentElement.title = escapeHTML(mediaFileName);
            }


            const previewIcon = lessonDiv.querySelector('.lesson-form-title-container .fa-eye');
            if (previewable && !previewIcon) {
                const newPreviewIcon = document.createElement('i');
                newPreviewIcon.className = 'fas fa-eye text-success ml-1';
                newPreviewIcon.title = 'Có thể xem trước';
                lessonDiv.querySelector('.lesson-form-title-container').appendChild(newPreviewIcon);
            } else if (!previewable && previewIcon) {
                previewIcon.remove();
            }
            DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('lessonUpdated'));
        }
    } else {
        addLessonToChapterFormUI(lessonsListContainer, chapterUiId, null, title, type, contentUrl, contentText, mediaFileName, duration, previewable);
        DOMElements.curriculumBuilderArea.dispatchEvent(new CustomEvent('lessonAdded'));
    }
    closeModal(DOMElements.lessonFormModal);
}

// --- MOBILE NAVIGATION ---
function createMobileNav() {
    if (DOMElements.mobileNavOverlay) return;

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
        <button class="close-mobile-menu" aria-label="Đóng menu"><i class="fas fa-times"></i></button>
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
        e.preventDefault(); closeMobileNav(); navigateTo('homepage');
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); closeMobileNav();
            const sectionId = link.dataset.section;
            if (sectionId) navigateTo(sectionId);
        });
    });
}

function toggleMobileNav() {
    if (!DOMElements.mobileNavOverlay) createMobileNav();
    const isOpen = document.body.classList.toggle('mobile-menu-open');
    DOMElements.mobileNavOverlay.classList.toggle('open', isOpen);
    DOMElements.mobileMainNav.classList.toggle('open', isOpen);
}
function closeMobileNav() {
    if (!DOMElements.mobileNavOverlay || !DOMElements.mobileNavOverlay.classList.contains('open')) return;
    document.body.classList.remove('mobile-menu-open');
    DOMElements.mobileNavOverlay.classList.remove('open');
    DOMElements.mobileMainNav.classList.remove('open');
}

// --- PUBLISH COURSE LOGIC ---
function checkPublishPrerequisites(courseData, showToasts = false) {
    const checklistUl = DOMElements.publishChecklist.querySelector('ul');
    if(checklistUl) checklistUl.innerHTML = '';
    const messages = [];
    let allMet = true;

    const conditions = {
        title: courseData.title && courseData.title.trim() !== '',
        description: courseData.description && courseData.description.trim() !== '',
        short_description: courseData.short_description && courseData.short_description.trim() !== '',
        category: !!courseData.category_id,
        price: courseData.price !== null && courseData.price !== undefined && !isNaN(parseFloat(courseData.price)) && parseFloat(courseData.price) >= 0,
        hasChapters: courseData.chapters && courseData.chapters.length > 0,
        chaptersValid: false,
        lessonsValid: false
    };

    if (conditions.hasChapters) {
        conditions.chaptersValid = courseData.chapters.every(ch => ch.title && ch.title.trim() !== '');
        if (conditions.chaptersValid) {
            conditions.lessonsValid = courseData.chapters.every(ch =>
                ch.lessons && ch.lessons.length > 0 &&
                ch.lessons.every(l => l.title && l.title.trim() !== '')
            );
        }
    }

    const addChecklistItem = (isMet, textMet, textNotMet) => {
        if (checklistUl) {
            const li = document.createElement('li');
            const icon = document.createElement('i');
            icon.className = `fas ${isMet ? 'fa-check-circle text-success' : 'fa-times-circle text-warning'}`;
            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${isMet ? textMet : textNotMet}`));
            checklistUl.appendChild(li);
        }
        if (!isMet) {
            allMet = false;
            if (showToasts && textNotMet) messages.push(textNotMet.replace('Cần có: ', ''));
        }
    };

    addChecklistItem(conditions.title, "Tiêu đề khóa học đã điền.", "Cần có: Tiêu đề khóa học.");
    addChecklistItem(conditions.short_description, "Tiêu đề phụ (slogan) đã điền.", "Cần có: Tiêu đề phụ (slogan).");
    addChecklistItem(conditions.description, "Mô tả chi tiết đã điền.", "Cần có: Mô tả chi tiết.");
    addChecklistItem(conditions.category, "Danh mục đã chọn.", "Cần có: Chọn danh mục.");
    addChecklistItem(conditions.price, "Giá khóa học hợp lệ.", "Cần có: Giá khóa học (lớn hơn hoặc bằng 0).");

    if (DOMElements.courseFormTabs.length > 1) {
        addChecklistItem(conditions.hasChapters, "Đã có ít nhất 1 chương.", "Cần có: Ít nhất 1 chương.");
        if (conditions.hasChapters) {
            addChecklistItem(conditions.chaptersValid, "Tất cả các chương đều có tên.", "Cần có: Mỗi chương phải có tên.");
            addChecklistItem(conditions.lessonsValid, "Mỗi chương có ít nhất 1 bài giảng và mỗi bài giảng đều có tên.", "Cần có: Mỗi chương có ít nhất 1 bài giảng và mỗi bài giảng phải có tên.");
        }
    }

    addChecklistItem(true, "Ảnh bìa (sẽ dùng ảnh mặc định nếu trống).", "");

    if (showToasts && messages.length > 0) {
        showToast("Vui lòng hoàn thành các mục sau để xuất bản:<br>" + messages.join("<br>"), "warning", 5000 + messages.length * 500);
    }
    return allMet && (!DOMElements.courseFormTabs.length > 1 || (conditions.hasChapters && conditions.chaptersValid && conditions.lessonsValid));
}


function updatePublishButtonState() {
    if (currentSection !== 'create-edit-course' || !DOMElements.courseForm) return;

    const courseDataForCheck = {
        title: DOMElements.courseTitleInput.value,
        short_description: DOMElements.courseSubtitleInput.value,
        description: DOMElements.courseDescriptionInput.value,
        category_id: DOMElements.courseCategorySelect.value,
        price: DOMElements.coursePriceInput.value,
        chapters: getCurriculumDataFromForm()
    };

    const isCurrentlyPublished = DOMElements.courseStatusSelect.value === 'published';
    const canPublishNow = checkPublishPrerequisites(courseDataForCheck, false);

    DOMElements.publishCourseBtn.classList.toggle('hidden', isCurrentlyPublished || !canPublishNow);
    DOMElements.publishCourseBtn.disabled = isCurrentlyPublished || !canPublishNow;

    DOMElements.publishChecklist.classList.toggle('hidden', isCurrentlyPublished || canPublishNow);

    if (isCurrentlyPublished) {
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Cập nhật Khóa học';
    } else {
        DOMElements.saveCourseBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Bản Nháp';
    }
}

async function handleCourseFormSubmit(e, actionType = 'save') {
    e.preventDefault();
    if (!currentUser) {
        showToast("Vui lòng đăng nhập để thực hiện.", "error"); return;
    }

    const wasEditingBeforeSubmit = !!currentCreateEditCourseId;

    const courseData = {
        title: DOMElements.courseTitleInput.value.trim(),
        short_description: DOMElements.courseSubtitleInput.value.trim(),
        description: DOMElements.courseDescriptionInput.value.trim(),
        category_id: DOMElements.courseCategorySelect.value,
        difficulty: DOMElements.courseDifficultySelect.value,
        language: DOMElements.courseLanguageInput.value.trim() || 'Tiếng Việt',
        whatYouWillLearn: DOMElements.courseWhatYouWillLearnTextarea.value.trim().split('\n').filter(line => line.trim() !== ''),
        requirements: DOMElements.courseRequirementsTextarea.value.trim().split('\n').filter(line => line.trim() !== ''),
        image_url: DOMElements.courseImageUrlInput.value.trim() || getPlaceholderImage(DOMElements.courseTitleInput.value.trim()),
        banner_image_url: DOMElements.courseBannerImageUrlInput.value.trim() || null,
        promo_video_url: DOMElements.coursePromoVideoUrlInput.value.trim() || null,
        price: parseFloat(DOMElements.coursePriceInput.value),
        original_price: DOMElements.courseOriginalPriceInput.value ? parseFloat(DOMElements.courseOriginalPriceInput.value) : null,
        chapters: getCurriculumDataFromForm(),
        creator_user_id: currentUser.id,
        status: DOMElements.courseStatusSelect.value
    };

    if (isNaN(courseData.price) || courseData.price < 0) {
        showToast("Giá khóa học không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 0.", "error", 5000);
        DOMElements.coursePriceInput.focus(); return;
    }
    if (courseData.original_price !== null && (isNaN(courseData.original_price) || courseData.original_price < 0)) {
        showToast("Giá gốc không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 0 hoặc để trống.", "error", 5000);
        DOMElements.courseOriginalPriceInput.focus(); return;
    }
    if (courseData.original_price !== null && courseData.original_price <= courseData.price) {
        showToast("Giá gốc (khuyến mãi) phải lớn hơn giá bán hiện tại.", "error", 5000);
        DOMElements.courseOriginalPriceInput.focus(); return;
    }

    if (actionType === 'publish') {
        if (!checkPublishPrerequisites(courseData, true)) {
            return;
        }
        courseData.status = 'published';
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

    let response;
    let payload = { ...courseData };

    if (currentCreateEditCourseId) {
        payload.id = parseInt(currentCreateEditCourseId);
        response = await window.api.updateCourseApi(payload);
    } else {
        response = await window.api.createCourseApi(payload);
    }

    DOMElements.saveCourseBtn.disabled = false;

    if (response.success && response.course) {
        const savedCourse = response.course;
        showToast(
            actionType === 'publish' ? "Khóa học đã được xuất bản thành công!" :
            (wasEditingBeforeSubmit ? "Khóa học đã được cập nhật thành công!" : "Khóa học đã được lưu làm bản nháp!"),
            "success"
        );

        const courseIndex = coursesDataCache.findIndex(c => c.id === savedCourse.id);
        if (courseIndex > -1) {
            coursesDataCache[courseIndex] = { ...coursesDataCache[courseIndex], ...savedCourse };
        } else {
            coursesDataCache.push(savedCourse);
        }

        if (currentUser && !wasEditingBeforeSubmit && !currentUser.createdCourseIds.includes(savedCourse.id)) {
            currentUser.createdCourseIds.push(savedCourse.id);
            saveCurrentUser();
        }

        currentCreateEditCourseId = savedCourse.id;
        isEditingCourse = true;
        DOMElements.courseFormCourseId.value = savedCourse.id;
        DOMElements.courseStatusSelect.value = savedCourse.status;

        updatePublishButtonState();

        if (actionType === 'publish' || !wasEditingBeforeSubmit) {
            navigateTo('course-detail', { courseId: savedCourse.id });
        } else {
             DOMElements.saveCourseBtn.innerHTML = savedCourse.status === 'published' ?
                '<i class="fas fa-sync-alt"></i> Cập nhật Khóa học' :
                '<i class="fas fa-save"></i> Lưu Thay đổi';
        }
    } else {
        showToast(response.error || "Thao tác với khóa học thất bại.", "error", 7000);
        DOMElements.saveCourseBtn.innerHTML = originalSaveBtnText;
        if (!DOMElements.publishCourseBtn.classList.contains('hidden')) {
             DOMElements.publishCourseBtn.innerHTML = originalPublishBtnText;
        }
        updatePublishButtonState();
    }
}


// --- LESSON PREVIEW MODAL ---
function showLessonPreviewModal(lessonData) {
    DOMElements.lessonPreviewTitle.textContent = `Xem trước: ${unescapeHTML(lessonData.title)}`;
    let previewHTML = '';
    switch (lessonData.type) {
        case 'video':
            if (lessonData.contentUrl) {
                if (lessonData.contentUrl.includes('youtube.com') || lessonData.contentUrl.includes('youtu.be')) {
                    const videoIdMatch = lessonData.contentUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : null;
                    if (videoId) {
                        previewHTML = `<div class="responsive-iframe-container"><iframe width="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                    } else {
                         previewHTML = `<p class="text-warning">Không thể trích xuất YouTube Video ID từ URL.</p>`;
                    }
                } else if (lessonData.contentUrl.includes('vimeo.com')) {
                    const videoIdMatch = lessonData.contentUrl.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i);
                    const videoId = videoIdMatch ? videoIdMatch[1] : null;
                    if (videoId) {
                        previewHTML = `<div class="responsive-iframe-container"><iframe src="https://player.vimeo.com/video/${videoId}" width="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
                    } else {
                        previewHTML = `<p class="text-warning">Không thể trích xuất Vimeo Video ID từ URL.</p>`;
                    }
                } else {
                    previewHTML = `<video controls width="100%" style="max-height: 70vh; border-radius: var(--border-radius-medium);"><source src="${escapeHTML(lessonData.contentUrl)}" type="video/mp4">Trình duyệt của bạn không hỗ trợ thẻ video.</video>`;
                }
            } else {
                previewHTML = `<p class="text-warning">Không có URL video hoặc file video để xem trước.</p>`;
            }
            break;
        case 'text':
            previewHTML = `<div class="text-content-preview">${lessonData.contentText ? unescapeHTML(lessonData.contentText).replace(/\n/g, '<br>') : '<p class="text-warning">Không có nội dung văn bản để xem trước.</p>'}</div>`;
            break;
        case 'document':
             if (lessonData.contentUrl) {
                if (lessonData.contentUrl.toLowerCase().endsWith('.pdf')) {
                     previewHTML = `<div class="responsive-iframe-container" style="height:70vh;"><iframe src="${escapeHTML(lessonData.contentUrl)}" width="100%" height="100%" style="border: none;"></iframe></div><p class="text-center mt-2"><a href="${escapeHTML(lessonData.contentUrl)}" target="_blank" class="btn btn-sm btn-secondary">Mở tài liệu trong tab mới</a></p>`;
                } else {
                    previewHTML = `<p>Không thể nhúng trực tiếp loại tài liệu này. <a href="${escapeHTML(lessonData.contentUrl)}" target="_blank" class="btn btn-sm btn-primary">Xem tài liệu <i class="fas fa-external-link-alt"></i></a></p>`;
                }
            } else {
                previewHTML = `<p class="text-warning">Không có URL tài liệu hoặc file tài liệu để xem trước.</p>`;
            }
            break;
        case 'audio':
            if(lessonData.contentUrl) {
                 previewHTML = `<audio controls src="${escapeHTML(lessonData.contentUrl)}" style="width: 100%;">Trình duyệt không hỗ trợ thẻ audio.</audio>`;
            } else {
                previewHTML = `<p class="text-warning">Không có URL audio hoặc file audio để xem trước.</p>`;
            }
            break;
        default:
            previewHTML = `<p class="text-info">Không hỗ trợ xem trước cho loại bài giảng này.</p>`;
    }
    DOMElements.lessonPreviewContent.innerHTML = previewHTML;
    openModal(DOMElements.lessonPreviewModal);
}