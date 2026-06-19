// ===== 博客搜索功能 =====

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('searchResults');
const statsContainer = document.getElementById('searchStats');

// 搜索函数
function searchPosts(query) {
  if (!query.trim()) {
    resultsContainer.innerHTML = '';
    statsContainer.innerHTML = '';
    return;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  const results = postsData.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(normalizedQuery);
    const excerptMatch = post.excerpt.toLowerCase().includes(normalizedQuery);
    const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
    const contentMatch = post.content.toLowerCase().includes(normalizedQuery);
    return titleMatch || excerptMatch || tagMatch || contentMatch;
  });
  
  // 排序：标题匹配优先
  results.sort((a, b) => {
    const aScore = scoreMatch(a, normalizedQuery);
    const bScore = scoreMatch(b, normalizedQuery);
    return bScore - aScore;
  });
  
  // 渲染结果
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-empty">
        <p class="search-empty-icon">😕</p>
        <p>未找到相关文章</p>
        <p class="search-empty-hint">试试其他关键词？</p>
      </div>
    `;
    statsContainer.innerHTML = '';
    return;
  }
  
  resultsContainer.innerHTML = results.map(post => {
    const tagsHTML = post.tags.map(t => `<span class="post-tag">${t}</span>`).join('');
    const dateStr = new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // 高亮关键词
    const highlight = (text) => {
      if (!normalizedQuery) return text;
      const regex = new RegExp(`(${normalizedQuery})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };
    
    return `
      <article class="post-card">
        <div class="post-tags">${tagsHTML}</div>
        <div class="post-date">${dateStr}</div>
        <h3><a href="/post.html?id=${post.id}">${highlight(post.title)}</a></h3>
        <p class="post-excerpt">${highlight(post.excerpt)}</p>
        <a href="/post.html?id=${post.id}" class="post-read-more">阅读全文 →</a>
      </article>
    `;
  }).join('');
  
  // 统计信息
  const searchTime = (performance.now() - startTime).toFixed(2);
  statsContainer.innerHTML = `
    <p class="search-stats-text">
      找到 <strong>${results.length}</strong> 篇相关文章，耗时 ${searchTime}ms
    </p>
  `;
}

// 匹配评分
function scoreMatch(post, query) {
  let score = 0;
  if (post.title.toLowerCase().includes(query)) score += 10;
  if (post.excerpt.toLowerCase().includes(query)) score += 5;
  if (post.tags.some(t => t.toLowerCase().includes(query))) score += 3;
  if (post.content.toLowerCase().includes(query)) score += 1;
  return score;
}

// 事件绑定
let startTime = 0;

function handleSearch() {
  startTime = performance.now();
  searchPosts(searchInput.value);
}

if (searchBtn) {
  searchBtn.addEventListener('click', handleSearch);
}

if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  // 自动搜索（防抖）
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSearch, 300);
  });
}

// 从 URL 参数读取搜索词
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');
if (searchQuery) {
  searchInput.value = searchQuery;
  handleSearch();
}
