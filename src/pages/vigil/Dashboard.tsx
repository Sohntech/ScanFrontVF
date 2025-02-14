import { useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { scanPresence } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
import Webcam from 'react-webcam'
import { toast } from 'react-hot-toast'
import QrScanner from 'qr-scanner'

function VigilDashboard() {
  const dispatch = useAppDispatch()
  const { presences, isLoading } = useAppSelector((state) => state.presence)
  const webcamRef = useRef<Webcam>(null)
  const [scanning, setScanning] = useState(false)

  const handleScan = useCallback(async () => {
    if (!webcamRef.current) return

    try {
      setScanning(true)
      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) return

      const blob = await fetch(imageSrc).then((res) => res.blob())
      const result = await QrScanner.scanImage(blob)
      
      if (result) {
        await dispatch(scanPresence(result)).unwrap()
        toast.success('Présence enregistrée')
      }
    } catch (error) {
      toast.error('Erreur lors du scan')
    } finally {
      setScanning(false)
    }
  }, [dispatch])

  const stats = presences.reduce(
    (acc, presence) => {
      acc[presence.status.toLowerCase()]++
      return acc
    },
    { present: 0, late: 0, absent: 0 }
  )

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Scanner de présence
        </h2>

        {/* Scanner */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
              videoConstraints={{
                width: 720,
                height: 720,
                facingMode: 'environment',
              }}
            />
            <button
              onClick={handleScan}
              disabled={scanning || isLoading}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-primary hover:bg-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-primary disabled:opacity-50"
            >
              {scanning ? 'Scan en cours...' : 'Scanner le QR Code'}
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <Stats stats={stats} />

        {/* Liste des derniers scans */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Derniers scans
          </h3>
          <PresenceTable 
            presences={presences.slice(0, 10)} 
            isLoading={isLoading} 
          />
        </div>
      </Card>
    </div>
  )
}

export default VigilDashboard