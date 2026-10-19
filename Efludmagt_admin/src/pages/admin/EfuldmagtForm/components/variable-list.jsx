"use client";

import { Button } from "@/components/ui/button";

function VariableList({ variables, onVariableClick }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {variables.map((variable) => (
        <Button
          key={variable.id}
          variant="secondary"
          size="sm"
          className="text-sm bg-gray-100 hover:bg-gray-200"
          onClick={() => onVariableClick(variable.name)}
        >
          {variable.name}
        </Button>
      ))}
    </div>
  );
}

export default VariableList;
