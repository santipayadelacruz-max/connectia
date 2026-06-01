(function () {
  /* ── detect language from path ── */
  const path = location.pathname;
  const isES = path.includes('/es/') || path.endsWith('/es') || path.includes('es/index');
  const lang = isES ? 'es' : 'en';

  /* ── page map: { file, labelEN, labelES } ── */
  const services = [
    { file: 'seo.html',           icon: '🔍', labelEN: 'AI-Powered SEO',        labelES: 'SEO con IA',             descEN: 'LLM-driven content & rankings',      descES: 'Contenido y posicionamiento con LLMs' },
    { file: 'llm.html',           icon: '🧠', labelEN: 'LLM Optimization',       labelES: 'Optimización LLM',       descEN: 'RAG, fine-tuning & prompt engineering', descES: 'RAG, fine-tuning e ingeniería de prompts' },
    { file: 'sea.html',           icon: '📈', labelEN: 'SEA & Paid Media',        labelES: 'SEA & Paid Media IA',    descEN: 'Smarter Google & Meta campaigns',     descES: 'Campañas Google y Meta con IA' },
    { file: 'apps.html',          icon: '📱', labelEN: 'Apps & Custom Tools',     labelES: 'Apps y Herramientas',    descEN: 'Web apps, dashboards & chatbots',     descES: 'Apps web, dashboards y chatbots' },
    { file: 'automatizacion.html',icon: '⚙️', labelEN: 'Process Automation',      labelES: 'Automatización IA',      descEN: 'End-to-end workflow automation',      descES: 'Automatización de flujos de trabajo' },
    { file: 'contenido.html',     icon: '✍️', labelEN: 'AI Content & Copy',       labelES: 'Contenido y Copywriting',descEN: 'Brand-voice content at scale',        descES: 'Contenido a escala con tu voz de marca' },
  ];

  const t = {
    home:      { en: 'Home',     es: 'Inicio' },
    services:  { en: 'Services', es: 'Servicios' },
    process:   { en: 'Process',  es: 'Proceso' },
    about:     { en: 'About',    es: 'Nosotros' },
    contact:   { en: 'Contact',  es: 'Contacto' },
    cta:       { en: 'Get in touch →', es: 'Contactar →' },
    ftServices:{ en: 'Services', es: 'Servicios' },
    ftCompany: { en: 'Company',  es: 'Empresa' },
    ftTagline: { en: 'AI solutions that scale your business globally.', es: 'Soluciones de IA que hacen crecer tu negocio a escala global.' },
    ftRights:  { en: '© 2025 Connectia. All rights reserved.', es: '© 2025 Connectia. Todos los derechos reservados.' },
  };

  /* root for links — en: '' or 'en/', es: 'es/' */
  const root = isES ? 'es/' : '';
  /* opposite lang root for switcher */
  const altRoot = isES ? '' : 'es/';

  /* current file */
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  /* ── BUILD NAV ── */
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="${root}index.html" class="nav-logo" id="nav-logo">
        <span class="logo-full">Connectia</span><span class="logo-short">c</span><span class="logo-dot">.</span><span class="logo-one">one</span>
      </a>

      <ul class="nav-links">
        <li class="nav-item">
          <a href="${root}index.html" class="${currentFile==='index.html'?'active':''}">
            ${t.home[lang]}
          </a>
        </li>
        <li class="nav-item">
          <a href="${root}servicios.html" class="${currentFile==='servicios.html'?'active':''}">
            ${t.services[lang]} <span class="chev">▼</span>
          </a>
          <div class="nav-dropdown mega">
            ${services.map(s => `
              <a href="${root}${s.file}" class="dd-item">
                <span class="dd-icon">${s.icon}</span>
                <div>
                  <div class="dd-label">${isES ? s.labelES : s.labelEN}</div>
                  <div class="dd-desc">${isES ? s.descES : s.descEN}</div>
                </div>
              </a>`).join('')}
            <div class="dd-divider"></div>
            <a href="${root}servicios.html" class="dd-item" style="grid-column:1/-1">
              <span class="dd-icon">📋</span>
              <div>
                <div class="dd-label">${isES ? 'Ver todos los servicios' : 'View all services'}</div>
                <div class="dd-desc">${isES ? 'Comparar opciones y precios' : 'Compare all options'}</div>
              </div>
            </a>
          </div>
        </li>
        <li class="nav-item">
          <a href="${root}proceso.html" class="${currentFile==='proceso.html'?'active':''}">
            ${t.process[lang]}
          </a>
        </li>
        <li class="nav-item">
          <a href="${root}nosotros.html" class="${currentFile==='nosotros.html'?'active':''}">
            ${t.about[lang]}
          </a>
        </li>
      </ul>

      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
        </div>
        <a href="${root}contacto.html" class="nav-cta">${t.cta[lang]}</a>
        <button class="nav-burger" aria-label="Menu" onclick="document.getElementById('nav-mobile').classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- mobile nav -->
    <div class="nav-mobile" id="nav-mobile">
      <a href="${root}index.html">${t.home[lang]}</a>
      <div class="m-section">${t.services[lang]}</div>
      ${services.map(s=>`<a href="${root}${s.file}">${s.icon} ${isES?s.labelES:s.labelEN}</a>`).join('')}
      <a href="${root}proceso.html">${t.process[lang]}</a>
      <a href="${root}nosotros.html">${t.about[lang]}</a>
      <a href="${root}contacto.html" style="color:var(--accent);font-weight:600">${t.contact[lang]}</a>
      <div style="display:flex;gap:.5rem;padding:.8rem 0">
        <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
        <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
      </div>
    </div>
  `;
  document.body.prepend(nav);

  /* ── LANGUAGE SWITCHER ── */
  window.switchLang = function(target) {
    const cur = location.pathname;
    if (target === 'es' && !isES) {
      // go to es/ version
      location.href = 'es/' + (currentFile || 'index.html');
    } else if (target === 'en' && isES) {
      // go up one level
      const parts = cur.split('/');
      const esIdx = parts.lastIndexOf('es');
      if (esIdx !== -1) parts.splice(esIdx, 1);
      location.href = parts.join('/') || '/';
    }
  };

  /* ── BUILD FOOTER ── */
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">Connectia<span>.</span></div>
        <p class="footer-tagline">${t.ftTagline[lang]}</p>
        <a href="${root}contacto.html" class="btn-primary" style="margin-top:1.5rem;display:inline-flex">
          ${t.cta[lang]}
        </a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t.ftServices[lang]}</div>
        <ul>
          ${services.map(s=>`<li><a href="${root}${s.file}">${isES?s.labelES:s.labelEN}</a></li>`).join('')}
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t.ftCompany[lang]}</div>
        <ul>
          <li><a href="${root}nosotros.html">${t.about[lang]}</a></li>
          <li><a href="${root}proceso.html">${t.process[lang]}</a></li>
          <li><a href="${root}contacto.html">${t.contact[lang]}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t.ftRights[lang]}</span>
      <span><a href="mailto:santipayadelacruz@gmail.com" style="color:var(--muted2)">santipayadelacruz@gmail.com</a></span>
    </div>
  `;
  document.body.append(footer);
})();

/* ── CURSOR ─────────────────────────────────────────────────────────────── */
(function initCursor(){
  if(window.matchMedia('(hover:none)').matches) return;
  const dot  = document.createElement('div'); dot.id='cursor-dot';
  const ring = document.createElement('div'); ring.id='cursor-ring';
  document.body.append(dot, ring);
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  (function animRing(){
    rx += (mx-rx)*.28; ry += (my-ry)*.28;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
})();

/* ── SCROLL REVEAL ───────────────────────────────────────────────────────── */
(function initReveal(){
  // Auto-add .reveal to key elements if not already present
  const selectors = [
    'section > .section-label',
    'section > h2',
    'section > .lead',
    '.card','  .kpi','.value-card','.team-card',
    '.service-row','.step','.ps-item',
    '.svc-mini','.stat-item',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el,i) => {
      if(!el.classList.contains('reveal')){
        el.classList.add('reveal');
        if(i>0 && i<5) el.classList.add('reveal-delay-'+(i));
      }
    });
  });

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();

/* ── NAV SCROLL + LOGO MORPH ────────────────────────────────────────────── */
window.addEventListener('scroll',()=>{
  const scrolled = window.scrollY > 80;
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 40);
  document.querySelector('nav').classList.toggle('logo-morphed', scrolled);
},{passive:true});

/* ── ANIMATED STAT COUNTERS ─────────────────────────────────────────────── */
(function initCounters(){
  const counters = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const text = el.innerHTML;
      const num = parseFloat(text.replace(/<[^>]+>/g,''));
      if(isNaN(num)){ io.unobserve(el); return; }
      const suffix = text.replace(/<[^>]+>/g,'').replace(/[\d.]/g,'');
      const em = el.querySelector('em');
      const emText = em ? em.textContent : '';
      let start=0, dur=1400, startTime=null;
      function step(ts){
        if(!startTime) startTime=ts;
        const p = Math.min((ts-startTime)/dur,1);
        const ease = 1-Math.pow(1-p,3);
        const cur = (num*ease);
        const display = num%1===0 ? Math.round(cur) : cur.toFixed(1);
        el.innerHTML = display + (em ? `<em>${emText}</em>` : suffix);
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  },{threshold:.5});
  counters.forEach(c=>io.observe(c));
})();
