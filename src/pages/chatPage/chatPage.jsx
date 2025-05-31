import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import useChatApi from "../../hooks/useChatApi.jsx";
import Sidebar from "./chatPageSidebar.jsx";
import Header from "./chatPageHeader.jsx";
import ChatMessages from "./chatMessage.jsx";
import ChatInput from "./chatInput.jsx";

import "../../styles/chatPageLight/chatPage.css";
import "../../styles/chatPageLight/chatPageHeader.css";
import "../../styles/chatPageLight/chatPageSidebar.css";
import "../../styles/chatPageLight/chatMessage.css";
import "../../styles/chatPageLight/chatInput.css";

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const { sendMessage, isLoading, error } = useChatApi();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getToday = () => new Date().toISOString().split("T")[0];

  const saveMessagesToCookie = (msgs) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    const chatId = currentChatId || getToday();
    allChats[chatId] = msgs;
    Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
    setChatHistory(allChats);
  };

  const loadMessagesFromCookie = () => {
    const date = getToday();
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    setChatHistory(allChats);
    setCurrentChatId(date);
    return allChats[date] || [];
  };

  const loadChat = (chatId) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    setMessages(allChats[chatId] || []);
    setCurrentChatId(chatId);
    setIsSidebarOpen(false);
  };

  const startNewChat = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sessionKey = `session-${timestamp}`;
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");

    if (messages.length > 0 && currentChatId) {
      allChats[currentChatId] = messages;
    }

    Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
    setChatHistory(allChats);
    setMessages([]);
    setCurrentChatId(sessionKey);
  };

  const deleteChatSession = (chatId) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    if (allChats[chatId]) {
      delete allChats[chatId];
      Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
      setChatHistory(allChats);

      if (chatId === currentChatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    }
  };

  useEffect(() => {
    const savedMessages = loadMessagesFromCookie();
    setMessages(savedMessages);

    const savedTheme = localStorage.getItem("theme");
    // if (savedTheme === "dark" || savedTheme === "light") {
    //   setTheme(savedTheme);
    // }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleInputChange = (e) => setInputMessage(e.target.value);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    const newMessages = [...messages, { type: "user", text: userMessage }];
    setMessages(newMessages);
    setInputMessage("");

    setTimeout(() => inputRef.current?.focus(), 50);

    const botResponse = await sendMessage(userMessage);

    const finalMessages = botResponse
      ? [...newMessages, { type: "bot", text: botResponse }]
      : [...newMessages, { type: "bot", text: `Error: ${error}` }];

    setMessages(finalMessages);
    saveMessagesToCookie(finalMessages);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  return (
    <div className={`chat-container-main-${theme}`}>
      <Sidebar
        theme={theme}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatHistory={chatHistory}
        loadChat={loadChat}
        deleteChatSession={deleteChatSession}
        toggleTheme={toggleTheme}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
      />
      <main className={`chat-container-${theme}`}>
        <div className={`chat-main-div-${theme}`}>
          <Header
            theme={theme}
            startNewChat={startNewChat}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />
          <ChatMessages
            theme={theme}
            messages={messages}
            isloading={isLoading}
            messagesEndRef={messagesEndRef}
            escapeHtml={escapeHtml}
            setMessages={setMessages}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />
          <ChatInput
            theme={theme}
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            handleSend={handleSend}
            isLoading={isLoading}
            inputRef={inputRef}
            messagesEndRef={messagesEndRef}
            setMessages={setMessages}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
