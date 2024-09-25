"use client";

import { Button } from "@/components/ui/button";

import { API_ENDPOINT } from "@/pages/home";
import axios from "axios";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import {
  formatDate,
  formatETA,
  formatToETA,
  isDateInFuture,
} from "@/utils/dateFunction";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

export function ScheduleNote({ onClose, getNotes, scheduleItem ,setScheduleItem}) {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const [editReminder, setEditReminder] = useState(false);

  useEffect(() => {
    if (scheduleItem.eta) {
      setValue("eta", formatDate(scheduleItem.eta));
      setValue("email", scheduleItem.email);

    }
    else{
      setValue("eta","");
      setValue("email","");
    }
  }, [scheduleItem]);

  const onSubmit = async (data) => {
    const formatDate = formatToETA(new Date(data.eta));
    const formatData = {
      ...data,
      eta:  formatDate,
      notes_id: scheduleItem.id,
    };
    let response;
    try {
      if (scheduleItem.eta) {
        response = await axios.post(
          `${API_ENDPOINT}/update_reminder`,
          formatData
        );
      } else {
        response = await axios.post(
          `${API_ENDPOINT}/create_reminder`,
          formatData
        );
      }
      toast.success(response.data.message);
      onClose();
      getNotes();
      setScheduleItem(null)
      setEditReminder(false)
    } catch (error) {
      console.error("Error occurred during submission:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  useEffect(() => {
    if (errors) {
    } else {
      alert("hey");
    }
  }, [errors]);

  const handleDeleteReminder = async () => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/delete_reminder`, {
        notes_id: scheduleItem.id,
      });
      toast.success(response.data.message);
      onClose();
      getNotes();
    } catch (error) {
      console.error("Error occurred during submission:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  console.log('hello',isDateInFuture(scheduleItem.eta) && !editReminder);
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-[600px] bg-cover bg-center rounded-lg shadow-xl  ${
          isDateInFuture(scheduleItem.eta) && !editReminder
            ? "h-[250px]"
            : "h-[400px]"
        }`}
        style={{
          backgroundImage: "url('/src/assets/notes.webp?height=400&width=600')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
        <div className="relative z-10 p-6 space-y-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className=" text-xl text-white font-bold">Schedule Note</h2>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {(isDateInFuture(scheduleItem.eta) && !editReminder) ? (
            <>
              <p className="text-white font-semibold">
                You already have a reminder scheduled for{" "}
                {formatETA(scheduleItem.eta)}. Would you like to delete or edit
                the scheduled note?
              </p>
              <div className="flex justify-end mt-8">
                <Button className="mr-2" onClick={handleDeleteReminder}>
                  Delete
                </Button>
                <Button onClick={() => setEditReminder(true)}>Edit</Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="eta" className="text-white">
                Set date and time for the reminder to be set
              </label>

              <div className="mt-5 mb-3">
                <label htmlFor="eta" className="text-white">
                  Date and time
                </label>
                <Controller
                  name="eta"
                  control={control}
                  rules={{
                    required: "Date and time is required",
                  }}
                  render={({ field }) => {
                    return (
                      <DatePicker
                        className="bg-white/20 text-white placeholder-white/70 border-white/30 w-100 mb-5 min-h-6"
                        selected={field.value || null}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        timeFormat="HH:mm"
                        minDate={new Date()}
                        
                      />
                    );
                  }}
                />
                {errors.eta && (
                  <p className="text-sm text-orange-500	 mt-2">
                    {errors?.eta?.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-white">
                  Email
                </label>

                <Input
                  type="text"
                  placeholder="Enter email"
                  className="bg-white/20 text-white placeholder-white/70 border-white/30"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />

                {errors.email && (
                  <p className="text-sm text-orange-500	 mt-2">
                    {errors?.email?.message}
                  </p>
                )}
              </div>

              <Button className="w-full mt-5">Schedule</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
