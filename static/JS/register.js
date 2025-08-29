document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;
        
        if (!email || !password || !dni || !telefono || !nombre || !apellido) {
            alert("Por favor, complete todos los campos");
            return;
        }
        formulario.submit();
    });
});
