import { getInputProps, useForm } from "@conform-to/react";

export const SampleForm = () => {
  const [form, fields] = useForm({
    defaultValue: {
      rawInput: "initial rawInput value",
      fieldInput: "initial fieldInput value",
    },
  });

  return (
    <form onSubmit={form.onSubmit}>
      <label htmlFor="rawInput">Raw Input</label>
      <input
        {...getInputProps(fields.rawInput, {
          type: "text",
        })}
        type="text"
        id="rawInput"
      />
      <label htmlFor="fieldInput">Field Input</label>
      <input
        {...getInputProps(fields.fieldInput, {
          type: "text",
        })}
        type="text"
        id="fieldInput"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
