"use client";

import React, { useCallback, useState } from "react";
import "../../../styles/signup.css";

import { auth, db, storage } from "@/lib/firebaseconfig";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { BookUp2Icon, ImageIcon, Upload, UploadCloud } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { log } from "console";

type Pdffile = {
  number:string,
  class:string,
  name:string,
  isreturn:boolean
}

// ... (your existing imports)

function Page() {
  const [loading, setLoading] = useState(false);

  const [image, setimage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdffile, setPdffile] = useState<Pdffile>({
    name: "",
    number:"",
    class: "",
    isreturn: true
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      setimage(image);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const pdf = e.target.files[0];
      setPdf(pdf);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPdffile((prevMagazine) => ({ ...prevMagazine, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Upload image to Firebase Storage
      const storageRefcover = ref(storage, `images/students/${pdffile?.name}`);
      await uploadBytes(storageRefcover, image!);
      const imageUrlstudents = await getDownloadURL(storageRefcover);

      

      // Add magazine data to Firestore
      const collectionRef = collection(db, "students");

      await addDoc(collectionRef, {
        name: pdffile.name,
        number:pdffile.number,
        class: pdffile.class,
        isreturn:pdffile.isreturn,
        coverImage: imageUrlstudents
      });

      setPdffile({
        name: "",
        number:"",
        class: "",
        isreturn:true
      });

      setPdf(null);
      setimage(null);

      setLoading(false); // Set loading to false after successful submission
    } catch (error) {
      console.error("Error uploading data:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  return (
    <div>
      <section className="sign-up-page">
        <div className="container">
          <div className="signup-form">
            <Card>
              <form className="signup-form-form py-2" onSubmit={handleSubmit}>
                <div className="form-title">
                  Add students <span></span>
                </div>

                <div className=" my-4">
                <label htmlFor="profile-picture" className="cursor-pointer">
                  {/* <User2 className="text-white absolute"/> */}
                  <Image
                     
                    src={image ? URL.createObjectURL(image) : "/download.png"}
                    alt=""
                    width={34}
                    height={34}
                    className="mx-auto rounded-full w-32 h-32 object-cover cursor-pointer bg-slate-700"
                  />
                </label>
                <h1 className="text-xl mt-4 font-bold px-3">Add New <span className="text-slate-500">Students</span></h1>
                <p className='text-slate-500 text-xs mb-5 text-center'>Enter details of students</p>

                <input
                 required
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
                <div className="form-group">
                  <Input
                    type="text"
                    name="name"
                    className="py-6"
                    placeholder="Name"
                    value={pdffile.name}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <Input
                    required
                    type="text"
                    name="number"
                    className="py-6"
                    placeholder="Student number"
                    value={pdffile.number}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <Input
                    type="text"
                    className="py-6"
                    placeholder="Class"
                    value={pdffile.class}
                    name="class"
                    onChange={handleChange}
                    autoFocus
                  />
                </div>

    
    
                <div className="form-group">

                  <button
                    className={`button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner-border spinner-border-sm text-light mr-2" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                        Loading...
                      </div>
                    ) : (
                      'Add Now..'
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
