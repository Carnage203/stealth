import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Activity,
  FileText,
  Loader2,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data (replace with API)
const mockVisitData = {
  patient: {
    id: "pat_001",
    name: "John Doe",
    age: 42,
    gender: "Male",
    phone: "+918917726364",
  },
  visit: {
    id: "visit_001",
    patientId: "pat_001",
    date: "2024-01-01T12:00:00",
    duration: "34 minutes",
    doctor: "Dr. Smith",
    transcription: [
      {
        start: 0.0,
        end: 4.8,
        sentence:
          "Hi John, good to see you again. How have you been feeling since we adjusted your medication last month?",
        speaker: "Doctor",
      },
      {
        start: 5.0,
        end: 11.2,
        sentence:
          "It's been better, honestly. The lower back pain has definitely improved.",
        speaker: "Patient",
      },
      {
        start: 11.4,
        end: 16.9,
        sentence:
          "I'd say the pain level is around a three out of ten most days now, compared to a seven it was before.",
        speaker: "Patient",
      },
      {
        start: 17.2,
        end: 21.6,
        sentence:
          "That's excellent news. Any side effects like dizziness or fatigue?",
        speaker: "Doctor",
      },
      {
        start: 22.0,
        end: 27.5,
        sentence:
          "No dizziness. Maybe a little tired in the afternoons, but I've also been working late, so it might just be that.",
        speaker: "Patient",
      },
      {
        start: 28.0,
        end: 34.2,
        sentence:
          "Blood pressure looks good, one twenty over eighty. Pulse is steady at seventy-two. Lungs sound clear.",
        speaker: "Doctor",
      },
    ],
    soap: {
      subjective:
        "Patient presents for Annual Physical. Reports significant improvement in lower back pain following recent medication adjustment. Current pain level is approximately 3/10 on most days, improved from previous 7/10. Denies dizziness. Notes mild afternoon fatigue, likely related to extended work hours.",
      vitals: {
        bp: "120/80",
        pulse: "72 bpm",
        temp: "98.4 F",
        resp: "16",
      },
      objective:
        "General: Well-developed, well-nourished male in no acute distress. Lungs: Clear to auscultation bilaterally. Cardiovascular: Regular rate and rhythm, no murmurs.",
      assessment: [
        "1. Chronic Lower Back Pain (M54.5) - Improving",
        "2. Essential Hypertension (I10) - Controlled",
      ],
      plan: [
        "Continue current medication regimen for lower back pain and hypertension.",
        "Follow up in 3 months for blood pressure monitoring and pain reassessment.",
        "Refer to Physical Therapy if pain worsens or improvement plateaus.",
        "Advised on sleep hygiene and work-life balance to address afternoon fatigue.",
      ],
    },
  },
};

interface Transcription {
  start: number;
  end: number;
  sentence: string;
  speaker: string;
}

interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  resp: string;
}

interface SOAP {
  subjective: string;
  vitals: Vitals;
  objective: string;
  assessment: string[];
  plan: string[];
}

interface Visit {
  id: string;
  patientId: string;
  date: string;
  duration: string;
  doctor: string;
  transcription: Transcription[];
  soap: SOAP;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
}

interface VisitData {
  patient: Patient;
  visit: Visit;
}

export default function ViewPatientVisitDetails() {
  const { patientId, visitId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<VisitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTranscript, setActiveTranscript] = useState<number | null>(null);

  const fetchVisitDetails = useCallback(
    async (patId: string | undefined, visId: string | undefined) => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Replace with real API:
        // const response = await fetch(`/api/patients/${patId}/visits/${visId}`);
        // if (!response.ok) throw new Error('Failed to fetch visit details');
        // const visitData = await response.json();
        // setData(visitData);

        setData(mockVisitData);
      } catch (err) {
        setError("Failed to load visit details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchVisitDetails(patientId, visitId);
  }, [patientId, visitId, fetchVisitDetails]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || "Visit not found"}
          </div>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            <ArrowLeft className="size-4 mr-2" />
            Back to Patient
          </Button>
        </div>
      </div>
    );
  }

  const { patient, visit } = data;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Visit Details</h1>
            <p className="text-gray-500 mt-1">
              Complete visit information and transcription
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Visit ID: {visit.id}
          </Badge>
        </div>

        {/* Patient & Visit Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Patient & Visit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Patient Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xl font-semibold">{patient.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{patient.gender}</Badge>
                      <Badge variant="secondary">{patient.age} years</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{patient.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Visit Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-gray-400" />
                    <span>{formatDate(visit.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-400" />
                    <span>Duration: {visit.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-gray-400" />
                    <span>Doctor: {visit.doctor}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcription & SOAP Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transcription */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="size-5" />
                Conversation Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {visit.transcription.map((line, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-colors ${
                        line.speaker === "Doctor"
                          ? "bg-blue-500 border border-blue-200"
                          : "bg-gray-500 border border-gray-200"
                      } ${
                        activeTranscript === index ? "ring-2 ring-blue-400" : ""
                      }`}
                      onMouseEnter={() => setActiveTranscript(index)}
                      onMouseLeave={() => setActiveTranscript(null)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <Badge
                          variant={
                            line.speaker === "Doctor" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {line.speaker}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatTime(line.start)} - {formatTime(line.end)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{line.sentence}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* SOAP Notes */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                SOAP Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {/* Subjective */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        S
                      </Badge>
                      <h3 className="font-semibold">Subjective</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {visit.soap.subjective}
                    </p>
                  </div>

                  <Separator />

                  {/* Objective with Vitals */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        O
                      </Badge>
                      <h3 className="font-semibold">Objective</h3>
                    </div>

                    {/* Vitals */}
                    <div className="mb-3 p-3 bg-green-300 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium mb-2">Vital Signs</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">BP:</span>{" "}
                          <span className="font-medium">
                            {visit.soap.vitals.bp}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pulse:</span>{" "}
                          <span className="font-medium">
                            {visit.soap.vitals.pulse}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Temp:</span>{" "}
                          <span className="font-medium">
                            {visit.soap.vitals.temp}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Resp:</span>{" "}
                          <span className="font-medium">
                            {visit.soap.vitals.resp}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {visit.soap.objective}
                    </p>
                  </div>

                  <Separator />

                  {/* Assessment */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        A
                      </Badge>
                      <h3 className="font-semibold">Assessment</h3>
                    </div>
                    <ul className="space-y-2">
                      {visit.soap.assessment.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-yellow-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Plan */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        P
                      </Badge>
                      <h3 className="font-semibold">Plan</h3>
                    </div>
                    <ul className="space-y-2">
                      {visit.soap.plan.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-blue-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
