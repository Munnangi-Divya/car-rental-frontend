import React from "react";
import { Link } from "react-router-dom";
import "./Unauthorized.css";

function Unauthorized() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚫 Unauthorized</h1>
      <p>You don’t have permission to view this page.</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
}

export default Unauthorized;
