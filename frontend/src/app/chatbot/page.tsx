'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Sparkles, ShoppingBag } from 'lucide-react';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumInput } from '@/design-system/components/premium-input';
import { PremiumCard } from '@/design-system/components/premium-card';
import { Fade, Slide, Scale, StaggerContainer, Reveal, HoverLift } from '@/design-system/components/motion';
import { Spinner, ErrorState } from '@/design-system/components/loading-states';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  productIds?: string[];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your shopping assistant. How can I help you find the perfect product today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "What's a good gift for under $50?",
    "Show me the latest electronics",
    "I need something for a birthday party",
    "What are your bestsellers?",
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await api.post<{ reply: string; productIds?: string[] }>('/ai/chat', {
        message: userMessage,
        history,
      });

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.data.reply,
          productIds: response.data.productIds,
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <Reveal>
          <PremiumCard variant="glass" className="p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shopping Assistant</h1>
                <p className="text-muted-foreground mt-1">
                  Ask me anything about products, recommendations, or help finding what you need!
                </p>
              </div>
            </div>
          </PremiumCard>
        </Reveal>

        {/* Chat Container */}
        <Reveal delay={0.1}>
          <PremiumCard variant="elevated" className="h-[calc(100vh-280px)] flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 1 && (
                <Fade className="mb-6">
                  <div className="text-center py-8">
                    <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-6">Try asking something like:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQuestions.map((question, i) => (
                        <Scale key={i} delay={i * 0.05}>
                          <button
                            onClick={() => setInput(question)}
                            className="px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm text-foreground transition-all duration-300 hover:scale-105"
                          >
                            {question}
                          </button>
                        </Scale>
                      ))}
                    </div>
                  </div>
                </Fade>
              )}

              <StaggerContainer staggerDelay={0.05}>
                {messages.map((message, index) => (
                  <Slide
                    key={index}
                    direction={message.role === 'user' ? 'right' : 'left'}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className="flex items-start gap-3 max-w-[85%]">
                      {message.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}

                      <div
                        className={cn(
                          'rounded-2xl px-4 py-3 transition-all duration-300',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-md'
                            : 'bg-secondary/50 dark:bg-secondary/30 text-foreground rounded-tl-md'
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                        {/* Product Links */}
                        {message.productIds && message.productIds.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-current/20">
                            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4" />
                              Recommended Products:
                            </p>
                            <div className="space-y-2">
                              {message.productIds.map((productId) => (
                                <HoverLift key={productId}>
                                  <button
                                    onClick={() => handleViewProduct(productId)}
                                    className={cn(
                                      'block w-full text-left text-sm px-4 py-3 rounded-xl transition-all duration-300',
                                      message.role === 'user'
                                        ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-background hover:bg-background/80 text-foreground border border-border'
                                    )}
                                  >
                                    <span className="flex items-center justify-between">
                                      View Product
                                      <span className="text-lg">→</span>
                                    </span>
                                  </button>
                                </HoverLift>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-foreground" />
                        </div>
                      )}
                    </div>
                  </Slide>
                ))}
              </StaggerContainer>

              {loading && (
                <Fade className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-2xl rounded-tl-md px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Spinner size="sm" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </Fade>
              )}

              {error && (
                <Fade>
                  <ErrorState
                    title="Connection Error"
                    message={error}
                    onRetry={() => setError(null)}
                    className="my-4"
                  />
                </Fade>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <PremiumInput
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={loading}
                    className="w-full"
                  />
                </div>
                <PremiumButton
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  variant="premium"
                  size="lg"
                  className="px-6"
                >
                  <Send className="w-5 h-5" />
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </Reveal>
      </div>
    </div>
  );
}
