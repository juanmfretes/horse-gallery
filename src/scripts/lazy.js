//// ACÁ SE IMPLEMENTA EL LAZY LOADING ////
class Lazy {
  auxSpacer;
  galleryLazyPics;
  sliderLazyPics;

  constructor() {
    this.auxSpacer = document.querySelector(".aux-div");
  }

  addLazy(galleryPics, sliderPics) {
    // if (true) return;
    this.galleryLazyPics = [...galleryPics]
      .slice(16)
      .map((div) => div.firstElementChild);

    this.sliderLazyPics = [...sliderPics]
      .slice(16)
      .map((div) => div.firstElementChild);

    console.log(this.galleryLazyPics[0]);
    console.log(this.sliderLazyPics[0]);

    //////// GALLERY OBSERVER ////////
    const galleryCallback = function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const galleryImage = entry.target;

          // get current image index (this.galleryLazyPics)
          // OBS: index = data-num - 17   (17 is the offset)
          const currentIndex = +galleryImage.parentElement.dataset.num - 17;

          // Get current slide image
          const slideImage = this.sliderLazyPics[currentIndex];

          // Replace "src" with "data-src" (load "real" images)
          galleryImage.src = galleryImage.dataset.src;
          slideImage.src = slideImage.dataset.src;

          // Remove lazy class when slide image finish loading (heavier)
          slideImage.addEventListener("load", function () {
            galleryImage.classList.remove("lazy");
          });

          // Unobserve current image
          observer.unobserve(galleryImage);
        }
      });
    }.bind(this);

    const galleryOptions = {
      root: null,
      threshold: 0,
      rootMargin: "0px 300px 200px",
    };

    const galleryObserver = new IntersectionObserver(
      galleryCallback,
      galleryOptions
    );
    // galleryObserver.observe(this.galleryLazyPics[1]);
    this.galleryLazyPics.forEach((img) => galleryObserver.observe(img));
  }

  showSpacer() {
    // Insert a div to avoid gallery enter in observer region entering "Slider mode"
    this.auxSpacer.classList.remove("hidden");
  }

  hideSpacer() {
    // remove div
    this.auxSpacer.classList.add("hidden");
  }
}

export default new Lazy();
