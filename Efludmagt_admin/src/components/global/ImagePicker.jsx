/* eslint-disable react/prop-types */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import profileImage from "../../assets/images/profileImage2.jpeg";

const ImagePicker = ({ form, reference }) => {
  return (
    <FormField
      control={form.control}
      name={reference} // This will be `profilePicture.image`
      render={({ field }) => (
        <FormItem className="flex flex-col items-center">
          <FormLabel>
            <img
              src={
                field.value // Check if there's a new uploaded image
                  ? URL.createObjectURL(field.value) // If there's a new image, create a preview URL
                  : form.getValues("profilePicture.url") // Check if there's an existing image URL
                  ? form.getValues("profilePicture.url")
                  : profileImage // Fallback to default image
              }
              alt="profile"
              className="rounded-full w-24 h-24 object-cover object-center cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            />
          </FormLabel>
          <FormControl>
            <Input
              id="fileInput"
              className="hidden"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                const file = e.target.files[0];
                field.onChange(file); // Update the `image` field value with the selected file
                form.setValue("profilePicture.url", ""); // Clear the existing URL if a new file is selected
              }}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default ImagePicker;
