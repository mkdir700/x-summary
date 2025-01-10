let isInitialized = false;
let panel = null;
let isGeneratingSummary = false;

Promise.all([
  import(chrome.runtime.getURL("components/panel.js")),
  import(chrome.runtime.getURL("services/tweet.js")),
  import(chrome.runtime.getURL("services/summary.js")),
  import(chrome.runtime.getURL("utils/storage.js")),
]).then(
  ([
    { createSummaryPanel, initializeSummaryPanel },
    { loadMoreTweets, extractTweets, checkIfScrolled },
    { generateSummary },
    { getApiKey, getCustomSettings, setExpanded, getExpanded },
  ]) => {
    // 添加面板样式
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/panel.css");
    document.head.appendChild(link);

    // 检查并初始化面板
    async function checkAndInitialize() {
      // 检查面板是否已存在
      const existingPanel = document.querySelector(".x-summary-panel");
      if (existingPanel) {
        return;
      }

      panel = createSummaryPanel();

      const panelControls = initializeSummaryPanel({
        panel,
        initialExpanded: await getExpanded(),
        onToggle: (collapsed) => {
          setExpanded(!collapsed);
        },
        onGenerateClick: async () => {
          if (isGeneratingSummary) return;

          // 获取设置
          const apiKey = await getApiKey();
          const { baseUrl, model, customPrompt, loadTimes } =
            await getCustomSettings();

          if (!apiKey) {
            panelControls.setError("OpenAI API Key 未设置");
            return;
          }

          try {
            isGeneratingSummary = true;
            panelControls.clearContent();

            if (!checkIfScrolled()) {
              // 加载更多推文
              panelControls.setLoading(true, "正在加载更多推文...");
              await loadMoreTweets(loadTimes, (current, total) => {
                panelControls.setLoading(true, `正在加载更多推文... (${current}/${total})`);
              });
              // 滚动到顶部
              window.scrollTo({ top: 0, behavior: "auto" });
            }

            // 提取推文内容
            const { tweets, count } = extractTweets();
            if (count === 0) {
              throw new Error("未找到推文内容");
            }

            console.log("推文总数:", count);

            // 更新帖子数量显示
            panel.querySelector(
              ".x-summary-count"
            ).textContent = `一共 ${count} 条推文`;

            // 生成总结（使用流式输出）
            panelControls.setLoading(true, "正在生成总结...");
            const summaryGenerator = generateSummary(
              tweets.join("\n\n"),
              apiKey,
              baseUrl,
              model,
              customPrompt
            );

            for await (const chunk of summaryGenerator) {
              panelControls.appendContent(chunk);
            }
          } catch (error) {
            console.error("生成总结时出错:", error);
            panelControls.setError(error.message);
          } finally {
            isGeneratingSummary = false;
            panelControls.setLoading(false);
          }
        },
      });
    }

    // 设置观察器监听页面变化
    const observer = new MutationObserver(() => {
      // 检查并初始化面板
      checkAndInitialize();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
);
