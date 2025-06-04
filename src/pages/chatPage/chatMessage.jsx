import React, { useState, useRef, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import logo from "../../assets/iit-white.png";
import bot_icon from "../../assets/bot-icon.png";
import user_icon from "../../assets/user-icon.png";

import useChatApi from "../../hooks/useChatApi.jsx";
import Cookies from "js-cookie";

const ChatMessages = ({
  theme,
  messages,
  isloading,
  setMessages,
  messagesEndRef,inputMessage, setInputMessage,
  handleSendSuggestion
}) => {
  const inputRef = useRef(null);
  const { sendMessage, isLoading, error } = useChatApi();

  // ✅ Get or set current chatId
  const [chatId, setChatId] = useState(() => {
    let id = Cookies.get("currentChatId");
    if (!id) {
      const now = new Date();
      id = `chat-${now.toISOString().replace(/[:.]/g, "-")}`;
      Cookies.set("currentChatId", id);
    }
    return id;
  });


  // ✅ Load current chat history on mount
  useEffect(() => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    const currentMessages = allChats[chatId]?.messages || [];
    setMessages(currentMessages);
  }, [chatId]);

  const handleSuggestionClick = (question) => {
    handleSendSuggestion(question);
  };

  return (
    <section className={`chat-screen-${theme}`}>
      {messages.length <= 0 ? (
        <div className={`chat-screen-init-${theme}`}>
          <img src={logo} alt="Glowing Orb" className="orb" />
          <h1 className={`title-${theme}`}>Welcome to IIT (ISM) ChatBot</h1>
          <p className={`chat-description-${theme}`}>
            Hi, I am the IIT ISM ChatBot. Ask me anything about academics,
            campus life, facilities, and more.
          </p>
          <div className={`suggestions-${theme}`}>
            {[
              "What are the top branches at IIT (ISM) Dhanbad?",
              "How is campus life at IIT (ISM) Dhanbad?",
              "What are the placement statistics for IIT (ISM) Dhanbad?",
            ].map((question, index) => (
              <div
                key={index}
                className={`card-item-${theme}`}
                onClick={() => handleSuggestionClick(question)}
                style={{ cursor: "pointer" }}
              >
                <p>{question}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`chat-messages-${theme}`}>
          {messages.map((msg, idx) => (
            <div style={{padding:"20px"}}>

              {msg.type !== "user" && (
                <div className={`bot-icon-div-${theme}`}>
                  <img src={bot_icon} />
                  <p>ISM BUDDY</p>
                </div>
              )}

              <div
                key={idx}
                className={`chat-message-p-${theme} ${
                    msg.type === "user"
                      ? `user-chat-message-p-${theme}`
                      : `bot-chat-message-p-${theme}`
                  }`}
              >
                <div
                  key={idx}
                  className={`chat-message-${theme} ${
                    msg.type === "user"
                      ? `user-message-${theme}`
                      : `bot-message-${theme}`
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={materialDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                {msg.type === "user" && (
                  <div className={`user-icon-div-${theme}`}>
                    <img src={user_icon} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading ||
            (isloading && (
              <div className={`chat-loader-${theme}`}>
                <PulseLoader className={`chat-loading-${theme}`} size={8} color="#045acb" />
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </section>
  );
};

export default ChatMessages;
