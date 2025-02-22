import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Users,
  Clock,
  Award,
  AlertCircle,
  UserCircle2,
  BookOpen,
  ArrowLeft,
  CalendarCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PresenceTable,
} from "../../components/ui/";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/Dialog";
import { toast } from "react-hot-toast";
import QrScanner from "qr-scanner";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  estMarquerPresence,
  getPresences,
  scanPresence,
} from "@/store/slices/presenceSlice";

interface StudentInfo {
  student?: {
    firstName: string;
    lastName: string;
    matricule: string;
    referentiel: string;
    photoUrl?: string;
    email?: string;
  };
  createdAt: string;
  status: string;
  arrivalTime?: string;
}

const VigilDashboard = () => {
  const dispatch = useAppDispatch();
  const { presences, isLoading } = useAppSelector((state) => state.presence);
  const [points, setPoints] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [lastScannedStudent, setLastScannedStudent] =
    useState<StudentInfo | null>(null);
  const videoRef = useRef(null);

  // Récupérer les présences
  const fetchPresences = async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const filter = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };
    await dispatch(getPresences(filter)).unwrap();
  };

  useEffect(() => {
    fetchPresences();
    // Programmer un rafraîchissement automatique toutes les 5 minutes
    const interval = setInterval(fetchPresences, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
            const estMarque = await dispatch(
              estMarquerPresence(result.data)
            ).unwrap();

            if (estMarque) {
              toast.error("Cet apprenant est déjà marqué présent", {
                icon: "🚫",
                duration: 3000,
              });
              isScan = false;
            } else {
              const studentData = await dispatch(
                scanPresence(result.data)
              ).unwrap();
              toast.success("QR Code scanné avec succès!", {
                icon: "✅",
                duration: 2000,
              });
              await handleSuccessfulScan(studentData);
              isScan = false;
            }
          } catch (error) {
            toast.error("Erreur lors du scan. Veuillez réessayer.", {
              icon: "⚠️",
              duration: 3000,
            });
            isScan = false;
          }
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 2,
        calculateScanRegion: (video) => {
          const smallerDimension = Math.min(
            video.videoWidth,
            video.videoHeight
          );
          const scanRegionSize = Math.round(smallerDimension * 0.7);

          return {
            x: Math.round((video.videoWidth - scanRegionSize) / 2),
            y: Math.round((video.videoHeight - scanRegionSize) / 2),
            width: scanRegionSize,
            height: scanRegionSize,
          };
        },
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
      setPoints((prevPoints) => prevPoints + 1);
      setStudentInfo(null);
      toast.success("Présence validée avec succès! +1", {
        icon: "🎉",
        duration: 3000,
      });
      // Rafraîchir la liste des présences
      await fetchPresences();
    }
  };

  const startScanning = () => {
    setShowScanner(true);
    setStudentInfo(null);
  };

  const stopScanning = () => {
    setShowScanner(false);
  };

  const stats = presences.reduce(
    (acc, presence) => {
      const status = presence.status.toLowerCase();
      if (status === "present") acc.present++;
      else if (status === "late") acc.late++;
      else if (status === "absent") acc.absent++;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-orange-100 text-orange-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <Users className="w-4 h-4 text-green-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "absent":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Non disponible";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Format invalide";

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Format invalide";

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header responsive avec gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Scanner de Présence
                </h1>
                <p className="text-orange-100 text-sm mt-1 flex items-center">
                  <CalendarCheck className="w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white flex-1 sm:flex-none">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">{points} Scans</span>
                  </div>
                </div>
                <Button
                  className="bg-white text-orange-600 hover:bg-orange-50 flex-1 sm:flex-none font-medium px-4 py-2 h-auto"
                  onClick={startScanning}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Scanner
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {showScanner ? (
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="p-4 border-b border-gray-100 flex flex-row justify-between items-center">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-orange-600">
                  <Camera className="w-5 h-5" />
                  Scanner QR Code
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={stopScanning}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full aspect-[8/8] object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                   
                  </div>
                  {isScanning && (
                    <div className="">
                     
                    </div>
                  )}
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-green-600" />
                      Présents
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold text-green-700">
                        {stats.present}
                      </span>
                      <div className="bg-green-200 rounded-full p-2">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-orange-600" />
                      Retards
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold text-orange-700">
                        {stats.late}
                      </span>
                      <div className="bg-orange-200 rounded-full p-2">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-red-100">
                  <CardContent className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-red-600" />
                      Absents
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold text-red-700">
                        {stats.absent}
                      </span>
                      <div className="bg-red-200 rounded-full p-2">
                        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-lg">
                <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-gray-800">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Derniers scans aujourd'hui
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

        <Dialog
          open={studentInfo !== null}
          onOpenChange={() => setStudentInfo(null)}
        >
          <DialogContent className="sm:max-w-lg mx-4 p-0 overflow-hidden rounded-xl">
            <DialogHeader className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 text-white">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Validation de présence
              </DialogTitle>
            </DialogHeader>

            {studentInfo && (
              <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center sm:items-stretch sm:flex-row gap-6">
                  {/* Photo et information de base de l'apprenant */}
                  <div className="flex flex-col items-center space-y-3 sm:w-1/3">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-orange-100 shadow-md">
                      {studentInfo.student?.photoUrl ? (
                        <img
                          src={`data:image/jpeg;base64,${studentInfo.student.photoUrl}`}
                          alt={`${studentInfo.student.firstName} ${studentInfo.student.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-50">
                          <UserCircle2 className="w-16 h-16 text-orange-300" />
                        </div>
                      )}
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        studentInfo.status
                      )} px-3 py-1 flex items-center gap-1`}
                    >
                      {getStatusIcon(studentInfo.status)}
                      <span className="capitalize">
                        {studentInfo.status.toLowerCase()}
                      </span>
                    </Badge>
                  </div>

                  {/* Informations détaillées de l'apprenant */}
                  <div className="flex-1 space-y-4 sm:border-l sm:pl-6 sm:py-2 text-center sm:text-left">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 justify-center sm:justify-start">
                        <span>
                          {studentInfo.student?.firstName}{" "}
                          {studentInfo.student?.lastName}
                        </span>
                      </h3>
                      {studentInfo.student?.matricule && (
                        <div className="text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                          <span className="font-medium">Matricule:</span>
                          <span>{studentInfo.student.matricule}</span>
                        </div>
                      )}
                      {studentInfo.student?.email && (
                        <div className="text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1 overflow-hidden text-ellipsis">
                          <span>{studentInfo.student.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">
                            Référentiel
                          </div>
                          <div className="font-medium text-gray-800 truncate">
                            {studentInfo.student?.referentiel || "Non spécifié"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                          <CalendarCheck className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">
                            Date d'arrivée
                          </div>
                          <div className="font-medium text-gray-800">
                            {formatDate(studentInfo.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                          <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">
                            Heure d'arrivée
                          </div>
                          <div className="font-medium text-gray-800">
                            {formatTime(
                              studentInfo.arrivalTime || studentInfo.createdAt
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 mt-8 pt-4 border-t border-gray-100">
                 
                  <Button
                    className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 h-12 sm:h-10 p-5"
                    onClick={handleValidatePresence}
                  >
                    <Award className="w-4 h-4" />
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
