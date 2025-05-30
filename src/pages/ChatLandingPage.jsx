// Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/AppwriteConfig.js";
import Cookies from "js-cookie";

import NavBar from "../components/Navbar.jsx";
import "../styles/home.css";
import logo from "../assets/cyan.png";
import TypeAnimation from "../utils/typeAnimation.jsx";
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
    "Helping You Stay on Top of Deadlines 📅",
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
    "Helping You Stay on Top of Deadlines 📅",
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
    "Helping You Stay on Top of Deadlines 📅",
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
    "Helping You Stay on Top of Deadlines 📅",
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
    "Helping You Stay on Top of Deadlines 📅",
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

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
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

  const handleLinkedInClick = () =>
    window.open("https://www.linkedin.com/school/iitism/?originalSubdomain=in", "_blank");
  const handleInstaClick = () =>
    window.open("https://www.instagram.com/shubhdasham", "_blank");
  const handleTwitterClick = () =>
    window.open("https://twitter.com/IITISM_Dhanbad", "_blank");

  return (
    <>
      <NavBar />
      <div className={`home ${theme}`}>
        <div className="home-left">
          <div className="home-left-1">
            Hi, it's <p>ISM BUDDY</p>
          </div>
          <div className="home-left-2">
            I'm a{" "}
            <div className="home-left-2-title">
              <TypeAnimation
                sequence={sequence}
                wrapper="div"
                repeat={Infinity}
              />
            </div>
          </div>
          <p className="home-left-3">
            Meet ISM Buddy – your friendly chat assistant from IIT Dhanbad!
            Whether you're a student navigating college life, curious about
            academics, or just looking for quick answers, ISM Buddy is here to
            help 24/7...
          </p>

          <div className="home-left-4">
            <FaLinkedin
              className="footer-icons-div"
              onClick={handleLinkedInClick}
            />
            <FaFacebookSquare
              className="footer-icons-div"
              onClick={() => alert("This feature is coming soon!")}
            />
            <FaInstagramSquare
              className="footer-icons-div"
              onClick={handleInstaClick}
            />
            <FaTwitterSquare
              className="footer-icons-div"
              onClick={handleTwitterClick}
            />
          </div>

          {userName && (
            <div className="home-left-5-n">
              <div className="home-left-5-2-n">Welcome, {userName}</div>
            </div>
          )}
          <div className="home-left-5">
            <div className="home-left-5-1" onClick={handleChatClick}>
              CHAT WITH ME
            </div>

            {userName ? (
              <div className="home-left-5-1" onClick={handleLogoutClick}>
                LOG OUT
              </div>
            ) : (
              <div className="home-left-5-2" onClick={handleLoginClick}>
                LOGIN
              </div>
            )}
          </div>

          <div className="home-left-br">
            {theme === "dark" ? (
              <div
                className={`home-left-5-br ${
                  theme === "light" ? "active" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                WHITE MODE
              </div>
            ) : (
              <div
                className={`home-left-5-br ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                DARK MODE
              </div>
            )}
          </div>
        </div>

        <div className="home-right">
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </>
  );
}

export default Home;
