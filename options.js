document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const baseUrlInput = document.getElementById('baseUrl');
  const modelInput = document.getElementById('model');
  const promptInput = document.getElementById('prompt');
  const resetPromptButton = document.getElementById('resetPrompt');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');
  const loadTimesInput = document.getElementById('loadTimes');

  const DEFAULT_PROMPT = '你是一个专业的内容总结助手。请简洁地总结以下 X（原 Twitter）搜索结果的主要内容、关键观点和讨论趋势。';

  // 加载保存的设置
  chrome.storage.local.get(
    ['openaiApiKey', 'openaiBaseUrl', 'openaiModel', 'customPrompt', 'loadTimes'], 
    function(result) {
      if (result.openaiApiKey) {
        apiKeyInput.value = result.openaiApiKey;
      }
      if (result.openaiBaseUrl) {
        baseUrlInput.value = result.openaiBaseUrl;
      }
      if (result.openaiModel) {
        modelInput.value = result.openaiModel;
      } else {
        modelInput.value = 'gpt-4o';
      }
      if (result.customPrompt !== undefined) {
        promptInput.value = result.customPrompt;
      } else {
        promptInput.value = DEFAULT_PROMPT;
      }
      if (result.loadTimes !== undefined) {
        loadTimesInput.value = result.loadTimes;
      } else {
        loadTimesInput.value = 10;
      }
    }
  );

  // 重置提示词为默认值
  resetPromptButton.addEventListener('click', function() {
    promptInput.value = DEFAULT_PROMPT;
  });

  // 保存设置
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    const baseUrl = baseUrlInput.value.trim();
    const model = modelInput.value.trim();
    const prompt = promptInput.value.trim();
    const loadTimes = parseInt(loadTimesInput.value) || 10;

    if (!apiKey) {
      showStatus('请输入 OpenAI API Key', 'error');
      return;
    }

    if (!model) {
      showStatus('请输入或选择 GPT 模型', 'error');
      return;
    }

    chrome.storage.local.set({
      openaiApiKey: apiKey,
      openaiBaseUrl: baseUrl,
      openaiModel: model,
      customPrompt: prompt || DEFAULT_PROMPT,
      loadTimes: loadTimes
    }, function() {
      showStatus('设置已保存', 'success');
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    setTimeout(() => {
      statusDiv.className = 'status-message';
    }, 3000);
  }
});
