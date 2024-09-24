'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, Trash2 } from "lucide-react"

export function CardWithPrimaryButtons({title, content, updatedDate, onClick}) {

  const truncateText = (text:string, charLimit:number) => {
    return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
  };

  return (
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
              <Edit className="w-4 h-4" onClick={onClick}/>
            </Button>
            <Button variant="default" aria-label="Schedule">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="default" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <CardHeader>
            <h3 className="text-2xl font-bold leading-none">{truncateText(title, 13)}</h3>
            <p className="text-sm text-muted-foreground mt-2">{updatedDate}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {truncateText(content, 200)}
            </p>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}