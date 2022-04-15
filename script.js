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
10. Hacer un "Code Refactor" (Hay mucho código repetido hasta ahora)
11. Hacer que se mantenga el scroll al salir del "Slider MODE"
12. Al hacer click en una miniatura, que se haga un scroll a las fotografías y lleve automáticamente hasta esa imagen en grande.
13. Ver si podés implementar un scroll infinito (moviendo los 10 primeros elementos del SliderItems y del gallery Items al final de la lista cada vez que se está cerca del final de la lista)
14. Poner una especie de "backdrop-filter" al frente de todo durante 5 segundos antes de mostrar la página. Usar el DOMContentLoaded Event. Hacer esto para que de tiempo de cargar un poco la página. Ver qué mensaje podés mostrar
[YA] 15. Crear un <button> que sirva para ocultar o mostrar las miniaturas (si se oculta, imagen ocupa la pantalla completa)
16. Añadir zoom a las imagenes
[YA] 17. Añadir boton para cerrar el "slider mode"
18. Hacer que se maneje con teclas (flechas para pasar imagenes, escape para salir, abajo y arriba para ocultar/mostrar barra de miniaturas)
19. Aplicarle un normalizador css

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
console.log(spacerSl);

// Medida para separar miniaturas entre sí (ver cómo ejecutar esto cada vez que se entra al "Slider Mode")
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
let hiddenMiniatureBar = false; // bandera para saber si se cerró o no la barra de miniaturas

/* FUNCTIONS */
// PONER EN "SLIDE" MODE (CREO QUE PODÉS BORRAR ESTAS DOS FUNCIONES. ANALZAR TODO EL CÓDIGO PRIMERO PARA VER SI ES ASÍ)
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

/* EVENT LISTENERS */
// Poner en "Grid Mode" al cargar la página
window.addEventListener("DOMContentLoaded", function () {
  sliderBox.classList.add("hidden");
  galleryItems.forEach((miniature) =>
    miniature.classList.remove("miniature", "active")
  );
  galleryItems.forEach((miniature) =>
    miniature.style.setProperty("transform", "none")
  );
  gallery.classList.remove("spread");
});

// Entrar al "Slider Mode"
gallery.addEventListener("click", function (event) {
  const element = event.target.closest(".gallery-item");
  if (!element) return;
  else if (element.classList.contains("miniature")) {
    console.log("miniature");
    return;
  }
  currentPic = currentMin =
    event.target.closest(".gallery-item").dataset.num - 1;
  sliderBox.classList.remove("hidden");
  event.target.closest(".gallery-item").classList.add("active");
  galleryItems.forEach((miniature) => miniature.classList.add("miniature"));
  gallery.classList.add("spread");
  // displayMiniatures();
  // displaySlides();
  sliderItems.forEach((slide, i) => {
    slide.style.setProperty(
      "transform",
      `translateX(${(i - currentPic) * spacerSl}px)`
    );
  });
  if (currentPic < 2) minOffset = 0;
  else if (currentPic > limitRightIndex - 2) minOffset = limitRightIndex - 2;
  else minOffset = currentPic - 2;
  galleryItems.forEach((miniature, i) => {
    miniature.style.setProperty(
      "transform",
      `translateX(${(i - minOffset) * spacerMin}px)`
    );
  });

  // Ocultar la barra de miniaturas si es que se ocultó anteriormente
  if (hiddenMiniatureBar) {
    // Ocultar barra de miniaturas
    gallery.classList.add("hidden");
  }
});

// Cerrar "Slider mode" (Método 1: Hacer click en el botón "X")
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

// Cerrar "Slider mode" (Método 2: Presionar "Escape")
document.addEventListener("keydown", function (event) {
  console.log("captó evento");
  if (event.key === "Escape" && gallery.classList.contains("spread")) {
    console.log("entró");
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
  }
});

// Ocultar la barra de miniaturas
btnHideShow.addEventListener("click", function () {
  // 1. Si estaba oculta, 2. Si estaba visible
  if (hiddenMiniatureBar) {
    // Desplegar barra de miniaturas
    gallery.classList.remove("hidden");
    // Cambiar direccion de la flecha del btn
    btnHideShow.textContent = "↓";
    // Quitar el "fullscreen mode"
    sliderBox.classList.remove("fullHeight");
    // Modificar bandera
    hiddenMiniatureBar = !hiddenMiniatureBar;
  } else {
    // Ocultar barra de miniaturas
    gallery.classList.add("hidden");
    // Cambiar direccion de la flecha del btn
    btnHideShow.textContent = "↑";
    // Agregar el "fullscreen mode"
    sliderBox.classList.add("fullHeight");
    // Modificar bandera
    hiddenMiniatureBar = !hiddenMiniatureBar;
  }

  console.log(hiddenMiniatureBar);
});

// RIGHT SLIDER BUTTON
btnRight.addEventListener("click", function () {
  console.log(minOffset);
  if (currentPic < maxPic) currentPic++;
  else {
    currentPic = 0;
    minOffset = 0;

    // Translate miniatures (repetido) [Sólo para pasar de extremo a otro]
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

  // Translate Miniatures (Pasa a la miniatura de al lado)
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

// LEFT SLIDER BUTTON
btnLeft.addEventListener("click", function () {
  if (currentPic > 0) currentPic--;
  else {
    currentPic = maxPic;
    minOffset = maxPic - 4;

    // Translate miniatures (repetido) [Sólo para pasar de extremo a otro]
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

  // Translate Miniatures (Pasa a la miniatura de al lado)
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
