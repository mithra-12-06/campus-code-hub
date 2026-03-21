import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Trash2, Users, Calendar, Eye } from "lucide-react";

interface EventRow {
  id: number;
  title: string;
  description: string | null;
  date: string;
  type: string;
}

interface Registration {
  id: string;
  full_name: string;
  department: string;
  section: string;
  year: string;
  college: string;
  phone: string;
  additional_info: string | null;
  created_at: string;
}

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "registrations">("events");

  // New event form
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newType, setNewType] = useState("Workshop");

  // Registrations view
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
      toast({ title: "Access denied", description: "Admin role required.", variant: "destructive" });
    }
  }, [user, isAdmin, authLoading]);

  useEffect(() => {
    if (isAdmin) fetchEvents();
  }, [isAdmin]);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
    setEvents((data as EventRow[]) || []);
    setLoading(false);
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("events").insert({
      title: newTitle,
      description: newDesc,
      date: newDate,
      type: newType,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Event created!" });
    setShowCreate(false);
    setNewTitle(""); setNewDesc(""); setNewDate(""); setNewType("Workshop");
    fetchEvents();
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("Delete this event? All registrations will be removed.")) return;
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted" });
    fetchEvents();
  };

  const viewRegistrations = async (eventId: number) => {
    setSelectedEventId(eventId);
    setActiveTab("registrations");
    setRegLoading(true);
    const { data } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    setRegistrations((data as Registration[]) || []);
    setRegLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground font-mono text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">// Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "events" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Manage Events
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "registrations" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Registrations
          </button>
        </div>

        {activeTab === "events" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Events ({events.length})</h2>
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> Add Event</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createEvent} className="space-y-4 mt-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="mt-1" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Date & Time</Label>
                        <Input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} required className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select value={newType} onValueChange={setNewType}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["Hackathon", "Contest", "Workshop", "Bootcamp", "Sprint", "Webinar"].map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Create Event</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{ev.type}</span>
                      <h3 className="text-sm font-semibold text-foreground">{ev.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewRegistrations(ev.id)}>
                      <Eye className="h-3 w-3 mr-1" /> Registrations
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteEvent(ev.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "registrations" && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground mb-1">
                {selectedEvent ? `Registrations for "${selectedEvent.title}"` : "Select an event to view registrations"}
              </h2>
              {!selectedEvent && (
                <div className="space-y-2 mt-4">
                  {events.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => viewRegistrations(ev.id)}
                      className="w-full text-left rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors"
                    >
                      <span className="text-sm font-semibold text-foreground">{ev.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">({ev.type})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedEvent && (
              <>
                <Button variant="outline" size="sm" onClick={() => { setSelectedEventId(null); setRegistrations([]); }} className="mb-4">
                  ← All Events
                </Button>
                {regLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : registrations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No registrations yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">#</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Name</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Dept</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Sec</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Year</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">College</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Phone</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Info</th>
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((r, i) => (
                          <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                            <td className="px-3 py-2 text-foreground font-medium">{r.full_name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.department}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.section}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.year}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.college}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.phone}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.additional_info || "—"}</td>
                            <td className="px-3 py-2 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
