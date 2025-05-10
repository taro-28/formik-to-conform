import { getInputProps, useField } from "@conform-to/react";
import { useId } from "react";

export const SampleUseField1 = () => {
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

type FieldValue = {
  name: string;
  age: number;
};

export const SampleUseField2 = () => {
  const [field, form] = useField<FieldValue>("user");
  const value = field.value;
  const setValue = (value: FieldValue, shouldValidate?: boolean) =>
    form.update({ name: "user", value, validated: !!shouldValidate });

  return (
    <div>
      User: {JSON.stringify(value)}
      <button type="button" onClick={() => setValue({ name: "", age: 20 })}>
        Reset
      </button>
    </div>
  );
};
