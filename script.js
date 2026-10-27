// БЕТОН — script.js
document.addEventListener('DOMContentLoaded', () => {

    // localStorage може да фрли грешка (приватен режим), па го чуваме безбедно
    const store = {
        get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
    };

    const $ = id => document.getElementById(id);
    const header = $('siteHeader'), burger = $('burger'), mobileNav = $('mobileNav'), backToTop = $('backToTop');

    /* ---------- Мобилно мени ---------- */
    function closeMenu() {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }
    burger.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
        document.body.classList.toggle('no-scroll', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });

    /* ---------- Скрол: сенка, копче нагоре, активен линк ---------- */
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('.main-nav a')];

    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 20);
        backToTop.classList.toggle('visible', y > 600);
        let current = '';
        sections.forEach(s => { if (y + 120 >= s.offsetTop) current = s.id; });
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ---------- Табови во менито ---------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    tabBtns.forEach(btn => btn.addEventListener('click', () => {
        tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    }));

    /* ---------- Јазик MK / EN ---------- */
    let lang = store.get('beton-lang') === 'en' ? 'en' : 'mk';

    function applyLang() {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-mk][data-en]').forEach(el => {
            el.textContent = lang === 'mk' ? el.dataset.mk : el.dataset.en;
        });
        $('langToggle').textContent = lang === 'mk' ? 'MK / EN' : 'EN / MK';
        updateOpenBadge();
    }
    $('langToggle').addEventListener('click', () => {
        lang = lang === 'mk' ? 'en' : 'mk';
        store.set('beton-lang', lang);
        applyLang();
    });

    /* ---------- Отворено / Затворено ---------- */
    function updateOpenBadge() {
        const badge = $('openBadge');
        const h = new Date().getHours();
        const open = h >= 7 && h < 22;
        badge.classList.toggle('closed', !open);
        badge.textContent = open
            ? (lang === 'mk' ? 'Отворено сега · до 22:00' : 'Open now · until 10pm')
            : (lang === 'mk' ? 'Затворено · отвораме во 07:00' : 'Closed · opens at 7am');
    }
    applyLang();

    /* ---------- Cookies ---------- */
    const banner = $('cookieBanner');
    if (!store.get('beton-cookies')) setTimeout(() => banner.classList.add('visible'), 800);
    ['Accept', 'Decline'].forEach(type => {
        $('cookie' + type).addEventListener('click', () => {
            store.set('beton-cookies', type === 'Accept' ? 'accepted' : 'declined');
            banner.classList.remove('visible');
        });
    });

    /* ---------- Контакт форма (демо, само front-end) ---------- */
    const form = $('contactForm'), note = $('formNote');
    form.addEventListener('submit', e => {
        e.preventDefault();
        note.textContent = lang === 'mk'
            ? 'Ви благодариме! Ќе ви одговориме наскоро.'
            : "Thank you! We'll get back to you soon.";
        form.reset();
        setTimeout(() => { note.textContent = ''; }, 6000);
    });

    /* ---------- Појавување при скрол ---------- */
    const targets = document.querySelectorAll('.section-inner, .hero-content');
    if ('IntersectionObserver' in window) {
        targets.forEach(el => el.classList.add('reveal'));
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('reveal-in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.08 });
        targets.forEach(el => io.observe(el));
    }
});