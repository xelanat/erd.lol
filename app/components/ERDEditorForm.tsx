import {
  filter,
  forEach,
  includes,
  isEmpty,
  map,
  set,
} from 'lodash'
import React from 'react'
import { Form, Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'

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

    if (isEmpty(title)) {
      set(errors, 'title', 'Title must not be empty.')
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
    const titleHeader = title ? `---\ntitle: ${title}\n---\n`: ''
    const header = `${titleHeader}erDiagram\n`

    // Write tables
    const { tables, relationships } = values
    const tablesBody = map(tables, (table: any) => (
      `${table.name} { ` + map(table.columns, (column: any) => (
        filter([column.type, column.name, column.keyType], (item: any) => item).join(' ')
      )).join(' ') + ' }'
    )).join(' ')
    return `${header} ${tablesBody}`.trim()
  }
  

  const onFormChange = (data: any) => {
    const { errors, values } = data
    // console.log(data)
    if (isEmpty(errors)) {
      onChange(toMermaid(values))
    }
  }

  return (
    <Form
      onSubmit={() => {}}
      mutators={{ ...arrayMutators }}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="border-solid border-white-100 p-5" onSubmit={handleSubmit}>
          <Field name="title">
            {({ input, meta }) => (
              <div>
                <input {...input} type="text" placeholder="Diagram Name" />
                {meta.error && meta.touched && <span className="text-red-500">{meta.error}</span>}
              </div>
            )}
          </Field>
          <FieldArray name="tables">
            {({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <div key={name} className="table-form-group">
                    <div className="table-form-group-fields">
                      <Field name={`${name}.name`} component="input" placeholder="Table Name">
                        {({ input, meta }) => (
                          <div>
                            <input {...input} className="w-full" type="text" placeholder="Table Name" />
                            {meta.error && meta.touched && <span className="text-red-500">{meta.error}</span>}
                          </div>
                        )}
                      </Field>
                      <FieldArray name={`tables[${index}].columns`}>
                        {({ fields, meta }) => (
                          <>
                            {fields.map((name, index) => (
                              <>
                                <div key={name} className="column-form-group">
                                  <Field name={`${name}.type`} component="input" placeholder="Type" />
                                  <Field name={`${name}.name`} component="input" placeholder="Name" />
                                  <Field name={`${name}.keyType`} component="select">
                                      <option value="">🔑</option>
                                      <option value="PK">🔑 PK</option>
                                      <option value="FK">🔑 FK</option>
                                  </Field>
                                  <button
                                    className="d-block px-8 py-2 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-transparent"
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                  >
                                    x
                                  </button>
                                </div>
                                <div>
                                  {meta.error && map(meta.error[index], (error, key) => <div key={key} className="text-red-500">{error}</div>)}
                                </div>
                              </>
                            ))}
                            <button
                              className="d-block w-full px-8 py-2 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-transparent"
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
                      className="d-block px-8 py-2 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-transparent"
                      type="button"
                      onClick={() => fields.remove(index)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  className="d-block px-8 py-2 text-grey font-bold transition duration-200 hover:bg-white hover:text-black border-transparent"
                  type="button"
                  onClick={() => fields.push({ name: '', columns: [] })}
                >
                  New Table
                </button>
              </>
            )}
          </FieldArray>
          <FormSpy onChange={onFormChange} />
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
