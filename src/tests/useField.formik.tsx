import { useField } from "formik";
import { useId } from "react";

export const SampleField = () => {
  const [field] = useField<string>("name");
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <input {...field} id={id} />
    </div>
  );
};
