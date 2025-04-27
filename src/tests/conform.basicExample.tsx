import { getInputProps, useForm } from "@conform-to/react";

export const BasicExample = () => {
  const [form, fields] = useForm({
    defaultValue: { name: "jared" },
  });

  return (
    <form onSubmit={form.onSubmit}>
      <label htmlFor="name">Name</label>
      <input
        {...getInputProps(fields.name, {
          type: "text",
        })}
        type="text"
        id="name"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
