document.addEventListener("DOMContentLoaded", function () {
// Get query parameters
    const params = new URLSearchParams(window.location.search);

    const getValue = key => params.get(key) || "";

    const itemName = getValue("itemName");
    const category = getValue("category");
    const description = getValue("description");
    const location = getValue("location");
    const contactName = getValue("contactName");
    const email = getValue("email");
    const phone = getValue("phone");
    const date = getValue("dateFound") || getValue("dateLost");
    const time = getValue("timeFound") || getValue("timeLost");

// Populate the summary fields if they exist
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText("displayItemName", itemName);
    setText("displayCategory", category);
    setText("displayDescription", description);
    setText("displayLocation", location);
    setText("displayContactName", contactName);
    setText("displayPhone", phone);
    setText("displayDateTime", date ? (time ? `${date} at ${time}` : date) : "");

// Set email display and mailto link
    const emailEl = document.getElementById("displayEmail");
    const confirmEmailLink = document.getElementById("confirmEmail");

    if (emailEl) emailEl.textContent = email;
    if (confirmEmailLink) {
        confirmEmailLink.href = `mailto:${email}`;
        confirmEmailLink.textContent = email;
    }
});