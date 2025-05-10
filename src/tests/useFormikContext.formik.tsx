import { useFormikContext } from "formik";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext = () => {
  const { values, setFieldValue, setFieldTouched, isSubmitting } =
    useFormikContext<FormValues>();

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setFieldValue("name", "John");
          setFieldTouched("name", true);
        }}
      >
        Set Name
      </button>
    </div>
  );
};
