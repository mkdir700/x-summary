// 生成总结
export async function* generateSummary(text, apiKey, baseUrl = '', model = 'gpt-4', customPrompt) {
  if (!text || !apiKey) {
    throw new Error('缺少必要参数');
  }

  let prompt = customPrompt || `
    请总结以下推文内容的主要观点。要求：
    1. 用简洁的语言
    2. 突出重要信息
    3. 保持客观中立
    4. 分点列出要点
  `;

  prompt += `
    推文内容：\n\n ${text}
  `;

  const apiEndpoint = baseUrl ? `${baseUrl}/v1/chat/completions` : 'https://api.openai.com/v1/chat/completions';

  try {
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
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error('API 请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.trim() === 'data: [DONE]') return;

        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (error) {
            console.error('解析响应数据时出错:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('生成总结时出错:', error);
    throw error;
  }
}
