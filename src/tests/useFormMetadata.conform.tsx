import { useFormMetadata } from "@conform-to/react";

type FormValues = {
  name: string;
};

export const DisplayValues = () => {
  const { value: values } = useFormMetadata<FormValues>();

  return <div>Values: {JSON.stringify(values)}</div>;
};
