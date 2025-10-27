import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk_a04ca9d8d9ff4daaa4f4dadff0e1468b95413d9be3bd47d58aed9bc293602081',
  baseURL: 'https://api.asi1.ai/v1',
});

const form = {
  category: 'car-rental',
  amount: 10000,
  currency: 'USD',
  start_date: '2025-01-01',
  end_date: '2025-01-10',
  
  description: 'Driver is 25 years old from Mexico, will rent a Chevrolet Silverado 2024 for 10 days from Mexico City to Cancun.',
}

const response = await client.chat.completions.create({
  model: 'asi1-mini',
  messages: [
    { role: 'system', content: 'You are an AI specialized in analyzing and determining a SCORE between 0 and 100, and REASONING for a insurance request form. You must carefully think and determine the level of risk of the requested insurance and provide a reasoning for the score. You must score 100 for absolutely no risk and 0 for absolutely high risk.' },
    { role: 'user', content: JSON.stringify(form) },
  ],
  temperature: 0.1,
  top_p: 0.9,
  max_tokens: 1000,
  presence_penalty: 0,
  frequency_penalty: 0,
  stream: false,
  web_search: false,
  response_format: { type: 'json_object' },
});

console.log(response.choices[0].message.content);