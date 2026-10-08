"use strict";

/*
=========================================
IMAGE SLIDER LIBRARY
=========================================

Features:
- Previous and Next buttons
- Dynamic navigation dots
- Clickable dots
- Smooth horizontal animation
- Infinite looping
=========================================
*/


/* Get required HTML elements */
const track = document.getElementById("track");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const dotsBox = document.getElementById("dots");


/* Get all original slides */
const slides = Array.from(
    document.querySelectorAll(".slide")
);

const total = slides.length;


/*
    Index 1 represents the first real image.
    Index 0 will contain the cloned last image.
*/
let index = 1;
let moving = false;


/* ==============================
   CREATE CLONES
   ============================== */

/* Clone the first and last slides */
const firstClone = slides[0].cloneNode(true);
const lastClone =
    slides[total - 1].cloneNode(true);

/* Add clones for infinite looping */
track.appendChild(firstClone);
track.prepend(lastClone);


/* ==============================
   CREATE NAVIGATION DOTS
   ============================== */

/*
    One dot is created for each
    original image.
*/
slides.forEach((slide, i) => {

    const dot = document.createElement("button");

    dot.className = "dot";
    dot.type = "button";

    dot.setAttribute(
        "aria-label",
        `Go to slide ${i + 1}`
    );

    /* Move directly to selected image */
    dot.addEventListener("click", () => {

        if (moving) return;

        index = i + 1;
        move(true);
    });

    dotsBox.appendChild(dot);
});


/* ==============================
   MOVE SLIDER
   ============================== */

function move(animation = true) {

    /*
        Each slide occupies 100% of
        the viewport width.
    */
    track.style.transition = animation
        ? "transform 0.5s ease-in-out"
        : "none";

    track.style.transform =
        `translateX(-${index * 100}%)`;

    updateDots();
}


/* ==============================
   UPDATE DOTS
   ============================== */

function updateDots() {

    let active = index - 1;

    /* Show last dot for cloned last image */
    if (index === 0) {
        active = total - 1;
    }

    /* Show first dot for cloned first image */
    if (index === total + 1) {
        active = 0;
    }

    document.querySelectorAll(".dot").forEach(
        (dot, i) => {

            dot.classList.toggle(
                "active",
                i === active
            );
        }
    );
}


/* ==============================
   NEXT BUTTON
   ============================== */

next.addEventListener("click", () => {

    if (moving) return;

    moving = true;
    index++;
    move(true);
});


/* ==============================
   PREVIOUS BUTTON
   ============================== */

prev.addEventListener("click", () => {

    if (moving) return;

    moving = true;
    index--;
    move(true);
});


/* ==============================
   INFINITE LOOP
   ============================== */

track.addEventListener(
    "transitionend",
    () => {

        /*
            When the cloned first image is reached,
            jump to the real first image.
        */
        if (index === total + 1) {
            index = 1;
            move(false);
        }

        /*
            When the cloned last image is reached,
            jump to the real last image.
        */
        if (index === 0) {
            index = total;
            move(false);
        }

        moving = false;
        updateDots();
    }
);


/* ==============================
   KEYBOARD CONTROLS
   ============================== */

document.addEventListener("keydown", event => {

    if (event.key === "ArrowRight") {
        next.click();
    }

    if (event.key === "ArrowLeft") {
        prev.click();
    }
});


/* Start on the first image */
move(false);
