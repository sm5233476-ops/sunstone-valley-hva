/**
 * SUNSTONE VALLEY COMFORT CO. - 60 FPS AWWWARDS ANIMATION ENGINE
 * Native Vanilla JS | GPU Composited | Zero Jank
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Frosted Glass Header on Scroll
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 2. Smooth Scroll with Exact Header Offset
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. 60 FPS Staggered Scroll Reveal (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Memory & GPU cleanup
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Silky Smooth Animated Counters (About Stats)
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 1800; // 1.8 seconds
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // EaseOutCubic deceleration curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.about-box');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsTriggered) {
          statsTriggered = true;
          animateCounters();
        }
      });
    }, { threshold: 0.35 });
    statsObserver.observe(statsSection);
  }

  // 5. Asynchronous Web3Forms Lead Dispatcher
  const quoteForm = document.querySelector('.quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = quoteForm.querySelector('.btn-submit');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Dispatching Request...';

      const formData = new FormData(quoteForm);
      try {
        const response = await fetch(quoteForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          quoteForm.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem; animation: heroFadeIn 0.5s ease;">
              <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">✅</div>
              <h3 style="color: var(--primary-navy); font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem;">Request Dispatched!</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">Our Phoenix emergency coordinator will call you within 10 minutes.</p>
              <a href="tel:5550148" class="btn btn-primary" style="margin-top: 1.25rem;">Direct Line: (555) 0148</a>
            </div>
          `;
        } else {
          throw new Error('API Error');
        }
      } catch (err) {
        alert('Demo Lead Captured! In production, this notifies your dispatcher instantly.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

});