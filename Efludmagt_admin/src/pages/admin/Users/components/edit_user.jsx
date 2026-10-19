// pages/EditUser.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { allCountries } from 'country-telephone-data';
import { LoaderIcon } from 'lucide-react';

import Loader from '@/components/global/Loaders/Loader';
import { AdminContentLayout } from '@/layouts/AdminContentLayout';
import { useToast } from "@/hooks/use-toast";

// --- Consolidated Country Data Logic ---
const allCountryData = allCountries.map((country) => ({
  name: country.name.split(' (')[0], // Removes native name, e.g., "Denmark (Danmark)" -> "Denmark"
  code: `+${country.dialCode}`,
  iso: country.iso2,
  uniqueKey: `+${country.dialCode}-${country.iso2}`,
}));

const COUNTRY_CODES = allCountryData; // For phone number prefixes
const COUNTRIES = [...new Set(allCountryData.map(country => country.name))].sort(); // For the country dropdown

// --- Validation Schema using Yup ---
const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email format (e.g. name@domain.com)").required("Email is required"),
  address: Yup.string().required("Address is required"),
  postalCode: Yup.string().matches(/^[0-9]+$/, "Postal code must only contain digits"),
  city: Yup.string().required("City is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must only contain digits") 
    .min(8, "Phone number is too short (min 8 digits)")
    .max(15, "Phone number is too long (max 15 digits)")
    .required("Phone number is required"),
});

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Initialize Formik for form state management ---
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      addressLine: "",
      postalCode: "",
      city: "",
      country: allCountryData.find(c => c.iso === 'dk')?.name || 'Denmark', // Robust default
      email: "",
      phoneCountryCode: "+45",
      phoneNumber: "",
      // admin: false,
      // locked: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        email: values.email,
        phone: { countryCode: values.phoneCountryCode, number: values.phoneNumber },
        name: { firstName: values.firstName, lastName: values.lastName },
        address: {
          address: values.address,
          addressLine: values.addressLine,
          postalCode: values.postalCode,
          city: values.city,
          country: values.country,
        },
        // admin: values.admin,
        // locked: values.locked,
      };

      try {
        const response = await axios.put(`${import.meta.env.VITE_API_KEY}/admin/users/${userId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.data.success) {
          toast({
            title: "User Updated",
            variant: "success",
            description: "User details have been updated successfully.",
          });
          navigate("/admin/users");
        } else {
          throw new Error(response.data.message || "Failed to update user.");
        }
      } catch (err) {
        console.error("Error updating user:", err);
        toast({
            title: "Update Error",
            variant: "destructive",
            description: err.response?.data?.message || err.message
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_KEY}/admin/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });

        if (response.data.success && response.data.data.user) {
          const user = response.data.data.user;
          let firstName = "", lastName = "";

          if (typeof user.name === 'string') {
            const nameParts = user.name.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(' ') || "";
          } else if (typeof user.name === 'object' && user.name !== null) {
            firstName = user.name.firstName || "";
            lastName = user.name.lastName || "";
          }

          formik.setValues({
            firstName,
            lastName,
            address: user.address?.address || "",
            addressLine: user.address?.addressLine || "",
            postalCode: user.address?.postalCode || "",
            city: user.address?.city || "",
            country: user.address?.country || formik.initialValues.country,
            email: user.email || "",
            phoneCountryCode: user.phone?.countryCode || "+45",
            phoneNumber: user.phone?.number || "",
            // admin: user.admin || false,
            // locked: user.locked || false,
          });
        } else {
          setError("User not found or failed to retrieve data.");
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleCancel = () => navigate(-1);

  if (loading) {
    return (
      <AdminContentLayout>
        <div className="flex justify-center items-center h-full"><Loader /></div>
      </AdminContentLayout>
    );
  }

  if (error) {
    return (
      <AdminContentLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <button onClick={handleCancel} className="flex items-center text-black mb-6 no-underline w-fit">
          <span className="mr-2 text-lg">←</span>
          <span className="text-lg">Back to Users</span>
        </button>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Full Name Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Full Name</h3>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-1 w-full">
                <label htmlFor="firstName" className="block text-sm font-normal mb-2">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  {...formik.getFieldProps('firstName')}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter First Name"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                )}
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="lastName" className="block text-sm font-normal mb-2">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  {...formik.getFieldProps('lastName')}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Last Name"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Address</h3>
            <div className="space-y-4">
               <div className="flex flex-col md:flex-row items-start gap-4">
                <div className='flex-1 w-full'>
                    <label htmlFor="address" className="block text-sm font-normal mb-2">Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      {...formik.getFieldProps('address')}
                      className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                      placeholder="Enter Address"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
                    )}
                </div>
                 <div className='flex-1 w-full'>
                    <label htmlFor="addressLine" className="block text-sm font-normal mb-2">(Optional) Extra Info</label>
                    <input
                      id="addressLine"
                      name="addressLine"
                      type="text"
                      {...formik.getFieldProps('addressLine')}
                      className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                      placeholder="Enter Additional Address Info"
                    />
                 </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-1 w-full">
                  <label htmlFor="postalCode" className="block text-sm font-normal mb-2">Postal Code</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    {...formik.getFieldProps('postalCode')}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter Postal Code"
                  />
                  {formik.touched.postalCode && formik.errors.postalCode && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.postalCode}</div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label htmlFor="city" className="block text-sm font-normal mb-2">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    {...formik.getFieldProps('city')}
                    className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                    placeholder="Enter City"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-normal mb-2">Country</label>
                <select
                  id="country"
                  name="country"
                  {...formik.getFieldProps('country')}
                  className="rounded-md bg-gray-50 border border-gray-300 text-[#3090B6] focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                >
                  {COUNTRIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Contact Details Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Contact Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-normal mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                  placeholder="Enter Email"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-normal mb-2">Phone Number</label>
                <div className="flex items-start gap-2">
                  <select
                    name="phoneCountryCode"
                    {...formik.getFieldProps('phoneCountryCode')}
                    className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none"
                  >
                    {COUNTRY_CODES.map((cc) => (<option key={cc.uniqueKey} value={cc.code}>{cc.code}</option>))}
                  </select>
                  <div className="w-full">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      {...formik.getFieldProps('phoneNumber')}
                      className="rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 text-sm"
                      placeholder="Enter Phone Number"
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin and Locked Status
          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium mb-2">Permissions</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <input
                  id="admin"
                  name="admin"
                  type="checkbox"
                  {...formik.getFieldProps('admin')}
                  checked={formik.values.admin}
                />
                <label htmlFor="admin" className="ml-2 block text-sm text-gray-700">Is Admin</label>
              </div>
              <div className="flex items-center">
                <input
                  id="locked"
                  name="locked"
                  type="checkbox"
                  {...formik.getFieldProps('locked')}
                  checked={formik.values.locked}
                />
                <label htmlFor="locked" className="ml-2 block text-sm text-gray-700">Is Locked</label>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-4 py-2 bg-[#3CB4E4] text-white rounded-md hover:bg-[#3090B6] w-full md:w-auto flex items-center justify-center min-w-[120px]"
            >
              {formik.isSubmitting ? <LoaderIcon className='animate-spin h-5 w-5' /> : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </AdminContentLayout>
  );
};

export default EditUser;