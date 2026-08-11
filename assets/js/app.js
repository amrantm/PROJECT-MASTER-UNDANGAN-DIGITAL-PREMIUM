/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   APP.JS
   Core Mobile Invitation Engine
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. GLOBAL APP
    ===================================================== */

    const App = {

        initialized: false,

        state: {
            opened: false,
            guestName: "",
            currentSlide: 0
        },

        config: {
            animationThreshold: 0.15,
            animationRootMargin: "0px 0px -10% 0px"
        }

    };


    /* =====================================================
       02. DOM READY
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            if (App.initialized) {
                return;
            }

            App.initialized = true;

            App.init();

        }
    );


    /* =====================================================
       03. INITIALIZE
    ===================================================== */

    App.init = function () {

        this.setViewportHeight();

        this.handleViewportResize();

        this.getGuestName();

        this.renderGuestName();

        this.setupAnimations();

        this.setupOpenInvitation();

        this.setupScrollTracking();

        this.setupImageLoading();

        this.setupExternalLinks();

        this.markInitialElements();

    };


    /* =====================================================
       04. VIEWPORT HEIGHT
    ===================================================== */

    App.setViewportHeight = function () {

        const vh =
            window.innerHeight * 0.01;

        document.documentElement
            .style
            .setProperty(
                "--vh",
                `${vh}px`
            );

    };


    /* =====================================================
       05. RESIZE
    ===================================================== */

    App.handleViewportResize = function () {

        let resizeTimer;

        window.addEventListener(
            "resize",
            function () {

                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(
                    function () {

                        App.setViewportHeight();

                    },
                    150
                );

            }
        );

    };


    /* =====================================================
       06. GET GUEST NAME
       URL:
       ?kpd=Bapak%20Budi
    ===================================================== */

    App.getGuestName = function () {

        const params =
            new URLSearchParams(
                window.location.search
            );

        let guest =
            params.get("kpd");


        if (!guest) {

            guest =
                params.get("to");

        }


        if (!guest) {

            guest =
                params.get("nama");

        }


        if (!guest) {

            this.state.guestName = "";

            return;

        }


        guest =
            guest
                .replace(/\+/g, " ")
                .trim();


        if (guest.length > 100) {

            guest =
                guest.substring(
                    0,
                    100
                );

        }


        this.state.guestName =
            guest;

    };


    /* =====================================================
       07. RENDER GUEST NAME
    ===================================================== */

    App.renderGuestName = function () {

        const elements =
            document.querySelectorAll(
                "[data-guest-name]"
            );


        if (!elements.length) {
            return;
        }


        const name =
            this.state.guestName;


        elements.forEach(
            function (element) {

                if (name) {

                    element.textContent =
                        name;

                } else {

                    element.textContent =
                        "Tamu Undangan";

                }

            }
        );


        const guestContainers =
            document.querySelectorAll(
                "[data-guest-container]"
            );


        guestContainers.forEach(
            function (container) {

                if (name) {

                    container.classList.add(
                        "has-guest"
                    );

                } else {

                    container.classList.remove(
                        "has-guest"
                    );

                }

            }
        );

    };


    /* =====================================================
       08. OPEN INVITATION
    ===================================================== */

    App.setupOpenInvitation = function () {

        const buttons =
            document.querySelectorAll(
                "[data-open-invitation]"
            );


        if (!buttons.length) {
            return;
        }


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        App.openInvitation();

                    }
                );

            }
        );

    };


    /* =====================================================
       09. OPEN ACTION
    ===================================================== */

App.openInvitation = function () {

    if (this.state.opened) {
        return;
    }

    this.state.opened = true;

    // Tandai body bahwa undangan sudah dibuka
    document.body.classList.add("invitation-open");

    // Ambil opening screen
    const opening = document.querySelector(".slide-opening");

    if (opening) {

        opening.classList.add("opening-complete");

        // Pastikan opening tidak lagi menghalangi
        setTimeout(function () {

            opening.style.pointerEvents = "none";

        }, 900);
    }

    // Aktifkan aplikasi
    const app = document.querySelector("#app");

    if (app) {
        app.classList.add("is-open");
    }

    // Aktifkan slide pertama
    this.startFirstSlide();

    // Event untuk module lain
    this.dispatchEvent(
        "invitation:opened"
    );
};


    /* =====================================================
       10. START FIRST SLIDE
    ===================================================== */

    App.startFirstSlide = function () {

        const slides =
            document.querySelectorAll(
                ".slide"
            );


        if (!slides.length) {
            return;
        }


        slides[0].classList.add(
            "slide-active"
        );


        this.animateElementsIn(
            slides[0]
        );

    };


    /* =====================================================
       11. INTERSECTION OBSERVER
    ===================================================== */

    App.setupAnimations = function () {

        const animatedElements =
            document.querySelectorAll(
                "[data-animation], .stagger, .gallery-item"
            );


        if (!animatedElements.length) {
            return;
        }


        if (
            !("IntersectionObserver" in window)
        ) {

            animatedElements.forEach(
                function (element) {

                    element.classList.add(
                        "is-visible"
                    );

                }
            );

            return;

        }


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                            } else {

                                /*
                                 * Jangan hapus is-visible.
                                 *
                                 * Dengan demikian animasi
                                 * tidak mengulang secara
                                 * berlebihan ketika user
                                 * scroll naik turun.
                                 */

                            }

                        }
                    );

                },
                {
                    threshold:
                        this.config.animationThreshold,

                    rootMargin:
                        this.config.animationRootMargin
                }
            );


        animatedElements.forEach(
            function (element) {

                observer.observe(
                    element
                );

            }
        );


        this.animationObserver =
            observer;

    };


    /* =====================================================
       12. ANIMATE ELEMENTS
    ===================================================== */

    App.animateElementsIn = function (
        container
    ) {

        if (!container) {
            return;
        }


        const elements =
            container.querySelectorAll(
                "[data-animation], .stagger, .gallery-item"
            );


        elements.forEach(
            function (element, index) {

                setTimeout(
                    function () {

                        element.classList.add(
                            "is-visible"
                        );

                    },
                    index * 90
                );

            }
        );

    };


    /* =====================================================
       13. INITIAL ELEMENTS
    ===================================================== */

    App.markInitialElements = function () {

        const opening =
            document.querySelector(
                ".slide-opening"
            );


        if (!opening) {
            return;
        }


        const elements =
            opening.querySelectorAll(
                "[data-animation], .stagger"
            );


        elements.forEach(
            function (element) {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    };


    /* =====================================================
       14. SCROLL TRACKING
    ===================================================== */

    App.setupScrollTracking = function () {

        const slides =
            document.querySelectorAll(
                ".slide"
            );


        if (!slides.length) {
            return;
        }


        if (
            !("IntersectionObserver" in window)
        ) {
            return;
        }


        const slideObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                const slide =
                                    entry.target;


                                const index =
                                    Array
                                        .from(slides)
                                        .indexOf(slide);


                                if (index >= 0) {

                                    App.state.currentSlide =
                                        index;

                                }


                                slide.classList.add(
                                    "slide-active"
                                );


                                App.animateElementsIn(
                                    slide
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.45
                }
            );


        slides.forEach(
            function (slide) {

                slideObserver.observe(
                    slide
                );

            }
        );


        this.slideObserver =
            slideObserver;

    };


    /* =====================================================
       15. IMAGE LOADING
    ===================================================== */

    App.setupImageLoading = function () {

        const images =
            document.querySelectorAll(
                "img"
            );


        images.forEach(
            function (image) {

                if (image.complete) {

                    image.classList.add(
                        "image-loaded"
                    );

                    return;

                }


                image.addEventListener(
                    "load",
                    function () {

                        image.classList.add(
                            "image-loaded"
                        );

                    }
                );


                image.addEventListener(
                    "error",
                    function () {

                        image.classList.add(
                            "image-error"
                        );

                    }
                );

            }
        );

    };


    /* =====================================================
       16. EXTERNAL LINKS
    ===================================================== */

    App.setupExternalLinks = function () {

        const links =
            document.querySelectorAll(
                "a[href]"
            );


        links.forEach(
            function (link) {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {
                    return;
                }


                if (
                    href.startsWith(
                        "https://"
                    ) ||
                    href.startsWith(
                        "http://"
                    )
                ) {

                    link.setAttribute(
                        "target",
                        "_blank"
                    );


                    link.setAttribute(
                        "rel",
                        "noopener noreferrer"
                    );

                }

            }
        );

    };


    /* =====================================================
       17. CUSTOM EVENT
    ===================================================== */

    App.dispatchEvent = function (
        eventName,
        detail = {}
    ) {

        document.dispatchEvent(
            new CustomEvent(
                eventName,
                {
                    detail: detail
                }
            )
        );

    };


    /* =====================================================
       18. PUBLIC API
    ===================================================== */

    window.InvitationApp =
        App;


})();
