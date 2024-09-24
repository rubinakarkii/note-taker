"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Calendar, Trash2 } from "lucide-react";

import { ConfirmDeleteModal } from "./confirm-delete";
import { useState } from "react";
import { formatETA, isDateInFuture } from "@/utils/dateFunction";

export function CardWithPrimaryButtons({
  note,
  onClick,
  getNotes,
  setEditItem,
  handleSchedulePopup,
  setScheduleItem,
}) {
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteNote, setDeleteNote] = useState(null);

  const handleDeletePopup = () => setDeletePopup(!deletePopup);

  const truncateText = (text: string, charLimit: number) => {
    return text.length > charLimit ? text.slice(0, charLimit) + "..." : text;
  };

  const handleUpdate = (note) => {
    setEditItem(note);
    onClick();
  };

  return (
    <>
      <Card className="w-[400px] overflow-hidden">
        <div className="flex">
          <div className="w-[140px] h-[280px] relative">
            <img
              src="/src/assets/notes.webp?height=280&width=140"
              alt="Card image"
              className="object-cover h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
            <div className="absolute top-2 left-2 flex flex-col space-y-2">
              <Button variant="default" aria-label="Edit">
                <Edit className="w-4 h-4" onClick={() => handleUpdate(note)} />
              </Button>
              <Button
                variant="default"
                aria-label="Schedule"
                onClick={() => {
                  setScheduleItem(note);
                  handleSchedulePopup();
                }}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                aria-label="Delete"
                onClick={() => {
                  setDeleteNote(note.id);
                  handleDeletePopup();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <CardHeader>
              <h3 className="text-2xl font-bold leading-none">
                {truncateText(note.title, 13)}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {note.updatedDate}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{truncateText(note.content, 200)}</p>
            </CardContent>
            {isDateInFuture(note.eta) && (
              <CardContent className="bg-slate-100 p-4">
                <p className="font-bold text-sm">
                  Reminder set for {formatETA(note.eta)}
                </p>
              </CardContent>
            )}

            
          </div>
        </div>
      </Card>
      {deletePopup && (
        <ConfirmDeleteModal
          handleDeletePopup={handleDeletePopup}
          getNotes={getNotes}
          deleteNote={deleteNote}
        />
      )}
    </>
  );
}
