import { motion } from "framer-motion";
import { User, Stethoscope } from "lucide-react";
import { USER_ROLES } from "../../constants/Auth.constants.js";

const roleConfig = {
  [USER_ROLES.PATIENT]: {
    icon: User,
    label: "Patient",
    description: "Get healthcare assistance",
  },
  [USER_ROLES.DOCTOR]: {
    icon: Stethoscope,
    label: "Doctor",
    description: "Provide medical care",
  },
};

const RoleSelector = ({ selectedRole, onRoleSelect, error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
        <legend className="text-darkBlue text-sm mb-3 font-medium">
          I am a: <span className="text-darkBlue"></span>
        </legend>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(roleConfig).map(([roleKey, config]) => {
            const { icon: Icon, label, description } = config;
            const isSelected = selectedRole === roleKey;
            
            return (
              <motion.button
                key={roleKey}
                type="button"
                onClick={() => onRoleSelect(roleKey)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 
                  focus:outline-none
                  ${
                    isSelected
                      ? "border-darkBlue bg-lightestBlue shadow-md"
                      : "border-lightBlue hover:border-mediumBlue"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                // aria-pressed={isSelected}
                aria-describedby={`role-${roleKey}-desc`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    isSelected ? "text-darkBlue" : "text-mediumBlue"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`block text-sm font-medium ${
                    isSelected ? "text-darkestBlue" : "text-mediumBlue"
                  }`}
                >
                  {label}
                </span>
                <span
                  id={`role-${roleKey}-desc`}
                  className="sr-only"
                >
                  {description}
                </span>
              </motion.button>
            );
          })}
        </div>
        
        {error && (
          <p className="text-red-500 text-xs mt-2" role="alert">
            {error}
          </p>
        )}
    </motion.div>
  );
};

export default RoleSelector;