import { getSession } from "@/boot/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Home, Car, Calendar, User, Settings, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { logout } from "@/utils/logout";

export default function PageLayout({ children }: React.PropsWithChildren) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => getSession(),
  });

  const queryClient = useQueryClient();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar for larger screens */}
      <nav className="hidden md:flex bg-white border-b-2 border-primary/40 shadow-sm text-foreground py-4">
        <div className="px-20 flex justify-between w-full">
          <div className="flex w-full justify-between space-x-6 items-center">
            <Link to="/" className="flex items-center  hover:text-primary">
              <Home size={24} className="mr-2" />
              Home
            </Link>
            <Link to="/rides" className="flex items-center  hover:text-primary">
              <Car size={24} className="mr-2" />
              Rides
            </Link>
            <Link
              to="/activities"
              className="flex items-center  hover:text-primary"
            >
              <Calendar size={24} className="mr-2" />
              Activities
            </Link>
            <Popover>
              <PopoverTrigger className="flex items-center hover:text-primary cursor-pointer">
                <User size={24} className="mr-2" />
                {user.user_firstname}
              </PopoverTrigger>
              <PopoverContent className="bg-white border w-fit shadow-md rounded-md p-2">
                <Link
                  to="/settings"
                  className=" px-4 py-2 hover:bg-gray-100 w-full flex items-center"
                >
                  <Settings size={20} className="mr-2" />
                  <h1>Settings</h1>
                </Link>
                <div
                  className="flex items-center cursor-pointer  px-4 py-2  hover:bg-gray-100"
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

      <main className="flex-grow pb-16 md:pb-0 md:px-20 px-5 py-5">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-primary/40 shadow-md md:hidden">
        <div className="flex justify-around p-2">
          <Link
            to="/home"
            className="flex flex-col items-center  hover:text-primary"
          >
            <Home size={24} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/rides"
            className="flex flex-col items-center  hover:text-primary"
          >
            <Car size={24} />
            <span className="text-xs">Rides</span>
          </Link>
          <Link
            to="/activities"
            className="flex flex-col items-center  hover:text-primary"
          >
            <Calendar size={24} />
            <span className="text-xs">Activities</span>
          </Link>
          <Link
            to="/account"
            className="flex flex-col items-center  hover:text-primary"
          >
            <User size={24} />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
