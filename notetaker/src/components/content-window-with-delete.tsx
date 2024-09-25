"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINT } from "@/pages/home";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

export function ContentWindowWithDelete({
  onClose,
  getNotes,
  editItem,
  setEditItem,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useFormContext();

  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);
  const initialSaveIdRef = useRef<string | null>(null);


  useEffect(() => {
    if (editItem) {
      setValue("title", editItem.title);
      setValue("content", editItem.content);
      initialSaveIdRef.current = editItem.id;
    } else {
      setValue("title", "");
      setValue("content", "");
      initialSaveIdRef.current = null;
    }
  }, [editItem, setValue]);

  const saveData = async (data: any) => {
    try {
      let response;
      if (editItem) {
        response = await axios.put(
          `${API_ENDPOINT}/notes/${editItem.id}`,
          data
        );
      } else {
        response = await axios.post(`${API_ENDPOINT}/notes`, data);
      }
      toast.success(response.data.message);
      getNotes();
      return response
    } catch (error: any) {
      console.error("Error occurred during submission:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save note. Please try again."
      );
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    await saveData(data);
    onClose();
    setIsSaving(false);
  };

  const autoSave = async () => {
  const formValues = watch();

    try {
      const response = await saveData(formValues);
      
      if (!editItem) {
        const responseData = response?.data?.[0]; 
        setEditItem(responseData); 
        toast.success("Note auto saved successfully!");
      } else {
        toast.success("Note auto updated successfully!"); 
      }
    } catch (error) {
      console.error("Error during auto-save:", error);
      toast.error("Auto-save failed. Please try again.");
    }
  };

  const handleChange = () => {
    clearTimeout(timeoutRef.current); // Clear the existing timeout
    timeoutRef.current = setTimeout(() => {
      autoSave(); // Set a new timeout for autosave
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative w-[600px] h-[450px] bg-cover bg-center rounded-lg shadow-xl"
        style={{
          backgroundImage: "url('/src/assets/notes.webp?height=400&width=600')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
        <div className="relative z-10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className=" text-xl text-white font-bold">
              {editItem ? "Edit" : "Create"} Note
            </h2>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title" className="text-white">
              Title
            </label>
            <Input
              type="text"
              placeholder="Enter title"
              className="bg-white/20 text-white placeholder-white/70 border-white/30 mt-2"
              {...register("title", {
                required: "Title is required",
                onChange: handleChange,
              })} // Attach handleChange
            />
            {errors.title && (
              <p className="text-sm text-orange-500 mt-2">
                {errors.title.message}
              </p>
            )}
            <div className="mt-5">
              <label htmlFor="content" className="text-white">
                Content
              </label>
              <Textarea
                placeholder="Enter content"
                className="bg-white/20 text-white placeholder-white/70 border-white/30 mt-2"
                {...register("content", {
                  onChange: handleChange,
                })} // Attach handleChange
              />
              {errors.content && (
                <p className="text-sm text-orange-500 mt-2">
                  {errors.content.message}
                </p>
              )}
            </div>
            <Button className="w-full mt-5" disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
