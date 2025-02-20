import { useEffect, useRef, useState } from 'react';
import { Camera, Users, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, PresenceTable } from '../../components/ui/';
import { Button } from '../../components/ui/';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { toast } from 'react-hot-toast';
import QrScanner from 'qr-scanner';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { estMarquerPresence, getPresences, scanPresence } from '@/store/slices/presenceSlice';

interface StudentInfo {
  student?: {
    name: string;
    class: string;
  };
  createdAt: string;
  status: string;
}

const VigilDashboard = () => {
  // [État et hooks restent identiques]
  const dispatch = useAppDispatch();
  const { presences, isLoading } = useAppSelector((state) => state.presence);
  const [points, setPoints] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const videoRef = useRef(null);

  // [Tous les useEffects et fonctions restent identiques]
  useEffect(() => {
    const fetch = async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const filter = {
        startDate: startOfDay.toDateString(),
        endDate: endOfDay.toDateString()
      };
      await dispatch(getPresences(filter)).unwrap();
    }
    fetch();
  }, [dispatch]);

  useEffect(() => {
    if (!videoRef.current || !showScanner) return;

    let isScan = false;
    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!isScan) {
          isScan = true;
          try {
            await dispatch(estMarquerPresence(result.data))
              .unwrap()
              .then(async estMarque => {
                if (estMarque) {
                  toast.error('Vous êtes déjà marqué présent');
                  isScan = false;
                } else {
                  await dispatch(scanPresence(result.data))
                    .unwrap()
                    .then(studentData => {
                      setStudentInfo(studentData);
                      setShowScanner(false);
                      isScan = false;
                    });
                }
              });
          } catch (error) {
            toast.error('Erreur lors du scan');
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

  const handleValidatePresence = () => {
    setPoints(prevPoints => prevPoints + 1);
    setStudentInfo(null);
    toast.success('Présence validée +1 !');
  };

  const startScanning = () => {
    setShowScanner(true);
  };

  const stats = presences.reduce(
    (acc, presence) => {
      const status = presence.status.toLowerCase();
      if (status === 'present') acc.present++;
      else if (status === 'late') acc.late++;
      else if (status === 'absent') acc.absent++;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header moderne */}
        <div className="bg-orange-500 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Scanner de Présence
              </h1>
              <p className="text-orange-100 text-sm mt-1">
                Scannez les QR codes pour enregistrer les présences
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-white">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">{points} Scans</span>
                </div>
              </div>
              <Button
                className="bg-white text-orange-500 hover:bg-orange-50 flex-1 sm:flex-none"
                onClick={startScanning}
              >
                <Camera className="w-5 h-5 mr-2" />
                Scanner
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {showScanner ? (
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full aspect-[4/3] object-cover"
                    autoPlay
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-orange-500/30"></div>
                  {isScanning && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Scanner actif</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Présents</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{stats.present}</span>
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Retards</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{stats.late}</span>
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Absents</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{stats.absent}</span>
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-lg">
                <CardHeader className="px-6 py-4 border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
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
            </>
          )}
        </div>

        <Dialog open={studentInfo !== null} onOpenChange={() => setStudentInfo(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="border-b pb-4">
              <DialogTitle>Information de l'apprenant</DialogTitle>
            </DialogHeader>
            {studentInfo && (
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nom</p>
                    <p className="font-medium">{studentInfo.student?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Classe</p>
                    <p className="font-medium">{studentInfo.student?.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Heure d'arrivée</p>
                    <p className="font-medium">{new Date(studentInfo.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Statut</p>
                    <p className="font-medium text-orange-500">{studentInfo.status}</p>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button 
                    className="w-full bg-orange-500 text-white hover:bg-orange-600" 
                    onClick={handleValidatePresence}
                  >
                    Valider la présence
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VigilDashboard;