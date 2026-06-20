(function() {
    // 主题切换
    const themeBtn = document.getElementById('themeToggleBtn');
    const bodyEl = document.body;
    const themeLabel = document.getElementById('themeLabel');
    const themeIcon = document.getElementById('themeIcon');
    function setTheme(theme) {
        if (theme === 'dark') {
            bodyEl.classList.add('dark');
            localStorage.setItem('neoxe_theme', 'dark');
            themeLabel.innerText = '深色';
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        } else {
            bodyEl.classList.remove('dark');
            localStorage.setItem('neoxe_theme', 'light');
            themeLabel.innerText = '浅色';
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
    }
    const saved = localStorage.getItem('neoxe_theme');
    if (saved === 'dark') setTheme('dark');
    else setTheme('light');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = bodyEl.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // 页面切换
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page-content');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-page');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pages.forEach(p => p.classList.remove('active-page'));
            const activePage = document.getElementById(target);
            if (activePage) activePage.classList.add('active-page');
        });
    });

    // 图片加载（带点击放大功能，确保事件绑定）
    function loadImages(seriesName, container) {
        if (!container) return;
        container.innerHTML = '';
        const base = `/img/${seriesName}/`;
        const exts = ['1.webp', '2.webp', '1.png', '2.png', '1.jpg', '2.jpg'];
        let loadedCount = 0;
        const totalFiles = exts.length;
        // 创建图片元素的函数
        function createImageElement(file) {
            const img = document.createElement('img');
            img.style.maxWidth = '200px';
            img.style.height = 'auto';
            img.style.borderRadius = '12px';
            img.alt = `${seriesName} preview`;
            img.style.cursor = 'pointer';
            // 直接绑定点击事件（无论加载成功与否）
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                // 如果图片还没加载完成，或者src为空，不做响应
                if (!this.src || this.src === window.location.href) return;
                // 创建遮罩
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.75);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    cursor: pointer;
                    backdrop-filter: blur(6px);
                `;
                overlay.addEventListener('click', function() {
                    this.remove();
                });
                const bigImg = document.createElement('img');
                bigImg.src = this.src;
                bigImg.style.cssText = `
                    max-width: 92%;
                    max-height: 92%;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                    object-fit: contain;
                    background: white;
                    padding: 4px;
                `;
                overlay.appendChild(bigImg);
                document.body.appendChild(overlay);
            });
            // 加载成功/失败后都尝试添加到容器（如果没加载成功，可能不显示）
            const onLoadOrError = () => {
                // 检查图片是否有效（宽度高度>0）
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    container.appendChild(img);
                    loadedCount++;
                    if (container.style.display === 'none') container.style.display = '';
                }
                // 判断是否所有文件都已尝试
                if (loadedCount === totalFiles) {
                    if (container.children.length === 0) {
                        container.style.display = 'none';
                    } else {
                        container.style.display = '';
                    }
                }
            };
            img.onload = onLoadOrError;
            img.onerror = () => {
                // 即使加载失败，也计入计数，但不添加到容器
                loadedCount++;
                if (loadedCount === totalFiles && container.children.length === 0) {
                    container.style.display = 'none';
                }
            };
            img.src = base + file;
            // 如果图片已经缓存，可能已经complete，手动调用onload
            if (img.complete) {
                // 如果已经加载完成，直接触发onload逻辑
                if (img.naturalWidth > 0) {
                    container.appendChild(img);
                    loadedCount++;
                    if (container.style.display === 'none') container.style.display = '';
                } else {
                    loadedCount++;
                }
                if (loadedCount === totalFiles) {
                    if (container.children.length === 0) {
                        container.style.display = 'none';
                    } else {
                        container.style.display = '';
                    }
                }
            }
        }
        // 遍历所有文件
        exts.forEach(file => createImageElement(file));
        // 如果所有文件加载完都没有有效图片，隐藏容器
        setTimeout(() => {
            if (container.children.length === 0) {
                container.style.display = 'none';
            } else {
                container.style.display = '';
            }
        }, 500);
    }

    const groups = { Ultra:'Ultra', Elite:'Elite', Max:'Max', Slim:'Slim', SuperLite:'SuperLite', Arm:'Arm' };
    for (const [id, name] of Object.entries(groups)) {
        const el = document.getElementById(`imgGroup-${id}`);
        if (el) loadImages(name, el);
    }

    // 版本展开折叠
    document.querySelectorAll('.version-item').forEach(item => {
        const sum = item.querySelector('.version-summary');
        const wrap = item.querySelector('.version-detail-wrapper');
        const icon = sum?.querySelector('.expand-icon');
        if (sum && wrap) {
            sum.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShow = wrap.classList.contains('show');
                if (isShow) {
                    wrap.classList.remove('show');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                } else {
                    wrap.classList.add('show');
                    if (icon) icon.classList.remove('fa-chevron-down');
                    if (icon) icon.classList.add('fa-chevron-up');
                }
            });
        }
    });

    // 问答展开折叠
    document.querySelectorAll('.qa-item').forEach(item => {
        const q = item.querySelector('.qa-question');
        const wrap = item.querySelector('.qa-answer-wrapper');
        const icon = q?.querySelector('.expand-icon');
        if (q && wrap) {
            q.addEventListener('click', () => {
                const isShow = wrap.classList.contains('show');
                if (isShow) {
                    wrap.classList.remove('show');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                } else {
                    wrap.classList.add('show');
                    if (icon) icon.classList.remove('fa-chevron-down');
                    if (icon) icon.classList.add('fa-chevron-up');
                }
            });
        }
    });
})();