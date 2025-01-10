// 监听设置链接点击事件
document.addEventListener('DOMContentLoaded', () => {
  // 处理设置链接点击
  document.getElementById('settingsLink').addEventListener('click', () => {
    // 打开设置页面
    chrome.runtime.openOptionsPage();
    // 关闭弹出窗口
    window.close();
  });

  // 检查当前标签页是否是 X 页面
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const isXPage = currentTab.url.includes('twitter.com') || currentTab.url.includes('x.com');

    if (!isXPage) {
      document.body.innerHTML = '<div class="container"><div class="error">请在 X 页面使用此扩展</div></div>';
    }
  });
});