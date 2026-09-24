import { useState } from "react";

function PasswordInput({ id, className = "", ...inputProps }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-input-wrapper">
      <input
        {...inputProps}
        id={id}
        type={isVisible ? "text" : "password"}
        className={`form-control password-input ${className}`}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={
          isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        <span aria-hidden="true">{isVisible ? "🙈" : "👁️"}</span>
      </button>
    </div>
  );
}

export default PasswordInput;
