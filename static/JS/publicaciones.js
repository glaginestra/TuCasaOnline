
const perfil=document.getElementById('perfil');
const menuPerfil=document.getElementById('menu-perfil');

const menuComprar = document.getElementById('menu-comprar')
const buttonComprar = document.getElementById('comprar')
const flechaComprar = document.getElementById('flecha-comprar')

const menuDepa = document.getElementById('menu-departamento')
const buttonDepa = document.getElementById('departamento')
const flechaDepa = document.getElementById('flecha-departamento')

const menuAmb = document.getElementById('menu-amb')
const buttonAmb = document.getElementById('amb')
const flechaAmb = document.getElementById('flecha-amb')


const menuPrecio = document.getElementById('menu-precio')
const buttonPrecio = document.getElementById('precio')
const flechaPrecio = document.getElementById('flecha-precio')



const monedaPeso = document.getElementById('peso');
const monedaDolar = document.getElementById('dolar');
const guardaMoneda = document.getElementById('guardar-moneda');

const entrada = document.getElementById("barrio");
const sugerenciasBox = document.getElementById("sugerencias");

if (perfil && menuPerfil) {
  perfil.addEventListener('click', (e) => {
    e.stopPropagation();
    menuPerfil.classList.toggle('oculto');
  });
}

if (entrada && sugerenciasBox) {
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

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".container-barrio")) {
      sugerenciasBox.innerHTML = "";
    }
  });
}

document.addEventListener('click', function(e) {
  if (perfil && menuPerfil && !perfil.contains(e.target) && !menuPerfil.contains(e.target)) {
    menuPerfil.classList.add('oculto');
  }

  if (buttonComprar && menuComprar && !buttonComprar.contains(e.target) && !menuComprar.contains(e.target)) {
    menuComprar.classList.add('oculto');
    flechaDepa?.classList.remove('vuelta');
    flechaAmb?.classList.remove('vuelta');
    flechaPrecio?.classList.remove('vuelta');
  }

  if (buttonDepa && menuDepa && !buttonDepa.contains(e.target) && !menuDepa.contains(e.target)) {
    menuDepa.classList.add('oculto');
    flechaComprar?.classList.remove('vuelta');
    flechaAmb?.classList.remove('vuelta');
    flechaPrecio?.classList.remove('vuelta');
  }

  if (buttonAmb && menuAmb && !buttonAmb.contains(e.target) && !menuAmb.contains(e.target)) {
    menuAmb.classList.add('oculto');
    flechaComprar?.classList.remove('vuelta');
    flechaDepa?.classList.remove('vuelta');
    flechaPrecio?.classList.remove('vuelta');
    flechaAmb?.classList.remove('vuelta'); // No se repite ahora
  }

  if (buttonPrecio && menuPrecio && !buttonPrecio.contains(e.target) && !menuPrecio.contains(e.target)) {
    menuPrecio.classList.add('oculto');
    flechaComprar?.classList.remove('vuelta');
    flechaDepa?.classList.remove('vuelta');
    flechaAmb?.classList.remove('vuelta');
    flechaPrecio?.classList.remove('vuelta');
  }
});

const favorito = document.getElementById('favorito');
const corazon = document.getElementById('corazon');

if (favorito && corazon) {
  favorito.addEventListener("click", (e) => {
    e.stopPropagation();
    corazon.classList.toggle('marcado');
  });
}



if (buttonComprar && menuComprar && menuDepa && menuAmb && menuPrecio && flechaComprar && flechaDepa && flechaAmb && flechaPrecio) {
  buttonComprar.addEventListener('click', (e) => {
    e.stopPropagation();
    menuComprar.classList.toggle('oculto');
    menuDepa.classList.add('oculto');
    menuAmb.classList.add('oculto');
    menuPrecio.classList.add('oculto');
    flechaComprar.classList.toggle('vuelta');
    flechaDepa.classList.remove('vuelta');
    flechaAmb.classList.remove('vuelta');
    flechaPrecio.classList.remove('vuelta');
  });
}

if (buttonDepa && menuDepa && menuComprar && menuAmb && menuPrecio && flechaComprar && flechaDepa && flechaAmb && flechaPrecio) {
  buttonDepa.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDepa.classList.toggle('oculto');
    menuComprar.classList.add('oculto'); 
    menuAmb.classList.add('oculto');
    menuPrecio.classList.add('oculto');
    flechaComprar.classList.remove('vuelta');
    flechaAmb.classList.remove('vuelta');
    flechaDepa.classList.toggle('vuelta');
    flechaPrecio.classList.remove('vuelta');
  });
}

if (buttonAmb && menuAmb && menuComprar && menuDepa && menuPrecio && flechaComprar && flechaDepa && flechaAmb && flechaPrecio) {
  buttonAmb.addEventListener('click', (e) => {
    e.stopPropagation();
    menuAmb.classList.toggle('oculto');
    menuComprar.classList.add('oculto'); 
    menuDepa.classList.add('oculto'); 
    menuPrecio.classList.add('oculto');
    flechaComprar.classList.remove('vuelta');
    flechaAmb.classList.toggle('vuelta');
    flechaDepa.classList.remove('vuelta');
    flechaPrecio.classList.remove('vuelta');
  });
}

if (buttonPrecio && menuPrecio && menuComprar && menuDepa && menuAmb && flechaComprar && flechaDepa && flechaAmb && flechaPrecio) {
  buttonPrecio.addEventListener('click', (e) => {
    e.stopPropagation();
    menuPrecio.classList.toggle('oculto');
    menuComprar.classList.add('oculto'); 
    menuDepa.classList.add('oculto'); 
    menuAmb.classList.add('oculto');
    flechaComprar.classList.remove('vuelta');
    flechaPrecio.classList.toggle('vuelta');
    flechaDepa.classList.remove('vuelta');
    flechaAmb.classList.remove('vuelta');
  });
}

if (monedaPeso && monedaDolar && guardaMoneda) {
  monedaPeso.addEventListener('change', () => {
    if (monedaPeso.checked) {
      monedaDolar.checked = false;
      guardaMoneda.value = '$';
    }
  });

  monedaDolar.addEventListener('change', () => {
    if (monedaDolar.checked) {
      monedaPeso.checked = false;
      guardaMoneda.value = 'USD';
    }
  });
}



