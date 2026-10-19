"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast"; // Ensure you use your project's toast library
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { iconUrls } from "@/utils/constants/staticVars";

import { uploadFormImage } from "@/redux/features/fuldmagts/fuldmagtsThunk";
import { resetImageUploadStatus } from "@/redux/features/fuldmagts/fuldmagtsSlice";

export default function Step2Uploads({ formData, setFormData, onContinue }) {
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const { imageUploadStatus, error: uploadError } = useSelector(
    (state) => state.fuldmagts
  );

  useEffect(() => {
    dispatch(resetImageUploadStatus());
    return () => dispatch(resetImageUploadStatus());
  }, [dispatch]);

  useEffect(() => {
    if (imageUploadStatus === 'succeeded' || imageUploadStatus === 'failed') {
      const timer = setTimeout(() => {
        dispatch(resetImageUploadStatus());
      }, 3000); 
      return () => clearTimeout(timer); 
    }
  }, [imageUploadStatus, dispatch]);

  const selectIcon = (url) => {
    setFormData({ ...formData, icon: url });
    setIconDialogOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
    if (!allowedExtensions.includes(file.name.split(".").pop().toLowerCase())) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    dispatch(uploadFormImage(file)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        const fileUrl = action.payload;
        setFormData(currentFormData => ({
          ...currentFormData,
          fuldmagt_image: fileUrl,
        }));
      }
    });
  };

  // ✅ New validation logic for the Continue button
  const handleValidationAndContinue = () => {
    // if (!formData.fuldmagt_image) {
    //   toast.error("Please upload an image file before continuing.");
    //   return;
    // }
    if (!formData.icon) {
      toast.error("Please select an icon from the library.");
      return;
    }
    
    // If both exist, proceed to next step
    onContinue();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg">Add an Image File</Label>
        <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-sky-500 transition-colors">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            {imageUploadStatus === "loading" ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : formData.fuldmagt_image ? (
              <img
                src={formData.fuldmagt_image}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload</span>
              </>
            )}
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={imageUploadStatus === "loading"}
            />
          </label>
        </div>
        {imageUploadStatus === "succeeded" && (
          <p className="mt-2 text-sm text-green-500 font-medium">Upload successful!</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-lg">Add an Icon</Label>
        <Dialog open={iconDialogOpen} onOpenChange={setIconDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-sky-500 transition-colors">
              {!formData.icon ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <Settings className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Add</span>
                </div>
              ) : (
                <img
                  src={formData.icon}
                  alt="Selected Icon"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="p-6 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Select an Icon</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="grid grid-cols-4 gap-4 mt-4">
                {iconUrls.map((url, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-sky-500 transition"
                    onClick={() => selectIcon(url)}
                  >
                    <img src={url} alt={`Icon ${index + 1}`} className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Continue Button - ✅ Always Enabled, Validates on Click */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleValidationAndContinue}
          className="bg-[#47B5FF] hover:bg-[#1DA1F2] text-white px-10 h-12 font-bold shadow-lg transition-all active:scale-95"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}