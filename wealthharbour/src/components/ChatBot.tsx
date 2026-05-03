import React, { useState, useRef, useEffect } from 'react';
import { BsChatDots } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const dummyResponses = [
  "Breaking News: Tensions between Iran and the USA are escalating, impacting global oil prices and energy markets.",
  "Market Update: The latest Federal Reserve meeting concluded with a decision to keep interest rates steady, hinting at potential cuts later this year.",
  "Global Markets: European markets closed higher amidst positive earnings reports from major tech companies.",
  "Commodities: Gold prices hit a record high due to geopolitical uncertainties.",
  "Economy: U.S. job growth exceeds expectations, pointing to a resilient labor market.",
  "Tech News: Major tech firms are heavily investing in AI infrastructure, driving up semiconductor demands.",
  "Crypto: Bitcoin experiences moderate volatility following new regulatory announcements."
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Welcome! I'm WealthHarbor Intelligence. Ask me for the latest news on global events, Fed meetings, or market trends!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-10 sm:right-8 z-[110] animate-fade-in flex items-center group">
          <div className="mr-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-indigo-100 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-all duration-300 transform translate-x-4 sm:translate-x-0 group-hover:translate-x-0">
            <p className="text-indigo-600 font-medium text-sm whitespace-nowrap">Feel free to ask me!</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-2xl transition-luxury hover-lift flex items-center justify-center focus:outline-none ring-4 ring-indigo-500/20"
            aria-label="Open chat"
          >
            <BsChatDots size={24} />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:bottom-10 sm:right-8 z-[110] bg-white/95 backdrop-blur-xl rounded-3xl sm:rounded-2xl shadow-2xl flex flex-col w-auto sm:w-96 h-[60vh] max-h-[calc(100vh-140px)] border border-white/50 overflow-hidden animate-slide-up ring-1 ring-indigo-500/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center w-full shadow-md z-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BsChatDots size={18} />
              </div>
              <h3 className="font-semibold text-lg">WealthHarbor</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-indigo-200 transition-colors focus:outline-none"
              aria-label="Close chat"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-100 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:shadow-none z-10">
            <form onSubmit={handleSend} className="flex relative items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-gray-100 text-gray-800 rounded-full py-3 sm:py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm sm:text-base input-field"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 sm:p-2 rounded-full flex items-center justify-center transition-colors ${
                  input.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
