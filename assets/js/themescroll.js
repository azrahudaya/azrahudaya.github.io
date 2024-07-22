$(function() {


    gsap.config({ trialWarn: false });
    console.clear();
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    let smoother = ScrollSmoother.create({ smooth: 2 });

    let masks;

    ScrollTrigger.create({
        trigger: "#smooth-content", // Change trigger to .line instead of .line span
        start: "top bottom",
        end: "bottom bottom",
        normalizeScroll: true,
        ignoreMobileResize: true,
        refreshPriority: -1,
        scrub: 1 // Adjust this value to control animation speed (higher value for slower animation)
    });

    const btt = document.querySelector("#back-to-top");

    btt.addEventListener("click", () => gsap.to(window, { scrollTo: 0 }));
    gsap.set(btt, { y: 50 });

    gsap.to(btt, {
        y: 0,
        autoAlpha: 1,
        scrollTrigger: {
            trigger: "body",
            start: "top -20%",
            end: "top -20%",
            toggleActions: "play none reverse none"
        }
    });


    // Sticky Elements
    const stickyEls = document.querySelectorAll('.sticky-statement');
    const stickyEls2 = document.querySelectorAll('.sticky-statement2');
    const stickyEls3 = document.querySelectorAll('.sticky-statement3');
    const stickyEls4 = document.querySelectorAll('.sticky-statement4');
    const isMobile = () => window.innerWidth < 809;

    // stickyEls.forEach((panel, i) => {
    //     ScrollTrigger.create({
    //         trigger: panel,
    //         start: () => panel.offsetHeight < window.innerHeight ? "top 10%" : "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
    //         // start: "top top", // Pin from the top of the trigger element
    //         // end: "bottom bottom",
    //         pin: true,
    //         pinSpacing: true,
    //         scrub: true,
    //     });
    // });

    // stickyEls2.forEach((panel, i) => {
    //     ScrollTrigger.create({
    //         trigger: panel,
    //         start: () => panel.offsetHeight < window.innerHeight ? "top 10%" : "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
    //         pin: true,
    //         pinSpacing: false,
    //         onUpdate: self => {
    //             if (self.direction === -1) { // Scroll direction is up
    //                 gsap.to(panel, { duration: 0.5, scale: 1, opacity: 1 }); // Scale back to original size
    //             } else {
    //                 gsap.to(panel, { duration: 0.5, scale: 0.3, opacity: 0 }); // Scale down
    //             }
    //         }
    //     });
    // });



    stickyEls.forEach((panel, i) => {
        gsap.to(panel, {
            y: () => panel.offsetHeight < window.innerHeight ? 0 : -(panel.offsetHeight - window.innerHeight),
            ease: "none",
            scrollTrigger: {
                trigger: panel,
                start: () => panel.offsetHeight < window.innerHeight ? "top 10%" : "bottom bottom",
                end: () => panel.offsetHeight < window.innerHeight ? "bottom 90%" : "bottom bottom",
                scrub: true,
                pin: !isMobile(),
                pinSpacing: false,
                invalidateOnRefresh: true
            }
        });
    });



    stickyEls.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            pin: !isMobile(),
            start: "top top+=100",
            end: "+=1000",
            markers: false
        });
    });
    stickyEls3.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            pin: !isMobile(),
            start: "top top+=100",
            end: "+=700",
            markers: false
        });
    });
    stickyEls4.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            pin: !isMobile(),
            start: "top top+=100",
            end: "+=1400",
            markers: false
        });
    });



    /* ===== Transform ===== */
    function ShowcaseOverlapping() {
        gsap.utils.toArray('.about-sec').forEach((pinnedSection) => {
            
            const transformTextsAnim = pinnedSection.querySelectorAll('.sticky-statement2');
            
            function setImagesProperties() {								
                gsap.set(transformTextsAnim, { height: window.innerHeight});	
            }
            
            setImagesProperties();
            
            window.addEventListener('resize', setImagesProperties);	
        
            transformTextsAnim.forEach((transformTextAnim, i, arr) => {
                    const durationMultiplier = arr.length - i - 1;
                    
                    
                    ScrollTrigger.create({
                        trigger: transformTextAnim,
                        start: function() {
                            const centerPin = (window.innerHeight - transformTextAnim.offsetHeight) / 2;
                            return "top +=" + centerPin;
                        },
                        end: function() {
                            const durationHeight = transformTextAnim.offsetHeight * durationMultiplier + (transformTextAnim.offsetHeight - transformTextAnim.offsetHeight)/2;
                            return "+=" + durationHeight;
                        },
                        pin: true,
                        pinSpacing: false,
                        scrub: true,
                    });
                    
                    const animationProperties = {
                        y: 500,
                        scale: 0.65,
                        opacity: 0,
                        zIndex: 0,
                        duration: 0.05,
                        ease: 0.05,
                        // ease: Linear.easeNone
                    };
                    
                    // animationProperties.filter = "blur(10px)";
                    
                    ScrollTrigger.create({
                        trigger: transformTextAnim,
                        start: function() {
                            const centerPin = (window.innerHeight - transformTextAnim.offsetHeight) / 2;
                            console.log('center pin' , centerPin);
                            return "top top";
                        },
                        end: function() {
                            const durationHeight = transformTextAnim.offsetHeight + (transformTextAnim.offsetHeight - transformTextAnim.offsetHeight) / 2;
                            return "+=" + durationHeight;
                        },
                        scrub: true,
                        animation: gsap.to(transformTextAnim, animationProperties),
                    });

            });
        
        });
        
    }
    if (!isMobile()) {
    
        ShowcaseOverlapping();
    }
    /* ===== Transform ===== */



    const allDivs = document.querySelectorAll('#smooth-content > div');
    allDivs.forEach(div => {
        gsap.fromTo(
            ".scaleDown", // Target element
            { scale: 1.4 }, // From: Start scale (1 means normal size)
            {
                scale: 1, // To: End scale (2 means zoomed in)
                ease: "none", // Animation ease (change as needed)
                scrollTrigger: {
                    trigger: div, // Trigger element
                    // start: "top top", // Trigger animation at the top of .full-image-sec
                    // end: "bottom top", // End animation at the top of .full-image-sec
                    scrub: true, // Smooth scrubbing effect
                    markers: false // Show ScrollTrigger markers (for debugging)
                },
                start: "top top", // Trigger at the top of .full-image-sec
                end: "bottom top", // End trigger at the top of .full-image-sec
            }
        );

    })
    // gsap.to(".scaleDown", {
    //     scale: 2, 
    //     scrollTrigger: {
    //         trigger: ".full-image-sec",
    //         // pin: ".container",
    //         scrub: true
    //     },
    //     start: "top top", // Trigger at the top of .full-image-sec
    //     end: "bottom top", // End trigger at the top of .full-image-sec
    //     scrub: true,
    // })
    
});