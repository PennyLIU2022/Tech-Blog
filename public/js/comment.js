async function commentFormHandler(event) {
    event.preventDefault();

    const comment = document.querySelector('input[name="comment-body"]').value.trim();

    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // http://localhost:3001/blog/1
    // window.location.toString() - > localhost:3001/blog/24
    // window.location.toString().spilt('/) ->['localhost:3001','blog','24'][2] --> '24'
    if (comment) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                blog_id,
                comment
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();

        } else {
            alert(response.statusText);
            document.querySelector('#comment-form').style.display = "block";
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);