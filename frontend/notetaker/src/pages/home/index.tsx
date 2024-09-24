import { CardWithPrimaryButtons } from '@/components/card-with-primary-buttons';
import { ContentWindowWithDelete } from '@/components/content-window-with-delete';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

function home() {

  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("") // State to store search input
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  // Function to filter notes based on the search term (searches in title and content)
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent('');
  };

  useEffect(() => {
    ;(async () => {
      try {
        setError(false)
        setLoading(true)
        const response = await axios.get('/api/notes')
        console.log(response.data)
        setNotes(response.data)
        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
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
          <Button onClick={() => handleCardClick(null)}>+ New Note</Button>
        </div>
        <div className="flex items-center">
        <p className="text-sm mr-2">
          Welcome, <span className="font-semibold">John Doe</span>
        </p>
      </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {
          error ? ( <p>Something went wrong! Couldn't fetch data from server!"</p>)
          
          :

          loading ? (<p>Loading...</p>)

          :

          filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <CardWithPrimaryButtons 
                key={index} 
                title={note.title} 
                content={note.content} 
                updatedDate={note.updated_at}
                onClick={() => handleCardClick(note)}/>
          ))
          ) 
          
          : 
          
          (
            <p>No results found for "{searchTerm}!"</p>
          )

        }
        
        {isPopupOpen && <ContentWindowWithDelete onClose={closePopup} note={popupContent} />}
      </div>
    </>
    
  )
}

export default home