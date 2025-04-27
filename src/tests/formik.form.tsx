import { Field, Formik } from "formik";

export const SampleForm = () => {
  return (
    <Formik
      initialValues={{
        rawInput: "initial rawInput value",
        fieldInput: "initial fieldInput value",
        manyAttributesInput: "initial manyAttributesInput value",
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
          <label htmlFor="manyAttributesInput">Many Attributes Input</label>
          <input
            id="manyAttributesInput"
            type="email"
            placeholder="placeholder"
            disabled={false}
            onChange={props.handleChange}
            onClick={props.handleBlur}
            value={props.values.manyAttributesInput}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
