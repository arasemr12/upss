let commentel = document.getElementById('comment');

function like(postid){
    fetch(`/posts/${postid}/like`)
        .then((res) => res.json())
        .then((data) => {
            if(data.liked){
                document.getElementById(`like-${postid}`).classList.add('text-red-600');
            }else{
                document.getElementById(`like-${postid}`).classList.remove('text-red-600');
            }
            document.getElementById(`likes-${postid}`).innerText = data.newlikes;
        })
}

function comment(id){
    /*commentel.classList.toggle('opacity-0');
    commentel.classList.toggle('invisible');*/
    window.location.href = `/posts/${id}#comment`;
}