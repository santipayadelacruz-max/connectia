(function () {
  const path = location.pathname;
  const isES = path.includes('/es/') || path.endsWith('/es');
  const lang = isES ? 'es' : 'en';
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  /* ── Calculate depth prefix ──────────────────────────────────────────────
   * /index.html            → depth 0 → prefix ''
   * /seo.html              → depth 0 → prefix ''
   * /es/index.html         → depth 1 → prefix '../'
   * /seo/audit.html        → depth 1 → prefix '../'
   * /es/seo/auditoria.html → depth 2 → prefix '../../'
   */
  const parts = path.replace(/^\//, '').split('/').filter(Boolean);
  const depth = parts.length > 0 ? parts.length - 1 : 0;
  const pre   = depth === 0 ? '' : depth === 1 ? '../' : '../../';
  // For ES subpages loaded via /es/seo/auditoria.html, pre = '../../'
  // nav links like pre+'seo.html' = '../../seo.html' — correct from /es/seo/

  /* ── File maps — all paths relative to their language root ── */
  const EN = {
    index:'index.html', services:'services.html',
    seo:'seo.html', geo:'geo.html', sea:'sea.html',
    apps:'apps.html', automation:'automation.html',
    content:'content.html', webdesign:'web-design.html',
    about:'about.html', contact:'contact.html',
    'seo-audit':'seo/audit.html','seo-technical':'seo/technical.html',
    'seo-content':'seo/content-strategy.html','seo-international':'seo/international.html',
    'seo-local':'seo/local.html',
    'geo-opt':'geo/optimization.html','geo-content':'geo/content.html','geo-mon':'geo/monitoring.html',
    'sea-google':'sea/google-ads.html','sea-meta':'sea/meta-ads.html','sea-linkedin':'sea/linkedin-ads.html',
    'cont-blog':'content/blog.html','cont-copy':'content/copywriting.html','cont-email':'content/email.html',
  };
  const ES = {
    index:'index.html', services:'servicios.html',
    seo:'seo.html', geo:'geo.html', sea:'sea.html',
    apps:'apps.html', automation:'automatizacion.html',
    content:'contenido.html', webdesign:'webs.html',
    about:'nosotros.html', contact:'contacto.html',
    'seo-audit':'seo/auditoria.html','seo-technical':'seo/tecnico.html',
    'seo-content':'seo/estrategia-contenidos.html','seo-international':'seo/internacional.html',
    'seo-local':'seo/local.html',
    'geo-opt':'geo/optimizacion.html','geo-content':'geo/contenido.html','geo-mon':'geo/monitorizacion.html',
    'sea-google':'sea/google-ads.html','sea-meta':'sea/meta-ads.html','sea-linkedin':'sea/linkedin-ads.html',
    'cont-blog':'contenido/blog.html','cont-copy':'contenido/copywriting.html','cont-email':'contenido/email.html',
  };

  const MAP  = isES ? ES : EN;
  const keys = Object.keys(EN);
  const t    = (e, s) => isES ? s : e;

  /* ── Build hrefs with correct depth prefix ── */
  const h = (key) => pre + MAP[key];
  const hf = (file) => pre + file; // for raw filenames

  /* ── Language switcher ── */
  window.switchLang = function(target) {
    const srcMap  = isES ? ES : EN;
    const destMap = target === 'es' ? ES : EN;
    const key = keys.find(k => srcMap[k] === currentFile) || 'index';
    const destFile = destMap[key];
    if (target === 'es' && !isES) {
      // From EN root or subpage → go to /es/...
      location.href = pre + 'es/' + destFile;
    } else if (target === 'en' && isES) {
      // From /es/ or /es/sub/ → go up to root EN
      const ups = isES ? (depth === 0 ? '../' : depth === 1 ? '../' : '../../') : '';
      // Actually just go relative: from /es/seo/file → ../../ + en file
      // pre already accounts for depth within language folder
      // For ES: pre='../../' from /es/seo/, so pre+EN[key] = '../../seo.html' ✓
      // But we want EN root, not ES root. Add one more '../' if isES
      const enPre = depth === 0 ? '../' : pre + '../';
      location.href = (isES ? enPre : pre) + destFile;
    }
  };

  /* ── Services with subpages ── */
  const services = [
    { key:'seo', icon:'🔍', label:t('SEO','SEO'),
      subs:[{f:h('seo-audit'),l:t('SEO Audit','Auditoría SEO')},
            {f:h('seo-technical'),l:t('Technical SEO','SEO Técnico')},
            {f:h('seo-content'),l:t('Content Strategy','Estrategia de Contenidos')},
            {f:h('seo-international'),l:t('International SEO','SEO Internacional')},
            {f:h('seo-local'),l:t('Local SEO','SEO Local')}]},
    { key:'geo', icon:'🤖', label:t('GEO','GEO'),
      subs:[{f:h('geo-opt'),l:t('GEO Strategy','Estrategia GEO')},
            {f:h('geo-content'),l:t('AI Content','Contenido para IA')},
            {f:h('geo-mon'),l:t('Monitoring','Monitorización')}]},
    { key:'sea', icon:'📈', label:t('Paid Media','Paid Media'),
      subs:[{f:h('sea-google'),l:'Google Ads'},
            {f:h('sea-meta'),l:'Meta Ads'},
            {f:h('sea-linkedin'),l:'LinkedIn Ads'}]},
    { key:'content', icon:'✍️', label:t('Content','Contenido'),
      subs:[{f:h('cont-blog'),l:t('Blog & Articles','Blog y Artículos')},
            {f:h('cont-copy'),l:'Copywriting'},
            {f:h('cont-email'),l:'Email'}]},
    { key:'webdesign', icon:'🌐', label:t('Web','Web'), subs:[]},
    { key:'apps',      icon:'📱', label:t('Apps','Apps'), subs:[]},
    { key:'automation',icon:'⚙️', label:t('Automation','Automatización'), subs:[]},
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
        <li class="nav-item"><a href="${h('about')}" class="${currentFile===MAP.about?'active':''}">${t('About','Nosotros')}</a></li>
      </ul>
      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
        </div>
        <a href="${h('contact')}" class="nav-cta">${t('Contact →','Contactar →')}</a>
        <button class="nav-burger" aria-label="Menu" onclick="document.getElementById('nav-mobile').classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile" id="nav-mobile">
      <div class="m-section">${t('Services','Servicios')}</div>
      ${services.map(s=>`
        <a href="${h(s.key)}">${s.icon} ${s.label}</a>
        ${s.subs.map(sub=>`<a class="m-sub" href="${sub.f}">↳ ${sub.l}</a>`).join('')}
      `).join('')}
      <div class="m-section">${t('Company','Empresa')}</div>
      <a href="${h('about')}">${t('About','Nosotros')}</a>
      <a href="${h('contact')}" style="color:var(--accent);font-weight:600">${t('Contact','Contactar')}</a>
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
        <a href="${h('contact')}" class="btn-primary" style="margin-top:1.4rem;display:inline-flex">${t('Get in touch →','Contactar →')}</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">SEO</div>
        <ul>
          <li><a href="${h('seo-audit')}">${t('SEO Audit','Auditoría SEO')}</a></li>
          <li><a href="${h('seo-technical')}">${t('Technical SEO','SEO Técnico')}</a></li>
          <li><a href="${h('seo-content')}">${t('Content Strategy','Estrategia Contenidos')}</a></li>
          <li><a href="${h('seo-international')}">${t('International SEO','SEO Internacional')}</a></li>
          <li><a href="${h('seo-local')}">${t('Local SEO','SEO Local')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t('More Services','Más Servicios')}</div>
        <ul>
          <li><a href="${h('geo')}">${t('GEO Optimization','Optimización GEO')}</a></li>
          <li><a href="${h('sea')}">${t('Paid Media','Paid Media')}</a></li>
          <li><a href="${h('content')}">${t('Content & Copy','Contenido y Copy')}</a></li>
          <li><a href="${h('webdesign')}">${t('Web Design','Diseño Web')}</a></li>
          <li><a href="${h('apps')}">${t('Apps & Tools','Apps')}</a></li>
          <li><a href="${h('automation')}">${t('Automation','Automatización')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t('Company','Empresa')}</div>
        <ul>
          <li><a href="${h('about')}">${t('About','Nosotros')}</a></li>
          <li><a href="${h('services')}">${t('All services','Todos los servicios')}</a></li>
          <li><a href="${h('contact')}">${t('Contact','Contactar')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t('© 2025 Connectia. All rights reserved.','© 2025 Connectia. Todos los derechos reservados.')}</span>
      <span><a href="mailto:santipayadelacruz@gmail.com" style="color:var(--text-muted)">santipayadelacruz@gmail.com</a></span>
    </div>`;
  document.body.append(footer);

  /* ── Cursor ── */
  if (!window.matchMedia('(hover:none)').matches) {
    const dot  = Object.assign(document.createElement('div'), {id:'cursor-dot'});
    const ring = Object.assign(document.createElement('div'), {id:'cursor-ring'});
    document.body.append(dot, ring);
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    });
    (function loop() {
      rx += (mx - rx) * .15; ry += (my - ry) * .15;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      requestAnimationFrame(loop);
    })();
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
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.classList.remove('open');
      });
      if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
    });
  });

})();
