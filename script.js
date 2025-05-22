// --- Global State ---
let isLoggedIn = false; // Simulate login status
// Simulate user object. Added role and enrolledCourses
let loggedInUser = {
    name: "",
    email: "",
    role: "", // "Học viên" or "Giảng viên"
    enrolledCourses: [1, 3] // Simulate courses user has purchased/enrolled (using course IDs)
};
let currentSection = 'homepage'; // Track current visible section for history

// Mock course data (Replace with actual data fetching later)
// Added mock price, creatorEmail, and placeholders
let mockCourses = [
    { id: 1, title: "Lập trình Web cơ bản", instructor: "Giảng viên A", price: "Miễn phí", image: "https://via.placeholder.com/400x250?text=Web+Basics", description: "Khóa học giới thiệu các kiến thức cơ bản về HTML, CSS, JavaScript để xây dựng website đầu tiên. Bạn sẽ học cách tạo giao diện trang web, xử lý sự kiện và làm việc với dữ liệu đơn giản.", files: ["gioi_thieu.pdf", "html_css_basics.docx", "javascript_intro.pdf"], videos: ["video_bai_1.mp4", "video_bai_2.mp4"], creatorEmail: "giangvien.a@example.com" },
    { id: 2, title: "Thiết kế Đồ họa với Photoshop", instructor: "Giảng viên B", price: "599.000 VNĐ", image: "https://via.placeholder.com/400x250?text=Photoshop", description: "Học cách sử dụng công cụ Photoshop để chỉnh sửa ảnh, thiết kế banner, poster chuyên nghiệp. Khóa học bao gồm các kỹ thuật cắt ghép, blend màu, retouche ảnh và tạo hiệu ứng cơ bản.", files: ["tai_lieu_ps.pdf", "bai_tap_ps.zip", "resource_pack.psd"], videos: ["photoshop_intro.mp4", "layer_masking.mp4", "retouching_techniques.mp4"], creatorEmail: "giangvien.b@example.com" },
    { id: 3, title: "Tiếng Anh Giao tiếp Tự tin", instructor: "Giảng viên C", price: "899.000 VNĐ", image: "https://via.placeholder.com/400x250?text=English+Communication", description: "Nâng cao khả năng nghe nói tiếng Anh trong các tình huống giao tiếp hàng ngày và công việc. Tập trung vào phát âm, từ vựng thông dụng và các mẫu câu hữu ích.", files: ["giao_tiep_bai_1.pdf", "bai_tap_nghe.mp3"], videos: ["dialogue_1.mp4", "speaking_tips.mp4"], creatorEmail: "giangvien.c@example.com" },
    { id: 4, title: "Marketing Digital cho Người mới bắt đầu", instructor: "Giảng viên D", price: "Miễn phí", image: "https://via.placeholder.com/400x250?text=Digital+Marketing", description: "Tìm hiểu các kênh marketing digital phổ biến như SEO, SEM, Social Media, Email Marketing. Nắm vững kiến thức nền tảng để triển khai các chiến dịch online hiệu quả.", files: ["digital_marketing_overview.pdf", "cheatsheet_seo.pdf"], videos: [], creatorEmail: "giangvien.d@example.com" },
    { id: 5, title: "Nhập môn Khoa học dữ liệu", instructor: "Giảng viên E", price: "1.200.000 VNĐ", image: "https://via.placeholder.com/400x250?text=Data+Science+Intro", description: "Giới thiệu về lĩnh vực Khoa học dữ liệu, các khái niệm cơ bản, quy trình xử lý dữ liệu và các công cụ phổ biến như Python, Pandas, NumPy.", files: ["data_science_intro.pdf", "pandas_cheatsheet.pdf"], videos: ["video_lecture_1.mp4", "video_lecture_2.mp4"], creatorEmail: "giangvien.e@example.com" },
    // Add more mock courses here
];


// --- Get DOM Elements ---
const homepageSection = document.getElementById('homepage');
const allCoursesSection = document.getElementById('all-courses-section'); // New section
const learningPlanSection = document.getElementById('learning-plan-section'); // New section
const userProfileSection = document.getElementById('user-profile-section'); // New section
const createCourseSection = document.getElementById('create-course-section');
const courseDetailSection = document.getElementById('course-detail-section');

const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const logoutBtn = document.querySelector('.logout-btn');
const authButtonsDiv = document.querySelector('.auth-buttons'); // Login/Signup button container
const userInfoDiv = document.querySelector('.user-info'); // User info container (now clickable)
const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder'); // Avatar placeholder
const userDisplayNameSpan = document.getElementById('user-display-name'); // User name span in header

const profileDisplayNameSpan = document.getElementById('profile-display-name'); // User name span in profile section
const profileDisplayEmailSpan = document.getElementById('profile-display-email'); // User email span in profile section
const profileDisplayRoleSpan = document.getElementById('profile-display-role'); // User role span in profile section
const profileCoursesSection = document.getElementById('profile-courses-section'); // Container for user's course lists

const closeModalButtons = document.querySelectorAll('.modal .close-button');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const createCourseForm = document.getElementById('create-course-form');

const ctaTrialBtn = document.querySelector('.cta-trial'); // Button in hero
const ctaCreateBtn = document.querySelector('.cta-create'); // Button in CTA section

const featuredCourseListDiv = document.getElementById('featured-course-list'); // Container for featured courses on homepage
const allCourseListDiv = document.getElementById('all-course-list'); // Container for ALL courses section

const courseSearchInput = document.getElementById('course-search-input');
const courseSearchButton = document.getElementById('course-search-button');

const detailCourseTitle = document.getElementById('detail-course-title');
const detailCourseInstructor = document.getElementById('detail-course-instructor');
const detailCoursePrice = document.getElementById('detail-course-price');
const detailCourseDescription = document.getElementById('detail-course-description');
const detailCourseFilesList = document.getElementById('detail-course-files');
const detailCourseVideoPlayer = courseDetailSection.querySelector('.course-video-player-lw');


const backToHomeButton = document.getElementById('back-to-home');
const logoHomeLink = document.getElementById('home-link'); // Logo as home button
const navLinks = document.querySelectorAll('.main-nav a.nav-link'); // Navigation links


// --- Functions to manage view and history ---

// Hide all content sections and show the specified one
function showSection(sectionElement, state, pushHistory = true) {
    const sections = [homepageSection, allCoursesSection, learningPlanSection, userProfileSection, createCourseSection, courseDetailSection];
    let sectionId = null;

    sections.forEach(section => {
        if (section === sectionElement) {
            section.classList.remove('hidden');
             sectionId = section.id; // Get ID of the shown section
        } else {
            section.classList.add('hidden');
        }
    });

    // Update active nav link
    navLinks.forEach(link => {
        if (link.dataset.section === sectionId) {
            link.classList.add('active-nav');
        } else {
            link.classList.remove('active-nav');
        }
    });

     // Manage Browser History
    if (pushHistory) {
        // Ensure state always has section and optional courseId
        const historyState = { section: sectionId, courseId: state ? state.courseId : undefined };
        history.pushState(historyState, '', `#${sectionId}`); // Push state to history
    }
    currentSection = sectionId; // Update current section state

    // Scroll to top when showing a new section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(modalElement) {
    modalElement.style.display = 'block';
     // Optional: Add a class to body to prevent scrolling
    // document.body.classList.add('modal-open');
}

function closeModal(modalElement) {
    modalElement.style.display = 'none';
    // Optional: Remove class from body
    // document.body.classList.remove('modal-open');
    // Clear form inputs when closing
    const forms = modalElement.querySelectorAll('form');
    forms.forEach(form => form.reset());
}

function updateAuthUI() {
    if (isLoggedIn) {
        authButtonsDiv.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        // Update header user info
        userDisplayNameSpan.textContent = loggedInUser.name;
         userAvatarPlaceholder.textContent = loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : '?'; // Use first initial for avatar
         // You could add logic here to hide placeholder and show an <img> if user has a profile pic

        // Update profile section user info (if visible or prepare for visibility)
        profileDisplayNameSpan.textContent = loggedInUser.name;
        profileDisplayEmailSpan.textContent = loggedInUser.email;
        profileDisplayRoleSpan.textContent = loggedInUser.role;

        // Update profile section course lists based on role
        updateProfileCourseLists();

    } else {
        authButtonsDiv.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
        userDisplayNameSpan.textContent = ""; // Clear user name
        userAvatarPlaceholder.textContent = ""; // Clear avatar

        // Clear profile section user info
        profileDisplayNameSpan.textContent = "";
        profileDisplayEmailSpan.textContent = "";
        profileDisplayRoleSpan.textContent = "";
        profileCoursesSection.innerHTML = ""; // Clear profile course lists
    }
}

// Function to update the course lists within the user profile section
function updateProfileCourseLists() {
    profileCoursesSection.innerHTML = ""; // Clear previous content

    if (!isLoggedIn) {
        profileCoursesSection.innerHTML = "<p>Đăng nhập để xem các khóa học của bạn.</p>";
        return;
    }

    if (loggedInUser.role === "Học viên") {
        const enrolledCourses = mockCourses.filter(course =>
            loggedInUser.enrolledCourses.includes(course.id)
        );
        profileCoursesSection.innerHTML += `<h3><i class="fas fa-book-reader"></i> Khóa học của tôi (Đã đăng ký)</h3>`;
         if (enrolledCourses.length > 0) {
             const coursesGrid = document.createElement('div');
             coursesGrid.classList.add('user-course-list-grid'); // Use a specific class for profile grid
             profileCoursesSection.appendChild(coursesGrid);
             displayCourses(enrolledCourses, coursesGrid);
         } else {
             profileCoursesSection.innerHTML += `<p>Bạn chưa đăng ký khóa học nào.</p>`;
         }


    } else if (loggedInUser.role === "Giảng viên") {
        const createdCourses = mockCourses.filter(course =>
            course.creatorEmail === loggedInUser.email
        );
         profileCoursesSection.innerHTML += `<h3><i class="fas fa-chalkboard-teacher"></i> Khóa học của tôi (Đã tạo)</h3>`;
         if (createdCourses.length > 0) {
              const coursesGrid = document.createElement('div');
              coursesGrid.classList.add('user-course-list-grid'); // Use a specific class for profile grid
              profileCoursesSection.appendChild(coursesGrid);
              displayCourses(createdCourses, coursesGrid);
         } else {
             profileCoursesSection.innerHTML += `<p>Bạn chưa tạo khóa học nào.</p>`;
         }
         // Giảng viên might also see enrolled courses, depending on requirements. Add similar logic here if needed.

    } else {
        // Handle other roles or no role assigned
        profileCoursesSection.innerHTML += `<p>Không có thông tin khóa học cho vai trò này.</p>`;
    }
}


// Populate a course grid container
function displayCourses(coursesToDisplay, targetElement) {
    targetElement.innerHTML = ''; // Clear existing list
    if (!coursesToDisplay || coursesToDisplay.length === 0) {
        targetElement.innerHTML = '<p style="text-align: center; width: 100%;">Không tìm thấy khóa học nào phù hợp.</p>';
        return;
    }

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card-lw'); // Use new class
        courseCard.dataset.courseId = course.id; // Store course ID

        courseCard.innerHTML = `
            <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}" alt="${course.title}">
            <div class="card-info-lw"> <!-- Use new class -->
                <h3>${course.title}</h3>
                <p class="instructor">Giảng viên: ${course.instructor}</p>
                <p class="price">${course.price}</p>
            </div>
        `;
        targetElement.appendChild(courseCard);

        // Add click listener to the card
        courseCard.addEventListener('click', () => {
            showCourseDetail(course.id);
        });
    });
}

// Show course detail section with specific course data
function showCourseDetail(courseId, pushHistory = true) {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
        alert("Không tìm thấy thông tin khóa học!");
        // Try navigating back in history, or default to homepage
        if (history.length > 1) {
             history.back();
        } else {
             navigateToSection('homepage', null, false);
        }
        return;
    }

    detailCourseTitle.textContent = course.title;
    detailCourseInstructor.textContent = `Giảng viên: ${course.instructor}`;
    detailCoursePrice.textContent = `Giá: ${course.price}`;
    detailCourseDescription.textContent = course.description;

    // Populate materials
    detailCourseFilesList.innerHTML = '';
    if (course.files && course.files.length > 0) {
        course.files.forEach(file => {
            const li = document.createElement('li');
             // In a real app, link href would be the actual file URL
             // Simulating click action
            li.innerHTML = `<li><a href="#" onclick="event.preventDefault(); alert('Tải xuống file: ${file}')"><i class="fas fa-file-alt"></i> ${file}</a></li>`;
            detailCourseFilesList.appendChild(li);
        });
    } else {
         detailCourseFilesList.innerHTML = '<li>Không có tài liệu bổ sung.</li>';
    }

    // Note: Embedding actual video players from local files is complex
    // For this UI example, we'll keep the placeholder or add a generic message
     if (course.videos && course.videos.length > 0) {
          detailCourseVideoPlayer.innerHTML = `<div class="placeholder-video-lw"><i class="fas fa-play-circle"></i> <p>Video bài giảng (có ${course.videos.length} video)</p></div>`;
          // In a real app, you would embed the first video or a playlist here
          // detailCourseVideoPlayer.innerHTML = `<video controls src="your-video-url/${course.videos[0]}" style="width: 100%; height: 100%;"></video>`;
     } else {
          detailCourseVideoPlayer.innerHTML = `<div class="placeholder-video-lw"><i class="fas fa-video-slash"></i> <p>Không có video bài giảng</p></div>`;
     }

    // Show the detail section
     showSection(courseDetailSection, { section: 'detail', courseId: courseId }, pushHistory);
}

// Function to navigate based on section ID (used by nav links and popstate)
function navigateToSection(sectionId, courseId = null, pushHistory = true) {
    let sectionElement;
    let state = { section: sectionId, courseId: courseId }; // Default state

    switch (sectionId) {
        case 'homepage':
            sectionElement = homepageSection;
            // Display featured courses on homepage (first few)
            displayCourses(mockCourses.slice(0, 6), featuredCourseListDiv); // Show only first 6 as "featured"
            break;
        case 'all-courses':
            sectionElement = allCoursesSection;
            // Display ALL courses
            displayCourses(mockCourses, allCourseListDiv);
            break;
        case 'learning-plan':
            sectionElement = learningPlanSection;
             if (!isLoggedIn) { // Example of requiring login for a page
                  alert("Vui lòng đăng nhập để xem kế hoạch học tập.");
                  openModal(loginModal);
                  return; // Stop navigation if not logged in
             }
            break;
        case 'user-profile':
             if (!isLoggedIn) {
                  alert("Vui lòng đăng nhập để xem thông tin tài khoản.");
                  openModal(loginModal);
                  return; // Stop navigation if not logged in
             }
            sectionElement = userProfileSection;
            // Profile details and lists are updated by updateAuthUI/updateProfileCourseLists when login state changes or section is shown
             updateProfileCourseLists(); // Ensure list is fresh when navigating
            break;
        case 'create-course':
             if (!isLoggedIn || loggedInUser.role !== "Giảng viên") {
                  alert("Chỉ giảng viên mới có thể tạo khóa học. Vui lòng đăng nhập với vai trò Giảng viên.");
                  openModal(loginModal); // Prompt login/signup
                  return; // Stop navigation if not logged in or not a Giảng viên
             }
            sectionElement = createCourseSection;
            break;
        case 'detail':
             // Detail view is handled by showCourseDetail, which manages its own history state
             showCourseDetail(courseId, pushHistory);
             return; // Exit here, showCourseDetail handles the rest
        default:
            // Fallback to homepage if section is unknown
            sectionElement = homepageSection;
            displayCourses(mockCourses.slice(0, 6), featuredCourseListDiv);
            sectionId = 'homepage'; // Ensure state reflects actual section
            state = { section: sectionId };
            break;
    }

    if (sectionElement) {
        showSection(sectionElement, state, pushHistory);
    }
}


// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', function() {

    // Initial state and display
    updateAuthUI();
    // Check if there's a hash in the URL on load for direct linking/refresh
    const initialHash = window.location.hash ? window.location.hash.substring(1) : 'homepage';
    let initialSection = 'homepage';
    let initialCourseId = null;

    if (initialHash.startsWith('detail-')) {
         const parts = initialHash.split('-');
         if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
              initialSection = 'detail';
              initialCourseId = parseInt(parts[1]);
         } else {
               // Invalid detail hash, fallback to homepage
               initialSection = 'homepage';
         }
    } else if (initialHash !== '') {
         // Check if the hash corresponds to a known section
         const knownSections = ['homepage', 'all-courses', 'learning-plan', 'user-profile', 'create-course'];
         if (knownSections.includes(initialHash)) {
              initialSection = initialHash;
         } else {
              // Unknown hash, fallback to homepage
              initialSection = 'homepage';
         }
    }

    navigateToSection(initialSection, initialCourseId, false); // Show initial section without pushing history state


    // --- Browser History (Popstate) ---
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.section) {
            navigateToSection(state.section, state.courseId, false); // Navigate based on state, don't push history
        } else {
            // Handle initial load or state that wasn't pushed by our logic (e.g., direct link without hash)
            navigateToSection('homepage', null, false); // Default to homepage
        }
    });


    // --- Authentication Modals ---
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                closeModal(modalElement);
            }
        });
    });

    // Close modal if clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal(loginModal);
        }
        if (event.target === signupModal) {
            closeModal(signupModal);
        }
    });

    // Switch between login and signup forms
    showSignupLink.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });

    showLoginLink.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });

    // Simulate Login Form Submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const roleInput = document.querySelector('input[name="login-role"]:checked'); // Get selected role

        const email = emailInput.value;
        const password = passwordInput.value;
        const role = roleInput ? roleInput.value : "Học viên"; // Default to Học viên

        // --- Simulated Login Logic ---
        // Basic validation
        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }
        console.log('Login attempt:', { email, password, role });
        alert(`Đăng nhập thành công (Giả lập) với email: ${email}, vai trò: ${role}`);

        isLoggedIn = true; // Update state
        loggedInUser.name = email.split('@')[0] || 'Người dùng'; // Simple user name from email
        loggedInUser.email = email;
        loggedInUser.role = role;
        // NOTE: enrolledCourses for loggedInUser is hardcoded initially.
        // In a real app, this would be fetched from backend based on email.

        updateAuthUI(); // Update header UI and profile section
        closeModal(loginModal); // Close modal

        // Navigate to a relevant page after login, e.g., homepage or profile
        // navigateToSection('homepage'); // Option 1: Go home
        navigateToSection('user-profile'); // Option 2: Go to profile

         loginForm.reset(); // Reset form after successful (simulated) login
         roleInput.checked = true; // Reset role selection to default 'Học viên'
    });

    // Simulate Signup Form Submission
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('signup-confirm-password');
         const roleInput = document.querySelector('input[name="signup-role"]:checked'); // Get selected role


        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
         const role = roleInput ? roleInput.value : "Học viên"; // Default to Học viên


         // --- Simulated Signup Logic ---
         // Basic validation
         if (!name || !email || !password || !confirmPassword) {
              alert("Vui lòng điền đầy đủ thông tin.");
              return;
         }
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
         if (password.length < 6) {
             alert("Mật khẩu phải có ít nhất 6 ký tự.");
             return;
         }

        console.log('Signup attempt:', { name, email, password, role });
        alert(`Đăng ký thành công (Giả lập) cho người dùng: ${name} (${email}), vai trò: ${role}. Vui lòng đăng nhập.`);
        // After successful signup, you might redirect to login or auto-login
        closeModal(signupModal);
        openModal(loginModal); // Suggest logging in after signup
        // --- End Simulated Signup Logic ---
         signupForm.reset(); // Reset form after successful (simulated) signup
         roleInput.checked = true; // Reset role selection to default 'Học viên'
    });

    // Simulate Logout Button
    logoutBtn.addEventListener('click', () => {
        alert("Đăng xuất thành công (Giả lập)!");
        isLoggedIn = false; // Update state
        loggedInUser = { name: "", email: "", role: "", enrolledCourses: [] }; // Clear user info and enrolled courses
        updateAuthUI(); // Update header UI and profile section
        navigateToSection('homepage'); // Go back home
    });

    // --- Clickable User Info Area ---
     userInfoDiv.addEventListener('click', (event) => {
          // Check if the click target is NOT the logout button
          if (!event.target.closest('.logout-btn')) {
               if (isLoggedIn) {
                    navigateToSection('user-profile');
               }
          }
     });


    // --- CTA Buttons (Protected Actions) ---
    ctaTrialBtn.addEventListener('click', () => {
        if (isLoggedIn) {
            alert('Tiến hành dùng thử miễn phí (Chức năng thực tế sẽ triển khai sau).');
            // Logic to start trial
        } else {
            alert('Vui lòng đăng nhập hoặc đăng ký để dùng thử miễn phí.');
            openModal(loginModal); // Prompt login/signup
        }
    });

    ctaCreateBtn.addEventListener('click', () => {
        // This button should ONLY lead to create course if user is a Giảng viên
        if (isLoggedIn && loggedInUser.role === "Giảng viên") {
            navigateToSection('create-course'); // Show the create course form
        } else if (isLoggedIn && loggedInUser.role !== "Giảng viên") {
             alert('Bạn đã đăng nhập nhưng không có vai trò Giảng viên để tạo khóa học.');
             // Optional: Redirect to profile or another relevant page
         }
         else { // Not logged in
            alert('Vui lòng đăng nhập với vai trò Giảng viên để tạo khóa học.');
            openModal(loginModal); // Prompt login/signup
        }
    });


    // --- Create Course Form ---
    createCourseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission

        // Explicitly check role again on submit server-side (simulated here on frontend)
        if (!isLoggedIn || loggedInUser.role !== "Giảng viên") {
             alert('Bạn cần đăng nhập với vai trò Giảng viên để tạo khóa học.');
             // Maybe navigate away or just prevent submission
             return;
        }

        const titleInput = document.getElementById('course-title');
        const descriptionInput = document.getElementById('course-description');
        const priceInput = document.getElementById('course-price'); // Get price input
        const imageUrlInput = document.getElementById('course-image-url'); // Get image url input
        const filesInput = document.getElementById('course-files');
        const videosInput = document.getElementById('course-videos');

        const title = titleInput.value.trim(); // Trim whitespace
        const description = descriptionInput.value.trim();
        const price = priceInput.value.trim() || "Chưa xác định"; // Default price if empty
        const imageUrl = imageUrlInput.value.trim();
        const files = filesInput.files; // FileList object (simulated)
        const videos = videosInput.files; // FileList object (simulated)

        // --- Simulated Create Course Logic ---
         if (!title || !description || !price) {
             alert("Vui lòng nhập Tiêu đề, Mô tả và Giá khóa học.");
             return;
         }

         // Simulate creating a new course object
         const newCourse = {
              id: mockCourses.length > 0 ? Math.max(...mockCourses.map(c => c.id)) + 1 : 1, // Simple unique ID
              title: title,
              instructor: loggedInUser.name, // Assign logged-in user as instructor
              price: price,
              image: imageUrl || `https://via.placeholder.com/400x250?text=${encodeURIComponent(title)}`, // Use provided URL or placeholder
              description: description,
              files: Array.from(files).map(f => f.name), // Store file names (simulated)
              videos: Array.from(videos).map(v => v.name), // Store video names (simulated)
              creatorEmail: loggedInUser.email // Store creator's email for profile filtering
         };

        mockCourses.push(newCourse); // Add the new course to the array

        console.log('Creating Course:', newCourse);
        alert(`Khóa học "${title}" đã được tạo thành công (Giả lập)!`);

        createCourseForm.reset(); // Clear form
        // showSection(homepageSection); // Go back to homepage after submission
        navigateToSection('all-courses'); // Go to All Courses section to show the new course

        // Note: displayCourses for homepage/all-courses is called within navigateToSection now
        // If you were already on the 'all-courses' page, navigateToSection('all-courses') would refresh the list.
        // If you were on 'homepage', navigating to 'all-courses' shows the full list including the new one.
        // You might want to explicitly refresh homepage featured list too if needed, but for this mock it's fine.
        // displayCourses(mockCourses.slice(0, 6), featuredCourseListDiv); // Update homepage featured - Optional
        // displayCourses(mockCourses, allCourseListDiv); // Update all courses list - Called by navigateToSection
        // --- End Simulated Create Course Logic ---
    });


    // --- Course Detail & Navigation ---

    // Back button on detail page - Navigates back in history
    backToHomeButton.addEventListener('click', () => {
         // Using history.back() allows returning to the specific page before detail (homepage, all courses, profile)
         history.back();
         // If history.back() is not desired or possible (e.g., direct link to detail),
         // you could use: navigateToSection(backToHomeButton.dataset.section); // This defaults to homepage
    });

     // Logo clicks go home
     logoHomeLink.addEventListener('click', (event) => {
         event.preventDefault(); // Prevent default link behavior if '#'
         navigateToSection('homepage');
     });

     // Navigation links (simple section switching for demonstration)
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.dataset.section; // Get section ID from data attribute
            navigateToSection(sectionId); // Use the generalized nav function
        });
    });


    // --- Search Functionality (Basic Frontend Filter) ---
    function performFrontendSearch() {
         const searchTerm = courseSearchInput.value.toLowerCase().trim();

         // Always perform search on the full mockCourses array
         const filteredCourses = mockCourses.filter(course =>
             course.title.toLowerCase().includes(searchTerm) ||
             course.instructor.toLowerCase().includes(searchTerm) ||
             course.description.toLowerCase().includes(searchTerm)
             // Add more fields to search if needed
         );

          // Display results on the homepage's course list container
          // Note: This replaces the "featured" list when searching
          displayCourses(filteredCourses, featuredCourseListDiv);

          // Clear search input if on All Courses page and want search there instead
          // If you wanted search on the "All Courses" page to filter there,
          // you would add a search bar to that section and modify this logic.
          // For now, search is tied to the homepage course list.
    }

    courseSearchButton.addEventListener('click', performFrontendSearch);

    courseSearchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            performFrontendSearch();
        }
    });

}); // End DOMContentLoaded