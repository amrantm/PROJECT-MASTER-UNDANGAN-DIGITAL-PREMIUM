/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   GUEST PERSONALIZATION ENGINE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. GUEST ENGINE
    ===================================================== */

    const Guest = {

        initialized: false,

        name: "",

        defaultName:
            "Tamu Undangan"

    };


    /* =====================================================
       02. INITIALIZE
    ===================================================== */

    Guest.init = function () {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.readFromURL();

        this.render();

        this.createShareURL();

    };


    /* =====================================================
       03. READ NAME FROM URL
    ===================================================== */

    Guest.readFromURL = function () {

        const params =
            new URLSearchParams(
                window.location.search
            );


        /*
         * Parameter utama:
         *
         * ?kpd=Bapak%20Budi
         */

        let name =
            params.get("kpd");


        /*
         * Alternatif:
         *
         * ?to=Bapak%20Budi
         */

        if (!name) {

            name =
                params.get("to");

        }


        /*
         * Alternatif:
         *
         * ?nama=Bapak%20Budi
         */

        if (!name) {

            name =
                params.get("nama");

        }


        /*
         * Jika tidak ada nama,
         * gunakan default.
         */

        if (!name) {

            this.name =
                this.defaultName;

            return;

        }


        this.name =
            this.cleanName(name);

    };


    /* =====================================================
       04. CLEAN NAME
    ===================================================== */

    Guest.cleanName = function (name) {

        if (!name) {

            return this.defaultName;

        }


        let clean =
            String(name)
                .replace(/\+/g, " ")
                .replace(/\s+/g, " ")
                .trim();


        /*
         * Hilangkan karakter yang tidak
         * diperlukan untuk tampilan.
         */

        clean =
            clean.replace(
                /[<>]/g,
                ""
            );


        /*
         * Batasi panjang nama.
         */

        if (clean.length > 120) {

            clean =
                clean.substring(
                    0,
                    120
                );

        }


        if (!clean) {

            return this.defaultName;

        }


        return clean;

    };


    /* =====================================================
       05. GET NAME
    ===================================================== */

    Guest.getName = function () {

        return this.name ||
            this.defaultName;

    };


    /* =====================================================
       06. CHECK PERSONALIZED
    ===================================================== */

    Guest.isPersonalized = function () {

        return (
            this.name !==
            this.defaultName
        );

    };


    /* =====================================================
       07. RENDER GUEST NAME
    ===================================================== */

    Guest.render = function () {

        const name =
            this.getName();


        /*
         * Elemen:
         *
         * data-guest-name
         */

        const nameElements =
            document.querySelectorAll(
                "[data-guest-name]"
            );


        nameElements.forEach(
            function (element) {

                element.textContent =
                    name;

            }
        );


        /*
         * Elemen:
         *
         * data-guest-greeting
         */

        const greetingElements =
            document.querySelectorAll(
                "[data-guest-greeting]"
            );


        greetingElements.forEach(
            function (element) {

                element.textContent =
                    "Kepada Yth.";

            }
        );


        /*
         * Elemen:
         *
         * data-guest-full
         */

        const fullElements =
            document.querySelectorAll(
                "[data-guest-full]"
            );


        fullElements.forEach(
            function (element) {

                element.textContent =
                    `Kepada Yth. ${name}`;

            }
        );


        /*
         * Elemen:
         *
         * data-guest-container
         */

        const containers =
            document.querySelectorAll(
                "[data-guest-container]"
            );


        containers.forEach(
            function (container) {

                container.classList.add(
                    "guest-ready"
                );


                if (
                    this.isPersonalized()
                ) {

                    container.classList.add(
                        "guest-personalized"
                    );

                } else {

                    container.classList.add(
                        "guest-default"
                    );

                }

            }.bind(this)
        );


        /*
         * Simpan ke document
         * untuk kebutuhan script lain.
         */

        document.documentElement
            .setAttribute(
                "data-guest",
                name
            );

    };


    /* =====================================================
       08. CREATE PERSONAL URL
    ===================================================== */

    Guest.createShareURL = function () {

        const baseURL =
            window.location.origin +
            window.location.pathname;


        if (
            !this.isPersonalized()
        ) {

            this.shareURL =
                baseURL;

            return;

        }


        this.shareURL =
            baseURL +
            "?kpd=" +
            encodeURIComponent(
                this.name
            );


        /*
         * Elemen yang mempunyai:
         *
         * data-guest-url
         */

        const urlElements =
            document.querySelectorAll(
                "[data-guest-url]"
            );


        urlElements.forEach(
            function (element) {

                if (
                    element.tagName ===
                    "INPUT"
                ) {

                    element.value =
                        this.shareURL;

                } else {

                    element.setAttribute(
                        "href",
                        this.shareURL
                    );

                }

            }.bind(this)
        );

    };


    /* =====================================================
       09. GET SHARE URL
    ===================================================== */

    Guest.getShareURL = function () {

        return (
            this.shareURL ||
            window.location.href
        );

    };


    /* =====================================================
       10. COPY PERSONAL URL
    ===================================================== */

    Guest.copyURL = function () {

        const url =
            this.getShareURL();


        /*
         * Clipboard API
         */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            return navigator.clipboard
                .writeText(url)
                .then(
                    function () {

                        Guest.showCopySuccess();

                        return true;

                    }
                )
                .catch(
                    function () {

                        return Guest
                            .fallbackCopy(url);

                    }
                );

        }


        return this.fallbackCopy(url);

    };


    /* =====================================================
       11. FALLBACK COPY
    ===================================================== */

    Guest.fallbackCopy = function (text) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        textarea.style.top =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        let success =
            false;


        try {

            success =
                document.execCommand(
                    "copy"
                );

        } catch (error) {

            console.warn(
                "Guest URL copy gagal:",
                error
            );

        }


        document.body.removeChild(
            textarea
        );


        if (success) {

            this.showCopySuccess();

        }


        return success;

    };


    /* =====================================================
       12. COPY SUCCESS
    ===================================================== */

    Guest.showCopySuccess = function () {

        const elements =
            document.querySelectorAll(
                "[data-copy-success]"
            );


        elements.forEach(
            function (element) {

                element.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            function () {

                elements.forEach(
                    function (element) {

                        element.classList.remove(
                            "show"
                        );

                    }
                );

            },
            2000
        );

    };


    /* =====================================================
       13. SHARE
    ===================================================== */

    Guest.share = function () {

        const url =
            this.getShareURL();


        const title =
            document.title ||
            "Undangan Digital";


        const text =
            `Undangan untuk ${this.getName()}`;


        /*
         * Native Share API
         */

        if (
            navigator.share
        ) {

            return navigator.share({

                title:
                    title,

                text:
                    text,

                url:
                    url

            });

        }


        /*
         * Jika Share API tidak tersedia,
         * copy URL.
         */

        return this.copyURL();

    };


    /* =====================================================
       14. BIND COPY BUTTON
    ===================================================== */

    Guest.bindButtons = function () {

        const copyButtons =
            document.querySelectorAll(
                "[data-copy-guest-url]"
            );


        copyButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        Guest.copyURL();

                    }
                );

            }
        );


        const shareButtons =
            document.querySelectorAll(
                "[data-share-guest]"
            );


        shareButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        Guest.share();

                    }
                );

            }
        );

    };


    /* =====================================================
       15. EVENT
    ===================================================== */

    Guest.dispatchReady =
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "guest:ready",
                    {
                        detail: {

                            name:
                                this.getName(),

                            personalized:
                                this.isPersonalized(),

                            url:
                                this.getShareURL()

                        }

                    }
                )
            );

        };


    /* =====================================================
       16. PUBLIC API
    ===================================================== */

    window.InvitationGuest =
        Guest;


    /* =====================================================
       17. DOM READY
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            Guest.init();

            Guest.bindButtons();

            Guest.dispatchReady();

        }
    );


})();
