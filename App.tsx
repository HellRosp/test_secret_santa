import React, { useState, useEffect } from 'react';
import { EventDetails, Participant, SecretSantaEvent } from './types';
import Header from './components/Header';
import CreateEventForm from './components/CreateEventForm';
import JoinEventPage from './components/JoinEventPage';
import AssignmentsSentPage from './components/AssignmentsSentPage';
import AssignmentView from './components/AssignmentView';
import EventListPage from './components/EventListPage';

type AppState = 'dashboard' | 'creating' | 'editing' | 'joining' | 'viewing_assignments_list' | 'viewing_single_assignment';

// A simple shuffle function for assignments
const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const App: React.FC = () => {
  const [events, setEvents] = useState<SecretSantaEvent[]>(() => {
    try {
        const savedEvents = localStorage.getItem('secretSantaEvents');
        return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (error) {
        console.error("Failed to parse events from localStorage", error);
        return [];
    }
  });

  const [appState, setAppState] = useState<AppState>('dashboard');
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [viewingAs, setViewingAs] = useState<Participant | null>(null);

  useEffect(() => {
    localStorage.setItem('secretSantaEvents', JSON.stringify(events));
  }, [events]);

  const currentEvent = events.find(e => e.id === currentEventId);

  const goHome = () => {
    setAppState('dashboard');
    setCurrentEventId(null);
    setViewingAs(null);
  };
  
  const handleSaveEvent = (details: EventDetails) => {
    if (appState === 'editing' && currentEventId) {
        // Update existing event
        setEvents(prev => prev.map(e => e.id === currentEventId ? { ...e, details } : e));
    } else {
        // Create new event
        const newEvent: SecretSantaEvent = {
            id: crypto.randomUUID(),
            details,
            participants: [],
            assignments: {},
            messages: {},
            status: 'setup'
        };
        setEvents(prev => [...prev, newEvent]);
    }
    goHome();
  };

  const handleSelectEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    setCurrentEventId(id);
    if (event.status === 'setup') {
        setAppState('joining');
    } else {
        setAppState('viewing_assignments_list');
    }
  };

  const handleEditEvent = (id: string) => {
    setCurrentEventId(id);
    setAppState('editing');
  };

  // This function correctly filters the events array, removing the event with the matching id.
  // When state is updated, React re-renders the component, and the deleted event disappears.
  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    }
  };
  
  const handleParticipantAdded = (name: string, emoji: string, code: string) => {
    if (!currentEvent) return;
    const newParticipant: Participant = { id: (currentEvent.participants.length || 0) + 1, name, emoji, code };
    setEvents(prev => prev.map(e => e.id === currentEventId ? { ...e, participants: [...e.participants, newParticipant]} : e));
  };
  
  const handleAssignments = () => {
    if (!currentEvent || currentEvent.participants.length < 2) {
      alert("You need at least 2 participants to make assignments.");
      return;
    }
    const participantIds = currentEvent.participants.map(p => p.id);
    const shuffledIds = shuffle([...participantIds]);
    
    const newAssignments: Record<number, number> = {};
    for (let i = 0; i < shuffledIds.length; i++) {
        newAssignments[shuffledIds[i]] = shuffledIds[(i + 1) % shuffledIds.length];
    }
    setEvents(prev => prev.map(e => e.id === currentEventId ? { ...e, assignments: newAssignments, status: 'assignments_made' } : e));
    setAppState('viewing_assignments_list');
  };

  const handleSelectParticipant = (id: number) => {
    const participant = currentEvent?.participants.find(p => p.id === id);
    if (participant) {
      setViewingAs(participant);
      setAppState('viewing_single_assignment');
    }
  };
  
  const handleSendMessage = (receiverId: number, message: string) => {
    if (!currentEventId) return;
    setEvents(prev => prev.map(e => {
        if (e.id === currentEventId) {
            const newMessages = { ...e.messages };
            const currentMessages = newMessages[receiverId] || [];
            newMessages[receiverId] = [...currentMessages, message];
            return { ...e, messages: newMessages };
        }
        return e;
    }));
  };

  const handleGoBackToAssignmentsList = () => {
      setViewingAs(null);
      setAppState('viewing_assignments_list');
  };

  const renderContent = () => {
    switch(appState) {
      case 'dashboard':
        return <EventListPage 
            events={events} 
            onCreateEvent={() => setAppState('creating')} 
            onSelectEvent={handleSelectEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            />;
      case 'creating':
        return <CreateEventForm onSave={handleSaveEvent} onCancel={goHome} />;
      case 'editing':
        if (!currentEvent) return null;
        return <CreateEventForm onSave={handleSaveEvent} onCancel={goHome} initialData={currentEvent.details} />;
      case 'joining':
        if (!currentEvent) return null;
        return <JoinEventPage 
            event={currentEvent}
            onParticipantAdded={handleParticipantAdded}
            onStartAssignments={handleAssignments}
            onGoHome={goHome}
            />;
      case 'viewing_assignments_list':
          if (!currentEvent) return null;
          return <AssignmentsSentPage 
            participants={currentEvent.participants} 
            onSelectParticipant={handleSelectParticipant} />;
      case 'viewing_single_assignment':
        if (!viewingAs || !currentEvent) return null;
        const assigneeId = currentEvent.assignments[viewingAs.id];
        const assignee = currentEvent.participants.find(p => p.id === assigneeId);
        if (!assignee) return <p>Error: could not find assignment.</p>;
        const receivedMessages = currentEvent.messages[viewingAs.id] || [];
        return <AssignmentView 
            viewer={viewingAs}
            assignee={assignee}
            receivedMessages={receivedMessages}
            onSendMessage={handleSendMessage}
            eventDetails={currentEvent.details}
            onGoBack={handleGoBackToAssignmentsList}
            />;
      default:
        return <EventListPage events={events} onCreateEvent={() => setAppState('creating')} onSelectEvent={handleSelectEvent} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header onGoHome={goHome} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Secret Santa App powered by React &amp; TypeScript.</p>
      </footer>
    </div>
  );
};

export default App;