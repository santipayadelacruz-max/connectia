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


  /* ES: best-known brands first in the logo carousel (rebuilds one clean loop) */
  (function(){
    if(document.documentElement.lang!=='es') return;
    var t=document.querySelector('.logo-track'); if(!t) return;
    var rank=['cabify','rituals','engel','elle','pronovias','lidl','eni','oxfam','amplifon','pierre','mettler','endress','tmb','generaloptica','cunef'];
    var seen={},items=[];
    t.querySelectorAll('.logo-item').forEach(function(it){var im=it.querySelector('img');if(!im)return;
      var m=im.getAttribute('src').match(/\/([a-z]+)\.png/);var k=m?m[1]:im.getAttribute('src');
      if(!seen[k]){seen[k]=1;items.push({k:k,el:it.cloneNode(true)});}});
    if(items.length<4) return;
    items.sort(function(a,b){var x=rank.indexOf(a.k),y=rank.indexOf(b.k);return (x<0?99:x)-(y<0?99:y);});
    var html='';items.forEach(function(i){html+=i.el.outerHTML+'<div class="logo-divider"></div>';});
    t.innerHTML=html+html;
  })();


  /* Where-to-start finder */
  (function(){
    var f=document.getElementById('finder'); if(!f) return;
    var tabs=[].slice.call(f.querySelectorAll('.fd-tab')), pans=[].slice.call(f.querySelectorAll('.fd-panel'));
    function show(i,focus){tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1});
      pans.forEach(function(p,k){p.hidden=k!==i}); if(focus) tabs[i].focus();}
    f.classList.add('fd-on'); show(0,false);
    tabs.forEach(function(t,i){t.addEventListener('click',function(){show(i,false)});
      t.addEventListener('keydown',function(e){var n=i; if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length; else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i-1+tabs.length)%tabs.length; else return; e.preventDefault(); show(n,true);});});
  })();

  /* Quick-pick goal chips on every quote form: one tap pre-fills the message */
  (function(){
    var es=document.documentElement.lang==='es';
    var G=es?[['Más clientes desde Google','Quiero conseguir más clientes desde Google. Mi negocio es: '],['Que me recomiende la IA','Quiero aparecer en ChatGPT y otras IAs. Mi negocio es: '],['Web nueva','Necesito una web nueva. Mi negocio es: '],['Campañas de pago','Quiero lanzar campañas de pago rentables. Mi negocio es: '],['Otra cosa','Os cuento mi caso: ']]
            :[['More enquiries from Google','I want more enquiries from Google. My business is: '],['Get recommended by AI','I want to show up in ChatGPT and other AI tools. My business is: '],['New website','I need a new website. My business is: '],['Paid campaigns','I want paid campaigns that pay for themselves. My business is: '],['Something else','Here is my situation: ']];
    document.querySelectorAll('form textarea[name="message"]').forEach(function(t){
      var f=t.closest('form'); if(!f||f.classList.contains('hc-form')||f.querySelector('.q-chips')) return;
      var box=document.createElement('div'); box.className='q-chips'; box.setAttribute('role','group');
      box.setAttribute('aria-label',es?'¿Qué quieres conseguir?':'What do you want to achieve?');
      G.forEach(function(g){var b=document.createElement('button');b.type='button';b.className='q-chip';b.textContent=g[0];b.setAttribute('aria-pressed','false');
        b.addEventListener('click',function(){var prev=box.querySelector('[aria-pressed="true"]');var old=prev?prev.dataset.fill:'';
          if(!t.value.trim()||t.value===old){t.value=g[1]}
          box.querySelectorAll('.q-chip').forEach(function(x){x.setAttribute('aria-pressed','false')});
          b.setAttribute('aria-pressed','true'); b.dataset.fill=g[1]; t.focus(); t.setSelectionRange(t.value.length,t.value.length);});
        box.appendChild(b);});
      var host=t.closest('.form-group')||t; host.parentNode.insertBefore(box,host);
    });
  })();

  /* Stat counters on the home pages: count up when they scroll into view */
  (function(){
    var nums=[].slice.call(document.querySelectorAll('.stats-panel-num')); if(!nums.length||!('IntersectionObserver' in window)) return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    nums.forEach(function(el){var n=el.firstChild; if(!n||n.nodeType!==3) return; var target=parseInt(n.nodeValue,10); if(isNaN(target)) return;
      n.nodeValue='0';
      var io=new IntersectionObserver(function(en){en.forEach(function(e){if(!e.isIntersecting) return; io.disconnect();
        var t0=null; function step(ts){if(!t0)t0=ts; var p=Math.min((ts-t0)/1100,1); n.nodeValue=String(Math.round(target*(1-Math.pow(1-p,3)))); if(p<1)requestAnimationFrame(step); else n.nodeValue=String(target);}
        requestAnimationFrame(step);});},{threshold:.5}); io.observe(el);});
  })();


  /* Guided quote wizard: segments the lead step by step, sends everything to the same Formspree form */
  (function(){
    var targets=[].slice.call(document.querySelectorAll('form.quote-form:not(.hc-form), form#contact-form'));
    if(!targets.length||!window.fetch) return;
    var es=document.documentElement.lang==='es';
    var T=function(a,b){return es?b:a};
    var SV=[['seo','SEO',1],['geo',T('AI search (GEO)','Buscadores de IA (GEO)'),1],['sea','Paid Media',1],['web',T('Website','Web'),1],['aut',T('Automation','Automatización'),1],['app',T('Custom app or tool','App o herramienta'),1],['con',T('Content','Contenido'),1],['nose',T('Not sure yet','Aún no lo sé'),1]];
    var BIZ=[T('Local business or freelancer','Negocio local o autónomo'),T('Small or mid-sized company','Pyme'),'E-commerce',T('Large company or B2B','Empresa grande o B2B'),T('Agency or other','Agencia u otro')];
    var WEB=[T('No website yet','Aún no tengo web'),T('Have one and it works','Tengo y funciona'),T('Have one, want to redo it','Tengo y quiero rehacerla')];
    var GOAL=[T('More enquiries','Más consultas'),T('More online sales','Más ventas online'),T('Show up in AI answers','Aparecer en respuestas de IA'),T('Save team time','Ahorrar tiempo al equipo'),T('Improve what I have','Mejorar lo que ya tengo')];
    var WHEN=[T('As soon as possible','Cuanto antes'),T('In 1 to 3 months','En 1 a 3 meses'),T('Just exploring','Solo estoy explorando')];
    var BUD=[T('Under 1,000 EUR','Menos de 1.000 €'),'1.000 – 3.000 €'.replace('.',T(',','.')),'3.000 – 8.000 €'.replace('.',T(',','.')),T('Over 8,000 EUR','Más de 8.000 €'),T('Advise me','Prefiero que me orientes')];
    var steps=[
      {k:'services',q:T('What do you need help with?','¿En qué necesitas ayuda?'),h:T('Pick all that apply.','Elige todo lo que encaje.'),type:'multi',opts:SV.map(function(x){return x[1]}),keys:SV.map(function(x){return x[0]}),req:1},
      {k:'business',q:T('Tell me about your business','Cuéntame de tu negocio'),type:'single',opts:BIZ,req:1,extra:{k:'website',q:T('And your website?','¿Y tu web?'),opts:WEB}},
      {k:'goal',q:T('What do you want to achieve?','¿Qué quieres conseguir?'),type:'single',opts:GOAL,req:1,extra:{k:'timing',q:T('When do you want to start?','¿Para cuándo?'),opts:WHEN}},
      {k:'budget',q:T('Rough investment you have in mind','Inversión aproximada que tienes en mente'),h:T('Optional. It helps me quote in the right range.','Opcional. Me ayuda a ajustar el presupuesto.'),type:'single',opts:BUD,req:0},
      {k:'contact',q:T('Where do I send the quote?','¿Dónde te envío el presupuesto?'),type:'contact'}
    ];
    var preset=null; window.cqPreset=function(key){preset=key;targets.forEach(function(f){if(f._cq)f._cq.preset(key)})};
    function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
    targets.forEach(function(orig,idx){
      var action=orig.getAttribute('action'); if(!action) return;
      var ans={services:[],business:'',website:'',goal:'',timing:'',budget:''}, cur=0, uid='cq'+idx;
      var w=el('form','cq'); w.setAttribute('novalidate',''); w.setAttribute('aria-label',T('Quote request','Solicitud de presupuesto'));
      var prog=el('div','cq-prog'); var bar=el('i'); prog.appendChild(bar); var cnt=el('div','cq-count'); w.appendChild(cnt); w.appendChild(prog);
      var body=el('div','cq-body'); w.appendChild(body);
      var nav=el('div','cq-nav'); var back=el('button','cq-back',T('Back','Atrás')); back.type='button';
      var next=el('button','btn-primary cq-next'); next.type='button'; nav.appendChild(back); nav.appendChild(next); w.appendChild(nav);
      var note=el('p','cq-note',T('I reply personally within 24 business hours. Your details are used only to answer you.','Te respondo personalmente en 24 horas laborables. Tus datos se usan solo para contestarte.')); w.appendChild(note);
      var hp=document.createElement('input'); hp.type='text'; hp.name='_gotcha'; hp.tabIndex=-1; hp.autocomplete='off'; hp.style.display='none'; w.appendChild(hp);
      function opt(group,name,label,type,checked,onchg){
        var l=el('label','cq-opt'); var i=document.createElement('input'); i.type=type; i.name=uid+name; i.checked=!!checked;
        i.addEventListener('change',onchg); l.appendChild(i); l.appendChild(el('span','',label)); return l}
      function group(title,hint,type,name,opts,sel,onpick){
        var fs=el('fieldset','cq-fs'); var lg=el('legend','',title); fs.appendChild(lg); if(hint) fs.appendChild(el('p','cq-hint',hint));
        var box=el('div','cq-opts');
        opts.forEach(function(o,i){box.appendChild(opt(fs,name,o,type,sel(o,i),function(){onpick(o,i,this.checked)}))});
        fs.appendChild(box); return fs}
      function valid(){var s=steps[cur];
        if(s.type==='multi') return ans.services.length>0;
        if(s.type==='single'){ if(s.req&&!ans[s.k]) return false; if(s.extra&&!ans[s.extra.k]) return false; return true}
        if(s.type==='contact'){var n=w.querySelector('[name=name]'),m=w.querySelector('[name=email]'); return !!(n&&m&&n.value.trim().length>1&&/^\S+@\S+\.\S+$/.test(m.value.trim()))}
        return true}
      function refresh(){next.disabled=!valid(); }
      function render(){
        body.innerHTML=''; var s=steps[cur];
        cnt.textContent=T('Step ','Paso ')+(cur+1)+' / '+steps.length; bar.style.width=((cur+1)/steps.length*100)+'%';
        back.style.visibility=cur?'visible':'hidden';
        next.textContent=cur===steps.length-1?T('Send my request →','Enviar mi solicitud →'):T('Continue →','Continuar →');
        if(s.type==='multi'){
          body.appendChild(group(s.q,s.h,'checkbox','svc',s.opts,function(o,i){return ans.services.indexOf(o)>-1},function(o,i,c){var k=ans.services.indexOf(o); if(c&&k<0)ans.services.push(o); if(!c&&k>-1)ans.services.splice(k,1); refresh()}));
        } else if(s.type==='single'){
          body.appendChild(group(s.q,s.h,'radio',s.k,s.opts,function(o){return ans[s.k]===o},function(o){ans[s.k]=o;refresh()}));
          if(s.extra) body.appendChild(group(s.extra.q,'','radio',s.extra.k,s.extra.opts,function(o){return ans[s.extra.k]===o},function(o){ans[s.extra.k]=o;refresh()}));
        } else {
          var fs=el('fieldset','cq-fs'); fs.appendChild(el('legend','',s.q));
          function f(label,name,type,auto,req){var g=el('div','form-group'); var l=el('label','',label); var i=document.createElement(type==='area'?'textarea':'input'); if(type!=='area')i.type=type; else i.rows=3; i.name=name; i.id=uid+name; l.htmlFor=i.id; if(auto)i.autocomplete=auto; i.value=ans['_'+name]||''; i.addEventListener('input',function(){ans['_'+name]=i.value;refresh()}); g.appendChild(l); g.appendChild(i); fs.appendChild(g)}
          f(T('Name','Nombre'),'name','text','name'); f('Email','email','email','email'); f(T('Phone (optional)','Teléfono (opcional)'),'phone','tel','tel'); f(T('Anything else? (optional)','¿Algo más? (opcional)'),'message','area');
          body.appendChild(fs);
        }
        refresh();
        var first=body.querySelector('input,textarea'); if(first&&cur>0&&w._started) first.focus({preventScroll:true});
      }
      function summary(){return [T('Services','Servicios')+': '+ans.services.join(', '),T('Business','Negocio')+': '+ans.business,T('Website','Web')+': '+ans.website,T('Goal','Objetivo')+': '+ans.goal,T('Timing','Plazo')+': '+ans.timing,T('Budget','Inversión')+': '+(ans.budget||'-')].join('\n')}
      function send(){
        var fd=new FormData(); var get=function(n){var e=w.querySelector('[name='+n+']');return e?e.value.trim():''};
        fd.append('_subject',T('New guided quote: ','Nuevo presupuesto guiado: ')+ans.services.join(' + ')+' | '+ans.business);
        fd.append('topic',T('Guided quote','Presupuesto guiado')); fd.append('services',ans.services.join(', ')); fd.append('business_type',ans.business); fd.append('website_status',ans.website);
        fd.append('goal',ans.goal); fd.append('timing',ans.timing); fd.append('budget',ans.budget||''); fd.append('name',get('name')); fd.append('email',get('email')); fd.append('_replyto',get('email')); fd.append('phone',get('phone'));
        fd.append('message',summary()+(get('message')?'\n\n'+get('message'):'')+'\n\nPage: '+location.pathname); fd.append('_gotcha',hp.value);
        next.disabled=true; next.textContent=T('Sending…','Enviando…'); w.querySelectorAll('.cq-err').forEach(function(n){n.remove()});
        fetch(action,{method:'POST',body:fd,headers:{'Accept':'application/json'}}).then(function(r){if(!r.ok)throw 0;
          w.innerHTML=''; var d=el('div','cq-done'); d.appendChild(el('div','cq-check','✓')); d.appendChild(el('h3','',T('Received, thank you.','Recibido, gracias.'))); d.appendChild(el('p','',T('I will reply within 24 business hours with questions and a first idea.','Te respondo en 24 horas laborables con preguntas y una primera idea.'))); w.appendChild(d);
          try{if(window.gtag)gtag('event','generate_lead')}catch(e){}
        }).catch(function(){next.disabled=false;next.textContent=T('Send my request →','Enviar mi solicitud →'); var p=el('p','cq-err',T('Something went wrong. Email santipayadelacruz@gmail.com.','Algo salió mal. Escríbeme a santipayadelacruz@gmail.com.')); nav.before(p)});
      }
      next.addEventListener('click',function(){ if(!valid())return; w._started=1; if(cur<steps.length-1){cur++;render(); w.scrollIntoView({block:'nearest'})} else send()});
      back.addEventListener('click',function(){if(cur>0){cur--;render()}});
      w.addEventListener('submit',function(e){e.preventDefault(); if(valid()) next.click()});
      w.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='checkbox'&&e.target.type!=='radio'){e.preventDefault(); if(valid()) next.click()}});
      w._cq={preset:function(key){var m={seo:0,geo:1,sea:2,web:3,aut:4,app:5,con:6}; var o=SV[m[key]]; if(!o) return; ans.services=[o[1]]; cur=0; render()}};
      render(); orig.parentNode.insertBefore(w,orig); orig.style.display='none';
      var alt=orig.querySelector('a[href^="mailto:"]'); if(alt){var p=el('p','cq-alt',T('Prefer to write directly? ','¿Prefieres escribir directamente? ')); var a=document.createElement('a'); a.href=alt.href; a.textContent=alt.textContent; p.appendChild(a); w.appendChild(p)}
      w._orig=orig; if(preset) w._cq.preset(preset);
      // hide the fixed mobile CTA while the wizard is on screen
      if('IntersectionObserver' in window){new IntersectionObserver(function(en){en.forEach(function(e){document.body.classList.toggle('q-in-view',e.isIntersecting)})},{threshold:.15}).observe(w)}
    });
    // finder "Get a quote" buttons preselect the service
    document.querySelectorAll('.fd-panel .btn-secondary[href="#presupuesto"]').forEach(function(a){a.addEventListener('click',function(){var id=(a.closest('.fd-panel')||{}).id||''; window.cqPreset(id.replace('fd-',''))})});
  })();


  /* Replace emoji icons with clean line SVG icons across the whole site */
  (function(){
    var P={"search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M21 21l-4.3-4.3\"/>", "bot": "<rect x=\"4\" y=\"8\" width=\"16\" height=\"12\" rx=\"3\"/><path d=\"M12 8V4M9 13v1M15 13v1M9 17h6\"/>", "trend": "<path d=\"M3 17l6-6 4 4 8-9\"/><path d=\"M15 6h6v6\"/>", "pen": "<path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z\"/>", "globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18\"/>", "phone": "<rect x=\"7\" y=\"2\" width=\"10\" height=\"20\" rx=\"2.5\"/><path d=\"M11 18h2\"/>", "gear": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z\"/>", "chart": "<path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/>", "link": "<path d=\"M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1\"/><path d=\"M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1\"/>", "target": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\"/>", "cart": "<circle cx=\"9\" cy=\"20\" r=\"1.4\"/><circle cx=\"18\" cy=\"20\" r=\"1.4\"/><path d=\"M2 3h3l2.7 12.4a2 2 0 002 1.6h7.7a2 2 0 002-1.5L21 8H6\"/>", "palette": "<path d=\"M12 3a9 9 0 100 18c1.4 0 2-1 1.6-2-.4-1 .2-2 1.4-2H17a4 4 0 004-4c0-5-4-10-9-10z\"/><circle cx=\"8\" cy=\"11\" r=\"1\"/><circle cx=\"12\" cy=\"7.5\" r=\"1\"/><circle cx=\"16\" cy=\"11\" r=\"1\"/>", "wrench": "<path d=\"M14.7 6.3a4 4 0 005 5L21 13l-8 8a2.8 2.8 0 01-4-4l8-8z\"/><path d=\"M14.7 6.3L12 3l-2 2 2.7 2.7\"/>", "doc": "<path d=\"M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z\"/><path d=\"M14 3v5h5M9 13h6M9 17h6\"/>", "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 7l9 6 9-6\"/>", "bolt": "<path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/>", "bank": "<path d=\"M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18\"/>", "brief": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18\"/>", "factory": "<path d=\"M3 21V10l6 4V10l6 4V6h6v15z\"/><path d=\"M7 17h2M13 17h2M18 17h1\"/>", "laptop": "<rect x=\"4\" y=\"5\" width=\"16\" height=\"11\" rx=\"2\"/><path d=\"M2 20h20\"/>", "compass": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M15.5 8.5L13.5 13.5 8.5 15.5 10.5 10.5z\"/>", "health": "<path d=\"M12 21s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z\"/><path d=\"M12 9v6M9 12h6\"/>", "scale": "<path d=\"M12 3v18M5 21h14M5 7h14M5 7l-3 7a3.5 3.5 0 006 0zM19 7l-3 7a3.5 3.5 0 006 0z\"/>", "truck": "<path d=\"M2 6h12v10H2zM14 10h4l4 3v3h-8\"/><circle cx=\"7\" cy=\"18\" r=\"1.8\"/><circle cx=\"18\" cy=\"18\" r=\"1.8\"/>", "home": "<path d=\"M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6\"/>", "gem": "<path d=\"M6 3h12l4 6-10 12L2 9z\"/><path d=\"M2 9h20M9 3l3 6 3-6M12 21L9 9M12 21l3-12\"/>", "cap": "<path d=\"M2 9l10-5 10 5-10 5z\"/><path d=\"M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5\"/>", "users": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6\"/>", "ruler": "<path d=\"M3 17L17 3l4 4L7 21z\"/><path d=\"M8 12l2 2M11 9l2 2M14 6l2 2\"/>", "flask": "<path d=\"M9 3h6M10 3v6L4.5 19a1.8 1.8 0 001.6 2.5h11.8a1.8 1.8 0 001.6-2.5L14 9V3\"/><path d=\"M7.5 15h9\"/>", "handshake": "<path d=\"M2 12l5-5 4 2 4-2 5 5-9 8z\"/><path d=\"M12 20l-3-3M15 17l-2-2\"/>", "cog": "<path d=\"M21 12a9 9 0 11-3-6.7M21 4v5h-5\"/>", "headset": "<path d=\"M4 14v-2a8 8 0 0116 0v2\"/><rect x=\"2\" y=\"14\" width=\"5\" height=\"6\" rx=\"2\"/><rect x=\"17\" y=\"14\" width=\"5\" height=\"6\" rx=\"2\"/>", "news": "<path d=\"M4 4h13a2 2 0 012 2v14H6a2 2 0 01-2-2zM19 8h2v10a2 2 0 01-2 2M8 8h7M8 12h7M8 16h4\"/>", "build": "<path d=\"M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6\"/>", "spark": "<path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z\"/>"}, E={"🔍": "search", "🤖": "bot", "📈": "trend", "✍": "pen", "🌐": "globe", "🌍": "globe", "📱": "phone", "⚙": "gear", "📊": "chart", "🔗": "link", "🎯": "target", "🛒": "cart", "🛍": "cart", "🎨": "palette", "🔧": "wrench", "📄": "doc", "📝": "doc", "📋": "doc", "📧": "mail", "⚡": "bolt", "🏦": "bank", "💼": "brief", "🏭": "factory", "💻": "laptop", "🖥": "laptop", "🧭": "compass", "🩺": "health", "⚖": "scale", "🚚": "truck", "🚢": "truck", "🏠": "home", "💎": "gem", "🎓": "cap", "📐": "ruler", "🔬": "flask", "🤝": "handshake", "🔄": "cog", "🎧": "headset", "📰": "news", "🏗": "build", "🍽": "home"};
    document.querySelectorAll('.svc-mini-icon,.service-row-icon,.card-icon,.value-icon,.vz-emo').forEach(function(n){
      var t=(n.textContent||'').trim(); if(!t||n.querySelector('svg')) return;
      var k=null; for(var c in E){ if(t.indexOf(c)===0){k=E[c];break} }
      n.innerHTML='<svg class="ico-svg" viewBox="0 0 24 24" aria-hidden="true">'+P[k||'spark']+'</svg>'; n.setAttribute('aria-hidden','true');
    });
  })();

})();
