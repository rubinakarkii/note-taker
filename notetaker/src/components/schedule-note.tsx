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
  formatETA,
  formatToISO8601,
  isDateInFuture,
} from "@/utils/dateFunction";
import { useEffect, useState } from "react";

export function ScheduleNote({ onClose, getNotes, scheduleItem }) {
  const { control, handleSubmit, setValue, getValues } = useFormContext();

  const [editReminder, setEditReminder] = useState(false);

  useEffect(() => {
    if (scheduleItem.eta) {
      setValue("eta", new Date(scheduleItem.eta));
    }
  }, [scheduleItem]);

  const onSubmit = async (data) => {
    const formatDate = formatToISO8601(new Date(data.eta));
    const formatData = {
      eta: formatDate,
      email: "rkdummy97@gmail.com",
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
    } catch (error) {
      console.error("Error occurred during submission:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative w-[600px] h-[300px] bg-cover bg-center rounded-lg shadow-xl"
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

          {isDateInFuture(scheduleItem.eta) && !editReminder ? (
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

              <div className="mt-5 mb-5">
                <Controller
                  name="eta"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      className="bg-white/20 text-white placeholder-white/70 border-white/30 w-100 mb-5 min-h-6"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      timeFormat="HH:mm"
                      minDate={new Date()}
                    />
                  )}
                />
              </div>

              <Button className="w-full">Schedule</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
