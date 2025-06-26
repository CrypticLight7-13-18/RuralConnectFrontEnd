import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Stethoscope, Mail, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Nav";
import { login , signup } from "../services/auth";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isLogin) {
        res = await login({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        console.log("Login response:", res);
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        res = await signup({
          name: formData.userName,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.confirmPassword,
          role: "patient",
        });

        console.log("Signup response:", res);
      }

      const role = res?.user?.role;

      if (role === "doctor") {
        navigate("/appointmentsDoctor");
      } else {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Welcome Section */}
            <div className="lg:flex-1 bg-gradient-to-br from-slate-600 to-slate-800 text-white p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-red-400 mr-3" />
                  <h1 className="text-3xl lg:text-4xl font-bold">PharmaConnect</h1>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Welcome to your
                  <span className="block text-blue-200">Healthcare</span>
                  <span className="block text-blue-200">Assistance</span>
                  <span className="block text-slate-300">platform</span>
                </h2>
                
                <p className="text-slate-300 text-lg lg:text-xl mb-8 leading-relaxed">
                  Your trusted companion for comprehensive healthcare management. 
                  Connect with doctors, track your health, and get personalized care.
                </p>
                
                <div className="flex space-x-4">
                  <div className="flex items-center text-blue-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm">Secure & Private</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:flex-1 p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-md mx-auto"
              >
                {/* Login/Signup Toggle */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative bg-slate-100 rounded-full p-1">
                    <motion.div
                      className="absolute inset-y-1 bg-slate-600 rounded-full"
                      animate={{
                        x: isLogin ? 4 : "calc(100% - 4px)",
                        width: isLogin ? "calc(50% - 4px)" : "calc(50% - 4px)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
                        isLogin ? "text-white" : "text-slate-600"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={toggleMode}
                      className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
                        !isLogin ? "text-white" : "text-slate-600"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Role Selection (Login Only) */}
                <AnimatePresence>
                  {isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <p className="text-slate-600 text-sm mb-3 font-medium">I am a:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          onClick={() => handleRoleSelect("patient")}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            formData.role === "patient"
                              ? "border-slate-600 bg-slate-50 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <User className={`w-6 h-6 mx-auto mb-2 ${
                            formData.role === "patient" ? "text-slate-600" : "text-slate-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.role === "patient" ? "text-slate-700" : "text-slate-500"
                          }`}>
                            Patient
                          </span>
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          onClick={() => handleRoleSelect("doctor")}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            formData.role === "doctor"
                              ? "border-slate-600 bg-slate-50 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${
                            formData.role === "doctor" ? "text-slate-600" : "text-slate-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.role === "doctor" ? "text-slate-700" : "text-slate-500"
                          }`}>
                            Doctor
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="userName"
                            placeholder="Full Name"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-200"
                            required={!isLogin}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-200"
                          required={!isLogin}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-slate-600 hover:text-slate-800 transition-colors text-sm"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}