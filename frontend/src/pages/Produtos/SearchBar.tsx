import React, {useState} from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    onSearch: (query: string) => void;
  }
  
  const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
  
    const handleSearch = () => {
      onSearch(query);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
  
    return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar produto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {/* <button className="search-button" onClick={handleSearch}>
        BUSCAR
      </button> */}
    </div>
    
    );
  };
  
  export default SearchBar;