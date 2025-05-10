import { useFormMetadata } from "@conform-to/react";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext = () => {
  const form = useFormMetadata<FormValues>();
  const values = form.value;
  const update = form.update;
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
