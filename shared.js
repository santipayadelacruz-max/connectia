(function () {
  /* ── detect language from path ── */
  const path = location.pathname;
  const isES = path.includes('/es/') || path.endsWith('/es');
  const lang = isES ? 'es' : 'en';

  /* ── EN slug map (English URL names) ── */
  const EN = {
    index:      'index.html',
    services:   'services.html',
    seo:        'seo.html',
    llm:        'llm.html',
    sea:        'sea.html',
    apps:       'apps.html',
    automation: 'automation.html',
    content:    'content.html',
    webdesign:  'web-design.html',
    about:      'about.html',
    process:    'process.html',
    contact:    'contact.html',
  };
  /* ── ES slug map ── */
  const ES = {
    index:       'index.html',
    services:    'servicios.html',
    seo:         'seo.html',
    llm:         'llm.html',
    sea:         'sea.html',
    apps:        'apps.html',
    automation:  'automatizacion.html',
    content:     'contenido.html',
    webdesign:   'webs.html',
    about:       'nosotros.html',
    process:     'proceso.html',
    contact:     'contacto.html',
  };

  const S = isES ? ES : EN;
  const root = isES ? '' : '';  /* relative — ES pages are in /es/, EN in root */
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  /* ── alt link helper (for lang switcher) ── */
  function altLink(enFile) {
    /* given an EN filename, return the ES equivalent and vice versa */
    const map = Object.entries(EN).reduce((acc,[k,v]) => { acc[v]=k; return acc; }, {});
    const key = map[enFile] || map[currentFile];
    if (!key) return isES ? '../index.html' : 'es/index.html';
    if (isES) return '../' + EN[key];
    else      return 'es/' + ES[key];
  }

  /* ── services list ── */
  const services = [
    { en: S.seo,       icon:'🔍', labelEN:'AI-Powered SEO',         labelES:'SEO',                    descEN:'Content strategy & rankings',         descES:'Estrategia de contenido y posicionamiento' },
    { en: S.llm,       icon:'🧠', labelEN:'LLM Optimization',        labelES:'Optimización LLM',        descEN:'RAG, fine-tuning & prompt engineering',descES:'RAG, fine-tuning e ingeniería de prompts' },
    { en: S.sea,       icon:'📈', labelEN:'SEA & Paid Media',         labelES:'SEA & Paid Media',        descEN:'Google & Meta campaigns',             descES:'Campañas Google y Meta' },
    { en: S.apps,      icon:'📱', labelEN:'Apps & Custom Tools',      labelES:'Apps y Herramientas',     descEN:'Web apps, dashboards & chatbots',      descES:'Apps web, dashboards y chatbots' },
    { en: S.automation,icon:'⚙️', labelEN:'Process Automation',       labelES:'Automatización',          descEN:'End-to-end workflow automation',       descES:'Automatización de flujos de trabajo' },
    { en: S.content,   icon:'✍️', labelEN:'Content & Copywriting',    labelES:'Contenido y Copywriting', descEN:'Brand-voice content at scale',         descES:'Contenido a escala con tu voz de marca' },
    { en: S.webdesign, icon:'🌐', labelEN:'Web Design & Development', labelES:'Diseño Web',              descEN:'Fast, modern websites that convert',   descES:'Webs rápidas, modernas y que convierten' },
  ];

  const t = {
    home:     {en:'Home',     es:'Inicio'},
    services: {en:'Services', es:'Servicios'},
    process:  {en:'Process',  es:'Proceso'},
    about:    {en:'About',    es:'Nosotros'},
    contact:  {en:'Contact',  es:'Contacto'},
    cta:      {en:'Get in touch →', es:'Contactar →'},
    ftSvc:    {en:'Services', es:'Servicios'},
    ftCo:     {en:'Company',  es:'Empresa'},
    ftTag:    {en:'AI-powered digital growth. Global reach.', es:'Crecimiento digital con IA. Alcance global.'},
    ftRights: {en:'© 2025 Connectia. All rights reserved.', es:'© 2025 Connectia. Todos los derechos reservados.'},
  };

  /* ── BUILD NAV ── */
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="${S.index}" class="nav-logo" id="nav-logo">
        <span class="logo-full">Connectia</span><span class="logo-short">c</span><span class="logo-dot">.</span><span class="logo-one">one</span>
      </a>
      <ul class="nav-links">
        <li class="nav-item"><a href="${S.index}" class="${currentFile===S.index?'active':''}">${t.home[lang]}</a></li>
        <li class="nav-item">
          <a href="${S.services}" class="${currentFile===S.services?'active':''}">${t.services[lang]} <span class="chev">▼</span></a>
          <div class="nav-dropdown mega">
            ${services.map(s=>`<a href="${s.en}" class="dd-item"><span class="dd-icon">${s.icon}</span><div><div class="dd-label">${isES?s.labelES:s.labelEN}</div><div class="dd-desc">${isES?s.descES:s.descEN}</div></div></a>`).join('')}
            <div class="dd-divider"></div>
            <a href="${S.services}" class="dd-item" style="grid-column:1/-1"><span class="dd-icon">📋</span><div><div class="dd-label">${isES?'Ver todos los servicios':'View all services'}</div><div class="dd-desc">${isES?'Resumen completo':'Full overview'}</div></div></a>
          </div>
        </li>
        <li class="nav-item"><a href="${S.process}" class="${currentFile===S.process?'active':''}">${t.process[lang]}</a></li>
        <li class="nav-item"><a href="${S.about}" class="${currentFile===S.about?'active':''}">${t.about[lang]}</a></li>
      </ul>
      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
        </div>
        <a href="${S.contact}" class="nav-cta">${t.cta[lang]}</a>
        <button class="nav-burger" aria-label="Menu" onclick="document.getElementById('nav-mobile').classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile" id="nav-mobile">
      <a href="${S.index}">${t.home[lang]}</a>
      <div class="m-section">${t.services[lang]}</div>
      ${services.map(s=>`<a href="${s.en}">${s.icon} ${isES?s.labelES:s.labelEN}</a>`).join('')}
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
    /* Build map of current file → opposite lang file */
    const allEN = Object.values(EN);
    const allES = Object.values(ES);
    const keys  = Object.keys(EN);
    const idxEN = allEN.indexOf(currentFile);
    const idxES = allES.indexOf(currentFile);
    if (target === 'es' && !isES) {
      const key = idxEN >= 0 ? keys[idxEN] : 'index';
      location.href = 'es/' + ES[key];
    } else if (target === 'en' && isES) {
      const key = idxES >= 0 ? keys[idxES] : 'index';
      location.href = '../' + EN[key];
    }
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
        <div class="footer-col-title">${t.ftSvc[lang]}</div>
        <ul>${services.map(s=>`<li><a href="${s.en}">${isES?s.labelES:s.labelEN}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t.ftCo[lang]}</div>
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
    const dot = Object.assign(document.createElement('div'), {id:'cursor-dot'});
    const ring = Object.assign(document.createElement('div'), {id:'cursor-ring'});
    document.body.append(dot, ring);
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      dot.style.cssText = `left:${mx}px;top:${my}px`;
    });
    (function loop(){ rx+=(mx-rx)*.3; ry+=(my-ry)*.3;
      ring.style.cssText=`left:${rx}px;top:${ry}px`;
      requestAnimationFrame(loop); })();
  }

  /* ── SCROLL: nav class + logo morph ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('logo-morphed', y > 80);
  }, {passive:true});

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    'section > .section-label, section > h2, section > .lead, .card, .kpi, .value-card, .team-card, .service-row, .step, .ps-item, .svc-mini, .tl-item'
  );
  revealEls.forEach((el,i) => {
    el.classList.add('reveal');
    if(i%4===1) el.classList.add('reveal-d1');
    if(i%4===2) el.classList.add('reveal-d2');
    if(i%4===3) el.classList.add('reveal-d3');
  });
  new IntersectionObserver((entries,io) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
  }, {threshold:.08, rootMargin:'0px 0px -30px 0px'})
  .observe || (() => {})();
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io2.unobserve(e.target); }});
  }, {threshold:.08, rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el => io2.observe(el));

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
      let t0=null;
      (function step(ts){
        if(!t0) t0=ts;
        const p = Math.min((ts-t0)/1300,1);
        const v = num*(1-Math.pow(1-p,3));
        el.innerHTML = (num%1===0?Math.round(v):v.toFixed(1)) + (em?`<em>${emT}</em>`:suffix);
        if(p<1) requestAnimationFrame(step);
      })(performance.now());
      cio.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('.stat-num').forEach(el => cio.observe(el));

})();
