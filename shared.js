(function () {
  /* ── detect language ── */
  const path = location.pathname;
  const isES = path.includes('/es/') || path.endsWith('/es');
  const lang = isES ? 'es' : 'en';

  /* ── filename maps ── */
  const EN = {
    index:'index.html', services:'services.html', seo:'seo.html',
    llm:'llm.html', sea:'sea.html', apps:'apps.html',
    automation:'automation.html', content:'content.html',
    webdesign:'web-design.html', about:'about.html',
    process:'process.html', contact:'contact.html',
  };
  const ES = {
    index:'index.html', services:'servicios.html', seo:'seo.html',
    llm:'llm.html', sea:'sea.html', apps:'apps.html',
    automation:'automatizacion.html', content:'contenido.html',
    webdesign:'webs.html', about:'nosotros.html',
    process:'proceso.html', contact:'contacto.html',
  };

  /* ── current page filename ── */
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  /*
   * KEY FIX: links must always be RELATIVE to the current file location.
   * EN pages live at root  → links are just "seo.html", "es/seo.html"
   * ES pages live at /es/  → links are just "seo.html", "../seo.html"
   * No prefix needed — same-folder files work with bare filename.
   */
  const S = isES ? ES : EN;  /* same-folder filenames */

  /* cross-language link: EN→ES or ES→EN */
  const keys = Object.keys(EN);
  function crossLang(targetIsES) {
    /* find the key matching current file */
    const srcMap = isES ? ES : EN;
    const key = keys.find(k => srcMap[k] === currentFile) || 'index';
    const destMap = targetIsES ? ES : EN;
    const destFile = destMap[key];
    if (targetIsES && !isES) return 'es/' + destFile;   /* EN → go into es/ */
    if (!targetIsES && isES) return '../' + destFile;   /* ES → go up to root */
    return destFile;
  }

  /* services list — file references are same-folder (relative) */
  const services = [
    {file:S.seo,       icon:'🔍',labelEN:'SEO',                    labelES:'SEO',                    descEN:'Content strategy & rankings',          descES:'Estrategia de contenido y posicionamiento'},
    {file:S.llm,       icon:'🧠',labelEN:'LLM Optimization',        labelES:'Optimización LLM',        descEN:'RAG, fine-tuning & prompt engineering', descES:'RAG, fine-tuning e ingeniería de prompts'},
    {file:S.sea,       icon:'📈',labelEN:'SEA & Paid Media',         labelES:'SEA & Paid Media',        descEN:'Google & Meta campaigns',              descES:'Campañas Google y Meta'},
    {file:S.apps,      icon:'📱',labelEN:'Apps & Custom Tools',      labelES:'Apps y Herramientas',     descEN:'Web apps, dashboards & chatbots',       descES:'Apps web, dashboards y chatbots'},
    {file:S.automation,icon:'⚙️',labelEN:'Process Automation',       labelES:'Automatización',          descEN:'End-to-end workflow automation',        descES:'Automatización de flujos de trabajo'},
    {file:S.content,   icon:'✍️',labelEN:'Content & Copywriting',    labelES:'Contenido y Copywriting', descEN:'Brand-voice content at scale',          descES:'Contenido a escala con tu voz de marca'},
    {file:S.webdesign, icon:'🌐',labelEN:'Web Design',               labelES:'Diseño Web',              descEN:'Fast websites that convert',            descES:'Webs rápidas que convierten'},
  ];

  const t = {
    home:    {en:'Home',           es:'Inicio'},
    svc:     {en:'Services',       es:'Servicios'},
    process: {en:'Process',        es:'Proceso'},
    about:   {en:'About',          es:'Nosotros'},
    contact: {en:'Contact',        es:'Contacto'},
    cta:     {en:'Get in touch →', es:'Contactar →'},
    ftTag:   {en:'Digital growth. Global reach.', es:'Crecimiento digital. Alcance global.'},
    ftRights:{en:'© 2025 Connectia. All rights reserved.', es:'© 2025 Connectia. Todos los derechos reservados.'},
  };

  /* ── BUILD NAV ── */
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="${S.index}" class="nav-logo" id="nav-logo">
        <span class="logo-full">Connectia</span><span class="logo-short">c</span><span class="logo-dot">.</span><span class="logo-one">one</span>
      </a>
      <ul class="nav-links">
        <li class="nav-item">
          <a href="${S.index}" class="${currentFile===S.index?'active':''}">${t.home[lang]}</a>
        </li>
        <li class="nav-item">
          <a href="${S.services}" class="${currentFile===S.services?'active':(services.some(s=>s.file===currentFile)?'active':'')}">${t.svc[lang]} <span class="chev">▼</span></a>
          <div class="nav-dropdown mega">
            ${services.map(s=>`
              <a href="${s.file}" class="dd-item">
                <span class="dd-icon">${s.icon}</span>
                <div>
                  <div class="dd-label">${isES?s.labelES:s.labelEN}</div>
                  <div class="dd-desc">${isES?s.descES:s.descEN}</div>
                </div>
              </a>`).join('')}
            <div class="dd-divider"></div>
            <a href="${S.services}" class="dd-item" style="grid-column:1/-1">
              <span class="dd-icon">📋</span>
              <div>
                <div class="dd-label">${isES?'Ver todos los servicios':'View all services'}</div>
                <div class="dd-desc">${isES?'Resumen completo':'Full overview'}</div>
              </div>
            </a>
          </div>
        </li>
        <li class="nav-item">
          <a href="${S.process}" class="${currentFile===S.process?'active':''}">${t.process[lang]}</a>
        </li>
        <li class="nav-item">
          <a href="${S.about}" class="${currentFile===S.about?'active':''}">${t.about[lang]}</a>
        </li>
      </ul>
      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
        </div>
        <a href="${S.contact}" class="nav-cta">${t.cta[lang]}</a>
        <button class="nav-burger" aria-label="Menu"
          onclick="document.getElementById('nav-mobile').classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile" id="nav-mobile">
      <a href="${S.index}">${t.home[lang]}</a>
      <div class="m-section">${t.svc[lang]}</div>
      ${services.map(s=>`<a href="${s.file}">${s.icon} ${isES?s.labelES:s.labelEN}</a>`).join('')}
      <a href="${S.process}">${t.process[lang]}</a>
      <a href="${S.about}">${t.about[lang]}</a>
      <a href="${S.contact}" style="color:var(--accent);font-weight:600">${t.contact[lang]}</a>
      <div style="display:flex;gap:.5rem;padding:.8rem 0">
        <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
        <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
      </div>
    </div>`;
  document.body.prepend(nav);

  /* ── LANGUAGE SWITCHER ── */
  window.switchLang = function(target) {
    if (target === 'es' && !isES) location.href = crossLang(true);
    else if (target === 'en' && isES) location.href = crossLang(false);
  };

  /* ── BUILD FOOTER ── */
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">Connectia<span>.</span></div>
        <p class="footer-tagline">${t.ftTag[lang]}</p>
        <a href="${S.contact}" class="btn-primary" style="margin-top:1.5rem;display:inline-flex">${t.cta[lang]}</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t.svc[lang]}</div>
        <ul>
          ${services.map(s=>`<li><a href="${s.file}">${isES?s.labelES:s.labelEN}</a></li>`).join('')}
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${isES?'Empresa':'Company'}</div>
        <ul>
          <li><a href="${S.about}">${t.about[lang]}</a></li>
          <li><a href="${S.process}">${t.process[lang]}</a></li>
          <li><a href="${S.contact}">${t.contact[lang]}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t.ftRights[lang]}</span>
      <span><a href="mailto:santipayadelacruz@gmail.com" style="color:var(--muted)">santipayadelacruz@gmail.com</a></span>
    </div>`;
  document.body.append(footer);

  /* ── CURSOR ── */
  if (!window.matchMedia('(hover:none)').matches) {
    const dot  = Object.assign(document.createElement('div'), {id:'cursor-dot'});
    const ring = Object.assign(document.createElement('div'), {id:'cursor-ring'});
    document.body.append(dot, ring);
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      dot.style.cssText=`left:${mx}px;top:${my}px`;
    });
    (function loop(){
      rx+=(mx-rx)*.3; ry+=(my-ry)*.3;
      ring.style.cssText=`left:${rx}px;top:${ry}px`;
      requestAnimationFrame(loop);
    })();
  }

  /* ── SCROLL: nav class + logo morph ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('logo-morphed', y > 80);
  }, {passive:true});

  /* ── SCROLL REVEAL ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold:.08, rootMargin:'0px 0px -30px 0px'});

  document.querySelectorAll(
    'section > .section-label, section > h2, section > .lead, ' +
    '.card, .kpi, .value-card, .team-card, .service-row, ' +
    '.step, .ps-item, .svc-mini, .tl-item'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    if (i%4===1) el.classList.add('reveal-d1');
    if (i%4===2) el.classList.add('reveal-d2');
    if (i%4===3) el.classList.add('reveal-d3');
    io.observe(el);
  });

  /* ── STAT COUNTERS ── */
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
        const p = Math.min((ts-t0)/1300, 1);
        const v = num * (1 - Math.pow(1-p, 3));
        el.innerHTML = (num%1===0 ? Math.round(v) : v.toFixed(1)) + (em ? `<em>${emT}</em>` : suffix);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
      cio.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('.stat-num').forEach(el => cio.observe(el));

})();
