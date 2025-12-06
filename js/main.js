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
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');

        const keyword = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        const location = locationFilter ? locationFilter.value : '';

        const items = document.querySelectorAll('.item-card');
        let visibleCount = 0;

        items.forEach(function(item) {
            const title = item.querySelector('h3') ? item.querySelector('h3').innerText.toLowerCase() : '';
            const itemCategory = item.getAttribute('data-category'); 
            const itemLocation = item.getAttribute('data-location');

            const matchesSearch = title.includes(keyword);
            const matchesCategory = (category === '' || category === 'All Categories') || (itemCategory === category);
            const matchesLocation = (location === '' || location === 'All Locations') || (itemLocation === location);

            if (matchesSearch && matchesCategory && matchesLocation) {
                item.style.display = 'flex'; 
                visibleCount++;
            } else {
                item.style.display = 'none'; 
            }
        });

        const countLabel = document.querySelector('.items-count');
        if (countLabel) countLabel.textContent = `Showing ${visibleCount} items`;
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