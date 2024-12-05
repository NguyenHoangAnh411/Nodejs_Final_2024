import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomeButton.css"; // Create this CSS file for styling if needed

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      className="home-button"
      onClick={() => navigate("/")}
    >
      Home
    </button>
  );
}

export default HomeButton;
