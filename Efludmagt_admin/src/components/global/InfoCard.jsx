import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

const InfoCard = ({ title, value, icon }) => {
  return (
    <Card className={cn("border-none bg-primary/10 px-8 py-9")}>
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <p className="text-base text-textColor">{title}</p>
          <p className="text-xl font-semibold text-black">{value}</p>
        </div>
        <div className="flex justify-center items-center rounded-md p-2">
          <img className="w-11" src={icon} alt={title} />
        </div>
      </div>
    </Card>
  );
};

export default InfoCard;
