import { CardWithPrimaryButtons } from "@/components/card-with-primary-buttons";
import { ContentWindowWithDelete } from "@/components/content-window-with-delete";
import { ScheduleNote } from "@/components/schedule-note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export const API_ENDPOINT = "http://127.0.0.1:5000";

function home() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scheduleNotePopup, setScheduleNotePopup] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [scheduleItem, setScheduleItem] = useState(null);
  const [editScheduleItem, setEditScheduleItem] = useState(null)

  const methods = useForm();

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleSchedulePopup = ()=> setScheduleNotePopup(!scheduleNotePopup)

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const getNotes = async () => {
    try {
      const response = await axios.get(API_ENDPOINT + `/notes`);
      setNotes(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching notes");
    }
  };

  
  useEffect(() => {
    (async () => {
      try {
        setError(false);
        setLoading(true);
        await getNotes();
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <FormProvider {...methods}>
      <div className="w-[1280px] flex flex-col sm:flex-row justify-between items-center p-4 bg-background shadow-sm">
        <div className="relative flex w-[500px] mb-4 sm:mb-0 space-x-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-12" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update the search term as user types
          />
          <Button
            onClick={() => {
              setEditItem(null);
              handleCardClick();
            }}
          >
            + New Note
          </Button>
        </div>
        <div className="flex items-center">
          <p className="text-sm mr-2">
            Welcome, <span className="font-semibold">John Doe</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {error ? (
          <p>Something went wrong! Couldn't fetch data from server!"</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <CardWithPrimaryButtons
              key={index}
              note={note}
              onClick={() => handleCardClick()}
              handleSchedulePopup={handleSchedulePopup}
              getNotes={getNotes}
              setEditItem={setEditItem}
              setScheduleItem={setScheduleItem}
            />
          ))
        ) : (
          <p>No results found for "{searchTerm}!"</p>
        )}

        {isPopupOpen && (
          <ContentWindowWithDelete
            onClose={closePopup}
            getNotes={getNotes}
            editItem={editItem}
            setEditItem={setEditItem}

          />
        )}

        {scheduleNotePopup && (
          <ScheduleNote
            onClose={handleSchedulePopup}
            getNotes={getNotes}
            scheduleItem={scheduleItem}
          />
        )}
      </div>
    </FormProvider>
  );
}

export default home;
