
document.addEventListener('DOMContentLoaded', ()=>{
  // nav buttons
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.bottom-nav .nav-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const t = b.getAttribute('data-target');
      showScreen(t);
    });
  });

  // menu items click (open links or pages)
  document.querySelectorAll('.menu-item').forEach(m=>{
    m.addEventListener('click', ()=>{
      const href = m.getAttribute('data-href');
      if(!href) return;
      if(href.startsWith('http')) window.open(href,'_blank');
      else window.location.href = href;
    });
  });

  showScreen('home');
  initCarousel();
  loadData();
});

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
  const el = document.getElementById(id);
  if(el) el.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

// carousel
function initCarousel(){
  const slides = document.querySelectorAll('.hero .slide');
  const dots = document.getElementById('dots');
  slides.forEach((s,i)=>{
    const d = document.createElement('div'); d.className='dot'; if(i===0) d.classList.add('active'); dots.appendChild(d);
  });
  let idx=0;
  function show(i){
    slides.forEach(s=>s.classList.remove('active'));
    slides[i].classList.add('active');
    document.querySelectorAll('.dot').forEach((d,di)=> d.classList.toggle('active', di===i));
  }
  show(0);
  setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 4000);
}

// load data: tdc, berita, podcasts
function loadData(){
  fetch('data/kegiatan.json').then(r=>r.json()).then(k=>{
    const list = document.getElementById('tdc-list');
    k.forEach(it=>{
      const c = document.createElement('div'); c.className='card'; c.innerHTML=`<div style="height:110px;background:#eaf4ff;border-radius:8px;margin-bottom:8px"></div><strong>${it.title}</strong><p class="muted">${it.date}</p>`;
      list.appendChild(c);
    });
  });
  fetch('data/berita.json').then(r=>r.json()).then(b=>{
    const container = document.getElementById('berita-list');
    b.forEach(it=>{
      const a = document.createElement('article'); a.innerHTML=`<h4>${it.title}</h4><time>${it.date}</time><p>${it.excerpt}</p>`; container.appendChild(a);
    });
  });
  fetch('data/podcasts.json').then(r=>r.json()).then(p=>{
    const pod = document.getElementById('pod-list');
    p.forEach(ep=>{
      const div = document.createElement('div'); div.className='pod-card'; div.innerHTML=`<img src="${ep.thumb}" alt=""><h4>${ep.title}</h4><button class="play-btn" data-src="${ep.src}">Play</button>`;
      pod.appendChild(div);
    });
    // attach play buttons
    document.querySelectorAll('.play-btn').forEach(btn=> btn.addEventListener('click', ()=>{
      const src = btn.getAttribute('data-src');
      openMedia(src);
    }));
  });
}

// media modal
function openMedia(src){
  const modal = document.getElementById('media-modal');
  const player = document.getElementById('media-player');
  const inner = document.querySelector('.modal-inner');
  // clear previous
  player.pause?.(); player.src=''; const container = inner.querySelector('.media-container'); if(container) container.innerHTML='';
  // detect youtube
  if(src.includes('youtube.com') || src.includes('youtu.be')){
    const idMatch = src.match(/(?:v=|youtu\.be\/)([\w-]+)/);
    const id = idMatch ? idMatch[1] : null;
    if(id){ container.innerHTML = `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen title="Video"></iframe>`; }
  } else if(src.includes('spotify.com')){
    // spotify embed
    container.innerHTML = `<iframe src="${src.replace('open.','embed.') }" width="100%" height="152" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  } else {
    // default to HTML5 video
    player.src = src; player.load();
  }
  modal.classList.remove('hidden');
  // accessibility: focus close button
  const close = document.getElementById('close-modal'); if(close) close.focus();
}

  const modal = document.getElementById('media-modal');
  const player = document.getElementById('media-player');
  player.src = src;
  modal.classList.remove('hidden');
}
document.getElementById('close-modal')?.addEventListener('click', ()=>{
  const modal = document.getElementById('media-modal');
  const player = document.getElementById('media-player');
  player.pause(); player.src=''; modal.classList.add('hidden');
});


// Register service worker for offline support
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js').catch(e=>console.warn('SW register failed',e));}



// Podcast tabs filter (All / Video / Audio)
function initPodcastTabs(){
  const container = document.getElementById('pod-list');
  if(!container) return;
  const tabsWrap = document.createElement('div'); tabsWrap.className='podcast-tabs';
  ['All','Video','Audio'].forEach(t=>{ const b=document.createElement('button'); b.className='podcast-tab'; b.textContent=t; b.addEventListener('click', ()=>{ document.querySelectorAll('.podcast-tab').forEach(x=>x.classList.remove('active')); b.classList.add('active'); filterPodcast(t); }); tabsWrap.appendChild(b); });
  container.parentNode.insertBefore(tabsWrap, container);
  // activate All
  tabsWrap.querySelector('button').classList.add('active');
}
function filterPodcast(type){
  const podCards = document.querySelectorAll('.pod-card');
  podCards.forEach(card=>{
    const src = card.querySelector('.play-btn')?.getAttribute('data-src') || '';
    if(type === 'All'){ card.style.display='block'; return; }
    if(type === 'Video' && (src.includes('.mp4') || src.includes('youtube') || src.includes('webm'))) card.style.display='block'; else if(type === 'Audio' && (src.endsWith('.mp3') || src.includes('spotify'))) card.style.display='block'; else card.style.display='none';
  });
}

// call initPodcastTabs after loading podcasts
document.addEventListener('DOMContentLoaded', ()=>{ initPodcastTabs(); });



// keyboard activation for menu items (Enter/Space)
document.addEventListener('keydown', function(e){
  if(e.key === 'Enter' || e.key === ' '){
    const el = document.activeElement;
    if(el && el.classList && el.classList.contains('menu-item')){ el.click(); e.preventDefault(); }
  }
});
