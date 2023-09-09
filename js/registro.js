document.addEventListener('DOMContentLoaded', function(){
    const registerForm = document.getElementById('register-form');
    const mensajeSesion = document.getElementById('mensaje-sesion');
        
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        registerUser();
    });
    
    function registerUser() {
        const formData = new FormData(registerForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            lastname: formData.get('lastname'),
            firstname: formData.get('firstname'),
            dni: formData.get('dni'),
            role: getRole()
        };

        fetch(`${URL_API}/auth/register`, {
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
            if (mensajeSesion.classList.contains('alert-danger')) {
                mensajeSesion.classList.remove('alert-danger');
            }
    
            mensajeSesion.classList.add('alert-success');
            mensajeSesion.textContent = 'Usuario registrado con éxito!';
            mensajeSesion.style.display = 'block';
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
    
            if (mensajeSesion.classList.contains('alert-success')) {
                mensajeSesion.classList.remove('alert-success');
            }
    
            mensajeSesion.classList.add('alert-danger');
            mensajeSesion.textContent = 'Error al registrar usuario';
            mensajeSesion.style.display = 'block';
        });
    }
    
});

function getRole() {
    const selectElement = document.getElementById('floatingSelect');
    const selectedValue = selectElement.value;

    let selectedText = '';

    switch (selectedValue) {
        case '1':
            selectedText = 'Admin';
            break;
        case '2':
            selectedText = 'Padre';
            break;
        case '3':
            selectedText = 'Estudiante';
            break;
        case '4':
            selectedText = 'Docente';
            break;
        case '5':
            selectedText = 'Invitado';
            break;
        default:
            selectedText = ''; // En caso de que no haya una coincidencia
            break;
    }

    return selectedText;
}