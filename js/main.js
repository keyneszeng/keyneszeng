// ===== 全局功能：主题切换、移动菜单、年份 =====

// 主题切换
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('blog-theme') || 'light';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('blog-theme', theme);
  currentTheme = theme;
}
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });
}

// 移动端菜单
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
if (mobileBtn && mobileNav) {
  mobileBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}

// 自动更新年份
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// 首页：渲染最新文章
const latestContainer = document.getElementById('latestPosts');
if (latestContainer) {
  const latest = postsData.slice(0, 3);
  latestContainer.innerHTML = latest.map(renderPostCard).join('');
}

// 首页：渲染我的医疗AI工具
const aiProjects = [
  {
    icon: '🧠',
    title: 'ZhiYi24AI：执医24项AI临床技能评估系统',
    desc: '基于MediaPipe姿态估计技术，通过普通USB摄像头即可实现执业医师资格考试24项临床技能的实时AI评估。MIT开源，硬件成本仅约50元。具备AutoSkill→SelfTrain→ABTest自进化能力。',
    tools: ['Python', 'MediaPipe', 'NumPy', 'AI'],
    link: '/post.html?id=zhiyi24ai-clinical-skills-system'
  },
  {
    icon: '🏥',
    title: 'USB-OpenMed：医疗文本脱敏系统',
    desc: '基于OpenMed开源框架的USB即插即用型医疗脱敏工具。纯规则引擎实现，支持中文PII识别（身份证、电话、姓名、医保号等），无需GPU，医院内网可直接部署。',
    tools: ['Python', 'FastAPI', 'Swift OCR'],
    link: '/post.html?id=usb-openmed-research'
  },
  {
    icon: '🩺',
    title: '执医24项AI临床技能评估框架（CPR MVP）',
    desc: '以CPR为MVP验证的AI评估框架，实现零专用硬件的客观评分系统。算法精度99.9%，支持声明式技能定义（skill.yaml + scoring.py），社区贡献者可快速接入新技能插件。',
    tools: ['Python', 'MediaPipe', 'AI'],
    link: '/post.html?id=zhixi-24-ai-clinical-skills'
  },
  {
    icon: '🤖',
    title: 'Hermes Agent AI助手',
    desc: '基于大语言模型的智能代理系统，支持工具调用、多轮对话、任务编排。应用于自动化工作流和智能客服场景。',
    tools: ['Python', 'LLM', 'Tool-Use']
  }
];

const projectsContainer = document.getElementById('aiProjects');
if (projectsContainer) {
  projectsContainer.innerHTML = aiProjects.map(p => `
    <div class="ai-project-card" ${p.video ? 'data-video="' + p.video + '"' : ''}>
      <div class="ai-project-header">
        <div class="ai-project-icon">${p.icon}</div>
        <h3>${p.title}</h3>
      </div>
      <p class="ai-project-desc">${p.desc}</p>
      <div class="ai-project-tools">
        ${p.tools.map(t => `<span class="ai-project-tool">${t}</span>`).join('')}
      </div>
      ${p.video ? '<button class="ai-video-btn">▶ 观看演示视频</button>' : ''}
      ${p.link ? '<a href="' + p.link + '" class="ai-project-link">📖 查看详情 →</a>' : ''}
    </div>
  `).join('');
}

// 视频弹窗逻辑
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = document.querySelector('.video-modal-close');

if (videoModal) {
  // 绑定播放按钮点击
  document.querySelectorAll('.ai-video-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ai-project-card');
      const videoSrc = card ? card.dataset.video : null;
      if (videoSrc) {
        // 设置视频源（两个source都用同一个URL，浏览器会自动选择支持的格式）
        modalVideo.querySelectorAll('source').forEach(s => s.src = videoSrc);
        modalVideo.load();
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        modalVideo.play();
      }
    });
  });

  // 关闭按钮
  modalClose.addEventListener('click', () => {
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
  });

  // 点击背景关闭
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove('active');
      videoModal.setAttribute('aria-hidden', 'true');
      modalVideo.pause();
    }
  });

  // ESC 键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      videoModal.classList.remove('active');
      videoModal.setAttribute('aria-hidden', 'true');
      modalVideo.pause();
    }
  });
}