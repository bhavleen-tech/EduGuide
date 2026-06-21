import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white border-t border-gray-200">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        placeholder="Ask about engineering, design, commerce streams, eligibility..."
        className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;