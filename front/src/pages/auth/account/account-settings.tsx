import { Link } from "react-router-dom";
import {
  Lock,
  Car,
  MapPin,
  CreditCard,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserSession } from "@/hooks/session";
import { logout } from "@/utils/logout";
import { useQueryClient } from "@tanstack/react-query";

export default function NavigationMenu() {
  const { user } = useUserSession();
  const queryClient = useQueryClient();
  const handleLogout = () => {
    console.log("Logging out...");
    logout(queryClient);
    // Add logout functionality here
  };

  const menuItems = [
    {
      name: "Security",
      description: "Manage your security settings",
      icon: <Lock />,
      path: "security",
    },
    ...(user?.role === "DRIVER"
      ? [
          {
            name: "Vehicles",
            description: "View and manage your vehicles",
            icon: <Car />,
            path: "vehicles",
          },
        ]
      : []),
    {
      name: "Address",
      description: "Update your address information",
      icon: <MapPin />,
      path: "address",
    },
    {
      name: "Payments",
      description: "Manage your payment methods",
      icon: <CreditCard />,
      path: "payments",
    },
    {
      name: "Documents",
      description: "Access your important documents",
      icon: <FileText />,
      path: "documents",
    },
  ];

  return (
    <div className="flex flex-col gap-4 bg-[#f1f5f9]">
      <div className="flex items-center space-x-2 sticky top-0 bg-[#f1f5f9] z-10 py-5">
        <Avatar>
          <AvatarImage
            src="https://www.gravatar.com/avatar/?d=mp"
            alt="avatar"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-extrabold">
          {user?.user_firstname} {user?.user_lastname}
        </h1>
      </div>

      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <div>
              <span className="text-lg font-medium">{item.name}</span>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="flex items-center justify-between p-4 bg-red-100 border rounded-xl hover:bg-red-200 transition"
      >
        <div className="flex items-center gap-3">
          <LogOut />
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium text-start">Logout</span>
            <p className="text-sm text-gray-500">Sign out of your account</p>
          </div>
        </div>
        <ChevronRight className="text-gray-400" />
      </button>
    </div>
  );
}
