import { useFormikContext } from "formik";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext = () => {
  const { values, setFieldValue, setFieldTouched, isSubmitting } =
    useFormikContext<FormValues>();
  const handleClick = () => {
    setFieldValue("name", "John");
    setFieldTouched("name", true);
  };

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button type="button" disabled={isSubmitting} onClick={handleClick}>
        Set Name
      </button>
    </div>
  );
};
