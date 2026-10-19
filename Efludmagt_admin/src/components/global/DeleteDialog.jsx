/* eslint-disable react/prop-types */
import { cloneElement, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Icons } from "@/lib/Icons";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import LoadingSpinner from "./Loaders/LoadingSpinner";

const DeleteDialog = ({
  children,
  title = "User",
  name = "Qasim",
  handler,
  isDeleting = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleDelete = () => {
    handler(setIsOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {cloneElement(children, { onClick: () => setIsOpen(true) })}
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <div className="flex flex-col items-center">
          <DialogHeader className="w-full p-0 m-0">
            <DialogTitle className="flex flex-col items-center p-0 m-0">
              <div className="flex flex-row justify-end w-full">
                <DialogClose asChild>
                  <Button
                    variant="link"
                    className="p-0 text-black hover:text-primary h-auto"
                  >
                    <X className="h-4 w-4 p-0" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>
              <div className="w-28 bg-hotRed p-4 rounded-2xl">
                <img
                  src={Icons.deleteLg}
                  alt="delete icon"
                  className="w-full"
                />
              </div>
            </DialogTitle>
            <DialogDescription>
              <span className="flex flex-col items-center mt-5">
                <span className="font-bold text-2xl">Delete {title}</span>
                <span className="flex flex-col items-center gap-1 mt-1">
                  <span>Are you sure you want to delete</span>
                  <span>
                    <span className="font-semibold">&quot;{name}&quot;</span>?
                  </span>
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="w-full mt-7 flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className={cn("w-full bg-white")}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "w-full bg-hotRed hover:bg-hotRed hover:bg-opacity-80"
              )}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <LoadingSpinner /> : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
