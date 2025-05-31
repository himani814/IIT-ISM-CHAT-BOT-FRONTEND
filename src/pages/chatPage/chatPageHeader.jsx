import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { RiHome3Line } from "react-icons/ri";

const Header = ({ theme, startNewChat }) => {
  const navigate = useNavigate();

  return (
    <header className={`chat-top-bar-${theme}`}>
      <button
        className={`chat-page-back-button-${theme}`}
        onClick={() => navigate("/")}
        aria-label="Go back"
      >
        <RiHome3Line size={30} />
      </button>
      <div
        className={`chat-top-right-div-${theme}`}>

        <span 
          className={`chat-version-${theme}`}>ISM BUDDY V1</span>
        <button
          className={`create-task-${theme}`}
          onClick={startNewChat}
          aria-label="Start new chat"
        >
          NEW CHAT 
          <GoPlus className={`goplus-new-${theme}`} />
        </button>
      </div>
    </header>
  );
};

export default Header;
