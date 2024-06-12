"use client";
import React, { useState } from "react";
import {

  XIcon,

  User2,
} from "lucide-react";
import { useGlobalContext } from "@/app/contexts/globalContext";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/lib/firebaseconfig";
import { SidebarRoutes } from "./Sidebar-routes";

function Slidbar() {
  const { setShowModal, showModal } = useGlobalContext();
  const [activeLink, setActiveLink] = useState("");
  const unsubscribe = auth.currentUser;
  const handleClickOutside = (e: any): void => {
    if (e.target.id === "modal") {
      setShowModal(!showModal);
    }
  };

  const handleLinkClick = (href: string): void => {
    setActiveLink(href);
  };

  return (
    <>
      <div
        className={twMerge(
          "max-md:fixed z-50 max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-0 max-md:z-20  max-sm:bg-[rgba(0,0,0,0.6)]  md:hidden",
          showModal ? "max-sm:block" : "hidden"
        )}
        id="modal"
        onClick={handleClickOutside}
      ></div>
      {/* bg-[#f6f6f6] */}
      <aside
        className={twMerge(
          "sidebar  dark:bg-[#0f172a] bg-white shadow-sm border-r sm:min-w-[23vw] md:min-w-[200px] max-[500px]:max-w-[70%] max-sm:w-full sm-[500px]:max-w-[80vw]  flex flex-col max-sm:z-50 fixed max-sm:bottom-0 max-md:top-0   md:relative max-md:z-20 ease-in-out duration-300",
          showModal ? " max-md:translate-x-0" : "max-md:translate-x-[-100%]"
        )}
      >
        {showModal ? (
          <button
            className=" flex max-[500px]:hidden text-4xl  md:hidden rounded-lg items-center cursor-pointer fixed right-3   top-3 z-50"
            onClick={() => setShowModal(!showModal)}
          >
            <XIcon className="opacity-80  cursor-pointer text-sm dark:text-slate-200" />
          </button>
        ) : (
          ""
        )}

       
        <nav className="flex transition-all  pt-5 duration-200 ease-in- text-base  flex-col gap-2 sm:text-sm font-medium text-opacity-80 mb-0 max-sm:[& > text-2xl]">
          <div className=" flex flex-col gap-3 h-full  transition-all duration-200 ease-in-out">
            
            <SidebarRoutes/>
          </div>
          <div />
        </nav>
        <div className="user flex  px-8 sm:hidden gap-2 mt-auto py-4 items-center ">
          <Avatar className="w-10 h-10 ring-4 ring-slate-200 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
            <AvatarImage src={unsubscribe?.photoURL as string} />
            <AvatarFallback className="bg-slate-300 text-white">
              <User2 />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold  leading-3 items-end tracking-tighter capitalize dark:text-slate-200 text-slate-700 text-base opacity-80">
              {unsubscribe?.displayName}
            </p>
            <span className="opacity-80 dark:text-slate-200 text-sm text-slate-600 ">
              member
            </span>
          </div>

          {/* </div>
        <div className="sm:flex mt-auto hidden  justify-center items-center gap-2 opacity-70 py-4 ">
          <Link href="www.insagram.com">
            <Instagram />
          </Link>
          <Link href="www.facebook.com">
            {' '}
            <Facebook />
          </Link>
          <Link href="www.x.com">
            <XIcon />
          </Link> */}
        </div>
      </aside>
    </>
  );
}

export default Slidbar;
