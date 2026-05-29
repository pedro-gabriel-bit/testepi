document.addEventListener('DOMContentLoaded', () => {

  const toggleBtn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu');
  const closeBtn = document.querySelector('.close-menu');

  if (!toggleBtn || !nav) return;

  // cria overlay
  let overlay = document.querySelector('.nav-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    nav.classList.add('active');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('active');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // abrir menu
  toggleBtn.addEventListener('click', toggleMenu);

  // fechar no X
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // clicar fora fecha
  overlay.addEventListener('click', closeMenu);

  // clicar em link fecha
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

});