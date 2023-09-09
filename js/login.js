document.addEventListener('DOMContentLoaded', function(){
    const loginForm = document.getElementById('login-form');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        loginUser();
    });
    function loginUser() {
        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password')
        };
    
        fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(response => {
            if (mensajeError.style.display === 'block') {
                mensajeError.style.display = 'none';
            }

            mensajeExito.style.display = 'block';
    
            const jwtToken = response.token;
            const [header, payload, signature] = jwtToken.split('.');

            const decodedPayload = JSON.parse(atob(payload));

            localStorage.setItem('jwtToken', response.token);
            localStorage.setItem('username', decodedPayload.sub);
            localStorage.setItem('id', decodedPayload.jti);

            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            mensajeError.style.display = 'block';
        });
    }
    
});