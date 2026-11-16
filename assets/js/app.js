const loader = document.querySelector(".page-loader");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const contactForm = document.querySelector(".contact-form");

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (loader) {
  const revealPage = () => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-transitioning");
  };
  window.addEventListener("load", () => window.setTimeout(revealPage, prefersReducedMotion ? 0 : 550), { once: true });
  window.setTimeout(revealPage, 2200);
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      primaryNav.classList.remove("is-open");
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = contactForm.querySelector(".form-feedback");

    if (!contactForm.reportValidity()) {
      feedback.textContent = "Merci de vérifier les champs obligatoires.";
      feedback.style.color = "#a45848";
      return;
    }

    feedback.style.color = "";
    feedback.textContent = "Merci pour votre message ! Cette démo est prête à être reliée à votre service d’envoi.";
    contactForm.reset();
  });
}

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || target.pathname === window.location.pathname || link.target === "_blank") return;
    if (target.hash && target.pathname === window.location.pathname) return;
    if (prefersReducedMotion) return;
    event.preventDefault();
    document.body.classList.add("is-transitioning");
    document.querySelector(".site-shell")?.classList.add("is-leaving");
    window.setTimeout(() => { window.location.href = target.href; }, 220);
  });
});
