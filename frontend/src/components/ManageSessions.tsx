import { useEffect, useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  LogOut,
  ShieldAlert,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  last_active: string;
  is_current?: boolean;
}

interface SessionsResponse {
  status: string;
  data: Session[];
  count: number;
}

function getDeviceIcon(device?: string) {
  switch (device?.toLowerCase()) {
    case "mobile":
      return <Smartphone className="w-5 h-5" />;
    case "tablet":
      return <Tablet className="w-5 h-5" />;
    default:
      return <Monitor className="w-5 h-5" />;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ManageSessions() {
  const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [logoutLoadingId, setLogoutLoadingId] = useState<string | null>(null);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${SERVER_URL}/sessions/get-all-sessions?user_id=${userId}`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data: SessionsResponse = await res.json();
      setSessions(data.data ?? []);
      setCount(data.count ?? 0);
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const logoutSession = async (sessionId: string) => {
    try {
      setLogoutLoadingId(sessionId);
      const res = await fetch(
        `${SERVER_URL}/sessions/logout/single-device?session_id=${sessionId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to logout session");
      toast.success("Session logged out successfully");
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId);
        setCount(updated.length);
        return updated;
      });
    } catch {
      toast.error("Failed to logout session");
    } finally {
      setLogoutLoadingId(null);
    }
  };

  const logoutAllSessions = async () => {
    try {
      setLogoutAllLoading(true);
      const res = await fetch(
        `${SERVER_URL}/sessions/logout/all-devices?user_id=${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to logout all sessions");
      toast.success("All other sessions logged out");
      setSessions((prev) => {
        const current = prev.filter((s) => s.is_current);
        setCount(current.length);
        return current;
      });
    } catch {
      toast.error("Failed to logout all sessions");
    } finally {
      setLogoutAllLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Sort: most recent last_active first
  const sortedSessions = [...sessions].sort(
    (a, b) =>
      new Date(b.last_active).getTime() - new Date(a.last_active).getTime(),
  );

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Manage Sessions
        </h1>
        <p className="text-sm mt-1">
          Manage your account security and active sessions.
        </p>
      </div>

      {/* Sessions Card */}
      <div className=" ounded-2xl border rounded-t-2xl border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-base">
              Active Sessions
            </h2>
            {!loading && (
              <span className="ml-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={logoutAllSessions}
            disabled={logoutAllLoading || count === 0}
            className="hover:cursor-pointer flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {logoutAllLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Logout All Other Devices
          </button>
        </div>

        {/* Sessions List */}
        <div className="divide-y">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 ">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading sessions...</span>
            </div>
          ) : sortedSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Monitor className="w-8 h-8 opacity-40" />
              <p className="text-sm">No active sessions found.</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Left: Device Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl ${
                      session.is_current
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {session.browser ?? "Unknown Browser"}{" "}
                        <span className="text-gray-400 font-normal">
                          on {session.os ?? "Unknown OS"}
                        </span>
                      </p>
                      {session.is_current && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Globe className="w-3 h-3" />
                        {session.device ?? "Unknown Device"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(session.last_active)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Logout Button */}
                {!session.is_current && (
                  <button
                    onClick={() => logoutSession(session.id)}
                    disabled={logoutLoadingId === session.id}
                    className="hover:cursor-pointer flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {logoutLoadingId === session.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
