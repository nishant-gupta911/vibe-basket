# Context-Only AI Assistant

A **rule-based, context-driven assistant** that behaves like an AI without using any external AI APIs, models, or network calls.

## 🎯 Key Features

- ✅ **NO External APIs** - Zero network calls, completely offline
- ✅ **Pure Frontend** - HTML, CSS, vanilla JavaScript only
- ✅ **Context-Driven** - All intelligence from predefined knowledge base
- ✅ **Smart Matching** - Keyword matching + semantic scoring
- ✅ **Clean UI** - Modern, responsive chat interface
- ✅ **Easy to Extend** - Simple structure for adding more context

## 📁 Project Structure

```
context-ai-assistant/
├── index.html      # Chat interface
├── style.css       # UI styling
├── script.js       # AI logic (matching & scoring)
└── context.js      # Knowledge base (source of truth)
```

## 🚀 How to Use

1. **Open `index.html`** in any modern browser
2. **Type your question** in the input field
3. **Get instant responses** from the knowledge base

No installation, no dependencies, no build process required!

## 🧠 How It Works

### Knowledge Base (`context.js`)
- Stores predefined questions/topics and their answers
- Each entry has keywords and content
- This is the **only source of truth**

### AI Logic (`script.js`)
The assistant uses a multi-strategy scoring system:

1. **Exact Keyword Match** (weight: 1.0)
   - Checks if any full keyword appears in user input
   
2. **Partial Keyword Match** (weight: 0.5)
   - Checks for partial word matches
   
3. **Word Overlap Ratio** (weight: 0.3)
   - Calculates similarity based on common words

If the best score is above the threshold (0.3), it returns that response.
Otherwise, it says: "I don't have information about that."

### No Hallucinations
The assistant **never invents information**. It only responds with content from the knowledge base.

## 🔧 Extending the Knowledge Base

To add more topics, edit `context.js`:

```javascript
{
  id: 13,
  title: "Your Topic",
  keywords: ["keyword1", "keyword2", "phrase"],
  content: "Your response here."
}
```

## 🎨 Customization

- **Colors**: Edit the gradient in `style.css`
- **Scoring**: Adjust weights in `calculateScore()` function
- **Threshold**: Change `CONFIDENCE_THRESHOLD` in `script.js`

## 📱 Mobile Friendly

The interface is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## ⚡ Performance

- No network latency (offline-first)
- Instant responses
- Lightweight (~10KB total)
- No external dependencies

## 🛡️ Safety Features

- Empty input validation
- Minimum input length check
- No console errors
- Graceful fallback for unknown queries

## 💡 Use Cases

- Customer support chatbots
- FAQ assistants
- Product information helpers
- Educational Q&A tools
- Internal knowledge bases

## 🚫 Limitations

- Responses limited to predefined context
- No learning or adaptation
- No conversation memory (stateless)
- Basic natural language understanding

## 📝 License

Free to use and modify for any purpose.

---

**This is a context-only AI assistant. It does not use LLMs, APIs, or external AI services.**
