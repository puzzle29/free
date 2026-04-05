const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const heroPoster = document.querySelector(".hero-poster");
const modal = document.getElementById("video-modal");
const videoFrame = document.getElementById("video-frame");
const videoModalClose = modal?.querySelector(".video-modal-close");
const cards = [...document.querySelectorAll(".media-card[data-video]")];
const spotlightTriggers = [...document.querySelectorAll("[data-spotlight-open]")];
const closeMenu = () => {
  siteNav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

heroPoster?.addEventListener("error", () => {
  heroPoster.src = "./assets/hero-reference.png";
  document.documentElement.style.setProperty("--hero-image", 'url("./assets/hero-reference.png")');
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 160;
  let currentSection = sections[0]?.id ?? "home";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("is-active", isActive);
  });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("pointerdown", (event) => {
  if (!siteNav?.classList.contains("is-open")) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  if (siteNav.contains(target) || navToggle?.contains(target)) {
    return;
  }

  closeMenu();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav?.classList.contains("is-open")) {
    closeMenu();
  }
});

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const videoUrl = card.getAttribute("data-video");

    if (!videoUrl || !modal || !videoFrame) {
      return;
    }

    videoFrame.src = `${videoUrl}?autoplay=1`;
    modal.showModal();
  });
});

const closeModal = () => {
  if (!modal || !videoFrame) {
    return;
  }

  modal.close();
  videoFrame.src = "";
};

videoModalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  const dialogRect = modal.getBoundingClientRect();
  const clickedOutside =
    event.clientX < dialogRect.left ||
    event.clientX > dialogRect.right ||
    event.clientY < dialogRect.top ||
    event.clientY > dialogRect.bottom;

  if (clickedOutside) {
    closeModal();
  }
});

spotlightTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const id = trigger.getAttribute("data-spotlight-open");
    const dlg = id ? document.getElementById(id) : null;
    if (dlg && "showModal" in dlg) {
      dlg.showModal();
    }
  });
});

document.querySelectorAll(".spotlight-dialog").forEach((dialog) => {
  dialog.querySelector(".spotlight-dialog-close")?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.open) {
    closeModal();
  }
});

document.querySelectorAll("a[data-mailto-b64]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    const raw = el.getAttribute("data-mailto-b64");
    if (!raw) {
      return;
    }
    try {
      window.location.href = `mailto:${atob(raw)}`;
    } catch (_) {
      /* ignore invalid base64 */
    }
  });
});

const revealElements = [...document.querySelectorAll(".reveal-on-scroll")];
const revealReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealAll = () => {
  revealElements.forEach((el) => {
    el.classList.add("is-revealed");
  });
};

if (revealElements.length) {
  if (revealReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }
}
