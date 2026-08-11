/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   SHARE ENGINE
   FASE 2.14
   MOBILE FIRST
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. SHARE ENGINE
       ===================================================== */

    const Share = {

        initialized: false,

        elements: {},

        guestName: "",

        invitationUrl: "",

        shareTitle: "Undangan Pernikahan",

        shareText: "",

        toastTimer: null

    };


    /* =====================================================
       02. INITIALIZE
       ===================================================== */

    Share.init = function () {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.findElements();

        this.waitForData();

    };


    /* =====================================================
       03. FIND ELEMENTS
       ===================================================== */

    Share.findElements = function () {

        this.elements.container =
            document.querySelector(
                "[data-share]"
            );


        this.elements.share =
            document.querySelector(
                "[data-share-action='share']"
            );


        this.elements.copy =
            document.querySelector(
                "[data-share-action='copy']"
            );


        this.elements.whatsapp =
            document.querySelector(
                "[data-share-action='whatsapp']"
            );


        this.elements.toast =
            document.querySelector(
                "[data-share-toast]"
            );

    };


    /* =====================================================
       04. WAIT FOR DATA
       ===================================================== */

    Share.waitForData = function () {

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

                Share.start();

            },
            {
                once: true
            }
        );

    };


    /* =====================================================
       05. START
       ===================================================== */

    Share.start = function () {

        this.loadGuest();

        this.loadInvitationData();

        this.buildPersonalUrl();

        this.buildShareText();

        this.bindEvents();

        this.updateGuestDisplay();

    };


    /* =====================================================
       06. LOAD GUEST
       ===================================================== */

    Share.loadGuest = function () {

        /*
         * Prioritas Guest Engine.
         */

        if (
            window.InvitationGuest &&
            typeof InvitationGuest.getName ===
            "function"
        ) {

            this.guestName =
                InvitationGuest.getName();

        }


        /*
         * Fallback URL ?kpd=
         */

        if (
            !this.guestName
        ) {

            const params =
                new URLSearchParams(
                    window.location.search
                );


            this.guestName =
                params.get(
                    "kpd"
                ) || "";

        }


        /*
         * Decode.
         */

        try {

            this.guestName =
                decodeURIComponent(
                    this.guestName
                );

        } catch (
            error
        ) {

            console.warn(
                "Nama tamu gagal diproses.",
                error
            );

        }


        this.guestName =
            this.guestName.trim();

    };


    /* =====================================================
       07. LOAD INVITATION DATA
       ===================================================== */

    Share.loadInvitationData =
        function () {

            const couple =
                InvitationData.get(
                    "couple",
                    {}
                );


            const event =
                InvitationData.get(
                    "event",
                    {}
                );


            const bride =
                couple.bride ||
                "Mempelai Wanita";


            const groom =
                couple.groom ||
                "Mempelai Pria";


            this.shareTitle =
                `${bride} & ${groom}`;


            this.shareText =
                `Undangan Pernikahan ${bride} & ${groom}`;


            if (
                event.dateDisplay
            ) {

                this.shareText +=
                    ` • ${event.dateDisplay}`;

            }

        };


    /* =====================================================
       08. BUILD PERSONAL URL
       ===================================================== */

    Share.buildPersonalUrl =
        function () {

            /*
             * Ambil URL halaman saat ini.
             *
             * origin + pathname menjaga
             * link tetap bersih dari query
             * lama.
             */

            const url =
                new URL(
                    window.location.href
                );


            /*
             * Hapus query lama.
             */

            url.search = "";


            /*
             * Hapus hash.
             */

            url.hash = "";


            /*
             * Jika nama tamu tersedia,
             * tambahkan ?kpd=
             */

            if (
                this.guestName
            ) {

                url.searchParams.set(
                    "kpd",
                    this.guestName
                );

            }


            this.invitationUrl =
                url.toString();

        };


    /* =====================================================
       09. BUILD SHARE TEXT
       ===================================================== */

    Share.buildShareText =
        function () {

            let text =
                `Assalamu'alaikum Wr. Wb.\n\n`;


            text +=
                `Dengan penuh kebahagiaan, `;


            text +=
                `kami mengundang `;


            if (
                this.guestName
            ) {

                text +=
                    `${this.guestName} `;

            } else {

                text +=
                    "Bapak/Ibu/Saudara/i ";

            }


            text +=
                `untuk hadir dalam acara pernikahan kami.\n\n`;


            text +=
                `${this.shareTitle}\n\n`;


            text +=
                `Silakan buka undangan digital melalui link berikut:\n`;


            text +=
                `${this.invitationUrl}\n\n`;


            text +=
                "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir.";


            this.shareText =
                text;

        };


    /* =====================================================
       10. UPDATE GUEST DISPLAY
       ===================================================== */

    Share.updateGuestDisplay =
        function () {

            const display =
                document.querySelector(
                    "[data-share-guest]"
                );


            if (
                !display
            ) {

                return;

            }


            if (
                this.guestName
            ) {

                display.textContent =
                    this.guestName;

            } else {

                display.textContent =
                    "Tamu Undangan";

            }

        };


    /* =====================================================
       11. BIND EVENTS
       ===================================================== */

    Share.bindEvents = function () {

        if (
            this.elements.share
        ) {

            this.elements.share
                .addEventListener(
                    "click",
                    function () {

                        Share.nativeShare();

                    }
                );

        }


        if (
            this.elements.copy
        ) {

            this.elements.copy
                .addEventListener(
                    "click",
                    function () {

                        Share.copyLink();

                    }
                );

        }


        if (
            this.elements.whatsapp
        ) {

            this.elements.whatsapp
                .addEventListener(
                    "click",
                    function () {

                        Share.whatsappShare();

                    }
                );

        }

    };


    /* =====================================================
       12. NATIVE SHARE
       ===================================================== */

    Share.nativeShare =
        async function () {

            /*
             * Web Share API tersedia
             * pada sebagian besar browser HP.
             */

            if (
                navigator.share
            ) {

                try {

                    await navigator.share({

                        title:
                            this.shareTitle,

                        text:
                            this.shareText,

                        url:
                            this.invitationUrl

                    });


                    this.dispatch(
                        "share",
                        {
                            method:
                                "native"
                        }
                    );


                } catch (
                    error
                ) {

                    /*
                     * User menekan cancel.
                     * Tidak perlu menampilkan error.
                     */

                    if (
                        error &&
                        error.name !==
                        "AbortError"
                    ) {

                        console.warn(
                            "Native share gagal.",
                            error
                        );

                        this.showToast(
                            "Fitur bagikan tidak tersedia.",
                            "error"
                        );

                    }

                }


                return;

            }


            /*
             * Fallback.
             */

            this.copyLink();

        };


    /* =====================================================
       13. COPY LINK
       ===================================================== */

    Share.copyLink =
        async function () {

            let success =
                false;


            /*
             * Clipboard API modern.
             */

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                try {

                    await navigator.clipboard
                        .writeText(
                            this.invitationUrl
                        );


                    success =
                        true;

                } catch (
                    error
                ) {

                    console.warn(
                        "Clipboard API gagal.",
                        error
                    );

                }

            }


            /*
             * Fallback.
             */

            if (
                !success
            ) {

                success =
                    this.fallbackCopy(
                        this.invitationUrl
                    );

            }


            if (
                success
            ) {

                this.showToast(
                    "Link undangan berhasil disalin.",
                    "success"
                );


                this.animateButton(
                    this.elements.copy
                );


                this.dispatch(
                    "copy",
                    {
                        url:
                            this.invitationUrl
                    }
                );


            } else {

                this.showToast(
                    "Link gagal disalin.",
                    "error"
                );

            }

        };


    /* =====================================================
       14. FALLBACK COPY
       ===================================================== */

    Share.fallbackCopy =
        function (
            text
        ) {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                text;


            textarea.setAttribute(
                "readonly",
                ""
            );


            textarea.style.position =
                "fixed";


            textarea.style.left =
                "-9999px";


            textarea.style.top =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.select();


            textarea.setSelectionRange(
                0,
                textarea.value.length
            );


            let success =
                false;


            try {

                success =
                    document.execCommand(
                        "copy"
                    );

            } catch (
                error
            ) {

                console.warn(
                    "Fallback copy gagal.",
                    error
                );

            }


            document.body.removeChild(
                textarea
            );


            return success;

        };


    /* =====================================================
       15. WHATSAPP SHARE
       ===================================================== */

    Share.whatsappShare =
        function () {

            const message =
                this.buildWhatsAppMessage();


            const encoded =
                encodeURIComponent(
                    message
                );


            const url =
                `https://wa.me/?text=${encoded}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );


            this.animateButton(
                this.elements.whatsapp
            );


            this.dispatch(
                "whatsapp",
                {
                    url:
                        this.invitationUrl
                }
            );

        };


    /* =====================================================
       16. BUILD WHATSAPP MESSAGE
       ===================================================== */

    Share.buildWhatsAppMessage =
        function () {

            let message =
                "💌 UNDANGAN PERNIKAHAN\n\n";


            if (
                this.guestName
            ) {

                message +=
                    `Kepada Yth.\n${this.guestName}\n\n`;

            } else {

                message +=
                    "Kepada Yth. Bapak/Ibu/Saudara/i\n\n";

            }


            message +=
                `Dengan penuh kebahagiaan, `;


            message +=
                `kami mengundang Anda `;


            message +=
                `untuk hadir dalam acara pernikahan:\n\n`;


            message +=
                `💍 ${this.shareTitle}\n\n`;


            message +=
                "Silakan buka undangan digital kami:\n";


            message +=
                this.invitationUrl;


            message +=
                "\n\n";


            message +=
                "Kehadiran dan doa restu Anda merupakan kebahagiaan bagi kami. 🙏";


            return message;

        };


    /* =====================================================
       17. ANIMATE BUTTON
       ===================================================== */

    Share.animateButton =
        function (
            button
        ) {

            if (
                !button
            ) {

                return;

            }


            button.classList.add(
                "is-active"
            );


            setTimeout(
                function () {

                    button.classList.remove(
                        "is-active"
                    );

                },
                500
            );

        };


    /* =====================================================
       18. TOAST
       ===================================================== */

    Share.showToast =
        function (
            message,
            type
        ) {

            if (
                !this.elements.toast
            ) {

                return;

            }


            this.elements.toast
                .textContent =
                message;


            this.elements.toast
                .className =
                `share-toast ${type}`;


            void this.elements.toast
                .offsetWidth;


            this.elements.toast
                .classList.add(
                    "show"
                );


            clearTimeout(
                this.toastTimer
            );


            this.toastTimer =
                setTimeout(
                    function () {

                        Share.elements.toast
                            .classList.remove(
                                "show"
                            );

                    },
                    3500
                );

        };


    /* =====================================================
       19. DISPATCH EVENT
       ===================================================== */

    Share.dispatch =
        function (
            action,
            detail
        ) {

            document.dispatchEvent(
                new CustomEvent(
                    `share:${action}`,
                    {
                        detail:
                            detail
                    }
                )
            );

        };


    /* =====================================================
       20. REFRESH PERSONAL LINK
       ===================================================== */

    Share.refresh =
        function () {

            this.loadGuest();

            this.buildPersonalUrl();

            this.buildShareText();

            this.updateGuestDisplay();

        };


    /* =====================================================
       21. GET PERSONAL URL
       ===================================================== */

    Share.getUrl =
        function () {

            return this.invitationUrl;

        };


    /* =====================================================
       22. PUBLIC API
       ===================================================== */

    window.InvitationShare =
        Share;


    /* =====================================================
       23. DOM READY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            Share.init();

        }
    );


})();
