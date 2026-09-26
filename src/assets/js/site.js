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

  // Before/after slider — sayfadaki TÜM [data-ba] kaydırıcıları (fare/dokunmatik/klavye)
  $$("[data-ba]").forEach((ba) => {
    const before = $(".ba-before", ba);
    const handle = $(".ba-handle", ba);
    let drag = false;
    let cur = 50;
    ba.setAttribute("role", "slider");
    ba.setAttribute("tabindex", "0");
    ba.setAttribute("aria-label", "Öncesi / sonrası karşılaştırma");
    ba.setAttribute("aria-valuemin", "0");
    ba.setAttribute("aria-valuemax", "100");
    const set = (pct) => {
      cur = Math.max(2, Math.min(98, pct));
      if (before) before.style.clipPath = `inset(0 ${100 - cur}% 0 0)`;
      if (handle) handle.style.left = cur + "%";
      ba.setAttribute("aria-valuenow", String(Math.round(cur)));
    };
    const fromEv = (e) => {
      const r = ba.getBoundingClientRect();
      if (!r.width) return;
      set(((e.clientX - r.left) / r.width) * 100);
    };
    ba.addEventListener("pointerdown", (e) => {
      drag = true;
      fromEv(e);
      try {
        ba.setPointerCapture(e.pointerId);
      } catch (_) {}
    });
    ba.addEventListener("pointermove", (e) => drag && fromEv(e));
    const end = () => (drag = false);
    ba.addEventListener("pointerup", end);
    ba.addEventListener("pointercancel", end);
    ba.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 10 : 4;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { set(cur - step); e.preventDefault(); }
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") { set(cur + step); e.preventDefault(); }
      else if (e.key === "Home") { set(2); e.preventDefault(); }
      else if (e.key === "End") { set(98); e.preventDefault(); }
    });
    set(50);
  });

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
  const fmtEUR = (n) => "€" + Math.round(n).toLocaleString("de-DE");
  if (calcCard && calcData.length) {
    const situationSel = $("[data-calc-situation]", calcCard);
    const pricedFields = $("[data-calc-priced-fields]", calcCard);
    const situationNote = $("[data-calc-situation-note]", calcCard);
    const resultRow = $("[data-calc-result-row]", calcCard);
    const resultLabel = $("[data-calc-result-label]", calcCard);
    const treatmentSel = $("[data-calc-treatment]", calcCard);
    const qtySel = $("[data-calc-qty]", calcCard);
    const qtyWrap = $("[data-calc-qty-wrap]", calcCard);
    const qtyLabel = $("[data-calc-qty-label]", calcCard);
    const resultEl = $("[data-calc-result]", calcCard);
    const ctaBtn = $("[data-calc-cta]", calcCard);
    const waBtn = $("[data-calc-wa]", calcCard);

    const findItem = (key) => calcData.find((d) => d.key === key) || calcData[0];
    const situation = () => (situationSel && situationSel.value) || "priced";

    const qtyLabelFor = (unit) =>
      unit === "implant" ? calcI18n.qtyLabelImplant || "" :
      unit === "implantpkg" ? calcI18n.qtyLabelImplantPkg || "" :
      calcI18n.qtyLabelTooth || "";

    const populateQty = (item) => {
      if (!item || item.priceOnRequest || !item.options || item.options.length <= 1) {
        if (qtyWrap) qtyWrap.style.display = "none";
        if (item && !item.priceOnRequest && item.options && qtySel) {
          qtySel.innerHTML = `<option value="${item.options[0].qty}" selected>${item.options[0].qty}</option>`;
        }
        return;
      }
      if (qtyWrap) qtyWrap.style.display = "";
      if (qtyLabel) qtyLabel.textContent = qtyLabelFor(item.unit);
      if (!qtySel) return;
      qtySel.innerHTML = item.options
        .map((o) => `<option value="${o.qty}" ${o.qty === item.defaultQty ? "selected" : ""}>${o.qty}</option>`)
        .join("");
    };

    const currentOption = (item) => {
      if (!item || item.priceOnRequest) return null;
      const qty = parseInt(qtySel?.value, 10) || item.defaultQty;
      return item.options.find((o) => o.qty === qty) || item.options[0];
    };

    const applySituation = () => {
      const sit = situation();
      const isPriced = sit === "priced";
      if (pricedFields) pricedFields.style.display = isPriced ? "" : "none";
      if (situationNote) {
        if (sit === "existing-implants") {
          situationNote.style.display = "block";
          situationNote.textContent = calcI18n.noteExisting || "";
        } else if (sit === "not-sure") {
          situationNote.style.display = "block";
          situationNote.textContent = calcI18n.noteNotSure || "";
        } else if (sit === "photos") {
          situationNote.style.display = "block";
          situationNote.textContent = calcI18n.notePhotos || "";
        } else {
          situationNote.style.display = "none";
          situationNote.textContent = "";
        }
      }
      if (resultLabel) {
        resultLabel.textContent = isPriced ? (calcI18n.resultLabel || "") : (calcI18n.planLabel || calcI18n.resultLabel || "");
      }
      if (ctaBtn) {
        const priced = ctaBtn.getAttribute("data-cta-priced") || calcI18n.cta || "";
        const plan = ctaBtn.getAttribute("data-cta-plan") || calcI18n.ctaPlan || priced;
        const arrow = ctaBtn.querySelector("svg");
        const arrowHtml = arrow ? arrow.outerHTML : "";
        ctaBtn.innerHTML = `${isPriced ? priced : plan} ${arrowHtml}`.trim();
        ctaBtn.style.display = sit === "photos" ? "none" : "";
      }
      if (waBtn) {
        waBtn.style.display =
          sit === "photos" || sit === "existing-implants" || sit === "not-sure" ? "" : "none";
      }
    };

    const updateResult = () => {
      applySituation();
      const sit = situation();
      if (sit !== "priced") {
        if (resultEl) resultEl.textContent = calcI18n.onRequest || "—";
        return { item: null, opt: null, sit };
      }
      const item = findItem(treatmentSel?.value);
      const opt = currentOption(item);
      if (resultEl) resultEl.textContent = opt ? fmtEUR(opt.price) : calcI18n.onRequest || "—";
      return { item, opt, sit };
    };

    if (situationSel) situationSel.addEventListener("change", updateResult);
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
      ctaBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const { item, opt, sit } = updateResult();
        const base = ctaBtn.getAttribute("data-quote-url") || ctaBtn.getAttribute("href");
        const params = new URLSearchParams();
        if (sit && sit !== "priced") {
          const title = (calcI18n.situationTitles && calcI18n.situationTitles[sit]) || sit;
          params.set("tx", title);
          params.set("price", "onrequest");
          params.set("situation", sit);
          if (sit === "existing-implants") params.set("treatment", "existing-implants");
          else if (sit === "not-sure") params.set("treatment", "not-sure-plan");
        } else if (item) {
          params.set("tx", item.title);
          if (opt) {
            params.set("qty", opt.qty);
            params.set("price", opt.price);
          } else {
            params.set("price", "onrequest");
          }
          if (item.matchTitle) params.set("svc", item.matchTitle);
        }
        window.location.href = base + "?" + params.toString();
      });
    }
  }

  // Quote summary banner (on the contact page, when arriving from the price calculator)
  const quoteBox = $("[data-quote-summary]");
  if (quoteBox) {
    const qp = new URLSearchParams(window.location.search);
    const tx = qp.get("tx");
    if (tx) {
      const cfg = window.__MD_FORM__ || {};
      const price = qp.get("price");
      const qty = qp.get("qty");
      const priceText = price === "onrequest" ? cfg.quoteOnRequest || "—" : fmtEUR(parseFloat(price) || 0);
      quoteBox.style.display = "block";
      quoteBox.innerHTML = `<div class="form-card" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <div>
          <div style="font-size:12.5px;font-weight:700;color:var(--muted-2);margin-bottom:4px;">${cfg.quoteSummaryLabel || ""}</div>
          <div style="font-family:var(--font-serif);font-weight:700;font-size:22px;color:var(--ink);">${tx}${qty ? ` (${qty})` : ""}</div>
          <div style="font-size:13px;color:var(--muted-2);margin-top:6px;">${cfg.quoteSummaryNote || ""}</div>
        </div>
        <div style="font-family:var(--font-serif);font-weight:700;font-size:26px;color:var(--ink);">${priceText}</div>
      </div>
      ${cfg.quoteFormPrompt ? `<div style="margin-top:18px;padding:16px 20px;background:var(--gold,#b8935a);color:#fff;border-radius:12px;font-size:19px;font-weight:700;text-align:center;line-height:1.4;">↓ ${cfg.quoteFormPrompt}</div>` : ""}`;

      const leadForm = $("[data-lead-form]:not([data-hero-form])");
      if (leadForm) {
        const msg = $("textarea[name=message]", leadForm);
        if (msg && !msg.value) msg.value = `${tx}${qty ? ` (${qty})` : ""} — ${priceText}`;
        const treatSel = $("select[name=treatment]", leadForm);
        const treatmentParam = qp.get("treatment");
        const svc = qp.get("svc");
        if (treatSel) {
          if (treatmentParam && Array.from(treatSel.options).some((o) => o.value === treatmentParam)) {
            treatSel.value = treatmentParam;
          } else if (svc) {
            const match = Array.from(treatSel.options).find((o) => o.text === svc);
            if (match) treatSel.value = match.value;
          }
          treatSel.dispatchEvent(new Event("change"));
        }
      }
    }
  }

  // Contact form: show WhatsApp photo hint for photo / complex situations
  const treatSelect = $("[data-treatment-select]");
  const photosHint = $("[data-photos-hint]");
  if (treatSelect && photosHint) {
    const syncHint = () => {
      const v = treatSelect.value;
      photosHint.style.display =
        v === "photos-xray" || v === "existing-implants" || v === "failed-veneers" || v === "not-sure-plan"
          ? "block"
          : "none";
    };
    treatSelect.addEventListener("change", syncHint);
    syncHint();
  }

  // Contact form: kayıt (Sheet + varsa Estesof) HER ZAMAN sessizce denenir,
  // WhatsApp da HER ZAMAN ref kodlu mesajla açılır — biri diğerinin
  // fallback'i değil, ikisi birlikte olur.
  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    const card = form.closest(".form-card");
    const cfg = window.__MD_FORM__ || {};
    const attrKeys = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "kw", "h", "l", "ref"];
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      // Ülke kodu seçicili form (hero): +kod + yerel numara; kullanıcı zaten + ile yazdıysa olduğu gibi
      if (data.cc) {
        const raw = String(data.phone || "").trim();
        data.phone = raw.startsWith("+") ? raw : data.cc + " " + raw.replace(/^0+/, "");
      }
      const mdt = window.MDTrack || {};
      const stored = (mdt.getStore && mdt.getStore()) || {};
      const attribution = {};
      attrKeys.forEach((k) => {
        if (data[k]) attribution[k] = data[k];
        else if (stored[k]) attribution[k] = stored[k];
      });
      const refCode = mdt.resolveRefCode ? mdt.resolveRefCode(attribution) : null;

      // 1) Kayıt — Sheet (leadRecord) her zaman, Estesof varsa ayrıca (best-effort, WA'yı beklemez)
      if (mdt.recordLead) {
        mdt.recordLead({
          source_type: "form",
          ref_code: refCode || "",
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          treatment: data.treatment || "",
          message: data.message || "",
          attribution,
          landing_page: stored.landing_page || location.href,
          page_url: location.href,
          lang: document.documentElement.lang || "tr",
        });
      }
      if (cfg.endpoint) {
        fetch(cfg.endpoint, {
          method: cfg.method || "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            ...data,
            client: "medident",
            source: attribution.utm_source || "medidentistanbul.com",
            page: location.href,
            attribution,
          }),
        }).catch(() => {});
      }

      // 2) WhatsApp — her zaman açılır, ham kelime/gclid değil sadece ref kodu
      if (cfg.whatsapp) {
        const treatSel = form.querySelector("[name=treatment]");
        const treatLabel = treatSel && treatSel.value ? treatSel.selectedOptions[0].text : data.treatment || "";
        let msg = [
          "Merhaba MediDent İstanbul,",
          `Ad: ${data.name || ""}`,
          `Telefon: ${data.phone || ""}`,
          data.email ? `E-posta: ${data.email}` : "",
          `Tedavi: ${treatLabel}`,
          data.message ? `Mesaj: ${data.message}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        if (mdt.appendRef) msg = mdt.appendRef(msg, refCode);
        window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      }
      if (card) card.classList.add("is-sent");
    });
  });

  // Sayfa içi forma kaydır (CTA "Form Bırak" / "İletişim formu"): sayfadan çıkarmaz, ilk alana odaklanır
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("[data-scroll-form]");
    if (!a) return;
    const target = document.getElementById(a.dataset.target || "iletisim") || document.querySelector("[data-lead-form]");
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const first = target.querySelector("input[name=name]");
    setTimeout(() => first && first.focus({ preventScroll: true }), reduce ? 0 : 600);
  });
})();
