import { Event, Registration, User } from '@/types';

const STORAGE_KEYS = {
  EVENTS: 'smart_events_events',
  REGISTRATIONS: 'smart_events_registrations',
  CURRENT_USER: 'smart_events_current_user',
};

// Events
export const getEvents = (): Event[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
};

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEvent = (eventId: string, updatedEvent: Partial<Event>): void => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === eventId);
  if (index !== -1) {
    events[index] = { ...events[index], ...updatedEvent };
    saveEvents(events);
  }
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents().filter(e => e.id !== eventId);
  saveEvents(events);
};

export const getEventById = (eventId: string): Event | undefined => {
  return getEvents().find(e => e.id === eventId);
};

// Registrations
export const getRegistrations = (): Registration[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  return data ? JSON.parse(data) : [];
};

export const saveRegistrations = (registrations: Registration[]): void => {
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
};

export const addRegistration = (registration: Registration): void => {
  const registrations = getRegistrations();
  registrations.push(registration);
  saveRegistrations(registrations);
  
  // Update event booked seats
  const event = getEventById(registration.eventId);
  if (event) {
    updateEvent(registration.eventId, {
      bookedSeats: event.bookedSeats + 1
    });
  }
};

export const getEventRegistrations = (eventId: string): Registration[] => {
  return getRegistrations().filter(r => r.eventId === eventId);
};

export const isUserRegistered = (eventId: string, userEmail: string): boolean => {
  return getRegistrations().some(r => r.eventId === eventId && r.userEmail === userEmail);
};

// Current User
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const logout = (): void => {
  setCurrentUser(null);
};
