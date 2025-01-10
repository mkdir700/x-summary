// 检查是否已滚动
export function checkIfScrolled() {
  return window.scrollY > 0;
}

// 自动加载更多推文
export async function loadMoreTweets(times = 5, onProgress) {
  console.log("开始自动加载更多推文");
  console.log(`计划加载 ${times} 次推文`);

  const timeline = document.querySelector('[data-testid="primaryColumn"]');
  if (!timeline) {
    console.error("未找到推文时间线元素");
    return;
  }

  let loadCount = 0;
  let lastTweetCount = 0;

  while (loadCount < times) {
    const currentTweets = timeline.querySelectorAll(
      '[data-testid="tweet"]'
    ).length;

    if (currentTweets === lastTweetCount) {
      console.log("没有新推文加载，停止加载");
      break;
    }

    lastTweetCount = currentTweets;
    loadCount++;

    if (onProgress) {
      onProgress(loadCount, times);
    }

    await new Promise((resolve) => {
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(resolve, 2000);
    });
  }

  window.scrollTo(0, 0);
  console.log("加载完成");
}

// 提取推文内容
export function extractTweets() {
  const tweets = document.querySelectorAll('[data-testid="tweet"]');
  const tweetContents = [];

  tweets.forEach(tweet => {
    const tweetText = tweet.querySelector('[data-testid="tweetText"]');
    if (tweetText) {
      const text = tweetText.textContent.trim();
      if (text) {
        tweetContents.push(text);
      }
    }
  });

  return {
    tweets: tweetContents,
    count: tweetContents.length
  };
}
