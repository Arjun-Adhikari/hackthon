import { Bot, User, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MessageList({ messages, loading, messagesEndRef }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Ready to chat?</h2>
            <p className="text-gray-500">I'm running entirely in your browser using Google's Gemini API.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
            }`}>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
              <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}