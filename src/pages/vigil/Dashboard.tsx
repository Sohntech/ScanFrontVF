import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { estMarquerPresence, getPresences, scanPresence } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
import { toast } from 'react-hot-toast'
import QrScanner from 'qr-scanner'
import { Camera,  Users, Clock} from 'lucide-react'

function VigilDashboard() {
  const dispatch = useAppDispatch()
  const { presences, isLoading } = useAppSelector((state) => state.presence)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [, setQrScanner] = useState<QrScanner | null>(null)
  const [isScanning, setIsScanning] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const filter = { startDate: startOfDay.toDateString(), endDate: endOfDay.toDateString() };
      await dispatch(getPresences(filter)).unwrap();
    }
    fetch();
  }, [])

  useEffect(() => {
    if (!videoRef.current) return
    let isScan = false;
    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!isScan) {
          isScan = true;
          try {
            await dispatch(estMarquerPresence(result.data)).unwrap().then(async estMarquerPresence => {
              if (estMarquerPresence) {
                toast.error('Vous êtes déjà marqué présent');
                isScan = false;
              } else {
                await dispatch(scanPresence(result.data)).unwrap().then(_ => { isScan = false; });
                toast.success('Présence enregistrée')
              }
            });
          } catch (error) {
            toast.error('Erreur lors du scan')
          }
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    )

    scanner.start()
    setQrScanner(scanner)
    setIsScanning(true)

    return () => {
      scanner.stop()
      setIsScanning(false)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Scanner de Présence
                </h1>
                <p className="text-orange-100">
                  Scannez les QR codes pour enregistrer les présences
                </p>
              </div>
              <Camera className="w-12 h-12 text-white opacity-80" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card className="p-6 bg-white shadow-xl rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Camera className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Scanner QR Code
              </h2>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black">
              <video 
                ref={videoRef} 
                className="w-full h-[400px] object-cover"
                autoPlay 
                muted 
              />
              <div className="absolute inset-0 border-4 border-orange-500 opacity-50 pointer-events-none"></div>
              {isScanning && (
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Scanner actif</span>
                </div>
              )}
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="p-6 bg-white shadow-xl rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Statistiques du jour
              </h2>
            </div>
            <Stats stats={stats} />

           
          </Card>
        </div>

        {/* Recent Scans */}
        <Card className="p-6 bg-white shadow-xl rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Derniers scans
            </h2>
          </div>
          <div className="overflow-x-auto">
            <PresenceTable 
              presences={presences.slice(0, 10)} 
              isLoading={isLoading} 
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VigilDashboard