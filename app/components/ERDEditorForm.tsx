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
      onSubmit={() => {}}
      mutators={{
        ...arrayMutators
      }}
      // validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="border-solid border-2 border-white-100" onSubmit={handleSubmit}>
          <Field name="diagram">
            {({ input, meta }) => (
              <div>
                <input {...input} type="text" placeholder="Diagram Name" />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          <FieldArray name="tables">
            {({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <div className="table-form-group">
                    <div key={name} className="table-form-group-fields">
                      <Field name={`${name}.name`} component="input" placeholder="Table Name" />
                      <FieldArray name={`tables[${index}].columns`}>
                        {({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <div key={name} className="column-form-group">
                                <Field name={`${name}.name`} component="input" placeholder="Name" />
                                <Field name={`${name}.type`} component="input" placeholder="Type" />
                                <Field name={`${name}.keyType`} component="select">
                                  <option value="">🔑</option>
                                  <option value="PK">🔑 PK</option>
                                  <option value="FK">🔑 FK</option>
                                </Field>
                                <button onClick={() => fields.remove(index)}>x</button>
                              </div>
                            ))}
                            <button
                              className="d-block px-8 py-2 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-transparent"
                              type="button"
                              onClick={() => fields.push({ name: '', type: '' })}
                            >
                              New Column
                            </button>
                          </>
                        )}
                      </FieldArray>
                    </div>
                    <button onClick={() => fields.remove(index)}>x</button>
                  </div>
                ))}
                <button
                  className="d-block px-8 py-2 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-transparent"
                  type="button"
                  onClick={() => fields.push({ name: '', columns: [] })}
                >
                  New Table
                </button>
              </>
            )}
          </FieldArray>
          <div className="buttons">
            <button
              className="px-4 py-2 border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              disabled={submitting}
              onClick={form.submit}
              type="button"
            >
              Submit
            </button>
            <button
              className="px-4 py-2 ml-2 border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              disabled={submitting || pristine}
              onClick={form.reset}
              type="button"
            >
              Reset
            </button>
          </div>
          {/* <pre>{JSON.stringify(values, undefined, 2)}</pre> */}
        </form>
      )}
    />
  )
}

export default ERDEditorForm
