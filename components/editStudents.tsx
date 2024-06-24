/* eslint-disable react/no-unescaped-entities */
// AssignBook.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebaseconfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { Button } from "./ui/button";
import Link from "next/link";

type AssignBookProps = {
  student: string;
  studentId: string;
  isreturned: boolean;
};

function EditStudent({ student, studentId, isreturned }: AssignBookProps) {
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const handleReturn = async () => {
    // Update return status to true in Firestore
    try {
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, { isreturn: true });
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
      } else {
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

  const handleDelete = async () => {
    if (deleteInput.toLowerCase() === "delete") {
      try {
        // Delete student document
        await deleteDoc(doc(db, "students", studentId));

        // Delete leave documents
        const leaveQuery = query(
          collection(db, "leaves"),
          where("studentId", "==", studentId)
        );
        const leaveSnapshot = await getDocs(leaveQuery);
        leaveSnapshot.forEach(async (leaveDoc) => {
          await deleteDoc(doc(db, "leaves", leaveDoc.id));
        });

        // Delete missed documents
        const missedQuery = query(
          collection(db, "missed"),
          where("studentId", "==", studentId)
        );
        const missedSnapshot = await getDocs(missedQuery);
        missedSnapshot.forEach(async (missedDoc) => {
          await deleteDoc(doc(db, "missed", missedDoc.id));
        });

        console.log("Student and related documents deleted successfully.");
        setShowDeleteForm(false);
      } catch (error) {
        console.error("Error deleting documents: ", error);
      }
    } else {
      console.error("Type 'delete' to confirm.");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-slate-800 px-3 max-sm:text-sm transition-all duration-300 ease-in-out text-white hover:bg-slate-700 hover:box-shadow-search hover:shadow-slate-600 rounded py-2 px-2 text-sm sm:text-base font-semibold">
            Edit
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-w-[20em] p-8">
          <DialogHeader>
            <DialogTitle>When You Return?</DialogTitle>
            <DialogDescription>Choose student arrival time.</DialogDescription>
            <div className="grid py-4 gap-2"></div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => setShowDeleteForm(!showDeleteForm)}>
                Delete
              </Button>
              <Link scroll={false} href={{ pathname: "/dashbord/editstudent", query: { id: studentId } }}>
              <Button type="button" >
                Edit
              </Button>
              </Link>
             
            </div>
            {showDeleteForm && (
              <div className="mt-4">
                <p>Type "delete" to confirm deletion:</p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="border p-2 mt-2"
                />
                <Button type="button" onClick={handleDelete} className="mt-2">
                  Confirm Delete
                </Button>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditStudent;
