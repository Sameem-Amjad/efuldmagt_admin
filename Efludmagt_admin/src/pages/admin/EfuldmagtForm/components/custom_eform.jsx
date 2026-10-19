import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, MoreHorizontal, PlusCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom"; // Ensure correct import based on your routing setup

export default function CustomForms() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col bg-white gap-8 p-8 rounded-lg">
      <div className="flex gap-2 mb-8">
        <div
          onClick={() =>
            handleNavigation("/admin/EfuldmagtForm/create-fuldmagt")
          }
          className="flex gap-2 items-center flex-col border-2 border-dotted border-gray-300 p-4 rounded-lg hover:border-gray-400 cursor-pointer"
        >
          <div className="w-32 h-32 rounded-lg flex items-center justify-center relative">
            <img
              src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="icon"
              className="w-16 h-16"
            />
          </div>
          <span className="text-red-500 text-sm">New Private e-fuldmagt</span>
        </div>
      </div>

      {/* <h1 className="text-2xl font-semibold mb-8">Custom e-foulmagt forms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <Card className="relative overflow-hidden border-1 border-gray-300">
          <CardContent className="p-6">
            <div className="absolute top-4 right-4">
              <Badge variant={"outline"} className="text-gray-500">
                Free
              </Badge>
            </div>

            <div className="space-y-2 items-center flex flex-col">
              <div className="bg-[#EA54551F] p-2 rounded-full">
                <MoreHorizontal size={24} className="text-[#EA5455]" />
              </div>
              <div className="text-2xl font-bold text-[#246C89] mt-2">
                35,123
              </div>
              <div className="text-lg font-light text-[#3CB4E480] mt-2">
                1,52,35,123
              </div>
              <div className="text-gray-500 text-sm">Custom e-fuldmagt</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-1 border-gray-300">
          <CardContent className="p-6">
            <div className="absolute top-4 right-4">
              <Badge variant={"outline"} className="text-[#7367F0]">
                45 DKK
              </Badge>
            </div>

            <div className="space-y-2 items-center flex flex-col">
              <div className="bg-[#EA54551F] p-2 rounded-full">
                <MoreHorizontal size={24} className="text-[#EA5455]" />
              </div>
              <div className="text-2xl font-bold text-[#246C89] mt-2">
                35,123
              </div>
              <div className="text-lg font-light text-[#3CB4E480] mt-2">
                1,52,35,123
              </div>
              <div className="text-gray-500 text-sm">Custom e-fuldmagt</div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
