(function () {
  try { if (/\/index\.html$/.test(location.pathname)) history.replaceState(null, '', location.pathname.replace(/index\.html$/, '') + location.search + location.hash); } catch (e) {}
  const path = location.pathname;
  const isES = path.includes('/es/') || path.endsWith('/es');
  const lang = isES ? 'es' : 'en';
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  /* ── Calculate depth prefix ──────────────────────────────────────────────
   * Depth must be relative to the LANGUAGE ROOT (the 'es/' folder for
   * Spanish pages), because the MAP objects below are already relative
   * to their own language root. The 'es' segment itself must NOT count
   * as a depth level, or every generated link ends up one folder too
   * high (landing on the EN site, or on a Spanish filename that doesn't
   * exist at that level → 404).
   *
   * /index.html            → depth 0 → prefix ''
   * /seo.html              → depth 0 → prefix ''
   * /es/index.html         → depth 0 → prefix ''
   * /es/seo.html           → depth 0 → prefix ''
   * /seo/audit.html        → depth 1 → prefix '../'
   * /es/seo/auditoria.html → depth 1 → prefix '../'
   */
  const parts = path.replace(/^\//, '').split('/').filter(Boolean);
  const langParts = isES ? parts.slice(1) : parts.slice();
  const relFile = langParts.join('/') || 'index.html'; // path relative to language root, e.g. 'seo/audit.html'
  const depth = langParts.length > 0 ? langParts.length - 1 : 0;
  const pre   = depth === 0 ? '' : depth === 1 ? '../' : '../../';

  /* ── File maps — all paths relative to their language root ── */
  const EN = {
    index:'index.html', services:'services.html',
    seo:'seo.html', geo:'geo.html', sea:'sea.html',
    apps:'apps.html', automation:'automation.html',
    content:'content.html', webdesign:'web-design.html',
    about:'about.html', contact:'contact.html', blog:'blog.html', cookies:'cookies.html', privacy:'privacy.html',
    'seo-audit':'seo/audit.html','seo-technical':'seo/technical.html',
    'seo-content':'seo/content-strategy.html','seo-international':'seo/international.html',
    'seo-local':'seo/local.html',
    'geo-opt':'geo/optimization.html','geo-content':'geo/content.html','geo-mon':'geo/monitoring.html',
    'sea-google':'sea/google-ads.html','sea-meta':'sea/meta-ads.html','sea-linkedin':'sea/linkedin-ads.html',
    'cont-blog':'content/blog.html','cont-copy':'content/copywriting.html',
  };
  const ES = {
    index:'index.html', services:'servicios.html',
    seo:'seo.html', geo:'geo.html', sea:'sea.html',
    apps:'apps.html', automation:'automatizacion.html',
    content:'contenido.html', webdesign:'webs.html',
    about:'nosotros.html', contact:'contacto.html', blog:'blog.html', cookies:'cookies.html', privacy:'privacidad.html',
    'seo-audit':'seo/auditoria.html','seo-technical':'seo/tecnico.html',
    'seo-content':'seo/estrategia-contenidos.html','seo-international':'seo/internacional.html',
    'seo-local':'seo/local.html',
    'geo-opt':'geo/optimizacion.html','geo-content':'geo/contenido.html','geo-mon':'geo/monitorizacion.html',
    'sea-google':'sea/google-ads.html','sea-meta':'sea/meta-ads.html','sea-linkedin':'sea/linkedin-ads.html',
    'cont-blog':'contenido/blog.html','cont-copy':'contenido/copywriting.html',
  };

  const MAP  = isES ? ES : EN;
  const keys = Object.keys(EN);
  const t    = (e, s) => isES ? s : e;

  /* ── Build hrefs with correct depth prefix ── */
  const h = (key) => key === 'index' ? (isES ? '/es/' : '/') : pre + MAP[key];
  const hf = (file) => pre + file; // for raw filenames

  /* ── Language switcher ── */
  window.switchLang = function(target) {
    const srcMap  = isES ? ES : EN;
    const destMap = target === 'es' ? ES : EN;
    // Match against relFile (path relative to the current language root),
    // not the bare filename — subpages like 'seo/audit.html' only match this way.
    const key = (isES && (relFile === 'seo-local.html' || relFile.startsWith('seo-local/') || relFile === 'web-rapida.html' || relFile.startsWith('web-rapida/') || relFile.startsWith('diseno-web/') || relFile === 'diseno-web-por-zonas.html')) ? (relFile.indexOf('web') > -1 && relFile.indexOf('seo') < 0 ? 'webdesign' : 'seo-local') : (!isES && (relFile === 'local-seo.html' || relFile.startsWith('local/'))) ? 'seo-local' : (!isES && (relFile === 'web-design-by-city.html' || relFile.startsWith('websites/') || relFile === 'fast-website.html' || relFile.startsWith('fast-website/'))) ? 'webdesign' : (keys.find(k => srcMap[k] === relFile) || 'index');
    if (relFile === 'seo-local-guia.html' || relFile === 'local-seo-guide.html') {
      location.href = target === 'es' ? pre + 'es/seo-local-guia.html' : (isES ? pre + '../local-seo-guide.html' : pre + 'local-seo-guide.html');
      return;
    }
    if (key === 'index') { location.href = target === 'es' ? '/es/' : '/'; return; }
    const destFile = destMap[key];
    if (target === 'es' && !isES) {
      // From EN root or subpage → go into /es/...
      location.href = pre + 'es/' + destFile;
    } else if (target === 'en' && isES) {
      // From /es/ or /es/sub/ → go up out of the es/ folder, then to the EN file.
      // pre already accounts for depth within the es/ folder; one more '../' exits it.
      const enPre = pre + '../';
      location.href = enPre + destFile;
    }
  };

  /* ── Services with subpages ── */
  const services = [
    { key:'seo', icon:'🔍', label:t('SEO','SEO'),
      subs:[{f:h('seo-audit'),l:t('SEO Audit','Auditoría SEO')},
            {f:h('seo-technical'),l:t('Technical SEO','SEO Técnico')},
            {f:h('seo-international'),l:t('International SEO','SEO Internacional')},
            {f:h('seo-local'),l:t('Local SEO','SEO Local')}]},
    { key:'geo', icon:'🤖', label:t('GEO','GEO'), subs:[]},
    { key:'automation',icon:'⚙️', label:t('AI Automation','Automatización IA'), subs:[]},
    { key:'sea', icon:'📈', label:t('Paid Media','Paid Media'),
      subs:[{f:h('sea-google'),l:'Google Ads'},
            {f:h('sea-meta'),l:'Meta Ads'},
            {f:h('sea-linkedin'),l:'LinkedIn Ads'}]},
    { key:'webdesign', icon:'🌐', label:t('Web','Web'), subs:[]},
    { key:'apps',      icon:'📱', label:t('Apps','Apps'), subs:[]},
    { key:'content', icon:'✍️', label:t('Content','Contenido'),
      subs:[{f:h('cont-copy'),l:'Copywriting'}]},
  ];

  /* ── Build nav ── */
  const serviceItems = services.map(s => {
    const isActive = currentFile === MAP[s.key];
    const hasSubs  = s.subs.length > 0;
    const subsHtml = hasSubs
      ? `<div class="nav-dropdown">${s.subs.map(sub=>`<a href="${sub.f}">${sub.l}</a>`).join('')}</div>`
      : '';
    return `<li class="nav-item">
      <a href="${h(s.key)}" class="${isActive?'active':''}">${s.label}${hasSubs?' <span class="chev">▾</span>':''}</a>
      ${subsHtml}
    </li>`;
  }).join('');

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="${h('index')}" class="nav-logo" id="nav-logo">
        <span class="logo-full">Connectia</span><span class="logo-short">c</span><span class="logo-dot">.</span><span class="logo-one">one</span>
      </a>
      <ul class="nav-links">
        ${serviceItems}
        <li class="nav-item"><a href="${h('blog')}" class="${currentFile===MAP.blog?'active':''}">Blog</a></li>
        <li class="nav-item"><a href="${h('about')}" class="${currentFile===MAP.about?'active':''}">${t('About','Nosotros')}</a></li>
      </ul>
      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
        </div>
        <a href="${h('contact')}" class="nav-cta" data-quote>${t('Free quote →','Presupuesto gratis →')}</a>
        <button class="nav-burger" aria-label="Menu" aria-controls="nav-mobile" onclick="document.getElementById('nav-mobile').classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile" id="nav-mobile">
      <div class="m-section">${t('Services','Servicios')}</div>
      ${services.map(s=>s.subs.length ? `
        <details class="m-acc"><summary>${s.icon} ${s.label}</summary>
          <a class="m-sub" href="${h(s.key)}">${t('Overview','Ver todo')} ${s.label}</a>
          ${s.subs.map(sub=>`<a class="m-sub" href="${sub.f}">${sub.l}</a>`).join('')}
        </details>` : `<a href="${h(s.key)}">${s.icon} ${s.label}</a>`).join('')}
      ${isES ? `<a href="${hf('seo-local.html')}">📍 SEO local por zonas</a>` : ''}
      <div class="m-section">${t('Company','Empresa')}</div>
      <a href="${h('blog')}">Blog</a>
      <a href="${h('about')}">${t('About','Nosotros')}</a>
      <a href="${h('contact')}" class="m-cta">${t('Free 30-min call →','Llamada gratuita de 30 min →')}</a>
      <div style="display:flex;gap:.5rem;padding:.75rem 0;border-bottom:none">
        <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
        <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
      </div>
    </div>`;
  document.body.prepend(nav);

  /* ── Footer ── */
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">Connectia<span>.</span></div>
        <p class="footer-tagline">${t('Digital growth partner. Direct access, measurable results.','Partner de crecimiento digital. Trato directo, resultados medibles.')}</p>
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjQ0IiB2aWV3Qm94PSIwIDAgMTQwIDQ0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHJvbGU9ImltZyI+Cjx0aXRsZT5Hb29nbGUgUGFydG5lcjwvdGl0bGU+CjxkZXNjPkdvb2dsZSBQYXJ0bmVyIGNlcnRpZmljYXRpb24gYmFkZ2U8L2Rlc2M+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQ0IiBmaWxsPSIjNDI4NUY0Ii8+CjxnIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNTAwIj4KICA8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTUiIGxldHRlci1zcGFjaW5nPSItMC4zIj4KICAgIDx0c3BhbiBmaWxsPSIjNDI4NUY0Ij5HPC90c3Bhbj48dHNwYW4gZmlsbD0iI0VBNDMzNSI+bzwvdHNwYW4+PHRzcGFuIGZpbGw9IiNGQkJDMDUiPm88L3RzcGFuPjx0c3BhbiBmaWxsPSIjNDI4NUY0Ij5nPC90c3Bhbj48dHNwYW4gZmlsbD0iIzM0QTg1MyI+bDwvdHNwYW4+PHRzcGFuIGZpbGw9IiNFQTQzMzUiPmU8L3RzcGFuPgogIDwvdGV4dD4KICA8dGV4dCB4PSIxNiIgeT0iMzciIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM3NTc1NzUiIGxldHRlci1zcGFjaW5nPSItMC4yIj5QYXJ0bmVyPC90ZXh0Pgo8L2c+Cjwvc3ZnPgo=" alt="Google Partner" width="120" height="38" style="margin-top:1.4rem;display:block;opacity:.92" loading="lazy">
        <a href="${h('contact')}" class="btn-primary" style="margin-top:1.2rem;display:inline-flex">${t('Get in touch →','Contactar →')}</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">SEO</div>
        <ul>
          <li><a href="${h('seo-audit')}">${t('SEO Audit','Auditoría SEO')}</a></li>
          <li><a href="${h('seo-technical')}">${t('Technical SEO','SEO Técnico')}</a></li>
          <li><a href="${h('seo-international')}">${t('International SEO','SEO Internacional')}</a></li>
          <li><a href="${h('seo-local')}">${t('Local SEO','SEO Local')}</a></li>
          ${isES ? `<li><a href="/es/seo-local.html">SEO local por zonas</a></li>
          <li><a href="/es/diseno-web-por-zonas.html">Diseño web por zonas</a></li>
          <li><a href="/es/seo-local-guia.html">Guía de SEO local</a></li>` : `<li><a href="/local-seo.html">Local SEO by city</a></li>
          <li><a href="/web-design-by-city.html">Web design by city</a></li>
          <li><a href="/local-seo-guide.html">Local SEO guide</a></li>`}
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t('More Services','Más Servicios')}</div>
        <ul>
          <li><a href="${h('geo')}">${t('GEO Optimization','Optimización GEO')}</a></li>
          <li><a href="${h('sea')}">${t('Paid Media','Paid Media')}</a></li>
          <li><a href="${h('content')}">${t('Content & Copy','Contenido y Copy')}</a></li>
          <li><a href="${h('webdesign')}">${t('Web Design','Diseño Web')}</a></li>
          <li><a href="${isES ? hf('web-rapida.html') : hf('fast-website.html')}">${t('Website in 7 days','Web en pocos días')}</a></li>
          <li><a href="${h('apps')}">${t('Apps & Tools','Apps')}</a></li>
          <li><a href="${h('automation')}">${t('AI Automation','Automatización IA')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t('Company','Empresa')}</div>
        <ul>
          <li><a href="${h('about')}">${t('About','Nosotros')}</a></li>
          <li><a href="${h('services')}">${t('All services','Todos los servicios')}</a></li>
          <li><a href="${h('blog')}">Blog</a></li>
          <li><a href="${h('contact')}">${t('Contact','Contactar')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t('© 2026 Connectia. All rights reserved.','© 2026 Connectia. Todos los derechos reservados.')}</span>
      <span><a href="${h('privacy')}" style="color:var(--text-muted)">${t('Privacy','Privacidad')}</a> · <a href="${h('cookies')}" style="color:var(--text-muted)">Cookies</a> · <a href="mailto:santipayadelacruz@gmail.com" style="color:var(--text-muted)">santipayadelacruz@gmail.com</a></span>
    </div>`;
  document.body.append(footer);
  /* All locations live in the footer (static HTML in each page, moved here) */
  const fl = document.getElementById('foot-locs');
  if (fl) {
    const fb = footer.querySelector('.footer-bottom');
    footer.insertBefore(fl, fb);
    if (window.innerWidth < 900) fl.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
  }

  /* ── Scroll nav + logo morph ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('logo-morphed', y > 80);
  }, {passive:true});

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
  }, {threshold:.07, rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll(
    'section>.section-label,section>h2,section>.lead,.card,.kpi,.value-card,.service-row,.step,.ps-item,.svc-mini,.tl-item,.faq-item,.ticker-item'
  ).forEach((el,i) => {
    el.classList.add('reveal');
    if(i%4===1) el.classList.add('reveal-d1');
    if(i%4===2) el.classList.add('reveal-d2');
    if(i%4===3) el.classList.add('reveal-d3');
    io.observe(el);
  });

  /* ── Stat counters ── */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const em = el.querySelector('em');
      const emT = em ? em.textContent : '';
      const raw = el.innerHTML.replace(/<[^>]+>/g,'');
      const num = parseFloat(raw);
      if (isNaN(num)) { cio.unobserve(el); return; }
      const suffix = raw.replace(/[\d.]/g,'');
      let t0 = null;
      (function step(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts-t0)/1200, 1);
        const v = num * (1 - Math.pow(1-p, 3));
        el.innerHTML = (num%1===0 ? Math.round(v) : v.toFixed(1)) + (em ? `<em>${emT}</em>` : suffix);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
      cio.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('.stat-num,.ticker-num').forEach(el => cio.observe(el));

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.classList.remove('open');
      });
      document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded','false'));
      if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    });
  });


  /* ── UX: skip link + main landmark ── */
  const skip = document.createElement('a');
  skip.className = 'skip-link'; skip.href = '#contenido-principal';
  skip.textContent = t('Skip to content','Saltar al contenido');
  document.body.prepend(skip);
  const firstSection = document.querySelector('section');
  if (firstSection && !document.getElementById('contenido-principal')) firstSection.id = 'contenido-principal';

  /* ── UX: barra de confianza bajo los CTAs del hero ── */
  const heroActions = document.querySelector('.hero-actions, .page-hero-actions');
  const isContact = /contact|contacto/.test(currentFile);
  if (heroActions && !isContact && !document.querySelector('.trust-bar') && !document.querySelector('.proof-strip')) {
    const ul = document.createElement('ul');
    ul.className = 'trust-bar';
    ul.innerHTML = [t('Reply in under 24h','Respuesta en menos de 24 h'),
                    t('Fixed price','Precio cerrado'),
                    t('You talk to who does the work','Hablas con quien hace el trabajo'),
                    t('Start in 48h','Arranque en 48 h')].map(x => `<li>${x}</li>`).join('');
    heroActions.after(ul);
  }

  /* nav CTA: ir al formulario de presupuesto si la página lo tiene */
  document.querySelectorAll('a[data-quote]').forEach(a => { if (document.getElementById('presupuesto')) a.setAttribute('href', '#presupuesto'); });

  /* ── UX: CTA fijo en móvil ── */
  if (!isContact) {
    const bar = document.createElement('div');
    bar.className = 'sticky-cta';
    const hasQ = !!document.getElementById('presupuesto');
    bar.innerHTML = hasQ ? `<a class="btn-primary" href="#presupuesto">${t('Get a free quote →','Pedir presupuesto gratis →')}</a>` : `<a class="btn-primary" href="${h('contact')}?s=auditoria">${t('Get a free quote →','Pedir presupuesto gratis →')}</a>`;
    document.body.append(bar);
    const toggleBar = () => bar.classList.toggle('show', window.scrollY > 500);
    window.addEventListener('scroll', toggleBar, {passive:true}); toggleBar();
  }

  /* ── UX: blog (progreso de lectura + índice desplegable) ── */
  const art = document.querySelector('.article-body');
  if (art) {
    const pg = document.createElement('div'); pg.className = 'read-progress'; document.body.append(pg);
    window.addEventListener('scroll', () => {
      const r = art.getBoundingClientRect();
      const total = r.height - window.innerHeight * .5;
      pg.style.width = Math.max(0, Math.min(1, (-r.top + window.innerHeight * .3) / total)) * 100 + '%';
    }, {passive:true});
    const hs = art.querySelectorAll('h2');
    if (hs.length > 3) {
      const d = document.createElement('details'); d.className = 'acc toc';
      d.innerHTML = `<summary>${t('In this article','En este artículo')}</summary><div class="acc-body"><ul class="feature-list">${
        [...hs].map((x,i) => { x.id = x.id || 'sec-' + (i+1); return `<li><a href="#${x.id}">${x.textContent}</a></li>`; }).join('')}</ul></div>`;
      art.before(d);
    }
  }

  /* ── UX: formulario, preselección del servicio y errores sin alert() ── */
  const form = document.getElementById('contact-form');
  if (form) {
    const q = new URLSearchParams(location.search).get('s');
    const sel = form.querySelector('select[name=service]');
    if (q && sel) {
      const want = {seo:'SEO', geo:'GEO', auditoria:'SEO'}[q];
      if (want) [...sel.options].forEach(o => { if (o.textContent.includes(want)) sel.value = o.value || o.textContent; });
    }
  }


  /* ── UX: formularios de presupuesto (Formspree) sin alert() ── */
  document.querySelectorAll('form.quote-form').forEach(f => {
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const es = f.dataset.lang === 'es';
      const btn = f.querySelector('button[type=submit]');
      const label = btn.textContent;
      btn.textContent = es ? 'Enviando…' : 'Sending…'; btn.disabled = true;
      f.querySelectorAll('.form-msg').forEach(n => n.remove());
      try {
        const res = await fetch(f.action, {method:'POST', body:new FormData(f), headers:{'Accept':'application/json'}});
        if (res.ok) {
          f.innerHTML = '<div style="background:rgba(45,212,168,.07);border:1px solid rgba(45,212,168,.2);border-radius:14px;padding:2rem;text-align:center"><div style="font-size:1.8rem;margin-bottom:.6rem">✓</div><h3 style="margin-bottom:.4rem">' + (es ? 'Recibido.' : 'Received.') + '</h3><p style="color:var(--text-body);font-size:.9rem;margin:0">' + (es ? 'Te respondo en menos de 24 horas laborables.' : 'I will reply within 24 business hours.') + '</p></div>';
        } else throw new Error('bad');
      } catch (_) {
        btn.textContent = label; btn.disabled = false;
        f.insertAdjacentHTML('beforeend', '<p class="form-msg" style="color:#ff8a7a;font-size:.85rem;text-align:center;margin:0">' + (es ? 'Algo salió mal. Escríbeme a santipayadelacruz@gmail.com.' : 'Something went wrong. Email santipayadelacruz@gmail.com.') + '</p>');
      }
    });
  });

})();
