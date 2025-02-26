document.addEventListener("DOMContentLoaded", function() {
    // Initialize AOS animations
    AOS.init();

    // Define variables
    let allPosts = [];
    let currentPage = 1;
    const postsPerPage = 6;

    // Fetch posts from API and local storage
    async function fetchPosts() {
        const apiPosts = await fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json());
        const localPostIds = JSON.parse(localStorage.getItem('localPostIds')) || [];
        const localPosts = localPostIds.map(id => JSON.parse(localStorage.getItem(id)));
        allPosts = [...apiPosts, ...localPosts];
        renderPosts();
        renderPagination();
    }

    // Render posts for the current page
    function renderPosts() {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToShow = allPosts.slice(start, end);
        postsToShow.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');
            postElement.setAttribute('data-aos', 'fade-up');
            postElement.innerHTML = `
                <img src="https://via.placeholder.com/300x200?text=Blog+Post" alt="Blog Post" class="w-full h-48 object-cover rounded-t-lg">
                <div class="p-4">
                    <h2 class="text-xl font-semibold">${post.title}</h2>
                    <p class="text-gray-700">${post.body.substring(0, 100)}...</p>
                    <a href="post.html?id=${post.id}" class="text-blue-500 mt-2 inline-block">Read More</a>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Render pagination controls
    function renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        if (totalPages > 1) {
            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.classList.add('bg-blue-600', 'text-white', 'p-2', 'rounded');
                prevButton.addEventListener('click', () => {
                    currentPage--;
                    renderPosts();
                    renderPagination();
                });
                paginationContainer.appendChild(prevButton);
            }
            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.classList.add('bg-blue-600', 'text-white', 'p-2', 'rounded');
                nextButton.addEventListener('click', () => {
                    currentPage++;
                    renderPosts();
                    renderPagination();
                });
                paginationContainer.appendChild(nextButton);
            }
        }
    }

    // Modal handling for writing posts
    const writePostLink = document.getElementById('writePostLink');
    const writeModal = document.getElementById('writeModal');
    const closeModal = document.getElementById('closeModal');
    const writeForm = document.getElementById('writeForm');

    writePostLink.addEventListener('click', (e) => {
        e.preventDefault();
        writeModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        writeModal.classList.add('hidden');
    });

    writeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const body = document.getElementById('postBody').value;
        const newId = 'local-' + Date.now();
        const newPost = { id: newId, title, body };
        localStorage.setItem(newId, JSON.stringify(newPost));
        let localPostIds = JSON.parse(localStorage.getItem('localPostIds')) || [];
        localPostIds.push(newId);
        localStorage.setItem('localPostIds', JSON.stringify(localPostIds));
        allPosts.unshift(newPost);
        renderPosts();
        writeModal.classList.add('hidden');
        document.getElementById('postTitle').value = '';
        document.getElementById('postBody').value = '';
    });

    // Fetch posts on page load
    fetchPosts();
});