"use strict";
import "../../node_modules/core-js/stable";
import "../../node_modules/regenerator-runtime/runtime";

import Slider from "./slider.js";
import Gallery from "./gallery.js";
import Lazy from "./lazy.js";

/*
FALTA:
[YA] 1. Añadir data-num="número" a cada imagen "thumbnail"
[YA] 2. Crear un nodelist con la clase "slider-item"
[YA] 3. Ubicar los slider-items uno al lado del otro con transform()
[YA] 4. Hacer que la miniatura de la imagen que se muestra en "grande" se muestre con opacidad 100% (que funcione al cambiar de slide en slide)
[YA] 5.  Agregar botones para pasar de un slide al otro
[YA] 6. Hacer que pasen los slides con los botones
7. Ver cómo usar gestos
[YA] 8. Hacer que cuando se haga click en la imagen, se muestre la imagen "grande" y abajo una especie de miniaturas de cada imagen (Slider Mode)
[YA] 9. Hacer que al presionar "Escape" cuando se está en modo SLIDE vuelva  al modo grilla
[YA] 10. Hacer un "Code Refactor" (Hay mucho código repetido hasta ahora)
[ULTIMO Y YA PODÉS PUBLICAR]11. Hacer que se mantenga el scroll al salir del "Slider MODE"
12. Al hacer click en una miniatura, que se haga un scroll a las fotografías y lleve automáticamente hasta esa imagen en grande.
13. Ver si podés implementar un scroll infinito (moviendo los 10 primeros elementos del slides y del gallery Items al final de la lista cada vez que se está cerca del final de la lista)
14. Poner una especie de "backdrop-filter" al frente de todo durante 5 segundos antes de mostrar la página. Usar el DOMContentLoaded Event. Hacer esto para que de tiempo de cargar un poco la página. Ver qué mensaje podés mostrar
[YA] 15. Crear un <button> que sirva para ocultar o mostrar las miniaturas (si se oculta, imagen ocupa la pantalla completa)
16. Añadir zoom a las imagenes
[YA] 17. Añadir boton para cerrar el "slider mode"
[YA] 18. Hacer que se maneje con teclas (flechas para pasar imagenes, escape para salir, abajo y arriba para ocultar/mostrar barra de miniaturas)
19. Aplicarle un normalizador css
20. Responsive design

*/

// Gestionar slides y Miniatures
let currentPictureIndex = 0; // save current slide/miniature (slider mode)
const maxPictureIndex = Slider.slides.length - 1; // max value for currentPictureIndex

/* FUNCTIONS */
// SHOW SLIDER
const showSlider = function (galleryPic) {
  Slider.showSlides();

  if (!Gallery.hiddenMiniatureBar) {
    Slider.fullScreen();
  }
  Lazy.showSpacer();
  Gallery.enterMiniatureMode(galleryPic);
  setTimeout(() => {
    Lazy.hideSpacer();
    if (!Gallery.hiddenMiniatureBar) {
      Slider.fullScreen();
    }
  }, 320);
};

// HIDE SLIDER
const hideSlider = function () {
  Slider.hideSlides();
  Gallery.exitMiniatureMode();
};

// HIDE/SHOW MINIATURES FUNCTIONALITY
const miniatureBarHideShow = function () {
  // if hidden => show bar; if not hidden => hide bar
  if (Gallery.hiddenMiniatureBar) Gallery.showMiniatureBar();
  else Gallery.hideMiniatureBar();

  // update flag state
  Gallery.updateMiniatureHiddenState(); //hidden = true;

  // update arrow of btnHideShow (slider)
  Slider.updateHideShowBtn(Gallery.hiddenMiniatureBar);

  // slider fullscreen toggle
  Slider.fullScreen(Gallery.hiddenMiniatureBar);
};

// CLOSE SLIDER MODE
const closeSliderMode = function () {
  hideSlider();
  // Por si la barra de miniaturas esté oculta
  Gallery.showMiniatureBar();
  // Mantener scroll vertical previo a entrar al Slider Mode
  Gallery.restoreVerticalScroll();
};

// UPDATE VIEW
const updateView = function () {
  // Change Slide
  Slider.positionSlides(currentPictureIndex);
  // Change miniature
  Gallery.positionMiniatures();
  // Activate current miniature
  Gallery.activateMiniature(currentPictureIndex);
};

// PREVIOUS SLIDE
const previousSlide = function () {
  if (currentPictureIndex > 0) currentPictureIndex--;

  Gallery.decreaseMiniatureOffset(currentPictureIndex);

  updateView();
};

// NEXT SLIDE
const nextSlide = function () {
  if (currentPictureIndex < maxPictureIndex) currentPictureIndex++;

  Gallery.increaseMiniatureOffset(currentPictureIndex);

  updateView();
};

/* EVENT LISTENERS */
// Poner en "Grid Mode" al cargar la página
window.addEventListener("DOMContentLoaded", function () {
  console.log("entró");
  hideSlider();
});

// Activate lazy loading images
window.addEventListener("load", function (event) {
  Lazy.addLazy(Gallery.galleryPics, Slider.slides);
});

// ABRIR "Slider Mode"
Gallery.container.addEventListener("click", function (event) {
  const currentPictureEl = event.target.closest(".gallery-item");
  // Avoid activate if null
  if (!currentPictureEl) return;

  // Avoid activate in slider mode
  if (currentPictureEl.classList.contains("miniature")) return;

  // Save Scroll Distance
  Gallery.saveVerticalScroll();

  // Get current picture index
  currentPictureIndex = currentPictureEl.dataset.num - 1;

  showSlider(currentPictureEl);

  Slider.positionSlides(currentPictureIndex);

  Gallery.calculateMiniatureOffset(currentPictureIndex);

  Gallery.positionMiniatures();

  // Ocultar la barra de miniaturas si es que se ocultó anteriormente
  if (Gallery.hiddenMiniatureBar) {
    Gallery.hideMiniatureBar();
  }
});

// CERRAR "Slider mode" (Método 1: Hacer click en el botón "X")
Slider.btnClose.addEventListener("click", function () {
  closeSliderMode();
});

// Cerrar "Slider mode" (Método 2: Presionar "Escape")
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    Gallery.container.classList.contains("spread")
  ) {
    closeSliderMode();
  }
});

// Ocultar/Mostrar la barra de miniaturas (Método 1: Usando btn "↑"/"↓")
Slider.btnHideShow.addEventListener("click", function () {
  miniatureBarHideShow();
});

// Ocultar/Mostrar la barra de miniaturas (Método 2: Usando flechas del teclado)
document.addEventListener("keydown", function (event) {
  if (!Gallery.container.classList.contains("spread")) return;
  else if (
    (event.key === "ArrowUp" && Gallery.hiddenMiniatureBar) ||
    (event.key === "ArrowDown" && !Gallery.hiddenMiniatureBar)
  )
    miniatureBarHideShow();
});

// RIGHT SLIDER BUTTON (Método 1: Usando btn "➡")
Slider.btnRight.addEventListener("click", function () {
  nextSlide();
});

// RIGHT SLIDER BUTTON (Método 2: Usando la tecla "➡")
document.addEventListener("keydown", function (event) {
  if (Slider.container.classList.contains("hidden")) return;
  if (event.key === "ArrowRight") nextSlide();
});

// LEFT SLIDER BUTTON (Método 1: Usando btn "⬅")
Slider.btnLeft.addEventListener("click", function () {
  previousSlide();
});

// LEFT SLIDER BUTTON (Método 2: Usando la tecla "⬅")
document.addEventListener("keydown", function (event) {
  if (Slider.container.classList.contains("hidden")) return;
  if (event.key === "ArrowLeft") previousSlide();
});
