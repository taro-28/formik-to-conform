import { Field, Form, Formik } from "formik";
import type { JSX } from "react";

const CustomInput = (props: JSX.IntrinsicElements["input"]) => (
  <input {...props} />
);

export const SampleForm = () => {
  return (
    <Formik
      initialValues={{
        rawInput: "initial rawInput value",
        fieldInput: "initial fieldInput value",
        manyAttributesInput: "initial manyAttributesInput value",
        customInput: 123,
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
          <label htmlFor="customInput">Custom Input</label>
          <Field
            name="customInput"
            id="customInput"
            type="number"
            as={CustomInput}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};

export const SampleFormWithFormComponent = () => {
  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {() => (
        <Form>
          <label htmlFor="name">Name</label>
          <Field name="name" id="name" />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
