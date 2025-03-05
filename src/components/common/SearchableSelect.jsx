import React, { useState, useRef, useEffect } from "react";

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  label,
  searchPlaceholder = "Search...",
  isColor = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(
    (opt) => opt.value === value || opt === value
  );

  const groupedOptions = isColor
    ? options.reduce((acc, option) => {
        if (!acc[option.category]) {
          acc[option.category] = [];
        }
        acc[option.category].push(option);
        return acc;
      }, {})
    : null;

  // Sanitize search term to handle special characters
  const sanitizeSearchTerm = (term) => {
    // Remove special characters from search term
    return term.replace(/[/_\-]/g, "");
  };

  // Handle input change - allow all characters
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = isColor
    ? Object.entries(groupedOptions || {}).reduce(
        (acc, [category, categoryOptions]) => {
          const filtered = categoryOptions.filter((option) => {
            // Remove special characters from both search text and option text
            const searchableText = `${option.label} ${option.value}`
              .toLowerCase()
              .replace(/[/_\-]/g, "");
            const sanitizedSearchTerm = sanitizeSearchTerm(
              searchTerm.toLowerCase()
            );
            return searchableText.includes(sanitizedSearchTerm);
          });
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        },
        {}
      )
    : options.filter((option) => {
        const optionLabel = (option.label || option)
          .toLowerCase()
          .replace(/[/_\-]/g, "");
        const optionValue = (option.value || option)
          .toLowerCase()
          .replace(/[/_\-]/g, "");
        const sanitizedSearchTerm = sanitizeSearchTerm(
          searchTerm.toLowerCase()
        );
        return (
          optionLabel.includes(sanitizedSearchTerm) ||
          optionValue.includes(sanitizedSearchTerm)
        );
      });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option.value || option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const renderColorOptions = () => {
    return Object.entries(filteredOptions).map(
      ([category, categoryOptions]) => (
        <div key={category}>
          <div className="sticky top-0 bg-background_main_surface px-3 py-1.5 text-text_main_medium">
            {category}
          </div>
          {categoryOptions.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                className={`cursor-pointer w-full select-none relative py-2 pl-3 pr-9 hover:bg-button_filled_style_1_surface_default ${
                  isSelected
                    ? "bg-button_filled_style_1_surface_default text-button_filled_style_1_text_default"
                    : "text-text_main_high"
                }`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center">
                  <div
                    className={`shrink-0 w-4 h-4 rounded mr-2 border border-border_main_default bg-${option.value}`}
                  />
                  <span
                    className={`block truncate ${
                      isSelected ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-button_filled_style_1_text_default">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )
    );
  };
  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-text_main_high  mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full bg-background_main_surface border border-border_main_default rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-button_filled_style_1_surface_default focus:border-button_filled_style_1_surface_default sm:text-sm ${className}`}
      >
        {isColor && selectedOption ? (
          <div className="flex items-center">
            <div
              className={`shrink-0 w-4 h-4 rounded mr-2 border border-border_main_default bg-${selectedOption.value}`}
            />
            <span className="text-text_main_high truncate">
              {selectedOption.label}
            </span>
          </div>
        ) : (
          <span className="block truncate text-text_main_high">
            {selectedOption
              ? selectedOption.label || selectedOption
              : placeholder}
          </span>
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-text_main_medium"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-background_main_surface shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-border_main_default ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="sticky top-0 z-10 bg-background_main_surface px-2 py-1.5">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full p-2 border-border_main_default rounded-md shadow-sm focus:ring-button_filled_style_1_surface_default focus:border-button_filled_style_1_surface_default sm:text-sm"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="pt-1">
            {isColor ? (
              Object.keys(filteredOptions || {}).length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-text_main_medium">
                  No results found
                </div>
              ) : (
                renderColorOptions()
              )
            ) : filteredOptions.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-text_main_medium">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const optionValue = option.value || option;
                return (
                  <div
                    key={optionValue}
                    className={`cursor-pointer shrink-0 select-none relative py-2 pl-3 pr-9 hover:bg-button_filled_style_1_surface_default ${
                      value === optionValue
                        ? "bg-button_filled_style_1_surface_default text-button_filled_style_1_text_default"
                        : "text-text_main_high"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <span
                      className={`block truncate ${
                        value === optionValue ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {option.label || option}
                    </span>
                    {value === optionValue && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-button_filled_style_1_text_default">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
