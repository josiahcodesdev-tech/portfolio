import { Clock, Layers, Users, FolderCheck } from "lucide-react";

const stats = [
  { icon: Clock, number: "5+", label: "Years Experience" },
  { icon: Layers, number: "6", label: "Service Areas" },
  { icon: Users, number: "100+", label: "Clients Served" },
  { icon: FolderCheck, number: "50+", label: "Projects Delivered" },
];

export function HomeStats() {
  return (
    <section className="bg-light-gray border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around h-[50px]">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="text-lg font-bold text-navy">
                    {stat.number}
                  </span>
                  <span className="text-xs text-body-text font-medium">
                    {stat.label}
                  </span>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-5 bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
