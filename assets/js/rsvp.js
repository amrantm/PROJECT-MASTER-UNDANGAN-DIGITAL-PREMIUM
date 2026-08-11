/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   RSVP ENGINE
   FASE 2.12
   MOBILE FIRST
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. RSVP ENGINE
       ===================================================== */

    const RSVP = {

        initialized: false,

        elements: {},

        config: {},

        guestName: "",

        attendance: "",

        guestCount: 1

    };


    /* =====================================================
       02. INITIALIZE
       ===================================================== */

    RSVP.init = function () {

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

    RSVP.waitForData = function () {

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

                RSVP.start();

            },
            {
                once: true
            }
        );

    };


    /* =====================================================
       04. FIND ELEMENTS
       ===================================================== */

    RSVP.findElements = function () {

        this.elements.form =
            document.querySelector(
                "[data-rsvp-form]"
            );


        this.elements.name =
            document.querySelector(
                "[data-rsvp-name]"
            );


        this.elements.attendance =
            document.querySelector(
                "[data-rsvp-attendance]"
            );


        this.elements.guestCount =
            document.querySelector(
                "[data-rsvp-count]"
            );


        this.elements.submit =
            document.querySelector(
                "[data-rsvp-submit]"
            );


        this.elements.status =
            document.querySelector(
                "[data-rsvp-status]"
            );


        this.elements.toast =
            document.querySelector(
                "[data-rsvp-toast]"
            );

    };


    /* =====================================================
       05. START
       ===================================================== */

    RSVP.start = function () {

        this.config =
            InvitationData.get(
                "rsvp",
                {}
            );


        /*
         * Jika RSVP dimatikan
         * dari invitation.json.
         */

        if (
            this.config.enabled === false
        ) {

            this.disable();

            return;

        }


        /*
         * Ambil nama tamu
         * dari Guest Engine.
         */

        this.loadGuestName();


        /*
         * Isi default jumlah tamu.
         */

        this.setDefaultGuestCount();


        /*
         * Event submit.
         */

        this.bindEvents();


        /*
         * Tampilkan RSVP.
         */

        this.show();

    };


    /* =====================================================
       06. LOAD GUEST NAME
       ===================================================== */

    RSVP.loadGuestName = function () {

        /*
         * Prioritas 1:
         * Guest Engine.
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
         * Prioritas 2:
         * URL parameter ?kpd=
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
         * Decode URL.
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
                "Nama tamu tidak dapat di-decode.",
                error
            );

        }


        this.guestName =
            this.guestName.trim();


        /*
         * Masukkan ke input.
         */

        if (
            this.elements.name
        ) {

            this.elements.name.value =
                this.guestName;

        }

    };


    /* =====================================================
       07. DEFAULT GUEST COUNT
       ===================================================== */

    RSVP.setDefaultGuestCount =
        function () {

            if (
                !this.elements.guestCount
            ) {

                return;

            }


            let value =
                parseInt(
                    this.elements.guestCount.value,
                    10
                );


            if (
                Number.isNaN(value) ||
                value < 1
            ) {

                value = 1;

            }


            const max =
                this.getMaximumGuest();


            if (
                value > max
            ) {

                value = max;

            }


            this.elements.guestCount.value =
                value;


            this.guestCount =
                value;

        };


    /* =====================================================
       08. GET MAXIMUM GUEST
       ===================================================== */

    RSVP.getMaximumGuest =
        function () {

            const maximum =
                parseInt(
                    this.config.maxGuests,
                    10
                );


            if (
                Number.isNaN(maximum) ||
                maximum < 1
            ) {

                return 5;

            }


            return maximum;

        };


    /* =====================================================
       09. BIND EVENTS
       ===================================================== */

    RSVP.bindEvents = function () {

        if (
            !this.elements.form
        ) {

            return;

        }


        /*
         * Submit form.
         */

        this.elements.form.addEventListener(
            "submit",
            function (
                event
            ) {

                event.preventDefault();

                RSVP.submit();

            }
        );


        /*
         * Jumlah tamu.
         */

        if (
            this.elements.guestCount
        ) {

            this.elements.guestCount.addEventListener(
                "change",
                function () {

                    RSVP.validateGuestCount();

                }
            );


            this.elements.guestCount.addEventListener(
                "input",
                function () {

                    RSVP.validateGuestCount();

                }
            );

        }


        /*
         * Pilihan kehadiran.
         */

        if (
            this.elements.attendance
        ) {

            const radios =
                this.elements.attendance
                    .querySelectorAll(
                        "input[type='radio']"
                    );


            radios.forEach(
                function (
                    radio
                ) {

                    radio.addEventListener(
                        "change",
                        function () {

                            RSVP.attendance =
                                radio.value;

                            RSVP.updateAttendanceUI();

                        }
                    );

                }
            );

        }

    };


    /* =====================================================
       10. UPDATE ATTENDANCE UI
       ===================================================== */

    RSVP.updateAttendanceUI =
        function () {

            if (
                !this.elements.attendance
            ) {

                return;

            }


            const labels =
                this.elements.attendance
                    .querySelectorAll(
                        "label"
                    );


            labels.forEach(
                function (
                    label
                ) {

                    const input =
                        label.querySelector(
                            "input"
                        );


                    if (
                        input &&
                        input.checked
                    ) {

                        label.classList.add(
                            "is-selected"
                        );

                    } else {

                        label.classList.remove(
                            "is-selected"
                        );

                    }

                }
            );

        };


    /* =====================================================
       11. VALIDATE
       ===================================================== */

    RSVP.validate = function () {

        /*
         * Nama.
         */

        const name =
            this.getName();


        if (
            !name
        ) {

            this.showStatus(
                "Silakan isi nama terlebih dahulu.",
                "error"
            );

            return false;

        }


        /*
         * Kehadiran.
         */

        const attendance =
            this.getAttendance();


        if (
            !attendance
        ) {

            this.showStatus(
                "Silakan pilih konfirmasi kehadiran.",
                "error"
            );

            return false;

        }


        /*
         * Jumlah tamu.
         */

        if (
            !this.validateGuestCount()
        ) {

            return false;

        }


        return true;

    };


    /* =====================================================
       12. GET NAME
       ===================================================== */

    RSVP.getName = function () {

        if (
            !this.elements.name
        ) {

            return this.guestName;

        }


        const name =
            this.elements.name.value
                .trim();


        this.guestName =
            name;


        return name;

    };


    /* =====================================================
       13. GET ATTENDANCE
       ===================================================== */

    RSVP.getAttendance = function () {

        if (
            !this.elements.attendance
        ) {

            return this.attendance;

        }


        const selected =
            this.elements.attendance
                .querySelector(
                    "input[type='radio']:checked"
                );


        if (
            !selected
        ) {

            return "";

        }


        this.attendance =
            selected.value;


        return selected.value;

    };


    /* =====================================================
       14. VALIDATE GUEST COUNT
       ===================================================== */

    RSVP.validateGuestCount =
        function () {

            if (
                !this.elements.guestCount
            ) {

                this.guestCount = 1;

                return true;

            }


            let value =
                parseInt(
                    this.elements.guestCount.value,
                    10
                );


            if (
                Number.isNaN(value)
            ) {

                value = 1;

            }


            if (
                value < 1
            ) {

                value = 1;

            }


            const max =
                this.getMaximumGuest();


            if (
                value > max
            ) {

                value = max;

                this.showStatus(
                    `Jumlah tamu maksimal ${max} orang.`,
                    "error"
                );

            }


            this.elements.guestCount.value =
                value;


            this.guestCount =
                value;


            return true;

        };


    /* =====================================================
       15. SUBMIT
       ===================================================== */

    RSVP.submit = function () {

        if (
            !this.validate()
        ) {

            return;

        }


        const name =
            this.getName();


        const attendance =
            this.getAttendance();


        const guestCount =
            this.getGuestCount();


        /*
         * Loading.
         */

        this.setLoading(
            true
        );


        /*
         * Beri sedikit jeda agar
         * animasi loading terlihat
         * profesional.
         */

        setTimeout(
            function () {

                RSVP.openWhatsApp(
                    name,
                    attendance,
                    guestCount
                );

                RSVP.setLoading(
                    false
                );

            },
            500
        );

    };


    /* =====================================================
       16. GET GUEST COUNT
       ===================================================== */

    RSVP.getGuestCount = function () {

        if (
            !this.elements.guestCount
        ) {

            return 1;

        }


        const value =
            parseInt(
                this.elements.guestCount.value,
                10
            );


        if (
            Number.isNaN(value) ||
            value < 1
        ) {

            return 1;

        }


        this.guestCount =
            value;


        return value;

    };


    /* =====================================================
       17. OPEN WHATSAPP
       ===================================================== */

    RSVP.openWhatsApp = function (
        name,
        attendance,
        guestCount
    ) {

        const phone =
            this.getWhatsAppNumber();


        if (
            !phone
        ) {

            this.showStatus(
                "Nomor WhatsApp belum dikonfigurasi.",
                "error"
            );

            return;

        }


        const message =
            this.buildMessage(
                name,
                attendance,
                guestCount
            );


        const encoded =
            encodeURIComponent(
                message
            );


        const url =
            `https://wa.me/${phone}?text=${encoded}`;


        /*
         * Buka WhatsApp.
         */

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );


        /*
         * Event sukses.

         */

        this.dispatchSuccess({

            name:
                name,

            attendance:
                attendance,

            guestCount:
                guestCount

        });


        this.showStatus(
            "Konfirmasi sedang dibuka di WhatsApp.",
            "success"
        );

    };


    /* =====================================================
       18. GET WHATSAPP NUMBER
       ===================================================== */

    RSVP.getWhatsAppNumber =
        function () {

            let phone =
                this.config.whatsapp || "";


            /*
             * Hilangkan semua karakter
             * selain angka.
             */

            phone =
                String(phone)
                    .replace(
                        /[^0-9]/g,
                        ""
                    );


            /*
             * Jika nomor menggunakan 08,
             * ubah menjadi 628.
             */

            if (
                phone.startsWith("08")
            ) {

                phone =
                    "62" +
                    phone.substring(1);

            }


            return phone;

        };


    /* =====================================================
       19. BUILD MESSAGE
       ===================================================== */

    RSVP.buildMessage =
        function (
            name,
            attendance,
            guestCount
        ) {

            const invitation =
                InvitationData.get(
                    "couple",
                    {}
                );


            const bride =
                invitation.bride ||
                "Mempelai Wanita";


            const groom =
                invitation.groom ||
                "Mempelai Pria";


            const event =
                InvitationData.get(
                    "event",
                    {}
                );


            const date =
                event.dateDisplay ||
                "23 Agustus 2026";


            let attendanceText =
                "Hadir";


            if (
                attendance ===
                "tidak_hadir"
            ) {

                attendanceText =
                    "Tidak Hadir";

            }


            if (
                attendance ===
                "ragu"
            ) {

                attendanceText =
                    "Masih Ragu";

            }


            let message =
                "Assalamu'alaikum Wr. Wb.%0A";


            message =
                decodeURIComponent(
                    message
                );


            message +=
                "\n";


            message +=
                "Kepada Yth.\n";


            message +=
                name;


            message +=
                "\n\n";


            message +=
                "Terima kasih atas undangan pernikahan ";


            message +=
                `${bride} & ${groom}.`;


            message +=
                "\n\n";


            message +=
                "Saya ingin mengonfirmasi kehadiran:";


            message +=
                "\n\n";


            message +=
                `Nama: ${name}`;


            message +=
                `\nKehadiran: ${attendanceText}`;


            if (
                attendance !==
                "tidak_hadir"
            ) {

                message +=
                    `\nJumlah tamu: ${guestCount} orang`;

            }


            message +=
                `\nTanggal acara: ${date}`;


            message +=
                "\n\n";


            message +=
                "Terima kasih.";


            message +=
                "\n\n";


            message +=
                "Wassalamu'alaikum Wr. Wb.";


            return message;

        };


    /* =====================================================
       20. SET LOADING
       ===================================================== */

    RSVP.setLoading =
        function (
            loading
        ) {

            if (
                !this.elements.submit
            ) {

                return;

            }


            if (
                loading
            ) {

                this.elements.submit
                    .disabled =
                    true;


                this.elements.submit
                    .classList.add(
                        "is-loading"
                    );


                this.elements.submit
                    .setAttribute(
                        "aria-busy",
                        "true"
                    );


                const loadingText =
                    this.elements.submit
                        .getAttribute(
                            "data-loading-text"
                        ) ||
                        "Membuka WhatsApp...";


                this.elements.submit
                    .textContent =
                    loadingText;


            } else {

                this.elements.submit
                    .disabled =
                    false;


                this.elements.submit
                    .classList.remove(
                        "is-loading"
                    );


                this.elements.submit
                    .removeAttribute(
                        "aria-busy"
                    );


                const defaultText =
                    this.elements.submit
                        .getAttribute(
                            "data-default-text"
                        ) ||
                        "Konfirmasi Kehadiran";


                this.elements.submit
                    .textContent =
                    defaultText;

            }

        };


    /* =====================================================
       21. STATUS MESSAGE
       ===================================================== */

    RSVP.showStatus =
        function (
            message,
            type
        ) {

            if (
                !this.elements.status
            ) {

                this.showToast(
                    message,
                    type
                );

                return;

            }


            this.elements.status
                .textContent =
                message;


            this.elements.status
                .className =
                `rsvp-status ${type}`;


            this.elements.status
                .removeAttribute(
                    "hidden"
                );


            /*
             * Hilangkan otomatis
             * setelah beberapa detik.
             */

            clearTimeout(
                this.statusTimer
            );


            this.statusTimer =
                setTimeout(
                    function () {

                        if (
                            RSVP.elements.status
                        ) {

                            RSVP.elements.status
                                .setAttribute(
                                    "hidden",
                                    "hidden"
                                );

                        }

                    },
                    5000
                );

        };


    /* =====================================================
       22. TOAST
       ===================================================== */

    RSVP.showToast =
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
                `rsvp-toast ${type}`;


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

                        RSVP.elements.toast
                            .classList.remove(
                                "show"
                            );

                    },
                    4000
                );

        };


    /* =====================================================
       23. SHOW
       ===================================================== */

    RSVP.show = function () {

        if (
            this.elements.form
        ) {

            this.elements.form
                .removeAttribute(
                    "hidden"
                );

        }

    };


    /* =====================================================
       24. DISABLE
       ===================================================== */

    RSVP.disable = function () {

        const section =
            document.querySelector(
                "[data-section='rsvp']"
            );


        if (
            section
        ) {

            section.setAttribute(
                "hidden",
                "hidden"
            );

        }

    };


    /* =====================================================
       25. SUCCESS EVENT
       ===================================================== */

    RSVP.dispatchSuccess =
        function (
            detail
        ) {

            document.dispatchEvent(
                new CustomEvent(
                    "rsvp:success",
                    {
                        detail:
                            detail
                    }
                )
            );

        };


    /* =====================================================
       26. PUBLIC API
       ===================================================== */

    window.InvitationRSVP =
        RSVP;


    /* =====================================================
       27. DOM READY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            RSVP.init();

        }
    );


})();
