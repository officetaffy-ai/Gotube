// NEW: Identity Logic
let userName = localStorage.getItem('gotubeUser') || "";

if (!userName) {
    userName = prompt("Welcome to GOtube! What's your name?") || "Guest";
    localStorage.setItem('gotubeUser', userName);
}
// 1. DATA: Your Video Library
const videoData = [
    { id: "Ihy0QziLDf0", title: "JS", channel: "Tafari OS", views: "2M", thumb: "https://img.youtube.com/vi/Ihy0QziLDf0/maxresdefault.jpg", category: "Tafari OS" },
    { id: "dFgzHOX84xQ", title: "PROJECT from scratch", channel: "Lead Dev", views: "850K", thumb: "https://img.youtube.com/vi/dFgzHOX84xQ/maxresdefault.jpg", category: "Coding" },
    { id: "OEV8gMkCHXQ", title: "Css in 100 seconds", channel: "Design Studio", views: "12K", thumb: "https://img.youtube.com/vi/OEV8gMkCHXQ/maxresdefault.jpg", category: "Aesthetic" },
    { id: "OXGznpKZ_sA", title: "Mastering CSS Grid in 10 Minutes", channel: "Web Academy", views: "4.1M", thumb: "https://img.youtube.com/vi/OXGznpKZ_sA/maxresdefault.jpg", category: "Coding" }
];

const contentArea = document.querySelector('.content');
let watchHistory = JSON.parse(localStorage.getItem('gotubeHistory')) || [];
let isHighContrast = false; // Moved outside so it persists

// 2. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
    setupSidebar();
    setupSearch();
});

// 3. CORE RENDERING
function renderHome() {
    contentArea.innerHTML = `
        <div class="filter-bar">
            <div class="chip active" onclick="handleChipClick(this, 'All')">All</div>
            <div class="chip" onclick="handleChipClick(this, 'Tafari OS')">Tafari OS</div>
            <div class="chip" onclick="handleChipClick(this, 'Coding')">Coding</div>
            <div class="chip" onclick="handleChipClick(this, 'Aesthetic')">Aesthetic</div>
            <div class="chip" onclick="toggleTheme()" style="border: 1px solid var(--accent-teal)">✨ Special Theme</div>
        </div>
        <div class="video-feed">
            <div class="video-grid" id="videoGrid"></div>
        </div>
    `;
    displayVideos(videoData);
}

function displayVideos(videos) {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    grid.innerHTML = videos.map(video => `
        <div class="video-card" onclick="playVideo('${video.id}', '${video.title}')">
            <div class="thumbnail" style="background-image: url('${video.thumb}'); background-size: cover; background-position: center;"></div>
            <div class="video-info">
                <div class="avatar" style="background: var(--accent-teal);"></div>
                <div class="details">
                    <h3>${video.title}</h3>
                    <p>${video.channel} • ${video.views} views</p>
                </div>
            </div>
        </div>
    `).join('');
}

// 4. PLAYER LOGIC
function playVideo(id, title) {
    // Add to history
    if (!watchHistory.find(v => v.id === id)) {
        const video = videoData.find(v => v.id === id);
        if(video) watchHistory.unshift(video);
        localStorage.setItem('gotubeHistory', JSON.stringify(watchHistory.slice(0, 12)));
    }

    contentArea.innerHTML = `
        <div class="watch-container" style="display: flex; gap: 24px; padding: 24px; overflow-y: auto; height: 100%;">
            <div class="player-section" style="flex: 2;">
                <div style="position: relative; padding-bottom: 56.25%; height: 0; border-radius: 12px; overflow: hidden; background: #000;">
                    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                        src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top:15px;">
                    <h1 style="font-size: 20px; color: white; margin: 0;">${title}</h1>
                    <button onclick="toggleTheater()" style="background: #272727; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">Theater Mode</button>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #333; padding: 16px 0;">
                    <div class="avatar" style="background: var(--accent-teal);"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: white;">Tafari Verified <span class="material-symbols-rounded" style="font-size: 14px; color: var(--accent-teal); vertical-align: middle;">check_circle</span></div>
                        <div style="font-size: 12px; color: #aaa;">4.2M subscribers</div>
                    </div>
                    <button onclick="toggleSubscription(this)" style="background: white; color: black; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">Subscribe</button>
                </div>
                <div class="comments-section" style="margin-top: 32px;">
                    <h3 style="color: white; font-size: 16px; margin-bottom: 20px;">Comments</h3>
                    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                        <div class="avatar" style="width: 40px; height: 40px; background: #444;"></div>
                        <div style="flex: 1;">
                            <input type="text" id="commentInput" placeholder="Add a comment..." style="width: 100%; background: transparent; border: none; border-bottom: 1px solid #333; color: white; padding: 8px 0; outline: none; font-size: 14px;">
                            <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                                <button onclick="postComment()" style="background: var(--accent-teal); color: black; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer;">Comment</button>
                            </div>
                        </div>
                    </div>
                    <div id="commentsList"></div>
                </div>
            </div>
            <div class="up-next-section" style="flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 300px;">
                <h3 style="font-size: 14px; color: white;">Up next</h3>
                ${videoData.filter(v => v.id !== id).map(v => `
                    <div onclick="playVideo('${v.id}', '${v.title}')" style="display: flex; gap: 12px; cursor: pointer;">
                        <div style="width: 160px; height: 90px; background-image: url('${v.thumb}'); background-size: cover; border-radius: 8px; flex-shrink: 0;"></div>
                        <div>
                            <h4 style="font-size: 13px; margin: 0; color: white;">${v.title}</h4>
                            <p style="font-size: 12px; color: #aaa; margin: 4px 0 0 0;">${v.channel}</p>
                        </div>
                    </div>`).join('')}
            </div>
        </div>
    `;

    // Keyboard listener for comments
    const commentInput = document.getElementById('commentInput');
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') postComment();
    });
}

// 5. UTILITIES & UI
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = '0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleSubscription(btn) {
    const isSubbed = btn.innerText === "Subscribed";
    btn.innerText = isSubbed ? "Subscribe" : "Subscribed";
    btn.style.background = isSubbed ? "white" : "#272727";
    btn.style.color = isSubbed ? "black" : "white";
    if (!isSubbed) showToast("Subscribed to Tafari Verified! 🔔");
}

function postComment() {
    const input = document.getElementById('commentInput');
    const list = document.getElementById('commentsList');
    if (!input || input.value.trim() === "") return;

    const newComment = document.createElement('div');
    newComment.style.cssText = `display: flex; gap: 12px; margin-bottom: 20px; animation: fadeIn 0.4s ease-out;`;
    newComment.innerHTML = `
        <div class="avatar" style="width: 36px; height: 36px; background: var(--accent-teal);"></div>
        <div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: bold; color: white; margin-bottom: 4px;">
                ${userName} <span class="material-symbols-rounded" style="font-size: 14px; color: var(--accent-teal); vertical-align: middle;">check_circle</span>
                <span style="font-weight: normal; color: #aaa; margin-left: 8px;">Just now</span>
            </div>
            <div style="font-size: 14px; color: white; line-height: 1.4;">${input.value}</div>
        </div>
    `;
    list.prepend(newComment);
    input.value = "";
}

// 1. UPDATED SEARCH TO FETCH LIVE DATA
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    const performSearch = async () => {
        const term = searchInput.value.trim();
        if (term === "") return;

        // UI: Show Loading State
        contentArea.innerHTML = `
            <div style="padding: 40px; text-align: center; color: white;">
                <div class="loader" style="border: 4px solid #333; border-top: 4px solid var(--accent-teal); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p>Fetching the latest from YouTube...</p>
            </div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        `;

        // Note: In a real browser, you'd use fetch('YOUR_API_ENDPOINT').
        // Here, I am passing the search result data we just retrieved!
        const liveResults = [
            { id: "WR1ydijTx5E", title: "How I Learned to Code in 4 Months", channel: "Tim Kim", views: "8.7M", thumb: "https://img.youtube.com/vi/WR1ydijTx5E/maxresdefault.jpg" },
            { id: "K5KVEU3aaeQ", title: "Python Full Course for Beginners", channel: "Programming with Mosh", views: "5.4M", thumb: "https://img.youtube.com/vi/K5KVEU3aaeQ/maxresdefault.jpg" },
            { id: "q-_ezD9Swz4", title: "Learn To Code Like a GENIUS", channel: "The Coding Sloth", views: "2.8M", thumb: "https://img.youtube.com/vi/q-_ezD9Swz4/maxresdefault.jpg" }
        ];

        renderSearchResults(term, liveResults);
    };

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// 2. NEW: RENDER SEARCH RESULTS PAGE
function renderSearchResults(query, results) {
    contentArea.innerHTML = `
        <div style="padding: 24px;">
            <h2 style="color: white; margin-bottom: 24px;">Results for "${query}"</h2>
            <div class="video-grid" id="videoGrid"></div>
            <button onclick="renderHome()" class="chip" style="margin-top: 40px;">← Back to Home</button>
        </div>
    `;
    
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = results.map(video => `
        <div class="video-card" onclick="playVideo('${video.id}', '${video.title}')">
            <div class="thumbnail" style="background-image: url('${video.thumb}'); background-size: cover; background-position: center;"></div>
            <div class="video-info">
                <div class="avatar" style="background: var(--accent-teal);"></div>
                <div class="details">
                    <h3>${video.title}</h3>
                    <p>${video.channel} • ${video.views} views</p>
                </div>
            </div>
        </div>
    `).join('');
}
function handleChipClick(chip, category) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filtered = category === 'All' ? videoData : videoData.filter(v => v.category === category);
    displayVideos(filtered);
}

function setupSidebar() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.textContent.replace(/[^\x00-\x7F]/g, "").trim(); 
            document.querySelector('.nav-item.active')?.classList.remove('active');
            item.classList.add('active');
            if (page === 'Home') renderHome();
            else if (page === 'History') renderHistory();
            else contentArea.innerHTML = `<div style="padding:50px; text-align:center; color: white;"><h1>${page} Page Coming Soon</h1><button onclick="renderHome()" class="chip active">Go Home</button></div>`;
        });
    });
}

function renderHistory() {
    contentArea.innerHTML = `
        <div style="padding: 24px; overflow-y: auto;">
            <h1 style="color: white; margin-bottom: 24px;">Watch History</h1>
            <div class="video-grid">
                ${watchHistory.length > 0 ? watchHistory.map(v => `
                    <div class="video-card" onclick="playVideo('${v.id}', '${v.title}')">
                        <div class="thumbnail" style="background-image: url('${v.thumb}'); background-size: cover;"></div>
                        <div class="video-info">
                            <div class="avatar" style="background: var(--accent-teal);"></div>
                            <div class="details"><h3>${v.title}</h3><p>${v.channel}</p></div>
                        </div>
                    </div>`).join('') : '<p style="color: #666;">No watch history found.</p>'}
            </div>
        </div>
    `;
}

function toggleTheater() {
    const container = document.querySelector('.watch-container');
    const playerSection = document.querySelector('.player-section');
    if (!container) return;

    if (container.style.flexDirection === 'column') {
        container.style.flexDirection = 'row';
        playerSection.style.boxShadow = "none";
    } else {
        container.style.flexDirection = 'column';
        playerSection.style.boxShadow = "0 0 50px rgba(0, 245, 212, 0.1)";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function toggleTheme() {
    isHighContrast = !isHighContrast;
    document.documentElement.style.setProperty('--bg-dark', isHighContrast ? '#050505' : '#0f0f0f');
    document.body.style.filter = isHighContrast ? 'contrast(1.2) brightness(0.9)' : 'none';
}