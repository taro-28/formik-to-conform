import { useFormMetadata } from "@conform-to/react";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext = () => {
  const { value: values, update } = useFormMetadata<FormValues>();
  const setFieldValue = (name: string, value: any, shouldValidate?: boolean) =>
    update({ value: { [name]: value }, validated: !!shouldValidate });

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button type="button" onClick={() => setFieldValue("name", "John")}>
        Set Name
      </button>
    </div>
  );
};
