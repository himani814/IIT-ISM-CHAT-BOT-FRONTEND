import React from "react";
import { IoChatbubblesOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { RiSecurePaymentLine, RiDeleteBackLine } from "react-icons/ri";

const Sidebar = ({
  theme,
  isSidebarOpen,
  toggleSidebar,
  chatHistory,
  loadChat,
  deleteChatSession,
  toggleTheme,
  currentChatId,
  setCurrentChatId,
}) => {
  return (
    <aside
      className={`sidebar-top-${theme} ${isSidebarOpen ? "sidebar-open" : ""}`}
      aria-label="Sidebar navigation"
    >
      <div className={`sidebar-top-div-${theme}`}>
        <IoChatbubblesOutline size={30} />
        ISM BUDDY
      </div>

      <div
        className={`sidebar-${theme} ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Sidebar navigation"
      >
        <nav className="nav-menu">
          <ul>
            <li className="active">
              <span className="icon" aria-hidden="true">
                <RiSecurePaymentLine />
              </span>{" "}
              SESSION ACTIVE
            </li>
          </ul>
        </nav>

        <div className={`recent-chats-${theme}`}>
          {Object.keys(chatHistory).length === 0 ? (
            <p className={`no-history-${theme}`}>No chat history found.</p>
          ) : (
            <ul>
              {Object.keys(chatHistory).map((date, index) => (
                <li
                  key={date}
                  className={`history-row-${theme} ${currentChatId === date ? "selected-chat" : ""}`}

                >
                  <button
                    className={`history-date-${theme}`}
                    onClick={() => {
                      loadChat(date);
                      setCurrentChatId(date);
                    }}
                    aria-label={`Load chat from ${date}`}
                  >
                    <IoChatboxEllipsesOutline className={`chat-date-icon${theme}`} />
                    Chat {index + 1}
                  </button>
                  <button
                    className={`delete-session-button-${theme}`}
                    onClick={() => {
                      deleteChatSession(date);
                      if (currentChatId === date) setCurrentChatId(null);
                    }}
                    title="Delete this session"
                    aria-label={`Delete chat session from ${date}`}
                  >
                    <RiDeleteBackLine />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
