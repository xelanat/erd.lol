import React, { FormEvent } from 'react'
import { Form, Field, FormRenderProps } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'

// interface FormData {
//   name: string
//   age: number
// }

interface ERDEditorFormProps {
  onSubmit: (data: any) => null
}

const ERDEditorForm: React.FC<ERDEditorFormProps> = ({ onSubmit }) => {

  // const validate = (values: FormData) => {
  //   const errors: Partial<FormData> = {}
  //   if (!values.name) {
  //     errors.name = 'Required'
  //   }
  //   if (!values.age) {
  //     errors.age = 'Required'
  //   } else if (values.age < 18) {
  //     errors.age = 'Must be at least 18'
  //   }
  //   return errors
  // }

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators
      }}
      // validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Field name="diagram">
            {({ input, meta }) => (
              <div>
                <label>Name</label>
                <input {...input} type="text" placeholder="Name" />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          <FieldArray name="tables">
            {({ fields }) => (
              <>
                <button type="button" onClick={() => fields.push({ name: '', columns: [] })}>
                  + Table
                </button>
                {fields.map((name, index) => (
                  <div key={name}>
                    <label>Table:</label>
                    <Field name={`${name}.name`} component="input" placeholder="Name" />
                    <FieldArray name="columns">
                      {({ fields }) => (
                        <>
                          <button type="button" onClick={() => fields.push({ name: '' })}>
                            + Column
                          </button>
                          {fields.map((name, index) => (
                            <div key={name}>
                              <label>Column:</label>
                              <Field name={`${name}.name`} component="input" placeholder="Name" />
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </div>
                ))}
              </>
            )}
          </FieldArray>
          <div className="buttons">
            <button type="submit" disabled={submitting}>
              Submit
            </button>
            <button
              type="button"
              onClick={form.reset}
              disabled={submitting || pristine}
            >
              Reset
            </button>
          </div>
          <pre>{JSON.stringify(values, undefined, 2)}</pre>
        </form>
      )}
    />
  )
}

export default ERDEditorForm
