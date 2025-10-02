import React from 'react';
import Button from './Button';
import Card from './Card';
import { SecretSantaEvent } from '../types';
import UsersIcon from './icons/UsersIcon';

interface EventListPageProps {
  events: SecretSantaEvent[];
  onCreateEvent: () => void;
  onSelectEvent: (id: string) => void;
  onEditEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const EventListPage: React.FC<EventListPageProps> = ({ events, onCreateEvent, onSelectEvent, onEditEvent, onDeleteEvent }) => {
  return (
    <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-800">Your Secret Santa Events</h2>
            <p className="text-slate-500 mt-2">Manage your existing events or start a new one.</p>
            <div className="mt-8">
                <Button 
                    onClick={onCreateEvent} 
                    className="inline-block w-auto px-10 !py-3.5 text-base bg-red-600 hover:bg-red-700 focus:ring-red-400"
                >
                    Create a New Event
                </Button>
            </div>
        </div>

        {events.length > 0 ? (
            <div className="space-y-6">
                {events.map(event => (
                    <Card key={event.id} className="!p-0 flex flex-col sm:flex-row items-center justify-between">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-800">{event.details.name}</h3>
                            <div className="text-sm text-slate-500 mt-2 flex items-center gap-4">
                                <span>Date: {event.details.date}</span>
                                <span className="flex items-center">
                                    <UsersIcon className="w-4 h-4 mr-1"/> {event.participants.length} participants
                                </span>
                            </div>
                            <span className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${event.status === 'setup' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                {event.status === 'setup' ? 'Accepting Participants' : 'Assignments Made'}
                            </span>
                        </div>
                        <div className="p-6 w-full sm:w-auto flex flex-col sm:flex-row gap-2 border-t sm:border-t-0 sm:border-l border-slate-100">
                            <Button onClick={() => onSelectEvent(event.id)} variant="primary" className="!py-2">
                                {event.status === 'setup' ? 'View/Join' : 'View Assignments'}
                            </Button>
                            {event.status === 'setup' && (
                                <Button onClick={() => onEditEvent(event.id)} variant="secondary" className="!py-2">
                                    Edit
                                </Button>
                            )}
                            <Button onClick={(e) => {e.stopPropagation(); onDeleteEvent(event.id)}} variant="secondary" className="!py-2 !bg-red-100 !text-red-700 hover:!bg-red-200">
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <Card className="text-center py-16">
                <h3 className="text-2xl font-bold text-slate-700">No events yet!</h3>
                <p className="text-slate-500 mt-2">Click the button above to create your first Secret Santa event.</p>
            </Card>
        )}
    </div>
  );
};

export default EventListPage;