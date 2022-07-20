class Slider {
  container;
  slides;
  spacerSlides;
  btnLeft;
  btnRight;
  btnClose;
  btnHideShow;

  constructor() {
    this.container = document.querySelector(".slider-box");
    this.slides = document.querySelectorAll(".slider-item");
    this.spacerSlides =
      Number.parseFloat(getComputedStyle(this.slides[0]).width) * 1.05;
    this.btnLeft = document.querySelector(".btn-left");
    this.btnRight = document.querySelector(".btn-right");
    this.btnClose = document.querySelector(".btn-close");
    this.btnHideShow = document.querySelector(".btn-hide-show");

    /* Events Listeners */

    ////////////////////  LOAD HD IMAGES ////////////////////
    // OBS: reacciona al primer "load" (de la pagina completa)
    const body = document.body;
    console.log(body);
    body.addEventListener("load", function (event) {
      console.log(event.target);
    });
  }

  showSlides() {
    this.container.classList.remove("hidden");
  }

  hideSlides() {
    this.container.classList.add("hidden");
  }

  positionSlides(currentPictureIndex) {
    this.slides.forEach((slide, i) => {
      slide.style.setProperty(
        "transform",
        `translateX(${(i - currentPictureIndex) * this.spacerSlides}px)`
      );
    });
  }

  updateHideShowBtn(hidden) {
    this.btnHideShow.textContent = hidden ? "↑" : "↓";
  }

  fullScreen(hidden) {
    this.container.classList.toggle("fullHeight", hidden);
  }
}

export default new Slider();
