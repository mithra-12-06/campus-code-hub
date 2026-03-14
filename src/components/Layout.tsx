import { Link, useLocation } from "react-router-dom";
import { Terminal, LayoutDashboard, Trophy, Code2, Calendar, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Terminal },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/problems", label: "Problems", icon: Code2 },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

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
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
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
            })}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
