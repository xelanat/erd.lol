import arrayMutators from 'final-form-arrays'
import { filter, forEach, get, includes, isEmpty, map, set } from 'lodash'
import React from 'react'
import { Form, Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { adjectives, animals, colors, Config, uniqueNamesGenerator } from 'unique-names-generator'

const config: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  seed: `mermaid diagrams are quite awesome ${Date.now()}`,
}

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

interface FormData {
  tables: Array<any>
  title: string
  relationships: Array<any>
}

interface ERDEditorFormProps {
  onChange: (data: any) => void
  onSubmit: (data: any) => void
}

const ERDEditorForm: React.FC<ERDEditorFormProps> = ({ onChange, onSubmit }) => {
  const validate = (values: FormData) => {
    const errors: Partial<FormData> = {}
    const { tables, title, relationships } = values
    const reName = /^\w+$/

    if (isEmpty(title) && isEmpty(tables)) {
      set(errors, 'title', 'Please enter a title to begin.')
    }

    if (isEmpty(title) && !isEmpty(tables)) {
      set(errors, 'title', 'Title cannot be empty.')
    }

    forEach(tables, (table, tableIndex) => {
      const { columns, name: tableName } = table
      if (!(tableName || '').match(reName)) {
        set(errors, `tables[${tableIndex}].name`, 'Invalid or empty table name.')
      }
      forEach(columns, (column, columnIndex) => {
        const { name: columnName, type: columnType, keyType: columnKeyType } = column
        if (!(columnName || '').match(reName)) {
          set(errors, `tables[${tableIndex}].columns[${columnIndex}].name`, 'Column must have a name.')
        }
        if (!(columnType || '').match(reName)) {
          set(errors, `tables[${tableIndex}].columns[${columnIndex}].type`, 'Column must have a type.')
        }
        if (!isEmpty(columnKeyType) && !includes(['FK', 'PK'], columnKeyType)) {
          set(errors, `tables[${tableIndex}].columns[${columnIndex}].keyType`, 'Must be either FK or PK.')
        }
      })
    })
    return errors
  }

  const toMermaid = (values: any) => {
    const defaultMessage = 'your table here 😊'
    const title = isEmpty(values) ? defaultMessage : values.title
    // Define diagram title and type
    const titleHeader = title ? `---\ntitle: ${title}\n---\n` : ''
    const header = `${titleHeader}erDiagram\n`

    // Write tables
    const { tables, relationships } = values
    const tablesBody = map(
      tables,
      (table: any) =>
        `${table.name} { ` +
        map(table.columns, (column: any) =>
          filter([column.type, column.name, column.keyType], (item: any) => item).join(' ')
        ).join(' ') +
        ' }'
    ).join(' ')
    return `${header} ${tablesBody}`.trim()
  }

  const onFormChange = (data: any) => {
    const { errors, values } = data
    if (isEmpty(errors)) {
      onChange(toMermaid(values))
    }
  }

  // Initial form values for react-final-form
  const initialValues = { title: uniqueNamesGenerator(config) }

  return (
    <Form
      initialValues={initialValues}
      onSubmit={() => {}}
      mutators={{ ...arrayMutators }}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="p-5 overflow-x-auto" onSubmit={handleSubmit}>
          <Field name="title">
            {({ input, meta }) => (
              <div>
                <input
                  {...input}
                  className="w-full p-2 hover:border-gray-400 hover:border-solid border-2 border-transparent"
                  type="text"
                  placeholder="Diagram Name"
                />
                {meta.error && <span className="text-xs text-purple-500">{meta.error}</span>}
              </div>
            )}
          </Field>
          <FieldArray name="tables">
            {({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <div key={name} className="d-block flex my-2 ">
                    <div>
                      <Field name={`${name}.name`} component="input" placeholder="Table Name">
                        {({ input, meta }) => (
                          <div className="hover:border-gray-400 hover:border-solid border-2">
                            <input {...input} className="w-full p-1 " type="text" placeholder="Table Name" />
                            <div className="bg-white text-xs text-gray-400">Table Name</div>
                            {meta.error && <span className="text-xs text-red-500">{meta.error}</span>}
                          </div>
                        )}
                      </Field>
                      <FieldArray name={`tables[${index}].columns`}>
                        {({ fields, meta }) => (
                          <>
                            {fields.map((name, index) => (
                              <>
                                <div key={name} className="flex">
                                  <Field
                                    className="flex-1 hover:border-gray-400 hover:border-solid border-2"
                                    name={`${name}.type`}
                                    component="input"
                                    placeholder="Type"
                                  >
                                    {({ input }) => (
                                      <div className="hover:border-gray-400 hover:border-solid border-2">
                                        <input {...input} placeholder="Type" />
                                        <div className="bg-white text-xs text-gray-400">Column Type</div>
                                      </div>
                                    )}
                                  </Field>
                                  <Field
                                    className="flex-1 hover:border-gray-400 hover:border-solid border-2"
                                    name={`${name}.name`}
                                    component="input"
                                    placeholder="Name"
                                  >
                                    {({ input }) => (
                                      <div className="hover:border-gray-400 hover:border-solid border-2">
                                        <input {...input} placeholder="Name" />
                                        <div className="bg-white text-xs text-gray-400">Column Name</div>
                                      </div>
                                    )}
                                  </Field>
                                  <Field
                                    className="flex-1 hover:border-gray-400 hover:border-solid border-2"
                                    name={`${name}.keyType`}
                                    component="select"
                                  >
                                    {({ input }) => (
                                      <div className="hover:border-gray-400 hover:border-solid border-2">
                                        <select {...input}>
                                          <option value=""></option>
                                          <option value="PK">PK</option>
                                          <option value="FK">FK</option>
                                        </select>
                                        <div className="bg-white text-xs text-gray-400">Key</div>
                                      </div>
                                    )}
                                  </Field>
                                  <button
                                    className="flex-initial p-2 font-bold transition duration-200 hover:bg-white hover:text-black"
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                  >
                                    <XIcon aria-hidden="true" />
                                  </button>
                                </div>
                                <div>
                                  {get(meta.error, index) &&
                                    map(meta.error[index], (error, key) => (
                                      <div key={key} className="text-xs text-red-500">
                                        {error}
                                      </div>
                                    ))}
                                </div>
                              </>
                            ))}
                            <button
                              className="w-full p-2 font-bold transition duration-200 hover:bg-white hover:text-black"
                              type="button"
                              onClick={() => fields.push({ name: '', type: '' })}
                            >
                              New Column
                            </button>
                          </>
                        )}
                      </FieldArray>
                    </div>
                    <button
                      className="p-4 font-bold transition duration-200 hover:bg-white hover:text-black"
                      type="button"
                      onClick={() => fields.remove(index)}
                    >
                      <XIcon aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button
                  className="w-full p-2 font-bold transition duration-200 hover:bg-white hover:text-black"
                  type="button"
                  onClick={() => fields.push({ name: '', columns: [] })}
                >
                  New Table
                </button>
              </>
            )}
          </FieldArray>
          <FormSpy onChange={onFormChange} />
          <div className="my-2">
            <button
              className="px-4 py-2 border border-neutral-300 bg-neutral-100 text-neutral-500 text-xs hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              disabled={submitting}
              onClick={form.submit}
              type="button"
            >
              Save
            </button>
            <button
              className="px-4 py-2 ml-2 border border-neutral-300 bg-neutral-100 text-neutral-500 text-xs hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              disabled={submitting || pristine}
              onClick={() => form.reset()}
              type="button"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    />
  )
}

export default ERDEditorForm
