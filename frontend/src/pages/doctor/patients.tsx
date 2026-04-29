import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Calendar,
  Loader2,
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Venus,
  Mars,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PatientDetailsModal from "@/components/PatientDetailsModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  totalVisits?: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    phone: "+91 9876543210",
    email: "john.doe@email.com",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    totalVisits: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    phone: "+91 9876543211",
    email: "jane.smith@email.com",
    lastVisit: "2024-01-14",
    condition: "Diabetes",
    totalVisits: 3,
  },
  {
    id: 3,
    name: "Mike Johnson",
    age: 58,
    gender: "Male",
    phone: "+91 9876543212",
    email: "mike.j@email.com",
    lastVisit: "2024-01-10",
    condition: "Arthritis",
    totalVisits: 8,
  },
  {
    id: 4,
    name: "Sarah Williams",
    age: 41,
    gender: "Female",
    phone: "+91 9876543213",
    email: "sarah.w@email.com",
    lastVisit: "2024-01-18",
    condition: "Asthma",

    totalVisits: 2,
  },
  {
    id: 5,
    name: "David Brown",
    age: 67,
    gender: "Male",
    phone: "+91 9876543214",
    email: "david.brown@email.com",
    lastVisit: "2024-01-12",
    condition: "Heart Disease",
    totalVisits: 10,
  },
  {
    id: 6,
    name: "Emily Davis",
    age: 29,
    gender: "Female",
    phone: "+91 9876543215",
    email: "emily.d@email.com",
    lastVisit: "2024-01-20",
    condition: "Migraine",
    totalVisits: 61,
  },
  {
    id: 7,
    name: "Robert Miller",
    age: 53,
    gender: "Male",
    phone: "+91 9876543216",
    email: "robert.miller@email.com",
    lastVisit: "2024-01-11",
    condition: "High Cholesterol",
    totalVisits: 4,
  },
  {
    id: 8,
    name: "Lisa Anderson",
    age: 38,
    gender: "Female",
    phone: "+91 9876543217",
    email: "lisa.a@email.com",
    lastVisit: "2024-01-19",
    condition: "Thyroid Disorder",
    totalVisits: 7,
  },
  {
    id: 9,
    name: "James Wilson",
    age: 62,
    gender: "Male",
    phone: "+91 9876543218",
    email: "james.wilson@email.com",
    lastVisit: "2024-01-09",
    condition: "COPD",
    totalVisits: 9,
  },
  {
    id: 10,
    name: "Maria Garcia",
    age: 44,
    gender: "Female",
    phone: "+91 9876543219",
    email: "maria.garcia@email.com",
    lastVisit: "2024-01-17",
    condition: "Anemia",
    totalVisits: 6,
  },
  {
    id: 11,
    name: "Christopher Lee",
    age: 36,
    gender: "Male",
    phone: "+91 9876543220",
    email: "chris.lee@email.com",
    lastVisit: "2024-01-16",
    condition: "Anxiety",
    totalVisits: 12,
  },
  {
    id: 12,
    name: "Patricia Taylor",
    age: 55,
    gender: "Female",
    phone: "+91 9876543221",
    email: "patricia.t@email.com",
    lastVisit: "2024-01-13",
    condition: "Osteoporosis",
    totalVisits: 4,
  },
  {
    id: 13,
    name: "Daniel Martinez",
    age: 48,
    gender: "Male",
    phone: "+91 9876543222",
    email: "daniel.m@email.com",
    lastVisit: "2024-01-21",
    condition: "Back Pain",
    totalVisits: 15,
  },
  {
    id: 14,
    name: "Jennifer Thomas",
    age: 33,
    gender: "Female",
    phone: "+91 9876543223",
    email: "jennifer.thomas@email.com",
    lastVisit: "2024-01-08",
    condition: "PCOS",
    totalVisits: 5,
  },
  {
    id: 15,
    name: "Matthew Harris",
    age: 71,
    gender: "Male",
    phone: "+91 9876543224",
    email: "matthew.h@email.com",
    lastVisit: "2024-01-07",
    condition: "Parkinson's",

    totalVisits: 20,
  },
  {
    id: 16,
    name: "Nancy Clark",
    age: 27,
    gender: "Female",
    phone: "+91 9876543225",
    email: "nancy.clark@email.com",
    lastVisit: "2024-01-22",
    condition: "Allergies",
    totalVisits: 3,
  },
  {
    id: 17,
    name: "Paul Robinson",
    age: 59,
    gender: "Male",
    phone: "+91 9876543226",
    email: "paul.r@email.com",
    lastVisit: "2024-01-06",
    condition: "Kidney Stones",
    totalVisits: 8,
  },
  {
    id: 18,
    name: "Karen White",
    age: 42,
    gender: "Female",
    phone: "+91 9876543227",
    email: "karen.white@email.com",
    lastVisit: "2024-01-23",
    condition: "Depression",
    totalVisits: 10,
  },
  {
    id: 19,
    name: "Steven Lewis",
    age: 64,
    gender: "Male",
    phone: "+91 9876543228",
    email: "steven.lewis@email.com",
    lastVisit: "2024-01-05",
    condition: "Gout",
    totalVisits: 6,
  },
  {
    id: 20,
    name: "Betty Walker",
    age: 51,
    gender: "Female",
    phone: "+91 9876543229",
    email: "betty.walker@email.com",
    lastVisit: "2024-01-24",
    condition: "Insomnia",
  },
  {
    id: 21,
    name: "Thomas Hall",
    age: 39,
    gender: "Male",
    phone: "+91 9876543230",
    email: "thomas.hall@email.com",
    lastVisit: "2024-01-25",
    condition: "Eczema",
  },
  {
    id: 22,
    name: "Sandra Young",
    age: 46,
    gender: "Female",
    phone: "+91 9876543231",
    email: "sandra.y@email.com",
    lastVisit: "2024-01-04",
    condition: "Fibromyalgia",
  },
  {
    id: 23,
    name: "Kevin King",
    age: 54,
    gender: "Male",
    phone: "+91 9876543232",
    email: "kevin.king@email.com",
    lastVisit: "2024-01-26",
    condition: "Sleep Apnea",
  },
  {
    id: 24,
    name: "Donna Wright",
    age: 60,
    gender: "Female",
    phone: "+91 9876543233",
    email: "donna.wright@email.com",
    lastVisit: "2024-01-03",
    condition: "Glaucoma",
  },
  {
    id: 25,
    name: "Gary Scott",
    age: 35,
    gender: "Male",
    phone: "+91 9876543234",
    email: "gary.s@email.com",
    lastVisit: "2024-01-27",
    condition: "IBS",
  },
  {
    id: 26,
    name: "Carol Green",
    age: 49,
    gender: "Female",
    phone: "+91 9876543235",
    email: "carol.green@email.com",
    lastVisit: "2024-01-02",
    condition: "Lupus",
  },
  {
    id: 27,
    name: "Frank Adams",
    age: 68,
    gender: "Male",
    phone: "+91 9876543236",
    email: "frank.adams@email.com",
    lastVisit: "2024-01-28",
    condition: "Pneumonia",
  },
  {
    id: 28,
    name: "Ruth Baker",
    age: 37,
    gender: "Female",
    phone: "+91 9876543237",
    email: "ruth.baker@email.com",
    lastVisit: "2024-01-01",
    condition: "Endometriosis",
  },
  {
    id: 29,
    name: "Raymond Nelson",
    age: 52,
    gender: "Male",
    phone: "+91 9876543238",
    email: "raymond.n@email.com",
    lastVisit: "2024-01-29",
    condition: "Prostate Issues",
  },
  {
    id: 30,
    name: "Helen Carter",
    age: 43,
    gender: "Female",
    phone: "+91 9876543239",
    email: "helen.carter@email.com",
    lastVisit: "2023-12-31",
    condition: "Rheumatoid Arthritis",
  },
  {
    id: 31,
    name: "George Mitchell",
    age: 66,
    gender: "Male",
    phone: "+91 9876543240",
    email: "george.m@email.com",
    lastVisit: "2024-01-30",
    condition: "Cataracts",
  },
  {
    id: 32,
    name: "Sharon Perez",
    age: 31,
    gender: "Female",
    phone: "+91 9876543241",
    email: "sharon.perez@email.com",
    lastVisit: "2023-12-30",
    condition: "Vitamin D Deficiency",
  },
  {
    id: 33,
    name: "Edward Roberts",
    age: 57,
    gender: "Male",
    phone: "+91 9876543242",
    email: "edward.roberts@email.com",
    lastVisit: "2024-02-01",
    condition: "Atrial Fibrillation",
  },
  {
    id: 34,
    name: "Michelle Turner",
    age: 40,
    gender: "Female",
    phone: "+91 9876543243",
    email: "michelle.t@email.com",
    lastVisit: "2023-12-29",
    condition: "Chronic Fatigue",
  },
  {
    id: 35,
    name: "Brian Phillips",
    age: 50,
    gender: "Male",
    phone: "+91 9876543244",
    email: "brian.phillips@email.com",
    lastVisit: "2024-02-02",
    condition: "Hepatitis",
  },
  {
    id: 36,
    name: "Dorothy Campbell",
    age: 63,
    gender: "Female",
    phone: "+91 9876543245",
    email: "dorothy.c@email.com",
    lastVisit: "2023-12-28",
    condition: "Osteoarthritis",
  },
  {
    id: 37,
    name: "Ronald Parker",
    age: 47,
    gender: "Male",
    phone: "+91 9876543246",
    email: "ronald.parker@email.com",
    lastVisit: "2024-02-03",
    condition: "Psoriasis",
  },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/** Two-letter initials from full name */
function initials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

/** Deterministic pastel hue from name string */
function avatarHue(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

/** Condition severity palette */
const SEVERITY: Record<string, { bg: string; text: string; dot: string }> = {
  high: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
  mid: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  low: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
};

const HIGH_SEVERITY = new Set([
  "Heart Disease",
  "Atrial Fibrillation",
  "COPD",
  "Parkinson's",
  "Pneumonia",
  "Hepatitis",
  "Lupus",
]);
const MID_SEVERITY = new Set([
  "Hypertension",
  "Diabetes",
  "Osteoporosis",
  "Rheumatoid Arthritis",
  "Osteoarthritis",
  "Sleep Apnea",
  "Chronic Fatigue",
  "Kidney Stones",
  "Glaucoma",
  "Endometriosis",
]);

function severityKey(condition: string) {
  if (HIGH_SEVERITY.has(condition)) return "high";
  if (MID_SEVERITY.has(condition)) return "mid";
  return "low";
}

/** Format ISO date to e.g. "Jan 15, 2024" */
function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ name }: { name: string }) {
  const hue = avatarHue(name);
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold flex-shrink-0 select-none"
      style={{
        background: `hsl(${hue},55%,88%)`,
        color: `hsl(${hue},45%,35%)`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function ConditionBadge({ condition }: { condition: string }) {
  const sev = SEVERITY[severityKey(condition)];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${sev.bg} ${sev.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
      {condition}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800 leading-tight mt-0.5">
          {value}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function handeleDelete(e: React.MouseEvent, patientId: number) {
  e.stopPropagation();
  toast.success(`Patient deleted successfully!`);
}

function exportPatientsToCSV(patients: Patient[]) {
  if (patients.length === 0) {
    toast.error("No patients to export");
    return;
  }

  const headers = [
    "ID",
    "Name",
    "Age",
    "Gender",
    "Phone",
    "Email",
    "Last Visit",
    "Condition",
    "Total Visits",
  ];
  const csvRows = [
    headers.join(","),
    ...patients.map((patient) =>
      [
        patient.id,
        `"${patient.name}"`,
        patient.age,
        patient.gender,
        `"${patient.phone}"`,
        `"${patient.email}"`,
        patient.lastVisit,
        `"${patient.condition}"`,
        patient.totalVisits ?? 0,
      ].join(","),
    ),
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `patients_export_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success(`Exported ${patients.length} patients to CSV`);
}

export default function Patients() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const debouncedSearch = useDebounce(searchQuery, 400);
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState<"age" | "visits" | "lastVisit" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchPatients = useCallback(async (page: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 350));

      const itemsPerPage = 10;
      let filtered = search
        ? mockPatients.filter(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.email.toLowerCase().includes(search.toLowerCase()) ||
              p.phone.includes(search),
          )
        : mockPatients;

      // Apply filter and sort
      if (filterType === "age") {
        filtered = [...filtered].sort((a, b) =>
          sortOrder === "asc" ? a.age - b.age : b.age - a.age,
        );
      } else if (filterType === "visits") {
        filtered = [...filtered].sort((a, b) => {
          const aVisits = a.totalVisits || 0;
          const bVisits = b.totalVisits || 0;
          return sortOrder === "asc" ? aVisits - bVisits : bVisits - aVisits;
        });
      } else if (filterType === "lastVisit") {
        filtered = [...filtered].sort((a, b) => {
          const aDate = new Date(a.lastVisit).getTime();
          const bDate = new Date(b.lastVisit).getTime();
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        });
      }

      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
      const safePage = Math.min(page, totalPages);
      const start = (safePage - 1) * itemsPerPage;

      setPatients(filtered.slice(start, start + itemsPerPage));
      setPagination({
        currentPage: safePage,
        totalPages,
        totalItems,
        itemsPerPage,
      });
    } catch {
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filterType, sortOrder]);

  useEffect(() => {
    fetchPatients(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchPatients]);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Stats derived from full dataset
  const totalPatients = mockPatients.length;
  const femaleCount = mockPatients.filter((p) => p.gender === "Female").length;
  const avgAge = Math.round(
    mockPatients.reduce((s, p) => s + p.age, 0) / totalPatients,
  );
  const recentVisits = mockPatients.filter(
    (p) => new Date(p.lastVisit) >= new Date("2024-01-20"),
  ).length;

  const startItem =
    patients.length > 0 ? (currentPage - 1) * pagination.itemsPerPage + 1 : 0;
  const endItem = Math.min(
    currentPage * pagination.itemsPerPage,
    pagination.totalItems,
  );

  /** Compact page-number range around currentPage */
  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1,
  ).filter(
    (p) =>
      p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="min-h-screen">
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');        .patients-root { font-family: 'Inter', sans-serif; }
        .fade-row { animation: fadeUp .25s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .row-hover:hover { background: #f8faff !important; }
      `}</style>

      <div className="bg-white border border-slate-100 shadow-sm px-5 py-3.5">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email or phone…"
              className="pl-10 pr-10 h-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {loading && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
            )}
            {!loading && searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="hover:cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4 " />
              </button>
            )}
          </div>

          <Select
            value={filterType || ""}
            onValueChange={(value) => {
              if (value === "clear") {
                setFilterType(null);
                setSortOrder("desc");
              } else if (value) {
                const filterMap: Record<string, "age" | "visits" | "lastVisit"> = {
                  age: "age",
                  visits: "visits",
                  lastVisit: "lastVisit",
                };
                setFilterType(filterMap[value]);
                if (value === "age") setSortOrder("asc");
                else setSortOrder("desc");
              }
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-40 h-15 border-slate-200 text-sm">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="visits">Most Visits</SelectItem>
              <SelectItem value="lastVisit">Last Visit</SelectItem>
              <SelectItem value="clear">Clear Filter</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter menu removed - using select component instead */}

          {/* <Button
              variant="outline"
              className="gap-2 px-4 h-10 rounded-xl border-slate-200 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <Filter className="w-4 h-4" /> Filter
            </Button> */}

          <div className="flex items-center gap-2 self-start sm:self-auto sm:ml-auto">
            <Button
              onClick={() => setOpen(true)}
              className="hover:cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Patient
            </Button>
            <Button
              className="hover:cursor-pointer"
              onClick={() => exportPatientsToCSV(patients)}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Active search chip */}
        {(debouncedSearch || filterType) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            {debouncedSearch && (
              <>
                <span>Results for</span>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                  "{debouncedSearch}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3 hover:cursor-pointer" />
                  </button>
                </span>
              </>
            )}
            {filterType && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full">
                {filterType === "age" && "Sorted by Age"}
                {filterType === "visits" && "Sorted by Most Visits"}
                {filterType === "lastVisit" && "Sorted by Last Visit"}
                <button onClick={() => { setFilterType(null); setCurrentPage(1); }}>
                  <X className="w-3 h-3 hover:cursor-pointer" />
                </button>
              </span>
            )}
            {debouncedSearch && <span>— {pagination.totalItems} found</span>}
          </div>
        )}
      </div>

      <div className="patients-root lg:p-4 mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* <h1 className="text-4xl font-extrabold text-black">Patient Directory</h1> */}
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Patient Directory
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage and monitor your entire patient roster
            </p>
          </div>

          <PatientDetailsModal open={open} onClose={() => setOpen(false)} />
        </div>

        {/* Patients Stats -- this will be used in dashboard */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Patients"
            value={totalPatients}
            sub="All time"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={UserCheck}
            label="Female Patients"
            value={femaleCount}
            sub={`${totalPatients - femaleCount} male`}
            color="bg-purple-50 text-purple-600"
          />
          <StatCard
            icon={Activity}
            label="Avg. Patient Age"
            value={avgAge}
            sub="years old"
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Recent Visits"
            value={recentVisits}
            sub="Last 2 weeks"
            color="bg-emerald-50 text-emerald-600"
          />
        </div> */}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-100">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-5">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Age
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Gender
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Visits
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Visit
                </TableHead>
                {/* <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Condition
                    </TableHead> */}

                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-5">
                  Delete
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && patients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-16 text-center text-slate-500"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                    <span className="text-sm">Loading patients…</span>
                  </TableCell>
                </TableRow>
              ) : patients.length > 0 ? (
                patients.map((patient, idx) => (
                  <TableRow
                    key={patient.id}
                    className="fade-row row-hover border-b border-slate-50 transition-colors cursor-pointer"
                    style={{ animationDelay: `${idx * 30}ms` }}
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                  >
                    {/* Name + avatar */}
                    <TableCell className="pl-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={patient.name} />
                        <span className="font-semibold text-slate-800 text-sm">
                          {patient.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Age */}
                    <TableCell className="text-sm ">
                      <span className="font-medium ">{patient.age}</span>
                      <span className=" text-xs ml-0.5">yr</span>
                    </TableCell>

                    {/* Gender pill */}
                    <TableCell>
                      <span
                        className={`text-m font-medium px-2.5 py-0.5 rounded-full ${
                          patient.gender === "Female"
                            ? "bg-pink-50 text-pink-700"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {patient.gender === "Female" ? (
                          <span className="inline-flex items-center">
                            <Venus className="w-3 h-3 mr-1" />
                            {patient.gender}
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <Mars className="w-3 h-3 mr-1" />
                            {patient.gender}
                          </span>
                        )}
                      </span>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="w-3 h-3" />
                          <span style={{ fontFamily: "'DM Mono', monospace" }}>
                            {patient.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs ">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                      </div>
                    </TableCell>

                    {/* Condition badge */}
                    {/* <TableCell>
                      <ConditionBadge condition={patient.condition} />
                    </TableCell> */}
                    {/* Total Visits */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Activity className="w-3.5 h-3.5" />
                        {patient.totalVisits ?? 0} visits
                      </div>
                    </TableCell>

                    {/* Last visit */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        {fmtDate(patient.lastVisit)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                        onClick={(e) => handeleDelete(e, patient.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-semibold text-slate-700">
                      No patients found
                    </p>
                    {debouncedSearch && (
                      <p className="text-sm text-slate-400 mt-1">
                        No results for{" "}
                        <span className="font-medium">"{debouncedSearch}"</span>
                        . Try a different term.
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startItem}–{endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalItems}
              </span>{" "}
              patients
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="border-slate-200 hover:border-blue-600 hover:cursor-pointer"
              >
                {/* <ChevronLeft className="w-4 h-4" /> */}
                Previous
              </Button>

              {pageNumbers.map((page, idx, arr) => {
                const gap = idx > 0 && page - arr[idx - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {gap && (
                      <span className="text-slate-400 text-sm px-1">…</span>
                    )}
                    <Button
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      variant={currentPage === page ? "default" : "outline"}
                      className={`h-8 w-8 p-0 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? "shadow-md"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                      }`}
                      style={
                        currentPage === page
                          ? {
                              background:
                                "linear-gradient(135deg,#3b82f6,#6366f1)",
                              border: "none",
                            }
                          : {}
                      }
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={currentPage === pagination.totalPages || loading}
                className="border-slate-200 hover:border-blue-600 hover:cursor-pointer"
              >
                {/* <ChevronRight className="w-4 h-4" /> */}
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
