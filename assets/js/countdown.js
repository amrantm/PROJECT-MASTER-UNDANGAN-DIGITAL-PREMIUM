/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   COUNTDOWN ENGINE
   FASE 2.10
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. COUNTDOWN ENGINE
       ===================================================== */

    const Countdown = {

        initialized: false,

        timer: null,

        target: null,

        elements: {},

        previous: {

            days: null,

            hours: null,

            minutes: null,

            seconds: null

        }

    };


    /* =====================================================
       02. INITIALIZE
       ===================================================== */

    Countdown.init = function () {

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

    Countdown.waitForData = function () {

        /*
         * Jika data sudah tersedia,
         * langsung jalankan countdown.
         */

        if (
            window.InvitationData &&
            window.InvitationData.loaded
        ) {

            this.start();

            return;

        }


        /*
         * Jika data belum selesai dimuat,
         * tunggu event data:ready.
         */

        document.addEventListener(
            "data:ready",
            function () {

                Countdown.start();

            },
            {
                once: true
            }
        );

    };


    /* =====================================================
       04. FIND HTML ELEMENTS
       ===================================================== */

    Countdown.findElements = function () {

        /*
         * Container utama.
         */

        this.elements.container =
            document.querySelector(
                "[data-countdown]"
            );


        /*
         * Angka hari.
         */

        this.elements.days =
            document.querySelector(
                "[data-countdown-days]"
            );


        /*
         * Angka jam.
         */

        this.elements.hours =
            document.querySelector(
                "[data-countdown-hours]"
            );


        /*
         * Angka menit.
         */

        this.elements.minutes =
            document.querySelector(
                "[data-countdown-minutes]"
            );


        /*
         * Angka detik.
         */

        this.elements.seconds =
            document.querySelector(
                "[data-countdown-seconds]"
            );


        /*
         * Pesan ketika countdown selesai.
         */

        this.elements.finished =
            document.querySelector(
                "[data-countdown-finished]"
            );

    };


    /* =====================================================
       05. START
       ===================================================== */

    Countdown.start = function () {

        if (
            !window.InvitationData ||
            !window.InvitationData.loaded
        ) {

            return;

        }


        const config =
            InvitationData.getCountdown();


        /*
         * Countdown dapat dimatikan
         * dari invitation.json.
         */

        if (
            !config ||
            config.enabled === false
        ) {

            this.disable();

            return;

        }


        if (!config.target) {

            console.warn(
                "Countdown target belum tersedia."
            );

            this.disable();

            return;

        }


        this.target =
            this.parseTarget(
                config.target
            );


        if (
            !this.target ||
            Number.isNaN(
                this.target.getTime()
            )
        ) {

            console.error(
                "Format target countdown tidak valid:",
                config.target
            );

            this.disable();

            return;

        }


        /*
         * Jalankan satu kali langsung
         * agar tidak menunggu 1 detik.
         */

        this.update();


        /*
         * Hindari timer ganda.
         */

        if (this.timer) {

            clearInterval(
                this.timer
            );

        }


        this.timer =
            setInterval(
                function () {

                    Countdown.update();

                },
                1000
            );

    };


    /* =====================================================
       06. PARSE TARGET
       ===================================================== */

    Countdown.parseTarget =
        function (
            target
        ) {

            /*
             * JavaScript Date dapat membaca
             * ISO 8601:
             *
             * 2026-08-23T10:00:00+08:00
             */

            const date =
                new Date(target);


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return null;

            }


            return date;

        };


    /* =====================================================
       07. UPDATE
       ===================================================== */

    Countdown.update = function () {

        if (!this.target) {
            return;
        }


        const now =
            new Date();


        let difference =
            this.target.getTime() -
            now.getTime();


        /*
         * Jika waktu sudah lewat.
         */

        if (
            difference <= 0
        ) {

            difference = 0;

            this.render({

                days: 0,

                hours: 0,

                minutes: 0,

                seconds: 0

            });


            this.finish();

            return;

        }


        /*
         * 1000 ms = 1 detik
         */

        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (
                    totalSeconds % 86400
                ) / 3600
            );


        const minutes =
            Math.floor(
                (
                    totalSeconds % 3600
                ) / 60
            );


        const seconds =
            totalSeconds % 60;


        this.render({

            days:
                days,

            hours:
                hours,

            minutes:
                minutes,

            seconds:
                seconds

        });

    };


    /* =====================================================
       08. RENDER
       ===================================================== */

    Countdown.render = function (
        values
    ) {

        this.setValue(
            this.elements.days,
            values.days,
            "days"
        );


        this.setValue(
            this.elements.hours,
            values.hours,
            "hours"
        );


        this.setValue(
            this.elements.minutes,
            values.minutes,
            "minutes"
        );


        this.setValue(
            this.elements.seconds,
            values.seconds,
            "seconds"
        );

    };


    /* =====================================================
       09. SET VALUE
       ===================================================== */

    Countdown.setValue = function (
        element,
        value,
        key
    ) {

        if (!element) {
            return;
        }


        const number =
            Number(value);


        const formatted =
            String(number)
                .padStart(
                    2,
                    "0"
                );


        /*
         * Animasi hanya dijalankan
         * jika angka benar-benar berubah.
         */

        if (
            this.previous[key] !==
            number
        ) {

            element.classList.remove(
                "countdown-change"
            );


            /*
             * Memaksa browser membuat
             * layout ulang sehingga animasi
             * dapat dimainkan kembali.
             */

            void element.offsetWidth;


            element.classList.add(
                "countdown-change"
            );


            this.previous[key] =
                number;

        }


        element.textContent =
            formatted;

    };


    /* =====================================================
       10. FINISH
       ===================================================== */

    Countdown.finish = function () {

        if (this.timer) {

            clearInterval(
                this.timer
            );

            this.timer =
                null;

        }


        if (
            this.elements.container
        ) {

            this.elements.container
                .classList.add(
                    "countdown-finished"
                );

        }


        if (
            this.elements.finished
        ) {

            this.elements.finished
                .removeAttribute(
                    "hidden"
                );

        }


        /*
         * Event untuk modul lain.
         */

        document.dispatchEvent(
            new CustomEvent(
                "countdown:finished"
            )
        );

    };


    /* =====================================================
       11. DISABLE
       ===================================================== */

    Countdown.disable = function () {

        if (this.timer) {

            clearInterval(
                this.timer
            );

            this.timer =
                null;

        }


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
       12. GET REMAINING
       ===================================================== */

    Countdown.getRemaining = function () {

        if (!this.target) {

            return null;

        }


        const now =
            new Date();


        const difference =
            Math.max(
                0,
                this.target.getTime() -
                now.getTime()
            );


        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        return {

            days:
                Math.floor(
                    totalSeconds / 86400
                ),

            hours:
                Math.floor(
                    (
                        totalSeconds % 86400
                    ) / 3600
                ),

            minutes:
                Math.floor(
                    (
                        totalSeconds % 3600
                    ) / 60
                ),

            seconds:
                totalSeconds % 60

        };

    };


    /* =====================================================
       13. PUBLIC API
       ===================================================== */

    window.InvitationCountdown =
        Countdown;


    /* =====================================================
       14. DOM READY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            Countdown.init();

        }
    );


})();
