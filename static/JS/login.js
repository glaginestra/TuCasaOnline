function handleCredentialResponse(response) {
    document.getElementById("credential").value = response.credential;
    document.getElementById("google-login-form").submit();
}

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert("Por favor, complete todos los campos");
            return;
        }
        formulario.submit();
    });
});