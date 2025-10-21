import { useState, useEffect, useRef } from "react";
import { Search, X, LoaderCircle } from "lucide-react";
import IconButton from "./IconButton";
import Card from "./Card";
import SearchSuggestionList from "./SearchSuggestionList";
import { fetchSuggestions } from "../services/geocode.service";
import { Location } from "@shared/types";

type SearchBoxProps = {
  className?: string;
  isProcessingSuggestion?: boolean;
  onSelectSuggestion: (lat: number, lon: number) => void;
};

const NO_SUGGESTIONS_LIMIT = 5;

const SearchBox = ({
  className = "",
  isProcessingSuggestion = false,
  onSelectSuggestion,
}: SearchBoxProps) => {
  const [inputValue, setInputValue] = useState("");
  const [originalInputValue, setOriginalInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Location[] | null>(null);
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] =
    useState<number>(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = isLoadingSuggestions || isProcessingSuggestion;

  // Auto-dismiss error after 4 seconds
  useEffect(() => {
    if (searchError) {
      const timer = setTimeout(() => {
        setSearchError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [searchError]);

  // Set up '/' to focus the searchbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only focus if no inputs are already focused
      const isTyping =
        document.activeElement && document.activeElement.tagName === "INPUT";
      if (!isTyping && e.key === "/") {
        e.preventDefault(); // Prevent typing `/` in random spots
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when loading completes
  useEffect(() => {
    if (!isLoadingSuggestions) {
      inputRef.current?.focus();
    }
  }, [isLoadingSuggestions]);

  const handleClearInput = () => {
    if (isLoading) return; // Prevent clearing while loading

    setInputValue("");
    setOriginalInputValue("");
    setSuggestions(null);
    setHighlightedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return; // Prevent changes while loading

    setInputValue(event.target.value);
    setSuggestions(null);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isLoading) return; // Prevent any keyboard actions while loading

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        suggestions &&
        highlightedSuggestionIndex >= 0 &&
        highlightedSuggestionIndex < suggestions.length
      ) {
        const selected = suggestions[highlightedSuggestionIndex];
        handleSuggestionClick(selected);
        setHighlightedSuggestionIndex(-1);
      } else if (inputValue.trim()) {
        setIsLoadingSuggestions(true);
        setSearchError(null);
        try {
          const fetchedSuggestions = await fetchSuggestions(
            inputValue,
            NO_SUGGESTIONS_LIMIT,
          );
          setSuggestions(fetchedSuggestions);
          setOriginalInputValue(inputValue);
        } catch (err) {
          setSearchError("Failed to search locations. Please try again.");
        } finally {
          setIsLoadingSuggestions(false);
        }
      }
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!suggestions || suggestions.length === 0) return;

      const movingDown = event.key === "ArrowDown";
      const nextIndex = (() => {
        if (movingDown) {
          if (highlightedSuggestionIndex === suggestions.length - 1) return -1;
          return highlightedSuggestionIndex + 1;
        } else {
          if (highlightedSuggestionIndex === -1) return suggestions.length - 1;
          return highlightedSuggestionIndex - 1;
        }
      })();

      setHighlightedSuggestionIndex(nextIndex);

      if (nextIndex === -1) {
        // Focus input and restore original value
        inputRef.current?.focus();
        setInputValue(originalInputValue);
      } else {
        setInputValue(suggestions[nextIndex].display_name);
      }
    }
  };

  const handleSuggestionClick = (suggestion: Location) => {
    if (isLoading) return;

    setInputValue(suggestion.display_name);
    setSuggestions(null);
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    onSelectSuggestion(lat, lon);
  };

  // Determine the appropriate placeholder and loading message
  const getPlaceholder = () => {
    if (isProcessingSuggestion) return "Processing location...";
    if (isLoadingSuggestions) return "Searching...";
    return "Search for streets in Bucharest";
  };

  return (
    <>
      {/* Error banner at top center of screen */}
      {searchError && (
        <div className="fixed top-4 left-1/2 z-[1001] -translate-x-1/2 transform rounded-lg border border-red-300 bg-red-100 px-4 py-3 shadow-lg">
          <div className="text-sm font-medium text-red-600">{searchError}</div>
        </div>
      )}

      <Card
        className={`flex w-1/4 flex-col gap-3 ${className}`}
        rounded={suggestions === null ? "rounded-full" : "rounded-xl"}
      >
        <div className="flex justify-between gap-3">
          <Search />

          <input
            className={`flex-1 outline-none ${isLoading ? "cursor-not-allowed text-gray-500" : ""}`}
            ref={inputRef}
            type="search"
            value={inputValue}
            placeholder={getPlaceholder()}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
          />

          <IconButton
            icon={isLoading ? <LoaderCircle className="animate-spin" /> : <X />}
            label="Clear Input"
            title="Clear"
            disabled={isLoading}
            onClick={handleClearInput}
          />
        </div>

        {suggestions !== null && (
          <>
            <hr className="border-t border-gray-300" />

            <SearchSuggestionList
              suggestions={suggestions}
              highlightedIndex={highlightedSuggestionIndex}
              onSuggestionClick={handleSuggestionClick}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default SearchBox;
