import { Link, useLocation } from "react-router-dom";
import { Terminal, LayoutDashboard, Trophy, Code2, Calendar, BarChart3, Swords, Users, History, Flame, Timer, LogIn, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/", label: "Home", icon: Terminal },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/problems", label: "Problems", icon: Code2 },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const moreItems = [
  { to: "/contest", label: "Contest", icon: Timer },
  { to: "/battle", label: "Battle", icon: Swords },
  { to: "/pair", label: "Pair Code", icon: Users },
  { to: "/submissions", label: "Submissions", icon: History },
  { to: "/heatmap", label: "Heatmap", icon: Flame },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const renderLink = ({ to, label, icon: Icon }: typeof navItems[0]) => {
    const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
    return (
      <Link
        key={to}
        to={to}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 gap-1">
          <Link to="/" className="flex items-center gap-2 mr-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Terminal className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm font-bold text-foreground">GFG<span className="text-primary">::</span>Campus</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(renderLink)}
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                More ▾
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-md border border-border bg-card shadow-lg py-1">
                    {moreItems.map(({ to, label, icon: Icon }) => {
                      const active = location.pathname === to;
                      return (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Auth section - pushed to the right */}
          <div className="ml-auto flex items-center gap-1">
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  location.pathname === "/admin"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  location.pathname === "/auth"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
