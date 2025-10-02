export interface Participant {
  id: number;
  name: string;
  emoji: string;
  code: string;
  hasGift?: boolean;
}

export interface EventDetails {
  name: string;
  date: string;
  budget: number;
}

export interface SecretSantaEvent {
    id: string;
    details: EventDetails;
    participants: Participant[];
    assignments: Record<number, number>; // Maps Santa's ID to their assignee's ID
    messages: Record<number, string[]>; // Maps receiver's ID to a list of messages
    status: 'setup' | 'assignments_made';
}