import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { estMarquerPresence, getPresences, scanPresence } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
import { toast } from 'react-hot-toast'
import QrScanner from 'qr-scanner'

function VigilDashboard() {
  const dispatch = useAppDispatch()
  const { presences, isLoading } = useAppSelector((state) => state.presence)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null)


  useEffect(()=>{
    const fetch = async()=>{
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Début de la journée
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Fin de la journée
      const filter = {startDate:startOfDay.toDateString(), endDate:endOfDay.toDateString()};
      console.log(filter);
      await dispatch(getPresences(filter)).unwrap().then(dt=>{
        console.log(dt)
      });
    }
    fetch();
  }, [])

  useEffect(() => {
    if (!videoRef.current) return
    let isScan = false;
    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        console.log("contenu qrcode",result.data, isScan);
        if(!isScan){
          isScan = true;
          try {
            await dispatch(estMarquerPresence(result.data)).unwrap().then(async estMarquerPresence=>{
              if(estMarquerPresence){
                toast.error('Vous êtes déjà marquer présent');
                isScan = false;
              }else{
                await dispatch(scanPresence(result.data)).unwrap().then(_=>{isScan = false;});
                toast.success('Présence enregistrée')
              }
            });  
          } catch (error) {
            toast.error('Erreur lors du scan')
          }
        }else{
          // console.log('QR Code détecté mais déjà enregistré:', result)
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
