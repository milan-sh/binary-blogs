import { forwardRef, useId } from "react";

function Select({ label, options = [], className = "", ...props }, ref) {
  const id = useId();

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="font-semibold block" >{label}</label>}
      <select id={id} className={`w-full ${className}`} {...props} ref={ref}>
        {/* map optinalling otherwise app will be crashed */}
        {options?.map((option) => (
          <option key={option} value={option} >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

//this is also syntax of using forwareRef
export default forwardRef(Select);
