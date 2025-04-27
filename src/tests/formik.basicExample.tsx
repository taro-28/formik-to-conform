import { Formik } from "formik";

export const BasicExample = () => {
  return (
    <Formik
      initialValues={{ name: "jared" }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            onChange={props.handleChange}
            value={props.values.name}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
