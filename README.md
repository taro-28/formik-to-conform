# Formik to Conform

A tool to automatically convert Formik code to Conform.

## CLI Usage

You can use the CLI tool to convert all `.tsx` and `.jsx` files in a directory:

```bash
# Install globally
npm install -g formik-to-conform

# Run on a directory
formik-to-conform src

# Or using npx
npx formik-to-conform src
```

When developing locally:

```bash
# Build the project
pnpm build

# Run the CLI
pnpm cli src
```

## Features

# Progress

- 🙌 implemented
- 🏃 implementing
- 💤 not implemented

---

- 🏃 `Formik` Component
  - 🙌 `initialValues`
  - 🙌 `onSubmit`
  - 🙌 `validationSchema`
- 🙌 `Field` Component
- 🙌 `Form` Component
- 🏃 `useField` hook
  - 🙌 Generics
  - 🙌 `FieldInputProps`
  - 💤 `FieldMetaProps`
  - 💤 `FieldHelperProps`
- 🏃 `useFormikContext` hook
  - 🙌 `values`
  - 🙌 `setFieldValue`
- 💤 `useFormik` hook
