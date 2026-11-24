import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordInput({ id, className = "", ...inputProps }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...inputProps}
        id={id}
        type={isVisible ? "text" : "password"}
        className={`field !pr-12 ${className}`}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-md hover:bg-yellow"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={
          isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        {isVisible ? (
          <EyeOff className="size-5" aria-hidden="true" />
        ) : (
          <Eye className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
