(function() {
    // ===== 文章列表配置 =====
    const articleFiles = [
        { file: '2026-06-29-900元炸弹主机.md', tags: ['装机', '捡垃圾'] },
        { file: '2026-6-29-AwA你好，我的小窝.md', tags: ['新的开始'] },
        // 新增文章在此添加
    ];

    const container = document.getElementById('postList');
    const archiveContainer = document.getElementById('archiveList');

    // ===== 从文件名解析信息 =====
    function parseArticleInfo(fileName) {
        const nameParts = fileName.replace(/\.md$/, '').split('-');
        const date = `${nameParts[0]}-${nameParts[1]}-${nameParts[2]}`;
        const title = nameParts.slice(3).join('-');
        return { date, title };
    }

    // ===== 加载所有文章摘要 =====
    async function loadArticles() {
        const posts = [];
        for (const item of articleFiles) {
            try {
                const response = await fetch(`./md/${item.file}`);
                if (!response.ok) continue;
                const content = await response.text();
                const { date, title } = parseArticleInfo(item.file);

                // 提取摘要：第一段非空非标题行
                const lines = content.split('\n');
                let summary = '';
                let inContent = false;
                for (const line of lines) {
                    if (line.trim() === '') {
                        if (inContent) break;
                        continue;
                    }
                    if (!inContent && !line.startsWith('#')) {
                        inContent = true;
                        summary = line.trim();
                        break;
                    }
                }
                if (summary.length > 150) summary = summary.slice(0, 150) + '...';

                posts.push({
                    id: item.file,
                    title: title,
                    date: date,
                    tags: item.tags || [],
                    summary: summary,
                    file: item.file
                });
            } catch (e) {
                console.warn('加载文章失败:', item.file, e);
            }
        }
        return posts;
    }

    // ===== 渲染文章列表（点击跳转到详情页） =====
    function renderPosts(posts) {
        if (!container) return;
        container.innerHTML = '';
        if (posts.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-feather-alt"></i>
                    <p>还没有文章，但小窝很温暖 ☀️</p>
                </div>
            `;
            return;
        }
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card';
            // 整张卡片可点击跳转
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                window.location.href = `./post.html?id=${encodeURIComponent(post.file)}`;
            });

            const tagsHtml = post.tags.map(t => `<span class="tag">#${t}</span>`).join(' ');

            card.innerHTML = `
                <div class="post-title">
                    <span>${post.title}</span>
                    <span style="font-size:0.8rem; color:#888;">→</span>
                </div>
                <div class="post-meta">
                    <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                    <span>${tagsHtml}</span>
                </div>
                <div class="post-summary">${post.summary}</div>
                <div style="margin-top:8px; font-size:0.8rem; color:#888;">
                    点击阅读全文 →
                </div>
            `;

            container.appendChild(card);
        });
    }

    // ===== 渲染归档 =====
    function renderArchive(posts) {
        if (!archiveContainer) return;
        archiveContainer.innerHTML = '';
        if (posts.length === 0) {
            archiveContainer.innerHTML = '<li style="color:#888; list-style:none; padding: 20px 0;">暂无文章</li>';
            return;
        }
        const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
        sorted.forEach(post => {
            const li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.addEventListener('click', function() {
                window.location.href = `./post.html?id=${encodeURIComponent(post.file)}`;
            });
            li.innerHTML = `<span>${post.title}</span><span class="date">${post.date}</span>`;
            archiveContainer.appendChild(li);
        });
    }

    // ===== 初始化 =====
    async function init() {
        const posts = await loadArticles();
        renderPosts(posts);
        renderArchive(posts);
    }

    init();

    // ===== 汉堡菜单（保持不变） =====
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const menuDropdown = document.getElementById('menuDropdown');
    let menuOpen = false;

    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        menuOpen = !menuOpen;
        if (menuOpen) {
            hamburgerIcon.className = 'fas fa-times';
            menuDropdown.classList.add('open');
        } else {
            hamburgerIcon.className = 'fas fa-bars';
            menuDropdown.classList.remove('open');
        }
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page-' + page);
            if (target) target.classList.add('active');
            menuOpen = false;
            hamburgerIcon.className = 'fas fa-bars';
            menuDropdown.classList.remove('open');
        });
    });

    document.addEventListener('click', function() {
        if (menuOpen) {
            menuOpen = false;
            hamburgerIcon.className = 'fas fa-bars';
            menuDropdown.classList.remove('open');
        }
    });
})();
