"use client";

import {
  Compass,
  PlusSquareIcon,
  RouteOffIcon,
  LucideEarth,
  UserSquare2,
  UserCircleIcon,
  History,
  LucideBoxSelect,
  UserRoundPlus,
  UserRound,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useGlobalContext } from "@/app/contexts/globalContext";
import { auth } from "@/lib/firebaseconfig";
import { isAdmin } from "@/lib/adminCheck";

const teacherRoutes = [
  {
    icon: Compass,
    label: "Students",
    href: "/dashbord",
  },
  {
    icon: RouteOffIcon,
    label: "Missed Meals",
    href: "/dashbord/missedmeals",
  },
  {
    icon: UserCircleIcon,
    label: "Leaved",
    href: "/dashbord/currenthistory",
  },
  {
    icon: History,
    label: "History",
    href: "/dashbord/leavehistory",
  },
  {
    icon: UserRoundPlus,
    label: "Multiple Select",
    href: "/dashbord/multipleselect",
  },
  {
    icon: UserRound,
    label: "Edit students",
    href: "/dashbord/editstudents",
  },
];

const guestRoutes = [
  {
    icon: Compass,
    label: "Students",
    href: "/dashbord",
  },
  {
    icon: RouteOffIcon,
    label: "Missed Meals",
    href: "/dashbord/missedmeals",
  },
];



export const SidebarRoutes = () => {
  const { setShowModal } = useGlobalContext();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);


  const handleCloseSidebar = () => {
    setShowModal(false);
  };

  const baseRoutes = isAdmin(currentUser?.uid) ? teacherRoutes : guestRoutes;


  const routes = baseRoutes;

  return (
    <div className="flex flex-col w-full mt-3">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          onCloseSidebar={handleCloseSidebar}
        />
      ))}
    </div>
  );
};
