// Project modal carousel
(() => {
	const modal = document.getElementById('project-modal');
	const slidesContainer = document.getElementById('modal-slides');
	const titleEl = document.getElementById('modal-title');
	const indicator = document.getElementById('slide-indicator');
	const closeBtn = document.getElementById('modal-close');
	const liveBtn = document.getElementById('modal-live');

	let images = [];
	let current = 0;
	const thumbsContainer = document.getElementById('modal-thumbs');

	function openProject(btn) {
		const title = btn.dataset.title || '';
		const raw = btn.dataset.images || '';
		const list = raw.split(',').map(s => s.trim()).filter(Boolean);
		images = list;
		current = 0;
		titleEl.textContent = title;
		renderSlides();
		renderThumbs();
		updateIndicator();
		modal.classList.remove('hidden');
		document.documentElement.style.overflow = 'hidden';
	}

	function closeProject() {
		modal.classList.add('hidden');
		document.documentElement.style.overflow = '';
		slidesContainer.innerHTML = '';
		images = [];
		current = 0;
	}

	function renderSlides() {
		slidesContainer.innerHTML = '';
		images.forEach((src, i) => {
			const el = document.createElement('img');
			el.src = src;
			el.alt = `${titleEl.textContent} — ${i + 1}`;
			el.className = 'max-h-full max-w-full object-contain';
			el.style.display = i === current ? 'block' : 'none';
			slidesContainer.appendChild(el);
		});
	}

	function renderThumbs() {
		if (!thumbsContainer) return;
		thumbsContainer.innerHTML = '';
		images.forEach((src, i) => {
			const t = document.createElement('img');
			t.src = src;
			t.alt = `${titleEl.textContent} thumb ${i+1}`;
			t.className = 'h-16 w-24 object-cover rounded-md cursor-pointer border-2 border-transparent';
			t.style.opacity = i === current ? '1' : '0.7';
			t.addEventListener('click', (e) => { e.stopPropagation(); showIndex(i); });
			thumbsContainer.appendChild(t);
		});
		updateThumbsActive();
	}

	function showIndex(i) {
		if (!images.length) return;
		current = (i + images.length) % images.length;
		const imgs = slidesContainer.querySelectorAll('img');
		imgs.forEach((img, idx) => img.style.display = idx === current ? 'block' : 'none');
		updateIndicator();
		updateThumbsActive();
	}

	function updateIndicator() {
		indicator.textContent = images.length ? `${current + 1} / ${images.length}` : '0 / 0';
	}

	function updateThumbsActive() {
		if (!thumbsContainer) return;
		const thumbs = thumbsContainer.querySelectorAll('img');
		thumbs.forEach((t, idx) => {
			t.style.borderColor = idx === current ? '#4f46e5' : 'transparent';
			t.style.opacity = idx === current ? '1' : '0.7';
		});
	}

	// Wire buttons
	closeBtn.addEventListener('click', closeProject);

	// Close when clicking outside content
	modal.addEventListener('click', (e) => {
		if (e.target === modal) closeProject();
	});

	// Keyboard: only allow Escape to close (arrow navigation removed)
	document.addEventListener('keydown', (e) => {
		if (modal.classList.contains('hidden')) return;
		if (e.key === 'Escape') closeProject();
	});

	// Attach to view buttons
	document.querySelectorAll('.open-project').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			if (!btn.dataset.images || !btn.dataset.images.trim()) {
				alert('No images provided for this project. Add a data-images attribute with comma-separated image paths.');
				return;
			}
			openProject(btn);
		});
	});

})();

// ===== Dark Mode Toggle =====
(() => {
	const themeToggle = document.getElementById('theme-toggle');
	if (!themeToggle) return; // Exit if button doesn't exist
	
	const sunIcon = document.getElementById('sun-icon');
	const moonIcon = document.getElementById('moon-icon');
	const html = document.documentElement;

	// Check saved theme preference or use system preference
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const isDark = savedTheme === 'dark' ? true : (savedTheme === 'light' ? false : prefersDark);

	// Apply theme on load
	if (isDark) {
		html.classList.add('dark');
		if (sunIcon && moonIcon) {
			sunIcon.classList.add('hidden');
			moonIcon.classList.remove('hidden');
		}
	} else {
		html.classList.remove('dark');
		if (sunIcon && moonIcon) {
			sunIcon.classList.remove('hidden');
			moonIcon.classList.add('hidden');
		}
	}

	// Theme toggle handler
	themeToggle.addEventListener('click', () => {
		html.classList.toggle('dark');
		const isDarkNow = html.classList.contains('dark');
		localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
		
		// Update icons
		if (sunIcon && moonIcon) {
			if (isDarkNow) {
				sunIcon.classList.add('hidden');
				moonIcon.classList.remove('hidden');
			} else {
				sunIcon.classList.remove('hidden');
				moonIcon.classList.add('hidden');
			}
		}
	});
})();

// ===== Back to Top Button =====
(() => {
	const backToTopBtn = document.getElementById('back-to-top');
	if (!backToTopBtn) return; // Exit if button doesn't exist

	window.addEventListener('scroll', () => {
		if (window.pageYOffset > 300) {
			backToTopBtn.classList.add('visible');
		} else {
			backToTopBtn.classList.remove('visible');
		}
	});

	backToTopBtn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
})();

// ===== Contact Form Handler =====
(() => {
	const contactForm = document.getElementById('contact-form');
	const formMessage = document.getElementById('form-message');

	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();

			const name = document.getElementById('name').value.trim();
			const email = document.getElementById('email').value.trim();
			const message = document.getElementById('message').value.trim();

			// Validation
			if (!name || !email || !message) {
				formMessage.textContent = 'Please fill out all fields.';
				formMessage.style.color = '#dc2626';
				return;
			}

			if (!email.includes('@')) {
				formMessage.textContent = 'Please enter a valid email address.';
				formMessage.style.color = '#dc2626';
				return;
			}

			// Show success message
			formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
			formMessage.style.color = '#16a34a';

			// Reset form
			contactForm.reset();

			// Clear message after 5 seconds
			setTimeout(() => {
				formMessage.textContent = '';
			}, 5000);
		});
	}
})();

// ===== Fade-in on Scroll (Intersection Observer) =====
(() => {
	// For browsers that don't support animation-timeline
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1 });

	document.querySelectorAll('.fade-in-element').forEach((el) => {
		observer.observe(el);
	});
})();

// ===== Smooth Link Navigation =====
(() => {
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if (href === '#') return;

			const target = document.querySelector(href);
			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});
})();



