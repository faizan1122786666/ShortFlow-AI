// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import {
// //   LayoutDashboard,
// //   Upload,
// //   Calendar,
// //   CheckCircle,
// //   Settings,
// //   Link2,
// //   Zap,
// //   Menu,
// //   X,
// //   Key,
// // } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { Button } from "@/components/ui/button";
// // import { useState } from "react";

// // const navItems = [
// //   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
// //   { href: "/upload", label: "Upload", icon: Upload },
// //   { href: "/scheduled", label: "Scheduled", icon: Calendar },
// //   { href: "/published", label: "Published", icon: CheckCircle },
// //   { href: "/accounts", label: "Accounts", icon: Link2 },
// //   { href: "/api-keys", label: "API Keys", icon: Key },
// //   { href: "/settings", label: "Settings", icon: Settings },
// // ];

// // export function Sidebar() {
// //   const pathname = usePathname();
// //   const [open, setOpen] = useState(false);

// //   return (
// //     <>
// //       <Button
// //         variant="ghost"
// //         size="icon"
// //         className="fixed left-4 top-4 z-50 lg:hidden"
// //         onClick={() => setOpen(!open)}
// //       >
// //         {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
// //       </Button>

// //       {open && (
// //         <div
// //           className="fixed inset-0 z-40 bg-black/50 lg:hidden"
// //           onClick={() => setOpen(false)}
// //         />
// //       )}

// //       <aside
// //         className={cn(
// //           "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform lg:translate-x-0",
// //           open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
// //         )}
// //       >
// //         <div className="flex h-16 items-center gap-2 border-b px-6">
// //           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
// //             <Zap className="h-4 w-4 text-primary-foreground" />
// //           </div>
// //           <span className="text-lg font-bold">ShortFlow AI</span>
// //         </div>

// //         <nav className="flex-1 space-y-1 p-4">
// //           {navItems.map((item) => {
// //             const Icon = item.icon;
// //             const isActive = pathname === item.href;
// //             return (
// //               <Link
// //                 key={item.href}
// //                 href={item.href}
// //                 onClick={() => setOpen(false)}
// //                 className={cn(
// //                   "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
// //                   isActive
// //                     ? "bg-primary/10 text-primary"
// //                     : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
// //                 )}
// //               >
// //                 <Icon className="h-4 w-4" />
// //                 {item.label}
// //               </Link>
// //             );
// //           })}
// //         </nav>
// //       </aside>
// //     </>
// //   );
// // }



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   Upload,
//   Calendar,
//   CheckCircle,
//   Settings,
//   Link2,
//   Zap,
//   Menu,
//   X,
//   Key,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// const navItems = [
//   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { href: "/upload", label: "Upload", icon: Upload },
//   { href: "/scheduled", label: "Scheduled", icon: Calendar },
//   { href: "/published", label: "Published", icon: CheckCircle },
//   { href: "/accounts", label: "Accounts", icon: Link2 },
//   { href: "/api-keys", label: "API Keys", icon: Key },
//   { href: "/settings", label: "Settings", icon: Settings },
// ];

// export function Sidebar() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="fixed left-4 top-4 z-50 lg:hidden"
//         onClick={() => setOpen(!open)}
//       >
//         {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//       </Button>

//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       <aside
//         className={cn(
//           "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform lg:translate-x-0",
//           open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         )}
//       >
//         <div className="flex h-16 items-center gap-2 border-b px-6">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
//             <Zap className="h-4 w-4 text-primary-foreground" />
//           </div>
//           <span className="text-lg font-bold">ShortFlow AI</span>
//         </div>

//         <nav className="flex-1 space-y-1 p-4">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = mounted && pathname === item.href;

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setOpen(false)}
//                 className={cn(
//                   "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
//                   isActive
//                     ? "bg-primary/10 text-primary"
//                     : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
//                 )}
//               >
//                 <Icon className="h-4 w-4" />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Calendar,
  CheckCircle,
  Settings,
  Link2,
  Zap,
  Menu,
  X,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/scheduled", label: "Scheduled", icon: Calendar },
  { href: "/published", label: "Published", icon: CheckCircle },
  { href: "/accounts", label: "Accounts", icon: Link2 },
  { href: "/api-keys", label: "API Keys", icon: Key },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setOpen((value) => !value)}
        suppressHydrationWarning
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        suppressHydrationWarning
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">ShortFlow AI</span>
        </div>

        <nav className="flex-1 space-y-1 p-4" suppressHydrationWarning>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = mounted && pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                suppressHydrationWarning
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}