import Loader from "@/components/global/Loaders/Loader";
import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { useMemo } from "react";
import { allCountries } from 'country-telephone-data';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { createUser, resetUserState } from '@/redux/features/userSlice';
import countryList from 'country-list';
import toast from "react-hot-toast";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const CreateUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required"),
  lastName: Yup.string()
    .required("Last Name is required"),
  address: Yup.string()
    .required("Address is required"),
  addressLine: Yup.string(), // Optional
  postalCode: Yup.string()
    .required("Postal Code is required"),
  city: Yup.string()
    .required("City is required"),
  country: Yup.string()
    .required("Country selection is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneCountryCode: Yup.string()
    .required("Code is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits"),
  pin: Yup.string()
    .length(4, "PIN must be exactly 4 digits")
    .matches(/^[0-9]{4}$/, "PIN must be 4 digits and numeric")
    .required("PIN is required"),
});

// Country Codes (unchanged)
const COUNTRY_CODES = allCountries.map(country => ({
  code: `+${country.dialCode}`,
  label: country.name,
  uniqueKey: `+${country.dialCode}-${country.iso2}`,
}));


// 2. Custom Formik Input Component (for re-use and consistent error display)
const FormikInput = ({ label, name, type = 'text', placeholder, maxLength, required, ...props }) => (
  <Field name={name}>
    {({ field, meta }) => {
      // Check if the current field should show an error
      const hasError = meta.touched && meta.error;
      const isRequired = required || (CreateUserSchema.fields[name] && CreateUserSchema.fields[name].tests.some(test => test.name === 'required'));

      return (
        <div className="flex-1">
          <label htmlFor={name} className="block text-sm font-normal mb-2">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`rounded-md bg-gray-50 border ${hasError ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm`}
            {...props}
          />
          {hasError ? (
            <div className="text-red-500 text-xs mt-1">{meta.error}</div>
          ) : null}
        </div>
      );
    }}
  </Field>
);


// 3. Main Component Refactor
export default function CreatePrivateUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // We keep 'loading' from Redux to disable the button globally
  const { loading } = useSelector((state) => state.user);

  const countries = useMemo(() => {
    return countryList.getData();
  }, []);

  // Initial Formik values (matches the field names and default values)
  const initialValues = {
    firstName: "",
    lastName: "",
    address: "",
    addressLine: "",
    postalCode: "",
    city: "",
    country: "Denmark", 
    email: "",
    phoneCountryCode: "+45", 
    phoneNumber: "",
    pin: "",
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Redux loading state is used globally, but Formik's setSubmitting is still useful
    setSubmitting(true); 

    const payload = {
      email: values.email,
      phone: {
        countryCode: values.phoneCountryCode,
        number: values.phoneNumber,
      },
      pin: values.pin,
      name: {
        firstName: values.firstName,
        lastName: values.lastName,
      },
      address: {
        address: values.address,
        addressLine: values.addressLine,
        postalCode: values.postalCode,
        city: values.city,
        country: values.country,
      },
    };

    dispatch(createUser(payload))
      .unwrap()
      .then(() => {
        toast.success("User created successfully");
        resetForm();
        dispatch(resetUserState());
        navigate("/admin/users");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        toast.error(`Error: ${error?.message || "Failed to create user"}`);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCancel = () => {
    navigate("/admin/CreateUserOrCompany");
  };

  return (
    <AdminContentLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <a
          onClick={handleCancel}
          className="flex items-center text-black mb-6 no-underline cursor-pointer"
        >
          <span className="mr-2 text-lg">←</span>
          <span className="text-lg">Create new users</span>
        </a>
        
        {/* 4. FORM WRAPPER */}
        <Formik
          initialValues={initialValues}
          validationSchema={CreateUserSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              
              {/* Full Name Section */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Full Name</h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <FormikInput label="First Name" name="firstName" placeholder="Enter First Name" required />
                  <FormikInput label="Last Name" name="lastName" placeholder="Enter Last Name" required />
                </div>
              </div>

              {/* Address Section */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Address</h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <FormikInput label="Address" name="address" placeholder="Enter Address" required />
                  <FormikInput label="(Optional) Extra Info" name="addressLine" placeholder="Enter Additional Address Info" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                  <FormikInput label="Postal Code" name="postalCode" placeholder="Enter Postal Code" required />
                  <FormikInput label="City" name="city" placeholder="Enter City" required />
                </div>
                <div className="mt-4">
                  <label htmlFor="country" className="block text-sm font-normal mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  {/* Country Select Field */}
                  <Field
                    as="select"
                    id="country"
                    name="country"
                    className={`rounded-md bg-gray-50 border ${touched.country && errors.country ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm`}
                  >
                    <option value="" disabled>Select a country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  {/* Country Error Display */}
                  {touched.country && errors.country ? (
                    <div className="text-red-500 text-xs mt-1">{errors.country}</div>
                  ) : null}
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Contact Details</h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <FormikInput label="Email" name="email" type="email" placeholder="Enter Email" required />
                  
                  <div className="flex-1">
                    <label htmlFor="phoneNumber" className="block text-sm font-normal mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Country Code Select */}
                      <Field
                        as="select"
                        className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                        name="phoneCountryCode"
                      >
                        {COUNTRY_CODES.map((cc) => (
                          <option key={cc.uniqueKey} value={cc.code}>
                            {cc.code}
                          </option>
                        ))}
                      </Field>
                      {/* Phone Number Input */}
                      <Field
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter Phone Number"
                        className={`rounded-md bg-gray-50 border ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm`}
                      />
                    </div>
                     {/* Phone Number Error Display */}
                    {touched.phoneNumber && errors.phoneNumber ? (
                        <div className="text-red-500 text-xs mt-1">{errors.phoneNumber}</div>
                      ) : null}
                  </div>
                </div>
              </div>

              {/* Pin Section (4-digit code) */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">PIN</h3>
                <FormikInput label="PIN" name="pin" type="password" placeholder="Enter 4-Digit PIN" maxLength={4} required />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="px-4 py-2 bg-[#3CB4E4] text-white rounded-md hover:bg-[#3090B6] w-full md:w-auto"
                >
                  {loading || isSubmitting ? <Loader /> : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminContentLayout>
  );
}