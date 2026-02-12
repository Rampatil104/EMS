import { EventCategory } from '@/types';

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  conference: 'bg-blue-100 text-blue-700 border-blue-200',
  workshop: 'bg-purple-100 text-purple-700 border-purple-200',
  webinar: 'bg-green-100 text-green-700 border-green-200',
  networking: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  conference: 'Conference',
  workshop: 'Workshop',
  webinar: 'Webinar',
  networking: 'Networking',
};
