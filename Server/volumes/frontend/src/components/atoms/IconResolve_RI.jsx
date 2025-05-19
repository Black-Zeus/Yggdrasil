
import React from "react";
import { iconMap } from "./iconMap";
import { RiErrorWarningLine } from "react-icons/ri";

const IconResolve_RI = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || RiErrorWarningLine;
  return <IconComponent {...props} />;
};

export default IconResolve_RI;
