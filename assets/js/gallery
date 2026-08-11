/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   GALLERY ENGINE
   FASE 2.11
   MOBILE FIRST
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. GALLERY ENGINE
       ===================================================== */

    const Gallery = {

        initialized: false,

        loaded: false,

        items: [],

        currentIndex: 0,

        elements: {},

        touchStartX: 0,

        touchEndX: 0,

        touchStartY: 0,

        touchEndY: 0,

        animationTypes: [

            "fade",

            "zoom",

            "slide-left",

            "slide-right",

            "rotate",

            "kenburns"

        ]

    };


    /* =====================================================
       02. INITIALIZE
       ===================================================== */

    Gallery.init = function () {

        if (this.initialized) {
            return;
        }


        this.initialized = true;


        this.findElements();


        this.waitForData();

    };


    /* =====================================================
       03. WAIT FOR DATA
       ===================================================== */

    Gallery.waitForData = function () {

        if (
            window.InvitationData &&
            InvitationData.loaded
        ) {

            this.start();

            return;

        }


        document.addEventListener(
            "data:ready",
            function () {

                Gallery.start();

            },
            {
                once: true
            }
        );

    };


    /* =====================================================
       04. FIND ELEMENTS
       ===================================================== */

    Gallery.findElements = function () {

        this.elements.container =
            document.querySelector(
                "[data-gallery]"
            );


        this.elements.grid =
            document.querySelector(
                "[data-gallery-grid]"
            );


        this.elements.lightbox =
            document.querySelector(
                "[data-gallery-lightbox]"
            );


        this.elements.lightboxImage =
            document.querySelector(
                "[data-gallery-lightbox-image]"
            );


        this.elements.lightboxCaption =
            document.querySelector(
                "[data-gallery-lightbox-caption]"
            );


        this.elements.counter =
            document.querySelector(
                "[data-gallery-counter]"
            );


        this.elements.prev =
            document.querySelector(
                "[data-gallery-prev]"
            );


        this.elements.next =
            document.querySelector(
                "[data-gallery-next]"
            );


        this.elements.close =
            document.querySelector(
                "[data-gallery-close]"
            );

    };


    /* =====================================================
       05. START
       ===================================================== */

    Gallery.start = function () {

        if (
            !window.InvitationData
        ) {

            return;

        }


        const config =
            InvitationData.get(
                "gallery",
                {}
            );


        if (
            !config ||
            config.enabled === false
        ) {

            this.disable();

            return;

        }


        this.items =
            Array.isArray(
                config.items
            )
                ? config.items
                : [];


        if (
            this.items.length === 0
        ) {

            this.disable();

            return;

        }


        this.render();


        this.bindEvents();


        this.loaded =
            true;


        this.dispatchReady();

    };


    /* =====================================================
       06. RENDER GALLERY
       ===================================================== */

    Gallery.render = function () {

        if (
            !this.elements.grid
        ) {

            return;

        }


        this.elements.grid.innerHTML =
            "";


        this.items.forEach(
            function (
                item,
                index
            ) {

                const card =
                    Gallery.createCard(
                        item,
                        index
                    );


                Gallery.elements.grid
                    .appendChild(
                        card
                    );

            }
        );

    };


    /* =====================================================
       07. CREATE CARD
       ===================================================== */

    Gallery.createCard = function (
        item,
        index
    ) {

        const card =
            document.createElement(
                "button"
            );


        card.type =
            "button";


        card.className =
            "gallery-card";


        /*
         * Animasi berbeda
         * untuk setiap foto.
         */

        const animation =
            this.getAnimation(
                index
            );


        card.setAttribute(
            "data-gallery-animation",
            animation
        );


        card.setAttribute(
            "data-gallery-index",
            index
        );


        /*
         * Accessibility.
         */

        card.setAttribute(
            "aria-label",
            `Buka foto ${index + 1}`
        );


        /*
         * Wrapper gambar.
         */

        const imageWrapper =
            document.createElement(
                "span"
            );


        imageWrapper.className =
            "gallery-image-wrapper";


        /*
         * Gambar.
         */

        const image =
            document.createElement(
                "img"
            );


        image.className =
            "gallery-image";


        image.src =
            item.image || "";


        image.alt =
            item.alt ||
            `Foto ${index + 1}`;


        /*
         * Lazy loading.
         */

        image.loading =
            index === 0
                ? "eager"
                : "lazy";


        image.decoding =
            "async";


        /*
         * Tambahkan nomor
         * untuk kebutuhan animasi.
         */

        image.setAttribute(
            "data-gallery-image",
            index
        );


        imageWrapper.appendChild(
            image
        );


        /*
         * Overlay.
         */

        const overlay =
            document.createElement(
                "span"
            );


        overlay.className =
            "gallery-overlay";


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
         * Icon zoom.
         */

        const zoomIcon =
            document.createElement(
                "span"
            );


        zoomIcon.className =
            "gallery-zoom-icon";


        zoomIcon.innerHTML =
            "⌕";


        overlay.appendChild(
            zoomIcon
        );


        imageWrapper.appendChild(
            overlay
        );


        card.appendChild(
            imageWrapper
        );


        /*
         * Event klik.
         */

        card.addEventListener(
            "click",
            function () {

                Gallery.open(
                    index
                );

            }
        );


        return card;

    };


    /* =====================================================
       08. GET ANIMATION
       ===================================================== */

    Gallery.getAnimation = function (
        index
    ) {

        return this.animationTypes[
            index %
            this.animationTypes.length
        ];

    };


    /* =====================================================
       09. BIND EVENTS
       ===================================================== */

    Gallery.bindEvents = function () {

        /*
         * Previous
         */

        if (
            this.elements.prev
        ) {

            this.elements.prev.addEventListener(
                "click",
                function (
                    event
                ) {

                    event.preventDefault();

                    Gallery.previous();

                }
            );

        }


        /*
         * Next
         */

        if (
            this.elements.next
        ) {

            this.elements.next.addEventListener(
                "click",
                function (
                    event
                ) {

                    event.preventDefault();

                    Gallery.next();

                }
            );

        }


        /*
         * Close
         */

        if (
            this.elements.close
        ) {

            this.elements.close.addEventListener(
                "click",
                function (
                    event
                ) {

                    event.preventDefault();

                    Gallery.close();

                }
            );

        }


        /*
         * Klik area luar gambar
         * untuk menutup lightbox.
         */

        if (
            this.elements.lightbox
        ) {

            this.elements.lightbox.addEventListener(
                "click",
                function (
                    event
                ) {

                    if (
                        event.target ===
                        Gallery.elements.lightbox
                    ) {

                        Gallery.close();

                    }

                }
            );


            /*
             * Touch swipe.
             */

            this.elements.lightbox.addEventListener(
                "touchstart",
                function (
                    event
                ) {

                    Gallery.handleTouchStart(
                        event
                    );

                },
                {
                    passive: true
                }
            );


            this.elements.lightbox.addEventListener(
                "touchend",
                function (
                    event
                ) {

                    Gallery.handleTouchEnd(
                        event
                    );

                },
                {
                    passive: true
                }
            );

        }


        /*
         * Keyboard.
         */

        document.addEventListener(
            "keydown",
            function (
                event
            ) {

                if (
                    !Gallery.isOpen()
                ) {

                    return;

                }


                if (
                    event.key ===
                    "Escape"
                ) {

                    Gallery.close();

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    Gallery.previous();

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    Gallery.next();

                }

            }
        );

    };


    /* =====================================================
       10. OPEN
       ===================================================== */

    Gallery.open = function (
        index
    ) {

        if (
            index < 0 ||
            index >= this.items.length
        ) {

            return;

        }


        this.currentIndex =
            index;


        this.updateLightbox();


        if (
            !this.elements.lightbox
        ) {

            return;

        }


        this.elements.lightbox
            .removeAttribute(
                "hidden"
            );


        this.elements.lightbox
            .classList.add(
                "is-open"
            );


        document.body.classList.add(
            "gallery-open"
        );


        /*
         * Accessibility.
         */

        this.elements.lightbox
            .setAttribute(
                "aria-hidden",
                "false"
            );


        /*
         * Mencegah scroll halaman
         * ketika lightbox terbuka.
         */

        document.body.style.overflow =
            "hidden";


        this.dispatchChange();

    };


    /* =====================================================
       11. CLOSE
       ===================================================== */

    Gallery.close = function () {

        if (
            !this.elements.lightbox
        ) {

            return;

        }


        this.elements.lightbox
            .classList.remove(
                "is-open"
            );


        this.elements.lightbox
            .setAttribute(
                "aria-hidden",
                "true"
            );


        document.body.classList.remove(
            "gallery-open"
        );


        document.body.style.overflow =
            "";


        setTimeout(
            function () {

                if (
                    !Gallery.isOpen()
                ) {

                    Gallery.elements.lightbox
                        .setAttribute(
                            "hidden",
                            "hidden"
                        );

                }

            },
            250
        );


        this.dispatchClose();

    };


    /* =====================================================
       12. IS OPEN
       ===================================================== */

    Gallery.isOpen = function () {

        if (
            !this.elements.lightbox
        ) {

            return false;

        }


        return this.elements.lightbox
            .classList.contains(
                "is-open"
            );

    };


    /* =====================================================
       13. UPDATE LIGHTBOX
       ===================================================== */

    Gallery.updateLightbox = function () {

        const item =
            this.items[
                this.currentIndex
            ];


        if (!item) {

            return;

        }


        if (
            this.elements.lightboxImage
        ) {

            /*
             * Reset animasi.
             */

            this.elements.lightboxImage
                .className =
                "gallery-lightbox-image";


            void this.elements
                .lightboxImage
                .offsetWidth;


            /*
             * Animasi lightbox.
             */

            this.elements.lightboxImage
                .classList.add(
                    this.getAnimation(
                        this.currentIndex
                    )
                );


            this.elements.lightboxImage
                .src =
                item.image || "";


            this.elements.lightboxImage
                .alt =
                item.alt ||
                `Foto ${this.currentIndex + 1}`;

        }


        /*
         * Caption.
         */

        if (
            this.elements.lightboxCaption
        ) {

            this.elements.lightboxCaption
                .textContent =
                item.alt || "";

        }


        /*
         * Counter.
         */

        if (
            this.elements.counter
        ) {

            this.elements.counter
                .textContent =
                `${this.currentIndex + 1} / ${this.items.length}`;

        }


        /*
         * Tombol navigasi.
         */

        this.updateNavigation();

    };


    /* =====================================================
       14. UPDATE NAVIGATION
       ===================================================== */

    Gallery.updateNavigation = function () {

        if (
            this.elements.prev
        ) {

            this.elements.prev
                .disabled =
                this.items.length <= 1;

        }


        if (
            this.elements.next
        ) {

            this.elements.next
                .disabled =
                this.items.length <= 1;

        }

    };


    /* =====================================================
       15. NEXT
       ===================================================== */

    Gallery.next = function () {

        if (
            this.items.length <= 1
        ) {

            return;

        }


        this.currentIndex =
            (
                this.currentIndex + 1
            ) %
            this.items.length;


        this.updateLightbox();


        this.dispatchChange();

    };


    /* =====================================================
       16. PREVIOUS
       ===================================================== */

    Gallery.previous = function () {

        if (
            this.items.length <= 1
        ) {

            return;

        }


        this.currentIndex =
            (
                this.currentIndex - 1 +
                this.items.length
            ) %
            this.items.length;


        this.updateLightbox();


        this.dispatchChange();

    };


    /* =====================================================
       17. TOUCH START
       ===================================================== */

    Gallery.handleTouchStart =
        function (
            event
        ) {

            if (
                !event.touches ||
                !event.touches.length
            ) {

                return;

            }


            this.touchStartX =
                event.touches[0].clientX;


            this.touchStartY =
                event.touches[0].clientY;

        };


    /* =====================================================
       18. TOUCH END
       ===================================================== */

    Gallery.handleTouchEnd =
        function (
            event
        ) {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {

                return;

            }


            this.touchEndX =
                event.changedTouches[0].clientX;


            this.touchEndY =
                event.changedTouches[0].clientY;


            const deltaX =
                this.touchEndX -
                this.touchStartX;


            const deltaY =
                this.touchEndY -
                this.touchStartY;


            /*
             * Hanya dianggap swipe
             * jika gerakan horizontal
             * lebih dominan.
             */

            if (
                Math.abs(deltaX) <=
                Math.abs(deltaY)
            ) {

                return;

            }


            const threshold =
                50;


            if (
                deltaX < -threshold
            ) {

                this.next();

            }


            if (
                deltaX > threshold
            ) {

                this.previous();

            }

        };


    /* =====================================================
       19. DISABLE
       ===================================================== */

    Gallery.disable = function () {

        if (
            this.elements.container
        ) {

            this.elements.container
                .setAttribute(
                    "hidden",
                    "hidden"
                );

        }

    };


    /* =====================================================
       20. DISPATCH READY
       ===================================================== */

    Gallery.dispatchReady =
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "gallery:ready",
                    {
                        detail: {
                            items:
                                this.items.length
                        }
                    }
                )
            );

        };


    /* =====================================================
       21. DISPATCH CHANGE
       ===================================================== */

    Gallery.dispatchChange =
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "gallery:change",
                    {
                        detail: {

                            index:
                                this.currentIndex,

                            item:
                                this.items[
                                    this.currentIndex
                                ]

                        }
                    }
                )
            );

        };


    /* =====================================================
       22. DISPATCH CLOSE
       ===================================================== */

    Gallery.dispatchClose =
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "gallery:close"
                )
            );

        };


    /* =====================================================
       23. PUBLIC API
       ===================================================== */

    window.InvitationGallery =
        Gallery;


    /* =====================================================
       24. DOM READY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            Gallery.init();

        }
    );


})();
