import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { addEvent, getEventById, updateEvent } from '@/lib/storage';
import { Event, EventCategory } from '@/types';
import { toast } from 'sonner';
import { CATEGORY_LABELS } from '@/constants/categories';

export default function EventFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== 'new' && id !== undefined;

  const [formData, setFormData] = useState({
    title: '',
    category: 'conference' as EventCategory,
    date: '',
    time: '',
    location: '',
    venue: '',
    description: '',
    fullDescription: '',
    totalSeats: 100,
    image: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      const event = getEventById(id);
      if (event) {
        setFormData({
          title: event.title,
          category: event.category,
          date: event.date,
          time: event.time,
          location: event.location,
          venue: event.venue,
          description: event.description,
          fullDescription: event.fullDescription,
          totalSeats: event.totalSeats,
          image: event.image,
        });
      }
    }
  }, [id, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && id) {
      updateEvent(id, formData);
      toast.success('Event updated successfully');
    } else {
      const newEvent: Event = {
        id: `event_${Date.now()}`,
        ...formData,
        bookedSeats: 0,
        createdAt: new Date().toISOString(),
      };
      addEvent(newEvent);
      toast.success('Event created successfully');
    }

    navigate('/admin');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalSeats' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="AI & Machine Learning Summit 2026"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="San Francisco, CA"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Moscone Center, Hall A"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description for the event card"
                rows={2}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                placeholder="Detailed description for the event detail page"
                rows={5}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="totalSeats">Total Seats</Label>
              <Input
                id="totalSeats"
                name="totalSeats"
                type="number"
                value={formData.totalSeats}
                onChange={handleChange}
                min="1"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use Unsplash images: https://images.unsplash.com/photo-[id]?w=800&h=500&fit=crop
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
