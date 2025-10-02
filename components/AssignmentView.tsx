import React from 'react';
import { Participant, EventDetails } from '../types';
import Card from './Card';
import Button from './Button';
import GiftIcon from './icons/GiftIcon';

interface AssignmentViewProps {
  viewer: Participant;
  assignee: Participant;
  receivedMessages: string[];
  onSendMessage: (receiverId: number, message: string) => void;
  eventDetails: EventDetails;
  onGoBack: () => void;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({ viewer, assignee, receivedMessages, onSendMessage, eventDetails, onGoBack }) => {

  const handleSendMessage = () => {
    if (assignee) {
      onSendMessage(assignee.id, "Hey! Your Secret Santa has your gift and is ready when you are!");
      alert("Anonymous message sent!");
    }
  };

  if (!viewer || !assignee) {
    return <Card><p>Loading assignment...</p></Card>;
  }

  return (
    <div>
        <button onClick={onGoBack} className="text-slate-600 hover:text-red-500 transition-colors mb-4 inline-flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            View as someone else
        </button>

        <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-slate-800">Assignments are made!</h2>
            <p className="text-slate-600 mt-2 text-lg">Hello <span className="font-bold">{viewer.name}</span>! It's time to get gifting for the event on <span className="font-bold text-red-500">{eventDetails.date}</span>.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-red-500 to-red-600">
                <div className="flex flex-col items-center text-center text-white">
                    <GiftIcon className="h-16 w-16 mb-4 opacity-80" />
                    <h3 className="text-xl font-semibold opacity-90">You are the Secret Santa for...</h3>
                    <p className="text-5xl font-bold my-4 animate-pulse">{assignee.name}</p>
                    <p className="opacity-90 mb-6">Remember, the budget is ${eventDetails.budget}. Shhh, it's a secret!</p>
                    <Button 
                        variant="secondary"
                        onClick={handleSendMessage}
                    >
                        Notify them you have their gift!
                    </Button>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Anonymous Messages</h3>
                {receivedMessages.length > 0 ? (
                    <ul className="space-y-3">
                        {receivedMessages.map((msg, index) => (
                            <li key={index} className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                <p className="text-yellow-800">"{msg}"</p>
                                <p className="text-xs text-yellow-600 text-right mt-1">- Your Secret Santa</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-500">No messages yet. The suspense is real!</p>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
};

export default AssignmentView;