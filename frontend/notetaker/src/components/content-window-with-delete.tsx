"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Trash2 } from "lucide-react"

export function ContentWindowWithDelete({ onClose, note }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[600px] h-[600px] bg-cover bg-center rounded-lg shadow-xl" style={{ backgroundImage: "url('/src/assets/notes.webp?height=400&width=600')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
        <div className="relative z-10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Enter title"
            value= {(note? note.title : '')}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/20 text-white placeholder-white/70 border-white/30"
          />
          <Textarea
            placeholder="Enter content"
            value={(note? note.content : '')}
            onChange={(e) => setContent(e.target.value)}
            className="bg-white/20 text-white placeholder-white/70 border-white/30 min-h-[390px]"
          />
          <Button className="w-full">Submit</Button>
        </div>
      </div>
    </div>
  )
}