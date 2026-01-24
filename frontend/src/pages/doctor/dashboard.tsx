import { useAuth } from '@/context/AuthContext'
import PatientDetailsModal from '@/components/PatientDetailsModal'
import { useState } from 'react'
import NewConsultationCard from '@/components/audioRecorder/NewConsultationCard'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user } = useAuth()
const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, Dr. {user?.name || 'User'}
          </h1>
          <p className="text-gray-600 mt-2">{user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Appointments Today</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Pending Reports</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
         <Button onClick={() => setOpen(true)}>New Consultation</Button>
         <PatientDetailsModal open={open} onClose={() => setOpen(false)} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity to display</p>
        </div>
      </div>
    </div>
  )
}