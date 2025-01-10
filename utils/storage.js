// Chrome 存储相关的工具函数
export async function getStorageData(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
}

export async function setStorageData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, () => {
      resolve();
    });
  });
}

// 展开
export async function setExpanded(expanded) {
  await setStorageData({ expanded: expanded });
}

// 获取展开状态
export async function getExpanded() {
  const data = await getStorageData(['expanded']);
  return data.expanded;
}

export async function getApiKey() {
  const data = await getStorageData(['openaiApiKey']);
  return data.openaiApiKey;
}

export async function getCustomSettings() {
  const data = await getStorageData([
    'openaiBaseUrl',
    'openaiModel',
    'customPrompt',
    'loadTimes'
  ]);

  return {
    baseUrl: data.openaiBaseUrl || '',
    model: data.openaiModel || 'gpt-4',
    customPrompt: data.customPrompt || '',
    loadTimes: data.loadTimes || 10
  };
}
