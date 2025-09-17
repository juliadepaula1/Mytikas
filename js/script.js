document.addEventListener('DOMContentLoaded', function() {
  // ========== Loader ==========
  const loader = document.querySelector('.loader');
  
  if (loader) {
    loader.style.display = 'flex';
    window.addEventListener('load', function() {
      setTimeout(function() {
        loader.classList.add('fade-out');
        setTimeout(function() {
          loader.style.display = 'none';
        }, 500);
      }, 1000);
    });
  }

  // ========== Menu Mobile ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      const isExpanded = nav.classList.contains('active');
      menuToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.nav a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        }
        nav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.nav a').forEach(item => item.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // ========== Dark Mode ==========
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  
  if (darkModeToggle) {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedMode = localStorage.getItem('darkMode');
    
    if (storedMode === 'enabled' || (storedMode === null && userPrefersDark)) {
      enableDarkMode();
    }
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (localStorage.getItem('darkMode') === null) {
        e.matches ? enableDarkMode() : disableDarkMode();
      }
    });
    
    function toggleDarkMode() {
      body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
    }
    function enableDarkMode() {
      body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('darkMode', 'enabled');
    }
    function disableDarkMode() {
      body.classList.remove('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('darkMode', 'disabled');
    }
  }

  // ========== Smooth Scrolling ==========
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      if (!this.classList.contains('nav-link')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // ========== Sticky Header ==========
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('sticky', window.scrollY > 100);
    });
  }

  // ========== Back to Top Button ==========
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== Service Card Hover Effect ==========
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.removeEventListener('mousemove', handleCardMouseMove);
    card.removeEventListener('mouseleave', handleCardMouseLeave);
    card.addEventListener('mousemove', handleCardMouseMove);
    card.addEventListener('mouseleave', handleCardMouseLeave);
  });
  function handleCardMouseMove(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--mouse-x', `${x}px`);
    this.style.setProperty('--mouse-y', `${y}px`);
  }
  function handleCardMouseLeave() {
    this.style.setProperty('--mouse-x', '0px');
    this.style.setProperty('--mouse-y', '0px');
  }

  // ========== Form Submission ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    const submitBtn = document.getElementById('submit');
    const submitText = submitBtn.querySelector('.btn-text');
    const submitIcon = submitBtn.querySelector('i');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      formFields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
      }

      const originalText = submitText.textContent;
      const originalIconClass = submitIcon.className;

      submitBtn.disabled = true;
      submitText.textContent = 'Enviando...';
      submitIcon.className = 'fas fa-spinner fa-spin';

      setTimeout(function() {
        submitText.textContent = 'Enviado!';
        submitIcon.className = 'fas fa-check';
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.');

        setTimeout(function() {
          submitText.textContent = originalText;
          submitIcon.className = originalIconClass;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
    });

    function validateField(field) {
      const feedback = field.parentElement.querySelector('.form-feedback');
      if (field.required && !field.value.trim()) {
        if (feedback) feedback.textContent = 'Este campo é obrigatório';
        return false;
      }
      if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        if (feedback) feedback.textContent = 'Por favor, insira um email válido';
        return false;
      }
      if (feedback) feedback.textContent = '';
      return true;
    }
  }

  // ========== Efeito de Digitação ==========
  function typeEffect(element, speed) {
    const text = element.innerHTML;
    element.innerHTML = "";
    let i = 0;
    const timer = setInterval(function() {
      if (i < text.length) {
        element.append(text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) typeEffect(heroTitle, 100);

  // ========== Parallax Effect ==========
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
  });

  // ========== Animação de Cards ao Aparecer ==========
  const animateCards = function() {
    const cards = document.querySelectorAll('.service-card, .feature-box');
    cards.forEach(function(card, index) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
      setTimeout(function() {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    });
  };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        animateCards();
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-aos]').forEach(function(el) {
    observer.observe(el);
  });

  // ========== Lazy Loading ==========
  const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll('.lazy-load');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-load');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  };
  lazyLoadImages();

  // ========== Notification System ==========
  function showNotification(message, type = 'success') {
    const notification = document.querySelector('.notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = 'notification show';
    if (type === 'error') {
      notification.style.backgroundColor = 'var(--danger-color)';
    } else if (type === 'warning') {
      notification.style.backgroundColor = 'var(--warning-color)';
      notification.style.color = 'var(--dark-color)';
    } else {
      notification.style.backgroundColor = 'var(--success-color)';
    }
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // ========== Guided Tour ==========
  function startTour() {
    if (!localStorage.getItem('tourCompleted')) {
      setTimeout(() => {
        showNotification('Bem-vindo ao Mytikas! Explore nossos serviços premium.', 'success');
      }, 3000);
      localStorage.setItem('tourCompleted', 'true');
    }
  }
  startTour();
});

// Inicializar AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}

// Evitar erros caso algo chame função antiga
function handleFieldMouseMove() {}
