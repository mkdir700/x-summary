// 创建并插入总结面板的样式
const style = document.createElement('style');
style.textContent = `
  .x-summary-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background-color: rgb(0, 0, 0);
    color: rgb(231, 233, 234);
    border-left: 1px solid rgb(47, 51, 54);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .x-summary-panel.collapsed {
    transform: translateX(calc(100% - 24px));
    background: transparent;
    border-left: none;
    box-shadow: none;
  }

  .x-summary-header {
    padding: 16px;
    border-bottom: 1px solid rgb(47, 51, 54);
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .x-summary-panel.collapsed .x-summary-header,
  .x-summary-panel.collapsed .x-summary-button,
  .x-summary-panel.collapsed .x-summary-content-wrapper {
    opacity: 0;
    pointer-events: none;
  }

  .x-summary-title {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: rgb(231, 233, 234);
  }

  .x-summary-controls {
    display: flex;
    gap: 8px;
  }

  .x-summary-count {
    color: #536471;
    font-size: 13px;
    margin-right: 12px;
  }

  .x-summary-settings {
    color: rgb(29, 155, 240);
    text-decoration: none;
    cursor: pointer;
    font-size: 14px;
  }

  .x-summary-settings:hover {
    text-decoration: underline;
  }

  .x-summary-toggle {
    width: 32px;
    height: 32px;
    background: rgb(22, 24, 28);
    border: 1px solid rgb(47, 51, 54);
    border-radius: 50%;
    position: absolute;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 1001;
  }

  .x-summary-toggle:hover {
    background: rgb(39, 44, 48);
    border-color: rgb(62, 65, 68);
    transform: translateY(-50%) scale(1.1);
  }

  .x-summary-panel.collapsed .x-summary-toggle:hover {
    transform: translateY(-50%) scale(1.1);
  }

  .x-summary-toggle svg {
    width: 16px;
    height: 16px;
    stroke: rgb(231, 233, 234);
    transition: transform 0.3s ease;
  }

  .x-summary-panel.collapsed .x-summary-toggle svg {
    transform: rotate(180deg);
  }

  .x-summary-button {
    margin: 16px;
    padding: 12px 24px;
    background-color: rgb(29, 155, 240);
    color: white;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }

  .x-summary-button:hover {
    background-color: rgb(26, 140, 216);
  }

  .x-summary-button:disabled {
    background-color: rgb(47, 51, 54);
    cursor: not-allowed;
  }

  .x-summary-loading {
    display: none;
    padding: 16px;
    text-align: center;
    color: rgb(139, 152, 165);
  }

  .x-summary-panel.loading .x-summary-loading {
    display: block;
  }

  .x-summary-content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .x-summary-content {
    color: rgb(231, 233, 234);
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .x-summary-error {
    color: rgb(244, 33, 46);
    padding: 16px;
    text-align: center;
  }

  /* 滚动条样式 */
  .x-summary-content-wrapper::-webkit-scrollbar {
    width: 8px;
  }

  .x-summary-content-wrapper::-webkit-scrollbar-track {
    background: rgb(22, 24, 28);
  }

  .x-summary-content-wrapper::-webkit-scrollbar-thumb {
    background: rgb(47, 51, 54);
    border-radius: 4px;
  }

  .x-summary-content-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgb(62, 65, 68);
  }
`;

// 检查是否已滚动
function checkIfScrolled() {
  return window.scrollY > 0;
}

// 自动加载更多推文
async function loadMoreTweets(times) {
  console.log('开始自动加载更多推文');
  console.log(`计划加载 ${times} 次推文`);

  const timeline = document.querySelector('[data-testid="primaryColumn"]');
  if (!timeline) {
    console.error('未找到推文时间线元素');
    return;
  }

  let loadCount = 0;
  let lastTweetCount = 0;
  const maxAttempts = 3;

  while (loadCount < times) {
    console.log(`正在进行第 ${loadCount + 1} 次加载`);

    // 获取当前推文数量
    const currentTweets = document.querySelectorAll('article[data-testid="tweet"]');
    console.log('当前推文数量:', currentTweets.length);

    if (currentTweets.length === lastTweetCount) {
      console.log('推文数量未增加，可能已到底或加载失败');
      break;
    }

    lastTweetCount = currentTweets.length;

    const lastTweet = currentTweets[currentTweets.length - 1];
    if (!lastTweet) {
      console.error('未找到最后一条推文');
      break;
    }

    lastTweet.scrollIntoView({ behavior: 'auto', block: 'end' });

    let attempts = 0;
    let newTweetsLoaded = false;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCount = document.querySelectorAll('article[data-testid="tweet"]').length;

      if (newCount > lastTweetCount) {
        console.log(`加载成功，新推文数量: ${newCount}`);
        newTweetsLoaded = true;
        break;
      }

      attempts++;
      console.log(`等待新推文加载，尝试次数: ${attempts}`);
    }

    if (!newTweetsLoaded) {
      console.log('无法加载更多推文，停止加载');
      break;
    }

    loadCount++;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`自动加载完成，共加载 ${loadCount} 次`);
  return loadCount;
}

// 创建总结面板
function createSummaryPanel() {
  console.log('创建总结面板');
  const panel = document.createElement('div');
  panel.className = 'x-summary-panel';
  panel.innerHTML = `
    <div class="x-summary-header">
      <h2 class="x-summary-title">X 总结</h2>
      <div class="x-summary-controls">
        <span class="x-summary-count"></span>
        <a class="x-summary-settings">设置</a>
      </div>
    </div>
    <button class="x-summary-toggle" title="折叠/展开面板">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="x-summary-button">生成总结</button>
    <div class="x-summary-loading">正在生成摘要...</div>
    <div class="x-summary-content-wrapper">
      <div class="x-summary-content"></div>
    </div>
  `;

  document.body.appendChild(panel);

  // 添加折叠/展开功能
  const toggleButton = panel.querySelector('.x-summary-toggle');
  toggleButton.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    chrome.storage.local.set({
      'summaryPanelCollapsed': panel.classList.contains('collapsed')
    });
  });

  // 从 storage 恢复折叠状态
  chrome.storage.local.get(['summaryPanelCollapsed'], (result) => {
    if (result.summaryPanelCollapsed) {
      panel.classList.add('collapsed');
    }
  });

  return panel;
}

// 提取帖子内容
function extractTweets() {
  const tweets = [];

  try {
    // 选择所有帖子容器
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    console.log('找到帖子数量:', articles.length);

    articles.forEach(article => {
      const tweetText = article.querySelector('[data-testid="tweetText"]')?.innerText || '';
      const userName = article.querySelector('[data-testid="User-Name"]')?.innerText || '';
      const timeElement = article.querySelector('time');
      const timeStamp = timeElement ? timeElement.getAttribute('datetime') : '';

      if (tweetText) {
        console.log('提取到的帖子内容:', tweetText);
        tweets.push({
          text: tweetText,
          user: userName,
          time: timeStamp
        });
      }
    });
  } catch (error) {
    console.error('提取帖子内容时出错:', error);
  }

  return tweets;
}

// 生成总结
async function generateSummary(text, apiKey, baseUrl = '', model = 'gpt-4o', customPrompt) {
  const DEFAULT_PROMPT = '你是一个专业的内容总结助手。请简洁地总结以下 X（原 Twitter）搜索结果的主要内容、关键观点和讨论趋势。';

  // 使用提供的 base URL 或默认值
  const apiEndpoint = `${baseUrl || 'https://api.openai.com'}/v1/chat/completions`;

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: customPrompt || DEFAULT_PROMPT
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API 调用失败: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 初始化面板和事件监听
let panel = null;
let isGeneratingSummary = false;

async function initializeSummaryPanel() {
  console.log('初始化总结面板');
  if (panel) {
    console.log('面板已存在，跳过初始化');
    return;
  }

  // 添加样式
  if (!document.head.querySelector('style[data-x-summary]')) {
    style.setAttribute('data-x-summary', 'true');
    document.head.appendChild(style);
  }

  panel = createSummaryPanel();
  const summaryButton = panel.querySelector('.x-summary-button');
  const loadingIndicator = panel.querySelector('.x-summary-loading');

  summaryButton.addEventListener('click', async () => {
    if (isGeneratingSummary) return;
    isGeneratingSummary = true;
    loadingIndicator.style.display = 'block';
    summaryButton.disabled = true;

    try {
      if (!checkIfScrolled()) {
        console.log('尝试自动加载更多推文');
        // 如果没有指定次数，从设置中获取
        const settings = await chrome.storage.local.get(['loadTimes']);
        const times = settings.loadTimes || 10;
        await loadMoreTweets(times);
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        console.log('用户已滚动页面，直接使用当前页面内容');
      }

      const tweets = extractTweets();
      if (!tweets || tweets.length === 0) {
        throw new Error('未找到帖子内容');
      }

      // 更新帖子数量显示
      panel.querySelector('.x-summary-count').textContent = `已提取 ${tweets.length} 篇帖子`;

      // 准备发送给 GPT 的文本
      const tweetsText = tweets
        .map(t => `${t.user}: ${t.text}`)
        .join('\n\n');

      // 检查设置
      const settings = await chrome.storage.local.get([
        'openaiApiKey',
        'openaiBaseUrl',
        'openaiModel',
        'customPrompt'
      ]);

      if (!settings.openaiApiKey) {
        loadingIndicator.style.display = 'none';
        summaryButton.disabled = false;
        panel.querySelector('.x-summary-content').innerHTML = '<div class="x-summary-error">请先在设置页面配置 OpenAI API Key</div>';
        chrome.runtime.sendMessage({ action: 'openSettings' });
        return;
      }

      // 调用 GPT API
      const summary = await generateSummary(
        tweetsText,
        settings.openaiApiKey,
        settings.openaiBaseUrl,
        settings.openaiModel,
        settings.customPrompt
      );

      // 显示结果
      loadingIndicator.style.display = 'none'; // 加载提示隐藏
      summaryButton.disabled = false;
      panel.querySelector('.x-summary-content').textContent = summary;
    } catch (error) {
      loadingIndicator.style.display = 'none'; // 加载提示隐藏
      summaryButton.disabled = false;
      panel.querySelector('.x-summary-content').innerHTML = `<div class="x-summary-error">错误: ${error.message}</div>`;
    } finally {
      isGeneratingSummary = false;
    }
  });
}

// 监听页面变化
let isInitialized = false;

function checkAndInitialize() {
  if (!isInitialized && document.querySelector('article[data-testid="tweet"]')) {
    console.log('找到推文，开始初始化');
    isInitialized = true;
    initializeSummaryPanel();
  }
}

// 初始检查
checkAndInitialize();

// 设置观察器
const observer = new MutationObserver((mutations) => {
  checkAndInitialize();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 监听来自 popup 或 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request);

  if (request.action === 'summarize') {
    try {
      const tweets = extractTweets();
      sendResponse({ tweets });
    } catch (error) {
      sendResponse({ error: error.message });
    }
    return true;
  }
});

// 发送初始化消息到后台脚本
chrome.runtime.sendMessage({ action: 'contentScriptReady' });

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request);

  if (request.action === 'summarize') {
    try {
      const tweets = extractTweets();
      console.log('提取到的帖子:', tweets.length);
      sendResponse({ tweets });
    } catch (error) {
      console.error('提取帖子时出错:', error);
      sendResponse({ error: error.message });
    }
  }
  // 必须返回 true 以支持异步响应
  return true;
});
