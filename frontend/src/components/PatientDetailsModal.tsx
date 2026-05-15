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
import { CircleUserRound } from "lucide-react";
import { Mic } from "lucide-react";
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
};


export default function PatientDetailsModal({
  open,
  onClose,
}: Props) {
  const [tab, setTab] = useState<"new" | "existing">("new");
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

    try {
      const response = await fetch(
        `${SERVER_URL}/patients/${patientId.trim()}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        if (response.status === 404) {
          setSearchError("Patient not found. Please verify the ID and try again.");
        } else {
          throw new Error("Search failed");
        }
        return;
      }

      const data = await response.json();
      setFoundPatient(data.patient);
      toast.success("Patient found!");
    } catch (error: any) {
      if (!searchError) {
        toast.error(error.message || "Failed to search patient");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreatePatient = () => {
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

    const patientState = {
      isNew: true,
      name: `${formData.firstName} ${formData.lastName}`,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phoneNumber,
    };

    resetForm();
    onClose();
    navigate("/doctor/consultations", { state: patientState });
  };

  const handleStartRecording = () => {
    if (tab === "new") {
      handleCreatePatient();
    } else {
      if (!foundPatient) {
        toast.error("Please search and confirm patient details");
        return;
      }

      const patientState = {
        isNew: false,
        patientId: foundPatient.id,
        name: foundPatient.name,
        age: foundPatient.age,
        gender: foundPatient.gender,
        phone: foundPatient.phone ?? "",
      };

      resetForm();
      onClose();
      navigate("/doctor/consultations", { state: patientState });
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
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-black text-xl font-semibold">
            Patient Details
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter details to begin consultation recording
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
                <div className="relative">
                  <CircleUserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="First name"
                    className="pl-9"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
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
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
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
              <Label>Patient ID</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Last 6 characters (e.g. 8df167)"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
                <Button
                  onClick={handleSearchPatient}
                  disabled={searchLoading}
                  variant="outline"
                  className="hover:cursor-pointer hover: hover:bg-linear-to-b from-blue-50 to-blue-100"
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

                <div className="space-y-1">
                  <Label className="text-xs">Full Name</Label>
                  <Input disabled value={foundPatient.name} />
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
                  <Input disabled value={foundPatient.phone ?? "—"} />
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
            className="hover:cursor-pointer hover:bg-linear-to-b from-blue-50 to-blue-100"
          >
            Cancel
          </Button>
          <Button
            className="hover:cursor-pointer"
            onClick={handleStartRecording}
            disabled={tab === "existing" && !foundPatient}
          >
            <Mic className="size-4" /> Start Recording
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
