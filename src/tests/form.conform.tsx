import { getInputProps, useForm } from "@conform-to/react";
import type { JSX } from "react";

const CustomInput = (props: JSX.IntrinsicElements["input"]) => (
  <input {...props} />
);

export const SampleForm = () => {
  const [form, fields] = useForm({
    defaultValue: {
      rawInput: "initial rawInput value",
      fieldInput: "initial fieldInput value",
      manyAttributesInput: "initial manyAttributesInput value",
      customInput: 123,
    },
  });

  return (
    <form onSubmit={form.onSubmit}>
      <label htmlFor="rawInput">Raw Input</label>
      <input
        {...getInputProps(fields.rawInput, {
          type: "text",
        })}
        id="rawInput"
      />
      <label htmlFor="fieldInput">Field Input</label>
      <input
        {...getInputProps(fields.fieldInput, {
          type: "text",
        })}
        id="fieldInput"
      />
      <label htmlFor="manyAttributesInput">Many Attributes Input</label>
      <input
        {...getInputProps(fields.manyAttributesInput, {
          type: "email",
          placeholder: "placeholder",
          disabled: false,
        })}
        id="manyAttributesInput"
      />
      <label htmlFor="customInput">Custom Input</label>
      <CustomInput
        {...getInputProps(fields.customInput, {
          type: "number",
        })}
        id="customInput"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export const SampleFormWithFormComponent = () => {
  const [form, fields] = useForm({
    defaultValue: { name: "" },
  });

  return (
    <form onSubmit={form.onSubmit}>
      <label htmlFor="name">Name</label>
      <input
        {...getInputProps(fields.name, {
          type: "text",
        })}
        id="name"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
