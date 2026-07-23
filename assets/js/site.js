/* MediDent İstanbul — client interactions (no framework) */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Sticky header + to-top
  const header = $(".site-header");
  const toTop = $(".to-top");
  const onScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 16);
    if (toTop) toTop.classList.toggle("is-visible", y > 640);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Mobile nav
  const burger = $("[data-burger]");
  const mobile = $("[data-mobile-nav]");
  const closeMobile = () => mobile && mobile.classList.remove("is-open");
  if (burger && mobile) {
    burger.addEventListener("click", () => mobile.classList.add("is-open"));
    mobile.addEventListener("click", (e) => {
      if (e.target === mobile || e.target.closest("[data-close-nav]")) closeMobile();
    });
    $$("a", mobile).forEach((a) => a.addEventListener("click", closeMobile));
  }

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    $$("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.84) io.observe(el);
      else el.classList.add("is-in");
    });
  } else {
    $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  }

  // Stats counter
  const statsRoot = $("[data-stats]");
  const animateStats = () => {
    $$("[data-to]", statsRoot || document).forEach((el) => {
      const to = parseFloat(el.dataset.to);
      const dec = parseInt(el.dataset.dec || "0", 10);
      const sep = el.dataset.sep === "1";
      const suffix = el.dataset.suffix || "";
      const fmt = (v) => {
        let s = dec > 0 ? v.toFixed(dec) : String(Math.round(v));
        if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return s + suffix;
      };
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1500);
        el.textContent = fmt(to * ease(p));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(to);
      };
      requestAnimationFrame(tick);
    });
  };
  if (statsRoot && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          sio.disconnect();
          animateStats();
        }
      });
    }, { threshold: 0.35 });
    sio.observe(statsRoot);
  } else if (statsRoot) animateStats();

  // Before/after slider
  const ba = $("[data-ba]");
  if (ba) {
    const before = $(".ba-before", ba);
    const handle = $(".ba-handle", ba);
    let drag = false;
    const set = (pct) => {
      pct = Math.max(2, Math.min(98, pct));
      if (before) before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      if (handle) handle.style.left = pct + "%";
    };
    const fromEv = (e) => {
      const r = ba.getBoundingClientRect();
      const cx = e.clientX != null ? e.clientX : e.touches?.[0]?.clientX || 0;
      set(((cx - r.left) / r.width) * 100);
    };
    ba.addEventListener("pointerdown", (e) => {
      drag = true;
      fromEv(e);
      try {
        ba.setPointerCapture(e.pointerId);
      } catch (_) {}
    });
    ba.addEventListener("pointermove", (e) => drag && fromEv(e));
    ba.addEventListener("pointerup", () => (drag = false));
    ba.addEventListener("pointerleave", () => (drag = false));
    set(50);
  }

  // FAQ accordion
  $$("[data-faq-item]").forEach((item) => {
    const btn = $("[data-faq-toggle]", item);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      $$("[data-faq-item]").forEach((i) => i.classList.remove("is-open"));
      if (!open) item.classList.add("is-open");
    });
  });
  const firstFaq = $("[data-faq-item]");
  if (firstFaq) firstFaq.classList.add("is-open");

  // Lightbox
  const lb = $("[data-lightbox]");
  const lbImg = lb && $("img", lb);
  const openLb = (src) => {
    if (!lb || !lbImg || !src) return;
    lbImg.src = src;
    lb.classList.add("is-open");
  };
  const closeLb = () => lb && lb.classList.remove("is-open");
  $$("[data-lightbox-src]").forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox-src") || el.querySelector("img")?.currentSrc;
      openLb(src);
    });
  });
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.closest("[data-lightbox-close]")) closeLb();
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeLb());
  }

  // Contact form → Estesof endpoint (if configured) else WhatsApp fallback
  const form = $("[data-lead-form]");
  if (form) {
    const card = form.closest(".form-card");
    const cfg = window.__MD_FORM__ || {};
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      let ok = false;
      if (cfg.endpoint) {
        try {
          const res = await fetch(cfg.endpoint, {
            method: cfg.method || "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...data, source: "medidentistanbul.com", page: location.href }),
          });
          ok = res.ok;
        } catch (_) {
          ok = false;
        }
      }
      if (!ok && cfg.whatsapp) {
        const msg = [
          "Merhaba MediDent İstanbul,",
          `Ad: ${data.name || ""}`,
          `Telefon: ${data.phone || ""}`,
          `E-posta: ${data.email || ""}`,
          `Tedavi: ${data.treatment || ""}`,
          data.message ? `Mesaj: ${data.message}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
        ok = true;
      }
      if (ok && card) card.classList.add("is-sent");
    });
  }
})();
