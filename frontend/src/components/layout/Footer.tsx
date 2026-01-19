import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-foreground">NIT Goa</span>
                <span className="text-xs text-muted-foreground block">Student Portal</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A student-led initiative to provide utility services for the NIT Goa campus community.
              Built for internal campus use.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/notices" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Notices
                </Link>
              </li>
              <li>
                <Link to="/lost-found" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Lost & Found
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Buy & Sell
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>NIT Goa Campus</li>
              <li>cuncolim,Sourh goa</li>
              <li>Goa - 403703</li>
              <li className="pt-2">
                <a href="mailto:portal@nitgoa.ac.in" className="hover:text-primary transition-colors">
                  portal@nitgoa.ac.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2026 NIT Goa Student Portal. This is a non-commercial, student-led project.
            </p>
            <p className="text-xs text-muted-foreground">
              For internal campus use only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
