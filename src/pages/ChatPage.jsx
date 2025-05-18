import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/chatPage.css";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import useChatApi from "../hooks/useChatApi.jsx";
import Cookies from "js-cookie";
import logo from "../assets/iit-white.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const { sendMessage, isLoading, error } = useChatApi();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getToday = () => new Date().toISOString().split("T")[0];

  const saveMessagesToCookie = (messages) => {
    const date = getToday();
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    allChats[date] = messages;
    Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
    setChatHistory(allChats);
  };

  const loadMessagesFromCookie = () => {
    const date = getToday();
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    setChatHistory(allChats);
    return allChats[date] || [{ type: "bot", text: "How can I help you today?" }];
  };

  const loadChat = (date) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    setMessages(allChats[date] || []);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const savedMessages = loadMessagesFromCookie();
    setMessages(savedMessages);

    const savedTheme =  localStorage.getItem("theme");
    setTheme(savedTheme === "dark" ? "dark" : "light");
    console.log(theme)
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const escapeHtml = (unsafe) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return (
    <div className={`chat-container-main ${theme === "dark" ? "chat-container-main-dark" : ""}`}>
      {/* Hamburger for mobile */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <h2>Chat History</h2>
        {Object.keys(chatHistory).map((date) => (
          <div
            key={date}
            className="history-date"
            onClick={() => loadChat(date)}
          >
            {date}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className={`chat-container ${theme === "dark" ? "chat-container-dark" : ""}`}>
        <div className="chat-main-div">
          <div className="chat-page-back-button" onClick={() => navigate("/")}>
            <IoIosArrowBack size={30} color="white" />
          </div>

          <div className="chat-screen">

            <div className="chat-screen-init">
              <div className="chat-img">
                <img src={logo} alt="Logo" />
              </div>
              <div className={`chat-header ${theme === "dark" ? "chat-header-dark" : ""}`}>
                <div className="icon-circle"></div>
                <h1 className="title">How can I help you today?</h1>
                <p className="chat-description">
                  Hi, I am the IIT ISM ChatBot. Ask me anything about academics,
                  campus life, facilities, and more.
                </p>
              </div>
            </div>

            <div
              className="chat-messages"
              style={{
                overflowY: "auto",
                flex: "1",
                paddingBottom: "10px",
                maxHeight: "60vh",
              }}
            >
              {messages.map((msg, idx) => (
                <span
                  key={idx}
                  className={`chat-message ${
                    msg.type === "user"
                      ? `user-message${theme === "dark" ? "-dark" : ""}`
                      : `bot-message${theme === "dark" ? "-dark" : ""}`
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: escapeHtml(msg.text).replace(/\n/g, "<br />"),
                  }}
                ></span>
              ))}
              {isLoading && (
                <div className="chat-loader">
                  <PulseLoader color="#ffffff" size={8} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`input-container ${theme === "dark" ? "input-container-dark" : ""}`}>
              <button className="input-icon-circle">
                <MdAttachFile
                  color="white"
                  style={{ backgroundColor: "transparent" }}
                  size={20}
                />
              </button>
              <input
                type="text"
                placeholder="Ask me about IIT (ISM) DHANBAD"
                className={`chat-input ${theme === "dark" ? "chat-input-dark" : ""}`}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                ref={inputRef}
                onFocus={() =>
                  setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100)
                }
              />
              <button
                className="send-button"
                onClick={handleSend}
                disabled={isLoading}
              >
                <AiOutlineSend
                  size={30}
                  color="white"
                  style={{ backgroundColor: "transparent" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
