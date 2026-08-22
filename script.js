const header = document.getElementById("header");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const backTop = document.getElementById("backTop");
const progress = document.getElementById("scrollProgress");
const toast = document.getElementById("toast");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

function handleScroll() {
  header.classList.toggle("scrolled", window.scrollY > 20);
  backTop.classList.toggle("show", window.scrollY > 500);

  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = pageHeight > 0 ? `${(window.scrollY / pageHeight) * 100}%` : "0%";

  const sections = document.querySelectorAll("main section[id]");
  let current = "home";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", handleScroll);
handleScroll();

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-demo]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  });
});

const form = document.getElementById("contactForm");
const fields = {
  name: {
    input: document.getElementById("name"),
    error: document.getElementById("nameError"),
    test: value => value.trim().length >= 2,
    message: "Please enter at least 2 characters."
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("emailError"),
    test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: "Please enter a valid email address."
  },
  subject: {
    input: document.getElementById("subject"),
    error: document.getElementById("subjectError"),
    test: value => value.trim().length >= 3,
    message: "Please enter a subject."
  },
  message: {
    input: document.getElementById("message"),
    error: document.getElementById("messageError"),
    test: value => value.trim().length >= 10,
    message: "Message should be at least 10 characters."
  }
};

Object.values(fields).forEach(field => {
  field.input.addEventListener("input", () => validateField(field));
});

function validateField(field) {
  const valid = field.test(field.input.value);
  field.input.classList.toggle("invalid", !valid);
  field.error.textContent = valid ? "" : field.message;
  return valid;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = Object.values(fields).map(validateField).every(Boolean);
  const success = document.getElementById("formSuccess");

  if (valid) {
    success.classList.add("show");
    form.reset();
    Object.values(fields).forEach(field => {
      field.input.classList.remove("invalid");
      field.error.textContent = "";
    });
  } else {
    success.classList.remove("show");
  }
});
