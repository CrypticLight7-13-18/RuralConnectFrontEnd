//Login Page,Signup Page only 
import { useState } from 'react';
import { SessionUData } from '../assets/uasd';
import Navbar from './Nav';

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
    // Abdul's backend integration
    SessionUData.name = formData.userName
    SessionUData.role = "Patient"
    SessionUData.reports = {gaw:"asd",gim:"sss"}
    console.log(SessionUData)
    e.preventDefault();
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
  <div className="min-h-screen bg-cyan-400 text-white flex flex-col">
    <Navbar />

    <div className="flex-grow flex items-center justify-center">
      <div className="max-h-3/4 bg-green-300 text-white flex m-auto border-orange-100 border-[10px] rounded-md">
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gray-500">Welcome to your</span>
              <br />
              <span className="text-white">Healthcare</span>
              <br />
              <span className="text-white">Assistance</span>
              <br />
              <span className="text-gray-500">platform</span>
            </h1>
            <p className="text-gray-700 text-lg mt-6">
              One stop and best solution for your healthcare needs and benefits
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className={isLogin ? 'text-white' : 'text-gray-500'}>Login</span>
              <span className="text-gray-500">/</span>
              <span className={!isLogin ? 'text-white' : 'text-gray-500'}>SignUp</span>
            </h2>

            <div className="space-y-6">
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    name="userName"
                    placeholder="User Name"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:border-white focus:outline-none transition-colors"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:border-white focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder={isLogin ? "Password" : "Enter password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:border-white focus:outline-none transition-colors"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:border-white focus:outline-none transition-colors"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-gray-700 hover:text-white transition-colors mb-4"
                >
                  {isLogin ? "New user? SignUp" : "Already have an existing account?"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-white text-black font-semibold py-4 px-6 rounded-full hover:bg-gray-200 transition-colors text-lg"
              >
                {isLogin ? "Login" : "SignUp"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
