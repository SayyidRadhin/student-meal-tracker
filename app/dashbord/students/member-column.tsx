"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { add,format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import Link from "next/link";
import { UserData } from "./page";
import AssignBook from "@/components/AssignBook";
// This type is used to define the shape of our data.




export const memberColumn: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Book",
    cell: ({ row}) => {
      
      return (
      <div className=" font-medium flex gap-5 items-center">
         <div className="user flex  px-8  gap-2 mt-auto py-4 items-center ">
          <Avatar className="w-12 h-12 ring-4 ring-slate-200 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
            <AvatarImage src={row.original.coverImage} />
            <AvatarFallback className="bg-slate-300 text-white">
              <User2 />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold  leading-3 items-end tracking-tighter capitalize dark:text-slate-200 text-slate-700 text-base opacity-80">
                {row.original.name}
            </p>
            
          </div>
        </div>
        </div>
      );
    },
  },
 
  {
    accessorKey: "return",
    header: "",
    cell: ({ row}) => {

      return (
      <div className="flex justify-end gap-3 pr-4">
          
                  <AssignBook student={row.original.name} studentId={row.original.id} isreturned={row.original.isreturned}/>
          
        
        
      </div>
      );
    },
  },
];
