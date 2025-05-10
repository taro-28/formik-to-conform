import { useField } from "formik";
import { useId } from "react";

export const SampleUseField1 = () => {
  const [field] = useField<string>("name");
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <input {...field} id={id} />
    </div>
  );
};

type FieldValue = {
  name: string;
  age: number;
};

export const SampleUseField2 = () => {
  const [{ value }, , { setValue }] = useField<FieldValue>("user");

  return (
    <div>
      User: {JSON.stringify(value)}
      <button type="button" onClick={() => setValue({ name: "", age: 20 })}>
        Reset
      </button>
    </div>
  );
};
