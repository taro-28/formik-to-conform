import { getInputProps, useForm } from "@conform-to/react";

export const SampleForm = () => {
  const [form, fields] = useForm({
    defaultValue: {
      rawInput: "initial rawInput value",
      fieldInput: "initial fieldInput value",
      manyAttributesInput: "initial manyAttributesInput value",
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
      <button type="submit">Submit</button>
    </form>
  );
};
