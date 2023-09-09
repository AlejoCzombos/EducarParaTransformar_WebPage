document.addEventListener('DOMContentLoaded', function(){ 
    const urlGetComments = 'http://localhost:8080/api/comments';
    const commentsContainer = document.getElementById('comments-container'); // Declarar commentsContainer con 'const'

    listComments();

    function listComments(){
        $.ajax({
            url: ('http://localhost:8080/api/comments/1'),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function(comments){
                console.log(comments);
                comments.forEach(comment => {
                    const commentElement = createCommentElement(comment);
                    commentsContainer.appendChild(commentElement);
                });

            },
            error: function(error) {
                console.error('Error en la solicitud:', error);
            }
        });
    }

    function createCommentElement(comment) {
        const commentElement = document.createElement('div');
        commentElement.innerHTML = `
        <div class="d-flex justify-content-center row">
            <div class="d-flex flex-column col-md-8 p-3 bg-white" >
                <div class="commented-section mt-2">
                    <div class="d-flex flex-row align-items-center commented-user">
                        <span class="bdge me-2 ">Estudiante</span>
                        <h5 class="mr-2">${comment.firstname} ${comment.lastname}</h5>
                        <span class="dot mb-1 mx-2"></span>
                        <span class="mb-1">${formatDate(comment.createTime)}</span></div>
                    <div class="comment-text-sm"><span>${comment.content}</span></div>
                </div>
            </div>
        </div>
        `;
        return commentElement;
    }

    function formatDate(dateArray) {
        const [year, month, day] = dateArray;
        return `${day}/${month}/${year}`;
    }
});
