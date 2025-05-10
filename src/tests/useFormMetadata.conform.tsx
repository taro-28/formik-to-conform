import { useFormMetadata } from "@conform-to/react";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext = () => {
  const { value: values, update } = useFormMetadata<FormValues>();
  const setFieldValue = (
    name: string,
    value: any,
    shouldValidate?: boolean,
  ) => {
    update({ name, value, validated: !!shouldValidate });
  };
  // cannot convert to conform
  const setFieldTouched = (_: string, __: boolean) => {};
  const isSubmitting = false;

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
