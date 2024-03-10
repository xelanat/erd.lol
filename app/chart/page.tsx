"use client"

import MermaidDiagram from '../components/MermaidDiagram'
import ERDEditorForm from '../components/ERDEditorForm'
import { createContext, useContext, useState } from 'react'

const defaultContextValue = {}
const AppContext = createContext(defaultContextValue)

const HomePage = () => {
  const [chart, setChart] = useState('')
  const [leftWidth, setLeftWidth] = useState(50)

  const handleFormChange = (erdFromFormData: any) => setChart(erdFromFormData)

  const handleFormSubmit = (formData: any) => {
    console.log('Form data:', formData)
  }

  const handleMouseDown = (event: any) => {
    event.preventDefault()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: any) => {
    const newLeftWidth = (event.clientX / window.innerWidth) * 100
    setLeftWidth(newLeftWidth)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const contextValue = { ...defaultContextValue, theme: 'light' }

  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: `${leftWidth}%` }}>
          
          <MermaidDiagram chart={chart} />
        </div>
        <div className="w-1 bg-gray-400 cursor-col-resize" onMouseDown={(event) => handleMouseDown(event)} />
        <div style={{ width: `${100 - leftWidth}%` }}>
          <ERDEditorForm onChange={handleFormChange} onSubmit={handleFormSubmit} />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default HomePage
