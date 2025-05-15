import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/chatPage.css";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import useChatApi from "../hooks/useChatApi.jsx";

import logo from "../assets/iit-white.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "How can I help you today?" },
  ]);
  const { sendMessage, isLoading, error } = useChatApi();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInputMessage("");

    setTimeout(() => {
      inputRef.current?.focus(); // Keep focus on input
    }, 50);

    const botResponse = await sendMessage(userMessage);

    if (botResponse) {
      setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
    } else if (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: `Error: ${error}` },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-main-div">
      <div className="chat-page-back-button" onClick={() => navigate("/")}>
        <IoIosArrowBack size={30} color="white" />
      </div>

      <div className="chat-screen">
        <div className="chat-screen-init">
          <div className="chat-img">
            <img src={logo} alt="Logo" />
          </div>
          <div className="chat-header">
            <div className="icon-circle"></div>
            <h1 className="title">How can I help you today?</h1>
            <p className="description">
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
                msg.type === "user" ? "user-message" : "bot-message"
              }`}
            >
              {msg.text}
            </span>
          ))}
          {isLoading && (
            <div className="chat-loader">
              <PulseLoader color="#ffffff" size={8} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <button className="input-icon-circle">
            <MdAttachFile color="white"  style={{backgroundColor:"transparent"}} size={20} />
          </button>
          <input
            type="text"
            placeholder="Ask me about IIT (ISM) DHANBAD"
            className="chat-input"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            ref={inputRef}
            onFocus={() =>
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100)
            }
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isLoading}
          >
            <AiOutlineSend size={30} color="white" style={{backgroundColor:"transparent"}}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
