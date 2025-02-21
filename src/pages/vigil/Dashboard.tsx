import { useEffect, useRef, useState } from 'react';
import { Camera, Users, Clock, Award, AlertCircle, UserCircle2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, PresenceTable } from '../../components/ui/';
import { Badge } from '../../components/ui/badge';
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
    referential: string;
    photoUrl?: string;
  };
  createdAt: string;
  status: string;
}

const VigilDashboard = () => {
  const dispatch = useAppDispatch();
  const { presences, isLoading } = useAppSelector((state) => state.presence);
  const [points, setPoints] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [lastScannedStudent, setLastScannedStudent] = useState<StudentInfo | null>(null);
  const videoRef = useRef(null);

  // Récupérer les présences
  const fetchPresences = async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const filter = {
      startDate: startOfDay.toDateString(),
      endDate: endOfDay.toDateString()
    };
    await dispatch(getPresences(filter)).unwrap();
  };

  useEffect(() => {
    fetchPresences();
  }, [dispatch]);

  // Mettre à jour les données après un scan réussi
  const handleSuccessfulScan = async (studentData: StudentInfo) => {
    setLastScannedStudent(studentData);
    setStudentInfo(studentData);
    setShowScanner(false);
    // Rafraîchir la liste des présences
    await fetchPresences();
  };

  useEffect(() => {
    if (!videoRef.current || !showScanner) return;

    let isScan = false;
    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!isScan) {
          isScan = true;
          try {
            const estMarque = await dispatch(estMarquerPresence(result.data)).unwrap();

            if (estMarque) {
              toast.error('Cet apprenant est déjà marqué présent');
              isScan = false;
            } else {
              const studentData = await dispatch(scanPresence(result.data)).unwrap();
              await handleSuccessfulScan(studentData);
              isScan = false;
            }
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

  const handleValidatePresence = async () => {
    if (lastScannedStudent) {
      setPoints(prevPoints => prevPoints + 1);
      setStudentInfo(null);
      toast.success('Présence validée +1 !');
      // Rafraîchir la liste des présences
      await fetchPresences();
    }
  };

  const startScanning = () => {
    setShowScanner(true);
    setStudentInfo(null);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header responsive */}
        <div className="bg-orange-500 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Scanner de Présence
                </h1>
                <p className="text-orange-100 text-sm mt-1">
                  Scannez les QR codes pour enregistrer les présences
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 text-white flex-1 sm:flex-none">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{points} Scans</span>
                  </div>
                </div>
                <Button
                  className="bg-white text-orange-500 hover:bg-orange-50 flex-1 sm:flex-none text-sm sm:text-base px-3 py-2 h-auto"
                  onClick={startScanning}
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Scanner
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm">Scanner actif</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Présents</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.present}</span>
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Retards</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.late}</span>
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Absents</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.absent}</span>
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-lg">
                <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
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
          <DialogContent className="sm:max-w-lg mx-4">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl font-semibold">Validation de présence</DialogTitle>
            </DialogHeader>
            {studentInfo && (
              <div className="py-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  {/* Photo de l'apprenant */}
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {studentInfo.student?.photoUrl ? (
                      <img
                        src={`data:image/jpeg;base64,${studentInfo.student.photoUrl}`}
                        alt={studentInfo.student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-50">
                        <UserCircle2 className="w-16 h-16 text-orange-300" />
                      </div>
                    )}
                  </div>

                  {/* Informations de l'apprenant */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {studentInfo.student?.name}
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">Référentiel:</span>
                        </div>
                        <span className="font-medium">{studentInfo.student?.referential || "Non spécifié"}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Heure d'arrivée:</span>
                        </div>
                        <span className="font-medium">
                          {new Date(studentInfo.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Statut:</span>
                        </div>
                        <Badge
                          className={`${getStatusColor(studentInfo.status)} capitalize px-3 py-1`}
                        >
                          {studentInfo.status.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-8">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => setStudentInfo(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none bg-orange-500 text-white hover:bg-orange-600"
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