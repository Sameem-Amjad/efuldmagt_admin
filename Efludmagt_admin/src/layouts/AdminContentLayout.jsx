/* eslint-disable react/prop-types */
import { Toaster } from "@/components/ui/toaster"
export function AdminContentLayout({ children }) {
  return (
    <div>
      <div className="container pt-4 pb-8 px-4 sm:px-8">
        {children}
        <Toaster />
      </div>
    </div>
  );
}
