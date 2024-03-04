"use client"

import MermaidDiagram from '../components/MermaidDiagram'
import ERDEditorForm from '../components/ERDEditorForm'
import { useState } from 'react'

const hierarchyFlowchart = `
  erDiagram
  Users {
    int id PK "User ID"
    string name "User Name"
    string email "Email Address"
  }

  Orders {
    int id PK "Order ID"
    int userId FK "User ID"
    date orderDate "Order Date"
    string status "Order Status"
  }

  Products {
    int id PK "Product ID"
    string name "Product Name"
    decimal price "Price"
  }

  Users ||--o{ Orders : "has"
  Orders ||--o{ Products : "contains"
`

const HomePage = () => {
  const [chart, setChart] = useState(hierarchyFlowchart)

  const handleFormSubmit = (formData: any) => {
    console.log('Form data:', formData)
    // Here, you can update the chart state based on form input if needed
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '75%' }}>
        <MermaidDiagram chart={chart} />
      </div>
      <div style={{ width: '25%' }}>
        <ERDEditorForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  )
}

export default HomePage
