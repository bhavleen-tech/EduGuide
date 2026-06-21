import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';

  // Basic formatting helper to translate AI markdown text (* or **) into styled HTML lines
  const formatContent = (text) => {
    return text.split('\n').map((line, index) => {
      let formattedLine = line;
      
      // Check for bullet points
      if (line.trim().startsWith('* ')) {
        return (
          <li key={index} className="ml-4 list-disc my-1">
            {line.replace('* ', '')}
          </li>
        );
      }
      
      // Check for bold text wrappers **bold**
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="my-1">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part)}
          </p>
        );
      }

      return <p key={index} className="my-1 min-h-[1rem]">{formattedLine}</p>;
    });
  };

  return (
    <div className={`flex w-full my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-3xl gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar Icon */}
        <div className={`p-2 rounded-full shrink-0 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Message Content Bubble */}
        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
        }`}>
          {isUser ? message.content : <div>{formatContent(message.content)}</div>}
        </div>
        
      </div>
    </div>
  );
};

export default ChatBubble;