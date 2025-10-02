import React, { useState } from 'react';
import { Participant } from '../types';
import Card from './Card';
import Button from './Button';
import Input from './Input';

interface AssignmentsSentPageProps {
  participants: Participant[];
  onSelectParticipant: (id: number) => void;
}

const AssignmentsSentPage: React.FC<AssignmentsSentPageProps> = ({ participants, onSelectParticipant }) => {
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(Number(e.target.value));
    setEnteredCode(''); // Reset code on name change
    setError(''); // Reset error on name change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    
    const participant = participants.find(p => p.id === selectedId);

    if (participant && participant.code === enteredCode) {
      setError('');
      onSelectParticipant(selectedId);
    } else {
      setError('Incorrect code. Please try again.');
      setEnteredCode('');
    }
  };

  return (
    <Card>
        <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">All Set! Assignments are Ready!</h2>
            <p className="text-slate-500 mb-8">The magic has happened! Please select your name and enter your code to secretly reveal who you'll be gifting.</p>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <div>
          <label htmlFor="participant-select" className="block text-sm font-medium text-slate-700 mb-1">
            Who are you?
          </label>
          <select
            id="participant-select"
            value={selectedId}
            onChange={handleSelectChange}
            className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            aria-label="Select your name to view your assignment"
            required
          >
            <option value="" disabled>Select your name...</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {selectedId && (
            <Input
                id="code-input"
                label="Enter your 4-digit code"
                type="password"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                maxLength={4}
                placeholder="****"
                autoFocus
                required
            />
        )}

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="pt-2">
            <Button type="submit" disabled={!selectedId || enteredCode.length !== 4}>
                Reveal My Secret Santa!
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default AssignmentsSentPage;