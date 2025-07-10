import { forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormInput = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      type = "text",
      showPassword,
      onTogglePassword,
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = `input-${props.name || Math.random().toString(36).substr(2, 9)}`;
    const errorId = `error-${inputId}`;
    
    return (
      <div className="relative">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-darkBlue mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <Icon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mediumBlue"
              aria-hidden="true"
            />
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={type === "password" && showPassword ? "text" : type}
            className={`
              w-full pl-10 pr-4 py-3 border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-transparent 
              transition-all duration-200 bg-lightestBlue text-darkestBlue
              ${error ? "border-red-500" : "border-lightBlue"}
              ${type === "password" ? "pr-12" : "pr-4"}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            required={required}
            {...props}
          />
          
          {type === "password" && onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mediumBlue hover:text-darkBlue transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p 
            id={errorId}
            className="text-red-500 text-xs mt-1"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;