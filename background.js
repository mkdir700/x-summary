// 存储内容脚本状态
let contentScriptStatus = new Map();

// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('X Search Summary 扩展已安装');
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('x.com')) {
    console.log('X 页面加载完成，注入内容脚本');
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    }).then(() => {
      console.log('内容脚本注入成功');
    }).catch(error => {
      console.error('内容脚本注入失败:', error);
    });
  }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contentScriptReady') {
    const tabId = sender.tab.id;
    contentScriptStatus.set(tabId, true);
    console.log(`内容脚本在标签页 ${tabId} 中准备就绪`);
    sendResponse({ status: 'acknowledged' });
  } else if (request.action === 'summarize') {
    // 在这里添加摘要处理逻辑
    sendResponse({success: true});
  } else if (request.action === 'openSettings') {
    // 打开设置页面
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  }
  return true;
});

// 监听标签页关闭
chrome.tabs.onRemoved.addListener((tabId) => {
  contentScriptStatus.delete(tabId);
});
