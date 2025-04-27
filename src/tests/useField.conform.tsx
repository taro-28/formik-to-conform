import { getInputProps, useField } from "@conform-to/react";
import { useId } from "react";

export const SampleField = () => {
  const [field] = useField<string>("name");
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <input {...getInputProps(field, { type: "text" })} id={id} />
    </div>
  );
};
