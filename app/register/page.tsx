/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import "../../styles/signup.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { createUserWithEmailAndPassword, updateProfile,getAuth } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebaseconfig";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, User2 } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const [image, setimage] = useState<File | null>(null);

  const LoginValidator = z.object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters long",
      })
      .max(100, {
        message: "Username must be at most 20 characters long",
      }),
    password: z
      .string()
      .min(3, {
        message: "passwore must be at least 3 characters long",
      })
      .max(30, {
        message: "password must be at most 20 characters long",
      }),
    email: z
      .string()
      .min(1, { message: "email is required" })
      .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, {
        message: "Invalid email address",
      }),
  });

  type LoginCredentials = z.infer<typeof LoginValidator>;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginValidator),
  });

 

  const handleImageChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

     

      // Set the compressed image
      setimage(image);
      
    }
  };

  const createAccount = async (data: LoginCredentials) => {
    const storageRef = ref(storage, `profilePicture/${image?.name}`);
    await uploadBytes(storageRef, image!);
    const imageUrl = await getDownloadURL(storageRef);
    console.log(imageUrl);

    console.log(data);
    try {
      setLoading(true);

      const userref = collection(db,"users")

      // const q =query(userref,where("email","==" , data.email))
      
      // const existdata = await getDocs(q)
      // console.log(existdata.docs);
      // if(existdata){
      //   console.log("data not");
        
      // }
      
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      updateProfile(res.user, {
        displayName: data.username,
        photoURL: imageUrl,
      });
      console.log(res);

      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        userPhoto: imageUrl,
        timeStamp: serverTimestamp(),
      });
      setLoading(false);

      route.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div>
      <section className="sign-up-page">
        <div className="container">
          <div className="signup-form">
            {/* <div className="form-title">
              Try it free 7 days <span>then $20/mo. thereafter</span>
            </div> */}
            <Card>
            <form
              className="signup-form-form"
              onSubmit={handleSubmit(createAccount)}
            >
              <h1 className="text-xl mt-4 font-bold px-3">Create New <span className="text-slate-500">Account</span></h1>
                <p className='text-slate-500 text-xs mb-5 text-center'></p>

              <div className="form-group">
                <Input
                  required
                  type="text"
                  className="py-6"
                  placeholder="UserName "
                  {...register("username")}
                  autoFocus
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* <div className="form-group">
          <input required type="text" placeholder=" Last Name "/>
        </div> */}
              <div className="form-group">
                <Input
                  className='py-6'
                  required
                  type="email"
                  placeholder="Email Address "
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="form-group">
                <Input
                  required
                  className='py-6'
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button className={` w-full py-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} type="submit" disabled={loading}>Signup</Button>


              <p className="sign-up-terms text-sm">
                Already registered ? {" "}
                <Link href="/login"><span className="font-semibold">Login</span>{" "}</Link>
              </p>
            </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;