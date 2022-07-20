class Gallery {
  container;
  galleryPics;
  spacerMiniatures;
  miniatureOffset;
  leftLimitMiniatureIndex;
  rightLimitMiniatureIndex;
  hiddenMiniatureBar; /* true: visible bar - false: hidden bar (in Slider Mode) */
  verticalScroll;

  constructor() {
    this.container = document.querySelector(".gallery");
    this.galleryPics = document.querySelectorAll(".gallery-item");
    this.lazyPics = [...this.galleryPics]
      .slice(16)
      .map((div) => div.firstElementChild);
    this.spacerMiniatures = Number.parseFloat(
      getComputedStyle(this.galleryPics[0]).width
    ); // miniatures width in slider mode
    this.miniatureOffset = 0; // to center the miniature of the current Slide
    this.leftLimitMiniatureIndex = 2; // maximum scroll LEFT of thumbnails in slider mode (in the center will be the picture with index = 2)
    this.rightLimitMiniatureIndex = this.galleryPics.length - 3; // maximum scroll RIGHT of thumbnails in slider mode (in the center will be the picture with index = maxPictureIndex - 2)
    this.hiddenMiniatureBar = false; // ¿miniature bar is hidden? (boolean)

    /* Observers for lazy loading*/
    /* Hay 2 observadores:
      1) Observa las imagenes en la galería (root margin => bottom 200px)
      RESP => al "activarse" una imagen de la galería, ésta obtiene el slide image correspondiente y cambia el "src" de ambas a la vez. Recién cuando el "slide image" termina de cargar se remueve la clase "lazy" (se hace así ya que esa imagen es la que más va a tardar en descargarse)

      OBS: 
      # ver cómo cargar las miniaturas cuando están en slider mode pasando las imagenes
      RESP => FIX: al entrar en slider mode, como las imagen se ponen todas una encima de la otra, se activa en "load" de todas las imagenes a la vez (justo lo que no queres que pase)

      # POSIBLES SOLUCIONES (2)
      TODO 1: Agregar un <div> con cierto "height" que se active antes de convertir la galería a "miniatura", de modo que quede fuera de la región del observer. De esa forma, no se activarán imágenes innecesarias.
      RESP => Funcionó esta solución

      # ver si usas una imagen ligera para el placeholder de los Slides
      RESP => Se usa una misma imagen gris como placeholder para todas (~4.5 kb)
    */
  }

  /////////////// METHODS ///////////////

  enterMiniatureMode(galleryPic) {
    galleryPic.classList.add("active");
    this.galleryPics.forEach((miniature) =>
      miniature.classList.add("miniature")
    );
    this.container.classList.add("spread");
  }

  exitMiniatureMode() {
    this.galleryPics.forEach((miniature) =>
      miniature.classList.remove("miniature", "active")
    );
    /* remove changes added by "changeSlide" function */
    this.galleryPics.forEach((miniature) =>
      miniature.style.setProperty("transform", "none")
    );
    this.container.classList.remove("spread");
  }

  calculateMiniatureOffset(currentPictureIndex) {
    // Case 1: Current picture is the 1th or 2nd one
    if (currentPictureIndex < 2) return (this.miniatureOffset = 0);

    // Case 2: Current picture is the penultimate or the last one.
    if (currentPictureIndex > this.rightLimitMiniatureIndex - 2)
      return (this.miniatureOffset = this.rightLimitMiniatureIndex - 2);

    // Case 3: Any other case
    this.miniatureOffset = currentPictureIndex - 2;
  }

  positionMiniatures() {
    this.galleryPics.forEach((miniature, i) => {
      miniature.style.setProperty(
        "transform",
        `translateX(${(i - this.miniatureOffset) * this.spacerMiniatures}px)`
      );
    });
  }

  increaseMiniatureOffset(currentPictureIndex) {
    // Obs: Entender por qué uno tiene ">" y el otro ">="
    if (
      currentPictureIndex > this.leftLimitMiniatureIndex &&
      currentPictureIndex <= this.rightLimitMiniatureIndex
    ) {
      this.miniatureOffset++;
    }
  }

  decreaseMiniatureOffset(currentPictureIndex) {
    // Obs: Entender por qué uno tiene "<" y el otro "<="
    if (
      currentPictureIndex >= this.leftLimitMiniatureIndex &&
      currentPictureIndex < this.rightLimitMiniatureIndex
    ) {
      this.miniatureOffset--;
    }
  }

  activateMiniature(currentPictureIndex) {
    this.galleryPics.forEach((miniature) =>
      miniature.classList.remove("active")
    );
    this.galleryPics[currentPictureIndex].classList.add("active");
  }

  saveVerticalScroll() {
    this.verticalScroll = window.scrollY;
  }

  restoreVerticalScroll() {
    window.scrollTo({
      top: this.verticalScroll,
    });
  }

  showMiniatureBar() {
    this.container.classList.remove("hidden");
  }

  hideMiniatureBar() {
    this.container.classList.add("hidden");
  }

  updateMiniatureHiddenState() {
    this.hiddenMiniatureBar = !this.hiddenMiniatureBar;
    console.log(this.hiddenMiniatureBar);
  }
}

export default new Gallery();
