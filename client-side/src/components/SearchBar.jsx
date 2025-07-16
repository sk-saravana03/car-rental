import React, { useState, useEffect, useRef } from "react";
import "../styles/SearchBar.css"
const SearchBar = ({ onSearch = () => {}, onSelectCar }) => {  // Default empty function
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "/") {
                event.preventDefault();
                searchRef.current.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (query.trim() === "") {
            setSuggestions([]);
            return;
        }
        const fetchSuggestions = async () => {
            try {
                const response = await fetch(`/api/cars/search?name=${query}`);
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };
        fetchSuggestions();
    }, [query]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);  // No error now
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            handleSelect(suggestions[selectedIndex]);
        }
    };

    const handleSelect = (car) => {
        setQuery(car.model);
        setSuggestions([]);
        if (onSelectCar) onSelectCar(car);
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                ref={searchRef}
                className="search-bar"
                placeholder="Search cars..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            {suggestions.length > 0 && (
                <ul className="search-suggestions">
                    {suggestions.map((car, index) => (
                        <li
                            key={car._id}
                            className={index === selectedIndex ? "selected" : ""}
                            onClick={() => handleSelect(car)}
                        >
                            {car.brand} {car.model} ({car.year})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
