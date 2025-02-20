import { useEffect, useRef, useState } from 'react';
import { Clock, Award, ArrowLeft, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { PresenceTable } from '@/components/ui/';
import { toast } from 'react-hot-toast';
import QrScanner from 'qr-scanner';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { estMarquerPresence, getPresences, scanPresence } from '@/store/slices/presenceSlice';

const VigilDashboard = () => {
  const dispatch = useAppDispatch();
  const { presences, isLoading } = useAppSelector((state) => state.presence);
  const [points, setPoints] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);

  // Même logique useEffect...
  useEffect(() => {
    const fetch = async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const filter = { startDate: startOfDay.toDateString(), endDate: endOfDay.toDateString() };
      await dispatch(getPresences(filter)).unwrap();
    }
    fetch();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !showScanner) return;
    let isScan = false;

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!isScan) {
          isScan = true;
          try {
            await dispatch(estMarquerPresence(result.data)).unwrap().then(async estMarquerPresence => {
              if (estMarquerPresence) {
                toast.error('Déjà marqué présent');
                isScan = false;
              } else {
                await dispatch(scanPresence(result.data)).unwrap();
                toast.success('Présence enregistrée');
                setPoints(prev => prev + 10);
                isScan = false;
              }
            });
          } catch (error) {
            toast.error('Erreur de scan');
            isScan = false;
          }
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start();
    setIsScanning(true);

    return () => {
      scanner.stop();
      setIsScanning(false);
    };
  }, [dispatch, showScanner]);

  const stats = presences.reduce(
    (acc, presence) => {
      const status = presence.status.toLowerCase() as 'present' | 'late' | 'absent';
      acc[status]++;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {showScanner ? (
        <div className="h-screen flex flex-col">
          
          {/* Scanner Header Modernisé */}
          <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 p-4 flex items-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowScanner(false)}
              className="text-white hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-lg font-semibold text-white">Scanner QR Code</h2>
          </div>

          {/* Scanner View Modernisé */}
          <div className="flex-1 relative bg-black">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              autoPlay 
              playsInline
              muted 
            />
            <div className="absolute inset-0">
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 relative">
                    {/* Effet de scan futuriste */}
                    <div className="absolute inset-0 border-2 border-cyan-500 rounded-lg animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent animate-scan" />
                    </div>
                    {/* Coins futuristes */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500 rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500 rounded-br" />
                  </div>
                </div>
              </div>
            </div>
            {isScanning && (
              <div className="absolute bottom-safe inset-x-0 p-4 flex justify-center">
                <div className="bg-slate-800/80 backdrop-blur px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white">Scanner actif</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Header Modernisé */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Scanner de Présence</h1>
                <div className="bg-slate-700/50 backdrop-blur rounded-2xl px-4 py-2 text-white flex items-center gap-3">
                  <Award className="w-6 h-6 text-cyan-400" />
                  <span className="font-bold text-lg">{points} pts</span>
                </div>
              </div>
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20 transition-all duration-300"
                size="lg"
                onClick={() => setShowScanner(true)}
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scanner un QR Code
              </Button>
            </div>
          </div>

          {/* Stats Grid Modernisé */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
              <CardContent className="p-4">
                <div className="text-emerald-400">
                  <p className="text-sm font-medium">Présents</p>
                  <p className="text-3xl font-bold mt-1">{stats.present}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
              <CardContent className="p-4">
                <div className="text-amber-400">
                  <p className="text-sm font-medium">Retards</p>
                  <p className="text-3xl font-bold mt-1">{stats.late}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
              <CardContent className="p-4">
                <div className="text-rose-400">
                  <p className="text-sm font-medium">Absents</p>
                  <p className="text-3xl font-bold mt-1">{stats.absent}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Scans Modernisé */}
          <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-xl">
            <CardHeader className="p-4 border-b border-slate-700">
              <CardTitle className="text-base flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-cyan-400" />
                Derniers scans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <PresenceTable 
                  presences={presences.slice(0, 10)} 
                  isLoading={isLoading} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VigilDashboard;