document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    let post;

    if (postId.startsWith('local-')) {
        post = JSON.parse(localStorage.getItem(postId));
    } else {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        post = await response.json();
    }

    const postContent = document.getElementById("post-content");
    if (post) {
        postContent.innerHTML = `
            <h2 class="text-2xl font-semibold mb-2">${post.title}</h2>
            <p class="text-gray-700">${post.body}</p>
        `;
    } else {
        postContent.innerHTML = `<p>Post not found.</p>`;
    }
});