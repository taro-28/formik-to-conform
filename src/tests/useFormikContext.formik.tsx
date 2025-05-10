import { useFormikContext } from "formik";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext1 = () => {
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

export const SampleUseFormikContext2 = () => {
  const { values } = useFormikContext<FormValues>();

  return <div>Values: {JSON.stringify(values)}</div>;
};

export const SampleUseFormikContext3 = () => {
  const { setFieldValue } = useFormikContext<FormValues>();

  return (
    <button type="button" onClick={() => setFieldValue("name", "John")}>
      Set Name
    </button>
  );
};
