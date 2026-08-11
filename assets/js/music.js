/* =========================================================
   PROJECT MASTER — UNDANGAN DIGITAL PREMIUM
   MUSIC ENGINE
   Mobile Friendly
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. MUSIC CONFIGURATION
    ===================================================== */

    const Music = {

        audio: null,

        button: null,

        initialized: false,

        isPlaying: false,

        volume: 0.75,

        source:
            "assets/music/wedding.mp3"

    };


    /* =====================================================
       02. INITIALIZE
    ===================================================== */

    Music.init = function () {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.createAudio();

        this.findButton();

        this.bindEvents();

        this.updateButton();

    };


    /* =====================================================
       03. CREATE AUDIO
    ===================================================== */

    Music.createAudio = function () {

        this.audio =
            document.createElement("audio");


        this.audio.id =
            "backgroundMusic";


        this.audio.src =
            this.source;


        this.audio.loop =
            true;


        this.audio.preload =
            "auto";


        this.audio.volume =
            this.volume;


        /*
         * Jangan gunakan autoplay.
         *
         * Browser HP modern umumnya
         * memblokir autoplay audio.
         *
         * Musik akan dimulai setelah
         * user menekan "Buka Undangan".
         */

        this.audio.autoplay =
            false;


        this.audio.setAttribute(
            "playsinline",
            ""
        );


        document.body.appendChild(
            this.audio
        );

    };


    /* =====================================================
       04. FIND MUSIC BUTTON
    ===================================================== */

    Music.findButton = function () {

        this.button =
            document.querySelector(
                "[data-music-toggle]"
            );


        /*
         * Jika tombol belum ada,
         * Music Engine tetap berjalan.
         */

    };


    /* =====================================================
       05. EVENTS
    ===================================================== */

    Music.bindEvents = function () {

        /*
         * Tombol Play / Pause
         */

        if (this.button) {

            this.button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    Music.toggle();

                }
            );

        }


        /*
         * Ketika musik benar-benar mulai.
         */

        this.audio.addEventListener(
            "play",
            function () {

                Music.isPlaying =
                    true;

                Music.updateButton();

            }
        );


        /*
         * Ketika musik berhenti.
         */

        this.audio.addEventListener(
            "pause",
            function () {

                Music.isPlaying =
                    false;

                Music.updateButton();

            }
        );


        /*
         * Jika audio selesai.
         *
         * Loop seharusnya mencegah
         * event ini menjadi masalah,
         * tetapi kita tetap siapkan.
         */

        this.audio.addEventListener(
            "ended",
            function () {

                Music.isPlaying =
                    false;

                Music.updateButton();

            }
        );


        /*
         * Jika terjadi error.
         */

        this.audio.addEventListener(
            "error",
            function () {

                console.warn(
                    "Music Engine: file musik tidak ditemukan:",
                    Music.source
                );

                Music.isPlaying =
                    false;

                Music.updateButton();

            }
        );


        /*
         * Ketika undangan dibuka.
         *
         * app.js akan mengirim:
         *
         * invitation:opened
         */

        document.addEventListener(
            "invitation:opened",
            function () {

                Music.play();

            }
        );

    };


    /* =====================================================
       06. PLAY
    ===================================================== */

    Music.play = function () {

        if (!this.audio) {
            return;
        }


        const promise =
            this.audio.play();


        /*
         * play() mengembalikan Promise
         * pada browser modern.
         */

        if (
            promise &&
            typeof promise.catch === "function"
        ) {

            promise.catch(
                function (error) {

                    console.warn(
                        "Music autoplay ditolak browser:",
                        error
                    );

                    Music.isPlaying =
                        false;

                    Music.updateButton();

                }
            );

        }

    };


    /* =====================================================
       07. PAUSE
    ===================================================== */

    Music.pause = function () {

        if (!this.audio) {
            return;
        }


        this.audio.pause();

    };


    /* =====================================================
       08. TOGGLE
    ===================================================== */

    Music.toggle = function () {

        if (!this.audio) {
            return;
        }


        if (
            this.audio.paused
        ) {

            this.play();

        } else {

            this.pause();

        }

    };


    /* =====================================================
       09. UPDATE BUTTON
    ===================================================== */

    Music.updateButton = function () {

        if (!this.button) {
            return;
        }


        const icon =
            this.button.querySelector(
                "[data-music-icon]"
            );


        const text =
            this.button.querySelector(
                "[data-music-text]"
            );


        if (this.isPlaying) {

            this.button.classList.add(
                "is-playing"
            );


            this.button.setAttribute(
                "aria-label",
                "Matikan musik"
            );


            if (icon) {

                icon.textContent =
                    "♫";

            }


            if (text) {

                text.textContent =
                    "Musik";

            }

        } else {

            this.button.classList.remove(
                "is-playing"
            );


            this.button.setAttribute(
                "aria-label",
                "Nyalakan musik"
            );


            if (icon) {

                icon.textContent =
                    "♪";

            }


            if (text) {

                text.textContent =
                    "Musik";

            }

        }

    };


    /* =====================================================
       10. SET VOLUME
    ===================================================== */

    Music.setVolume = function (
        value
    ) {

        if (!this.audio) {
            return;
        }


        let volume =
            Number(value);


        if (
            Number.isNaN(volume)
        ) {

            volume =
                this.volume;

        }


        volume =
            Math.max(
                0,
                Math.min(
                    1,
                    volume
                )
            );


        this.volume =
            volume;


        this.audio.volume =
            volume;

    };


    /* =====================================================
       11. CHANGE MUSIC
    ===================================================== */

    Music.changeTrack = function (
        source,
        autoplay = false
    ) {

        if (!source) {
            return;
        }


        const wasPlaying =
            this.isPlaying;


        this.audio.pause();


        this.audio.src =
            source;


        this.audio.load();


        if (
            autoplay ||
            wasPlaying
        ) {

            this.play();

        }

    };


    /* =====================================================
       12. PUBLIC API
    ===================================================== */

    window.InvitationMusic =
        Music;


    /* =====================================================
       13. DOM READY
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            Music.init();

        }
    );


})();
