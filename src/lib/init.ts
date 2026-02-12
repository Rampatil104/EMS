import { getEvents, saveEvents } from './storage';
import { seedEvents } from './seed-data';

export const initializeApp = () => {
  // Seed events if none exist
  const existingEvents = getEvents();
  if (existingEvents.length === 0) {
    saveEvents(seedEvents);
  }
};
