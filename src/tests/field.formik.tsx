import { Field } from "formik";
import { useId } from "react";

export const SampleField1 = () => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name</label>
      <Field name="name" id={id} />
    </div>
  );
};

const fieldName = "age";
export const SampleField2 = () => {
  return <Field name={fieldName} type="number" />;
};
