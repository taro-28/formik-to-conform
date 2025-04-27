import { getInputProps, useForm } from "@conform-to/react";

export const BasicExample = () => {
  const [form, fields] = useForm({
    defaultValue: { firstName: "jared", lastName: "jones" },
  });

  return (
    <form onSubmit={form.onSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        {...getInputProps(fields.firstName, {
          type: "text",
        })}
        type="text"
        id="firstName"
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        {...getInputProps(fields.lastName, {
          type: "text",
        })}
        type="text"
        id="lastName"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
