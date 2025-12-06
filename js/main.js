// Client-side script for Taylor's Lost & Found
// Handles Header/Footer, User Session, Validation, Filtering, and Item Actions.

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================================
    // SECTION 1: GLOBAL SITE LOGIC (Header, Footer, User Session)
    // ==========================================================================

    // 1. Load Header
    const headerContainer = document.getElementById("header-placeholder");
    if (headerContainer) {
        fetch("header.html")
            .then(res => res.text())
            .then(html => {
                headerContainer.innerHTML = html;
                
                // User Session Logic
                const studentId = sessionStorage.getItem("studentId");
                const userNameElem = document.getElementById("userNameDisplay");
                const logoutBtn = document.getElementById("logoutBtn");

                if (userNameElem) {
                    userNameElem.textContent = studentId ? `👤 ${studentId}` : "👤 Guest";
                }

                if (logoutBtn) {
                    logoutBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        sessionStorage.removeItem("studentId");
                        window.location.href = "index.html";
                    });
                }
            })
            .catch(err => console.error("Failed to load header:", err));
    }

    // 2. Load Footer
    const footerContainer = document.getElementById("footer-placeholder");
    if (footerContainer) {
        fetch("footer.html")
            .then(res => res.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(err => console.error("Failed to load footer:", err));
    }

    // ==========================================================================
    // SECTION 2: FORM VALIDATION LOGIC
    // ==========================================================================

    function showError(inputId, message) {
        alert(message);
        const element = document.getElementById(inputId);
        if (element) {
            element.focus();
            element.style.border = "2px solid red"; 
        }
        return false;
    }

    // --- A. REPORT LOST ITEM FORM ---
    const lostItemForm = document.getElementById('reportLostForm');
    if (lostItemForm) {
        lostItemForm.addEventListener('submit', function(event) {
            if (!validateLostItemForm()) {
                event.preventDefault(); 
            } else {
                alert('Success: Lost Item Report is valid! Submitting...');
            }
        });
    }

    function validateLostItemForm() {
        const itemName = document.getElementById('itemName');
        if (!itemName || itemName.value.trim() === '') return showError('itemName', 'Item Name is required.');

        const category = document.getElementById('category');
        if (!category || category.value === '') return showError('category', 'Please select a Category.');

        const dateLost = document.getElementById('dateLost');
        if (dateLost && dateLost.value) {
            if (new Date(dateLost.value) > new Date()) return showError('dateLost', 'Date Lost cannot be in the future.');
        }

        const email = document.getElementById('email');
        const emailPattern = /@taylors\.edu\.my$/i;
        if (!email || email.value.trim() === '') return showError('email', 'Email is required.');
        else if (!emailPattern.test(email.value)) return showError('email', 'Please use a valid Taylor\'s email (@taylors.edu.my).');

        const phone = document.getElementById('phone');
        const phonePattern = /^\+?[\d\s-]{10,15}$/; 
        if (!phone || phone.value.trim() === '') return showError('phone', 'Phone number is required.');
        else if (!phonePattern.test(phone.value)) return showError('phone', 'Invalid phone number format.');

        return true; 
    }

    // --- B. REPORT FOUND ITEM FORM ---
    const foundItemForm = document.getElementById('reportFoundForm');
    if (foundItemForm) {
        foundItemForm.addEventListener('submit', function(event) {
            if (!validateFoundItemForm()) {
                event.preventDefault();
            } else {
                alert('Success: Found Item Report is valid! Submitting...');
            }
        });
    }

    function validateFoundItemForm() {
        const itemName = document.getElementById('itemName');
        if (!itemName || itemName.value.trim() === '') return showError('itemName', 'Item Name is required.');

        const category = document.getElementById('category');
        if (!category || category.value === '') return showError('category', 'Please select a Category.');

        const email = document.getElementById('email');
        const emailPattern = /@taylors\.edu\.my$/i;
        if (!email || email.value.trim() === '') return showError('email', 'Email is required.');
        else if (!emailPattern.test(email.value)) return showError('email', 'Please use a valid Taylor\'s email.');

        return true;
    }

    // ==========================================================================
    // SECTION 3: SEARCH & FILTER LOGIC
    // ==========================================================================

    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
        filterForm.addEventListener('reset', function() {
            setTimeout(applyFilters, 100); 
        });
    }

    function applyFilters() {
        const keyword = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';
        const location = document.getElementById('locationFilter')?.value || '';
        const dateFrom = document.getElementById('dateFrom')?.value || '';
        const dateTo = document.getElementById('dateTo')?.value || '';
        const timePeriod = document.getElementById('timePeriod')?.value || '';

        const items = document.querySelectorAll('.item-card');
        let visibleCount = 0;

        // ---- Calculate Time Period Range ----
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let periodStart = null;

        if (timePeriod === 'today') {
            periodStart = new Date(today);
        }
        else if (timePeriod === 'week') {
            periodStart = new Date(today);
            periodStart.setDate(today.getDate() - 7);
        }
        else if (timePeriod === 'month') {
            periodStart = new Date(today);
            periodStart.setMonth(today.getMonth() - 1);
        }

        items.forEach(item => {
            const title = item.querySelector('h3')?.innerText.toLowerCase() || '';
            const itemCategory = item.dataset.category;
            const itemLocation = item.dataset.location;
            const itemDateStr = item.dataset.date; // YYYY-MM-DD
            const itemDate = itemDateStr ? new Date(itemDateStr) : null;

            // --- Match Conditions ---
            const matchesSearch = title.includes(keyword);

            const matchesCategory =
                !category || category === 'All Categories' || itemCategory === category;

            const matchesLocation =
                !location || location === 'All Locations' || itemLocation === location;

            const matchesDateRange =
                (!dateFrom || itemDateStr >= dateFrom) &&
                (!dateTo || itemDateStr <= dateTo);

            const matchesTimePeriod =
                !periodStart || (itemDate && itemDate >= periodStart);

            // --- Final Decision ---
            if (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesDateRange &&
                matchesTimePeriod
            ) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        const countLabel = document.querySelector('.items-count');
        if (countLabel) {
            countLabel.textContent = `Showing ${visibleCount} items`;
        }
    }


    // ==========================================================================
    // SECTION 4: ITEM ACTION BUTTONS (BULLETPROOF VERSION)
    // ==========================================================================
    
    // We attach the listener to the whole document (Event Delegation)
    document.addEventListener('click', function(event) {
        
        // Check if the clicked element has our specific button classes
        if (event.target.classList.contains('btn-claim') || event.target.classList.contains('btn-contact')) {
            
            event.preventDefault(); 
            
            // Check Login Status
            const studentId = sessionStorage.getItem("studentId");
            
            if (studentId) {
                // User is logged in -> Open Email Client
                const subject = "Inquiry regarding Lost/Found Item";
                const body = "Hello, I am interested in the item you posted on Taylor's Lost & Found.";
                window.location.href = `mailto:student@taylors.edu.my?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            } else {
                // User is NOT logged in -> Alert and Redirect
                // Timeout ensures the alert renders cleanly
                setTimeout(() => {
                    const confirmLogin = confirm("You must be logged in to contact the reporter. Go to Login page?");
                    if (confirmLogin) {
                        window.location.href = "index.html";
                    }
                }, 10);
            }
        }
    });

    console.log("main.js loaded: All sections active.");
});