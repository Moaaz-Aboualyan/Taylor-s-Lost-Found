// Minimal client script for Taylor's Lost & Found
// Handles global components (Header/Footer), User Session, and Form Validations.

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================================
    // SECTION 1: GLOBAL SITE LOGIC (Header, Footer, User Session)
    // ==========================================================================

    // 1. Load Header Content
    const headerContainer = document.getElementById("header-placeholder");
    if (headerContainer) {
        fetch("header.html")
            .then(res => res.text())
            .then(html => {
                headerContainer.innerHTML = html;

                // Handle Student ID / User Display after header loads
                const studentId = sessionStorage.getItem("studentId");
                const userNameElem = document.getElementById("userNameDisplay");
                const logoutBtn = document.getElementById("logoutBtn");

                if (userNameElem) {
                    if (studentId) {
                        userNameElem.textContent = `👤 ${studentId}`;
                    } else {
                        userNameElem.textContent = "👤 Guest";
                    }
                }

                // Handle Logout Click
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

    // 2. Load Footer Content
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

    /**
     * Helper function to display error alerts and focus the field
     */
    function showError(inputId, message) {
        alert(message);
        const element = document.getElementById(inputId);
        if (element) {
            element.focus();
            element.style.borderColor = "red"; // Visual cue
        }
        return false;
    }

    // --- A. REPORT LOST ITEM FORM ---
    const lostItemForm = document.getElementById('lostItemForm');

    if (lostItemForm) {
        lostItemForm.addEventListener('submit', function(event) {
            // Stop submission to validate first
            event.preventDefault(); 
            
            if (validateLostItemForm()) {
                alert('Success: Lost Item Report is valid! Submitting...');
                // In a real scenario, you would uncomment the line below:
                // lostItemForm.submit();
            }
        });
    }

    function validateLostItemForm() {
        // 1. Check Item Name
        const itemName = document.getElementById('itemName');
        if (!itemName || itemName.value.trim() === '') {
            return showError('itemName', 'Item Name is required.');
        }

        // 2. Check Category (Assumes index 0 is "Select Category")
        const itemCategory = document.getElementById('itemCategory');
        if (!itemCategory || itemCategory.selectedIndex === 0) {
            return showError('itemCategory', 'Please select a Category.');
        }

        // 3. Check Date Lost (Must not be in the future)
        const dateLost = document.getElementById('dateLost');
        if (dateLost) {
            const selectedDate = new Date(dateLost.value);
            const today = new Date();
            if (selectedDate > today) {
                return showError('dateLost', 'Date Lost cannot be in the future.');
            }
        }

        // 4. Check Reporter Email (Taylor's Domain Check)
        const reporterEmail = document.getElementById('reporterEmail');
        const emailPattern = /@taylors\.edu\.my$/i;
        if (!reporterEmail || reporterEmail.value.trim() === '') {
            return showError('reporterEmail', 'Email is required.');
        } else if (!emailPattern.test(reporterEmail.value)) {
            return showError('reporterEmail', 'Please use a valid Taylor\'s email (@taylors.edu.my).');
        }

        // 5. Check Phone Number
        const reporterPhone = document.getElementById('reporterPhone');
        const phonePattern = /^\+?[\d\s-]{10,15}$/; 
        if (!reporterPhone || reporterPhone.value.trim() === '') {
            return showError('reporterPhone', 'Phone number is required.');
        } else if (!phonePattern.test(reporterPhone.value)) {
            return showError('reporterPhone', 'Invalid phone number format.');
        }

        return true; // All checks passed
    }


    // --- B. REPORT FOUND ITEM FORM ---
    // (Assumes IDs: foundItemForm, foundItemName, foundCategory, etc.)
    const foundItemForm = document.getElementById('foundItemForm');

    if (foundItemForm) {
        foundItemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateFoundItemForm()) {
                alert('Success: Found Item Report is valid! Submitting...');
                // foundItemForm.submit();
            }
        });
    }

    function validateFoundItemForm() {
        // 1. Check Item Name
        const itemName = document.getElementById('foundItemName');
        if (!itemName || itemName.value.trim() === '') {
            return showError('foundItemName', 'Found Item Name is required.');
        }

        // 2. Check Category
        const itemCategory = document.getElementById('foundCategory');
        if (!itemCategory || itemCategory.selectedIndex === 0) {
            return showError('foundCategory', 'Please select a Category.');
        }

        // 3. Check Reporter Email
        const reporterEmail = document.getElementById('finderEmail');
        const emailPattern = /@taylors\.edu\.my$/i;
        if (!reporterEmail || reporterEmail.value.trim() === '') {
            return showError('finderEmail', 'Email is required.');
        } else if (!emailPattern.test(reporterEmail.value)) {
            return showError('finderEmail', 'Please use a valid Taylor\'s email.');
        }

        return true;
    }


    // ==========================================================================
    // SECTION 3: SEARCH & FILTER LOGIC (For Lost/Found Browsing Pages)
    // ==========================================================================

    const filterBtn = document.getElementById('applyFiltersBtn');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            // 1. Capture user inputs
            const searchKeyword = document.getElementById('searchKeyword') ? document.getElementById('searchKeyword').value.toLowerCase() : '';
            const filterCategory = document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : 'All';

            // 2. Select all item cards on the page
            const items = document.querySelectorAll('.item-card');

            // 3. Loop through items and hide/show based on criteria
            let visibleCount = 0;
            items.forEach(function(item) {
                const title = item.querySelector('.card-title') ? item.querySelector('.card-title').innerText.toLowerCase() : '';
                const category = item.getAttribute('data-category'); // Assumes HTML has data-category="Electronics"

                // Check matches
                const matchesSearch = title.includes(searchKeyword);
                const matchesCategory = (filterCategory === 'All') || (category === filterCategory);

                if (matchesSearch && matchesCategory) {
                    item.style.display = 'block'; // Show
                    visibleCount++;
                } else {
                    item.style.display = 'none'; // Hide
                }
            });

            console.log(`Filter Applied: Showing ${visibleCount} items.`);
        });
    }

    // Final console check
    if (typeof console !== "undefined") {
        console.log("main.js loaded successfully with validations.");
    }
});