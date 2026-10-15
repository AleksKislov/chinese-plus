// SiliconFlow chat completions (https://docs.siliconflow.com/en/api-reference/chat-completions/chat-completions)
// env: SILICONFLOW_API_KEY (required),
//      SILICONFLOW_API_URL    default https://api.siliconflow.com/v1,
//      SILICONFLOW_CHAT_MODEL default deepseek-ai/DeepSeek-V4.1-Flash (check ids: GET /v1/models)
// Errors carry the upstream response: log them, never send them to the client.
async function chatCompletion({ messages, maxTokens, json = false }) {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) throw new Error('SILICONFLOW_API_KEY is not set');

  const baseUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.com/v1';
  const model = process.env.SILICONFLOW_CHAT_MODEL || 'deepseek-ai/DeepSeek-V4.1-Flash';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false,
      ...(json && { response_format: { type: 'json_object' } }),
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(
      `SiliconFlow chat ${response.status}: ${(await response.text()).slice(0, 500)}`,
    );
  }
  const data = await response.json();
  return { content: data.choices?.[0]?.message?.content || '', usage: data.usage };
}

module.exports = { chatCompletion };
