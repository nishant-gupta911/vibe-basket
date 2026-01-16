const OpenAI = require('openai').default;
const fs = require('fs');

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envContent.match(/OPENAI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');

const openai = new OpenAI({
  apiKey: apiKey,
});

async function test() {
  try {
    console.log('\n🧪 Testing OpenAI API...\n');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say "Hello, AI is working!"' }
      ],
      max_tokens: 20,
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.status) console.log('Status:', error.status);
    if (error.code) console.log('Code:', error.code);
  }
}

test();
