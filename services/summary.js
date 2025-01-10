// 生成总结
export async function generateSummary(text, apiKey, baseUrl = '', model = 'gpt-4', customPrompt) {
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
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('API 请求失败');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('生成总结时出错:', error);
    throw error;
  }
}
