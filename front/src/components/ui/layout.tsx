import { useQueryClient } from "@tanstack/react-query";
import { Home, Car, Calendar, User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useLocation } from "react-router-dom";
import { logout } from "@/utils/logout";
import { useUserSession } from "@/hooks/session";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/rides", label: "Rides", icon: Car },
  { to: "/activities", label: "Activities", icon: Calendar },
];

export default function PageLayout({ children }: React.PropsWithChildren) {
  const { user } = useUserSession();
  const queryClient = useQueryClient();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar for larger screens */}
      <nav className="hidden md:flex bg-white border-b-2 border-primary/40 shadow-sm text-foreground py-4">
        <div className="px-20 flex justify-between w-full">
          <div className="flex w-full justify-between space-x-6 items-center">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center hover:text-primary ${
                  location.pathname === to ? "text-primary font-semibold" : ""
                }`}
              >
                <Icon size={24} className="mr-2" />
                {label}
              </Link>
            ))}
            <Popover>
              <PopoverTrigger className="flex items-center hover:text-primary cursor-pointer">
                <User size={30} className="mr-2 border p-1 rounded-full" />
                {user?.user_firstname}
              </PopoverTrigger>
              <PopoverContent className="bg-white border w-fit shadow-md rounded-md p-2">
                <Link
                  to="/account"
                  className={`px-4 py-2 flex items-center hover:bg-gray-100 ${
                    location.pathname === "/account"
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <User size={20} className="mr-2" />
                  <h1>Account</h1>
                </Link>
                <div
                  className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => logout(queryClient)}
                >
                  <LogOut size={20} className="mr-2" />
                  <span>Logout</span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>

      <main className="flex-grow pb-16 md:pb-0 md:px-20 px-5 md:py-5">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-primary/20 shadow-md md:hidden">
        <div className="flex justify-around py-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center hover:text-primary ${
                location.pathname === to ? "text-primary font-semibold" : ""
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
          <Link
            to="/account"
            className={`flex flex-col items-center hover:text-primary ${
              location.pathname === "/account"
                ? "text-primary font-extrabold"
                : ""
            }`}
          >
            <User size={24} />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
