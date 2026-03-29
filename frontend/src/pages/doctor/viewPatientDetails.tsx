import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Phone,
  Mail,
  Loader2,
  ArrowUpDown,
  ArrowLeft,
  User,
  Activity,
  Clock,
  FileText,
  MoreVertical,
  Stethoscope,
  Pencil,
  TriangleAlert,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// Mock patient data (replace with API)
const mockPatient = {
  id: 88291,
  name: "Jane Doe",
  age: 34,
  gender: "Female",
  dob: "Jan 12, 1989",
  phone: "+91 9876543210",
  email: "jane.doe@email.com",
  address: "123 Main Street, Mumbai, Maharashtra 400001",
  bloodGroup: "O+",
  lastVisit: "Oct 24, 2023",
  condition: "Hypertension",
  allergies: ["Penicillin"],
  emergencyContact: "+91 9876543211",
  emergencyContactName: "Rajat Dalal (Don)",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
};

// Mock visits data (replace with API)
const mockVisits = [
  {
    id: "V-1001",
    date: "2024-01-15",
    reason: "Routine Checkup",
    notes: "BP controlled, patient doing well",
    status: "Billing",
    vitals: { bp: "120/80", temp: "98.6°F", weight: "75kg" },
  },
  {
    id: "V-0987",
    date: "2023-12-20",
    reason: "Follow-up",
    notes: "Medication adjusted, BP slightly elevated",
    status: "Completed",
    vitals: { bp: "130/85", temp: "98.4°F", weight: "76kg" },
  },
  {
    id: "V-0921",
    date: "2023-11-11",
    reason: "Initial Visit",
    notes: "New patient, diagnosed with hypertension",
    status: "Review",
    vitals: { bp: "140/90", temp: "98.6°F", weight: "77kg" },
  },
  {
    id: "V-0856",
    date: "2023-10-05",
    reason: "Emergency Visit",
    notes: "Severe headache, BP monitoring required",
    status: "Billing",
    vitals: { bp: "150/95", temp: "99.1°F", weight: "77kg" },
  },
  {
    id: "V-0723",
    date: "2023-09-15",
    reason: "Routine Checkup",
    notes: "General health assessment",
    status: "Completed",
    vitals: { bp: "135/88", temp: "98.5°F", weight: "78kg" },
  },
  {
    id: "V-0620",
    date: "2023-08-10",
    reason: "Follow-up",
    notes: "BP medication working well",
    status: "Review",
    vitals: { bp: "125/82", temp: "98.6°F", weight: "78kg" },
  },
  {
    id: "V-0545",
    date: "2023-07-22",
    reason: "Lab Results",
    notes: "Blood work shows improvement",
    status: "Completed",
    vitals: { bp: "128/84", temp: "98.5°F", weight: "79kg" },
  },
  {
    id: "V-0478",
    date: "2023-06-18",
    reason: "Routine Checkup",
    notes: "General wellness check",
    status: "Billing",
    vitals: { bp: "132/86", temp: "98.7°F", weight: "79kg" },
  },
  {
    id: "V-0401",
    date: "2023-05-12",
    reason: "Follow-up",
    notes: "Lifestyle changes discussed",
    status: "Completed",
    vitals: { bp: "138/89", temp: "98.6°F", weight: "80kg" },
  },
  {
    id: "V-0325",
    date: "2023-04-08",
    reason: "Emergency Visit",
    notes: "Chest discomfort, EKG normal",
    status: "Review",
    vitals: { bp: "145/92", temp: "99.0°F", weight: "80kg" },
  },
  {
    id: "V-0267",
    date: "2023-03-15",
    reason: "Routine Checkup",
    notes: "Blood pressure monitoring",
    status: "Completed",
    vitals: { bp: "140/90", temp: "98.5°F", weight: "81kg" },
  },
  {
    id: "V-0198",
    date: "2023-02-20",
    reason: "Follow-up",
    notes: "Medication dosage adjustment",
    status: "Review",
    vitals: { bp: "142/91", temp: "98.6°F", weight: "81kg" },
  },
  {
    id: "V-0134",
    date: "2023-01-18",
    reason: "Initial Visit",
    notes: "First consultation for hypertension",
    status: "Completed",
    vitals: { bp: "148/94", temp: "98.7°F", weight: "82kg" },
  },
];

interface Visit {
  id: string;
  date: string;
  reason: string;
  notes: string;
  status: string;
  vitals: {
    bp: string;
    temp: string;
    weight: string;
  };
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  dob?: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  lastVisit: string;
  condition: string;
  allergies: string[];
  emergencyContact: string;
  emergencyContactName: string;
  avatar?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function ViewPatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterReason, setFilterReason] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchPatientDetails = useCallback(
    async (patientId: string | undefined) => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Replace with real API:
        // const patientRes = await fetch(`/api/patients/${patientId}`);
        // if (!patientRes.ok) throw new Error('Patient not found');
        // const patientData = await patientRes.json();
        // setPatient(patientData);

        setPatient({ ...mockPatient, id: Number(patientId ?? mockPatient.id) });
      } catch (err) {
        setError("Failed to load patient details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchPatientVisits = useCallback(
    async (
      patientId: string | undefined,
      search: string,
      page: number,
      reason: string,
      sort: "asc" | "desc",
    ) => {
      setVisitsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Replace with real API:
        // const visitsRes = await fetch(
        //   `/api/patients/${patientId}/visits?search=${search}&page=${page}&limit=10&reason=${reason}&sort=${sort}`
        // );
        // if (!visitsRes.ok) throw new Error('Failed to fetch visits');
        // const visitsData = await visitsRes.json();
        // setVisits(visitsData.visits);
        // setPagination(visitsData.pagination);

        const itemsPerPage = 10;
        let filtered = mockVisits.filter((v) => {
          const q = search.toLowerCase();
          return (
            v.id.toLowerCase().includes(q) ||
            v.date.includes(search) ||
            v.reason.toLowerCase().includes(q)
          );
        });

        // Filter by reason
        if (reason !== "all") {
          filtered = filtered.filter((v) =>
            v.reason.toLowerCase().includes(reason.toLowerCase()),
          );
        }

        // Sort by date
        filtered.sort((a, b) => {
          const aDate = new Date(a.date).getTime();
          const bDate = new Date(b.date).getTime();
          return sort === "desc" ? bDate - aDate : aDate - bDate;
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filtered.slice(startIndex, endIndex);

        setVisits(paginatedData);
        setPagination({
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage,
        });
      } catch (err) {
        setError("Failed to load visits.");
        console.error(err);
      } finally {
        setVisitsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPatientDetails(id);
  }, [id, fetchPatientDetails]);

  useEffect(() => {
    fetchPatientVisits(
      id,
      debouncedSearchQuery,
      currentPage,
      filterReason,
      sortOrder,
    );
  }, [
    id,
    debouncedSearchQuery,
    currentPage,
    filterReason,
    sortOrder,
    fetchPatientVisits,
  ]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, filterReason]);

  const uniqueReasons = useMemo(() => {
    return Array.from(new Set(mockVisits.map((v) => v.reason)));
  }, []);

  const handleBack = () => {
    navigate("/doctor/patients");
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen lg:p-4">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hover:cursor-pointer hover:bg-linear-to-b from-blue-50 to-blue-100"
              onClick={handleBack}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            {/* <div>
              <h1 className="text-3xl font-bold text-[#137fec] ">
                Patient Details
              </h1>
              <p className="text-gray-500 mt-1">
                Overview and complete visit history
              </p>
            </div> */}
          </div>
          {loading && <Loader2 className="size-6 animate-spin " />}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Patient Header Card */}
        <Card className="bg-white">
          <CardContent className="p-6">
            {patient ? (
              <div className="flex items-start justify-between gap-6">
                {/* Left: Avatar + Info */}
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />

                  {/* Info */}
                  <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {/* Name + ID */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {patient.name}
                        </h2>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-600 font-medium"
                        >
                          #{patient.id}
                        </Badge>
                      </div>

                      {/* Gender, Age, DOB */}
                      <p className="">
                        {patient.gender}, {patient.age} yrs • DOB: {patient.dob}
                      </p>

                      {/* Last Visit */}
                      <p className="">Last Visit: {patient.lastVisit}</p>
                    </div>

                    {/* Emergency Info */}
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Contact Information
                      </h1>

                      <a
                        href={`mailto:${patient.email}`}
                        className="flex items-center gap-3 hover:text-blue-600 cursor-pointer hover:decoration-blue-600 !underline!"
                      >
                        <Mail className="size-4 " />
                        {patient.email}
                      </a>

                      <a
                        href={`tel:${patient.emergencyContact}`}
                        className="flex items-center gap-3 hover:text-blue-600 cursor-pointer !underline!"
                      >
                        <User className="size-4 " />
                        {patient.emergencyContact}
                      </a>

                      <div className="flex items-center gap-3">
                        <Activity className="size-4 " />
                        <span className="">{patient.emergencyContactName}</span>
                      </div>
                    </div>

                    {/* Badges: Allergy + Condition */}
                    {/* <div className="flex items-center gap-3 pt-2">
                      {patient.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1"
                        >
                          <TriangleAlert className="size-3.5 mr-1.5" />
                          Allergy: {allergy}
                        </Badge>
                      ))}
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-3 py-1">
                        <HeartPulse className="size-3.5 mr-1.5" />
                        Condition: {patient.condition}
                      </Badge>
                    </div> */}
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button className="bg-[#137fec] hover:bg-[#0f6dd1] text-white px-5">
                    <Stethoscope className="size-4 mr-2" />
                    Start New Visit
                  </Button>
                  <Button variant="outline" className="px-5">
                    <Pencil className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-8 animate-spin " />
              </div>
            )}
          </CardContent>
        </Card>
        {/* Visits Card */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                Visit History
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                {pagination.totalItems} Total Visits
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-black" />
                <Input
                  type="text"
                  placeholder="Search by visit ID, date (YYYY-MM-DD), or reason..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {visitsLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-black animate-spin" />
                )}
              </div>
              <div className="flex gap-2">
                <Select value={filterReason} onValueChange={setFilterReason}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    {uniqueReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                  }
                >
                  <ArrowUpDown className="size-4 mr-2" />
                  {sortOrder === "desc" ? "Most Recent" : "Oldest First"}
                </Button>
              </div>
            </div>

            {/* Visits Table */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visit ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Vitals</TableHead>
                    {/* <TableHead>Notes</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitsLoading && visits.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                        Loading visits...
                      </TableCell>
                    </TableRow>
                  ) : visits.length > 0 ? (
                    visits.map((visit) => (
                      <TableRow
                        key={visit.id}
                        className="cursor-pointer hover:bg-muted/60"
                        onClick={() =>
                          navigate(`/doctor/patient/${id}/visit/${visit.id}`)
                        }
                      >
                        <TableCell className="font-medium">
                          {visit.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3 " />
                            {visit.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{visit.reason}</Badge>
                        </TableCell>
                        {/* <TableCell className="text-sm">
                          {visit.doctor}
                        </TableCell> */}
                        <TableCell>
                          <div className="text-xs space-y-0.5">
                            <div>BP: {visit.vitals.bp}</div>
                            <div>Temp: {visit.vitals.temp}</div>
                            {/* <div>Weight: {visit.vitals.weight}</div> */}
                          </div>
                        </TableCell>
                        {/* <TableCell className="max-w-xs">
                          <span className="text-sm text-gray-600 line-clamp-2">
                            {visit.notes}
                          </span>
                        </TableCell> */}
                        <TableCell>
                          {visit.status === "Completed" && (
                            <Badge variant="success">Completed</Badge>
                          )}
                          {visit.status === "Review" && (
                            <Badge variant="warning">Review</Badge>
                          )}
                          {visit.status === "Billing" && (
                            <Badge variant="billing">Billing</Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right pr-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
                              >
                                <MoreVertical className="w-4 h-4 text-slate-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 rounded-xl shadow-lg border-slate-100"
                            >
                              <DropdownMenuItem className="text-sm cursor-pointer rounded-lg">
                                Proceed to{" "}
                                {visit.status === "Billing"
                                  ? "Billing"
                                  : "Review"}
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem className="text-sm cursor-pointer rounded-lg">
                            Edit Patient
                          </DropdownMenuItem> */}
                              {/* <DropdownMenuItem className="text-sm cursor-pointer rounded-lg">
                            View History
                          </DropdownMenuItem> */}
                              <DropdownMenuItem className="text-sm cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50">
                                Delete Visit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No visits found
                        {(debouncedSearchQuery || filterReason !== "all") && (
                          <span className="block mt-1 text-sm">
                            Try adjusting your search or filters
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalItems > 0 && (
              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  {visits.length > 0
                    ? (currentPage - 1) * pagination.itemsPerPage + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * pagination.itemsPerPage,
                    pagination.totalItems,
                  )}{" "}
                  of {pagination.totalItems} visits
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || visitsLoading}
                    className="border-slate-200 hover:border-blue-600 hover:cursor-pointer"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    )
                      .filter((page) => {
                        // Show first page, last page, current page, and adjacent pages
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis
                        const showEllipsisBefore =
                          index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsisBefore && (
                              <span className="px-2 text-gray-500">...</span>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              disabled={visitsLoading}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={
                      currentPage === pagination.totalPages || visitsLoading
                    }
                    className="border-slate-200 hover:border-blue-600 hover:cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Clear filter button */}
            {filterReason !== "all" && (
              <div className="flex justify-end">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setFilterReason("all")}
                  className="h-auto p-0"
                >
                  Clear filter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
