
const perfil=document.getElementById('perfil');
const menuPerfil=document.getElementById('menu-perfil');

if (perfil && menuPerfil) {
    perfil.addEventListener('click', (e) => {
      e.stopPropagation();
      menuPerfil.classList.toggle('oculto');
    });
}

let map = L.map('map').setView([-34.6037, -58.3816], 13); // Vista inicial

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

function actualizarMapa() {
  const direccion = document.getElementById('direccion').value;
  const provincia = document.getElementById('provincia').value;
  const barrio = document.getElementById('barrio').value;
  const ubicacion = document.getElementById('ubicacion') ? document.getElementById('ubicacion').value : '';

  if (ubicacion && ubicacion.includes(',')) {
    // Usar coordenadas directas
    const partes = ubicacion.split(',');
    const lat = parseFloat(partes[0]);
    const lon = parseFloat(partes[1]);
    map.setView([lat, lon], 16);
    const popupText = `${direccion}, ${barrio}, ${provincia}`;
    if (marker) {
      marker.setLatLng([lat, lon]);
      marker.bindPopup(popupText).openPopup();
    } else {
      marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(popupText)
        .openPopup();
    }
    document.getElementById('latitud').value = lat;
    document.getElementById('longitud').value = lon;
    return;
  }

  if (!direccion || !provincia || !barrio) return;
  const query = `${direccion}, ${barrio}, ${provincia}, Argentina`;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.setView([lat, lon], 16);
        const popupText = `${query}`;
        if (marker) {
          marker.setLatLng([lat, lon]);
          marker.bindPopup(popupText).openPopup();
        } else {
          marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(popupText)
            .openPopup();
        }
        document.getElementById('latitud').value = lat;
        document.getElementById('longitud').value = lon;
      }
    });
}


const ButtonCarGenerales= document.getElementById('ca-g');
const ButtonCaracteristicas= document.getElementById('ca');
const ButtonCarAmb= document.getElementById('ca-a');
const ButtonCarSer= document.getElementById('ca-s');

const DivCarGenerales= document.getElementById('div-generales');
const DivCaracteristicas= document.getElementById('div-caract');
const DivCarAmb= document.getElementById('div-amb');
const DivCarSer= document.getElementById('div-ser');

const LineaGen = document.getElementById('linea-ge');
const LineaCar= document.getElementById('linea-ca');
const LineaAmb= document.getElementById('linea-amb');
const LineaSer= document.getElementById('linea-se');

if (ButtonCarGenerales) {
  ButtonCarGenerales.addEventListener('click', () => {
    if (DivCarGenerales) DivCarGenerales.style.display = 'block';
    if (DivCaracteristicas) DivCaracteristicas.style.display = 'none';
    if (DivCarAmb) DivCarAmb.style.display = 'none';
    if (DivCarSer) DivCarSer.style.display = 'none';

    if (ButtonCarGenerales) ButtonCarGenerales.style.backgroundColor = '#59585826';
    if (ButtonCaracteristicas) ButtonCaracteristicas.style.backgroundColor = '#f9f6f2';
    if (ButtonCarAmb) ButtonCarAmb.style.backgroundColor = '#f9f6f2';
    if (ButtonCarSer) ButtonCarSer.style.backgroundColor = '#f9f6f2';

    if (LineaGen) LineaGen.style.width = "188px";
    if (LineaCar) LineaCar.style.width = "0px";
    if (LineaAmb) LineaAmb.style.width = "0px";
    if (LineaSer) LineaSer.style.width = "0px";
  });
}

if (ButtonCaracteristicas) {
  if (!ButtonCarGenerales) {
    if (LineaCar) LineaCar.style.width = "116px";
    if (ButtonCaracteristicas) ButtonCaracteristicas.style.backgroundColor = '#59585826';
    if (DivCaracteristicas) DivCaracteristicas.style.display = 'block';
  }
  ButtonCaracteristicas.addEventListener('click', () => {
    if (DivCarGenerales) DivCarGenerales.style.display = 'none';
    if (DivCaracteristicas) DivCaracteristicas.style.display = 'block';
    if (DivCarAmb) DivCarAmb.style.display = 'none';
    if (DivCarSer) DivCarSer.style.display = 'none';

    if (ButtonCaracteristicas) ButtonCaracteristicas.style.backgroundColor = '#59585826';
    if (ButtonCarGenerales) ButtonCarGenerales.style.backgroundColor = '#f9f6f2';
    if (ButtonCarAmb) ButtonCarAmb.style.backgroundColor = '#f9f6f2';
    if (ButtonCarSer) ButtonCarSer.style.backgroundColor = '#f9f6f2';

    if (LineaGen) LineaGen.style.width = "0px";
    if (LineaCar) LineaCar.style.width = "116px";
    if (LineaAmb) LineaAmb.style.width = "0px";
    if (LineaSer) LineaSer.style.width = "0px";
  });
}


if (ButtonCarAmb) {
  if (!ButtonCarGenerales && !ButtonCaracteristicas) {
    if (LineaAmb) LineaAmb.style.width = "87px";
    if (ButtonCarAmb) ButtonCarAmb.style.backgroundColor = '#59585826';
    if (DivCarAmb) DivCarAmb.style.display = 'block';
  }
  ButtonCarAmb.addEventListener('click', () => {
    if (DivCarGenerales) DivCarGenerales.style.display = 'none';
    if (DivCaracteristicas) DivCaracteristicas.style.display = 'none';
    if (DivCarAmb) DivCarAmb.style.display = 'block';
    if (DivCarSer) DivCarSer.style.display = 'none';

    if (ButtonCarAmb) ButtonCarAmb.style.backgroundColor = '#59585826';
    if (ButtonCarGenerales) ButtonCarGenerales.style.backgroundColor = '#f9f6f2';
    if (ButtonCaracteristicas) ButtonCaracteristicas.style.backgroundColor = '#f9f6f2';
    if (ButtonCarSer) ButtonCarSer.style.backgroundColor = '#f9f6f2';

    if (LineaGen) LineaGen.style.width = "0px";
    if (LineaCar) LineaCar.style.width = "0px";
    if (LineaAmb) LineaAmb.style.width = "87px";
    if (LineaSer) LineaSer.style.width = "0px";
  });
}

if (ButtonCarSer) {
  if (!ButtonCarAmb && !ButtonCarGenerales && !ButtonCaracteristicas) {
    if (LineaSer) LineaSer.style.width = "75px";
    if (DivCarSer) DivCarSer.style.display = 'block';
    if (ButtonCarSer) ButtonCarSer.style.backgroundColor = '#59585826';
    
  }
  ButtonCarSer.addEventListener('click', () => {
    if (DivCarGenerales) DivCarGenerales.style.display = 'none';
    if (DivCaracteristicas) DivCaracteristicas.style.display = 'none';
    if (DivCarAmb) DivCarAmb.style.display = 'none';
    if (DivCarSer) DivCarSer.style.display = 'block';

    if (ButtonCarSer) ButtonCarSer.style.backgroundColor = '#59585826';
    if (ButtonCarGenerales) ButtonCarGenerales.style.backgroundColor = '#f9f6f2';
    if (ButtonCaracteristicas) ButtonCaracteristicas.style.backgroundColor = '#f9f6f2';
    if (ButtonCarAmb) ButtonCarAmb.style.backgroundColor = '#f9f6f2';

    if (LineaGen) LineaGen.style.width = "0px";
    if (LineaCar) LineaCar.style.width = "0px";
    if (LineaAmb) LineaAmb.style.width = "0px";
    if (LineaSer) LineaSer.style.width = "75px";
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-foto');
  const cerrar = document.getElementById('cerrar-foto');
  const imagenes = document.querySelectorAll('.carousel-image');
  const body = document.getElementById('body')
  const btnPrev = document.querySelector('.prev');
  const btnNext = document.querySelector('.next');
  const Img0 = document.getElementById('primer-imagen');
  const Img1= document.getElementById('img-sec-1');
  const Img2= document.getElementById('img-sec-2');
  const Img3= document.getElementById('img-sec-3');
  const Img4= document.getElementById('img-sec-4');

  let index = 0;

  function mostrarImagen(i) {
      imagenes.forEach(img => img.classList.remove('active'));
      imagenes[i].classList.add('active');
      btnPrev.disabled = (i === 0);
      btnNext.disabled = (i === imagenes.length - 1);

  }

  btnPrev.addEventListener('click', () => {
    if (index > 0) {
        index--;
        mostrarImagen(index);
      }
  });

  btnNext.addEventListener('click', () => {
    if (index < imagenes.length - 1) {
        index++;
        mostrarImagen(index);
      }
  });


  Img0.addEventListener('click', () => {
      modal.style.display = 'flex';
      index = 0;
      body.style.overflowY='hidden';
      
      mostrarImagen(index);
  });

  Img1.addEventListener('click', () => {
    modal.style.display = 'flex';
    index = 1;
    body.style.overflowY='hidden';
    
    mostrarImagen(index);
  });

  Img2.addEventListener('click', () => {
    modal.style.display = 'flex';
    index = 2;
    body.style.overflowY='hidden';
    
    mostrarImagen(index);
  });

  Img3.addEventListener('click', () => {
    modal.style.display = 'flex';
    index = 3;
    body.style.overflowY='hidden';
    
    mostrarImagen(index);
  });

  Img4.addEventListener('click', () => {
    modal.style.display = 'flex';
    index = 4;
    body.style.overflowY='hidden';
    
    mostrarImagen(index);
  });

  cerrar.addEventListener('click', () => {
      modal.style.display = 'none';
      body.style.overflowY='auto';
  });
});

