import { useEffect, useRef, useState } from "react";
import { searchAddress } from "../utils/addressApi";

const DEBOUNCE_DELAY_MS = 300;

function AddressAutocomplete({ id, initialValue = "", onSelect }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const debounceTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(debounceTimeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  function handleInputChange(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setErrorMessage("");

    window.clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = window.setTimeout(async () => {
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);

      try {
        const results = await searchAddress(nextQuery, abortController.signal);
        setSuggestions(results);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage("Recherche d'adresse indisponible pour le moment.");
        }
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);
  }

  function handleSuggestionSelect(suggestion) {
    setQuery(suggestion.label);
    setSuggestions([]);
    onSelect(suggestion.label);
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        className="field"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls="address-suggestions-list"
        aria-autocomplete="list"
        placeholder="Commence à taper ton adresse..."
        value={query}
        onChange={handleInputChange}
      />

      {isLoading ? (
        <p className="mt-1.5 text-xs font-semibold text-ink-muted">
          Recherche en cours…
        </p>
      ) : null}

      {errorMessage ? <p className="alert-error mt-2">{errorMessage}</p> : null}

      {suggestions.length > 0 ? (
        <ul
          id="address-suggestions-list"
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border-3 border-ink bg-white text-ink shadow-brutal"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} role="option" aria-selected="false">
              <button
                type="button"
                className="w-full border-b-2 border-ink/10 px-4 py-2.5 text-left text-sm font-semibold hover:bg-yellow focus-visible:bg-yellow"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default AddressAutocomplete;
