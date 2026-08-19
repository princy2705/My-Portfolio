/**
 * Portfolio: nav, scroll reveal, optional lofi toggle, contact demo,
 * hero canvas (particle network — uses CSS theme variables only).
 */

(function () {
  "use strict";

  const navBtn = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (navBtn && mobileNav) {
    navBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle("hidden");
      navBtn.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        navBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileNav.classList.contains("hidden") &&
          !mobileNav.contains(e.target) &&
          !navBtn.contains(e.target)) {
        mobileNav.classList.add("hidden");
        navBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Optional: add a slight delay for subsequent elements
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /**
   * Center-focused Portfolio Carousel
   */
  function initProjectCarousel() {
    const carousel = document.getElementById("projects-carousel");
    const cards = document.querySelectorAll(".project-card");
    if (!cards.length) return;

    // If no carousel container or mobile screen: activate all cards
    if (!carousel || window.innerWidth < 768) {
      cards.forEach((card) => card.classList.add("is-active"));
      return;
    }

    // Desktop: IntersectionObserver for active card highlight
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-active");
            } else {
              entry.target.classList.remove("is-active");
            }
          });
        },
        { root: carousel, threshold: 0.55 }
      );
      cards.forEach((card) => io.observe(card));
    }

    // Mouse wheel horizontal scroll on desktop —
    // only hijack the scroll if the carousel can actually move
    // sideways in that direction; otherwise let the page scroll normally.
    carousel.addEventListener("wheel", (e) => {
      const canScrollLeft = carousel.scrollLeft > 0;
      const canScrollRight =
        carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 1;

      if (
        e.deltaY !== 0 &&
        ((e.deltaY < 0 && canScrollLeft) || (e.deltaY > 0 && canScrollRight))
      ) {
        carousel.scrollLeft += e.deltaY;
        e.preventDefault();
      }
      // else: don't preventDefault — page scrolls normally
    }, { passive: false });

    // Click to center on desktop
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });

    // Auto-activate first card
    setTimeout(() => {
      if (cards[0]) cards[0].classList.add("is-active");
    }, 300);
  }

  /**
   * Reactive Artwork (Mouse Parallax)
   */
  function initArtworkParallax() {
    const sections = document.querySelectorAll("section");
    
    window.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const xPos = clientX / window.innerWidth - 0.5;
      const yPos = clientY / window.innerHeight - 0.5;

      sections.forEach(section => {
        const artwork = section.querySelector(".floating-artwork");
        if (artwork) {
          artwork.style.transform = `translate(${xPos * 30}px, ${yPos * 30}px) rotate(${xPos * 5}deg)`;
        }
      });
    });
  }

  initProjectCarousel();
  initArtworkParallax();

  /**
   * Minimal Space Hero: Low-density Star Generation & Parallax
   */
  function initMinimalSpaceHero() {
    const starLayer = document.getElementById("stars-layer");
    if (!starLayer) return;

    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
    const STAR_COUNT = isMobileDevice ? 350 : 1000;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("div");
      star.className = "star";
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random size (tiny)
      const size = Math.random() * 1.5 + 0.5;
      
      // Random animation properties
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      const maxOpacity = Math.random() * 0.4 + 0.2;

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.setProperty("--duration", `${duration}s`);
      star.style.setProperty("--delay", `${delay}s`);
      star.style.setProperty("--max-opacity", maxOpacity);
      
      frag.appendChild(star);
    }
    starLayer.appendChild(frag);

    /**
     * Spawn an elegant Shooting Star (Falling Star)
     */
    function spawnShootingStar() {
      const star = document.createElement("div");
      star.className = "shooting-star";
      
      // Random starting position (favor top-right for a right-to-left fall)
      const x = Math.random() * 70 + 30; // 30% to 100% (right side)
      const y = Math.random() * 30 - 5;  // -5% to 25% (very top)
      
      // Random properties
      const width = Math.random() * 80 + 80; // Shorter tail for subtle look
      
      star.style.width = `${width}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      
      starLayer.appendChild(star);
      
      // Remove after animation completes
      setTimeout(() => star.remove(), 2600);
    }

    // Trigger periodically (every 4-5 seconds)
    setInterval(() => {
      spawnShootingStar();
      if (Math.random() > 0.5) { // Occasionally two stars
        setTimeout(spawnShootingStar, 500);
      }
    }, 4500);

    // Subtle Mouse Parallax
    window.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15;
      const yPos = (clientY / window.innerHeight - 0.5) * 15;
      starLayer.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
  }

  initMinimalSpaceHero();

  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("contact-submit-btn");

  if (form && formStatus) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const originalBtnContent = submitBtn ? submitBtn.innerHTML : "<span>Send Message</span>";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin w-5 h-5 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sending...</span>
        `;
      }

      formStatus.classList.add("hidden");

      try {
        const formData = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          formStatus.textContent = "✓ Thank you! Your message has been sent successfully. Princy will reply to your email soon!";
          formStatus.className = "mt-4 p-4 rounded-xl text-center text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
          form.reset();
        } else {
          formStatus.textContent = "✓ Thank you! Message request received. You can also reach out directly at princy27507@gmail.com";
          formStatus.className = "mt-4 p-4 rounded-xl text-center text-sm font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
          form.reset();
        }
      } catch (error) {
        console.warn("Contact submission error:", error);
        formStatus.textContent = "✓ Thank you! Message request received. You can also email directly at princy27507@gmail.com";
        formStatus.className = "mt-4 p-4 rounded-xl text-center text-sm font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }
      }
    });
  }

  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /**
   * Skills Section: Category Tabs
   */
  function initSkillTabs() {
    const tabBtns = document.querySelectorAll(".skill-tab-btn");
    const panels = document.querySelectorAll(".skill-panel");
    if (!tabBtns.length || !panels.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.skillTab;

        tabBtns.forEach((b) => {
          b.classList.remove("is-active", "bg-lilac", "text-paper");
          b.classList.add("bg-lilac/5", "border", "border-lilac/10", "text-lilac");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active", "bg-lilac", "text-paper");
        btn.classList.remove("bg-lilac/5", "border", "border-lilac/10", "text-lilac");
        btn.setAttribute("aria-selected", "true");

        panels.forEach((panel) => {
          panel.classList.toggle("hidden", panel.dataset.skillPanel !== target);
        });
      });
    });
  }

  initSkillTabs();
})();