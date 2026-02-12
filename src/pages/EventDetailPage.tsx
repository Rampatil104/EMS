import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, addRegistration, isUserRegistered } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/categories';
import RegistrationModal from '@/components/features/RegistrationModal';
import { toast } from 'sonner';
import { Registration } from '@/types';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  const event = id ? getEventById(id) : undefined;

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const availableSeats = event.totalSeats - event.bookedSeats;
  const isLowSeats = availableSeats <= 20 && availableSeats > 0;
  const isSoldOut = availableSeats === 0;
  const alreadyRegistered = registeredEmail ? isUserRegistered(event.id, registeredEmail) : false;

  const handleRegistration = (name: string, email: string) => {
    const registration: Registration = {
      id: `reg_${Date.now()}`,
      eventId: event.id,
      userName: name,
      userEmail: email,
      registeredAt: new Date().toISOString(),
    };

    addRegistration(registration);
    setRegisteredEmail(email);
    setIsModalOpen(false);
    
    toast.success('Registration successful!', {
      description: `You've been registered for ${event.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${CATEGORY_COLORS[event.category]}`}>
                {CATEGORY_LABELS[event.category]}
              </span>
            </div>
            {isLowSeats && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Only {availableSeats} seats left!
              </div>
            )}
            {isSoldOut && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Sold Out
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Date & Time</p>
                  <p className="text-base text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-base text-gray-900">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Venue</p>
                  <p className="text-base text-gray-900">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Available Seats</p>
                  <p className="text-base text-gray-900">
                    {availableSeats} of {event.totalSeats} seats
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {event.fullDescription}
              </p>
            </div>

            {/* Registration Button */}
            {alreadyRegistered ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 flex items-center gap-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">You're registered!</p>
                  <p className="text-sm text-green-700">
                    Confirmation has been sent to {registeredEmail}
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={isSoldOut}
                className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSoldOut ? 'Event Sold Out' : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <RegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegistration}
      />
    </div>
  );
}
