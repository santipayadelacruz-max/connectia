(function () {
  const path = location.pathname;
  const isES = path.includes('/es/') || path.endsWith('/es');
  const lang = isES ? 'es' : 'en';
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  /* ── File maps ── */
  const EN = {
    index:'index.html', services:'services.html',
    seo:'seo.html', geo:'geo.html', sea:'sea.html',
    apps:'apps.html', automation:'automation.html',
    content:'content.html', webdesign:'web-design.html',
    about:'about.html', contact:'contact.html',
    // SEO subpages
    'seo-audit':'seo/audit.html',
    'seo-technical':'seo/technical.html',
    'seo-content':'seo/content-strategy.html',
    'seo-international':'seo/international.html',
    'seo-local':'seo/local.html',
    // GEO subpages
    'geo-optimization':'geo/optimization.html',
    'geo-content':'geo/content.html',
    'geo-monitoring':'geo/monitoring.html',
    // SEA subpages
    'sea-google':'sea/google-ads.html',
    'sea-meta':'sea/meta-ads.html',
    'sea-linkedin':'sea/linkedin-ads.html',
    // Content subpages
    'content-blog':'content/blog.html',
    'content-copy':'content/copywriting.html',
    'content-email':'content/email.html',
  };

  const ES = {
    index:'index.html', services:'servicios.html',
    seo:'seo.html', geo:'geo.html', sea:'sea.html',
    apps:'apps.html', automation:'automatizacion.html',
    content:'contenido.html', webdesign:'webs.html',
    about:'nosotros.html', contact:'contacto.html',
    'seo-audit':'seo/auditoria.html',
    'seo-technical':'seo/tecnico.html',
    'seo-content':'seo/estrategia-contenidos.html',
    'seo-international':'seo/internacional.html',
    'seo-local':'seo/local.html',
    'geo-optimization':'geo/optimizacion.html',
    'geo-content':'geo/contenido.html',
    'geo-monitoring':'geo/monitorizacion.html',
    'sea-google':'sea/google-ads.html',
    'sea-meta':'sea/meta-ads.html',
    'sea-linkedin':'sea/linkedin-ads.html',
    'content-blog':'contenido/blog.html',
    'content-copy':'contenido/copywriting.html',
    'content-email':'contenido/email.html',
  };

  const S = isES ? ES : EN;
  const keys = Object.keys(EN);

  window.switchLang = function(target) {
    const srcMap = isES ? ES : EN;
    const key = keys.find(k => srcMap[k] === currentFile) || 'index';
    const destMap = target === 'es' ? ES : EN;
    if (target === 'es' && !isES) location.href = 'es/' + destMap[key];
    else if (target === 'en' && isES) location.href = '../' + destMap[key];
  };

  const t = (e, s) => isES ? s : e;

  /* ── Services with subpages for mega menu ── */
  const services = [
    {
      file: S.seo, icon:'🔍',
      label: t('SEO','SEO'),
      desc: t('Organic rankings that last','Posicionamiento orgánico duradero'),
      subs: [
        {file: S['seo-audit'],       label: t('SEO Audit','Auditoría SEO')},
        {file: S['seo-technical'],   label: t('Technical SEO','SEO Técnico')},
        {file: S['seo-content'],     label: t('Content Strategy','Estrategia de Contenidos')},
        {file: S['seo-international'],label: t('International SEO','SEO Internacional')},
        {file: S['seo-local'],       label: t('Local SEO','SEO Local')},
      ]
    },
    {
      file: S.geo, icon:'🤖',
      label: t('GEO Optimization','Optimización GEO'),
      desc: t('Visibility in AI search engines','Visibilidad en buscadores IA'),
      subs: [
        {file: S['geo-optimization'], label: t('GEO Strategy','Estrategia GEO')},
        {file: S['geo-content'],      label: t('AI-optimised Content','Contenido para IA')},
        {file: S['geo-monitoring'],   label: t('Monitoring & Reporting','Monitorización')},
      ]
    },
    {
      file: S.sea, icon:'📈',
      label: t('SEA & Paid Media','SEA & Paid Media'),
      desc: t('Campaigns that return more than they cost','Campañas que devuelven más de lo que cuestan'),
      subs: [
        {file: S['sea-google'],   label: t('Google Ads','Google Ads')},
        {file: S['sea-meta'],     label: t('Meta Ads','Meta Ads')},
        {file: S['sea-linkedin'], label: t('LinkedIn Ads','LinkedIn Ads')},
      ]
    },
    {
      file: S.content, icon:'✍️',
      label: t('Content & Copy','Contenido y Copy'),
      desc: t('Content that ranks and converts','Contenido que posiciona y convierte'),
      subs: [
        {file: S['content-blog'],  label: t('Blog & Articles','Blog y Artículos')},
        {file: S['content-copy'],  label: t('Copywriting','Copywriting')},
        {file: S['content-email'], label: t('Email Marketing','Email Marketing')},
      ]
    },
    {
      file: S.webdesign, icon:'🌐',
      label: t('Web Design','Diseño Web'),
      desc: t('Fast sites that convert visitors','Webs rápidas que convierten visitas'),
      subs: []
    },
    {
      file: S.apps, icon:'📱',
      label: t('Apps & Tools','Apps y Herramientas'),
      desc: t('Custom software for real problems','Software a medida para problemas reales'),
      subs: []
    },
    {
      file: S.automation, icon:'⚙️',
      label: t('Process Automation','Automatización'),
      desc: t('Eliminate repetitive work permanently','Elimina el trabajo repetitivo'),
      subs: []
    },
  ];

  /* ── Build dd items ── */
  const ddItems = services.map(s => {
    const subsHtml = s.subs.length ? `<div class="dd-sub">${s.subs.map(sub=>`<a href="${sub.file}">${sub.label}</a>`).join('')}</div>` : '';
    return `<div class="dd-item" style="position:relative" onclick="location.href='${s.file}'">
      <span class="dd-icon">${s.icon}</span>
      <div>
        <div class="dd-label">${s.label}</div>
        <div class="dd-desc">${s.desc}</div>
      </div>
      ${subsHtml}
    </div>`;
  }).join('');

  /* ── NAV ── */
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="${S.index}" class="nav-logo" id="nav-logo">
        <span class="logo-full">Connectia</span><span class="logo-short">c</span><span class="logo-dot">.</span><span class="logo-one">one</span>
      </a>
      <ul class="nav-links">
        <li class="nav-item"><a href="${S.index}" class="${currentFile===S.index?'active':''}">${t('Home','Inicio')}</a></li>
        <li class="nav-item">
          <a href="${S.services}" class="${services.some(s=>s.file===currentFile)?'active':''}">${t('Services','Servicios')} <span class="chev">▼</span></a>
          <div class="nav-dropdown mega">
            ${ddItems}
            <div class="dd-divider"></div>
            <div class="dd-item" onclick="location.href='${S.services}'" style="grid-column:1/-1;cursor:pointer">
              <span class="dd-icon">📋</span>
              <div>
                <div class="dd-label">${t('All services','Todos los servicios')}</div>
                <div class="dd-desc">${t('Compare and explore','Comparar y explorar')}</div>
              </div>
            </div>
          </div>
        </li>
        <li class="nav-item"><a href="${S.about}" class="${currentFile===S.about?'active':''}">${t('About','Nosotros')}</a></li>
      </ul>
      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
        </div>
        <a href="${S.contact}" class="nav-cta">${t('Contact →','Contactar →')}</a>
        <button class="nav-burger" aria-label="Menu" onclick="document.getElementById('nav-mobile').classList.toggle('open')">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile" id="nav-mobile">
      <a href="${S.index}">${t('Home','Inicio')}</a>
      <div class="m-section">${t('Services','Servicios')}</div>
      ${services.map(s=>`
        <a href="${s.file}">${s.icon} ${s.label}</a>
        ${s.subs.length ? s.subs.map(sub=>`<a href="${sub.file}" style="padding-left:1.4rem;font-size:.83rem;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,.04)">↳ ${sub.label}</a>`).join('') : ''}
      `).join('')}
      <a href="${S.about}">${t('About','Nosotros')}</a>
      <a href="${S.contact}" style="color:var(--accent);font-weight:600">${t('Contact','Contactar')}</a>
      <div style="display:flex;gap:.5rem;padding:.8rem 0">
        <button class="lang-btn ${!isES?'active':''}" onclick="switchLang('en')">EN</button>
        <button class="lang-btn ${isES?'active':''}" onclick="switchLang('es')">ES</button>
      </div>
    </div>`;
  document.body.prepend(nav);

  /* ── FOOTER ── */
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">Connectia<span>.</span></div>
        <p class="footer-tagline">${t('Digital growth partner. Direct access, measurable results.','Partner de crecimiento digital. Trato directo, resultados medibles.')}</p>
        <a href="${S.contact}" class="btn-primary" style="margin-top:1.5rem;display:inline-flex">${t('Get in touch →','Contactar →')}</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">SEO</div>
        <ul>
          <li><a href="${S['seo-audit']}">${t('SEO Audit','Auditoría SEO')}</a></li>
          <li><a href="${S['seo-technical']}">${t('Technical SEO','SEO Técnico')}</a></li>
          <li><a href="${S['seo-content']}">${t('Content Strategy','Estrategia de Contenidos')}</a></li>
          <li><a href="${S['seo-international']}">${t('International SEO','SEO Internacional')}</a></li>
          <li><a href="${S['seo-local']}">${t('Local SEO','SEO Local')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t('More Services','Más Servicios')}</div>
        <ul>
          <li><a href="${S.geo}">${t('GEO Optimization','Optimización GEO')}</a></li>
          <li><a href="${S.sea}">${t('SEA & Paid Media','SEA & Paid Media')}</a></li>
          <li><a href="${S.content}">${t('Content & Copy','Contenido y Copy')}</a></li>
          <li><a href="${S.webdesign}">${t('Web Design','Diseño Web')}</a></li>
          <li><a href="${S.apps}">${t('Apps & Tools','Apps y Herramientas')}</a></li>
          <li><a href="${S.automation}">${t('Automation','Automatización')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">${t('Company','Empresa')}</div>
        <ul>
          <li><a href="${S.about}">${t('About','Nosotros')}</a></li>
          <li><a href="${S.services}">${t('All services','Todos los servicios')}</a></li>
          <li><a href="${S.contact}">${t('Contact','Contactar')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t('© 2025 Connectia. All rights reserved.','© 2025 Connectia. Todos los derechos reservados.')}</span>
      <span><a href="mailto:santipayadelacruz@gmail.com" style="color:var(--text-muted)">santipayadelacruz@gmail.com</a></span>
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
    (function loop(){ rx+=(mx-rx)*.3; ry+=(my-ry)*.3;
      ring.style.cssText=`left:${rx}px;top:${ry}px`;
      requestAnimationFrame(loop); })();
  }

  /* ── Scroll nav + logo morph ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('logo-morphed', y > 80);
  }, {passive:true});

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
  }, {threshold:.08, rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('section>.section-label,section>h2,section>.lead,.card,.kpi,.value-card,.service-row,.step,.ps-item,.svc-mini,.tl-item,.faq-item').forEach((el,i) => {
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
      let t0=null;
      (function step(ts){ if(!t0) t0=ts;
        const p=Math.min((ts-t0)/1300,1), v=num*(1-Math.pow(1-p,3));
        el.innerHTML=(num%1===0?Math.round(v):v.toFixed(1))+(em?`<em>${emT}</em>`:suffix);
        if(p<1) requestAnimationFrame(step);
      })(performance.now());
      cio.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('.stat-num').forEach(el => cio.observe(el));

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer.open').forEach(a => { a.classList.remove('open'); a.previousElementSibling.classList.remove('open'); });
      if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
    });
  });

})();
