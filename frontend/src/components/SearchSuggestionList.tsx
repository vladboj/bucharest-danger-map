import { Location } from "@shared/types";

type SearchSuggestionListProps = {
  suggestions: Location[];
  highlightedIndex: number;
  onSuggestionClick: (suggestion: Location) => void;
};

const SearchSuggestionList = ({
  suggestions,
  highlightedIndex,
  onSuggestionClick,
}: SearchSuggestionListProps) => {
  return suggestions.length === 0 ? (
    <div className="cursor-default text-center select-none">Nothing found.</div>
  ) : (
    <ul>
      {suggestions.map((suggestion, index) => (
        <li
          className={`cursor-pointer rounded-xl px-3 py-1 ${
            index === highlightedIndex ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion.display_name}
        </li>
      ))}
    </ul>
  );
};

export default SearchSuggestionList;
