import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import CustomForms from "./components/custom_eform";

const EfuldmagtForm = () => {
  return (
    <AdminContentLayout>
      <div className="flex flex-col"><CustomForms /></div>
    </AdminContentLayout>
  );
};

export default EfuldmagtForm;
