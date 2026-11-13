import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ConditionsPage from './pages/ConditionsPage'
import PlannerPage from './pages/PlannerPage'
import ChecklistPage from './pages/ChecklistPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConditionsPage />} />
        <Route path="/plan" element={<PlannerPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
      </Routes>
    </BrowserRouter>
  )
}