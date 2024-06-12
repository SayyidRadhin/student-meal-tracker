"use client";

import {
  Compass,
  PlusSquareIcon,
  RouteOffIcon,
  LucideEarth,
  UserSquare2,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useGlobalContext } from "@/app/contexts/globalContext";

const teacherRoutes = [
  {
    icon: Compass,
    label: "Home",
    href: "/dashbord",
  },

  {
    icon: UserSquare2,
    label: "Students",
    href: "/dashbord/students",
  },
  {
    icon: RouteOffIcon,
    label: "Missed Meals",
    href: "/dashbord/missedmeals",
  },
];

// const guestRoutes = [
//   {
//     icon: Compass,
//     label: "Browse",
//     href: "/dashbord",
//   },

//   {
//     icon: BookImage,
//     label: "Magazine",
//     href: "/dashbord/magazine",
//   },
//   {
//     icon: BookImage,
//     label: "E books",
//     href: "/dashbord/ebooks",
//   },
//   {
//     icon: Library,
//     label: "Holders",
//     href: "/dashbord/holder",
//   },

// ]

export const SidebarRoutes = () => {
  const { setShowModal } = useGlobalContext();


  const handleCloseSidebar = () => {
    setShowModal(false);
  };

  const routes = teacherRoutes;

  return (
    <div className="flex flex-col w-full">
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
