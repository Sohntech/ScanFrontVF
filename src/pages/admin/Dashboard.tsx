"use client";

// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { getPresences } from "@/store/slices/presenceSlice";
import ReferentialTrendsChart from "@/components/dashboard/referential-trends-chart" 
import { getAllUsers } from "@/store/slices/userSlice"; // Importer le nouveau slice
import { ResponsiveContainer, PieChart, Tooltip, Cell, Pie } from "recharts";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  RefreshCw,
  Calendar,
  Search,
  Filter,
  Users,
  Clock,
  Check,
  LayoutDashboard,
  UserPlus,
} from "lucide-react";
import type { Presence, User } from "@/types/index";
import { StatCard } from "@/components/dashboard/StatCard";
import { PresenceTable } from "@/components/dashboard/PresenceTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { DownloadButton } from "@/components/dashboard/DownloadButton";
import { Modal } from "@/components/shared/Modal";
import { LearnerForm } from "@/components/learners/LearnerForm";
import { LearnersList } from "@/components/learners/LearnersList";

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
  const { presences, isLoading: isLoadingPresences } = useAppSelector(
    (state) => state.presence
  );
  const {
    users,
    isLoading: isLoadingUsers,
    error,
  } = useAppSelector((state) => state.users); // Récupérer les utilisateurs

  // States for filters
  const [timeFilter, setTimeFilter] = useState("day");
  const [referentielFilter, setReferentielFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTimeFilterDropdown, setShowTimeFilterDropdown] = useState(false);
  const [showReferentielDropdown, setShowReferentielDropdown] = useState(false);
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
  const [activeView, setActiveView] = useState<"dashboard" | "learners">(
    "dashboard"
  );
  const [showAddLearnerModal, setShowAddLearnerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | Presence | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Get presences with applied filters
  useEffect(() => {
    const now = new Date();
    let startDate = "";
    const endDate = now.toISOString().split("T")[0];

    if (timeFilter === "day") {
      startDate = dateFilter;
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
      date: dateFilter,
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

  // Load learners
  useEffect(() => {
    if (activeView === "learners") {
      dispatch(getAllUsers()); // Récupérer tous les utilisateurs
    }
  }, [activeView, dispatch]);

  // Filtered data for the table
  const filteredPresences = presences.filter((presence) => {
    if (referentielFilter && presence.user.referentiel !== referentielFilter)
      return false;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const fullName =
        `${presence.user.firstName} ${presence.user.lastName}`.toLowerCase();
      const matricule = presence.user.matricule.toLowerCase();
      if (!fullName.includes(searchLower) && !matricule.includes(searchLower)) {
        return false;
      }
    }

    if (
      selectedStatus &&
      presence.status.toLowerCase() !== selectedStatus.toLowerCase()
    ) {
      return false;
    }

    const presenceDate = new Date(presence.scanTime)
      .toISOString()
      .split("T")[0];
    if (dateFilter && presenceDate !== dateFilter) {
      return false;
    }

    return true;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPresences.length / itemsPerPage);
  const currentData = filteredPresences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = filteredPresences.reduce(
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

  // Data for charts
  const pieChartData = [
    { name: "Présents", value: stats.present, color: COLORS.present },
    { name: "Retards", value: stats.late, color: COLORS.late },
    { name: "Absents", value: stats.absent, color: COLORS.absent },
  ];

  // Open details modal
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

  // Reset all filters
  const resetFilters = () => {
    setTimeFilter("day");
    setReferentielFilter("");
    setSearchQuery("");
    setSelectedStatus("");
    setCurrentPage(1);
    setDateFilter(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>

              <nav className="ml-8 flex space-x-6">
                <button
                  onClick={() => setActiveView("dashboard")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-3 transition-all duration-200 ${
                    activeView === "dashboard"
                      ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <LayoutDashboard
                    className={`h-5 w-5 ${
                      activeView === "dashboard"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      activeView === "dashboard" ? "font-semibold" : ""
                    }
                  >
                    Présences
                  </span>
                  {activeView === "dashboard" && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-orange-500 rounded-t-full"></span>
                  )}
                </button>

                <button
                  onClick={() => setActiveView("learners")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-3 transition-all duration-200 ${
                    activeView === "learners"
                      ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <Users
                    className={`h-5 w-5 ${
                      activeView === "learners"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={activeView === "learners" ? "font-semibold" : ""}
                  >
                    Apprenants
                  </span>
                  {activeView === "learners" && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-orange-500 rounded-t-full"></span>
                  )}
                </button>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-5">
              {/* Date Display */}
              <div className="px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200/50 shadow-sm flex items-center">
                <div className="mr-3 bg-orange-500/10 p-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <span>
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-gray-500" />
                <span>Réinitialiser</span>
              </button>

              {/* Add Learner Button - Only shown when in learners view */}
              {activeView === "learners" && (
                <button
                  onClick={() => setShowAddLearnerModal(true)}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Ajouter un apprenant
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "dashboard" ? (
          <>
            {/* Tabs for navigation between views */}
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

            {/* Temporal filters */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="relative inline-block">
                <button
                  onClick={() =>
                    setShowTimeFilterDropdown(!showTimeFilterDropdown)
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {timeFilterOptions.find((o) => o.id === timeFilter)?.label}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showTimeFilterDropdown && (
                  <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
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
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
                  >
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {referentielFilter || "Tous les référentiels"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {showReferentielDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
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

            {/* Main content */}
            {selectedTab === "overview" ? (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    icon={<Check className="h-6 w-6" />}
                    title="Présents"
                    value={stats.present}
                    total={totalCount}
                    color="bg-green-100 text-green-500"
                    onClick={() => {
                      setSelectedTab("present");
                      setSelectedStatus("present");
                    }}
                  />
                  <StatCard
                    icon={<Clock className="h-6 w-6" />}
                    title="Retards"
                    value={stats.late}
                    total={totalCount}
                    color="bg-yellow-100 text-yellow-500"
                    onClick={() => {
                      setSelectedTab("late");
                      setSelectedStatus("late");
                    }}
                  />
                  <StatCard
                    icon={<AlertTriangle className="h-6 w-6" />}
                    title="Absents"
                    value={stats.absent}
                    total={totalCount}
                    color="bg-red-100 text-red-500"
                    onClick={() => {
                      setSelectedTab("absent");
                      setSelectedStatus("absent");
                    }}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Répartition des présences
                    </h3>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      {/* Chart container with fixed dimensions */}
                      <div className="w-full md:w-3/5 h-64 md:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={isMobile ? 40 : 60}
                              outerRadius={isMobile ? 80 : 100}
                              paddingAngle={3}
                              dataKey="value"
                              labelLine={false}
                              // Remove the label prop that was causing overlap
                              animationDuration={800}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value} apprenants`, ""]}
                              contentStyle={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                padding: "8px 12px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Enhanced legend with more details */}
                      <div className="w-full md:w-2/5 mt-6 md:mt-0 md:pl-6">
                        <div className="space-y-4">
                          {pieChartData.map((entry, _index) => {
                            const percentage =
                              totalCount > 0
                                ? Math.round((entry.value / totalCount) * 100)
                                : 0;
                            return (
                              <div
                                key={entry.name}
                                className="flex flex-col p-3 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:bg-gray-50 hover:border-gray-200"
                                onClick={() =>
                                  openDetailsModal(
                                    entry.name.toLowerCase().replace("s", "")
                                  )
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-800">
                                      {entry.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-semibold">
                                    {entry.value}
                                    <span className="text-gray-500 ml-1 font-normal">
                                      ({percentage}%)
                                    </span>
                                  </span>
                                </div>

                                {/* Progress bar visualization */}
                                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className="h-1.5 rounded-full"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor: entry.color,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}

                          <div className="pt-2 mt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-500">
                                Total
                              </span>
                              <span className="text-sm font-semibold">
                                {totalCount} apprenants
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <ReferentialTrendsChart
                      presences={filteredPresences}
                      isLoading={isLoadingPresences}
                      referentiels={referentiels}
                      colors={{
                        present: COLORS.present,
                        late: COLORS.late,
                        absent: COLORS.absent,
                      }}
                    />
                  </div>
                </div>

                {/* Summary table */}
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
                      <DownloadButton presences={filteredPresences} />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <PresenceTable
                      data={currentData}
                      isLoading={isLoadingPresences}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      itemsPerPage={itemsPerPage}
                      totalItems={filteredPresences.length}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Liste des{" "}
                      {selectedTab === "present"
                        ? "présents"
                        : selectedTab === "late"
                        ? "retards"
                        : "absents"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {
                        filteredPresences.filter(
                          (p) => p.status.toLowerCase() === selectedStatus
                        ).length
                      }{" "}
                      apprenant
                      {filteredPresences.filter(
                        (p) => p.status.toLowerCase() === selectedStatus
                      ).length !== 1
                        ? "s"
                        : ""}{" "}
                      trouvé
                      {filteredPresences.filter(
                        (p) => p.status.toLowerCase() === selectedStatus
                      ).length !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTab("overview");
                      setSelectedStatus("");
                      setCurrentPage(1);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-150"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <PresenceTable
                    data={filteredPresences
                      .filter(
                        (presence) =>
                          presence.status.toLowerCase() === selectedStatus
                      )
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )}
                    isLoading={isLoadingPresences}
                  />
                  {filteredPresences.filter(
                    (p) => p.status.toLowerCase() === selectedStatus
                  ).length > itemsPerPage && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(
                        filteredPresences.filter(
                          (p) => p.status.toLowerCase() === selectedStatus
                        ).length / itemsPerPage
                      )}
                      itemsPerPage={itemsPerPage}
                      totalItems={
                        filteredPresences.filter(
                          (p) => p.status.toLowerCase() === selectedStatus
                        ).length
                      }
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Contenu de la vue apprenants */}
            {activeView === "learners" && (
              <div className="overflow-x-auto">
                {isLoadingUsers ? (
                  <p>Chargement des apprenants...</p>
                ) : error ? (
                  <p>Erreur: {error}</p>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="referentielFilter"
                          className="text-sm font-medium text-gray-700"
                        >
                          Référentiel:
                        </label>
                        <select
                          id="referentielFilter"
                          name="referentielFilter"
                          value={referentielFilter}
                          onChange={(e) => setReferentielFilter(e.target.value)}
                          className="mt-1 block w-full pl-3 border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Tous</option>
                          {referentiels.map((referentiel) => (
                            <option key={referentiel} value={referentiel}>
                              {referentiel}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="searchQuery"
                          className="text-sm font-medium text-gray-700"
                        >
                          Rechercher:
                        </label>
                        <input
                          type="text"
                          name="searchQuery"
                          id="searchQuery"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="mt-1 block w-full pl-3 border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <LearnersList
                      data={users
                        .filter(
                          (user) =>
                            (referentielFilter
                              ? user.referentiel === referentielFilter
                              : true) &&
                            (searchQuery
                              ? `${user.firstName} ${user.lastName}`
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                user.matricule
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                              : true)
                        )
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )}
                      isLoading={isLoadingUsers}
                      onView={(user: User) => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                      onEdit={(user: User) => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      onDelete={(userId: string) => {
                        const userToDelete = users.find(
                          (l: { id: string }) => l.id === userId
                        );
                        setSelectedUser(userToDelete || null);
                        setShowDeleteModal(true);
                      }}
                    />
                    {users.length > itemsPerPage && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(users.length / itemsPerPage)}
                        itemsPerPage={itemsPerPage}
                        totalItems={users.length}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de détails */}
      {showDetailsModal && (
        <Modal title="Détails" onClose={() => setShowDetailsModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {detailsData.title} - {detailsData.data.length} apprenants
            </h3>
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
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Modals pour la gestion des apprenants */}
      {showAddLearnerModal && (
        <Modal
          title="Ajouter un apprenant"
          onClose={() => setShowAddLearnerModal(false)}
        >
          <LearnerForm
            onSubmit={(data) => {
              console.log("Ajouter:", data);
              setShowAddLearnerModal(false);
            }}
            onCancel={() => setShowAddLearnerModal(false)}
          />
        </Modal>
      )}

      {showViewModal && selectedUser && (
        <Modal
          title="Détails de l'apprenant"
          onClose={() => setShowViewModal(false)}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {"user" in selectedUser
                ? `${selectedUser.user.firstName} ${selectedUser.user.lastName}`
                : `${selectedUser.firstName} ${selectedUser.lastName}`}
            </h3>
            <p className="text-gray-600">
              Matricule:{" "}
              {"user" in selectedUser
                ? selectedUser.user.matricule
                : selectedUser.matricule}
            </p>
            <p className="text-gray-600">
              Référentiel:{" "}
              {"user" in selectedUser
                ? selectedUser.user.referentiel
                : selectedUser.referentiel}
            </p>
            {"scanTime" in selectedUser && (
              <p className="text-gray-600">
                Arrivée: {new Date(selectedUser.scanTime).toLocaleString()}
              </p>
            )}
          </div>
        </Modal>
      )}

      {showEditModal && selectedUser && (
        <Modal
          title="Modifier l'apprenant"
          onClose={() => setShowEditModal(false)}
        >
          <LearnerForm
            initialData={selectedUser}
            onSubmit={(data) => {
              console.log("Modifier:", data);
              setShowEditModal(false);
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}

      {showDeleteModal && selectedUser && (
        <Modal
          title="Supprimer l'apprenant"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-6">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cet apprenant?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  console.log(
                    "Supprimer:",
                    "user" in selectedUser
                      ? selectedUser.user.matricule
                      : selectedUser.matricule
                  );
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;
