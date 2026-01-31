import { Bot } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Bot className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">MedicoChat web app</h1>
      </div>
    </header>
  );
}