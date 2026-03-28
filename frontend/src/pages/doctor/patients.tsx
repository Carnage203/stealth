import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Loader2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - will be replaced by API
const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    phone: "+91 9876543210",
    email: "john.doe@email.com",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
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

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
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
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Mock API call function - replace with actual API
  const fetchPatients = useCallback(async (page: number, search: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock API response
      // In production, replace with:
      // const response = await fetch(`/api/patients?page=${page}&search=${search}&limit=10`);
      // const data = await response.json();
      // setPatients(data.patients);
      // setPagination(data.pagination);

      const itemsPerPage = 10;
      let filteredData = mockPatients;

      // Apply search filter
      if (search) {
        filteredData = mockPatients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(search.toLowerCase()) ||
            patient.email.toLowerCase().includes(search.toLowerCase()) ||
            patient.phone.includes(search),
        );
      }

      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setPatients(paginatedData);
      setPagination({
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage,
      });
    } catch (err) {
      setError("Failed to fetch patients. Please try again.");
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch patients when page or search changes
  useEffect(() => {
    fetchPatients(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, fetchPatients]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  const handleViewDetails = (patientId: number) => {
    navigate(`/doctor/patient/${patientId}`);
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-gray-300 mt-1">Manage your patient records</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            Add Patient
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="rounded-lg shadow p-4 mb-6 border">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 animate-spin" />
              )}
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Patients Table */}
        <div className="border rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && patients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                    Loading patients...
                  </TableCell>
                </TableRow>
              ) : patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.name}
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="size-3" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="size-3" />
                          {patient.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4 text-gray-400" />
                        {patient.lastVisit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {patient.condition}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(patient.id)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No patients found
                    {debouncedSearchQuery && (
                      <span className="block mt-1 text-sm">
                        Try adjusting your search criteria
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing{" "}
            {patients.length > 0
              ? (currentPage - 1) * pagination.itemsPerPage + 1
              : 0}{" "}
            to{" "}
            {Math.min(
              currentPage * pagination.itemsPerPage,
              pagination.totalItems,
            )}{" "}
            of {pagination.totalItems} patients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
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
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        disabled={loading}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
