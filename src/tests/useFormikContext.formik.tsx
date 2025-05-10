import { useFormikContext } from "formik";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext = () => {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button type="button" onClick={() => setFieldValue("name", "John")}>
        Set Name
      </button>
    </div>
  );
};
