import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, ArrowLeft, CheckCircle } from "lucide-react";

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
}

export default function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [year, setYear] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchEvent();
    checkExistingRegistration();
    loadProfile();
  }, [id, user]);

  const fetchEvent = async () => {
    const { data, error } = await (supabase as any)
      .from("events")
      .select("*")
      .eq("id", Number(id))
      .single();
    if (error || !data) {
      toast({ title: "Event not found", variant: "destructive" });
      navigate("/events");
      return;
    }
    setEvent(data as EventData);
    setLoading(false);
  };

  const checkExistingRegistration = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("event_registrations")
      .select("id")
      .eq("event_id", Number(id))
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setRegistered(true);
  };

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) {
      setFullName(data.full_name || "");
      setDepartment(data.department || "");
      setSection(data.section || "");
      setYear(data.year || "");
      setCollege(data.college || "");
      setPhone(data.phone || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) return;
    setSubmitting(true);

    try {
      const { error } = await (supabase as any).from("event_registrations").insert({
        event_id: event.id,
        user_id: user.id,
        full_name: fullName,
        department,
        section,
        year,
        college,
        phone,
        additional_info: additionalInfo || null,
      });

      if (error) throw error;

      // Also update profile
      await (supabase as any).from("profiles").update({
        full_name: fullName,
        department,
        section,
        year,
        college,
        phone,
      }).eq("id", user.id);

      setRegistered(true);
      toast({ title: "Registered!", description: `You're registered for ${event.title}` });
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground font-mono text-sm">Loading event...</p>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-5 sticky top-20">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {event.type}
              </span>
              <h2 className="text-xl font-bold text-foreground mt-3 mb-2">{event.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{eventDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{eventDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-3">
            {registered ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Registration Confirmed!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You're registered for <strong>{event.title}</strong>. We'll see you there!
                </p>
                <Button variant="outline" onClick={() => navigate("/events")}>
                  Back to Events
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Registration Form</h3>
                <p className="text-xs text-muted-foreground mb-5">Fill in your details to register for this event</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name *</Label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Rahul Sharma" required className="mt-1 bg-background border-border" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Department *</Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger className="mt-1 bg-background border-border"><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>
                          {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI&DS", "CSBS", "Other"].map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Section *</Label>
                      <Select value={section} onValueChange={setSection} required>
                        <SelectTrigger className="mt-1 bg-background border-border"><SelectValue placeholder="Select section" /></SelectTrigger>
                        <SelectContent>
                          {["A", "B", "C", "D", "E", "F"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Year *</Label>
                      <Select value={year} onValueChange={setYear} required>
                        <SelectTrigger className="mt-1 bg-background border-border"><SelectValue placeholder="Select year" /></SelectTrigger>
                        <SelectContent>
                          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">College *</Label>
                      <Input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Your college name" required className="mt-1 bg-background border-border" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone Number *</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" required className="mt-1 bg-background border-border" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Additional Information</Label>
                    <Textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Any relevant experience, dietary preferences, team name, etc." className="mt-1 bg-background border-border" rows={3} />
                  </div>

                  <Button type="submit" disabled={submitting || !department || !section || !year} className="w-full">
                    {submitting ? "Registering..." : "Confirm Registration"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
