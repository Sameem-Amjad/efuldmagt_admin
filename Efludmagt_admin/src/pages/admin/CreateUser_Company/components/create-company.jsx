import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { useEffect, useState } from "react"; // Import useState
import { allCountries } from "country-telephone-data";
import { useNavigate } from "react-router-dom";
import { resetCompanyState } from "@/redux/features/company/Companyslice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createNewCompany } from "@/redux/features/company/CompanyThunk";
import parsePhoneNumber from "libphonenumber-js"; // Import libphonenumber

import CompanySearchBar from "./companySearchBar";

const allCountryData = allCountries.map((country) => ({
  name: country.name.split(" (")[0], // Stripping native names
  code: `+${country.dialCode}`,
  iso: country.iso2,
  uniqueKey: `+${country.dialCode}-${country.iso2}`,
}));

const COUNTRY_CODES = allCountryData;
const COUNTRIES = [...new Set(allCountryData.map((country) => country.name))].sort();

const validationSchema = Yup.object({
  cvrNumber: Yup.string()
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .length(8, "CVR number must be exactly 8 digits")
    .required("CVR number is required"),
  companyName: Yup.string().required("Company name is required"),
  address: Yup.string().required("Address is required"),
  addressLine: Yup.string().required("Address line is required"),
  postalCode: Yup.string()
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .required("Postal code is required"),
  city: Yup.string().required("City is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]*$/, "No spaces and character allowed Only Numbers")
    .required("Phone number is required"),
});

const CreateCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.company);

  // State to hold the company selected from the search bar
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Handle errors from Redux state
  useEffect(() => {
    if (error) {
      const errorMessage = error?.message || "An unknown error occurred.";
      toast.error(errorMessage);
      dispatch(resetCompanyState());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      cvrNumber: "",
      companyName: "",
      att: "",
      address: "",
      addressLine: "",
      postalCode: "",
      city: "",
      country: allCountryData.find((c) => c.iso === "dk")?.name || "Denmark",
      email: "",
      phoneCountryCode: "+45",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCreateCompany(values);
    },
  });

  // This useEffect triggers when a company is selected from the search bar
  useEffect(() => {
    if (selectedCompany) {
      // Parse phone number if it exists
      const parsedPhone = selectedCompany.phone
        ? parsePhoneNumber(String(selectedCompany.phone), "DK")
        : null;

      // Use setValues with a functional update to populate the form
      // This merges new data with any existing values
      formik.setValues(currentValues => ({
        ...currentValues, // Keep existing values (like 'att' if user typed it)
        cvrNumber: selectedCompany.vat || "",
        companyName: (selectedCompany.name || "").split(" - ")[0], // Clean up name
        address: selectedCompany.address || "",
        addressLine: selectedCompany.addressco || "", // Map 'addressco' to 'addressLine'
        postalCode: String(selectedCompany.zipcode || ""), // Ensure postal code is a string
        city: selectedCompany.city || "",
        country: allCountryData.find((c) => c.iso === "dk")?.name || "Denmark", // Default to Denmark
        email: selectedCompany.email || "",
        phoneCountryCode: parsedPhone ? `+${parsedPhone.countryCallingCode}` : "+45",
        phoneNumber: parsedPhone ? parsedPhone.nationalNumber : "",
      }));
    }
  }, [selectedCompany, formik.setValues]); // Dependency: only run when selectedCompany changes

  const handleCreateCompany = async (values) => {
    const payload = {
      phone: { countryCode: values.phoneCountryCode, number: values.phoneNumber },
      email: values.email,
      cvr: values.cvrNumber,
      companyName: values.companyName,
      address: {
        address: values.address,
        addressLine: values.addressLine,
        postalCode: values.postalCode,
        city: values.city,
        country: values.country,
      },
    };

    try {
      await dispatch(createNewCompany(payload)).unwrap();

      toast.success("Company created successfully");
      formik.resetForm();
      navigate("/admin/users");
    } catch (err) {
      // Error is handled by useEffect watching Redux state
      console.error("Error creating company:", err);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    navigate("/admin/CreateUserOrCompany");
  };

  return (
    <AdminContentLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <h2 className="text-2xl font-semibold">Create Company</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* == MODIFIED BLOCK: Replaced CVR Input with CompanySearchBar == */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Search Company
              </span>
              <div className="w-full">
                {/* The CompanySearchBar component */}
                <CompanySearchBar setSelectedCompany={setSelectedCompany} />

                {/* We keep the CVR error message. 
                  If the user tries to submit without selecting a company,
                  this validation will catch it.
                */}
                {formik.touched.cvrNumber && formik.errors.cvrNumber ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.cvrNumber}</div>
                ) : null}
              </div>
            </div>
          </div>


          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Company Information</h3>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Company Name
              </span>
              <div className="w-full">
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyName}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Company Name"
                />
                {formik.touched.companyName && formik.errors.companyName ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.companyName}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Att
              </span>
              <input
                type="text"
                id="att"
                name="att"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.att}
                className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                placeholder="(Optional) Attention / Att"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Address</h3>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Address
              </span>
              <div className="w-full">
                <input
                  type="text"
                  id="address"
                  name="address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Address"
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Address Line
              </span>

              {/* ✅ START FIX: Add this wrapper div */}
              <div className="w-full">
                <input
                  type="text"
                  id="addressLine"
                  name="addressLine"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.addressLine}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Address Line"
                />
                {formik.touched.addressLine && formik.errors.addressLine ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.addressLine}
                  </div>
                ) : null}
              </div>

            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Postal Code
              </span>
              <div className="w-full">
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Postal Code"
                />
                {formik.touched.postalCode && formik.errors.postalCode ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.postalCode}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                City
              </span>
              <div className="w-full">
                <input
                  type="text"
                  id="city"
                  name="city"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter City"
                />
                {formik.touched.city && formik.errors.city ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Country
              </span>
              <select
                id="country"
                name="country"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                className="rounded-md bg-gray-50 border border-gray-300 text-[#3090B6] focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Contact Details</h3>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Email
              </span>
              <div className="w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Email"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <span className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md md:rounded-none md:rounded-s-md w-full md:w-48 font-light">
                Phone Number
              </span>
              <div className="w-full">
                <div className="flex items-center gap-2 w-full">
                  <select
                    name="phoneCountryCode"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneCountryCode}
                    className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none"
                  >
                    {COUNTRY_CODES.map((cc) => (
                      <option key={cc.uniqueKey} value={cc.code}>{cc.code}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Phone Number"
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                ) : null}
              </div>
            </div>
          </div>

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
              disabled={loading}
              className="px-4 py-2 bg-[#3CB4E4] text-white rounded-md hover:bg-[#3090B6]"
            >
              {loading ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </AdminContentLayout>
  );
};

export default CreateCompany;