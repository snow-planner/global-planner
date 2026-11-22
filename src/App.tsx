import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ConditionsPage from './pages/ConditionsPage'
import DashboardPage from './pages/DashboardPage'
import { ROUTES } from './constants'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<ConditionsPage />} />
        {/* 세 주소 모두 같은 대시보드 (오른쪽 패널만 달라요) */}
        <Route path={ROUTES.chat} element={<DashboardPage panel={null} />} />
        <Route path={ROUTES.plan} element={<DashboardPage panel="plan" />} />
        <Route path={ROUTES.checklist} element={<DashboardPage panel="checklist" />} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}