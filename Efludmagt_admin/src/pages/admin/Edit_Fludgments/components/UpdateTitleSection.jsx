"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkFuldmagtTitle } from "@/redux/features/fuldmagts/fuldmagtsThunk";

const UpdateTitleSection = ({ title, setTitle, themeColor = "#3cb4e4" }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Functionality commented out to prevent title updates
  const handleCheckAvailability = async () => {
    /* if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }

    setIsLoading(true);
    setIsAvailable(false);

    try {
      await dispatch(checkFuldmagtTitle(title)).unwrap();
      setIsAvailable(true);
      toast.success("This title is available!");
    } catch (error) {
      toast.error(error || "This title is already taken.");
      setIsAvailable(false);
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="space-y-3 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
      <Label htmlFor="title" className="text-sm font-bold text-gray-700 uppercase tracking-wider">
        e-Fuldmagt Display Name
      </Label>
      
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            id="title"
            value={title}
            // onChange logic commented out to lock the title
            onChange={(e) => {
              // setTitle(e.target.value);
              // setIsAvailable(false); 
            }}
            readOnly // Added readOnly to prevent user typing
            placeholder="e.g. 'e-fuldmagt for package pickup'"
            className="h-14 px-6 rounded-xl border border-gray-200 focus:ring-2 outline-none font-semibold text-gray-700 bg-gray-100 cursor-not-allowed"
            style={{ '--tw-ring-color': themeColor }}
            required
          />
          {isAvailable && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="text-green-500 w-5 h-5" />
            </div>
          )}
        </div>

        {/* Check Availability button commented out */}
        {/* <Button
          type="button"
          onClick={handleCheckAvailability}
          disabled={isLoading || !title.trim()}
          className="h-14 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-md flex gap-2"
          style={{ 
            backgroundColor: isAvailable ? "#10b981" : themeColor,
            color: "#fff"
          }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAvailable ? (
            "Available"
          ) : (
            "Check Availability"
          )}
        </Button> 
        */}
      </div>
      
      {/* <p className="text-[10px] text-gray-400 font-medium px-1 uppercase tracking-tight italic">
        Title editing is currently disabled for this Fuldmagt.
      </p> */}
    </div>
  );
};

export default UpdateTitleSection;