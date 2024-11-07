import React, {useState} from "react";

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
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar por nome do setores..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={handleSearch}>Buscar</button>
      </div>
    );
  };
  
  export default SearchBar;