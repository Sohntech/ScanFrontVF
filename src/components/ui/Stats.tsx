import { Card } from '@/components/ui'

interface StatsProps {
  stats: {
    present: number
    late: number
    absent: number
    total?: number
  }
}

function Stats({ stats }: StatsProps) {
  const presenceRate = stats.total
    ? ((stats.present / stats.total) * 100).toFixed(1)
    : undefined

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-green-800">Présences</h4>
        <p className="text-2xl font-bold text-green-900">{stats.present}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-800">Retards</h4>
        <p className="text-2xl font-bold text-yellow-900">{stats.late}</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-red-800">Absences</h4>
        <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
      </div>
      {presenceRate !== undefined && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800">
            Taux de présence
          </h4>
          <p className="text-2xl font-bold text-blue-900">
            {presenceRate}%
          </p>
        </div>
      )}
    </div>
  )
}

export default Stats