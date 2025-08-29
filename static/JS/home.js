
document.addEventListener("DOMContentLoaded", () => {
  // Sección del perfil y el menú de perfil
  const perfil = document.getElementById('perfil');
  const menuPerfil = document.getElementById('menu-perfil');

  if (perfil && menuPerfil) {
    perfil.onclick = function (e) {
      e.stopPropagation(); // Detenemos propagación del evento
      menuPerfil.classList.toggle('oculto');
    };

    // Evento global para cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function (e) {
      if (!perfil.contains(e.target) && !menuPerfil.contains(e.target)) {
        menuPerfil.classList.add('oculto');
      }
    });
  }

  // Sección de sugerencias de búsqueda
  const entrada = document.getElementById("entrada");
  const sugerenciasBox = document.getElementById("sugerencias");

  entrada.addEventListener("input", () => {
    const valor = entrada.value;

    if (valor.length > 0) {
      fetch(`/buscar?query=${valor}`)
        .then(res => res.json())
        .then(data => {
          sugerenciasBox.innerHTML = "";

          if (data.length > 0) {
            data.forEach(barrio => {
              const div = document.createElement("div");
              div.textContent = barrio;
              div.addEventListener("click", () => {
                entrada.value = barrio;
                sugerenciasBox.innerHTML = "";
              });
              sugerenciasBox.appendChild(div);
            });
          }
        });
    } else {
      sugerenciasBox.innerHTML = "";
    }
  });

  // Evento para cerrar las sugerencias si se hace clic fuera del formulario
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".form-container")) {
      sugerenciasBox.innerHTML = "";
    }
  });

  // Sección del selector de opciones
  const contenedor = document.getElementById('container-button');
  const selector = document.getElementById('selector');
  const opciones = document.getElementById('opciones');
  const inputSeleccion = document.getElementById('inputSeleccion');

  contenedor.addEventListener('click', (e) => {
    opciones.classList.toggle('oculto');
    e.stopPropagation();
  });

  document.querySelectorAll('.opcion').forEach(opcion => {
    opcion.addEventListener('click', (e) => {
      const texto = opcion.textContent;
      selector.textContent = texto;
      inputSeleccion.value = texto;
      opciones.classList.add('oculto');
      e.stopPropagation();
    });
  });

  // Cerrar el menú de opciones si se hace clic fuera de él
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target) && !opciones.contains(e.target)) {
      opciones.classList.add('oculto');
    }
  });

  // Sección de favorito con corazón
  const favorito = document.getElementById('favorito');
  const corazon = document.getElementById('corazon');

  favorito.addEventListener("click", () => {
    corazon.classList.toggle('marcado');
  });


  
});

document.addEventListener('DOMContentLoaded', () => {
  const botonAlquilar = document.getElementById('operacion-alquilar');
  const FondoBuscador = document.getElementById('img-prop')
  const botonComprar = document.getElementById('operacion-comprar');
  const seleccionOperacion = document.getElementById('seleccionOperacion');

  botonAlquilar.addEventListener('click', () => {
    seleccionOperacion.value='Alquiler';
    FondoBuscador.style.backgroundImage='radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/static/Imagenes/propiedad.avif)';
    botonAlquilar.style.backgroundColor = '#ab6c45';
    botonAlquilar.style.color = '#f9f6f2';
    botonComprar.style.color = 'black';
    botonComprar.style.backgroundColor = '#f9f6f2';
  });

  botonComprar.addEventListener('click', () => {
    seleccionOperacion.value='Venta';
    FondoBuscador.style.backgroundImage='radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/static/Imagenes/compra-img.webp)';
    botonComprar.style.backgroundColor = '#ab6c45';
    botonComprar.style.color = '#f9f6f2';
    botonAlquilar.style.color = 'black';
    botonAlquilar.style.backgroundColor = '#f9f6f2';
  });
});


