/**
 * SUNSTONE VALLEY COMFORT CO. - CORE JAVASCRIPT
 * Ultra-fast vanilla JS (No heavy libraries, 60 FPS Smooth Scroll & Form Handler)
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Smooth Scroll with Header Offset
  const links = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');

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

  // 2. Web3Forms Asynchronous AJAX Handler
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
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          quoteForm.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">✅</div>
              <h3 style="color: var(--primary-navy); margin-bottom: 0.5rem;">Request Received!</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem;">Our Phoenix emergency dispatcher is reviewing your ticket and will call you within 10 minutes.</p>
              <a href="tel:5550148" class="btn btn-primary" style="margin-top: 1.25rem;">Call Now: (555) 0148</a>
            </div>
          `;
        } else {
          throw new Error('Form response not ok');
        }
      } catch (err) {
        // Fallback for demo without valid access key
        alert('Notice: Fictional demo site. In production, this instantly notifies your dispatcher via Web3Forms API!');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

});