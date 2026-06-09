/* Geo-redirect: Spain & LATAM → /es/, everyone else stays on EN */
(function(){
  if (sessionStorage.getItem('geo-done')) return;
  sessionStorage.setItem('geo-done','1');
  const path = location.pathname;
  const isES = path.includes('/es/');
  if (isES) return; /* already on ES, do nothing */
  fetch('https://ipapi.co/json/')
    .then(r=>r.json())
    .then(d=>{
      const ES_COUNTRIES = ['ES','MX','AR','CO','CL','PE','VE','EC','BO','PY','UY','CR','PA','DO','GT','HN','SV','NI','CU','PR'];
      if (ES_COUNTRIES.includes(d.country_code)) {
        const file = location.pathname.split('/').pop() || 'index.html';
        /* map EN filename to ES */
        const map = {
          'index.html':'index.html','services.html':'servicios.html',
          'seo.html':'seo.html','llm.html':'llm.html','sea.html':'sea.html',
          'apps.html':'apps.html','automation.html':'automatizacion.html',
          'content.html':'contenido.html','web-design.html':'webs.html',
          'about.html':'nosotros.html','process.html':'proceso.html',
          'contact.html':'contacto.html'
        };
        location.replace('/es/' + (map[file] || 'index.html'));
      }
    })
    .catch(()=>{});
})();
