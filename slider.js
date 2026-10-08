"use strict";

/*
=========================================================
IMAGE SLIDER LIBRARY
JavaScript
=========================================================
*/


class ImageSlider {

    constructor(sliderElement) {

        /* Main slider */
        this.slider = sliderElement;


        /* Slider track */
        this.track =
            this.slider.querySelector("#sliderTrack");


        /* Previous button */
        this.previousButton =
            this.slider.querySelector("#previousButton");


        /* Next button */
        this.nextButton =
            this.slider.querySelector("#nextButton");


        /* Dot container */
        this.dotsContainer =
            this.slider.querySelector("#sliderDots");


        /*
            Get all original slides.

            There should be exactly 4 slides
            in this project.
        */
        this.originalSlides =
            Array.from(
                this.track.querySelectorAll(".slide")
            );


        /* Number of original images */
        this.totalSlides =
            this.originalSlides.length;


        /*
            First real slide is index 1 because
            we add a clone before it.
        */
        this.currentIndex = 1;


        /*
            Prevents users from clicking multiple
            times during animation.
        */
        this.isTransitioning = false;


        /* Start the slider */
        this.init();
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    init() {

        /*
            Make sure there are at least two slides.
        */
        if (this.totalSlides < 2) {

            console.error(
                "Image Slider requires at least 2 images."
            );

            return;
        }


        /*
            Clone the LAST image.
        */
        const lastSlide =
            this.originalSlides[
                this.totalSlides - 1
            ].cloneNode(true);


        /*
            Clone the FIRST image.
        */
        const firstSlide =
            this.originalSlides[0]
                .cloneNode(true);


        /*
            Add the cloned last slide
            before the first slide.
        */
        this.track.prepend(lastSlide);


        /*
            Add the cloned first slide
            after the last slide.
        */
        this.track.appendChild(firstSlide);


        /*
            Create exactly one dot
            for every ORIGINAL slide.
        */
        this.createDots();


        /*
            Connect buttons and events.
        */
        this.bindEvents();


        /*
            Start at the first real image.
        */
        this.updatePosition(false);


        /*
            Activate first dot.
        */
        this.updateDots();
    }


    /* =====================================================
       CREATE DOTS
       ===================================================== */

    createDots() {

        /*
            Clear any existing dots.
        */
        this.dotsContainer.innerHTML = "";


        /*
            Create one dot per ORIGINAL image.
        */
        for (
            let index = 0;
            index < this.totalSlides;
            index++
        ) {

            const dot =
                document.createElement("button");


            /* Button type */
            dot.type = "button";


            /* CSS class */
            dot.classList.add("slider-dot");


            /* Accessibility label */
            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );


            /*
                Clicking a dot goes directly
                to that image.
            */
            dot.addEventListener(
                "click",
                () => {

                    this.goToSlide(index + 1);
                }
            );


            /*
                Add dot to the page.
            */
            this.dotsContainer.appendChild(dot);
        }
    }


    /* =====================================================
       EVENT LISTENERS
       ===================================================== */

    bindEvents() {

        /*
            Previous button.
        */
        this.previousButton.addEventListener(
            "click",
            () => {
                this.previous();
            }
        );


        /*
            Next button.
        */
        this.nextButton.addEventListener(
            "click",
            () => {
                this.next();
            }
        );


        /*
            Detect when CSS animation finishes.
        */
        this.track.addEventListener(
            "transitionend",
            () => {
                this.handleTransitionEnd();
            }
        );


        /*
            Keyboard navigation.

            Left arrow = previous
            Right arrow = next
        */
        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "ArrowLeft") {

                    this.previous();
                }

                if (event.key === "ArrowRight") {

                    this.next();
                }
            }
        );


        /*
            Recalculate slider position
            when browser is resized.
        */
        window.addEventListener(
            "resize",
            () => {

                this.updatePosition(false);
            }
        );
    }


    /* =====================================================
       NEXT
       ===================================================== */

    next() {

        /*
            Do not allow another click while
            animation is running.
        */
        if (this.isTransitioning) {
            return;
        }


        /*
            Move forward.
        */
        this.currentIndex++;


        /*
            Start animation.
        */
        this.isTransitioning = true;


        /*
            Move track.
        */
        this.updatePosition(true);


        /*
            Update dot.
        */
        this.updateDots();
    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    previous() {

        /*
            Prevent multiple clicks.
        */
        if (this.isTransitioning) {
            return;
        }


        /*
            Move backward.
        */
        this.currentIndex--;


        /*
            Start animation.
        */
        this.isTransitioning = true;


        /*
            Move track.
        */
        this.updatePosition(true);


        /*
            Update dot.
        */
        this.updateDots();
    }


    /* =====================================================
       GO TO SPECIFIC SLIDE
       ===================================================== */

    goToSlide(index) {

        /*
            Prevent multiple animations.
        */
        if (this.isTransitioning) {
            return;
        }


        /*
            Set selected slide.
        */
        this.currentIndex = index;


        /*
            Start animation.
        */
        this.isTransitioning = true;


        /*
            Move track.
        */
        this.updatePosition(true);


        /*
            Update active dot.
        */
        this.updateDots();
    }


    /* =====================================================
       UPDATE POSITION
       ===================================================== */

    updatePosition(animate = true) {

        /*
            Each slide is 100% wide.

            Example:

            index 1 = -100%
            index 2 = -200%
            index 3 = -300%
            index 4 = -400%
        */
        const movement =
            -(this.currentIndex * 100);


        /*
            Enable or disable animation.
        */
        if (animate) {

            this.track.style.transition =
                "transform 0.5s ease-in-out";

        } else {

            this.track.style.transition =
                "none";
        }


        /*
            Move track horizontally.
        */
        this.track.style.transform =
            `translateX(${movement}%)`;
    }


    /* =====================================================
       UPDATE DOTS
       ===================================================== */

    updateDots() {

        /*
            Convert internal index into
            original image index.
        */
        let activeIndex =
            this.currentIndex - 1;


        /*
            If displaying cloned last image.
        */
        if (this.currentIndex === 0) {

            activeIndex =
                this.totalSlides - 1;
        }


        /*
            If displaying cloned first image.
        */
        if (
            this.currentIndex ===
            this.totalSlides + 1
        ) {

            activeIndex = 0;
        }


        /*
            Find all dots.
        */
        const dots =
            this.dotsContainer.querySelectorAll(
                ".slider-dot"
            );


        /*
            Update each dot.
        */
        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === activeIndex
                );
            }
        );
    }


    /* =====================================================
       HANDLE LOOPING
       ===================================================== */

    handleTransitionEnd() {

        /*
            We moved backward from the first image.

            The slider is now showing the cloned
            final image.
        */
        if (this.currentIndex === 0) {

            /*
                Remove animation.
            */
            this.track.style.transition =
                "none";


            /*
                Move instantly to the REAL
                final image.
            */
            this.currentIndex =
                this.totalSlides;


            /*
                Update position.
            */
            this.updatePosition(false);


            /*
                Force browser reflow.
            */
            void this.track.offsetWidth;


            /*
                Restore animation.
            */
            this.track.style.transition =
                "transform 0.5s ease-in-out";
        }


        /*
            We moved forward from the final image.

            The slider is now showing the cloned
            first image.
        */
        if (
            this.currentIndex ===
            this.totalSlides + 1
        ) {

            /*
                Remove animation.
            */
            this.track.style.transition =
                "none";


            /*
                Move instantly to REAL first image.
            */
            this.currentIndex = 1;


            /*
                Update position.
            */
            this.updatePosition(false);


            /*
                Force browser reflow.
            */
            void this.track.offsetWidth;


            /*
                Restore animation.
            */
            this.track.style.transition =
                "transform 0.5s ease-in-out";
        }


        /*
            Animation has finished.
        */
        this.isTransitioning = false;


        /*
            Make sure correct dot is active.
        */
        this.updateDots();
    }
}


/* =========================================================
   START SLIDER
   ========================================================= */


/*
    Find the slider on the page.
*/
const sliderElement =
    document.querySelector(".slider");


/*
    Create the slider.
*/
if (sliderElement) {

    new ImageSlider(sliderElement);
}