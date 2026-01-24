import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-input-2";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (patientId: string) => void;
};

// Mock patient database
const MOCK_PATIENTS: Record<string, any> = {
  "MRN-1234": {
    id: "MRN-1234",
    firstName: "Michael",
    lastName: "Ross",
    age: "34",
    gender: "Male",
    phoneNumber: "+15550192233",
  },
  "MRN-5678": {
    id: "MRN-5678",
    firstName: "Sarah",
    lastName: "Johnson",
    age: "28",
    gender: "Female",
    phoneNumber: "+15550198877",
  },
  "MRN-9999": {
    id: "MRN-9999",
    firstName: "John",
    lastName: "Doe",
    age: "45",
    gender: "Male",
    phoneNumber: "+919876543210",
  },
};

export default function PatientDetailsModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [tab, setTab] = useState<"new" | "existing">("new");
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const SERVER_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // New patient form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phoneNumber: "",
  });

  // Existing patient search
  const [patientId, setPatientId] = useState("");
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [searchError, setSearchError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      phoneNumber: "",
    });
    setPatientId("");
    setFoundPatient(null);
    setSearchError("");
  };

  const handleSearchPatient = async () => {
    if (!patientId.trim()) {
      setSearchError("Please enter a Patient ID");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setFoundPatient(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Mock API call - search in mock database
      const patient = MOCK_PATIENTS[patientId.toUpperCase()];

      if (!patient) {
        setSearchError("Patient ID not found. Please verify and try again.");
        toast.error("Patient not found");
        return;
      }

      setFoundPatient(patient);
      setSearchError("");
      toast.success("Patient details found!");

      // const response = await fetch(`${SERVER_URL}/api/patients/${patientId}`, {
      //   method: "GET",
      //   credentials: "include",
      // });

      // const response = true as any;

      // if (!response.ok) {
      //   if (response.status === 404) {
      //     setSearchError("Patient ID not found. Please verify and try again.");
      //   } else {
      //     throw new Error("Failed to search patient");
      //   }
      //   return;
      // }

      // const data = await response.json();
      // setFoundPatient(data.patient);
      // toast.success("Patient details found!");
      // setSearchError("");
    } catch (error: any) {
      console.error("Error searching patient:", error);
      toast.error(error.message || "Failed to search patient");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.gender ||
      !formData.phoneNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    // Simulate Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Mock patient creation
      const mockPatientId = `MRN-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPatient = {
        id: mockPatientId,
        ...formData,
      };

      console.log("Created patient:", newPatient);
      toast.success(`Patient created successfully! ID: ${mockPatientId}`);

      resetForm();

      if (onSuccess) {
        onSuccess(mockPatientId);
      }

      onClose();
      navigate(`/doctor/consultations/${mockPatientId}`);

      // const response = await fetch(`${SERVER_URL}/api/patients`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     age: parseInt(formData.age),
      //     gender: formData.gender,
      //     phoneNumber: formData.phoneNumber,
      //   }),
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || "Failed to create patient");
      // }

      // const data = await response.json();

      // toast.success("Patient created successfully");

      // resetForm();

      // if (onSuccess) {
      //   onSuccess(data.patient.id);
      // }

      // onClose();
    } catch (error: any) {
      console.error("Error creating patient:", error);
      toast.error(error.message || "Failed to create patient");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    if (tab === "new") {
      handleCreatePatient();
    } else {
      if (!foundPatient) {
        toast.error("Please search and confirm patient details");
        return;
      }

      if (onSuccess) {
        onSuccess(foundPatient.id);
      }

      toast.success(
        `Starting recording for ${foundPatient.firstName} ${foundPatient.lastName}`,
      );

      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault(); // Prevent closing on outside click
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault(); // Prevent closing on Escape key
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-blue-500 text-xl">
            Patient Details
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Verify patient information before recording
          </p>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="new">New Patient</TabsTrigger>
            <TabsTrigger value="existing">Existing Patient</TabsTrigger>
          </TabsList>

          {/* ---------------- NEW PATIENT ---------------- */}
          <TabsContent value="new" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input
                  placeholder="Ex: 42"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <div className="">
                <PhoneInput
                  country={"in"}
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                  inputProps={{
                    name: "phoneNumber",
                    required: true,
                    id: "phoneNumber",
                  }}
                  containerClass=""
                  inputClass="max-w-md"
                  dropdownClass="!text-sm"
                  enableSearch
                  countryCodeEditable={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* ---------------- EXISTING PATIENT ---------------- */}
          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-2">
              <Label>Patient ID / MRN</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="MRN-1234"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
                <Button
                  onClick={handleSearchPatient}
                  disabled={searchLoading}
                  variant="outline"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </Button>
              </div>
              {searchError && (
                <p className="text-xs text-red-500">{searchError}</p>
              )}
            </div>

            {/* Confirmation section */}
            {foundPatient && (
              <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Confirmation Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">First Name</Label>
                    <Input disabled value={foundPatient.firstName} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Last Name</Label>
                    <Input disabled value={foundPatient.lastName} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Age</Label>
                    <Input disabled value={foundPatient.age} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <Input disabled value={foundPatient.gender} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Phone Number</Label>
                  <Input disabled value={foundPatient.phoneNumber} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="hover:cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="hover:cursor-pointer"
            onClick={handleStartRecording}
            disabled={isLoading || (tab === "existing" && !foundPatient)}
          >
            {isLoading ? "Processing..." : "🎙 Start Recording"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
