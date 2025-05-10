import { useState, type FormEvent } from "react";

export const OtherForm = () => {
  const [name, setName] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" onChange={(e) => setName(e.target.value)} value={name} />
      <button type="submit">Submit</button>
    </form>
  );
};
