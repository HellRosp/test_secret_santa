import React from 'react';
import { SecretSantaEvent } from '../types';
import Card from './Card';
import Button from './Button';
import UsersIcon from './icons/UsersIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface EventListPageProps {
  events: SecretSantaEvent[];
  onJoinEvent: (id: string) => void;
  onViewAssignments: (id: string) => void;
  onEditEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onCreateNewEvent: () => void;
}

const EventListPage: React.FC<EventListPageProps> = ({ events, onJoinEvent, onViewAssignments, onEditEvent, onDeleteEvent, onCreateNewEvent }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(b.details.date).getTime() - new Date(a.details.date).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800">Your Events</h2>
        <p className="text-slate-500 mt-2">Manage your Secret Santa events or create a new one.</p>
        <div className="mt-6">
            <Button onClick={onCreateNewEvent} className="inline-block w-auto px-8">
                Create New Event
            </Button>
        </div>
      </div>

      {sortedEvents.length > 0 ? (
        <div className="space-y-6">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="transition-shadow hover:shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{event.details.name}</h3>
                  <div className="flex items-center space-x-4 text-slate-500 mt-2">
                    <span>Date: <span className="font-semibold text-red-500">{event.details.date}</span></span>
                    <span>Budget: <span className="font-semibold text-red-500">${event.details.budget}</span></span>
                    <span className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-1" /> 
                        {event.participants.length}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                  {event.status === 'setup' ? (
                    <>
                        <Button onClick={() => onJoinEvent(event.id)} variant="primary" className="text-sm px-4 py-2 w-auto">
                            Join / Manage
                        </Button>
                        <button onClick={() => onEditEvent(event.id)} className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors" title="Edit Event"><PencilIcon className="w-5 h-5"/></button>
                    </>
                  ) : (
                    <Button onClick={() => onViewAssignments(event.id)} variant="primary" className="text-sm px-4 py-2 w-auto">
                        View Assignments
                    </Button>
                  )}
                  <button onClick={() => onDeleteEvent(event.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors" title="Delete Event"><TrashIcon className="w-5 h-5"/></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold text-slate-700">No events yet!</h3>
          <p className="text-slate-500 mt-2">Ready to start the fun? Create your first Secret Santa event.</p>
        </Card>
      )}
    </div>
  );
};

export default EventListPage;
