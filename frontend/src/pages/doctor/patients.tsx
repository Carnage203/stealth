import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Calendar,
  Loader2,
  X,
  Venus,
  Mars,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string | null;
  visits: number;
  lastVisit: string | null;
  status: "review" | "billing" | "completed";
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const ITEMS_PER_PAGE = 10;

const STATUS_TABS = [
  { key: "all", label: "All Patients" },
  { key: "review", label: "Ready for Review" },
  { key: "billing", label: "Billing Pending" },
  { key: "completed", label: "Completed" },
] as const;

type StatusFilter = (typeof STATUS_TABS)[number]["key"];

const STATUS_CONFIG: Record<
  Exclude<StatusFilter, "all">,
  { label: string; color: string }
> = {
  review: { label: "Ready for Review", color: "text-amber-600" },
  billing: { label: "Billing Pending", color: "text-blue-600" },
  completed: { label: "Completed", color: "text-emerald-600" },
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function initials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function avatarHue(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
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

function exportPatientsToCSV(patients: Patient[]) {
  if (patients.length === 0) {
    toast.error("No patients to export");
    return;
  }

  const headers = [
    "Patient ID",
    "Name",
    "Age",
    "Gender",
    "Phone",
    "Last Visit",
    "Total Visits",
    "Status",
  ];
  const csvRows = [
    headers.join(","),
    ...patients.map((patient) =>
      [
        `#${patient.id.slice(-4).toUpperCase()}`,
        `"${patient.name}"`,
        patient.age,
        patient.gender,
        `"${patient.phone ?? ""}"`,
        patient.lastVisit ?? "",
        patient.visits,
        patient.status,
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
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const debouncedSearch = useDebounce(searchQuery, 400);
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/patients/?limit=100&offset=0`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data: Patient[] = await res.json();
      setAllPatients(data);
    } catch {
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    let filtered = debouncedSearch
      ? allPatients.filter(
          (p) =>
            p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (p.phone && p.phone.includes(debouncedSearch)),
        )
      : allPatients;

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    setPatients(filtered.slice(start, start + ITEMS_PER_PAGE));
    setPagination({
      currentPage: safePage,
      totalPages,
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
    });
  }, [allPatients, debouncedSearch, statusFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const startItem =
    patients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    pagination.totalItems,
  );

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .patients-root { font-family: 'Inter', sans-serif; }
        .fade-row { animation: fadeUp .25s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .row-hover:hover { background: #f8faff !important; }
      `}</style>

      {/* Top search bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm px-5 py-3.5">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search patients, ID, or phone number…"
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
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="hover:cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Patient
          </Button>
          <Button
            variant="outline"
            className="hover:cursor-pointer border-slate-200"
            onClick={() => exportPatientsToCSV(patients)}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="patients-root lg:p-6 mx-auto space-y-5">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Patients Directory
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage and monitor your entire patient roster
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border hover:cursor-pointer
                ${
                  statusFilter === tab.key
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active search chip */}
        {debouncedSearch && (
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap -mt-2">
            <span>Results for</span>
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
              "{debouncedSearch}"
              <button onClick={() => setSearchQuery("")}>
                <X className="w-3 h-3 hover:cursor-pointer" />
              </button>
            </span>
            <span>— {pagination.totalItems} found</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <PatientDetailsModal open={open} onClose={() => setOpen(false)} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-100">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-5 w-24">
                  Patient ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Patient Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                  Age / Sex
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact Info
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                  Visits
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Visit
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-12 pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && patients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-16 text-center text-slate-500"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                    <span className="text-sm">Loading patients…</span>
                  </TableCell>
                </TableRow>
              ) : patients.length > 0 ? (
                patients.map((patient, idx) => {
                  const sexChar =
                    patient.gender === "Female"
                      ? "F"
                      : patient.gender === "Male"
                        ? "M"
                        : "O";
                  const dt = patient.lastVisit
                    ? fmtDateTime(patient.lastVisit)
                    : null;
                  const statusCfg =
                    patient.status in STATUS_CONFIG
                      ? STATUS_CONFIG[
                          patient.status as Exclude<StatusFilter, "all">
                        ]
                      : null;

                  return (
                    <TableRow
                      key={patient.id}
                      className="fade-row row-hover border-b border-slate-50 transition-colors cursor-pointer"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      onClick={() =>
                        navigate(`/doctor/patients/${patient.id}`)
                      }
                    >
                      {/* Patient ID */}
                      <TableCell className="pl-5 py-4">
                        <span className="text-xs font-mono text-slate-500">
                          {patient.id.slice(-6)}
                        </span>
                      </TableCell>

                      {/* Patient Name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.name} />
                          <span className="font-semibold text-slate-800 text-sm">
                            {patient.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Age / Sex */}
                      <TableCell className="text-sm text-slate-700">
                        <span className="font-medium">{patient.age}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        {patient.gender === "Female" ? (
                          <span className="inline-flex items-center gap-0.5 text-pink-600">
                            <Venus className="w-3 h-3" />
                            {sexChar}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-sky-600">
                            <Mars className="w-3 h-3" />
                            {sexChar}
                          </span>
                        )}
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell className="text-sm text-slate-600">
                        {patient.phone ?? (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>

                      {/* Visits badge */}
                      <TableCell>
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
                          {patient.visits}
                        </span>
                      </TableCell>

                      {/* Last Visit */}
                      <TableCell>
                        {dt ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {dt.date}
                            </div>
                            <div className="text-xs text-slate-400 ml-5 mt-0.5">
                              {dt.time}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No visits yet
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {statusCfg ? (
                          <span
                            className={`text-sm font-medium ${statusCfg.color}`}
                          >
                            {statusCfg.label}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 capitalize">
                            {patient.status}
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Patient deleted successfully!");
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
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
                  setCurrentPage((p) =>
                    Math.min(pagination.totalPages, p + 1),
                  )
                }
                disabled={currentPage === pagination.totalPages || loading}
                className="border-slate-200 hover:border-blue-600 hover:cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
