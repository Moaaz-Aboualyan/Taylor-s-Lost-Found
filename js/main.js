// Minimal client script stub for Taylor's Lost & Found
// Keeps references to `main.js` from the pages from 404 and provides
// a small helper to gracefully handle form submissions if needed.

document.addEventListener("DOMContentLoaded", function () {
  // No-op for now; placeholder for future client behavior.
  // Example: could add client-side validation or local preview.
  // Keeps console quiet but available for debugging.
    const headerContainer = document.getElementById("header-placeholder");

    if (headerContainer) {
        fetch("header.html")
            .then(res => res.text())
            .then(html => {
                headerContainer.innerHTML = html;

                // 2. After header loads, handle student ID display
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

                // 3. Handle logout click
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

    const footerContainer = document.getElementById("footer-placeholder");

    if (footerContainer) {
        fetch("footer.html")
            .then(res => res.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(err => console.error("Failed to load footer:", err));
    }

    if (typeof console !== "undefined") {
    console.log("main.js loaded");
    }
});
