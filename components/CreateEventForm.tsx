import React, { useState, useEffect } from 'react';
import { EventDetails } from '../types';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import CalendarIcon from './icons/CalendarIcon';
import DollarIcon from './icons/DollarIcon';
import UsersIcon from './icons/UsersIcon';

interface CreateEventFormProps {
  onSave: (details: EventDetails) => void;
  onCancel: () => void;
  initialData?: EventDetails;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSave, onCancel, initialData }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [budget, setBudget] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
        setEventName(initialData.name);
        setEventDate(initialData.date);
        setBudget(initialData.budget.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName && eventDate && budget) {
      onSave({
        name: eventName,
        date: eventDate,
        budget: Number(budget),
      });
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{isEditing ? 'Edit Your Event' : 'Create Your Secret Santa Event'}</h2>
            <p className="text-slate-500">{isEditing ? 'Update the details for your event below.' : "Let's get the festive fun started! Fill in the details below."}</p>
        </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
            id="event-name"
            label="Event Name"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Office Holiday Party"
            leftIcon={<UsersIcon className="h-5 w-5 text-slate-400" />}
            required
        />
        <Input 
            id="event-date"
            label="Event Date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            rightIcon={<CalendarIcon className="h-5 w-5 text-slate-400" />}
            required
        />
        <Input 
            id="budget"
            label="Gift Budget ($)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 25"
            min="1"
            leftIcon={<DollarIcon className="h-5 w-5 text-slate-400" />}
            required
        />
        <div className="pt-2 space-y-3">
            <Button type="submit" disabled={!eventName || !eventDate || !budget}>
                {isEditing ? 'Save Changes' : 'Create Event & Add Participants'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateEventForm;
