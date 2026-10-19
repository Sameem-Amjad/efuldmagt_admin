"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkFuldmagtTitle } from "@/redux/features/fuldmagts/fuldmagtsThunk";

export default function Step1Title({ title, setTitle, onContinue }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      // Dispatch the thunk and wait for it to complete.
      // .unwrap() will throw an error if the thunk is rejected.
      await dispatch(checkFuldmagtTitle(title)).unwrap();

      // If the thunk succeeds (200 OK), the title is available. Proceed to the next step.
      onContinue();

    } catch (error) {
      // If the thunk is rejected (400 error), the title is taken.
      // The error payload from rejectWithValue is automatically available here.
      toast.error(error || "This title is already taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your e-fuldmagt a title e.g. 'e-fuldmagt for pet care'"
          className="h-12 w-[500px]"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-sky-500 hover:bg-sky-600 text-white px-8 disabled:opacity-50"
        >
          {isLoading ? "Checking..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}