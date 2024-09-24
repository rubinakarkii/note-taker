"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINT } from "@/pages/home";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

export function ContentWindowWithDelete({
  onClose,
  getNotes,
  editItem,
  
}) {
  const { register, handleSubmit ,setValue} = useFormContext();


  useEffect(()=>{
    if(editItem){
      setValue('title', editItem.title)
      setValue('content', editItem.content)

    }
    else{
      setValue('title','')
      setValue('content','')

    }
  },[setValue])

  const onSubmit = async (data) => {
    try {
      let response;
      if (editItem) {
        response = await axios.put(`${API_ENDPOINT}/notes/${editItem.id}`, data);
      } else {
        response = await axios.post(`${API_ENDPOINT}/notes`, data);
      }
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
        className="relative w-[600px] h-[600px] bg-cover bg-center rounded-lg shadow-xl"
        style={{
          backgroundImage: "url('/src/assets/notes.webp?height=400&width=600')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
        <div className="relative z-10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className=" text-xl text-white font-bold">{editItem? 'Edit':'Create'} Note</h2>
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
              {" "}
              Title
            </label>

            <Input
              type="text"
              placeholder="Enter title"
              className="bg-white/20 text-white placeholder-white/70 border-white/30 mb-5"
              {...register("title")}
            />
            <label htmlFor="content" className="text-white">
              Content
            </label>

            <Textarea
              placeholder="Enter content"
              className="bg-white/20 text-white placeholder-white/70 border-white/30  mb-5"
              {...register("content")}
            />
            <Button className="w-full">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
