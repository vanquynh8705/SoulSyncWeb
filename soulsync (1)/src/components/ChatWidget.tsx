import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, Heart, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const PRESET_PROMPTS = [
  "Tôi đang stress vì deadline",
  "Tôi cảm thấy mất động lực",
  "Tôi khó ngủ gần đây",
  "Tôi lo lắng về tương lai"
];

export default function ChatWidget({ isOpen, onClose, onOpen }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Chào bạn! Mình là SoulSync AI – trợ lý hỗ trợ tinh thần ẩn danh dành cho sinh viên. 🕊️\n\nMình luôn ở đây để lắng nghe bạn một cách riêng tư, an toàn và không phán xét. Bạn đang gặp phải áp lực học tập hoặc có nỗi niềm gì muốn chia sẻ cùng mình không?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Direct post connection to our full-stack sever-side proxy endpoint
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối máy chủ");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ai",
          sender: "assistant",
          text: data.text || "Mình luôn ở đây để lắng nghe cậu. Hãy tiếp tục chia sẻ nhé!",
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error("Gemini Proxy fetch error:", err);
      // Fallback response with beautiful empathy
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          sender: "assistant",
          text: "Xin lỗi cậu nhé, đường kết nối của chúng mình đang bị rung rinh một chút. Nhưng cậu hãy nhắm mắt lại, hít một hơi sâu 4 giây và thở ra chậm 4 giây cùng mình nào. Cậu đang làm rất tốt rồi! 🌸",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: "Nhật ký ẩn danh mới đã bắt đầu! Hãy chia sẻ những mệt mỏi hay áp lực của bạn vào đây nhé. Mình luôn sẵn sàng lắng nghe và đồng hành cùng bạn. 🤍",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const hasUserSentMessage = messages.some((m) => m.sender === "user");

  return (
    <>
      {/* Floating Action Button (FAB) Anchor */}
      <button
        onClick={onOpen}
        id="btn-chat-privately"
        aria-label="Trò chuyện riêng tư"
        className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group ${isOpen ? "scale-0 pointer-events-none" : "scale-100"}`}
      >
        <MessageSquare className="h-6 w-6 fill-white" />
        <span className="absolute right-full mr-3.5 px-3 py-1.5 bg-neutral-800 text-white text-xs font-sans rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
          Trò chuyện riêng tư với AI 🕊️
        </span>
      </button>

      {/* Chat Windows Container */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-y-0 right-0 z-[90] w-full sm:w-[440px] p-0 sm:p-4 flex items-end justify-center pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="w-full h-full sm:h-[620px] bg-white sm:rounded-2xl shadow-2xl border border-neutral-100 flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Header section */}
              <div className="bg-[#f0eee9] px-5 py-4 flex items-center justify-between border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-neutral-800 leading-tight">
                      Bạn Đồng Hành SoulSync AI
                    </h3>
                    <p className="text-[10px] text-brand-blue font-bold flex items-center gap-1 mt-0.5">
                      <Heart className="h-3 w-3 fill-brand-blue" />
                      Lắng nghe thấu cảm & Không phán xét
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetChat}
                    title="Xóa cuộc đối thoại"
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200/50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200/50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Disclaimer banner */}
              <div className="px-4 pt-3 shrink-0 bg-white">
                <div className="bg-amber-50/80 border border-amber-200/30 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-900/90 leading-relaxed shadow-xs">
                  <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">💡</span>
                  <p>
                    <strong className="font-extrabold text-[#78350f]">Lưu ý quan trọng: </strong>
                    SoulSync AI chỉ hỗ trợ tinh thần ban đầu và không thay thế chuyên gia tâm lý hoặc bác sĩ. Nếu bạn đang trong tình huống khẩn cấp, hãy liên hệ người thân, cơ sở y tế gần nhất hoặc số cấp cứu địa phương.
                  </p>
                </div>
              </div>

              {/* Messages Body section */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fbf9f4]/40 custom-scrollbar font-sans"
              >
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
                    >
                      {!isUser && (
                        <div className="h-7 w-7 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border border-neutral-100 ${
                          isUser
                            ? "bg-brand-blue text-white rounded-tr-none"
                            : "bg-white text-neutral-800 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Typing status indicator */}
                {isTyping && (
                  <div className="flex justify-start items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-neutral-100 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Rapid helper Preset prompts */}
              {!hasUserSentMessage && (
                <div className="px-4 py-3 bg-[#fbf9f4]/80 flex flex-wrap gap-2 shrink-0 border-t border-neutral-100">
                  {PRESET_PROMPTS.map((promptString, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(promptString)}
                      className="px-3.5 py-1.5 bg-[#fbf9f4] hover:bg-[#33628b] hover:text-white border border-[#33628b]/30 rounded-xl font-sans text-xs font-medium text-[#33628b] transition-all hover:shadow-xs active:scale-[0.98] cursor-pointer"
                    >
                      {promptString}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input form area */}
              <div className="p-4 bg-white border-t border-neutral-100 flex gap-2 items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Nhập tâm sự của bạn tại đây..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 text-sm text-neutral-800 border-none outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 resize-none font-sans"
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim()}
                  className="h-10 w-10 rounded-full bg-brand-blue hover:bg-brand-blue/95 hover:scale-[1.03] text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                >
                  <Send className="h-4 w-4 fill-white" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
