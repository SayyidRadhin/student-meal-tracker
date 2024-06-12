"use client"
import React, { useEffect, useState } from 'react'
import Slidbar from "@/components/slidbar";
import Nav from "@/components/nav";
import {useCollection} from "react-firebase-hooks/firestore"
import { collection, orderBy, query } from 'firebase/firestore';
import { memberColumn } from './member-column';
import { TableMembers } from '@/components/table-members';
import { LucideUserCog2, UserCog, UserRoundCogIcon, UserX } from 'lucide-react';
import { db } from '@/lib/firebaseconfig';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export type UserData = {
  id:string;
  name: string;
  class?: string;
  number:string;
  coverImage:string 
  isreturned:boolean
};

function Page() {

  const [users, setUsers] = useState<UserData[]>([])
 const [docs,loading,error] = useCollection(
  query(
    collection(db,"students")
  )
 )
 console.log(docs?.docs);
 const router = useRouter();

 useEffect(() => {
   if(!docs) return;
    console.log(docs.docs);
    
   const userData:UserData[] = docs.docs.filter((doc) => !doc.data().return).map((doc)=>({
    id:doc.id,
    name: doc.data().name,
    number: doc.data().number,
    class:doc.data().class,
    coverImage:doc.data().coverImage,
    isreturned:doc.data().isreturn,
   }))
   setUsers(userData)
console.log(users);
   
 
 }, [docs])


 const onClick = () => {
  router.push("/dashbord/addstudents");
}
 
 
  return (
    <>
   <Nav/>
    <div className="w-full max-h-screen min-h-screen flex pt-[5.1em]  dark:bg-[#0B1120]">
      <Slidbar/>
      <div className="hero w-full  py-3 px-4 sm:px-8 mt-[5em] md:mt-4 overflow-auto  scrollbar-hide no-scrollbar">
         <div className="header rounded-md flex py-2  px-4 items-center justify-between bg-blue-950 w-full mb-2 gap-2 text-white select-none">
          <div className='flex gap-2'><UserRoundCogIcon className='text-xl'/>
           <h3 className='text-xl'>Members</h3></div>
           <Button variant={'default'} className='bg-' onClick={onClick}>Add Students</Button>
         </div>
             <TableMembers columns={memberColumn} data={users} />
      </div>
     
    </div>
    </>
  )
}

export default Page
