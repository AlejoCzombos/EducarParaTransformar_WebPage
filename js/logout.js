document.addEventListener('DOMContentLoaded', function() {
    const botonSesion = document.getElementById('boton-sesion');
    const usuarioLogueado = obtenerEstadoDeSesion();
    const descargaContainer = document.getElementById('descarga-container');

    if (usuarioLogueado) {
        botonSesion.textContent = 'Cerrar Sesión';
        descargaContainer.style.display = 'block';
        botonSesion.href = '#';
    } else {
        botonSesion.textContent = 'Iniciar Sesión';
        descargaContainer.style.display = 'none';
        botonSesion.href = 'login.html';
    }

    botonSesion.addEventListener('click', function(event) {

        if (usuarioLogueado) {
            localStorage.setItem('jwtToken', '');
            localStorage.setItem('id', '');
            localStorage.setItem('username', '');
            location.reload();
        }
    });
});

function obtenerEstadoDeSesion() {
    const jwtToken = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('id');
    const username = localStorage.getItem('username');

    if (jwtToken && !isTokenExpired(jwtToken)) {
        return true;
    } else {

        localStorage.setItem('jwtToken', '');
        localStorage.setItem('id', '');
        localStorage.setItem('username', '');

        return false;
    }
}

function isTokenExpired(token) {
    if (!token) {
        return true;
    }

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenData.exp * 1000);

    return expirationDate <= new Date();
}