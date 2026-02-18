import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { Paperclip, ArrowUp, Globe, Bot, Sparkles } from "lucide-react";
import logo from "../../public/logo.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";

function Promt(props, ref) {
  const [inputValue, setInputValue] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [deepThink, setDeepThink] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [promt, setPromt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const promtEndRef = useRef();
  const fileInputRef = useRef();
  const { colors } = useTheme();

  // Expose handleNewChat and handleLoadChat to parent via ref
  useImperativeHandle(ref, () => ({
    handleNewChat: () => {
      setPromt([]);
      setInputValue("");
      setTypeMessage("");
      setDeepThink(false);
      setSearchEnabled(false);
      setUploadedFile(null);
      const newConversationId = Date.now().toString();
      setConversationId(newConversationId);
    },
    handleLoadChat: (chatId) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const storageKey = `promtHistory_${user._id}_${chatId}`;
        const savedChat = JSON.parse(localStorage.getItem(storageKey));
        if (savedChat) {
          setPromt(savedChat);
          setConversationId(chatId);
          setInputValue("");
          setTypeMessage("");
          setDeepThink(false);
          setSearchEnabled(false);
          setUploadedFile(null);
        }
      }
    },
  }));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const newConversationId = Date.now().toString();
      setConversationId(newConversationId);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && conversationId) {
      localStorage.setItem(
        `promtHistory_${user._id}_${conversationId}`,
        JSON.stringify(promt)
      );
    }
  }, [promt, conversationId]);

  useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promt, loading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setInputValue("");
    setTypeMessage(trimmed);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/deepseekai/promt",
        { 
          content: trimmed,
          deepThink,
          search: searchEnabled,
          fileContent: uploadedFile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setPromt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ]);
      
      // Reset modes after sending
      setDeepThink(false);
      setSearchEnabled(false);
      setUploadedFile(null);
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = error?.response?.data?.error || error?.message || "Something went wrong with the AI response.";
      
      setPromt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content: "❌ Error: " + errorMsg,
        },
      ]);
    } finally {
      setLoading(false);
      setTypeMessage(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result;
        setUploadedFile({
          name: file.name,
          content: content,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full transition-colors duration-300" style={{ backgroundColor: colors.bg.primary }}>
      {/* ➤ Scrollable Chat Box */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 transition-colors space-y-4"
        style={{ backgroundColor: colors.bg.primary }}
      >
        <div className="w-full max-w-4xl mx-auto space-y-4 py-4">
          {/* ValkyrieAI Header - Show when no messages and input is empty */}
          {promt.length === 0 && !inputValue.trim() && (
            <div className="flex items-center justify-center py-12">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                ValkyrieAI
              </h1>
            </div>
          )}
          {promt.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="w-full md:w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed transition-colors"
                  style={{
                    backgroundColor: colors.bg.secondary,
                    color: colors.text.primary,
                    borderLeft: `4px solid ${colors.accent.primary}`,
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={codeTheme}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg mt-3 mb-3 text-xs"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="px-2 py-1 rounded text-xs font-mono"
                            style={{
                              backgroundColor: colors.bg.tertiary,
                              color: colors.accent.primary,
                            }}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>;
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div
                  className="w-[70%] md:w-[50%] rounded-2xl px-5 py-4 text-sm font-medium"
                  style={{
                    backgroundColor: colors.accent.primary,
                    color: "white",
                  }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {/* Show user's prompt while loading */}
          {loading && typeMessage && (
            <div className="w-full flex justify-end">
              <div
                className="w-[70%] md:w-[50%] rounded-2xl px-5 py-4 text-sm font-medium"
                style={{ backgroundColor: colors.accent.primary, color: "white" }}
              >
                {typeMessage}
              </div>
            </div>
          )}

          {/* 🤖 Typing Indicator */}
          {loading && (
            <div className="flex justify-start w-full">
              <div
                className="px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2"
                style={{ backgroundColor: colors.bg.secondary, color: colors.text.secondary }}
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={promtEndRef} />
        </div>
      </div>

      {/* ➤ Input Box - Always at bottom */}
      <div className="w-full px-4 pb-6 md:pb-8 mt-auto">
        <div
          className="max-w-4xl mx-auto rounded-2xl px-5 md:px-6 py-4 md:py-5 shadow-lg border transition-all"
          style={{
            backgroundColor: colors.bg.secondary,
            borderColor: colors.border,
          }}
        >
          <textarea
            placeholder="✨ Say something interesting..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full text-base md:text-lg outline-none resize-none rounded"
            rows="2"
            style={{ color: colors.text.primary }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            {/* Feature Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDeepThink(!deepThink)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  deepThink ? "shadow-lg" : ""
                }`}
                style={{
                  backgroundColor: deepThink ? colors.accent.primary : colors.bg.tertiary,
                  color: deepThink ? "white" : colors.text.secondary,
                  border: `2px solid ${deepThink ? colors.accent.primary : colors.border}`,
                }}
              >
                <Sparkles size={16} />
                Deep Think
              </button>
              <button
                type="button"
                onClick={() => setSearchEnabled(!searchEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  searchEnabled ? "shadow-lg" : ""
                }`}
                style={{
                  backgroundColor: searchEnabled ? colors.accent.secondary : colors.bg.tertiary,
                  color: searchEnabled ? "white" : colors.text.secondary,
                  border: `2px solid ${searchEnabled ? colors.accent.secondary : colors.border}`,
                }}
              >
                <Globe size={16} />
                Search
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx,.json,.js,.py,.ts,.tsx,.jsx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                    uploadedFile ? "shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor: uploadedFile ? colors.accent.success : colors.bg.tertiary,
                    color: uploadedFile ? "white" : colors.text.secondary,
                  }}
                  title={uploadedFile ? `File: ${uploadedFile.name}` : "Attach file"}
                >
                  <Paperclip size={18} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className="p-3 rounded-full font-bold transition-all transform hover:scale-110 disabled:opacity-50"
                style={{
                  backgroundColor: colors.accent.primary,
                  color: "white",
                }}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Promt);
