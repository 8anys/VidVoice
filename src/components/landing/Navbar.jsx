import { Link } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/auth/UserDropdown";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Audio", href: "#audio-editor" },
  { label: "Images", href: "#images" },
  { label: "Video", href: "#video" },
];

export default function Navbar() {
  const { isAuthenticated, navigateToLogin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-foreground">VidVoice</p>
            <p className="font-pixel text-[8px] uppercase tracking-widest text-primary">Studio</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-body text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#audio-editor"
            className="hidden text-sm font-body text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Start
          </a>
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Button onClick={navigateToLogin} className="rounded-xl bg-primary hover:bg-primary/90">
              Sign in
            </Button>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-secondary/40 text-muted-foreground md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
