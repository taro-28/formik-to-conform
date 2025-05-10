import { getInputProps, useFormMetadata } from "@conform-to/react";

type FormValues = {
  name: string;
};

export const SampleUseFormikContext1 = () => {
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
  const fields = form.getFieldset();
  // cannot convert to conform
  const setFieldTouched = (_: string, __: boolean) => {};
  const isSubmitting = false;
  const handleClick = async () => {
    setFieldValue("name", "John");
    setFieldTouched("name", true);
  };

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button type="button" disabled={isSubmitting} onClick={handleClick}>
        Set Name
      </button>
      <input
        {...getInputProps(fields.name, {
          type: "text",
        })}
      />
    </div>
  );
};

export const SampleUseFormikContext2 = () => {
  const form = useFormMetadata<FormValues>();
  const values = form.value;

  return <div>Values: {JSON.stringify(values)}</div>;
};

export const SampleUseFormikContext3 = () => {
  const form = useFormMetadata<FormValues>();
  const setFieldValue = (
    name: string,
    value: any,
    shouldValidate?: boolean,
  ) => {
    form.update({ name, value, validated: !!shouldValidate });
  };

  return (
    <button type="button" onClick={() => setFieldValue("name", "John")}>
      Set Name
    </button>
  );
};
