import { useState } from 'react';
import { SessionUData } from '../assets/uasd';
import Navbar from './Nav';

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function PortfolioAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abdul's backend integration
    SessionUData.name = formData.userName;
    SessionUData.role = "Patient";
    SessionUData.reports = {gaw:"asd",gim:"sss"};
    console.log(SessionUData);
    console.log('Form submitted:', formData);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4">
        <div 
          className="max-w-6xl w-full flex rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: colors.lightBlue }}
        >
          {/* Left Side - Welcome Message */}
          <div 
            className="flex-1 flex items-center justify-center p-12"
            style={{ backgroundColor: colors.mediumBlue }}
          >
            <div className="max-w-md text-center">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <span style={{ color: colors.darkestBlue }}>Welcome to</span>
                <br />
                <span className="text-white">Pharma</span>
                <br />
                <span className="text-white">Connect</span>
                <br />
                {/* <span style={{ color: colors.darkestBlue }}>platform</span> */}
              </h1>
              <p 
                className="text-lg mt-6 leading-relaxed"
                style={{ color: colors.darkBlue }}
              >
                One stop and best solution for your healthcare needs and benefits
              </p>
              
              {/* Healthcare Icon/Visual Element */}
              <div className="mt-8">
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightestBlue }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.darkBlue }}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div 
            className="flex-1 flex items-center justify-center p-12"
            style={{ backgroundColor: 'white' }}
          >
            <div className="w-full max-w-md">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  <span 
                    className={`transition-colors duration-300 ${isLogin ? 'opacity-100' : 'opacity-50'}`}
                    style={{ color: isLogin ? colors.darkestBlue : colors.mediumBlue }}
                  >
                    Login
                  </span>
                  <span 
                    className="mx-2"
                    style={{ color: colors.mediumBlue }}
                  >
                    /
                  </span>
                  <span 
                    className={`transition-colors duration-300 ${!isLogin ? 'opacity-100' : 'opacity-50'}`}
                    style={{ color: !isLogin ? colors.darkestBlue : colors.mediumBlue }}
                  >
                    SignUp
                  </span>
                </h2>
                <div className="h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 rounded-full" style={{ color: colors.mediumBlue }}></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field (SignUp only) */}
                {!isLogin && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <input
                      type="text"
                      name="userName"
                      placeholder="User Name"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.lightBlue,
                        backgroundColor: colors.lightestBlue,
                        color: colors.darkestBlue
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}40`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.backgroundColor = colors.lightestBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                      required={!isLogin}
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.lightBlue,
                      backgroundColor: colors.lightestBlue,
                      color: colors.darkestBlue
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.mediumBlue;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}40`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.lightBlue;
                      e.target.style.backgroundColor = colors.lightestBlue;
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder={isLogin ? "Password" : "Enter password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.lightBlue,
                      backgroundColor: colors.lightestBlue,
                      color: colors.darkestBlue
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.mediumBlue;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}40`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.lightBlue;
                      e.target.style.backgroundColor = colors.lightestBlue;
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Confirm Password Field (SignUp only) */}
                {!isLogin && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.lightBlue,
                        backgroundColor: colors.lightestBlue,
                        color: colors.darkestBlue
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}40`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.backgroundColor = colors.lightestBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                      required={!isLogin}
                    />
                  </div>
                )}

                {/* Toggle Mode Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium transition-colors duration-200 hover:underline"
                    style={{ 
                      color: colors.darkBlue,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = colors.darkestBlue;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = colors.darkBlue;
                    }}
                  >
                    {isLogin ? "New user? SignUp" : "Already have an existing account?"}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4"
                  style={{
                    backgroundColor: colors.darkBlue,
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.darkestBlue;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.darkBlue;
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 4px ${colors.lightBlue}60`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isLogin ? "Login" : "SignUp"}
                </button>
              </form>

              {/* Additional Features */}
              <div className="mt-6 text-center">
                <p 
                  className="text-sm"
                  style={{ color: colors.mediumBlue }}
                >
                  By continuing, you agree to our{' '}
                  <a 
                    href="#" 
                    className="underline hover:no-underline transition-all duration-200"
                    style={{ color: colors.darkBlue }}
                  >
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
