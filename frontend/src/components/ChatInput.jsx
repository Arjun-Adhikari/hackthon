import { Send, Mic, Square } from 'lucide-react';

export default function ChatInput({ 
  input, 
  setInput, 
  handleSubmit, 
  handleKeyPress, 
  loading,
  isRecording,
  startRecording,
  stopRecording
}) {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleSubmit(); 
          }} 
          className="flex gap-2 items-center"
        >
          {/* Audio Recording Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`p-3 rounded-xl transition-all ${
              isRecording 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Recording audio..." : "How can I assist you..."}
            disabled={loading || isRecording}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 transition-all"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </footer>
  );
}