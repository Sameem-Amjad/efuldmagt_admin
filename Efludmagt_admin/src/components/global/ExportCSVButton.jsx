/* eslint-disable react/prop-types */
import { Icons } from "@/lib/Icons";
import { Button } from "../ui/button";
import { saveAs } from "file-saver";

const ExportCSVButton = ({ headers, columns, table }) => {
  const downloadCSV = () => {
    const headerRow = headers.join(",");

    const rows = table.getFilteredRowModel().rows.map((row) => {
      return columns
        .map((column) => {
          const value = row?.getValue(column?.accessorKey);

          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return Object.values(value).join(",");
          }

          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
        })
        .join(",");
    });

    const csvContent = [headerRow, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table-data.csv");
  };

  return (
    <Button
      onClick={downloadCSV}
      className="flex items-center gap-2 rounded-full px-8 py-2 border-none bg-transparent text-textColor font-semibold"
      variant="outline"
    >
      <img className="w-5" src={Icons.download} alt="donwload icon" />
      Export CSV
    </Button>
  );
};

export default ExportCSVButton;
