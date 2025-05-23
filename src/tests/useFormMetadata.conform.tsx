import { getInputProps, useFormMetadata } from "@conform-to/react";

type FormValues = {
  name: string;
  email: number;
};

const emailFieldName = "email";

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
  const setFieldTouched = (_: string, __: boolean, ___?: boolean) => {};
  const isSubmitting = false;
  const handleClick = async () => {
    setFieldValue("name", "John");
    setFieldTouched("name", true);
  };
  const emailFieldProps = getInputProps(fields[emailFieldName], {
    type: "text",
  });

  return (
    <div>
      <div>Values: {JSON.stringify(values)}</div>
      <button type="button" disabled={isSubmitting} onClick={handleClick}>
        Set Name
      </button>
      <input
        {...getInputProps(fields["name"], {
          type: "text",
        })}
      />
      <div>Email: {emailFieldProps.value}</div>
    </div>
  );
};

export const SampleUseFormikContext2 = () => {
  const form = useFormMetadata<FormValues>();
  const values = form.value;

  return <div>Values: {JSON.stringify(values)}</div>;
};

const fieldName = "name";
export const SampleUseFormikContext3 = () => {
  const form = useFormMetadata<FormValues>();
  const setFieldValue = (
    name: string,
    value: any,
    shouldValidate?: boolean,
  ) => {
    form.update({ name, value, validated: !!shouldValidate });
  };
  const fields = form.getFieldset();
  const nameValue = getInputProps(fields[fieldName], {
    type: "text",
  }).value;

  return (
    <div>
      <div>Name Value: {nameValue}</div>
      <button type="button" onClick={() => setFieldValue("name", "John")}>
        Set Name
      </button>
    </div>
  );
};

export const SampleUseFormikContext4 = () => {
  const form = useFormMetadata<FormValues>();
  const fields = form.getFieldset();
  const { value } = getInputProps(fields[fieldName], {
    type: "text",
  });

  return (
    <div>
      <div>Field Value: {value}</div>
    </div>
  );
};
