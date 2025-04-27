import { Field, Formik } from "formik";

export const SampleForm = () => {
  return (
    <Formik
      initialValues={{
        rawTextInput: "initial rawTextInput value",
        fieldTextInput: "initial fieldTextInput value",
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <label htmlFor="rawTextInput">Raw Text Input</label>
          <input
            id="rawTextInput"
            onChange={props.handleChange}
            value={props.values.rawTextInput}
          />
          <label htmlFor="fieldTextInput">Field Text Input</label>
          <Field name="fieldTextInput" id="fieldTextInput" />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
