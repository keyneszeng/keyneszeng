# 清晨的个人博客

🌅 一个干净、现代的个人博客网站，支持深色/浅色模式切换。

## 功能特性

- ✨ 极简现代化设计，专注阅读体验
- 🌙 深色/浅色主题一键切换（自动保存偏好）
- 📱 响应式布局，完美适配手机、平板和桌面
- 🏷️ 文章标签筛选与分页
- 📖 文章详情页带上下篇导航
- 📝 数据驱动的前端架构，无需后端即可运行

## 快速启动

### 方式一：直接用浏览器打开

```bash
# 进入项目目录
cd /Users/mac/personal-blog

# 直接打开首页
open index.html
```

### 方式二：使用本地服务器（推荐）

```bash
cd /Users/mac/personal-blog

# 使用 Python 内置 HTTP 服务器
python3 -m http.server 3000

# 或使用 Node.js 的 serve 包
# npx serve .
```

然后打开浏览器访问 `http://localhost:3000`

## 项目结构

```
personal-blog/
├── index.html          # 首页
├── blog.html           # 文章列表页
├── post.html           # 文章详情页（动态渲染）
├── about.html          # 关于页面
├── css/
│   └── style.css       # 全局样式
├── js/
│   ├── posts.js        # 文章数据 + 通用渲染函数
│   ├── main.js         # 全局功能（主题、菜单）
│   ├── blog.js         # 列表页逻辑（筛选、分页）
│   └── post.js         # 详情页逻辑
└── README.md
```

## 自定义

### 添加新文章

编辑 `js/posts.js`，在 `postsData` 数组中添加新对象：

```javascript
{
  id: 'your-post-slug',
  title: '文章标题',
  date: '2026-06-20',
  tags: ['技术', '前端'],
  excerpt: '文章摘要...',
  content: `
<p>文章内容...</p>
  `.trim()
}
```

### 修改个人信息

编辑 `about.html` 中的姓名、技能标签和联系方式。

## 技术栈

- 纯 HTML5 + CSS3 + JavaScript（零依赖）
- CSS 自定义属性实现主题切换
- 原生 JS 实现 SPA 式页面路由
- 无框架，开箱即用

## License

MIT
