document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const password = document.getElementById('password').value;
        
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;
        
        if (!password || !dni || !telefono ) {
            alert("Por favor, complete todos los campos");
            return;
        }
        formulario.submit();
    });
});