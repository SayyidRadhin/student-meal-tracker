"use client"
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseconfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Slidbar from '@/components/slidbar';
import Nav from '@/components/nav';
import Select, { ActionMeta, SingleValue } from "react-select";

import { Card } from '@/components/ui/card';
import { BeefIcon, HistoryIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

type UserData = {
  id: string;
  name: string;
  class?: string;
  number: string;
  coverImage: string;
  isreturned: boolean;
};

type LeaveData = {
  studentId: string;
  studentname: string;
  reason: string;
  departureTime: { toDate: () => Date };
  arrivalTime: { toDate: () => Date };
};

function Page() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [disable, setDisable] = useState(true);
  const [leaves, setLeaves] = useState<LeaveData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "students"));
        const usersData: string | any = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (
    newValue: SingleValue<{ value: string; label: string }>
  ) => {
    setDisable(false);
    const selectedOption = newValue;
    const user = users.find((user) => user.id === selectedOption?.value);
    setSelectedUser(user || null);
  };

  const findHistory = async () => {
    if (!selectedUser) return;

    try {
      const leavesQuery = query(
        collection(db, "leaves"),
        where("studentId", "==", selectedUser.id)
      );
      const leavesSnapshot = await getDocs(leavesQuery);
      const leavesData = leavesSnapshot.docs.map((doc) => doc.data() as LeaveData);
      setLeaves(leavesData);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  return (
    <section className='dashboard w-full max-h-screen min-h-screen flex'>
      <Nav />

      <div className="flex-[6] flex pt-[5.2em] max-w-[100vw] sm:mt-0 dark:bg-[#0B1120]">
        <Slidbar />
        <div className="hero w-full py-3 px-4 sm:px-8 pt-[5em]  overflow-auto scrollbar-hide no-scrollbar">
          <div className="header rounded-md flex p-4 bg-blue-950 w-full mb-2 gap-2 text-white select-none">
            <HistoryIcon className='text-xl' />
            <h3 className='text-xl'>Leave History</h3>
          </div>
          <div className='flex gap-2 w-full'>
            <Select
             className='w-full'
              options={users.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              onChange={handleUserChange}
            />
            <Button type="submit" onClick={findHistory} className="" disabled={disable}>Find</Button>
          </div>
          <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 gap-2 mt-3'>
            {leaves.map((leave) => (
              <Card key={leave.studentId} className="p-6">
                <div className='text-slate-700 max-md:text-sm'>
                  <h1 className='text-lg mb-3 font-semibold text-slate-600'>{leave.reason}</h1>
                  <p>Departured: {leave.departureTime.toDate().toLocaleString()}</p>
                  <p className='mb-2'>Arrived: {leave.arrivalTime.toDate().toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
