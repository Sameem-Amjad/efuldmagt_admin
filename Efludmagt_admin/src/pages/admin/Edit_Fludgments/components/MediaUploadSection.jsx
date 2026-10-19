"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Settings, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
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

const MediaUploadSection = ({ formData, setFormData, themeColor = "#3cb4e4" }) => {
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { imageUploadStatus, error: uploadError } = useSelector((state) => state.fuldmagts);

  useEffect(() => {
    dispatch(resetImageUploadStatus());
    return () => dispatch(resetImageUploadStatus());
  }, [dispatch]);

  const selectIcon = (url) => {
    setFormData({ ...formData, iconUrl: url });
    setIconDialogOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    dispatch(uploadFormImage(file)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        setFormData(prev => ({ ...prev, imageUrl: action.payload }));
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
      {/* Icon Section */}
      <div className="space-y-3">
        <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Fuldgment Icon</Label>
        <Dialog open={iconDialogOpen} onOpenChange={setIconDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-white hover:border-[#3cb4e4] transition-all cursor-pointer group overflow-hidden">
              {formData.iconUrl ? (
                <img src={formData.iconUrl} alt="Current Icon" className="h-20 w-20 object-contain z-10" />
              ) : (
                <div className="flex flex-col items-center"><Settings className="w-8 h-8 text-gray-400 mb-2" /><span className="text-xs font-bold text-gray-400 uppercase">Select Icon</span></div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20"><span className="text-white font-bold text-xs uppercase tracking-widest">Change Icon</span></div>
            </div>
          </DialogTrigger>
          <DialogContent className="p-6 max-w-md">
            <DialogHeader><DialogTitle className="text-lg font-bold">Icon Library</DialogTitle></DialogHeader>
            <ScrollArea className="h-80 mt-4 pr-4"><div className="grid grid-cols-4 gap-3">{iconUrls.map((url, index) => (<div key={index} className="border border-gray-100 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#3cb4e4] transition-all" onClick={() => selectIcon(url)}><img src={url} alt="icon" className="w-6 h-6" /></div>))}</div></ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner Section */}
      <div className="space-y-3">
        <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Main Banner Picture</Label>
        <div className="relative h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-white hover:border-[#3cb4e4] transition-all cursor-pointer group overflow-hidden shadow-sm">
          <label htmlFor="banner-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer relative">
            {/* Show previously selected image as base layer */}
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Current Banner" className="absolute inset-0 w-full h-full object-cover" />
            )}

            {/* Overlay Loader during upload */}
            {imageUploadStatus === "loading" && (
              <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all">
                <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Uploading...</span>
              </div>
            )}

            {!formData.imageUrl && imageUploadStatus !== "loading" && (
              <div className="flex flex-col items-center"><Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-xs font-bold text-gray-400 uppercase">Upload Banner</span></div>
            )}

            {formData.imageUrl && imageUploadStatus !== "loading" && (
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20"><span className="text-white font-bold text-xs uppercase tracking-widest">Update Banner</span></div>
            )}

            <input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={imageUploadStatus === "loading"} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadSection;