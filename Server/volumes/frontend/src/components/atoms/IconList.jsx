import IconResolve_RI from "./IconResolve_RI";

const IconList = ({ icons }) => {
  return (
    <ul>
      {icons.map((iconName) => (
        <li key={iconName} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconResolve_RI name={iconName} size={24} />
          <span>{iconName}</span>
        </li>
      ))}
    </ul>
  );
};

export default IconList;
