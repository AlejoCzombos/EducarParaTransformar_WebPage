document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const newPostContainer = document.getElementById('new_post_container');
    const footer = document.getElementById('footer');
    const postURL = `${URL_API}/api/posts`;
    
    loadPosts();

    function loadPosts() {
        fetch( `${URL_API}/api/posts` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }) 
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(posts => {
                posts.forEach(post => {
                    const postElement = createPostElement(post);
                    postsContainer.appendChild(postElement);
    
                    post.comments.forEach(comment => {
                        const commentElement = createCommentElement(comment);

                        const commentsContainer = document.getElementById(`comments-container-${post.id}`);
                        commentsContainer.appendChild(commentElement);
                    });
                });
                addComment();
                createNewPost();
                newPostContainer.style.display = 'block';
                footer.style.display = 'block';
            })
            
    }
    
    function createNewPost(){
        const newPostButton = document.getElementById('new_post');
        
        const userId = localStorage.getItem('id');
        const jwtToken = localStorage.getItem('jwtToken');

        newPostButton.addEventListener('click', event =>{
            event.preventDefault();
            
            const newPostContent = document.getElementById('commentText-new_post').value;
            const newPostTitule = document.getElementById('tituleText-new_post').value;
            document.getElementById('commentText-new_post').value = '';
            document.getElementById('tituleText-new_post').value = '';

            if(localStorage.getItem("jwtToken") === '' || localStorage.getItem("id") === ''){
                PostErrorMessage("Inicie sesión para dejar un comentario");
                return;
            }

            console.log(newPostTitule, " ", newPostContent);

            fetch(`${URL_API}/api/posts/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    titule: newPostTitule,
                    content: newPostContent 
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear el comentario');
                }
                return response.json();
            })
            .then(comment => {
                location.reload();
            })
            .catch(error => {
                console.error('Error al crear comentario:', error);
                PostErrorMessage("Error al crear comentario");
            });
           
        });
    }

    function addComment(){
        const commentButtons = document.querySelectorAll('.comment-button');

        commentButtons.forEach(button => {
            button.addEventListener('click', event => {
                
                const postId = button.id.split('-')[1];
                const userId = localStorage.getItem('id');
                const commentText = document.getElementById(`commentText-${postId}`).value;

                if(localStorage.getItem("jwtToken") === '' || localStorage.getItem("id") === ''){
                    errorMessage(button.id.split('-')[1], "Inicie sesión para dejar un comentario");
                    return;
                }
                
                if(commentText == ''){
                    return;
                }

                
                document.getElementById(`commentText-${postId}`).value = '';
                
                fetch(`${URL_API}/api/comments/${postId}/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: commentText }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al agregar el comentario');
                    }
                    return response.json();
                })
                .then(comment => {
                    location.reload();
                })
                .catch(error => {
                    console.error('Error al agregar el comentario:', error);
                    errorMessage(button.id.split('-')[1], "Inicie sesión para dejar un comentario");
                });
            });
        });
    }
    
    function errorMessage(postId, message){
        document.getElementById(`mensaje-error-${postId}`).style.display = 'block';
        document.getElementById(`mensaje-error-${postId}`).textContent = message;
    }
    function PostErrorMessage(message){
        document.getElementById(`mensaje-error-new_post`).style.display = 'block';
        document.getElementById(`mensaje-error-new_post`).textContent = message;
    }

    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
        <div class="container mt-2 mb-4">
            <div class="d-flex justify-content-center row">
                <div class="d-flex flex-column col-md-8 p-3 bg-white rounded-4">
                    <div class="d-flex flex-row align-items-center text-left comment-top pb-3 border-bottom px-4" >
                        <div class="d-flex flex-column ml-3">
                            <div class="d-flex flex-row post-title"> <!--Titulo y Autor -->
                                <h5>${post.titule}</h5>
                                <span class="ms-4 text-rigth">(${post.firstname} ${post.lastname})</span>
                            </div>
                            <div class="comment-text-sm pb-2"><span>${post.content}</span></div>
                            <div class="d-flex flex-row align-items-center post-title"> <!--Info Adicional-->
                                <span class="mr-1 ${post.role}">${post.role}</span>
                                <span class="mr-2 comments ms-2">Comentarios: ${post.comments.length}</span>
                                <span class="mr-2 dot mx-2"></span><span>${formatDate(post.createTime)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="coment-bottom p-2 px-4" id="comments-container-${post.id}"> <!-- Contenedor comentarios-->  
                    </div>

                    <div class="alert alert-danger text-center mt-2 mx-1" style="display: none;" id="mensaje-error-${post.id}" role="alert"></div>
                    <div class="form-floating p-2">
                        <textarea class="form-control" id="commentText-${post.id}" placeholder="Deja un comentario" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">Deja un comentario a ${post.firstname} ${post.lastname}</label>
                        <button id="comment-${post.id}" type="submit" class="mt-2 btn btn-primary comment-button">Enviar comentario</button>
                    </div>

                </div>
            </div>
        </div>
        `;
        return postElement;
    }

    function createCommentElement(comment) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('commented-section');
        commentElement.classList.add('mt-2');
        commentElement.innerHTML = `
        <div class="commented-section mt-2">
            <div class="d-flex flex-row align-items-center commented-user">
                <span class="${comment.role} me-2">${comment.role}</span>
                <h5 class="mr-2">${comment.firstname} ${comment.lastname}</h5>
                <span class="dot mb-1 mx-2"></span>
                <span class="mb-1">${formatDate(comment.createTime)}</span></div>
            <div class="comment-text-sm"><span>${comment.content}</span></div>
        </div>
        `;
        return commentElement;
    }

    function formatDate(dateArray) {
        const [year, month, day] = dateArray;
        return `${day}/${month}/${year}`;
    }
});