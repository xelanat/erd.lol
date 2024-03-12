'use client'

import MermaidDiagram from '../components/MermaidDiagram'
import ERDEditorForm from '../components/ERDEditorForm'
import { createContext, useEffect, useState } from 'react'

const defaultContextValue = {}
const AppContext = createContext(defaultContextValue)

const HomePage = () => {
  const defaultSavedData = JSON.parse(localStorage.getItem('locally-saved-copy') || '{}')
  const [data, setData] = useState(null)
  const [savedData, setSavedData] = useState(defaultSavedData)
  const [chart, setChart] = useState('')
  const [leftWidth, setLeftWidth] = useState(60)

  const handleFormChange = (erdSyntax: any) => {
    setChart(erdSyntax)
  }

  const handleFormSubmit = (formData: any) => {
    localStorage.setItem('locally-saved-copy', JSON.stringify(formData))
    setSavedData(formData)
  }

  const handleReset = () => {
    localStorage.removeItem('locally-saved-copy')
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
      <div className="flex">
        <div className="left-panel" style={{ width: `${leftWidth}%` }}>
          <MermaidDiagram chart={chart} />
        </div>
        <div className="w-1 bg-gray-200 cursor-col-resize" onMouseDown={(event) => handleMouseDown(event)} />
        <div className="right-panel" style={{ width: `${100 - leftWidth}%` }}>
          <ERDEditorForm savedData={savedData} onChange={handleFormChange} onSubmit={handleFormSubmit} onReset={handleReset} />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default HomePage
