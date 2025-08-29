
const perfil=document.getElementById('perfil');
const menuPerfil=document.getElementById('menu-perfil');

perfil.onclick=function(){
  menuPerfil.classList.toggle('oculto');
}

window.onclick = function(e) {
  if (!perfil.contains(e.target) && !menuPerfil.contains(e.target)) {
    menuPerfil.classList.add('oculto');
  }
};

const tipo = document.getElementById('tipo');

document.querySelectorAll('.boton').forEach(boton => {
    boton.addEventListener('click', (e) => {
        tipo.value = boton.textContent;

        document.querySelectorAll('.boton').forEach(b => b.classList.remove('elegido'));

        boton.classList.add('elegido');
    });
});
let map = L.map('map').setView([-34.6037, -58.3816], 13); // Vista inicial
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

function actualizarMapa() {
  const direccion = document.getElementById('direccion').value;
  const provincia = document.getElementById('provincia').value;
  const barrio = document.getElementById('barrio').value;

  if (!direccion || !provincia || !barrio) return;

  const query = `${direccion}, ${barrio}, ${provincia}, Argentina`;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        map.setView([lat, lon], 16);

        const popupText = `${query}<br><small>(mover para ajustar)</small>`;

        if (marker) {
          marker.setLatLng([lat, lon]);
          marker.bindPopup(popupText).openPopup();
        } else {
          marker = L.marker([lat, lon], { draggable: true }).addTo(map)
            .bindPopup(popupText)
            .openPopup();

          marker.on('dragend', function (e) {
            const nuevaPos = marker.getLatLng();
            document.getElementById('latitud').value = nuevaPos.lat;
            document.getElementById('longitud').value = nuevaPos.lng;
          });
        }

        // Guardar coords en los inputs ocultos
        document.getElementById('latitud').value = lat;
        document.getElementById('longitud').value = lon;
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('direccion').addEventListener('input', actualizarMapa);
  document.getElementById('provincia').addEventListener('change', actualizarMapa);
  document.getElementById('barrio').addEventListener('change', actualizarMapa);
});


const inputSecundarias = document.getElementById('fotos');
const spanSecundarias = document.querySelector('span#file-names');

document.querySelectorAll('.contenido').forEach(contenido =>{
  const input = contenido.querySelector('.number')
  const subir = contenido.querySelector('.subir')
  const bajar = contenido.querySelector('.bajar')
  subir.addEventListener('click',()=>{
    const valor=parseInt(input.value);
    input.value=valor+1;
  })
  bajar.addEventListener('click',()=>{
    const valor=parseInt(input.value);
    if (valor > 0) {
      input.value = valor - 1;
    }
  
  })
})

const antiguo = document.getElementById('antiguo');
const anios = document.getElementById('anios-antiguedad');


document.querySelectorAll('.checkbox').forEach(checkbox =>{
  checkbox.addEventListener('click',()=>{
    if (checkbox.checked===true) {
      document.querySelectorAll('.checkbox').forEach(c =>{
        c.checked=false;
      })
      checkbox.checked=true;
    }
    if (antiguo.checked) {
      anios.classList.remove('oculto');
    }else{
      anios.classList.add('oculto');
    }
  })
})


document.addEventListener("DOMContentLoaded", () => {
  // Manejo de los botones de tipo (Venta, Alquiler, Temporada)
  const ventaBtn = document.getElementById('venta');
  const alquilerBtn = document.getElementById('alquiler');
  const temporadaBtn = document.getElementById('temporada');
  const tipoInput = document.getElementById('tipo');

  if (ventaBtn && alquilerBtn && temporadaBtn && tipoInput) {
    ventaBtn.addEventListener('click', () => {
      tipoInput.value = 'Venta';
    });

    alquilerBtn.addEventListener('click', () => {
      tipoInput.value = 'Alquiler';
    });

    temporadaBtn.addEventListener('click', () => {
      tipoInput.value = 'Temporada';
    });
  }
})

// Manejo de los botones de subir y bajar números (ambientes, dormitorios, baños, etc.)
const numbers = document.querySelectorAll('.subir-bajar');

numbers.forEach((container) => {
  const subirBtn = container.querySelector('.subir');
  const bajarBtn = container.querySelector('.bajar');
  const input = container.querySelector('input[type="number"]');

  subirBtn.addEventListener('click', () => {
    input.value = parseInt(input.value) ;
  });

  bajarBtn.addEventListener('click', () => {
    if (input.value > 0) input.value = parseInt(input.value) ;
  });
});

// Manejo de los checkboxes para antigüedad
const estrenarCheckbox = document.getElementById('estrenar');
const antiguoCheckbox = document.getElementById('antiguo');
const aniosAntiguedad = document.getElementById('anios-antiguedad');
const construccionCheckbox = document.getElementById('construccion');
const tipoSeleccionado = document.getElementById('valor-antiguedad');


if (estrenarCheckbox && antiguoCheckbox && aniosAntiguedad && construccionCheckbox) {

  antiguoCheckbox.addEventListener('change', () => {
    aniosAntiguedad.classList.toggle('oculto', !antiguoCheckbox.checked);
  
    if (antiguoCheckbox.checked) {
      estrenarCheckbox.checked = false;
      construccionCheckbox.checked = false;
      tipoSeleccionado.value = 'antiguedad';
    }else{
      tipoSeleccionado.value ="";
    }
  });
  
  estrenarCheckbox.addEventListener('change', () => {
    if (estrenarCheckbox.checked) {
      antiguoCheckbox.checked = false;
      construccionCheckbox.checked = false;
      aniosAntiguedad.classList.add('oculto');
      tipoSeleccionado.value = 'estrenar';
    } else{
      tipoSeleccionado.value ="";
    }
  });
  
  construccionCheckbox.addEventListener('change', () => {
    if (construccionCheckbox.checked) {
      estrenarCheckbox.checked = false;
      antiguoCheckbox.checked = false;
      aniosAntiguedad.classList.add('oculto');
      tipoSeleccionado.value = 'construcción';
    }else{
      tipoSeleccionado.value ="";
    }
  });
}  

document.addEventListener('DOMContentLoaded', () => {
  const fotosInput = document.getElementById('fotos');
  const fileNamesLabel = document.getElementById('file-names');
  const botonReiniciar = document.getElementById('reiniciar');

  // Este objeto nos permite acumular archivos manualmente
  const dataTransfer = new DataTransfer();

  fotosInput.addEventListener('change', (e) => {
    const nuevosArchivos = Array.from(e.target.files);

    nuevosArchivos.forEach(file => {
      const yaExiste = Array.from(dataTransfer.files).some(f => f.name === file.name && f.size === file.size);
      if (!yaExiste) {
        dataTransfer.items.add(file);
      }
    });

    if (dataTransfer.files.length > 10) {
      alert('¡Solo podés subir un máximo de 10 imágenes!');
      // Limpiar todo si se excede
      dataTransfer.clearData();
      fotosInput.value = '';
      fileNamesLabel.textContent = 'Ningún archivo seleccionado';
      return;
    }

    if (dataTransfer.files.length < 5) {
      alert('Se recomienda subir al menos 5 imágenes');
    }

    // Actualizar input con la acumulación de archivos
    fotosInput.files = dataTransfer.files;

    // Mostrar nombres
    if (dataTransfer.files.length === 0) {
      fileNamesLabel.textContent = 'Ningún archivo seleccionado';
    } else {
      fileNamesLabel.textContent = `${dataTransfer.files.length} imágenes seleccionadas: ` +
        Array.from(dataTransfer.files).map(f => f.name).join(', ');
    }
  });

  botonReiniciar.addEventListener('click', () => {
    dataTransfer.clearData();
    fotosInput.value = '';
    fileNamesLabel.textContent = 'Ningún archivo seleccionado';
  });
});



document.addEventListener('DOMContentLoaded', function(){
  const formulario=document.getElementById('formulario');

  formulario.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const tipoOperacion = document.getElementById('tipo');
    const textoOperacion= document.getElementById('texto_operacion');
    const tipoPropiedad = document.getElementById('select-tipo');
    const direccion = document.getElementById('direccion');
    const provincia = document.getElementById('provincia');
    const barrio = document.getElementById('barrio');
    const ambientes = document.getElementById('ambientes');
    const dormitorios = document.getElementById('dormitorios');
    const banios = document.getElementById('banios');
    const supCubierta = document.getElementById('sup-cubierta');
    const supTotal = document.getElementById('sup-total');
    const antiguedad = document.getElementById('valor-antiguedad');
    const textoAntiguedad= document.getElementById('texto-antiguedad');
    const precio = document.getElementById('precio-propiedad');
    const titulo = document.getElementById('titulo');
    const descripcion = document.getElementById('descripcion');
    const fotosSecu = document.getElementById('fotos');
    const textoFotos =document.getElementById('texto-fotos');

    console.log( tipoOperacion.value );
    console.log( tipoPropiedad.value);
    console.log( direccion.value);
    console.log( provincia.value);
    console.log( barrio.value);
    console.log( ambientes.value);
    console.log( dormitorios.value);
    console.log( banios.value);
    console.log( supCubierta.value);
    console.log( supTotal.value);
    console.log( antiguedad.value);
    console.log( precio.value);
    console.log( titulo.value);
    console.log( descripcion.value);
    console.log( fotosSecu.value);


    tipoPropiedad.style.border = "";
    direccion.style.border = "";
    provincia.style.border = "";
    barrio.style.border = "";
    ambientes.style.border = "";
    dormitorios.style.border = "";
    banios.style.border = "";
    supCubierta.style.border = "";
    supTotal.style.border = "";
    antiguedad.style.border = "";
    precio.style.border = "";
    titulo.style.border = "";
    descripcion.style.border = "";
    textoFotos.innerHTML="Imagenes secundarias";
    textoAntiguedad.innerHTML="Antigüedad";
    textoOperacion.innerHTML="Tipo de operación";

    if (!tipoOperacion.value.trim() || !tipoPropiedad.value.trim() || !direccion.value.trim() || !provincia.value.trim() || !barrio.value.trim() || ambientes.value.trim()=='0' || dormitorios.value.trim()=='0' || banios.value.trim()=='0' || !supCubierta.value.trim() || !supTotal.value.trim() || !antiguedad.value.trim() || !precio.value.trim() || !titulo.value.trim() || !descripcion.value.trim() || !fotosSecu.value.trim()) {
      alert("Completa los campos obligatorios");


      if (!tipoOperacion.value.trim()) textoOperacion.innerHTML += ' <span style="color: red;"> * </span>';
      if (!tipoPropiedad.value.trim()) tipoPropiedad.style.border = "1px solid red";
      if (!direccion.value.trim()) direccion.style.border = "1px solid red";
      if (!provincia.value.trim()) provincia.style.border = "1px solid red";
      if (!barrio.value.trim()) barrio.style.border = "1px solid red";
      if (ambientes.value.trim()=='0') ambientes.style.border = "1px solid red";
      if (dormitorios.value.trim()=='0') dormitorios.style.border = "1px solid red";
      if (banios.value.trim()=='0') banios.style.border = "1px solid red";
      if (!supCubierta.value.trim()) supCubierta.style.border = "1px solid red";
      if (!supTotal.value.trim()) supTotal.style.border = "1px solid red";
      if (!antiguedad.value) textoAntiguedad.innerHTML += ' <span style="color: red;"> * </span>';
      if (!precio.value.trim()) precio.style.border = "1px solid red";
      if (!titulo.value.trim()) titulo.style.border = "1px solid red";
      if (!descripcion.value.trim()) descripcion.style.border = "1px solid red";
      if (!fotosSecu.value.trim()) textoFotos.innerHTML += ' <span style="color: red;"> * </span>';

      return;
    }
    formulario.submit();
    
  })
})