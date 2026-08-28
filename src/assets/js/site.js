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

  // YouTube facade — load iframe only on click (no autoplay)
  $$("[data-yt-facade]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-yt-id");
      if (!id) return;
      const wrap = document.createElement("div");
      wrap.className = "yt-facade is-playing";
      wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      btn.replaceWith(wrap);
    });
  });

  // Instagram cards — optional in-page embed; fallback opens Instagram
  $$("[data-ig-embed]").forEach((card) => {
    card.addEventListener("click", (e) => {
      const embed = card.getAttribute("data-ig-embed");
      if (!embed) return;
      e.preventDefault();
      let lb = $("[data-ig-lightbox]");
      if (!lb) {
        lb = document.createElement("div");
        lb.className = "ig-lightbox";
        lb.setAttribute("data-ig-lightbox", "");
        lb.innerHTML = `<button type="button" class="ig-lightbox-close" data-ig-close aria-label="Close">×</button><div class="ig-lightbox-frame"></div>`;
        document.body.appendChild(lb);
        lb.addEventListener("click", (ev) => {
          if (ev.target === lb || ev.target.closest("[data-ig-close]")) lb.classList.remove("is-open");
        });
      }
      const frame = $(".ig-lightbox-frame", lb);
      if (frame) {
        frame.innerHTML = `<iframe src="${embed}" title="Instagram" loading="lazy" allowtransparency="true"></iframe>`;
      }
      lb.classList.add("is-open");
    });
  });

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

  // Price calculator (exact price per qty option — no ranges/multipliers)
  const calcData = window.__MD_CALC__ || [];
  const calcI18n = window.__MD_CALC_I18N__ || {};
  const calcCard = $("[data-calc]");
  if (calcCard && calcData.length) {
    const treatmentSel = $("[data-calc-treatment]", calcCard);
    const qtySel = $("[data-calc-qty]", calcCard);
    const qtyLabel = $("[data-calc-qty-label]", calcCard);
    const resultEl = $("[data-calc-result]", calcCard);
    const ctaBtn = $("[data-calc-cta]", calcCard);
    const fmtEUR = (n) => "€" + Math.round(n).toLocaleString("de-DE");

    const findItem = (key) => calcData.find((d) => d.key === key) || calcData[0];

    const qtyLabelFor = (unit) =>
      unit === "implant" ? calcI18n.qtyLabelImplant || "" :
      unit === "implantpkg" ? calcI18n.qtyLabelImplantPkg || "" :
      calcI18n.qtyLabelTooth || "";

    const populateQty = (item) => {
      if (qtyLabel) qtyLabel.textContent = qtyLabelFor(item.unit);
      if (!qtySel) return;
      qtySel.innerHTML = item.options
        .map((o) => `<option value="${o.qty}" ${o.qty === item.defaultQty ? "selected" : ""}>${o.qty}</option>`)
        .join("");
    };

    const currentOption = (item) => {
      const qty = parseInt(qtySel?.value, 10) || item.defaultQty;
      return item.options.find((o) => o.qty === qty) || item.options[0];
    };

    const updateResult = () => {
      const item = findItem(treatmentSel?.value);
      const opt = currentOption(item);
      if (resultEl) resultEl.textContent = fmtEUR(opt.price);
      return { item, opt };
    };

    if (treatmentSel) {
      treatmentSel.addEventListener("change", () => {
        populateQty(findItem(treatmentSel.value));
        updateResult();
      });
    }
    if (qtySel) qtySel.addEventListener("change", updateResult);

    populateQty(findItem(treatmentSel?.value));
    updateResult();

    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => {
        const { item, opt } = updateResult();
        const leadForm = $("[data-lead-form]");
        if (!leadForm) return;
        const msg = $("textarea[name=message]", leadForm);
        if (msg) {
          const line = `${item.title} (${opt.qty}) — ${fmtEUR(opt.price)}`;
          if (!msg.value.includes(line)) msg.value = msg.value ? `${line}\n${msg.value}` : line;
        }
        const treatSel = $("select[name=treatment]", leadForm);
        if (treatSel && item.matchTitle) {
          const match = Array.from(treatSel.options).find((o) => o.text === item.matchTitle);
          if (match) treatSel.value = match.value;
        }
      });
    }
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
