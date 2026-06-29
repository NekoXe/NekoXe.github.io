(function() {
    // ===== 从 URL 获取文章文件名 =====
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('id');
    if (!file) {
        document.getElementById('postContent').innerHTML = '<p style="color:#888;">未指定文章</p>';
        return;
    }

    const container = document.getElementById('postContent');

    // ===== 加载并渲染 Markdown =====
    async function loadPost() {
        try {
            const response = await fetch(`./md/${file}`);
            if (!response.ok) throw new Error('文章不存在');
            const markdown = await response.text();
            const html = marked.parse(markdown);
            container.innerHTML = html;
            // 修改标题
            const titleMatch = markdown.match(/^#\s+(.+)/m);
            if (titleMatch) {
                document.title = titleMatch[1] + ' · XeRiver的小窝';
            }
        } catch (e) {
            container.innerHTML = `<p style="color:#888;">加载失败：${e.message}</p>`;
        }
    }

    loadPost();
})();