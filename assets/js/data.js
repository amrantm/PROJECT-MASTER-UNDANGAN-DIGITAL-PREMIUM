/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   DATA LOADER ENGINE
   FASE 2.9
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. DATA ENGINE
       ===================================================== */

    const DataEngine = {

        initialized: false,

        loaded: false,

        data: null,

        error: null,

        source:
            "data/invitation.json"

    };


    /* =====================================================
       02. INITIALIZE
       ===================================================== */

    DataEngine.init = async function () {

        if (this.initialized) {
            return this.data;
        }


        this.initialized = true;


        try {

            await this.load();

            this.validate();

            this.apply();

            this.dispatchReady();

            return this.data;

        } catch (error) {

            this.error =
                error;

            console.error(
                "Data Engine Error:",
                error
            );

            this.dispatchError(
                error
            );

            return null;

        }

    };


    /* =====================================================
       03. LOAD JSON
       ===================================================== */

    DataEngine.load = async function () {

        const response =
            await fetch(
                this.source,
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Gagal memuat ${this.source}. HTTP ${response.status}`
            );

        }


        const json =
            await response.json();


        this.data =
            json;


        this.loaded =
            true;


        return this.data;

    };


    /* =====================================================
       04. VALIDATE
       ===================================================== */

    DataEngine.validate = function () {

        if (!this.data) {

            throw new Error(
                "Data undangan kosong."
            );

        }


        const requiredPaths = [

            "project",

            "event",

            "couple",

            "couple.bride",

            "couple.groom",

            "date",

            "venue",

            "contact",

            "music",

            "guest",

            "theme"

        ];


        const missing = [];


        requiredPaths.forEach(
            function (path) {

                const value =
                    DataEngine.get(
                        path
                    );


                if (
                    value === undefined ||
                    value === null
                ) {

                    missing.push(
                        path
                    );

                }

            }
        );


        if (missing.length) {

            console.warn(
                "Data undangan memiliki field yang belum tersedia:",
                missing
            );

        }


        return true;

    };


    /* =====================================================
       05. GET DATA BY PATH
       ===================================================== */

    DataEngine.get = function (
        path,
        fallback = null
    ) {

        if (
            !this.data ||
            !path
        ) {

            return fallback;

        }


        const parts =
            path.split(".");


        let current =
            this.data;


        for (
            let i = 0;
            i < parts.length;
            i++
        ) {

            if (
                current === undefined ||
                current === null
            ) {

                return fallback;

            }


            current =
                current[
                    parts[i]
                ];

        }


        if (
            current === undefined ||
            current === null
        ) {

            return fallback;

        }


        return current;

    };


    /* =====================================================
       06. SET DATA
       ===================================================== */

    DataEngine.set = function (
        path,
        value
    ) {

        if (!this.data) {
            return false;
        }


        const parts =
            path.split(".");


        let current =
            this.data;


        for (
            let i = 0;
            i < parts.length - 1;
            i++
        ) {

            if (
                typeof current[
                    parts[i]
                ] !== "object"
            ) {

                current[
                    parts[i]
                ] = {};

            }


            current =
                current[
                    parts[i]
                ];

        }


        current[
            parts[parts.length - 1]
        ] = value;


        return true;

    };


    /* =====================================================
       07. APPLY DATA TO HTML
       ===================================================== */

    DataEngine.apply = function () {

        if (!this.data) {
            return;
        }


        /*
         * Elemen HTML dengan:
         *
         * data-bind="couple.bride.name"
         *
         * otomatis diisi.
         */

        const elements =
            document.querySelectorAll(
                "[data-bind]"
            );


        elements.forEach(
            function (element) {

                const path =
                    element.getAttribute(
                        "data-bind"
                    );


                const value =
                    DataEngine.get(
                        path,
                        ""
                    );


                if (
                    value === null ||
                    value === undefined
                ) {

                    return;

                }


                DataEngine.setElementValue(
                    element,
                    value
                );

            }
        );


        /*
         * Elemen dengan:
         *
         * data-bind-attr
         *
         * contoh:
         *
         * data-bind-attr="href:venue.mapUrl"
         */

        const attributeElements =
            document.querySelectorAll(
                "[data-bind-attr]"
            );


        attributeElements.forEach(
            function (element) {

                DataEngine.applyAttributes(
                    element
                );

            }
        );


        /*
         * Elemen section yang
         * dikontrol oleh JSON.
         */

        this.applySections();


        /*
         * Tema.
         */

        this.applyTheme();


        /*
         * Meta halaman.
         */

        this.applyMeta();

    };


    /* =====================================================
       08. SET ELEMENT VALUE
       ===================================================== */

    DataEngine.setElementValue =
        function (
            element,
            value
        ) {

            /*
             * Input / textarea
             */

            if (
                element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA"
            ) {

                element.value =
                    value;

                return;

            }


            /*
             * Select
             */

            if (
                element.tagName === "SELECT"
            ) {

                element.value =
                    value;

                return;

            }


            /*
             * Gambar
             */

            if (
                element.tagName === "IMG"
            ) {

                element.setAttribute(
                    "src",
                    value
                );

                return;

            }


            /*
             * Semua elemen biasa.
             */

            element.textContent =
                value;

        };


    /* =====================================================
       09. APPLY ATTRIBUTES
       ===================================================== */

    DataEngine.applyAttributes =
        function (
            element
        ) {

            const definition =
                element.getAttribute(
                    "data-bind-attr"
                );


            if (!definition) {
                return;
            }


            const pairs =
                definition.split("|");


            pairs.forEach(
                function (pair) {

                    const parts =
                        pair.split(":");


                    if (
                        parts.length < 2
                    ) {

                        return;

                    }


                    const attribute =
                        parts[0].trim();


                    const path =
                        parts
                            .slice(1)
                            .join(":")
                            .trim();


                    const value =
                        DataEngine.get(
                            path,
                            ""
                        );


                    if (
                        value !== null &&
                        value !== undefined
                    ) {

                        element.setAttribute(
                            attribute,
                            value
                        );

                    }

                }
            );

        };


    /* =====================================================
       10. APPLY SECTIONS
       ===================================================== */

    DataEngine.applySections =
        function () {

            const sections =
                this.get(
                    "sections",
                    {}
                );


            Object.keys(
                sections
            ).forEach(
                function (sectionName) {

                    const enabled =
                        sections[
                            sectionName
                        ];


                    const elements =
                        document.querySelectorAll(
                            `[data-section="${sectionName}"]`
                        );


                    elements.forEach(
                        function (element) {

                            if (enabled) {

                                element.classList.remove(
                                    "section-disabled"
                                );

                                element.removeAttribute(
                                    "hidden"
                                );

                            } else {

                                element.classList.add(
                                    "section-disabled"
                                );

                                element.setAttribute(
                                    "hidden",
                                    "hidden"
                                );

                            }

                        }
                    );

                }
            );

        };


    /* =====================================================
       11. APPLY THEME
       ===================================================== */

    DataEngine.applyTheme =
        function () {

            const theme =
                this.get(
                    "theme",
                    {}
                );


            const root =
                document.documentElement;


            if (
                theme.primaryColor
            ) {

                root.style.setProperty(
                    "--color-primary",
                    theme.primaryColor
                );

            }


            if (
                theme.secondaryColor
            ) {

                root.style.setProperty(
                    "--color-secondary",
                    theme.secondaryColor
                );

            }


            if (
                theme.backgroundColor
            ) {

                root.style.setProperty(
                    "--color-background",
                    theme.backgroundColor
                );

            }


            if (
                theme.textColor
            ) {

                root.style.setProperty(
                    "--color-text",
                    theme.textColor
                );

            }


            if (
                theme.accentColor
            ) {

                root.style.setProperty(
                    "--color-accent",
                    theme.accentColor
                );

            }


            if (
                theme.name
            ) {

                root.setAttribute(
                    "data-theme",
                    theme.name
                );

            }

        };


    /* =====================================================
       12. APPLY META
       ===================================================== */

    DataEngine.applyMeta =
        function () {

            const title =
                this.get(
                    "event.title",
                    "Undangan Digital"
                );


            document.title =
                title;


            const description =
                this.get(
                    "event.quote",
                    ""
                );


            const metaDescription =
                document.querySelector(
                    'meta[name="description"]'
                );


            if (
                metaDescription &&
                description
            ) {

                metaDescription.setAttribute(
                    "content",
                    description
                );

            }

        };


    /* =====================================================
       13. GET COUPLE
       ===================================================== */

    DataEngine.getCouple =
        function () {

            return {

                bride:
                    this.get(
                        "couple.bride",
                        {}
                    ),

                groom:
                    this.get(
                        "couple.groom",
                        {}

                    )

            };

        };


    /* =====================================================
       14. GET EVENT DATE
       ===================================================== */

    DataEngine.getEventDate =
        function () {

            return this.get(
                "date",
                {}
            );

        };


    /* =====================================================
       15. GET VENUE
       ===================================================== */

    DataEngine.getVenue =
        function () {

            return this.get(
                "venue",
                {}
            );

        };


    /* =====================================================
       16. GET MUSIC
       ===================================================== */

    DataEngine.getMusic =
        function () {

            return this.get(
                "music",
                {}
            );

        };


    /* =====================================================
       17. GET GALLERY
       ===================================================== */

    DataEngine.getGallery =
        function () {

            return this.get(
                "gallery.items",
                []
            );

        };


    /* =====================================================
       18. GET BANK ACCOUNTS
       ===================================================== */

    DataEngine.getBankAccounts =
        function () {

            return this.get(
                "gift.bankAccounts",
                []
            );

        };


    /* =====================================================
       19. GET RSVP
       ===================================================== */

    DataEngine.getRSVP =
        function () {

            return this.get(
                "rsvp",
                {}
            );

        };


    /* =====================================================
       20. GET CONTACT
       ===================================================== */

    DataEngine.getContact =
        function () {

            return this.get(
                "contact",
                {}
            );

        };


    /* =====================================================
       21. GET COUNTDOWN
       ===================================================== */

    DataEngine.getCountdown =
        function () {

            return this.get(
                "countdown",
                {}
            );

        };


    /* =====================================================
       22. GET THEME
       ===================================================== */

    DataEngine.getTheme =
        function () {

            return this.get(
                "theme",
                {}
            );

        };


    /* =====================================================
       23. CHECK SECTION
       ===================================================== */

    DataEngine.isSectionEnabled =
        function (
            section
        ) {

            return this.get(
                `sections.${section}`,
                false
            ) === true;

        };


    /* =====================================================
       24. READY EVENT
       ===================================================== */

    DataEngine.dispatchReady =
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "data:ready",
                    {
                        detail: {
                            data:
                                this.data
                        }
                    }
                )
            );

        };


    /* =====================================================
       25. ERROR EVENT
       ===================================================== */

    DataEngine.dispatchError =
        function (
            error
        ) {

            document.dispatchEvent(
                new CustomEvent(
                    "data:error",
                    {
                        detail: {
                            error:
                                error
                        }
                    }
                )
            );

        };


    /* =====================================================
       26. PUBLIC API
       ===================================================== */

    window.InvitationData =
        DataEngine;


    /* =====================================================
       27. DOM READY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            DataEngine.init();

        }
    );


})();
