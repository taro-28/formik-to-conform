import { getInputProps, useForm } from "@conform-to/react";

export const SampleForm = () => {
  const [form, fields] = useForm({
    defaultValue: {
      rawTextInput: "initial rawTextInput value",
      fieldTextInput: "initial fieldTextInput value",
    },
  });

  return (
    <form onSubmit={form.onSubmit}>
      <label htmlFor="rawTextInput">Raw Text Input</label>
      <input
        {...getInputProps(fields.rawTextInput, {
          type: "text",
        })}
        type="text"
        id="rawTextInput"
      />
      <label htmlFor="fieldTextInput">Field Text Input</label>
      <input
        {...getInputProps(fields.fieldTextInput, {
          type: "text",
        })}
        type="text"
        id="fieldTextInput"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
