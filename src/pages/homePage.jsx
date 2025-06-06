// Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/AppwriteConfig.js";
import Cookies from "js-cookie";

import NavBar from "../components/Navbar.jsx";

import logoLight from "../assets/iit-ism-light.png";
import logoDark from "../assets/cyan.png";

import iitlogoLight from "../assets/iit-logo-light.png";

import TypeAnimation from "../utils/typeAnimation.jsx";

import "../styles/homePageLight.css";
import "../styles/homePageDark.css";

import {
  FaLinkedin,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const sequence = [
    "ISM Buddy 🤖",
    "Your Personal Assistant at IIT Dhanbad",
    "Guiding You Through Campus Life",
    "Ask Me About Academics & Clubs",
    "Ready to Answer All Your ISM Questions",
    "Your Go-To for Course and Hostel Info",
    "Bringing You the Latest Campus Updates",
    "Your Smart, Friendly Chat Companion",
    "Always Ready. Always Helpful.",
    "ISM Buddy 🤖",
    "Personal Assistant at IIT Dhanbad",
    "Guiding You Through Campus Life",
    "Ask Me About Academics & Clubs",
    "Your Go-To for Course and Hostel Info",
    "Friendly Chat Companion",
    "Always Ready. Always Helpful.",
    "Making ISM Life Easier for You 💙",
    "ISM Buddy 🤖",
    "Personal Assistant at IIT Dhanbad",
    "Guiding You Through Campus Life",
    "Ask Me About Academics & Clubs",
    "Ready to Answer All Your ISM Questions",
    "Your Go-To for Course and Hostel Info",
    "Bringing You the Latest Campus Updates",
    "Your Smart, Friendly Chat Companion",
    "Always Ready. Always Helpful.",
    "Making ISM Life Easier for You 💙",
    "ISM Buddy 🤖",
    "Personal Assistant at IIT Dhanbad",
    "Guiding You Through Campus Life",
    "Ask Me About Academics & Clubs",
    "Ready to Answer All Your ISM Questions",
    "Your Go-To for Course and Hostel Info",
    "Bringing You the Latest Campus Updates",
    "Your Smart, Friendly Chat Companion",
    "Always Ready. Always Helpful.",
    "Making ISM Life Easier for You 💙",
    "ISM Buddy 🤖",
    "Your Personal Assistant at IIT Dhanbad",
    "Guiding You Through Campus Life",
    "Ask Me About Academics & Clubs",
    "Ready to Answer All Your ISM Questions",
    "Your Go-To for Course and Hostel Info",
    "Bringing You the Latest Campus Updates",
    "Your Smart, Friendly Chat Companion",
    "Always Ready. Always Helpful.",
    "Making ISM Life Easier for You 💙",
  ];

  const [userName, setUserName] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
   const [themes, setThemes] = useState(theme);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
    setThemes(theme);
  }, [theme]);

  useEffect(() => {
    account
      .get()
      .then((res) => {
        if (res.email && res.email.endsWith("@iitism.ac.in")) {
          Cookies.set("userId", res.$id, { expires: 7 });
          Cookies.set("userName", res.name, { expires: 7 });
          Cookies.set("userEmail", res.email, { expires: 7 });
          setUserName(res.name);
          console.log("Logged in user data stored in cookies");
        } else {
          alert("Please login with your IIT ISM email (@iitism.ac.in) only.");
          account.deleteSession("current").then(() => {
            setUserName(null);
            Cookies.remove("userId");
            Cookies.remove("userName");
            Cookies.remove("userEmail");
          });
        }
      })
      .catch(() => {
        setUserName(null);
        console.log("User not logged in");
      });
  }, []);

  const handleLoginClick = () => {
    account.createOAuth2Session(
      "google",
      "https://chat-bot-iit-ism-frontend-dbwo.vercel.app",
      "https://chat-bot-iit-ism-frontend-dbwo.vercel.app"
    );
  };

  const handleLogoutClick = () => {
    account
      .deleteSession("current")
      .then(() => {
        Cookies.remove("userId");
        Cookies.remove("userName");
        Cookies.remove("userEmail");
        setUserName(null);
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  const handleChatClick = () => navigate("/chat");

  const handleFacebookClick = () =>
    window.open("https://www.facebook.com/IITISMDHNB/", "_blank");
  const handleLinkedInClick = () =>
    window.open(
      "https://www.linkedin.com/school/iitism/?originalSubdomain=in",
      "_blank"
    );
  const handleInstaClick = () =>
    window.open("https://www.instagram.com/iit.ism/?hl=en", "_blank");
  const handleTwitterClick = () =>
    window.open("https://x.com/iitismdhn", "_blank");

  return (
    <>
      <NavBar theme={themes}/>
      <div className={`home-${theme}`}>
        <div className={`home-left-${theme}`}>
          <div className={`home-left-1-${theme}`}>
            Hi, it's <p>ISM BUDDY</p>
          </div>

          <div className={`home-left-2-${theme}`}>
            I'm {" "}
            <div className={`home-left-2-title-${theme}`}>
              <TypeAnimation
                sequence={sequence}
                wrapper="div"
                repeat={Infinity}
              />
            </div>
          </div>

          <p className={`home-left-3-${theme}`}>
            Meet ISM Buddy – your friendly chat assistant from IIT Dhanbad!
            Whether you're a student navigating college life, curious about
            academics, or just looking for quick answers, ISM Buddy is here to
            help 24/7.
          </p>

          <div className={`home-left-4-${theme}`}>
            <FaLinkedin
              className={`footer-icons-div-${theme}`}
              onClick={handleLinkedInClick}
            />
            <FaFacebookSquare
              className={`footer-icons-div-${theme}`}
              onClick={handleFacebookClick}
            />
            <FaInstagramSquare
              className={`footer-icons-div-${theme}`}
              onClick={handleInstaClick}
            />
            <FaTwitterSquare
              className={`footer-icons-div-${theme}`}
              onClick={handleTwitterClick}
            />
          </div>

          {userName && (
            <div className={`home-left-5-n-${theme}`}>
              <div className={`home-left-5-2-n-${theme}`}>
                Welcome, {userName}
              </div>
            </div>
          )}

          <div className={`home-left-5-${theme}`}>
            <div className={`home-left-5-1-${theme}`} onClick={handleChatClick}>
              CHAT WITH ME
            </div>

            {userName ? (
              <div
                className={`home-left-5-1-${theme}`}
                onClick={handleLogoutClick}
              >
                LOG OUT
              </div>
            ) : (
              <div
                className={`home-left-5-2-${theme}`}
                onClick={handleLoginClick}
              >
                LOGIN
              </div>
            )}
          </div>

            <div className={`home-left-br-${theme}`}>
            <div
              className={`theme-toggle-light-${theme} ${
                theme === "light" ? "active" : ""
              }`}
              onClick={() => setTheme("light")}
            ></div>
            <div
              className={`theme-toggle-dark-${theme} ${
                theme === "dark" ? "active" : ""
              }`}
              onClick={() => setTheme("dark")}
            ></div>
          </div>
        </div>

        <div className={`home-right-${theme}`}>
          <img src={theme=='light' ? iitlogoLight :iitlogoLight} alt="Logo" />
        </div>
      </div>
    </>
  );
}

export default Home;
