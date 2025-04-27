import { Formik } from "formik";

export const SampleForm = () => {
  return (
    <Formik
      initialValues={{ firstName: "jared", lastName: "jones" }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            onChange={props.handleChange}
            value={props.values.firstName}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            onChange={props.handleChange}
            value={props.values.lastName}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
