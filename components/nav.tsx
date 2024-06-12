"use client";

import { useGlobalContext } from "@/app/contexts/globalContext";
import { LogIn, Menu, SquareTerminal, TrafficCone, TrainTrack, TramFrontIcon, User2 } from "lucide-react";
import React, { useEffect, useState } from "react";


function Nav() {
  const { setShowModal, showModal } = useGlobalContext();

  return (
    <nav className="fixed  border-b t-0 right-0 left-0 py-6  bg-white dark:bg-slate-950 flex justify-between items-center  z-20 px-8">
      <div className=" h-8 items-center     dark:bg-slate-950 rounded flex gap-2">
        {" "}
        <SquareTerminal
          className="mx-auto h-full text-slate-600"
        />
        <h3 className="font-bold text-2xl md:text-base opacity-80  text-slate-600">
          Students Tracker
        </h3>
      </div>
      <div className="hidden sm:block"></div>

      <div onClick={() => setShowModal(true)} className="sm:hidden">
        <Menu className="rounded-full opacity-80 dark:text-slate-200 cursor-pointer" />
      </div>
    </nav>
  );
}

export default Nav;
