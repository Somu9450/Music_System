import React, { useState } from "react";
import './Login.css';
import loginImage from './login-image.png';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) { // Get onLogin prop
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const setValues = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (!input.email || !input.password) {
      alert("All fields are mandatory!");
      return;
    }

    if (storedUser && storedUser.email === input.email && storedUser.password === input.password) {
      alert("Login successful!");
      // MODIFIED: Call the onLogin function passed from App.js
      onLogin(); 
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={loginImage} alt="Listen to music" />
        <div className="login-image-text">
          <h1>Listen to the top music <br /> <span>FOR FREE</span></h1>
        </div>
      </div>

      <div className="login-right">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={setValues} value={input.email} />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              onChange={setValues}
              value={input.password}
              required
            />
            <span className="switch-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
        <label className="dont-exist">
          Don't have an Account?
          <span className="signup" onClick={() => navigate('/signup')}> SignUp</span>
        </label>
      </div>
    </div>
  );
}

export default Login;