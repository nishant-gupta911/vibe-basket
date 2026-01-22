'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/products/ProductCard';
import { api } from '@/lib/api';
import { toast } from 'sonner';

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
        history: messages.slice(-6).map(m => ({
          role: m.role,
          content: m.content,
        })),
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Shopping Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about products, get recommendations, or let me help you find the perfect item!
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-secondary/20 rounded-lg">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Try asking: &quot;Suggest a gift for a 20 year old under 1000&quot;</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            )}

            <div
              className={`max-w-[75%] ${
                message.role === 'user' ? 'order-1' : 'order-2'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border'
                }`}
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
                      <ProductCard
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
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 order-2">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-background border rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about products..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
