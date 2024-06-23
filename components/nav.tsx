"use client";

import { useGlobalContext } from "@/app/contexts/globalContext";
import { isAdmin } from "@/lib/adminCheck";
import { auth } from "@/lib/firebaseconfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogIn, Menu, SquareTerminal, TrafficCone, TrainTrack, TramFrontIcon, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ModeToggler";


function Nav() {
  const { setShowModal, showModal } = useGlobalContext();

  
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const isAdminUser = isAdmin(currentUser?.uid);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Perform any additional cleanup or navigation if needed
    } catch (error) {
      console.error("Error during logout:");
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
     console.log(user.displayName);
     
    } else {
      // No user is signed in.
    }
  });


  const unsubscribe = auth.currentUser;
  console.log(showModal);
  console.log(unsubscribe);
  

  const router = useRouter();
  const onClick = () => {
    router.push("/login");
  }

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

      <div className="user  hidden  items-center gap-3 sm:flex">
          { isAdminUser && <Button variant="outline">Admnin Mode</Button>}
          <div>
          {
            currentUser ? (
              <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-10 h-10 ring-2 ring-slate-300 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                  <AvatarImage src={unsubscribe?.photoURL as string} />
                  <AvatarFallback className="bg-slate-300 text-white">
                    <User2 />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4">
                <div className="flex gap-2 items-center">
                  <figure className="user  px-4 flex gap-3 mt-auto py-4 items-center ">
                    <Avatar className="w-10 h-10 ring-4 ring-slate-200 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                      <AvatarImage src={unsubscribe?.photoURL as string} />
                      <AvatarFallback className="bg-slate-300 text-white">
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold  leading-3 items-end tracking-tighter capitalize dark:text-slate-200 text-slate-700 text-base opacity-80">
                        {currentUser?.displayName}
                      </p>
                      <span className="opacity-80 dark:text-slate-200 text-sm text-slate-600 ">
                        member
                      </span>
                    </div>
                  </figure>
                  <ModeToggle />
                </div>
                
                <div className="flex items-center justify-center">
                  <Button
                    className="mr-auto ml-auto h-0 py-4 mt-4"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            ) : (
              <Button
               variant="outline"
               onClick={onClick}
               > 
              <LogIn className="w-4"/> <span className="pl-3 font-medium">LogIn</span>
              </Button>
            )
          }
        
        </div>
        </div>
      <div onClick={() => setShowModal(true)} className="md:hidden">
        <Menu className="rounded-full opacity-80 dark:text-slate-200 cursor-pointer" />
      </div>
    </nav>
  );
}

export default Nav;
