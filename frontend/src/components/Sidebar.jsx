import React, { useState, useEffect } from "react";
import { LogOut, X, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function Sidebar({ onClose, onNewChat, onLoadChat }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [chatHistory, setChatHistory] = useState([]);

  // Load chat history from localStorage
  useEffect(() => {
    if (user) {
      const histories = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`promtHistory_${user._id}_`)) {
          const chatId = key.replace(`promtHistory_${user._id}_`, "");
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.length > 0) {
            const firstMessage = data[0]?.content?.substring(0, 30) + "...";
            histories.push({
              id: chatId,
              title: firstMessage,
              key: key,
            });
          }
        }
      }
      setChatHistory(histories);
    }
  }, [user]);

  const handleNewChat = () => {
    if (onNewChat) onNewChat();
    onClose();
  };

  const handleLoadPreviousChat = (chatId) => {
    if (onLoadChat) onLoadChat(chatId);
  };

  const handleDeleteChat = (key, e) => {
    e.stopPropagation();
    localStorage.removeItem(key);
    setChatHistory(chatHistory.filter((chat) => chat.key !== key));
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/user/logout",
        { withCredentials: true }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert(data.message);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout Failed");
    }
  };

  return (
    <div
      className="h-full flex flex-col p-4 transition-colors"
      style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}
    >
      {/* Header - Fixed */}
      <div
        className="flex border-b p-3 justify-between items-center mb-6 rounded-lg transition-colors flex-shrink-0"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.bg.primary,
        }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          ValkyrieAI
        </h2>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded hover:opacity-70 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* History - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 min-h-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: colors.accent.primary,
              color: "#ffffff",
            }}
          >
            <Plus size={18} />
            New Chat
          </button>

          {chatHistory.length > 0 ? (
            <div className="space-y-2 mt-6">
              <p
                className="text-xs uppercase font-semibold px-3 opacity-60"
                style={{ color: colors.text.secondary }}
              >
                Recent Chats
              </p>
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleLoadPreviousChat(chat.id)}
                  className="group flex items-center justify-between p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    color: colors.text.secondary,
                  }}
                >
                  <span className="truncate flex-1 text-sm">{chat.title}</span>
                  <button
                    onClick={(e) => handleDeleteChat(chat.key, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:rounded ml-1"
                    style={{
                      backgroundColor: colors.accent.error,
                      color: "white",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-sm text-center mt-20 opacity-60"
              style={{ color: colors.text.tertiary }}
            >
              No chat history yet
            </div>
          )}
      </div>

      {/* Footer - Fixed */}
      <div
        className="p-3 border-t rounded-lg transition-colors flex-shrink-0"
        style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}
      >
        <div className="flex items-center gap-3 py-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="rounded-full w-10 h-10"
          />
          <span className="font-semibold text-sm truncate">
            {user ? user?.firstName : "Profile"}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: colors.accent.error,
              color: "white",
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
