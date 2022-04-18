"use strict";
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
13. Ver si podés implementar un scroll infinito (moviendo los 10 primeros elementos del SliderItems y del gallery Items al final de la lista cada vez que se está cerca del final de la lista)
14. Poner una especie de "backdrop-filter" al frente de todo durante 5 segundos antes de mostrar la página. Usar el DOMContentLoaded Event. Hacer esto para que de tiempo de cargar un poco la página. Ver qué mensaje podés mostrar
[YA] 15. Crear un <button> que sirva para ocultar o mostrar las miniaturas (si se oculta, imagen ocupa la pantalla completa)
16. Añadir zoom a las imagenes
[YA] 17. Añadir boton para cerrar el "slider mode"
[YA] 18. Hacer que se maneje con teclas (flechas para pasar imagenes, escape para salir, abajo y arriba para ocultar/mostrar barra de miniaturas)
19. Aplicarle un normalizador css
20. Responsive design

*/

const sliderBox = document.querySelector(".slider-box");
const sliderItems = document.querySelectorAll(".slider-item");
const gallery = document.querySelector(".gallery");
const galleryItems = document.querySelectorAll(".gallery-item");
const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const btnClose = document.querySelector(".btn-close");
const btnHideShow = document.querySelector(".btn-hide-show");

// Medida para separar slides entre sí (ver cómo ejecutar esto cada vez que se entra al "Slider Mode")
const spacerSl =
  Number.parseFloat(getComputedStyle(sliderItems[0]).width) * 1.05;

// Medida para separar miniaturas entre sí (ver cómo ejecutar esto cada vez que se entra al "Slider Mode")
const spacerMin = Number.parseFloat(getComputedStyle(galleryItems[0]).width);

// Gestionar slides y Miniatures
let currentPic = 0; //guarda el slide/miniature (que está en grande)
const maxPic = sliderItems.length - 1; //guarda el máximo valor posible para currentPic

//Gestionar miniaturas
let currentMin = 0; //guarda la miniatura del slide actual
const limitLeftIndex = 2; // máximo translate (izq) de las miniaturas
const limitRightIndex = galleryItems.length - 3; // máximo translate (der) de las miniaturas
let minOffset = 0; // para centrar la miniatura actual
let hiddenMiniatureBar = false; // bandera para saber si se ocultó (o no) la barra de miniaturas

// Gestionar scroll
let scrollY; // guarda el ScrollYOffset

/* FUNCTIONS */
// SHOW SLIDER
const showSlider = function (el) {
  sliderBox.classList.remove("hidden");
  el.classList.add("active");
  galleryItems.forEach((miniature) => miniature.classList.add("miniature"));
  gallery.classList.add("spread");
};

// HIDE SLIDER
const hideSlider = function () {
  sliderBox.classList.add("hidden");
  galleryItems.forEach((miniature) =>
    miniature.classList.remove("miniature", "active")
  );
  galleryItems.forEach((miniature) =>
    miniature.style.setProperty("transform", "none")
  );
  gallery.classList.remove("spread");
};

// Show MINIATURE BAR or GALLERY
const showGalleryOrMiniatureBar = function () {
  gallery.classList.remove("hidden");
};

// Hide MINIATURE BAR or GALLERY
const HideGalleryOrMiniatureBar = function () {
  gallery.classList.add("hidden");
};

// HIDE/SHOW MINIAUTURES FUNCTIONALITY
const miniatureHideShow = function (hidden) {
  // if hidden => show bar; if not hidden => hide bar
  if (hidden) showGalleryOrMiniatureBar();
  else HideGalleryOrMiniatureBar();
  // change direction of btn arrow
  btnHideShow.textContent = hidden ? "↓" : "↑";
  // slider fullscreen
  sliderBox.classList.toggle("fullHeight", !hidden);
  // update flag state
  hiddenMiniatureBar = !hiddenMiniatureBar;
};

// CHANGE MINIATURE
const changeMiniature = function () {
  galleryItems.forEach((miniature, i) => {
    miniature.style.setProperty(
      "transform",
      `translateX(${(i - minOffset) * spacerMin}px)`
    );
  });
};

// ACTIVATE MINIATURE
const activateMiniature = function () {
  galleryItems.forEach((miniature) => miniature.classList.remove("active"));
  galleryItems[currentPic].classList.add("active");
};

// CHANGE SLIDE
const changeSlide = function () {
  sliderItems.forEach((slide, i) => {
    slide.style.setProperty(
      "transform",
      `translateX(${(i - currentPic) * spacerSl}px)`
    );
  });
};

// CLOSE SLIDER MODE
const closeSliderMode = function () {
  hideSlider();
  // Por si la barra de miniaturas esté oculta
  showGalleryOrMiniatureBar();
  // Mantener scroll vertical previo a entrar al Slider Moder
  window.scrollTo({
    top: scrollY,
  });
};

// UPDATE VIEW
const updateView = function () {
  // Change Slide
  changeSlide();
  // Change miniature
  changeMiniature();
  // Activate current miniature
  activateMiniature();
};

// PREVIOUS SLIDE
const previousSlide = function () {
  if (currentPic > 0) currentPic--;
  else {
    currentPic = maxPic;
    minOffset = maxPic - 4;
  }

  // Desplazar miniaturas hacia la derecha a medida que se pasan slides
  if (currentPic >= limitLeftIndex && currentPic < limitRightIndex) {
    minOffset--;
  }

  updateView();
};

// NEXT SLIDE
const nextSlide = function () {
  if (currentPic < maxPic) currentPic++;
  else {
    currentPic = 0;
    minOffset = 0;
  }

  // Desplazar miniaturas hacia la izquierda a medida que se pasan slides
  if (currentPic > limitLeftIndex && currentPic <= limitRightIndex) {
    minOffset++;
  }

  updateView();
};

// SAVE SCROLL DISTANCE
const saveScrollDistance = function () {
  scrollY = window.scrollY;
};

/* EVENT LISTENERS */
// Poner en "Grid Mode" al cargar la página
window.addEventListener("DOMContentLoaded", function () {
  hideSlider();
});

// ABRIR "Slider Mode"
gallery.addEventListener("click", function (event) {
  const element = event.target.closest(".gallery-item");
  // Casos especiales (null or inside Slider mode)
  if (!element) return;
  else if (element.classList.contains("miniature")) return;

  // Save Scroll Distance
  saveScrollDistance();

  // Manage Slide and Miniature
  currentPic = currentMin = element.dataset.num - 1;
  showSlider(element);
  changeSlide();
  if (currentPic < 2) minOffset = 0;
  else if (currentPic > limitRightIndex - 2) minOffset = limitRightIndex - 2;
  else minOffset = currentPic - 2;
  changeMiniature();

  // Ocultar la barra de miniaturas si es que se ocultó anteriormente
  if (hiddenMiniatureBar) {
    HideGalleryOrMiniatureBar();
  }
});

// CERRAR "Slider mode" (Método 1: Hacer click en el botón "X")
btnClose.addEventListener("click", function () {
  closeSliderMode();
});

// Cerrar "Slider mode" (Método 2: Presionar "Escape")
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && gallery.classList.contains("spread")) {
    closeSliderMode();
  }
});

// Ocultar/Mostrar la barra de miniaturas (Método 1: Usando btn "↑"/"↓")
btnHideShow.addEventListener("click", function () {
  miniatureHideShow(hiddenMiniatureBar);
});

// Ocultar/Mostrar la barra de miniaturas (Método 2: Usando flechas del teclado)
document.addEventListener("keydown", function (event) {
  if (sliderBox.classList.contains("hidden")) return;
  else if (
    (event.key === "ArrowUp" && hiddenMiniatureBar) ||
    (event.key === "ArrowDown" && !hiddenMiniatureBar)
  )
    miniatureHideShow(hiddenMiniatureBar);
});

// RIGHT SLIDER BUTTON (Método 1: Usando btn "➡")
btnRight.addEventListener("click", function () {
  nextSlide();
});

// RIGHT SLIDER BUTTON (Método 2: Usando la tecla "➡")
document.addEventListener("keydown", function (event) {
  if (sliderBox.classList.contains("hidden")) return;
  if (event.key === "ArrowRight") nextSlide();
});

// LEFT SLIDER BUTTON (Método 1: Usando btn "⬅")
btnLeft.addEventListener("click", function () {
  previousSlide();
});

// LEFT SLIDER BUTTON (Método 2: Usando la tecla "⬅")
document.addEventListener("keydown", function (event) {
  if (sliderBox.classList.contains("hidden")) return;
  if (event.key === "ArrowLeft") previousSlide();
});
