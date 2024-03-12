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
    strokeWidth={1}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 inline">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
)

interface FormData {
  tables: Array<any>
  title: string
  relationships: Array<any>
}

interface ERDEditorFormProps {
  savedData: Object
  onChange: (erdSyntax: any) => void
  onSubmit: (data: any) => void
  onReset: () => void
}

const ERDEditorForm: React.FC<ERDEditorFormProps> = ({ savedData, onChange, onSubmit, onReset }) => {
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

    forEach(relationships, (relationship, relationshipIndex) => {
      const { from, fromConnector, to, toConnector, verb } = relationship
      if (!(from || '').match(reName)) {
        set(errors, `relationship[${relationshipIndex}].from`, 'Empty "from" table.')
      }
      if (verb && !(verb || '').match(reName)) {
        set(errors, `relationship[${relationshipIndex}].verb`, 'Invalid verb for relationship.')
      }
      if (!(to || '').match(reName)) {
        set(errors, `relationship[${relationshipIndex}].to`, 'Empty "to" table.')
      }
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
    const relationshipBody = map(
      relationships,
      (relationship: any) => {
        const { from, fromConnector, to, toConnector, verb } = relationship
        const [defaultFromConnector, defaultToConnector, defaultVerb] = ['||', '||', '""']
        return `${from} ${fromConnector || defaultFromConnector}--${toConnector || defaultToConnector} ${to} : ${verb || defaultVerb}`
      }
    ).join(' ')

    return `${header} ${tablesBody} ${relationshipBody}`.trim()
  }

  const onFormChange = (data: any) => {
    const { errors, values } = data
    if (isEmpty(errors)) {
      onChange(toMermaid(values))
    }
  }

  // Initial form values for react-final-form
  const initialValues = isEmpty(savedData) ? { title: uniqueNamesGenerator(config) } : savedData

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      validate={validate}
      render={({ handleSubmit, form, submitting, values }) => (
        <form className="py-4 overflow-x-auto" onSubmit={handleSubmit}>
          <Field name="title">
            {({ input, meta }) => (
              <div className="flex justify-start m-2">
                <div>
                  <input
                    {...input}
                    className="w-full p-2 font-bold hover:border-gray-400 hover:border-solid border-2 border-transparent"
                    type="text"
                    placeholder="Diagram Name"
                  />
                  {meta.error && <span className="text-xs text-purple-500">⚠️&nbsp;{meta.error}</span>}
                </div>
                <button
                  className="px-4 p-2 ml-2 bg-neutral-100 text-black-500 text-xs cursor-pointer transform transition duration-200 hover:bg-green-500 hover:text-white hover:-translate-y-1 hover:shadow-sm hover:rounded"
                  disabled={submitting}
                  onClick={form.submit}
                  type="button"
                >
                  <SaveIcon />
                </button>
                <button
                  className="p-2 ml-2 bg-neutral-100 text-black-500 text-xs cursor-pointer transform transition duration-200 hover:bg-red-500 hover:text-white hover:-translate-y-1 hover:shadow-sm"
                  disabled={submitting}
                  onClick={() => {
                      form.reset({})
                      onReset()
                      window.location.href = window.location.href
                  }}
                  type="button"
                >
                  Reset
                </button>
              </div>
            )}
          </Field>
          <div className="my-4 h-1 bg-gray-200" />
          <FieldArray name="tables">
            {({ fields }) => (
              <div className="m-2">
                {fields.map((name, index) => (
                  <div key={name} className="d-block flex my-2">
                    <div>
                      <Field name={`${name}.name`} component="input" placeholder="Table Name">
                        {({ input, meta }) => (
                          <div className="hover:border-gray-400 hover:border-solid border-2 hover:rounded">
                            <input {...input} className="w-full p-1 font-bold text-sm" type="text" placeholder="Table Name" />
                            {/* {!input.value && <div className="bg-white text-xs text-gray-400">table name</div>} */}
                            {meta.error && <span className={`text-xs text-purple-500`}>⚠️&nbsp;{meta.error}</span>}
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
                                    name={`${name}.type`}
                                    component="input"
                                    placeholder="Type"
                                  >
                                    {({ input }) => (
                                      <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                        <input {...input} placeholder="Type" className="text-sm border-none" />
                                        <div className="text-xs text-gray-400 border-none">column type</div>
                                      </div>
                                    )}
                                  </Field>
                                  <Field
                                    name={`${name}.name`}
                                    component="input"
                                    placeholder="Name"
                                  >
                                    {({ input }) => (
                                      <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                        <input {...input} placeholder="Name" className="text-sm"/>
                                        <div className="text-xs text-gray-400 border-none">column name</div>
                                      </div>
                                    )}
                                  </Field>
                                  <Field
                                    name={`${name}.keyType`}
                                    component="select"
                                  >
                                    {({ input }) => (
                                      <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                        <select {...input} className="text-sm" >
                                          <option value=""></option>
                                          <option value="PK">PK</option>
                                          <option value="FK">FK</option>
                                        </select>
                                        <div className="text-xs text-gray-400">key</div>
                                      </div>
                                    )}
                                  </Field>
                                  <button
                                    className="flex-initial p-2 transition duration-200 hover:bg-white hover:text-black"
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                  >
                                    <XIcon aria-hidden="true" />
                                  </button>
                                </div>
                                <div>
                                  {get(meta.error, index) && 
                                    map(meta.error[index], (error, key) => (
                                      <div key={key} className={`text-xs text-purple-500`}>
                                        ⚠️&nbsp;{error}
                                      </div>
                                    ))}
                                </div>
                              </>
                            ))}
                            <button
                              className="w-full p-2 font-bold text-xs text-gray-500 transition duration-200 hover:bg-white hover:text-black"
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
                      className="p-4 text-xs transition duration-200 hover:bg-white hover:text-black"
                      type="button"
                      onClick={() => fields.remove(index)}
                    >
                      <XIcon aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button
                  className="w-full p-2 font-bold text-xs text-gray-500 transition duration-200 hover:bg-white hover:text-black"
                  type="button"
                  onClick={() => fields.push({ name: '', columns: [] })}
                >
                  New Table
                </button>
              </div>
            )}
          </FieldArray>
          <div className="my-4 h-1 bg-gray-200" />
          <div>
          {
            get(values.tables, 0)?.name &&
            <div className="m-2">
              <FieldArray name="relationships">
                {({ fields, meta }) => (
                  <>
                    {fields.map((name, index) => (
                      <div key={index}>
                        <div className="flex">
                          <Field name={`${name}.from`} component="select">
                            {({ input }) => (
                              <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                <select {...input} className="text-sm" >
                                  <option value=""></option>
                                  {map(values.tables, (table) => <option key={table.name} value={table.name}>{table.name}</option>)}
                                </select>
                                <div className="text-xs text-gray-400">from</div>
                              </div>
                            )}
                          </Field>
                          <Field name={`${name}.fromConnector`} component="select">
                          {({ input }) => (
                              <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                <select {...input} className="text-sm" >
                                  <option value=""></option>
                                  <option value="||">one and only one</option>
                                  <option value="|o">zero or one</option>
                                  <option value="}|">one or many</option>
                                  <option value="}o">zero or many</option>
                                </select>
                                <div className="text-xs text-gray-400">from connector</div>
                              </div>
                            )}
                          </Field>
                          <Field
                            name={`${name}.verb`}
                            component="input"
                          >
                            {({ input }) => (
                              <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                <input {...input} placeholder="Has" className="text-sm border-none" />
                                <div className="text-xs text-gray-400 border-none">verb</div>
                              </div>
                            )}
                          </Field>
                          <Field name={`${name}.toConnector`} component="select">
                          {({ input }) => (
                              <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                <select {...input} className="text-sm" >
                                  <option value=""></option>
                                  <option value="||">one and only one</option>
                                  <option value="o|">zero or one</option>
                                  <option value="|{">one or many</option>
                                  <option value="o{">zero or many</option>
                                </select>
                                <div className="text-xs text-gray-400">to connector</div>
                              </div>
                            )}
                          </Field>
                          <Field name={`${name}.to`} component="select">
                            {({ input }) => (
                              <div className="border-transparent border-2 hover:border-gray-400 hover:rounded">
                                <select {...input} className="text-sm" >
                                  <option value=""></option>
                                  {map(values.tables, (table) => <option key={table.name} value={table.name}>{table.name}</option>)}
                                </select>
                                <div className="text-xs text-gray-400">to</div>
                              </div>
                            )}
                          </Field>
                          <button
                            className="p-4 text-xs transition duration-200 hover:bg-white hover:text-black"
                            type="button"
                            onClick={() => fields.remove(index)}
                          >
                            <XIcon aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="w-full p-2 font-bold text-xs text-gray-500 transition duration-200 hover:bg-white hover:text-black"
                      type="button"
                      onClick={() => fields.push({ from: '', fromConnector: '', to: '', toConnector: '' })}
                    >
                      New Relationship
                    </button>
                  </>
                )}
              </FieldArray>
            </div>
          }
          </div>
          <FormSpy onChange={onFormChange} />
        </form>
      )}
    />
  )
}

export default ERDEditorForm
