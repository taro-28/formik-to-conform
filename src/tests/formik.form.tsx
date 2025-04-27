import { Field, Formik } from "formik";

export const SampleForm = () => {
  return (
    <Formik
      initialValues={{
        rawInput: "initial rawInput value",
        fieldInput: "initial fieldInput value",
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <label htmlFor="rawInput">Raw Input</label>
          <input
            id="rawInput"
            onChange={props.handleChange}
            value={props.values.rawInput}
          />
          <label htmlFor="fieldInput">Field Input</label>
          <Field name="fieldInput" id="fieldInput" />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
