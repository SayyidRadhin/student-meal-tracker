// AssignBook.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { db } from "@/lib/firebaseconfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Button } from "./ui/button";
import calculateMissedMeals from "@/lib/missedMeals";

type UserData = {
  id: string;
  email: string;
  password: string;
  timeStamp: Date;
  username: string;
};

type AssignBookProps = {
  student: string;
  studentId: string;
  isreturned: boolean;
};

function AssignBook({ student, studentId, isreturned }: AssignBookProps) {
  const [reason, setReason] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [isReturned, setIsReturned] = useState(false);
  const [disable, setDisable] = useState(true);
  const [initialArrivalTime, setInitialArrivalTime] = useState("");

  const formatDates = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset(); // Get the timezone offset in minutes
    const localDate = new Date(date.getTime() - offset * 60000); // Subtract the offset in milliseconds
    return localDate.toISOString().slice(0, 16); // Return the local date and time without seconds and timezone offset
  };

  const formatDate = (date: {
    getFullYear: () => any;
    getMonth: () => number;
    getDate: () => any;
    getHours: () => any;
    getMinutes: () => any;
  }) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  useEffect(() => {
    // Check if the student has returned when component mounts

    setIsReturned(isreturned); // Update return status

    // Update return status to true in Firestore
  }, []);

  const handleReturn = async () => {
    // Update return status to true in Firestore
    try {
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, { isreturn: true });
      setIsReturned(true);
      const leaveQuery = query(
        collection(db, "leaves"),
        where("studentId", "==", studentId),
        where("isreturn", "==", false)
      );
      const leaveSnapshot = await getDocs(leaveQuery);
      if (!leaveSnapshot.empty) {
        const leaveDoc = leaveSnapshot.docs[0]; // There should be only one document that matches this condition
        const leaveDocRef = doc(db, "leaves", leaveDoc.id);

        // Update the leave record's return status to true
        const currentTime = new Date();
        await updateDoc(leaveDocRef, {
          isreturn: true,
          arrivalTime: currentTime,
        });
     
      }else{
        console.log("no leaved student");
        
      }
      const missedQuery = query(
        collection(db, "missed"),
        where("studentId", "==", studentId),
        orderBy("serverTimestamp", "desc"), // Assuming serverTimestamp field exists
        limit(1)
      );

      const missedSnapshot = await getDocs(missedQuery);
      console.log(missedSnapshot);

      if (!missedSnapshot.empty) {
        const missedDoc = missedSnapshot.docs[0];
        console.log(missedDoc);

        await deleteDoc(doc(db, "missed", missedDoc.id));
      }
    } catch (error) {
      console.error("Error updating return status: ", error);
    }
  };

  useEffect(() => {
    // Set current date and time if not defined
    if (!departureTime) {
      const now = new Date();
      setDepartureTime(formatDate(now));
      setArrivalTime(formatDate(now));
      setInitialArrivalTime(formatDate(now)); // Set initial arrival time
    }
  }, [departureTime]);

  useEffect(() => {
    setDisable(
      !(
        reason.trim() !== "" &&
        arrivalTime !== "" &&
        arrivalTime !== initialArrivalTime
      )
    );
  }, [reason, arrivalTime, initialArrivalTime]);

  const addHolder = async (e: React.FormEvent) => {
    setDisable(true);
    const formatteddeparture = formatDates(departureTime);
    const formattedArrival = formatDates(arrivalTime);
    console.log(formattedArrival, formatteddeparture);
    e.preventDefault();
    try {
      const departure = new Date(departureTime);
      console.log(departure);

      const arrival = new Date(arrivalTime);

      console.log("Departure Date:", departure);
      console.log("Arrival Date:", arrival);

      const missedMeals = calculateMissedMeals(departure, arrival);
      console.log(missedMeals);

      await addDoc(collection(db, "leaves"), {
        studentId,
        studentname: student,
        reason,
        isreturn: false,
        departureTime: departure,
        arrivalTime: arrival,
      });
      const data = {
        studentId,
        missedMeals: missedMeals,
        serverTimestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "missed"), data);

      const docRef = doc(db, "students", studentId);
      console.log(docRef);

      await updateDoc(docRef, { isreturn: false });
      setIsReturned(true);

      // Reset form
      setReason("");
      setDepartureTime("");
      setArrivalTime("");
      setDisable(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      {isreturned ? (
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-slate-800 px-3 max-sm:text-sm transition-all duration-300 ease-in-out text-white  hover:bg-slate-700 hover:box-shadow-search hover:shadow-slate-600  rounded py-2 px-2 text-sm sm:text-base font-semibold">
              Leave
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[20em] p-8 ">
            <DialogHeader className="">
              <DialogTitle>When You Return ?</DialogTitle>
              <DialogDescription>
                Choose student arrival time.
              </DialogDescription>
              <div className="grid py-4 gap-2">
                <Input
                  type="text"
                  placeholder="Student Reason"
                  autoFocus
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
                <div>
                  <Input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogClose asChild>
                <Button
                  type="submit"
                  onClick={addHolder}
                  className={`mt-8 ${disable ? "bg-slate-400" : ""}`}
                  disabled={disable}
                >
                  Take
                </Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}

      {!isreturned ? (
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-slate-800 max-sm:text-sm px-3 transition-all duration-300 ease-in-out text-white  hover:bg-slate-700 hover:box-shadow-search hover:shadow-slate-600  rounded py-2 px-2 text-sm sm:text-base font-semibold">
              Return
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[20em] p-8 ">
            <DialogHeader className="">
              <DialogTitle>Did he Returned ?</DialogTitle>
              <DialogDescription>conform his return.</DialogDescription>

              <DialogClose asChild>
                <Button type="submit" onClick={handleReturn} className=" mt-8">
                  Conform Return
                </Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
    </div>
  );
}

export default AssignBook;
