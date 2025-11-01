// HEADER SHRINK ON SCROLL
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 80) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

// BUTTON CLICK ANIMATION
const button = document.querySelector("form button");
button.addEventListener("click", (e) => {
    e.preventDefault();

    button.innerText = "Sending...";
    button.style.opacity = "0.7";

    setTimeout(() => {
        alert("✅ Your message has been sent successfully!");
        button.innerText = "Send Message";
        button.style.opacity = "1";
    }, 1500);
});

// INPUT HIGHLIGHT ON FOCUS
const fields = document.querySelectorAll("input, textarea, select");
fields.forEach((field) => {
    field.addEventListener("focus", () => {
        field.style.border = "1px solid #e0b84c";
    });
    field.addEventListener("blur", () => {
        field.style.border = "1px solid #333";
    });
});

// SOCIAL ICON HOVER EFFECT
const icons = document.querySelectorAll(".social-icons i, footer .footer-right i");
icons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
        icon.style.transform = "scale(1.2)";
    });
    icon.addEventListener("mouseout", () => {
        icon.style.transform = "scale(1)";
    });
});
