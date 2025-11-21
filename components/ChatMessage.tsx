import React from 'react';
import { Message } from '../types';
import { User, Bot, Cpu } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
        <div className="flex justify-center my-4">
            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                {message.text}
            </span>
        </div>
    )
  }

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${isUser ? 'bg-emerald-500' : 'bg-blue-500'}`}>
            {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-2 rounded-lg shadow-sm text-sm ${
            isUser
              ? 'bg-emerald-100 text-emerald-900 rounded-tr-none'
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
          }`}
        >
          {/* Sender Name */}
          <div className={`text-xs font-bold mb-1 ${isUser ? 'text-emerald-700 text-right' : 'text-blue-700 text-left'}`}>
             {message.sender}
          </div>
          
          {/* Text */}
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.text}
          </div>
          
          {/* Timestamp */}
          <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};
