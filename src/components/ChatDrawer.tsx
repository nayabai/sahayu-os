import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  Phone,
  ShieldCheck,
  Paperclip,
  CheckCheck,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';

export const ChatDrawer: React.FC = () => {
  const {
    activeChatTarget,
    setActiveChatTarget,
    chatMessages,
    currentUser,
    currentRole,
    triggerMaskedCall,
    setIsQuoteModalOpen,
    setSelectedJobForQuote,
    jobs,
    showToast,
    refreshData
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!activeChatTarget) return null;

  // Filter messages for this conversation
  const conversation = (chatMessages || []).filter(
    (m: ChatMessage) =>
      (m.senderId === currentUser.id && m.recipientId === activeChatTarget.id) ||
      (m.senderId === activeChatTarget.id && m.recipientId === currentUser.id)
  );

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || messageText).trim();
    if (!content) return;

    setIsSending(true);
    try {
      await sendChatMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentRole,
        receiverId: activeChatTarget.id,
        receiverName: activeChatTarget.name,
        message: content
      });

      setMessageText('');
      await refreshData();
    } catch (e) {
      showToast('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const quickReplies = [
    'What is your exact locality in Pune?',
    'I can arrive within 30-45 minutes.',
    'Please share a photo of the repair area.',
    'Is the quote inclusive of spare parts?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
            {activeChatTarget.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{activeChatTarget.name}</h3>
            <span className="text-[11px] text-emerald-400 capitalize">
              {activeChatTarget.role} • Online in Pune
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => triggerMaskedCall({ name: activeChatTarget.name, role: activeChatTarget.role })}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
            title="Call with Masked Number"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveChatTarget(null)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-[11px] text-blue-900 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Personal contact numbers are kept private. Communicate safely via Sahayu.</span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
        {conversation.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <p>Start a conversation with {activeChatTarget.name}.</p>
            <p className="text-[11px]">Discuss job details, scope of work, and pricing estimates.</p>
          </div>
        ) : (
          conversation.map((msg: ChatMessage) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text || (msg as any).message}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-600" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Replies */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        {quickReplies.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type message in Marathi, Hindi, English..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isSending || !messageText.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
