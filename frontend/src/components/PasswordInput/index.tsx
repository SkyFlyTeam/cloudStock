import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

import './style.css';


interface PasswordInputProps {
  password: string;
  onPasswordChange: (value: string) => void;
}


const PasswordInput:  React.FC<PasswordInputProps> = ({ password, onPasswordChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div  className="input-password">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        id="password"
        onChange={(e) => onPasswordChange(e.target.value)}
        value={password}
        required
      />
        {showPassword ? <FaRegEyeSlash color="#61BDE0" size={20} className="eye-icon" onClick={togglePasswordVisibility} /> : <FaRegEye color="#61BDE0" size={20} className="eye-icon" onClick={togglePasswordVisibility}/>}
    </div>
  );
};

export default PasswordInput;
