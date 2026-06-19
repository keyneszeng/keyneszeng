// ===== 文章详情页：渲染完整文章内容 =====

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderPost() {
  const container = document.getElementById('postContent');
  if (!container) return;
  
  const id = getPostId();
  const post = postsData.find(p => p.id === id);
  
  if (!post) {
    container.innerHTML = `
      <div class="empty-state" style="text-align:center;padding:60px 0;">
        <p style="font-size:1.2rem;color:var(--text-muted);">文章未找到 😅</p>
        <a href="/blog.html" class="btn btn-primary" style="margin-top:20px;">返回文章列表</a>
      </div>
    `;
    document.title = '文章未找到 | 医疗AI工坊';
    return;
  }
  
  // 设置页面标题和Meta标签（GEO优化）
  document.title = post.title + ' | 医疗AI工坊';
  document.getElementById('pageDescription').textContent = post.excerpt;
  document.getElementById('pageKeywords').textContent = post.tags.join(', ');
  document.getElementById('ogUrl').textContent = window.location.href;
  document.getElementById('ogTitle').textContent = post.title;
  document.getElementById('ogDescription').textContent = post.excerpt;
  document.getElementById('twitterUrl').textContent = window.location.href;
  document.getElementById('twitterTitle').textContent = post.title;
  document.getElementById('twitterDescription').textContent = post.excerpt;
  
  // 设置 Schema.org 结构化数据（GEO优化）
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": "Keynes Zeng",
      "url": "https://keyneszeng.github.io/keyneszeng/about.html"
    },
    "datePublished": post.date,
    "inLanguage": "zh-CN",
    "keywords": post.tags.join(', '),
    "mainEntityOfPage": window.location.href
  };
  document.getElementById('schemaJson').textContent = JSON.stringify(schemaData, null, 2);
  
  const tagsHTML = post.tags.map(t => `<span class="post-tag">${t}</span>`).join('');

  container.innerHTML = `
    <header class="post-article-header">
      <div class="post-tags">${tagsHTML}</div>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <span class="post-date">${formatDate(post.date)}</span>
        <span>·</span>
        <span>💬 暂无评论</span>
      </div>
    </header>
    <div class="post-article-body">
      ${post.content}
    </div>
  `;

  // 渲染上下篇导航
  renderPostNav(post);
}

function renderPostNav(currentPost) {
  const navContainer = document.getElementById('postNav');
  if (!navContainer) return;

  const currentIdx = postsData.findIndex(p => p.id === currentPost.id);
  const prev = currentIdx > 0 ? postsData[currentIdx - 1] : null;
  const next = currentIdx < postsData.length - 1 ? postsData[currentIdx + 1] : null;

  if (!prev && !next) {
    navContainer.style.display = 'none';
    return;
  }

  // 添加一些内联样式
  const style = document.createElement('style');
  style.textContent = `
    .post-navigation {
      max-width: var(--max-width, 800px);
      margin: 48px auto 0;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      border-top: 1px solid var(--border);
      padding-top: 32px;
    }
    .post-nav-link {
      flex: 1;
      padding: 16px 20px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-secondary);
      transition: all var(--transition);
      text-decoration: none !important;
    }
    .post-nav-link:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: var(--card-shadow-hover);
    }
    .post-nav-link.next { text-align: right; }
    .post-nav-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .post-nav-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .post-nav-link:hover .post-nav-title { color: var(--accent); }
    .post-nav-link.disabled {
      opacity: 0.3;
      pointer-events: none;
    }
    @media (max-width: 600px) {
      .post-navigation { flex-direction: column; }
      .post-nav-link.next { text-align: left; }
    }
  `;
  document.head.appendChild(style);

  let html = '';
  if (prev) {
    html += `<a href="/post.html?id=${prev.id}" class="post-nav-link prev">
      <div class="post-nav-label">← 上一篇</div>
      <div class="post-nav-title">${prev.title}</div>
    </a>`;
  } else {
    html += `<div class="post-nav-link prev disabled"></div>`;
  }

  if (next) {
    html += `<a href="/post.html?id=${next.id}" class="post-nav-link next">
      <div class="post-nav-label">下一篇 →</div>
      <div class="post-nav-title">${next.title}</div>
    </a>`;
  } else {
    html += `<div class="post-nav-link next disabled"></div>`;
  }

  navContainer.innerHTML = html;
}

// 初始化
if (document.getElementById('postContent')) {
  renderPost();
}
