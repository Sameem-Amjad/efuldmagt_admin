/* eslint-disable react/prop-types */
import { Icons } from "@/lib/Icons";
import { cn } from "@/lib/utils";

const AnalyticalStats = ({ analytics }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <span
        className={cn(
          analytics?.type === "increase" ? "text-increase" : "text-red-500",
          "text-xs font-semibold truncate"
        )}
      >
        {analytics?.type === "increase" ? "+" : "-"}
        {analytics?.value}% last month
      </span>
      {analytics?.type === "increase" ? (
        <img className="h-2" src={Icons.Up} alt="up" />
      ) : (
        <img className="h-2" src={Icons.Down} alt="down" />
      )}
    </div>
  );
};

export default AnalyticalStats;
