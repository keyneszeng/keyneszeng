// ===== 博客文章数据 =====
const postsData = [
  {
    id: 'zhixi-24-ai-clinical-skills',
    title: '执医24项AI临床技能训练评估框架：从CPR评分到自我进化系统',
    date: '2026-06-19',
    tags: ['AI', 'AI工具', '医疗健康'],
    excerpt: '执业医师资格考试24项临床技能的AI评估框架，以CPR为MVP验证，实现零专用硬件的客观评分系统，具备AutoSkill→SelfTrain→ABTest自我进化能力。',
    content: `
<h2>一、问题定义</h2>
<p>全国约1800家三级甲等医院每年承担着数十万住院医师的规范化培训任务。培训中的核心环节——24项临床技能考核（包括心肺复苏、电除颤、腰椎穿刺、腹腔穿刺、导尿术、胃管置入、伤口缝合等）——至今仍主要依赖考官现场目测打分，存在<strong>主观性强、标准不一、无法规模化</strong>的根本性缺陷。</p>

<table>
  <tr><th>维度</th><th>现状</th><th>问题</th></tr>
  <tr><td>评估方式</td><td>考官现场目测打分</td><td>主观性强，同操作不同考官评分差异可达20-30分</td></tr>
  <tr><td>训练手段</td><td>高仿真模拟人（单价¥5K-50K）</td><td>成本高，无法大规模部署</td></tr>
  <tr><td>反馈时效</td><td>操作结束后口头反馈</td><td>非实时，学生无法感知错误时机</td></tr>
  <tr><td>数据积累</td><td>无系统化记录</td><td>无法追踪学员进步轨迹</td></tr>
</table>

<h2>二、解决方案：AI-Native框架</h2>
<p>本文提出并实现了一套<strong>AI-Native临床技能训练评估框架</strong>，以心肺复苏（CPR）操作评估为MVP验证案例，利用MediaPipe姿态估计实现<strong>零专用硬件</strong>的客观评分系统。</p>

<h3>2.1 整体架构</h3>
<pre><code>┌─────────────────────────────────────────────────────────────┐
│                    展示层 (Dashboard)                         │
│  实时HUD: 摄像头画面 + 评分面板 + AI导师反馈 + 趋势图        │
├─────────────────────────────────────────────────────────────┤
│                    AI推理层 (AI Engine)                       │
│  MediaPipe Pose │ LLM Tutor │ 脱敏数据通道 │ 特征提取       │
├─────────────────────────────────────────────────────────────┤
│                    业务逻辑层 (Core)                         │
│  注册中心 │ 评分引擎 │ 数据中枢 │ 技能编排器 │ 自我进化引擎  │
├─────────────────────────────────────────────────────────────┤
│                     数据层 (Data Hub)                        │
│  SQLite (本地) │ 匿名化特征存储 │ 培训记录 │ Session管理    │
└─────────────────────────────────────────────────────────────┘</code></pre>

<h3>2.2 核心设计理念</h3>
<table>
  <tr><th>特征</th><th>传统方案（AI-attached）</th><th>AI-Native（本文方案）</th></tr>
  <tr><td>AI角色</td><td>后加的"智能模块"</td><td>从第一天集成</td></tr>
  <tr><td>数据流</td><td>AI单向消费数据</td><td>数据飞轮：评估→收集→训练→优化</td></tr>
  <tr><td>扩展性</td><td>每个技能单独开发</td><td>声明式skill.yaml + 插件引擎</td></tr>
  <tr><td>进化能力</td><td>手动更新模型</td><td>AutoSkill + SelfTrain + ABTest 自动进化</td></tr>
</table>

<h2>三、CPR评分算法</h2>
<h3>3.1 信号提取</h3>
<p>从MediaPipe输出中提取手腕关键点（Landmark 15, 16）的Y轴坐标序列，通过以下步骤处理：</p>
<ol>
  <li><strong>平滑滤波</strong>：Savitzky-Golay滤波器去除高频噪声</li>
  <li><strong>基线漂移校正</strong>：去除呼吸和身体微动导致的信号漂移</li>
  <li><strong>峰检测</strong>：基于纯NumPy的局部极大值检测（无需SciPy）</li>
</ol>

<h3>3.2 评分维度</h3>
<table>
  <tr><th>评分维度</th><th>权重</th><th>满分条件</th></tr>
  <tr><td>按压频率(CPM)</td><td>50%</td><td>100-120 CPM（目标值110）</td></tr>
  <tr><td>节奏一致性(CV%)</td><td>30%</td><td>CV < 10%</td></tr>
  <tr><td>深度指数</td><td>20%</td><td>稳定且有力的按压</td></tr>
</table>

<p><strong>综合评分</strong>: <code>score = (frequency_score × 0.5 + consistency_score × 0.3 + depth_score × 0.2) × 100</code></p>
<p>在合成数据上的验证结果：<strong>CPM=110, CV=3.8%, Score=99/100，算法准确率99.9%</strong>。</p>

<h2>四、自我进化系统</h2>
<p>AI-Native框架的核心创新在于三阶段自我进化引擎：</p>

<h3>4.1 AutoSkill——从数据生成新技能</h3>
<p>当某个相近操作的训练数据积累到<strong>5000条</strong>后，AutoSkill模块自动分析操作模式，生成新的技能定义（skill.yaml + scoring.py模板）。所有生成内容保持人工可审查（human-in-the-loop）。</p>

<h3>4.2 SelfTrain——自动参数优化</h3>
<p>收集<strong>100条</strong>以上训练数据后触发，通过网格搜索调整评分权重参数，输出新版本模型。</p>

<h3>4.3 ABTest——灰度切换</h3>
<p>当优化后的模型积累<strong>30条</strong>验证数据后，将流量随机分配为A组（旧模型）和B组（新模型），计算改进幅度的统计显著性（阈值：2%），显著时自动切换。</p>

<h2>五、LLM导师系统</h2>
<p>支持多供应商架构，默认离线模式（零成本），可选DeepSeek（~¥0.001/次）或OpenAI：</p>
<table>
  <tr><th>供应商</th><th>角色</th><th>成本</th></tr>
  <tr><td>OfflineTutor</td><td>默认模式（离线、免费）</td><td>零</td></tr>
  <tr><td>DeepSeek</td><td>推荐在线模式</td><td>~¥0.001/次</td></tr>
  <tr><td>OpenAI</td><td>备用在线模式</td><td>~$0.002/次</td></tr>
</table>

<h2>六、测试结果</h2>
<table>
  <tr><th>测试项</th><th>结果</th></tr>
  <tr><td>姿态检测</td><td>单人正面姿态稳定33个关键点检测，30+ FPS</td></tr>
  <tr><td>CPR评分算法</td><td>CPM=110, CV=3.8%, Score=99/100 (合成数据)</td></tr>
  <tr><td>框架注册中心</td><td>1 skill found (CPR), 自动发现</td></tr>
  <tr><td>AutoSkill</td><td>可生成835B YAML + 731B Python 模板</td></tr>
  <tr><td>端到端测试</td><td>合成视频检测通过，算法已验证</td></tr>
</table>

<h2>七、商业机会</h2>
<h3>7.1 市场规模</h3>
<table>
  <tr><th>维度</th><th>估算</th></tr>
  <tr><td>TAM（总可寻址市场）</td><td>¥500-1500亿人民币</td></tr>
  <tr><td>SAM（可服务市场）</td><td>¥50-150亿/年</td></tr>
  <tr><td>目标客户</td><td>全国~1800家三甲医院 + 200+所医学院</td></tr>
</table>

<h3>7.2 价值主张</h3>
<table>
  <tr><th>维度</th><th>传统方案</th><th>AI-Native方案</th></tr>
  <tr><td>硬件成本</td><td>¥5K-200K/台（模拟人）</td><td>零（普通摄像头）</td></tr>
  <tr><td>评估一致性</td><td>主观偏差20-30分</td><td>评分标准完全统一</td></tr>
  <tr><td>部署时间</td><td>数月</td><td>3分钟</td></tr>
</table>

<h3>7.3 企业机遇</h3>
<p><strong>第一梯队：天津天堰科技 (300314.SZ)</strong> — A股上市，市值约40-60亿，全国1000+医院渠道，可OEM合作或技术授权。</p>
<p><strong>第二梯队：北京医模科技 (300331.SZ) / 科大讯飞 (002230.SZ)</strong> — 硬件能力+AI渠道，可作为Plan B。</p>

<h2>八、正在进行的研发</h2>
<p><strong>正联合多个医疗AI研究者共同研发其余执医23项AI算法</strong>，包括电除颤、腰椎穿刺、腹腔穿刺、导尿术、胃管置入、伤口缝合等核心临床技能。框架已支持声明式技能定义（skill.yaml + scoring.py），社区贡献者可快速接入新技能插件。</p>
<p>相关项目：<a href="/post.html?id=usb-openmed-research">USB-OpenMed：基于OpenMed的便携式医疗文本脱敏系统</a> — 同样基于OpenMed开源框架，实现纯规则引擎的医疗数据脱敏。</p>

<h2>九、结论</h2>
<p>本文提出并实现了一套AI-Native临床技能训练评估框架，以CPR操作为验证案例，证明了<strong>"零专用硬件、纯摄像头+AI评分"方案的可行性</strong>。主要贡献包括：</p>
<ol>
  <li><strong>技术贡献</strong>：实现了一套基于MediaPipe姿态估计的实时CPR评分系统（算法精度99.9%），并设计了可扩展的AI-Native框架。</li>
  <li><strong>系统设计贡献</strong>：提出了四阶段数据飞轮和三阶段自我进化引擎（AutoSkill → SelfTrain → ABTest）。</li>
  <li><strong>商业贡献</strong>：系统分析了中国医疗教育AI市场的真空状态，提出了从开源到企业级部署的完整商业化路径。</li>
  <li><strong>方法论贡献</strong>：验证了"轻量规则+AI"的务实路线在医疗AI中的有效性——仅3个Python包，总大小<20MB。</li>
</ol>

<p><strong>关键结论</strong>：AI+临床技能训练评估是一个被严重低估的蓝海市场。先行者有机会在竞品出现之前建立起数据飞轮、社区和品牌壁垒。</p>

<hr>
<p><em>项目地址：<a href="https://github.com/calmanzeng/cpr-ai-scorer" target="_blank">https://github.com/calmanzeng/cpr-ai-scorer</a></em></p>
    `.trim()
  },
  {
    id: 'usb-openmed-research',
    title: 'USB-OpenMed：基于OpenMed的便携式医疗文本脱敏系统研发实践',
    date: '2026-06-20',
    tags: ['AI', 'AI工具', '医疗健康'],
    excerpt: '从开源框架分析到落地部署，完整记录基于OpenMed构建USB即插即用型医疗脱敏工具的技术探索与实践经验。',
    content: `
<h2>一、项目背景</h2>
<p>医疗数据脱敏是临床研究、AI训练和跨机构数据共享的前提条件。然而，大多数脱敏方案依赖云端API或重型ML模型部署，在医院内网环境下难以落地。</p>
<p>2026年6月，我们在OpenMed v1.5.5（Apache-2.0开源）的基础上，启动了一个新的探索方向：<strong>构建一套纯本地、零依赖、USB即插即用的医疗文本脱敏工具</strong>，命名为USB-OpenMed。</p>

<h2>二、OpenMed框架分析</h2>
<p>OpenMed是一个本地优先的医疗AI框架，由Maziyar Panahi创建，在GitHub上获得3,540+ Stars。其核心能力分为三大块：</p>

<h3>2.1 临床NER（命名实体识别）</h3>
<p>从非结构化临床文本中提取结构化医疗实体，包括疾病检测、药物/治疗实体、解剖部位、症状、检查项等。内置零样本NER能力，无需预定义标签即可灵活适配新实体类型。</p>

<h3>2.2 PII脱敏引擎</h3>
<p>支持检测18+种PII实体类型（姓名、电话、邮箱、地址、SSN、日期、ID号等），遵循HIPAA Safe Harbor合规标准。提供mask/remove/replace/hash/shift_dates五种脱敏策略，并支持可逆脱敏（保留映射表可恢复原文）。</p>

<h3>2.3 多后端推理</h3>
<table>
  <tr><th>后端</th><th>适用场景</th></tr>
  <tr><td>HuggingFace Transformers</td><td>通用GPU/CPU</td></tr>
  <tr><td>Apple MLX</td><td>Apple Silicon设备</td></tr>
  <tr><td>CoreML</td><td>iOS原生应用</td></tr>
</table>

<blockquote>OpenMed支持12种语言、247个PII检查点、1,000+医疗专用模型。但它的设计假设用户有Python环境和模型下载能力——这正是我们要解决的问题。</blockquote>

<h2>三、USB-OpenMed的技术架构</h2>
<p>我们的核心思路是：放弃ML模型推理，采用纯规则引擎实现PII检测，从而消除GPU依赖和模型下载需求，使整套系统可以在任意USB设备上即插即用。</p>

<h3>3.1 体系架构</h3>
<p>系统分为四层：</p>
<ul>
  <li><strong>Web UI层</strong>：基于FastAPI的轻量级Web界面，支持文本输入、文件上传、图片OCR、批量处理</li>
  <li><strong>脱敏引擎层</strong>：12种PII正则模式 + 1,200+医疗关键词字典 + 5种脱敏策略</li>
  <li><strong>OCR层</strong>：macOS Vision框架原生OCR（Swift编译），替代Tesseract</li>
  <li><strong>数据存储层</strong>：SHA256哈希命名的安全文件存储</li>
</ul>

<h3>3.2 PII检测体系（12种模式）</h3>
<p>经过多轮迭代，我们建立了完整的PII识别体系：</p>
<ul>
  <li><strong>患者姓名</strong>：支持中文姓名、英文名、姓氏前缀（"娃名""患者""病友"等OCR变体）</li>
  <li><strong>医师信息</strong>：医师签名、科室、职称（"主任""教授""主治"）</li>
  <li><strong>联系方式</strong>：手机号、固话</li>
  <li><strong>证件号码</strong>：身份证号、医保号、登记号、床号、护照号、银行卡号、患者ID、账户号</li>
  <li><strong>地址</strong>：省/市/区/街道/路/号/村/栋/室</li>
  <li><strong>日期</strong>：诊疗日期、出生日期（支持"齡""龄"等OCR变体）</li>
  <li><strong>年龄</strong>：年龄数值</li>
</ul>

<h3>3.3 医疗关键词字典</h3>
<p>我们手工构建了一个涵盖313个关键词的中文医疗词典，按6类组织：</p>
<ul>
  <li><strong>疾病/诊断</strong>：高血压、糖尿病、骨折、肿瘤...</li>
  <li><strong>药物/治疗</strong>：阿司匹林、化疗、静脉注射...</li>
  <li><strong>症状/体征</strong>：发热、咳嗽、水肿、疼痛...</li>
  <li><strong>解剖部位</strong>：膝关节、腰椎、肺部、心脏...</li>
  <li><strong>检查/化验</strong>：CT、MRI、血常规、尿常规...</li>
  <li><strong>其他医疗术语</strong>：过敏史、家族史、既往史...</li>
</ul>

<h2>四、研发过程中的关键挑战</h2>

<h3>4.1 OCR方案选型：从Tesseract到macOS Vision</h3>
<p>最初我们选择Tesseract作为OCR引擎，但在macOS Monterey（x86_64）上遇到了严重问题：Homebrew被列为Tier 3支持，安装Tesseract时卡在gnome.org依赖下载。解决方案是使用Swift编译macOS原生的Vision框架OCR工具。编译命令仅需一行：</p>
<pre><code>swiftc ocr_tool.swift -o ocr_tool</code></pre>
<p>原生OCR在速度和中文识别率上均优于Tesseract，且无任何依赖。</p>

<h3>4.2 假阳性抑制</h3>
<p>纯规则引擎面临的最大问题是假阳性。我们建立了黑名单机制来过滤医疗术语被误判为姓名的情况：</p>
<pre><code>// 不匹配"程度一""白蛋白""第一"等医疗/数值表达
const BLACKLIST = ["程度一", "白蛋白", "第一", "第二", "类型一"];</code></pre>

<h3>4.3 别名归一化</h3>
<p>医疗文档中同一实体有多种表述方式。我们实现了别名映射层，将"糖尿病患者/糖尿病病人"归一为"糖尿病"，"复方丹参滴丸/丹参滴丸"归一为"丹参滴丸"。</p>

<h3>4.4 一致性替代</h3>
<p>同一患者的同一实体在不同文档中应被替换为相同的伪名。我们实现了确定性伪名生成：基于实体原文 + 命名空间 + 种子进行哈希映射，保证同输入同输出。</p>

<h2>五、性能与验证结果</h2>

<h3>5.1 测试数据</h3>
<p>使用数百份真实病历图片进行端到端测试，包括手写处方、打印报告、电子病历截屏等多种格式。</p>

<h3>5.2 处理结果</h3>
<table>
  <tr><th>指标</th><th>数值</th></tr>
  <tr><td>测试样本数</td><td>数百份（全部为图片）</td></tr>
  <tr><td>总处理实体数</td><td>35个PII实体</td></tr>
  <tr><td>处理成功率</td><td>100%</td></tr>
  <tr><td>PII模式数</td><td>12种</td></tr>
  <tr><td>医疗关键词</td><td>313个核心 + 间接覆盖1,200+</td></tr>
  <tr><td>脱敏速度</td><td>~100条/秒（文本模式）</td></tr>
  <tr><td>系统总大小</td><td>约289MB（含便携Python）</td></tr>
</table>

<h3>5.3 安全性验证</h3>
<p>我们额外实现了Safety Sweep机制，在标准PII检测之外进行全文本扫射，捕获可能遗漏的医保号、护照号、银行卡号、患者ID和账户号。</p>

<h2>六、技术沉淀与开源贡献</h2>

<p>项目沉淀了以下可复用的组件：</p>
<ul>
  <li><strong>usb_labels.py</strong>：33个规范化标签体系 + 风险等级 + HIPAA映射 + 别名归一化</li>
  <li><strong>防复制加密系统</strong>：基于硬件序列号的AES-256加密（通过usb_seal.py工具封装U盘）</li>
  <li><strong>3步批量处理流水线</strong>：图片OCR → 批量分析 → 批量脱敏，每步独立展示中间结果</li>
  <li><strong>ocr_tool</strong>：基于macOS Vision框架的Swift OCR工具，无外部依赖</li>
</ul>

<blockquote>USB-OpenMed证明了纯规则引擎在医疗脱敏场景中的可行性。在不需要理解临床语义、只需要检测和替换固定模式的场景下，规则引擎提供了比ML模型更可靠的确定性输出，同时将部署门槛降到了最低。</blockquote>

<h2>七、未来方向</h2>
<ol>
  <li><strong>Windows/Linux支持</strong>：当前OCR方案依赖macOS Vision，跨平台需要替换OCR引擎</li>
  <li><strong>ML辅助增强</strong>：在规则引擎基础上引入轻量NER模型，提升姓名检测召回率</li>
  <li><strong>DICOM/PACS集成</strong>：支持直接从医学影像系统读取和写回脱敏数据</li>
  <li><strong>Web端OCR</strong>：利用浏览器内置的Tesseract.js，实现纯前端OCR</li>
  <li><strong>性能优化</strong>：引入并行处理和多线程，提升批量处理吞吐量</li>
</ol>
<p>相关项目：<a href="/post.html?id=zhixi-24-ai-clinical-skills">执医24项AI临床技能训练评估框架</a> — 基于MediaPipe姿态估计的AI临床技能评估系统，同样基于OpenMed开源框架。</p>

<p><em>项目地址：基于OpenMed v1.5.5（Apache-2.0）定制开发，以USB便携形式交付医院使用。</em></p>
    `.trim()
  },
  {
    id: 'internet-healthcare-future',
    title: '互联网医疗的下一个十年：从流量到服务',
    date: '2026-06-15',
    tags: ['医疗健康', '行业思考'],
    excerpt: '从在线问诊到居家康复，互联网医疗正在经历从流量驱动到服务驱动的转型。分享我对行业趋势的观察。',
    content: `
<p>过去几年，互联网医疗经历了从爆发式增长到理性回归的过程。早期靠流量和补贴快速获客的模式已经难以为继，行业正在回归医疗服务的本质。</p>

<h2>从连接到服务</h2>
<p>早期的互联网医疗平台主要扮演"连接者"角色——连接患者和医生、连接医院和药品。但这种模式的价值链太短，难以形成真正的商业闭环。</p>
<p>真正有壁垒的，是深入到服务环节。以我主导的骨科术后居家康复项目为例：</p>
<ul>
  <li><strong>院内服务延伸</strong>：将医院内康复方案转化为居家可执行的方案</li>
  <li><strong>硬件+软件+服务</strong>：降低设备成本的同时保证康复效果</li>
  <li><strong>数据驱动</strong>：通过患者数据反馈优化康复方案</li>
</ul>

<blockquote>
医疗服务的核心从来不是连接，而是交付——把更好的健康结果带给患者。
</blockquote>

<h2>社区医疗信息化的机会</h2>
<p>我曾经参与开发的社区医疗SaaS系统，服务了700多家基层医疗机构。这些机构的痛点非常明显：管理效率低、患者留存差、缺乏数据支撑。</p>
<p>社区医疗信息化不是简单的"IT系统"，而是帮助基层医疗机构实现三个目标：提高管理效率、增加到店门诊量、实现创收增量。</p>

<h2>我的判断</h2>
<p>未来十年的机会在于：<strong>垂直病种的全程管理服务</strong>。从诊断、治疗到康复，用科技手段打通各个环节，真正解决患者的实际问题。这也是我在做的事情。</p>
    `.trim()
  },
  {
    id: 'startup-lessons-healthcare',
    title: '医疗创业六年：我踩过的五个大坑',
    date: '2026-06-08',
    tags: ['创业', '思考'],
    excerpt: '从天使轮融资到自负盈亏，六年医疗创业经历中最重要的教训和反思。',
    content: `
<p>从2015年联合创业做在线医生APP，到后来自己创业做居家康复，我在医疗健康领域创业了六年。这篇文章分享我踩过的五个坑。</p>

<h2>坑一：低估了医疗行业的壁垒</h2>
<p>医疗不是普通消费互联网。监管、信任、医生资源——每一个都是极高的门槛。我们在线医生APP早期花了很多精力做C端推广，但发现激活患者很容易，留住患者很难。关键在医院和医生端的合作深度。</p>

<h2>坑二：产品过早追求大而全</h2>
<p>在社区医疗SaaS项目上，我们一开始想做一个"什么都有的系统"，结果开发周期太长，产品迟迟不能交付。后来吸取教训，聚焦核心功能——健康档案管理+在线随访——快速上线再迭代。</p>

<h2>坑三：忽视现金流管理</h2>
<p>这是最痛的一课。虽然公司拿到过数千万融资，但烧钱速度远超预期。医疗项目的变现周期长，现金流管理比什么都重要。后来在月照科技时，我坚持"先有收入再扩张"的原则。</p>

<blockquote>
创业不是冲刺，是马拉松。跑得快不如跑得久。
</blockquote>

<h2>坑四：团队扩张太快</h2>
<p>拿到融资后我们迅速扩团队，从30人到100人只用了半年。但管理和文化跟不上，效率反而下降。现在回头看，小团队+核心外包是医疗创业更优的选择。</p>

<h2>坑五：忽略了商务合作的时间成本</h2>
<p>和医院谈合作，平均周期是3-6个月。这个过程不能跳、不能催。早期我们在这方面预估严重不足，导致产品开发完却没有落地场景。建议：商务拓展要提前产品开发至少一个季度启动。</p>
    `.trim()
  },
  {
    id: 'home-rehabilitation-practice',
    title: '骨科术后居家康复的实践与思考',
    date: '2026-05-28',
    tags: ['医疗健康'],
    excerpt: '如何将医院内的康复方案转化为患者可居家执行的训练？分享真实项目经验和效果数据。',
    content: `
<p>骨科术后肌肉萎缩是临床常见问题。传统方案需要患者频繁往返医院做康复，时间和经济成本都很高。我们的目标是：让患者在家就能完成有效的康复训练。</p>

<h2>核心挑战</h2>
<ul>
  <li>如何保证居家康复的安全性和专业性</li>
  <li>如何降低硬件和软件成本，让患者负担得起</li>
  <li>如何确保患者的训练依从性</li>
</ul>

<h2>我们的方案</h2>
<p>我们与广州多家医院的骨科医生合作，共同研究了从院内到院外的康复方案转化路径：</p>
<ul>
  <li><strong>数字化评估</strong>：使用移动端工具进行居家评估替代医院复诊</li>
  <li><strong>视频指导+AI动作识别</strong>：确保训练动作规范</li>
  <li><strong>远程医护监控</strong>：医生/康复师实时查看训练数据并调整方案</li>
</ul>

<blockquote>
最终我们帮助患者将康复周期缩短了2个月，同时节省了近万元费用。
</blockquote>

<h2>关键经验</h2>
<p>居家康复不是简单的"把康复方案拍成视频给患者"——需要系统性的工程：硬件选型、软件设计、服务流程再造、医患沟通机制，缺一不可。每一个环节都决定最终效果。</p>
    `.trim()
  },
  {
    id: 'brand-building-operations',
    title: '新品牌从0到1：南丁护理站的品牌实践',
    date: '2026-05-18',
    tags: ['运营', '创业'],
    excerpt: '从品牌定位到标杆店落地，复盘南丁护理集团品牌建设的全过程。',
    content: `
<p>加入南丁护理集团时，公司的核心命题是：如何在护理服务领域建立品牌认知？这是一个从0到1的过程。</p>

<h2>品牌定位</h2>
<p>护理服务和医疗服务有本质区别：医疗解决"治病"问题，护理解决"生活质量"问题。我们的定位是"专业化、高品质的居家护理服务提供商"。</p>

<h2>从标杆店开始</h2>
<p>我们没有选择大规模铺点，而是在广州做两家标杆店。策略很简单：</p>
<ul>
  <li>选址在高端社区周边，精准触达目标人群</li>
  <li>建立标准化服务流程，确保每单服务品质可控</li>
  <li>通过口碑传播积累第一批种子用户</li>
</ul>

<h2>服务品类建设</h2>
<p>护理服务品类繁多，我们聚焦三个核心方向：</p>
<ul>
  <li>术后护理（与医院合作导流）</li>
  <li>老年居家护理（高频需求）</li>
  <li>慢病管理护理（长期价值）</li>
</ul>

<h2>生态合作</h2>
<p>品牌建设的另一条腿是生态合作。我们与多家机构签订战略合作框架，通过合作伙伴的渠道和服务网络，快速放大品牌影响力。同时开发了"南丁护世"预约小程序，用数字化手段提升用户体验。</p>
    `.trim()
  },
  {
    id: 'b2b-market-strategy',
    title: '华南大区业绩全国第一：B端市场开拓实战复盘',
    date: '2026-05-10',
    tags: ['运营'],
    excerpt: '在家电管家担任华南区总监期间，大区业绩做到全国第一。分享B端市场开拓的具体策略和打法。',
    content: `
<p>2014年我加入家电管家负责华南大区，当时面临的挑战是：与电信运营商合作开展手机回收业务，这是一个全新的B端业务模式。</p>

<h2>核心策略</h2>
<p>B端市场开拓和三方合作运营，关键在于找到共赢点：</p>
<ul>
  <li><strong>选对合作方</strong>：优先与有渠道优势的伙伴合作，电信运营商是最好的选择</li>
  <li><strong>设计合作模式</strong>：让合作方看到清晰的价值分配，而不是单方面利用对方渠道</li>
  <li><strong>标杆先行</strong>：先在一个省跑通模式，再复制到其他区域</li>
</ul>

<h2>执行落地</h2>
<p>我负责洽谈对接广西、湖南、广东、海南四省电信运营商，并推动项目落地执行。关键动作：</p>
<ul>
  <li>从省级电信入手，建立高层合作关系</li>
  <li>联合制定面向消费者的手机回收流程</li>
  <li>配合各地市分公司做落地培训和运营支持</li>
</ul>

<blockquote>
B端市场的核心是"信任+价值"——建立信任需要时间，但一旦建立，壁垒极高。
</blockquote>

<h2>成果</h2>
<p>大区业绩做到全国第一，同时与各大物业平台、苏宁等建立了合作关系。本地电视台还做了新闻采访报道。</p>
    `.trim()
  },
  {
    id: 'team-management-lessons',
    title: '管理10人团队和100人团队，是完全不同的两种能力',
    date: '2026-05-02',
    tags: ['运营', '思考'],
    excerpt: '从带10人的创业小团队到管理跨区域的分公司，我在团队管理上的认知升级。',
    content: `
<p>回顾我的职业生涯，带过最小的团队只有3个人，最多的时候管理几十人。不同规模下的管理方式完全不同。</p>

<h2>10人以下：以身作则</h2>
<p>小团队不需要复杂的制度。核心是方向对、执行力强。作为负责人，你要冲在最前面——谈客户、写方案、盯执行。这时候管理靠的是"我看得见你在做什么，你也看得见我在做什么"。</p>

<h2>10-30人：建制度</h2>
<p>当团队扩张到10人以上，单靠个人影响力就不够了。我开始建立基础管理制度：</p>
<ul>
  <li>周报制度、目标拆解、OKR</li>
  <li>销售漏斗管理（做B端业务必备）</li>
  <li>定期复盘和培训机制</li>
</ul>

<h2>30人以上：找人+放权</h2>
<p>管理100人的团队，你不可能认识每一个人。这个阶段最重要的是找到对的中层管理者，然后放权给他们。你的工作从"管事"变成"管人"——盯住几个关键岗位的人选，确保他们在正确的轨道上。</p>

<blockquote>
好的管理者不是自己把事做完，而是让别人愿意把事做好。
</blockquote>

<h2>跨区域管理的挑战</h2>
<p>在管理惠州和湛江分公司时，最大的挑战是"信息不对称"。我的经验是：建立固定的沟通机制（每周例会），关键节点亲自到场，重要决策必须数据支撑。</p>
    `.trim()
  }
];

// 提取所有标签
const allTags = [...new Set(postsData.flatMap(p => p.tags))];

// 日期格式化
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('zh-CN', opts);
}

// 渲染文章卡片 HTML
function renderPostCard(post) {
  const tagsHTML = post.tags.map(t => `<span class="post-tag">${t}</span>`).join('');
  return `
    <article class="post-card">
      <div class="post-tags">${tagsHTML}</div>
      <div class="post-date">${formatDate(post.date)}</div>
      <h3><a href="/post.html?id=${post.id}">${post.title}</a></h3>
      <p class="post-excerpt">${post.excerpt}</p>
      <a href="/post.html?id=${post.id}" class="post-read-more">阅读全文 →</a>
    </article>
  `;
}