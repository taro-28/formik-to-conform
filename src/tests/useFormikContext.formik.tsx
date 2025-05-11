import { useFormikContext } from "formik";

type FormValues = {
  name: string;
  email: number;
};

const emailFieldName = "email";

export const SampleUseFormikContext1 = () => {
  const {
    values,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    getFieldProps,
  } = useFormikContext<FormValues>();
  const handleClick = async () => {
    await setFieldValue("name", "John");
    await setFieldTouched("name", true);
  };
  const emailFieldProps = getFieldProps(emailFieldName);

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button type="button" disabled={isSubmitting} onClick={handleClick}>
        Set Name
      </button>
      <input {...getFieldProps("name")} type="text" />
      <div>Email: {emailFieldProps.value}</div>
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

const fieldName = "name";
export const SampleUseFormikContext4 = () => {
  const { getFieldProps } = useFormikContext<FormValues>();
  const { value } = getFieldProps(fieldName);

  return (
    <div>
      <div>Field Value: {value}</div>
    </div>
  );
};
