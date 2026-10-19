import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { Search, Trash2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/global/Loaders/Loader";
import { allCountries } from "country-telephone-data";
import { LoaderIcon } from "lucide-react";
import axios from "axios";
// Example set of country codes (You can expand this or fetch from another source)
const COUNTRY_CODES = allCountries.map((country) => ({
  code: `+${country.dialCode}`,
  label: country.name,
}));

// Example set of countries (You can expand this list or fetch from an API)
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
// Example set of country codes for phone

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
};

// TruncatedText Component with Tooltip
const TruncatedText = ({ text, maxLength }) => {
  const isTruncated = text.length > maxLength;
  const displayText = truncateText(text, maxLength);

  return (
    <span
      className="truncate block"
      title={isTruncated ? text : ""}
      aria-label={isTruncated ? text : undefined}
    >
      {displayText}
    </span>
  );
};

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get company ID from URL params

  const [formData, setFormData] = useState({
    search: "",
    cvrNumber: "",
    companyName: "",
    att: "",
    address: "",
    addressLine: "",
    postalCode: "",
    city: "",
    country: "Denmark",
    email: "",
    // Separate phone country code and number
    phoneCountryCode: "+45", // default
    phoneNumber: "",
  });

  // Separate loading states
  const [isFetching, setIsFetching] = useState(false); // For fetching existing data
  const [isUpdating, setIsUpdating] = useState(false); // For updating data
  const [isSuspending, setIsSuspending] = useState(false); // For suspending company

  const [fetchError, setFetchError] = useState("");
  // Remove updateError and updateSuccess as we will use react-hot-toast
  const [suspendError, setSuspendError] = useState("");
  const [isLocked, setIsLocked] = useState(false); // Track if the company is locked
  // Stored country codes come as "45" (seed) or "+45" (admin); the select uses "+45".
  const [codeHasPlus, setCodeHasPlus] = useState(true);

  // Fetch existing company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsFetching(true);
      setFetchError("");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_KEY}/admin/companies/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch company data.");
        }

        const data = await response.json();
        const company = data.data.company; // Adjust based on your API response structure

        // Populate form with existing data
        const storedCode = company.phone?.countryCode ? String(company.phone.countryCode) : "+45";
        setCodeHasPlus(storedCode.startsWith("+"));
        setFormData({
          search: "",
          cvrNumber: company.cvr || "",
          companyName: company.companyName || "",
          att: company.att || "",
          address: company.address?.address || "",
          addressLine: company.address?.addressLine || "",
          postalCode: company.address?.postalCode || "",
          city: company.address?.city || "",
          country: company.address?.country || "Denmark",
          email: company.email || "",
          phoneCountryCode: storedCode.startsWith("+") ? storedCode : `+${storedCode}`,
          phoneNumber: company.phone?.number || "",
        });

        setIsLocked(company.locked || false); // Set lock status
      } catch (error) {
        console.error("Fetch Error:", error);
        setFetchError(error.message);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchCompanyData();
    } else {
      setFetchError("No company ID provided.");
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCompany = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Building the payload body
    const payload = {
      phone: {
        countryCode: codeHasPlus ? formData.phoneCountryCode : formData.phoneCountryCode.replace(/^\+/, ""),
        number: formData.phoneNumber,
      },
      email: formData.email,
      cvr: formData.cvrNumber,
      companyName: formData.companyName,
      address: {
        address: formData.address,
        addressLine: formData.addressLine,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
      },
      att: formData.att || "",
    };

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_KEY}/admin/companies/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );

      console.log("Company updated successfully:", data);
      toast.success("Company updated successfully!");

      // Optionally, navigate back or perform other actions
      // navigate("/admin/companies");
    } catch (error) {
      console.error("Update Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update company data.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };
  const handleSuspend = async () => {
    setIsSuspending(true);
    setSuspendError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/admin/companies/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
          body: JSON.stringify({ locked: true }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to suspend the company.");
      }

      const data = await response.json();
      console.log("Company suspended successfully:", data);
      setIsLocked(true); // Update lock status in UI
      // Use react-hot-toast for success
      toast.success("Company suspended successfully!");
    } catch (error) {
      console.error("Suspend Error:", error);
      // Use react-hot-toast for error
      toast.error(`Error: ${error.message}`);
      setSuspendError(error.message);
    } finally {
      setIsSuspending(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to companies list
    navigate("/admin/users");
  };

  return (
    <AdminContentLayout>
      {/* Add Toaster for react-hot-toast */}
      <Toaster position="top-right" />

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <h2 className="text-2xl font-semibold">Edit Company</h2>

        {/* Display Fetch Error */}
        {fetchError && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {fetchError}
          </div>
        )}

        {/* Form or Loader */}
        {isFetching ? (
          <div className="flex justify-center items-center py-6">
            <Loader />
          </div>
        ) : (
          !fetchError && (
            <form onSubmit={handleEditCompany} className="space-y-6">
              {/* Search Field with Icon */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={formData.search}
                      onChange={handleChange}
                      className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5 text-sm"
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div>

              {/* CVR Number */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="cvrNumber"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    CVR Number
                  </label>
                  <input
                    type="text"
                    id="cvrNumber"
                    name="cvrNumber"
                    value={formData.cvrNumber}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter CVR Number"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">
                  Company Information
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="companyName"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Company Name"
                    required
                  />
                </div>
              </div>

              {/* Att (Optional) */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="att"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Att
                  </label>
                  <input
                    type="text"
                    id="att"
                    name="att"
                    value={formData.att}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="(Optional) Attention / Att"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Address</h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="address"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Address"
                    required
                  />
                </div>
              </div>

              {/* Address Line */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="addressLine"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Address Line
                  </label>
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Address Line"
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="postalCode"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Postal Code"
                  />
                </div>
              </div>

              {/* City */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="city"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter City"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="country"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-[#3090B6] focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    required
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Contact Details</h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="email"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Email"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Section */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label
                    htmlFor="phoneNumber"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light"
                  >
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 w-full">
                    <select
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                      required
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 text-sm"
                      placeholder="Enter Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-4 py-2 bg-[#3CB4E4] text-white rounded-md hover:bg-[#3090B6] ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUpdating ? "Updating..." : "Update Company"}
                </button>
                {/* Uncomment the Suspend button if needed */}
                {/* <button
                                    type="button"
                                    onClick={handleSuspend}
                                    disabled={isLocked || isSuspending}
                                    className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                                        isLocked || isSuspending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {isSuspending
                                        ? "Suspending..."
                                        : isLocked
                                            ? "Already Suspended"
                                            : "Suspend"}
                                </button> */}
              </div>
            </form>
          )
        )}
      </div>
    </AdminContentLayout>
  );
};

export default EditCompany;
