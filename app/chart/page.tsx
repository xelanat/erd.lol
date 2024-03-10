"use client"

import MermaidDiagram from '../components/MermaidDiagram'
import ERDEditorForm from '../components/ERDEditorForm'
import { createContext, useContext, useState } from 'react'

const defaultContextValue = {}
const AppContext = createContext(defaultContextValue)

const HomePage = () => {
  const [chart, setChart] = useState('')

  const handleFormChange = (erdFromFormData: any) => setChart(erdFromFormData)
  // const handleFormChange = () => {}

  const handleFormSubmit = (formData: any) => {
    console.log('Form data:', formData)
    // Here, you can update the chart state based on form input if needed
  }

  const contextValue = { ...defaultContextValue, theme: 'light' }

  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '50%' }}>
          <MermaidDiagram chart={chart} />
        </div>
        <div style={{ width: '50%' }}>
          <ERDEditorForm onChange={handleFormChange} onSubmit={handleFormSubmit} />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default HomePage
