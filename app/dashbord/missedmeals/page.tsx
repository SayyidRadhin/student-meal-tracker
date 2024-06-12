"use client"
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import Slidbar from '@/components/slidbar';
import Nav from '@/components/nav';
import { Card } from '@/components/ui/card';
import { BeefIcon, Milestone, UserRoundCogIcon } from 'lucide-react';
import { CalendarIcon } from "@radix-ui/react-icons"
import { HobbyKnifeIcon } from "@radix-ui/react-icons"

import { format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MealData {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

function Page() {
  const [missedMeals, setMissedMeals] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchMissedMeals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'missed'));
        let breakfastCount = 0;
        let lunchCount = 0;
        let dinnerCount = 0;

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const mealsArray: MealData[] = data.missedMeals;

          mealsArray.forEach((meal: MealData) => {
            if (meal.date === selectedDate.toDateString()) {
              breakfastCount += meal.breakfast;
              lunchCount += meal.lunch;
              dinnerCount += meal.dinner;
            }
          });
        });

        setMissedMeals({ breakfast: breakfastCount, lunch: lunchCount, dinner: dinnerCount });

      } catch (error) {
        console.error('Error fetching missed meals:', error);
      }
    };

    fetchMissedMeals();
  }, [selectedDate]);

  return (
    <section className='dashboard w-full max-h-screen min-h-screen flex'>
      <Nav />

      <div className="flex-[6] flex pt-[5.2em] max-w-[100vw] sm:mt-0 dark:bg-[#0B1120]">
        <Slidbar />
        <div className="hero w-full py-3 px-4 sm:px-8 mt-[5em] md:mt-4 overflow-auto scrollbar-hide no-scrollbar">
          <div className="header rounded-md flex p-4 bg-blue-950 w-full mb-2 gap-2 text-white select-none">
            <BeefIcon className='text-xl' />
            <h3 className='text-xl'>MissedMeals</h3>
          </div>
          <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal w-full mt-5 mb-3",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
        className='w-full'
          mode="single"
          selected={selectedDate}
          onSelect={(day: Date | undefined) => day && setSelectedDate(day)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
          <div className='flex-col w-full gap-3 md:flex md:flex-row flex'>
            
            <Card className='p-4 flex flex-col items-center justify-center bg-slate-100 w-full'>
              <h1 className='font-semibold text-slate-700 text-2xl'>Breakfast</h1>
              <h1 className='font-semibold text-slate-500 text-2xl'>{missedMeals.breakfast}</h1>
            </Card>
            <Card className='p-4 flex flex-col items-center justify-center bg-slate-100 w-full'>
              <h1 className='font-semibold text-slate-700 text-2xl'>Lunch</h1>
              <h1 className='font-semibold text-slate-500 text-2xl'>{missedMeals.lunch}</h1>
            </Card>
            <Card className='p-4 flex flex-col items-center justify-center bg-slate-100 w-full'>
              <h1 className='font-semibold text-slate-700 text-2xl'>Dinner</h1>
              <h1 className='font-semibold text-slate-500 text-2xl'>{missedMeals.dinner}</h1>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
