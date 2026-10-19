"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Loader2,
  Check,
  Circle,
  User,
  Search,
  X,
} from "lucide-react";

export default function Step3Visibility({
  visibility,
  setVisibility,
  formData,
  setFormData,
  users, 
  companies, 
  loading,
  error,
  toggleUser, 
  toggleCompany, 
  onContinue,
}) {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");

const filteredUsers = userSearchTerm
    ? users.filter((user) => {
        const searchTerm = userSearchTerm.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = (user.email || "").toLowerCase();

        return (
          (fullName.includes(searchTerm) || email.includes(searchTerm)) &&
          !formData.selectedUsers.includes(user.id)
        );
      })
    : [];

  const filteredCompanies = companySearchTerm
    ? companies.filter(
        (company) =>
          company.firstName 
            .toLowerCase()
            .includes(companySearchTerm.toLowerCase()) &&
          !formData.selectedCompanies.includes(company.id) 
      )
    : [];

  const selectedUserObjects = formData.selectedUsers
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean); 

  const selectedCompanyObjects = formData.selectedCompanies
    .map((id) => companies.find((company) => company.id === id))
    .filter(Boolean);

useEffect(() => {
    if (visibility === "everyone") {
      setFormData((prev) => ({
        ...prev,
        selectedUsers: [],
        selectedCompanies: [],
        exceptUsers: false,
        exceptCompanies: false,
        visibleTo: "everyone",
      }));
    } else if (visibility === "private_only") {
      setFormData((prev) => ({
        ...prev,
        selectedUsers: users.map((u) => u.id), 
        selectedCompanies: [],
        exceptUsers: false,
        exceptCompanies: false,
        visibleTo: "allUsers",
      }));
    } else if (visibility === "companies_only") {
      setFormData((prev) => ({
        ...prev,
        selectedUsers: [],
        selectedCompanies: companies.map((c) => c.id), 
        exceptUsers: false,
        exceptCompanies: false,
        visibleTo: "allCompanies",
      }));
    } else if (visibility === "custom") {
      setFormData((prev) => ({
        ...prev,
        selectedUsers: [],
        selectedCompanies: [],
        exceptUsers: false,
        exceptCompanies: false,
        visibleTo: "specificUsersAndCompanies",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility, setFormData, users, companies]);

  const handleSelectUser = (id) => {
    toggleUser(id);
    setUserSearchTerm(""); 
  };

  const handleSelectCompany = (id) => {
    toggleCompany(id);
    setCompanySearchTerm(""); 
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Visibility</h2>
        <RadioGroup
          value={visibility}
          onValueChange={(value) => setVisibility(value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="everyone" id="everyone" />
            <Label htmlFor="everyone" className="text-gray-500 font-light">
              Everyone
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private_only" id="private_only" />
            <Label htmlFor="private_only" className="text-gray-500 font-light">
              Private users only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="companies_only" id="companies_only" />
            <Label htmlFor="companies_only" className="text-gray-500 font-light">
              Companies only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-gray-500 font-light">
              Custom
            </Label>
          </div>
        </RadioGroup>
      </div>

      {visibility === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg border border-gray-300 bg-white overflow-hidden">
          {/* --- Private Users Column --- */}
          <div className="p-6 md:border-r md:border-gray-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-lg">Private Users</h3>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search private users"
                className="pl-9 rounded-full" // ✅ CHANGED
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
              {filteredUsers.length > 0 && (
                // ✅ CHANGED: Added rounded-xl and p-2
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 space-y-1">
                  {filteredUsers.map((user) => (
                    // ✅ CHANGED: Adjusted padding and added rounded-md
  <div
                      key={user.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex flex-col"
                      onClick={() => handleSelectUser(user.id)}
                    >
                      {/* ✅ Show Name and Email in results */}
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="exceptUsers"
                checked={formData.exceptUsers}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, exceptUsers: !!checked }))
                }
              />
              <Label htmlFor="exceptUsers" className="font-light text-gray-600">
                Everyone Except
              </Label>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
              {selectedUserObjects.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <X
                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-800"
                    onClick={() => toggleUser(user.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- Companies Column --- */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <Building2 className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-lg">Companies</h3>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search Companies"
                className="pl-9 rounded-full" // ✅ CHANGED
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
              />
              {filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 space-y-1">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleSelectCompany(company.id)}
                    >
                      {company.firstName}{" "}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="exceptCompanies"
                checked={formData.exceptCompanies}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    exceptCompanies: !!checked,
                  }))
                }
              />
              <Label
                htmlFor="exceptCompanies"
                className="font-light text-gray-600"
              >
                Everyone Except
              </Label>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
              {selectedCompanyObjects.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  <span>
                    {company.firstName}{" "}
                  </span>
                  <X
                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-800"
                    onClick={() => toggleCompany(company.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      )}
      {error && (
        <div className="text-red-500">Error: {error.message || error}</div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          className="bg-[#47B5FF] hover:bg-[#1DA1F2] text-white px-8 mb-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}