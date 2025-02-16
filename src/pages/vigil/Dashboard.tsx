import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { scanPresence } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
import { toast } from 'react-hot-toast'
import QrScanner from 'qr-scanner'

function VigilDashboard() {
  const dispatch = useAppDispatch()
  const { presences, isLoading } = useAppSelector((state) => state.presence)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null)

  useEffect(() => {
    if (!videoRef.current) return

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        console.log('QR Code détecté:', result)
        try {
          await dispatch(scanPresence(result.data)).unwrap()
          toast.success('Présence enregistrée')
        } catch (error) {
          toast.error('Erreur lors du scan')
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    )

    scanner.start()
    setQrScanner(scanner)

    return () => {
      scanner.stop()
    }
  }, [dispatch])

  const stats = presences.reduce(
    (acc, presence) => {
      const status = presence.status.toLowerCase() as 'present' | 'late' | 'absent';
      acc[status]++;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  )

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Scanner de présence
        </h2>

        {/* Scanner QR Code */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <video ref={videoRef} className="w-full rounded-lg" autoPlay muted />
          </div>
        </div>

        {/* Statistiques */}
        <Stats stats={stats} />

        {/* Liste des derniers scans */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Derniers scans
          </h3>
          <PresenceTable presences={presences.slice(0, 10)} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  )
}

export default VigilDashboard
