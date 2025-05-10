import { useFormikContext } from "formik";

type FormValues = {
  name: string;
};

export const DisplayValues = () => {
  const { values } = useFormikContext<FormValues>();

  return <div>Values: {JSON.stringify(values)}</div>;
};
