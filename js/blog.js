// ===== 博客列表页：标签筛选 + 分页 =====

const POSTS_PER_PAGE = 4;
let currentTag = 'all';
let currentPage = 1;

// 获取 URL 参数中的 tag
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// 渲染标签筛选按钮
function renderTagFilters() {
  const container = document.getElementById('tagFilters');
  if (!container) return;
  const tagParam = getUrlParam('tag');
  if (tagParam) currentTag = tagParam;

  let html = '<button class="tag-btn active" data-tag="all">全部</button>';
  allTags.forEach(tag => {
    const active = tag === currentTag ? ' active' : '';
    html += `<button class="tag-btn${active}" data-tag="${tag}">${tag}</button>`;
  });
  container.innerHTML = html;

  // 绑定点击事件
  container.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTag = btn.dataset.tag;
      currentPage = 1;
      renderPosts();
      renderPagination();
      // 更新 URL
      const url = new URL(window.location);
      if (currentTag !== 'all') {
        url.searchParams.set('tag', currentTag);
      } else {
        url.searchParams.delete('tag');
      }
      window.history.replaceState({}, '', url);
    });
  });
}

// 渲染文章
function renderPosts() {
  const container = document.getElementById('allPosts');
  if (!container) return;

  let filtered = currentTag === 'all'
    ? postsData
    : postsData.filter(p => p.tags.includes(currentTag));

  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(startIdx, startIdx + POSTS_PER_PAGE);

  if (pagePosts.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>暂无文章，敬请期待 🚧</p></div>';
    return;
  }

  container.innerHTML = pagePosts.map(renderPostCard).join('');
}

// 渲染分页
function renderPagination() {
  const container = document.getElementById('pagination');
  if (!container) return;

  let filtered = currentTag === 'all'
    ? postsData
    : postsData.filter(p => p.tags.includes(currentTag));

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  // 上一页
  html += `<button class="page-btn${currentPage <= 1 ? ' disabled' : ''}" data-page="${currentPage - 1}">‹</button>`;
  // 页码
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  // 下一页
  html += `<button class="page-btn${currentPage >= totalPages ? ' disabled' : ''}" data-page="${currentPage + 1}">›</button>`;
  container.innerHTML = html;

  // 绑定事件
  container.querySelectorAll('.page-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (isNaN(page) || page < 1 || page > totalPages) return;
      currentPage = page;
      renderPosts();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// 初始化
if (document.getElementById('allPosts')) {
  renderTagFilters();
  renderPosts();
  renderPagination();
}