document.addEventListener('DOMContentLoaded', () => {
    // 1. Registrar Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 2. Lenis Smooth Scroll (Experiência Amanteigada)
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // 3. Navbar Blend e Shrink
    const nav = document.querySelector('.nav-wrapper');
    let lastScroll = 0;
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 50) {
            nav.style.padding = "1.2rem 4vw";
            nav.style.background = "rgba(5, 4, 10, 0.85)";
            nav.style.backdropFilter = "blur(12px)";
        } else {
            nav.style.padding = "2rem 4vw";
            nav.style.background = "transparent";
            nav.style.backdropFilter = "none";
        }
    });

    // 4. Animação de Entrada: Hero Text Reveal
    const heroTextLines = document.querySelectorAll('.hero .gsap-reveal-text span');
    gsap.to(heroTextLines, {
        y: "0%",
        duration: 1.6,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.2
    });

    const heroFades = document.querySelectorAll('.hero .gsap-fade');
    gsap.fromTo(heroFades, {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.8
    });

    // 5. ScrollTrigger: Reveal Texts Gerais
    const textBlocks = document.querySelectorAll('section:not(.hero) .gsap-reveal-text');
    textBlocks.forEach(block => {
        const lines = block.querySelectorAll('span');
        gsap.to(lines, {
            y: "0%",
            duration: 1.5,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: {
                trigger: block,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 6. ScrollTrigger: Fade Genérico
    const fades = document.querySelectorAll('section:not(.hero) .gsap-fade');
    fades.forEach(fade => {
        gsap.fromTo(fade, {
            opacity: 0,
            y: 40
        }, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: fade,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 7. Imagens com Máscara Cinematográfica (Clip-Path)
    const clipImages = document.querySelectorAll('.gsap-clip-img');
    clipImages.forEach(img => {
        gsap.to(img, {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 2,
            ease: "power4.inOut",
            scrollTrigger: {
                trigger: img,
                start: "top 80%",
            }
        });

        // Leve efeito paralaxe na imagem para luxo
        gsap.fromTo(img, {
            scale: 1.1,
            y: -20
        }, {
            scale: 1,
            y: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
});
