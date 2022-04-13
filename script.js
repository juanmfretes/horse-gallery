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
8. Hacer que cuando se haga click en la imagen se muestre la imagen "grande" y abajo una especie de miniaturas de cada imagen (modificando el "gallery" container)
9. Hacer que al presionar "Escape" cuando se está en modo SLIDE vuelva  al modo grilla
10. Ver si podés implementar un scroll infinito (moviendo los 10 primeros elementos del SliderItems y del gallery Items al final de la lista cada vez que se está cerca del final de la lista)
11. Poner una especie de "backdrop-filter" al frente de todo durante 5 segundos antes de mostrar la página. Usar el DOMContentLoaded Event. Hacer esto para que de tiempo de cargar un poco la página. Ver qué mensaje podés mostar
12. Crear un <button> que sirva para ocultar o mostrar las miniaturas (si se oculta, imagen ocupa la pantalla completa)
13. Añadir zoom a las imagenes
14. Añadir boton para cerrar el "slider mode"
*/

const sliderBox = document.querySelector(".slider-box");
const sliderItems = document.querySelectorAll(".slider-item");
const gallery = document.querySelector(".gallery");
const galleryItems = document.querySelectorAll(".gallery-item");
const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const btnClose = document.querySelector(".btn-close");
const btnHideShow = document.querySelector(".btn-hide-show");

// Medida para separar slides entre sí
const spacerSl =
  Number.parseFloat(getComputedStyle(sliderItems[0]).width) * 1.05;
console.log(spacerSl);

// Medida para separar miniaturas entre sí
const spacerMin = Number.parseFloat(getComputedStyle(galleryItems[0]).width);
console.log(spacerMin);

// Gestionar slides y Miniatures
let currentPic = 0; //guarda el slide/miniature (que está en grande)
const maxPic = sliderItems.length - 1; //guarda el máximo valor posible para currentPic

//Gestionar miniaturas
let currentMin = 0; //guarda la miniatura del slide actual
const limitLeftIndex = 2; // máximo translate (izq) de las miniaturas
const limitRightIndex = galleryItems.length - 3; // máximo translate (der) de las miniaturas
let minOffset = 0; // para centrar la miniatura actual

/* FUNCTIONS */
// PONER EN "SLIDE" MODE
const displaySlides = function () {
  sliderItems.forEach((slide, i) => {
    slide.style.setProperty("transform", `translateX(${i * spacerSl}px)`);
  });
};

const displayMiniatures = function () {
  galleryItems.forEach((miniature, i) => {
    miniature.style.setProperty("transform", `translateX(${i * spacerMin}px)`);
  });
};

// CUANDO SE HACE CLICK EN UNA IMAGEN, LLAMAR A ESTAS FUNCIONES
displaySlides();
displayMiniatures();

// Cerrar "Slider mode"
btnClose.addEventListener("click", function () {
  sliderBox.classList.add("hidden");
  galleryItems.forEach((miniature) =>
    miniature.classList.remove("miniature", "active")
  );
  galleryItems.forEach((miniature) =>
    miniature.style.setProperty("transform", "none")
  );
  gallery.classList.remove("spread");
  // Por si la barra de miniaturas esté oculta
  gallery.classList.remove("hidden");
});

// Ocultar la barra de miniaturas
btnHideShow.addEventListener("click", function () {
  if (gallery.classList.contains("hidden")) {
    // Desplegar barra de miniaturas
    gallery.classList.remove("hidden");
    // Cambiar direccion de la flecha del btn
    btnHideShow.textContent = "↓";
    // Quitar el "fullscreen mode"
    sliderBox.classList.remove("fullHeight");
  } else {
    // Ocultar barra de miniaturas
    gallery.classList.add("hidden");
    // Cambiar direccion de la flecha del btn
    btnHideShow.textContent = "↑";
    // Agregar el "fullscreen mode"
    sliderBox.classList.add("fullHeight");
  }
});

/* EVENT LISTENERS */
// Right slider button
btnRight.addEventListener("click", function () {
  if (currentPic < maxPic) currentPic++;
  else {
    currentPic = 0;
    minOffset = 0;

    // Translate miniatures (repetido)
    galleryItems.forEach((miniature, i) => {
      miniature.style.setProperty(
        "transform",
        `translateX(${(i - minOffset) * spacerMin}px)`
      );
    });
  }

  // Modify Slides
  sliderItems.forEach((slide, i) => {
    slide.style.setProperty(
      "transform",
      `translateX(${(i - currentPic) * spacerSl}px)`
    );
  });

  // Translate Miniatures
  if (currentPic > limitLeftIndex && currentPic <= limitRightIndex) {
    minOffset++;
    console.log(minOffset);
    galleryItems.forEach((miniature, i) => {
      miniature.style.setProperty(
        "transform",
        `translateX(${(i - minOffset) * spacerMin}px)`
      );
    });
  }

  // Modify Miniatures
  galleryItems.forEach((miniature) => miniature.classList.remove("active"));
  galleryItems[currentPic].classList.add("active");
});

// Left slider button
btnLeft.addEventListener("click", function () {
  if (currentPic > 0) currentPic--;
  else {
    currentPic = maxPic;
    minOffset = maxPic - 4;

    // Translate miniatures (repetido)
    galleryItems.forEach((miniature, i) => {
      miniature.style.setProperty(
        "transform",
        `translateX(${(i - minOffset) * spacerMin}px)`
      );
    });
  }

  // Modify Slides
  sliderItems.forEach((slide, i) => {
    slide.style.setProperty(
      "transform",
      `translateX(${(i - currentPic) * spacerSl}px)`
    );
  });

  // Translate Miniatures
  if (currentPic >= limitLeftIndex && currentPic < limitRightIndex) {
    minOffset--;
    console.log(minOffset);
    galleryItems.forEach((miniature, i) => {
      miniature.style.setProperty(
        "transform",
        `translateX(${(i - minOffset) * spacerMin}px)`
      );
    });
  }

  // Modify Miniatures
  galleryItems.forEach((miniature) => miniature.classList.remove("active"));
  galleryItems[currentPic].classList.add("active");
});
