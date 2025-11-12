
// app.js - navigation, splash hide, simple animations and accessibility
document.addEventListener('DOMContentLoaded', function(){
  // splash hide after small delay to simulate app loading
  setTimeout(()=>{
    const s = document.getElementById('splash');
    if(s){ s.style.opacity='0'; setTimeout(()=>s.remove(),600); }
  }, 700);

  // nav buttons
  document.querySelectorAll('.nav-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const t = b.getAttribute('data-target');
      navigate(t);
    });
  });

  // outline buttons
  document.querySelectorAll('[data-nav]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      navigate(btn.getAttribute('data-nav'));
    });
  });

  // support keyboard navigation
  document.addEventListener('keyup', (e)=>{
    if(e.key === '1') navigate('home');
    if(e.key === '2') navigate('profile');
    if(e.key === '3') navigate('programs');
    if(e.key === '4') navigate('news');
    if(e.key === '5') navigate('contact');
    if(e.key === 'n') navigate('news');
  });
});

function navigate(target){
  if(!target) return;
  document.querySelectorAll('.screen').forEach(s=> s.hidden = true);
  const el = document.getElementById(target);
  if(el){ el.hidden = false; el.scrollIntoView({behavior:'smooth'}); }
  document.querySelectorAll('.nav-btn').forEach(n=> n.classList.remove('active'));
  const active = document.querySelector('.nav-btn[data-target="'+target+'"]');
  if(active) active.classList.add('active');
}


// When navigating to news, focus first news item for keyboard users
document.addEventListener('navigation', function(e){
  const target = e.detail;
  if(target === 'news'){
    const list = document.querySelector('.news-list');
    if(list){
      const first = list.querySelector('.news-item');
      if(first){
        first.setAttribute('tabindex','0');
        first.focus();
        first.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  }
});

// Emit custom event from navigate()
const _navigate_orig = navigate;
function navigate(target){
  _navigate_orig(target);
  const ev = new CustomEvent('navigation',{detail:target});
  document.dispatchEvent(ev);
}


// Highlight bottom nav on load and ensure accessible labels
function highlightBottomNav(target){
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(n=> n.classList.remove('active'));
  const b = document.querySelector('.bottom-nav .nav-btn[data-target="'+target+'"]');
  if(b) b.classList.add('active');
}

// Initialize active to 'home' on load
document.addEventListener('DOMContentLoaded', function(){
  highlightBottomNav('home');
});

// Also update on navigate
document.addEventListener('navigation', function(e){
  highlightBottomNav(e.detail || 'home');
});
