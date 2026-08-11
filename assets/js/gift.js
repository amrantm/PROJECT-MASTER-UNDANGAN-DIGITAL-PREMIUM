/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   DIGITAL GIFT / AMPLOP DIGITAL ENGINE
   FASE 2.13
   MOBILE FIRST
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. GIFT ENGINE
       ===================================================== */

    const Gift = {

        initialized: false,

        loaded: false,

        items: [],

        elements: {},

        activeIndex: 0,

        copyTimer: null

    };


    /* =====================================================
       02. INITIALIZE
       ===================================================== */

    Gift.init = function () {

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

    Gift.waitForData = function () {

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

                Gift.start();

            },
            {
                once: true
            }
        );

    };


    /* =====================================================
       04. FIND ELEMENTS
       ===================================================== */

    Gift.findElements = function () {

        this.elements.section =
            document.querySelector(
                "[data-section='gift']"
            );


        this.elements.container =
            document.querySelector(
                "[data-gift]"
            );


        this.elements.grid =
            document.querySelector(
                "[data-gift-grid]"
            );


        this.elements.toast =
            document.querySelector(
                "[data-gift-toast]"
            );

    };


    /* =====================================================
       05. START
       ===================================================== */

    Gift.start = function () {

        const config =
            InvitationData.get(
                "gift",
                {}
            );


        /*
         * Jika fitur hadiah
         * dimatikan dari JSON.
         */

        if (
            config.enabled === false
        ) {

            this.disable();

            return;

        }


        /*
         * Ambil data rekening.

         */

        this.items =
            this.normalizeItems(
                config
            );


        /*
         * Jika tidak ada rekening.
         */

        if (
            this.items.length === 0
        ) {

            this.disable();

            return;

        }


        /*
         * Render kartu rekening.
         */

        this.render();


        /*
         * Event.
         */

        this.bindEvents();


        this.loaded =
            true;


        this.dispatchReady();

    };


    /* =====================================================
       06. NORMALIZE ITEMS
       ===================================================== */

    Gift.normalizeItems = function (
        config
    ) {

        /*
         * Format utama:
         *
         * gift: {
         *   items: []
         * }
         */

        if (
            Array.isArray(
                config.items
            )
        ) {

            return config.items
                .filter(
                    function (
                        item
                    ) {

                        return item &&
                            (
                                item.account ||
                                item.number ||
                                item.bank
                            );

                    }
                );

        }


        /*
         * Format rekening tunggal.
         *
         * Untuk kompatibilitas
         * dengan versi sederhana.
         */

        if (
            config.account ||
            config.number ||
            config.bank
        ) {

            return [
                config
            ];

        }


        return [];

    };


    /* =====================================================
       07. RENDER
       ===================================================== */

    Gift.render = function () {

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
                    Gift.createCard(
                        item,
                        index
                    );


                Gift.elements.grid
                    .appendChild(
                        card
                    );

            }
        );

    };


    /* =====================================================
       08. CREATE CARD
       ===================================================== */

    Gift.createCard = function (
        item,
        index
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "gift-card";


        card.setAttribute(
            "data-gift-index",
            index
        );


        /*
         * Animasi berbeda.
         */

        card.setAttribute(
            "data-gift-animation",
            this.getAnimation(
                index
            )
        );


        /*
         * Header.
         */

        const header =
            document.createElement(
                "div"
            );


        header.className =
            "gift-card-header";


        const bank =
            document.createElement(
                "div"
            );


        bank.className =
            "gift-bank";


        bank.textContent =
            item.bank ||
            "Bank";


        const logo =
            document.createElement(
                "div"
            );


        logo.className =
            "gift-bank-logo";


        logo.textContent =
            item.shortName ||
            this.getBankInitial(
                item.bank
            );


        header.appendChild(
            bank
        );


        header.appendChild(
            logo
        );


        /*
         * Body.
         */

        const body =
            document.createElement(
                "div"
            );


        body.className =
            "gift-card-body";


        const accountLabel =
            document.createElement(
                "div"
            );


        accountLabel.className =
            "gift-account-label";


        accountLabel.textContent =
            "Nomor Rekening";


        const account =
            document.createElement(
                "div"
            );


        account.className =
            "gift-account";


        account.textContent =
            item.account ||
            item.number ||
            "-";


        const ownerLabel =
            document.createElement(
                "div"
            );


        ownerLabel.className =
            "gift-owner-label";


        ownerLabel.textContent =
            "Atas Nama";


        const owner =
            document.createElement(
                "div"
            );


        owner.className =
            "gift-owner";


        owner.textContent =
            item.name ||
            item.owner ||
            "-";


        body.appendChild(
            accountLabel
        );


        body.appendChild(
            account
        );


        body.appendChild(
            ownerLabel
        );


        body.appendChild(
            owner
        );


        /*
         * Footer.
         */

        const footer =
            document.createElement(
                "div"
            );


        footer.className =
            "gift-card-footer";


        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.type =
            "button";


        copyButton.className =
            "gift-copy-button";


        copyButton.setAttribute(
            "data-gift-copy",
            index
        );


        copyButton.innerHTML =
            `
            <span class="gift-copy-icon">
                ⧉
            </span>

            <span class="gift-copy-text">
                Salin Rekening
            </span>
            `;


        footer.appendChild(
            copyButton
        );


        /*
         * Optional button transfer.
         */

        if (
            item.note
        ) {

            const note =
                document.createElement(
                    "div"
                );


            note.className =
                "gift-note";


            note.textContent =
                item.note;


            body.appendChild(
                note
            );

        }


        card.appendChild(
            header
        );


        card.appendChild(
            body
        );


        card.appendChild(
            footer
        );


        return card;

    };


    /* =====================================================
       09. BANK INITIAL
       ===================================================== */

    Gift.getBankInitial =
        function (
            bank
        ) {

            if (
                !bank
            ) {

                return "BANK";

            }


            const words =
                String(bank)
                    .trim()
                    .split(
                        /\s+/
                    );


            if (
                words.length === 1
            ) {

                return words[0]
                    .substring(
                        0,
                        4
                    )
                    .toUpperCase();

            }


            return words
                .slice(
                    0,
                    3
                )
                .map(
                    function (
                        word
                    ) {

                        return word.charAt(
                            0
                        );

                    }
                )
                .join("")
                .toUpperCase();

        };


    /* =====================================================
       10. GET ANIMATION
       ===================================================== */

    Gift.getAnimation =
        function (
            index
        ) {

            const animations = [

                "fade-up",

                "zoom",

                "slide-left",

                "slide-right",

                "flip",

                "float"

            ];


            return animations[
                index %
                animations.length
            ];

        };


    /* =====================================================
       11. BIND EVENTS
       ===================================================== */

    Gift.bindEvents = function () {

        if (
            !this.elements.grid
        ) {

            return;

        }


        this.elements.grid
            .addEventListener(
                "click",
                function (
                    event
                ) {

                    const button =
                        event.target.closest(
                            "[data-gift-copy]"
                        );


                    if (
                        !button
                    ) {

                        return;

                    }


                    const index =
                        parseInt(
                            button.getAttribute(
                                "data-gift-copy"
                            ),
                            10
                        );


                    Gift.copyAccount(
                        index,
                        button
                    );

                }
            );

    };


    /* =====================================================
       12. COPY ACCOUNT
       ===================================================== */

    Gift.copyAccount =
        async function (
            index,
            button
        ) {

            const item =
                this.items[
                    index
                ];


            if (
                !item
            ) {

                return;

            }


            const account =
                String(
                    item.account ||
                    item.number ||
                    ""
                )
                .trim();


            if (
                !account
            ) {

                this.showToast(
                    "Nomor rekening tidak tersedia.",
                    "error"
                );

                return;

            }


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
                            account
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
             * Fallback browser lama.
             */

            if (
                !success
            ) {

                success =
                    this.fallbackCopy(
                        account
                    );

            }


            if (
                success
            ) {

                this.updateCopyButton(
                    button
                );


                this.showToast(
                    "Nomor rekening berhasil disalin.",
                    "success"
                );


                this.dispatchCopy(
                    item,
                    account
                );

            } else {

                this.showToast(
                    "Nomor rekening gagal disalin.",
                    "error"
                );

            }

        };


    /* =====================================================
       13. FALLBACK COPY
       ===================================================== */

    Gift.fallbackCopy =
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
       14. UPDATE COPY BUTTON
       ===================================================== */

    Gift.updateCopyButton =
        function (
            button
        ) {

            if (
                !button
            ) {

                return;

            }


            const text =
                button.querySelector(
                    ".gift-copy-text"
                );


            const icon =
                button.querySelector(
                    ".gift-copy-icon"
                );


            if (
                text
            ) {

                text.textContent =
                    "Berhasil Disalin";

            }


            if (
                icon
            ) {

                icon.textContent =
                    "✓";

            }


            button.classList.add(
                "is-copied"
            );


            clearTimeout(
                this.copyTimer
            );


            this.copyTimer =
                setTimeout(
                    function () {

                        if (
                            text
                        ) {

                            text.textContent =
                                "Salin Rekening";

                        }


                        if (
                            icon
                        ) {

                            icon.textContent =
                                "⧉";

                        }


                        button.classList.remove(
                            "is-copied"
                        );

                    },
                    3000
                );

        };


    /* =====================================================
       15. SHOW TOAST
       ===================================================== */

    Gift.showToast =
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
                `gift-toast ${type}`;


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

                        if (
                            Gift.elements.toast
                        ) {

                            Gift.elements.toast
                                .classList.remove(
                                    "show"
                                );

                        }

                    },
                    3500
                );

        };


    /* =====================================================
       16. DISABLE
       ===================================================== */

    Gift.disable = function () {

        if (
            this.elements.section
        ) {

            this.elements.section
                .setAttribute(
                    "hidden",
                    "hidden"
                );

        }

    };


    /* =====================================================
       17. DISPATCH READY
       ===================================================== */

    Gift.dispatchReady =
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "gift:ready",
                    {
                        detail: {

                            count:
                                this.items.length

                        }
                    }
                )
            );

        };


    /* =====================================================
       18. DISPATCH COPY
       ===================================================== */

    Gift.dispatchCopy =
        function (
            item,
            account
        ) {

            document.dispatchEvent(
                new CustomEvent(
                    "gift:copy",
                    {
                        detail: {

                            bank:
                                item.bank || "",

                            account:
                                account,

                            name:
                                item.name ||
                                item.owner ||
                                ""

                        }
                    }
                )
            );

        };


    /* =====================================================
       19. PUBLIC API
       ===================================================== */

    window.InvitationGift =
        Gift;


    /* =====================================================
       20. DOM READY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            Gift.init();

        }
    );


})();
