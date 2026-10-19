/* eslint-disable react/prop-types */
import { useState } from "react";
import { Switch } from "../ui/switch";

const SwitchHandler = ({ state, handleState, rowId, disabled = false }) => {
  const [isActive, setIsActive] = useState(state);

  const handleChange = (checked) => {
    setIsActive(checked);
    handleState({ id: rowId, status: checked });
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleChange}
      disabled={disabled}
    />
  );
};

export default SwitchHandler;
