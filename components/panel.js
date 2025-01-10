// 创建面板 UI 组件
export function createSummaryPanel() {
  const panel = document.createElement('div');
  panel.className = 'x-summary-panel collapsed';

  panel.innerHTML = `
    <div class="x-summary-toggle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 19l-7-7 7-7"/>
      </svg>
    </div>
    <div class="x-summary-header">
      <h2 class="x-summary-title">X Summary</h2>
      <div class="x-summary-controls">
        <span class="x-summary-count"></span>
      </div>
    </div>
    <button class="x-summary-button">生成总结</button>
    <div class="x-summary-loading">正在生成总结...</div>
    <div class="x-summary-content-wrapper">
      <div class="x-summary-content"></div>
    </div>
  `;

  document.body.appendChild(panel);
  return panel;
}

// 初始化面板和事件监听
export function initializeSummaryPanel(options = {}) {
  const {
    onToggle,
    onGenerateClick,
    setTweetCount,
    initialExpanded,
    panel
  } = options;

  // 切换面板展开/收起
  console.log('initialExpanded', initialExpanded);
  const toggleButton = panel.querySelector('.x-summary-toggle');
  if (initialExpanded) {
    panel.classList.remove('collapsed');
  }

  toggleButton.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    if (onToggle) {
      onToggle(panel.classList.contains('collapsed'));
    }
  });

  // 生成总结按钮点击事件
  const generateButton = panel.querySelector('.x-summary-button');
  generateButton.addEventListener('click', onGenerateClick);

  // 更新推文数量显示
  const countElement = panel.querySelector('.x-summary-count');
  if (setTweetCount) {
    setTweetCount((count) => {
      countElement.textContent = `${count} 条推文`;
    });
  }

  return {
    setLoading: (loading) => {
      panel.classList.toggle('loading', loading);
      generateButton.disabled = loading;
    },
    setContent: (content) => {
      const contentElement = panel.querySelector('.x-summary-content');
      contentElement.textContent = content;
    },
    appendContent: (content) => {
      const contentElement = panel.querySelector('.x-summary-content');
      contentElement.textContent += content;
    },
    clearContent: () => {
      const contentElement = panel.querySelector('.x-summary-content');
      contentElement.textContent = '';
    },
    setError: (error) => {
      const contentElement = panel.querySelector('.x-summary-content');
      contentElement.innerHTML = `<div class="x-summary-error">${error}</div>`;
    }
  };
}
