import React, { useState } from "react";
import './SignUp.css';
import loginImage from './login-image.png';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [input, setInput] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

  const setValues = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (input.password !== input.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    localStorage.setItem("userData", JSON.stringify(input));
    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src={loginImage} alt="Listen to music" />
        <div className="signup-image-text">
          <h1>Listen to the top music <br /> <span>FOR FREE</span></h1>
        </div>
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <div className="name-fields">
            <div>
              <label>First Name</label>
              <input type="text" name="firstName" onChange={setValues} value={input.firstName} required />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" name="lastName" onChange={setValues} value={input.lastName} required />
            </div>
          </div>
          <label>Email</label>
          <input type="email" name="email" onChange={setValues} value={input.email} required />
          <label>Password</label>
          <input type={showPassword ? "text" : "password"} name="password" onChange={setValues} value={input.password} required />
          <label>Confirm Password</label>
          <input type={showPassword ? "text" : "password"} name="confirmPassword" onChange={setValues} value={input.confirmPassword} required />
          <span className="switch-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
