"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINT } from "@/pages/home";
import axios from "axios";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function ConfirmDeleteModal({
  handleDeletePopup,
  getNotes,
  deleteNote,
}) {
  const handleDelete = async () => {
    await axios
      .delete(API_ENDPOINT + "/notes/" + deleteNote)
      .then((response) => {
        toast.success(response.data.message);
        handleDeletePopup()
      })
      .catch((error) => {
        console.error(error);
      });
    getNotes();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative w-[600px] bg-cover bg-center rounded-lg shadow-xl"
        style={{
          backgroundImage: "url('/src/assets/notes.webp?height=400&width=600')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
        <div className="relative z-10 p-6 space-y-4">
          <h2 className="text-center">
            Are you sure you want to delete this note?
          </h2>
          <div className="flex justify-end items-center">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mr-3"
              aria-label="Close"
              onClick={handleDeletePopup}
            >Cancel</Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              aria-label="Close"
                onClick={handleDelete}
            >
              Yes, confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
