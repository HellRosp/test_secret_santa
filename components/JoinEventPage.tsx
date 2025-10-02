import React, { useState } from 'react';
import { SecretSantaEvent } from '../types';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import GiftIcon from './icons/GiftIcon';

interface JoinEventPageProps {
  event: SecretSantaEvent;
  onParticipantAdded: (name: string, emoji: string, code: string) => void;
  onStartAssignments: () => void;
  onGoHome: () => void;
}

const christmasEmojis = ['🎄', '🎅', '🎁', '🦌', '⛄', '🌟', '❄️', '🔔', '🕯️', '🍪', '🥛', '👼', '🤶', '🛷', '🎉'];

const getUniqueEmoji = (existingEmojis: string[]): string => {
    const availableEmojis = christmasEmojis.filter(e => !existingEmojis.includes(e));
    if (availableEmojis.length === 0) { // All emojis used, start repeating
        return christmasEmojis[Math.floor(Math.random() * christmasEmojis.length)];
    }
    return availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
};

const JoinEventPage: React.FC<JoinEventPageProps> = ({ event, onParticipantAdded, onStartAssignments, onGoHome }) => {
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newCode.trim().length === 4) {
      const existingEmojis = event.participants.map(p => p.emoji);
      const emoji = getUniqueEmoji(existingEmojis);
      onParticipantAdded(newName.trim(), emoji, newCode.trim());
      setNewName('');
      setNewCode('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="md:col-span-2 text-center">
            <h2 className="text-3xl font-bold text-slate-800">{event.details.name}</h2>
            <p className="text-slate-500 mt-2">
                Date: <span className="font-semibold text-red-500">{event.details.date}</span> | Budget: <span className="font-semibold text-red-500">${event.details.budget}</span>
            </p>
            <div className="mt-4">
                 <button onClick={onGoHome} className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                    Cancel & Go Back to Dashboard
                </button>
            </div>
        </Card>
        
        <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Add Participants</h3>
            <form onSubmit={handleAddParticipant} className="space-y-4">
                <Input
                    id="participant-name"
                    label="Participant's Name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter a name..."
                    required
                />
                <Input
                    id="participant-code"
                    label="Your Secret 4-Digit Code"
                    type="password"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g., 1234"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    title="Please enter exactly 4 digits."
                    required
                />
                <Button type="submit">Add Participant</Button>
            </form>
        </Card>

        <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Who's In? ({event.participants.length})</h3>
            {event.participants.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {event.participants.map((p) => (
                        <li key={p.id} className="bg-slate-100 p-3 rounded-lg text-slate-700 flex items-center">
                            <span className="text-xl mr-3">{p.emoji}</span>
                            <span>{p.name}</span>
                            {p.hasGift && <GiftIcon className="w-5 h-5 ml-auto text-green-500" title={`${p.name} has their gift!`} />}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500">No one has joined yet. Be the first!</p>
            )}
             <div className="mt-6">
                <Button 
                    onClick={onStartAssignments} 
                    disabled={event.participants.length < 2}
                    className="w-full"
                    variant="primary"
                >
                    Close Entries & Make Assignments
                </Button>
                {event.participants.length < 2 && <p className="text-xs text-slate-500 mt-2 text-center">You need at least 2 people to start.</p>}
            </div>
        </Card>
    </div>
  );
};

export default JoinEventPage;