import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatBubble from './components/ChatBubble'; // Your ChatBubble.jsx still works here
import ChatInput from './components/ChatInput';   // Your ChatInput.jsx still works here
import LoadingDots from './components/LoadingDots'; // Your LoadingDots.jsx still works here
import { GraduationCap, Globe, Atom, BookOpenText } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hello! I'm your Live Career Assistant. Ask me anything about fields, universities, courses, or eligibility tracks available after completing Class 12!" }
  ]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userQuery) => {
    const updatedMessages = [...messages, { role: 'user', content: userQuery }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        userQuery,
        chatId
      });

      if (response.data) {
        setChatId(response.data.chatId);
        setMessages((prev) => [...prev, { role: 'model', content: response.data.reply }]);
      }
    } catch (error) {
      console.error("API Call failed:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: "Sorry, I had trouble reaching my data engine. Please make sure the backend server is running and try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // MAIN WRAPPER: Colorful, Academic Gradient Background
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-orange-100 font-sans antialiased text-gray-900 relative">

      {/* Floating Floating Icon Decorations (Background Layer) */}
      <div className="absolute top-20 right-16 opacity-30 text-blue-600 animate-pulse"><Globe size={64}/></div>
      <div className="absolute bottom-32 left-16 opacity-30 text-teal-600 rotate-12"><Atom size={48}/></div>
      <div className="absolute top-40 left-12 opacity-30 text-orange-600 -rotate-12"><GraduationCap size={40}/></div>
      <div className="absolute bottom-20 right-1/4 opacity-20 text-indigo-700"><BookOpenText size={36}/></div>
      
      {/* 1. TOP HEADER: Modern, Rounded Banner Layout */}
      <header className="flex items-center gap-4 px-8 py-5 shrink-0 relative z-10">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl shadow-lg">
          <GraduationCap size={28} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-950">EduGuide AI Navigator</h1>
          <p className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Browser Search Engine Active
          </p>
        </div>
      </header>

      {/* 2. CHAT FEED: Dynamic Floating Bubbles (No rigid center column) */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {/* We use grid/flex here to let bubbles float naturally */}
        <div className="flex flex-col items-start gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`max-w-full md:max-w-4xl p-1 animate-fade-in ${msg.role === 'user' ? 'self-end ml-12' : 'self-start mr-12'}`}>
              <ChatBubble message={msg} />
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full my-3 justify-start pl-14 animate-fade-in">
              <LoadingDots />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 3. INPUT AREA: Floating, Pill-Shaped Control Panel */}
      <footer className="w-full shrink-0 pb-6 px-6 z-20">
        <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-2xl bg-white bg-opacity-95 backdrop-blur-sm">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}

export default App;