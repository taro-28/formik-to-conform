import { useField, getInputProps } from "@conform-to/react";
import { useId } from "react";

export const SampleField1 = () => {
  const [field] = useField<string>("name");
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <input
        {...getInputProps(field, {
          type: "text",
        })}
        id={id}
      />
    </div>
  );
};

const fieldName = "age";
export const SampleField2 = () => {
  const [field] = useField(fieldName);
  return (
    <input
      {...getInputProps(field, {
        type: "number",
      })}
    />
  );
};
