export type EventCategory = 'conference' | 'workshop' | 'webinar' | 'networking';

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  venue: string;
  description: string;
  fullDescription: string;
  totalSeats: number;
  bookedSeats: number;
  image: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}
