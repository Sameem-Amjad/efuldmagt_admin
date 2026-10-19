import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import axios from "axios";



export default function CompanySearchBar({ className, setSelectedCompany }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // const axiosInstance = getAxiosInstance();
    const containerRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (!containerRef.current?.contains(e.target)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

const searchCompanies = async (query) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const isNumber = /^\d+$/.test(query);
        const queryParam = isNumber ? 'number' : 'name';

        // Only search if: 8 digits for CVR or 3+ chars for name
        if (!((isNumber && query.length === 8) || (!isNumber && query.length >= 3))) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Authentication token not found.");
                setIsLoading(false);
                return;
            }
            const url = `${import.meta.env.VITE_API_KEY}/general/check-cvr-by-name-or-number-by-admin?${queryParam}=${query}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = response.data;
            let allCompanies = [];

            if (responseData) {
                allCompanies.push({
                    ...responseData,
                    id: responseData.vat,
                    name: `${responseData.name} - CVR: ${responseData.vat}`,
                });

                if (responseData.productionunits && Array.isArray(responseData.productionunits)) {
                    const productionUnits = responseData.productionunits.map(unit => ({
                        ...unit,
                        id: unit.pno,
                        name: `${unit.name} (${unit.city}) - P-nr: ${unit.pno}`,
                        vat: responseData.vat,
                    }));
                    allCompanies.push(...productionUnits);
                }
            }

            setResults(allCompanies);
        } catch (error) {
            console.error("Failed to fetch company suggestions:", error);
            setResults([]);
        }

        setIsLoading(false);
    };

    const debouncedSearch = useRef(debounce(searchCompanies, 300)).current;

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);
        setFocusedIndex(-1);
        debouncedSearch(value);
    };

    const handleSelect = (company) => {
        setSelectedCompany(company);
        setSearchTerm(company.name);
        setResults([]);
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const handleClear = () => {
        setSearchTerm("");
        setResults([]);
        setIsOpen(false);
        setFocusedIndex(-1);
        setSelectedCompany(null);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) => 
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (focusedIndex >= 0 && results[focusedIndex]) {
                    handleSelect(results[focusedIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setFocusedIndex(-1);
                break;
        }
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Search Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm"
                    placeholder="Search by 8-digit CVR or Company Name"
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => searchTerm && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                
                {/* Search Icon or Clear Button */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {searchTerm ? (
                        <button
                            onClick={handleClear}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            aria-label="Clear search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-auto z-50 animate-fadeIn">
                    {isLoading && (
                        <div className="p-4 text-gray-500 text-sm flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching...
                        </div>
                    )}

                    {!isLoading && results.length === 0 && searchTerm.trim() !== "" && (
                        <div className="p-3 text-gray-500 text-sm text-center">
                            No companies found
                        </div>
                    )}

                    {!isLoading && results.map((company, index) => (
                        <div
                            key={company.id}
                            className={`p-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-150 ${
                                focusedIndex === index
                                    ? "bg-blue-50"
                                    : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleSelect(company)}
                            onMouseEnter={() => setFocusedIndex(index)}
                        >
                            <div className="font-medium text-gray-900">{company.name}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add custom animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}