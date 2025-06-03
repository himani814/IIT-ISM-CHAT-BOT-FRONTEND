import React from "react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { RiHome3Line, RiDeleteBackLine } from "react-icons/ri";
const Header = ({
  theme,
  startNewChat,
  deleteChatSession,
  currentChatId,
  setCurrentChatId,
  messages,
}) => {
  const navigate = useNavigate();
  const hasMessages = messages && messages.length > 0;

  return (
    <header className={`chat-top-bar-${theme}`}>
      <button
        className={`chat-page-back-button-${theme}`}
        onClick={() => navigate("/")}
        aria-label="Go back"
      >
        <RiHome3Line size={30} />
      </button>
      <div className={`chat-top-right-div-${theme}`}>
        <span className={`chat-version-${theme}`}>ISM BUDDY V1</span>
        {hasMessages && (
          <button
            className={`delete-session-button-${theme}`}
            onClick={() => {
              deleteChatSession(currentChatId);
              setCurrentChatId(null);
            }}
            title="Delete this session"
            aria-label={`Delete chat session ${currentChatId}`}
          >
            CLEAR CHAT
          </button>
        )}
        <button
          className={`create-task-${theme}`}
          onClick={startNewChat}
          aria-label="Start new chat"
        >
          NEW CHAT <GoPlus className={`goplus-new-${theme}`} />
        </button>
      </div>
    </header>
  );
};

export default Header;
