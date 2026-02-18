import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Promt from "./Promt";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const promtRef = useRef();
  const { isDark, toggleTheme, colors } = useTheme();

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNewChat = () => {
    if (promtRef.current?.handleNewChat) {
      promtRef.current.handleNewChat();
    }
    closeSidebar();
  };

  const handleLoadChat = (chatId) => {
    if (promtRef.current?.handleLoadChat) {
      promtRef.current.handleLoadChat(chatId);
    }
    closeSidebar();
  };

  return (
    <div
      style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}
      className="flex h-screen transition-colors duration-300 overflow-hidden"
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 transition-transform z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:flex-shrink-0`}
        style={{ backgroundColor: colors.bg.secondary }}
      >
        <Sidebar onClose={closeSidebar} onNewChat={handleNewChat} onLoadChat={handleLoadChat} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-4 border-b transition-colors"
          style={{ borderColor: colors.border, backgroundColor: colors.bg.secondary }}
        >
          <h1 className="text-xl font-bold">ValkyrieAI</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: colors.bg.tertiary,
                color: colors.accent.primary,
              }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: colors.bg.tertiary }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hidden md:flex fixed top-6 right-6 p-3 rounded-lg z-50 transition-all hover:scale-110"
          style={{
            backgroundColor: colors.bg.secondary,
            color: colors.accent.primary,
            border: `2px solid ${colors.border}`,
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Message Area */}
        <div className="flex-1 flex w-full overflow-hidden">
          <Promt ref={promtRef} />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}

export default Home;
