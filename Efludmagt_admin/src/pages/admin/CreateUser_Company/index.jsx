import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { Icons } from "@/lib/Icons";
import { useNavigate } from "react-router-dom";

const CreateUserOrCompany = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <AdminContentLayout>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Create new users</h1>
        <div className="flex gap-6">
          <div
            className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-100 w-1/6"
            onClick={() => handleNavigation("/admin/CreateUserOrCompany/create-private-user")}
          >
            <div className="flex justify-center mb-4">
              <img
                src={Icons.newuser}
                alt="Create Private User"
                className="h-8 w-8"
              />
            </div>
            <p className="font-medium">Create Private User</p>
          </div>
          <div
            className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-100 w-1/6"
            onClick={() => handleNavigation("/admin/CreateUserOrCompany/create-company-user")}
          >
            <div className="flex justify-center mb-4">
              <img
                src={Icons.commercial}
                alt="Create Company"
                className="h-8 w-auto max-w-full mx-auto sm:w-8 sm:h-8"
              />
            </div>
            <p className="font-medium">Create Company</p>
          </div>
        </div>
      </div>
    </AdminContentLayout>
  );
};

export default CreateUserOrCompany;
