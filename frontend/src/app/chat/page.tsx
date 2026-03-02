'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { PremiumButton } from '@/design-system/components/premium-button';
import { PremiumInput } from '@/design-system/components/premium-input';
import { PremiumCard } from '@/design-system/components/premium-card';
import { ProductCardPremium } from '@/components/products/ProductCardPremium';
import { Reveal, Slide, StaggerContainer, Fade } from '@/design-system/components/motion';
import { Spinner } from '@/design-system/components/loading-states';
import { api } from '@/lib/api';
import { useChatMemoryStore } from '@/state/chatMemoryStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  productIds?: string[];
  products?: any[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages: memoryMessages, addMessage } = useChatMemoryStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProductDetails = async (productIds: string[]) => {
    try {
      const productPromises = productIds.map(id => 
        api.get(`/products/${id}`).catch(() => null)
      );
      const results = await Promise.all(productPromises);
      return results.filter(r => r?.data).map(r => r.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMessage.content,
        history: memoryMessages,
      });

      if (response.success) {
        const { reply, productIds } = response.data;
        
        let products: any[] = [];
        if (productIds && productIds.length > 0) {
          products = await fetchProductDetails(productIds);
        }

        const assistantMessage: Message = {
          role: 'assistant',
          content: reply,
          productIds: productIds || undefined,
          products: products.length > 0 ? products : undefined,
        };

        setMessages(prev => [...prev, assistantMessage]);
        addMessage({ role: 'user', content: userMessage.content });
        addMessage({ role: 'assistant', content: assistantMessage.content });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message');
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto max-w-5xl h-[calc(100vh-8rem)] flex flex-col py-8">
      <Reveal>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Shopping Assistant</h1>
          <p className="text-muted-foreground">
            Ask me anything about products, get recommendations, or let me help you find the perfect item!
          </p>
        </div>
      </Reveal>

      {/* Messages Area */}
      <Reveal delay={0.1}>
        <PremiumCard variant="glass" className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 min-h-[400px]">
          {messages.length === 0 && (
            <Fade className="h-full flex items-center justify-center text-center text-muted-foreground">
              <div>
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm">Try asking: &quot;Suggest a gift for a 20 year old under 1000&quot;</p>
              </div>
            </Fade>
          )}

          <StaggerContainer staggerDelay={0.05}>
            {messages.map((message, index) => (
              <Slide
                key={index}
                direction={message.role === 'user' ? 'right' : 'left'}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[75%]',
                    message.role === 'user' ? 'order-1' : 'order-2'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-md'
                        : 'bg-secondary/50 dark:bg-secondary/30 text-foreground rounded-tl-md'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Here are some products you might like:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {message.products.map((product: any) => (
                          <ProductCardPremium
                            key={product.id}
                            product={{
                              id: product.id,
                              name: product.title,
                              price: product.price,
                              image: product.image || '/placeholder.png',
                              category: product.category,
                              description: product.description || '',
                              stock: product.stock || 1,
                              createdAt: product.createdAt || new Date().toISOString(),
                              updatedAt: product.updatedAt || new Date().toISOString(),
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 order-2">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </Slide>
            ))}
          </StaggerContainer>

          {isLoading && (
            <Fade className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="bg-secondary/50 dark:bg-secondary/30 rounded-2xl rounded-tl-md px-6 py-4">
                <div className="flex items-center gap-3">
                  <Spinner size="sm" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </Fade>
          )}

          <div ref={messagesEndRef} />
        </PremiumCard>
      </Reveal>

      {/* Input Area */}
      <Reveal delay={0.2}>
        <div className="flex gap-3 mt-4">
          <div className="flex-1">
            <PremiumInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about products..."
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <PremiumButton
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            variant="premium"
            size="lg"
            className="px-6"
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </PremiumButton>
        </div>
      </Reveal>
    </div>
  );
}
