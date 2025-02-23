import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { getPresences } from "@/store/slices/presenceSlice";
import {
  ResponsiveContainer,
  PieChart,
  Tooltip,
  Cell,
  Pie,
} from "recharts";
import {
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  RefreshCw,
  Calendar,
  Download,
  Search,
  Filter,
  Users,
  Clock,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Presence } from "@/types/index";
import { generatePDF } from "@/lib/utils";

// Theme colors
const COLORS = {
  primary: "#FF7900", // Main orange
  primaryLight: "#FF9A40",
  primaryDark: "#E66C00",
  present: "#10B981", // Green for present
  late: "#F59E0B", // Orange for late
  absent: "#EF4444", // Red for absent
  bgLight: "#F9FAFB",
  card: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

// Available referentials
const referentiels = ["RefDigital", "DevWeb", "DevData", "AWS", "Hackeuse"];


// Filtering periods
const timeFilterOptions = [
  { id: "day", label: "Aujourd'hui" },
  { id: "week", label: "Cette semaine" },
  { id: "month", label: "Ce mois" },
  { id: "total", label: "Total" },
];

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { presences, isLoading } = useAppSelector((state) => state.presence);

  // States for filters
  const [timeFilter, setTimeFilter] = useState("day");
  const [referentielFilter, setReferentielFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTimeFilterDropdown, setShowTimeFilterDropdown] = useState(false);
  const [showReferentielDropdown, setShowReferentielDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsData, setDetailsData] = useState<{
    title: string;
    data: Presence[];
  }>({ title: "", data: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Get presences with applied filters
  useEffect(() => {
    // Convert time filter to real dates for the API
    const now = new Date();
    let startDate = "";
    let endDate = now.toISOString().split("T")[0];

    if (timeFilter === "day") {
      startDate = dateFilter; // Use the selected date for the day filter
    } else if (timeFilter === "week") {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(
        now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
      );
      startDate = firstDayOfWeek.toISOString().split("T")[0];
    } else if (timeFilter === "month") {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = firstDayOfMonth.toISOString().split("T")[0];
    }

    const filters = {
      startDate,
      endDate: timeFilter === "total" ? "" : endDate,
      status: selectedStatus,
      referentiel: referentielFilter,
      search: searchQuery,
      date: dateFilter, // Include the date filter in the API call
    };

    dispatch(getPresences(filters));
  }, [
    dispatch,
    timeFilter,
    selectedStatus,
    referentielFilter,
    searchQuery,
    dateFilter,
  ]);

  // Calculate statistics
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

  const totalCount = stats.present + stats.late + stats.absent;

  // Données pour les graphiques
  const pieChartData = [
    { name: "Présents", value: stats.present, color: COLORS.present },
    { name: "Retards", value: stats.late, color: COLORS.late },
    { name: "Absents", value: stats.absent, color: COLORS.absent },
  ];

  // Données filtrées pour le tableau
  const filteredPresences = presences.filter((presence) => {
    // Filtre par référentiel si spécifié
    if (referentielFilter && presence.user.referentiel !== referentielFilter)
      return false;

    // Filtre par recherche
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const fullName =
        `${presence.user.firstName} ${presence.user.lastName}`.toLowerCase();
      const matricule = presence.user.matricule.toLowerCase();
      if (!fullName.includes(searchLower) && !matricule.includes(searchLower)) {
        return false;
      }
    }

    // Filtre par statut si sélectionné
    if (
      selectedStatus &&
      presence.status.toLowerCase() !== selectedStatus.toLowerCase()
    ) {
      return false;
    }

    // Filtre par date
    const presenceDate = new Date(presence.scanTime)
      .toISOString()
      .split("T")[0];
    if (dateFilter && presenceDate !== dateFilter) {
      return false;
    }

    return true;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredPresences.length / itemsPerPage);
  const currentData = filteredPresences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ouvrir le modal de détails
  const openDetailsModal = (status: string) => {
    const statusLabel =
      status === "present"
        ? "Présents"
        : status === "late"
        ? "Retards"
        : "Absents";
    const filteredData = presences.filter(
      (p) => p.status.toLowerCase() === status
    );
    setDetailsData({
      title: statusLabel,
      data: filteredData as any,
    });
    setShowDetailsModal(true);
    setSelectedStatus(status);
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setTimeFilter("day");
    setReferentielFilter("");
    setSearchQuery("");
    setSelectedStatus("");
    setCurrentPage(1);
    setDateFilter(new Date().toISOString().split("T")[0]); // Reset date filter to today
  };

  // Obtenir le label de couleur selon le statut
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Présent
          </span>
        );
      case "late":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Retard
          </span>
        );
      case "absent":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Absent
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Inconnu
          </span>
        );
    }
  };

  // Obtenir l'icône selon le statut
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <Check className="w-5 h-5 text-green-500" />;
      case "late":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "absent":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };


  const download = ()=>{
    const headers = ["Prenom et Nom", "Matricule", "Référentiel", "Status", "Heure", "Date"];
    const datas =currentData.map(dt=>{
      const date = new Date(dt.scanTime);
      const dateFormat = date.toLocaleDateString("fr-FR"); // Exemple : "22/02/2025"
      const heureFormat = date.toLocaleTimeString("fr-FR"); // Exemple : "14:30:15"
      return [`${dt.user.firstName} ${dt.user.lastName}`, dt.user.matricule, dt.user.referentiel, dt.status, heureFormat, dateFormat];
    });
    generatePDF({
      title: "La liste des présences",
      headers,
      data: datas,
      filename: "liste-presences.pdf"
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Navigation */}


      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Dashboard Admin
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center">
              <div className="flex space-x-4">
                <span className="px-3 py-2 text-sm font-medium rounded-md bg-orange-50 text-orange-700">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <button
                onClick={resetFilters}
                className="ml-4 flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition duration-150"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Réinitialiser</span>
              </button>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {timeFilterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTimeFilter(option.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      timeFilter === option.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs pour la navigation entre les vues */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto hide-scrollbar space-x-8">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`pb-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedTab === "overview"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              className={`pb-4 text-sm font-medium border-b-2 cursor-default whitespace-nowrap ${
                selectedTab === "present"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 "
              }`}
            >
              Présences
            </button>
            <button
              className={`pb-4 text-sm font-medium border-b-2 cursor-default whitespace-nowrap ${
                selectedTab === "late"
                  ? "border-yellow-500 text-yellow-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Retards
            </button>
            <button
              className={`pb-4 text-sm font-medium border-b-2 cursor-default whitespace-nowrap ${
                selectedTab === "absent"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 "
              }`}
            >
              Absences
            </button>
          </div>
        </div>

        {/* Filtres temporels */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <div className="relative inline-block">
            <button
              onClick={() => setShowTimeFilterDropdown(!showTimeFilterDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {timeFilterOptions.find((o) => o.id === timeFilter)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showTimeFilterDropdown && (
              <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {timeFilterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setTimeFilter(option.id);
                        setShowTimeFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        timeFilter === option.id
                          ? "bg-orange-50 text-orange-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      role="menuitem"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher (nom/matricule)"
                className="w-64 pl-10 pr-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative inline-block">
              <button
                onClick={() =>
                  setShowReferentielDropdown(!showReferentielDropdown)
                }
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {referentielFilter || "Tous les référentiels"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showReferentielDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        setReferentielFilter("");
                        setShowReferentielDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        referentielFilter === ""
                          ? "bg-orange-50 text-orange-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      role="menuitem"
                    >
                      Tous les référentiels
                    </button>
                    {referentiels.map((ref) => (
                      <button
                        key={ref}
                        onClick={() => {
                          setReferentielFilter(ref);
                          setShowReferentielDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          referentielFilter === ref
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        role="menuitem"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ajout du filtre par date pour la version desktop */}
            <div className="relative flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-48 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Filtres mobile */}
        <div className="md:hidden mb-6 space-y-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
            {timeFilterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeFilter(option.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${
                  timeFilter === option.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher apprenant..."
              className="w-full pl-10 pr-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="block w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none"
            value={referentielFilter}
            onChange={(e) => setReferentielFilter(e.target.value)}
          >
            <option value="">Tous les référentiels</option>
            {referentiels.map((ref) => (
              <option key={ref} value={ref}>
                {ref}
              </option>
            ))}
          </select>

          {/* Ajout du filtre par date pour la version mobile */}
          <div className="relative">
            <label htmlFor="dateFilter" className="sr-only">
              Filtre par date
            </label>
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Contenu principal */}
        {selectedTab === "overview" ? (
          <>
            {/* Cartes de stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTab("present");
                  setSelectedStatus("present");
                }}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Présents
                      </h3>
                      <div className="flex items-end space-x-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.present}
                        </p>
                        <p className="text-sm text-gray-500">
                          {totalCount > 0
                            ? `(${Math.round(
                                (stats.present / totalCount) * 100
                              )}%)`
                            : "(0%)"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width:
                          totalCount > 0
                            ? `${(stats.present / totalCount) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTab("late");
                  setSelectedStatus("late");
                }}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-yellow-100 text-yellow-500">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Retards
                      </h3>
                      <div className="flex items-end space-x-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.late}
                        </p>
                        <p className="text-sm text-gray-500">
                          {totalCount > 0
                            ? `(${Math.round(
                                (stats.late / totalCount) * 100
                              )}%)`
                            : "(0%)"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width:
                          totalCount > 0
                            ? `${(stats.late / totalCount) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTab("absent");
                  setSelectedStatus("absent");
                }}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-red-100 text-red-500">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Absents
                      </h3>
                      <div className="flex items-end space-x-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.absent}
                        </p>
                        <p className="text-sm text-gray-500">
                          {totalCount > 0
                            ? `(${Math.round(
                                (stats.absent / totalCount) * 100
                              )}%)`
                            : "(0%)"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width:
                          totalCount > 0
                            ? `${(stats.absent / totalCount) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Répartition des présences
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 40 : 60}
                        outerRadius={isMobile ? 80 : 100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} apprenants`, ""]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {pieChartData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() =>
                        openDetailsModal(
                          entry.name.toLowerCase().replace("s", "")
                        )
                      }
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div className="text-sm text-gray-600">{entry.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tendances par référentiel
                </h3>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="relative mb-6">
                          <h1 className="text-center text-3xl font-bold text-gray-800">
                            Coming soon
                          </h1>
                          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-orange-500 rounded-full"></div>
                        </div>
                        <p className="text-gray-600 text-center mb-4">
                          Nous préparons des insights détaillés pour cette section
                        </p>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-300"></div>
                        </div>
                        <div className="px-4 py-2 border border-orange-200 rounded-lg bg-orange-50 text-sm text-orange-700">
                          A suivre... 
                        </div>
                      </div>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Tableau récapitulatif */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex justify-between">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Récapitulatif des apprenants
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filteredPresences.length} apprenant
                    {filteredPresences.length !== 1 ? "s" : ""} trouvé
                    {filteredPresences.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center space-x-2 px-4">
                  <button onClick={download} className="text-gray-500 hover:text-gray-700">
                      <i className="fas fa-download"></i>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                      <i className="fas fa-ellipsis-v"></i>
                  </button>
              </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Apprenant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Matricule
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Référentiel
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Statut
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Arrivée
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((presence) => (
                      <tr key={presence.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10  flex items-center justify-center">
                              <img
                                className="rounded-full h-10 w-10 "
                                src={presence.user.photoUrl}
                                alt="photo_de_profil"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {presence.user.firstName}{" "}
                                {presence.user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {presence.user.matricule}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {presence.user.referentiel}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(presence.status)}
                            <span className="ml-2">
                              {getStatusLabel(presence.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(presence.scanTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {currentData.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          {isLoading ? (
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                          ) : (
                            "Aucun résultat trouvé"
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredPresences.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        à{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredPresences.length
                          )}
                        </span>{" "}
                        sur{" "}
                        <span className="font-medium">
                          {filteredPresences.length}
                        </span>{" "}
                        résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              currentPage === index + 1
                                ? "bg-orange-50 border-orange-500 text-orange-600 z-10"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTab === "present"
                    ? "Liste des présents"
                    : selectedTab === "late"
                    ? "Liste des retards"
                    : "Liste des absents"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredPresences.length} apprenant
                  {filteredPresences.length !== 1 ? "s" : ""} trouvé
                  {filteredPresences.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTab("overview");
                  setSelectedStatus("");
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-150"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Apprenant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Matricule
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Référentiel
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Arrivée
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((presence) => (
                    <tr key={presence.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <img
                              className="rounded-full h-10 w-10 "
                              src={presence.user.photoUrl}
                              alt="photo_de_profil"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {presence.user.firstName} {presence.user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {presence.user.matricule}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {presence.user.referentiel}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(presence.scanTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {currentData.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        {isLoading ? (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                          </div>
                        ) : (
                          `Aucun apprenant ${
                            selectedTab === "present"
                              ? "présent"
                              : selectedTab === "late"
                              ? "en retard"
                              : "absent"
                          } trouvé`
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPresences.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      à{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredPresences.length
                        )}
                      </span>{" "}
                      sur{" "}
                      <span className="font-medium">
                        {filteredPresences.length}
                      </span>{" "}
                      résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === index + 1
                              ? "bg-orange-50 border-orange-500 text-orange-600 z-10"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de détails */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowDetailsModal(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-lg leading-6 font-semibold text-gray-900"
                        id="modal-title"
                      >
                        {detailsData.title} - {detailsData.data.length}{" "}
                        apprenants
                      </h3>
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="bg-white rounded-full p-1 hover:bg-gray-100"
                      >
                        <X className="h-6 w-6 text-gray-500" />
                      </button>
                    </div>

                    <div className="mt-4 max-h-96 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Apprenant
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Matricule
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Référentiel
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Arrivée
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {detailsData.data.map((presence, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {presence.user.firstName}{" "}
                                      {presence.user.lastName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {presence.user.matricule}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {presence.user.referentiel}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(presence.scanTime).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;