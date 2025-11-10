/**
 * services.js
 * Interactividad para la página de servicios
 */

// Tabs de servicios
function initServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const contents = document.querySelectorAll('.service-tab-content');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('service-tab--active'));
      contents.forEach(c => c.classList.remove('service-tab-content--active'));

      // Add active class to clicked tab and corresponding content
      tab.classList.add('service-tab--active');
      contents[index].classList.add('service-tab-content--active');
    });
  });
}

// Animaciones al hacer scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');

        // Para los items del timeline, agregar delay progresivo
        if (entry.target.classList.contains('timeline-item')) {
          const items = document.querySelectorAll('.timeline-item');
          const index = Array.from(items).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // Observar elementos con animación
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .timeline-item');
  elementsToAnimate.forEach(el => observer.observe(el));
}

// Animar números de stats
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-card__number');

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = entry.target;
        const finalValue = target.textContent.replace(/[^0-9]/g, '');
        const suffix = target.textContent.replace(/[0-9]/g, '');
        const duration = 2000; // 2 segundos
        const increment = finalValue / (duration / 16); // 60fps
        let current = 0;

        const updateNumber = () => {
          current += increment;
          if (current < finalValue) {
            target.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateNumber);
          } else {
            target.textContent = finalValue + suffix;
            target.dataset.animated = 'true';
          }
        };

        updateNumber();
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => observer.observe(stat));
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initServiceTabs();
  initScrollAnimations();
  animateStats();
});
