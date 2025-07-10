import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Mail, Lock, Heart } from "lucide-react";
import { useAuthForm } from "../hooks/useAuthForm";
import FormInput from "../components/ui/FormInput";
import RoleSelector from "../components/Auth/RoleSelector";
import { ANIMATION_CONFIG } from "../constants/Auth.constants";

const Auth = () => {
  const {
    isLogin,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    errors,
    register,
    handleSubmit,
    watch,
    toggleMode,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRoleSelect,
  } = useAuthForm();

  const selectedRole = watch("role");

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightestBlue to-lightBlue flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-lightestBlue rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Welcome Section */}
            <WelcomeSection />
            
            {/* Form Section */}
            <div className="lg:flex-1 p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-md mx-auto"
              >
                {/* Mode Toggle */}
                <ModeToggle isLogin={isLogin} onToggle={toggleMode} />
                
                {/* Role Selectior */}
                <AnimatePresence>
                  {isLogin && (
                    <RoleSelector
                      selectedRole={selectedRole}
                      onRoleSelect={handleRoleSelect}
                      error={errors.role?.message}
                    />
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Signup-only fields */}
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        key="signup-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={ANIMATION_CONFIG.SMOOTH}
                        style={{ overflow: "hidden" }}
                        className="space-y-4"
                      >
                        <FormInput
                          {...register("userName")}
                          icon={User}
                          placeholder="Full Name"
                          error={errors.userName?.message}
                          required={!isLogin}
                          autoComplete="name"
                        />
                        
                        <FormInput
                          {...register("dateOfBirth")}
                          type="date"
                          icon={Calendar}
                          placeholder="Date of Birth"
                          error={errors.dateOfBirth?.message}
                          required={!isLogin}
                          autoComplete="bday"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email field */}
                  <FormInput
                    {...register("email")}
                    type="email"
                    icon={Mail}
                    placeholder="Email Address"
                    error={errors.email?.message}
                    required
                    autoComplete="email"
                  />

                  {/* Password field */}
                  <FormInput
                    {...register("password")}
                    type="password"
                    icon={Lock}
                    placeholder="Password"
                    error={errors.password?.message}
                    showPassword={showPassword}
                    onTogglePassword={togglePasswordVisibility}
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />

                  {/* Confirm Password for Signup */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormInput
                          {...register("confirmPassword")}
                          type="password"
                          icon={Lock}
                          placeholder="Confirm Password"
                          error={errors.confirmPassword?.message}
                          showPassword={showConfirmPassword}
                          onTogglePassword={toggleConfirmPasswordVisibility}
                          required={!isLogin}
                          autoComplete="new-password"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full bg-gradient-to-r from-darkBlue to-darkestBlue text-lightestBlue 
                      font-semibold py-3 px-6 rounded-lg transition-all duration-200 
                      shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 
                      focus:ring-darkBlue focus:ring-offset-2
                      ${isSubmitting 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:from-darkestBlue hover:to-darkBlue"
                      }
                    `}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    aria-label={
                      isSubmitting 
                        ? `${isLogin ? "Signing in" : "Creating account"}...` 
                        : isLogin ? "Sign In" : "Create Account"
                    }
                  >
                    {isSubmitting 
                      ? `${isLogin ? "Signing In" : "Creating Account"}...`
                      : isLogin ? "Sign In" : "Create Account"
                    }
                  </motion.button>
                </form>

                {/* Mode Switch Link */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={isSubmitting}
                    className="text-darkBlue hover:text-darkestBlue transition-colors text-sm disabled:opacity-50"
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
};

// Welcome Section Component
const WelcomeSection = () => (
  <div className="lg:flex-1 bg-gradient-to-br from-darkBlue to-darkestBlue text-lightestBlue p-8 lg:p-12 flex flex-col justify-center">
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="flex items-center mb-6">
        <Heart className="w-8 h-8 text-lightBlue mr-3" aria-hidden="true" />
        <h1 className="text-3xl lg:text-4xl font-bold">PharmaConnect</h1>
      </div>
      
      <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
        Welcome to your
        <span className="block text-lightBlue">Healthcare</span>
        <span className="block text-lightBlue">Assistance</span>
        <span className="block text-mediumBlue">platform</span>
      </h2>
      
      <p className="text-mediumBlue text-lg lg:text-xl mb-8 leading-relaxed">
        Your trusted companion for comprehensive healthcare management. 
        Connect with doctors, track your health, and get personalized care.
      </p>
      
      <div className="flex space-x-4">
        <div className="flex items-center text-lightBlue">
          <div className="w-2 h-2 bg-lightBlue rounded-full mr-2" aria-hidden="true" />
          <span className="text-sm">Secure & Private</span>
        </div>
        <div className="flex items-center text-lightBlue">
          <div className="w-2 h-2 bg-lightBlue rounded-full mr-2" aria-hidden="true" />
          <span className="text-sm">24/7 Support</span>
        </div>
      </div>
    </motion.div>
  </div>
);

// Mode Toggle Component
const ModeToggle = ({ isLogin, onToggle }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="relative bg-lightBlue rounded-full p-1" role="tablist">
      <motion.div
        className="absolute inset-y-1 bg-darkBlue rounded-full"
        animate={{
          x: isLogin ? 4 : "calc(100% - 4px)",
          width: "calc(50% - 4px)",
        }}
        transition={ANIMATION_CONFIG.SMOOTH}
        aria-hidden="true"
      />
      
      <button
        type="button"
        onClick={() => !isLogin && onToggle()}
        className={`
          relative z-10 px-8 py-3 rounded-full text-sm font-semibold 
          transition-colors focus:outline-none
          ${isLogin ? "text-lightestBlue" : "text-darkBlue"}
        `}
        role="tab"
        aria-selected={isLogin}
        aria-controls="auth-form"
      >
        Login
      </button>
      
      <button
        type="button"
        onClick={() => isLogin && onToggle()}
        className={`
          relative z-10 px-8 py-3 rounded-full text-sm font-semibold 
          transition-colors focus:outline-none 
          ${!isLogin ? "text-lightestBlue" : "text-darkBlue"}
        `}
        role="tab"
        aria-selected={!isLogin}
        aria-controls="auth-form"
      >
        Sign Up
      </button>
    </div>
  </div>
);

export default Auth;