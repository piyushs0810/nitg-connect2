import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: "primary" | "success" | "warning" | "accent";
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  accent: "bg-blue-100 text-blue-700",
};

export function QuickAccessCard({ title, description, icon: Icon, href, color = "primary" }: QuickAccessCardProps) {
  return (
    <Link to={href} className="block">
      <div className="card-interactive p-6 h-full">
        <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
