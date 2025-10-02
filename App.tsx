import React, { useState, useEffect, useMemo } from 'react';
import { SecretSantaEvent, EventDetails, Participant } from './types';
import Header from './components/Header';
import EventListPage from './components/EventListPage';
import CreateEventForm from './components/CreateEventForm';
import JoinEventPage from './components/JoinEventPage';
import AssignmentsSentPage from './components/AssignmentsSentPage';
import AssignmentView from './components/AssignmentView';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
    const [events, setEvents] = useState<SecretSantaEvent[]>([]);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'join' | 'assignments_sent' | 'assignment_view'>('list');
    const [activeEventId, setActiveEventId] = useState<string | null>(null);
    const [viewingParticipantId, setViewingParticipantId] = useState<number | null>(null);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedEvents = localStorage.getItem('secretSantaEvents');
            if (savedEvents) {
                setEvents(JSON.parse(savedEvents));
            }
        } catch (error) {
            console.error("Failed to load events from local storage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('secretSantaEvents', JSON.stringify(events));
        } catch (error) {
            console.error("Failed to save events to local storage", error);
        }
    }, [events]);

    const activeEvent = useMemo(() => events.find(e => e.id === activeEventId), [events, activeEventId]);
    const editingEventInitialData = useMemo(() => events.find(e => e.id === editingEventId)?.details, [events, editingEventId]);
    
    const goHome = () => {
        setView('list');
        setActiveEventId(null);
        setViewingParticipantId(null);
        setEditingEventId(null);
    };

    const handleSaveEvent = (details: EventDetails) => {
        if (editingEventId) { // Editing existing event
            setEvents(prev => prev.map(e => e.id === editingEventId ? { ...e, details } : e));
            setActiveEventId(editingEventId);
            setView('join');
        } else { // Creating new event
            const newEvent: SecretSantaEvent = {
                id: `evt-${Date.now()}`,
                details,
                participants: [],
                assignments: {},
                messages: {},
                status: 'setup',
            };
            setEvents(prev => [...prev, newEvent]);
            setActiveEventId(newEvent.id);
            setView('join');
        }
        setEditingEventId(null);
    };

    const handleAddParticipant = (name: string, emoji: string, code: string) => {
        if (!activeEventId) return;
        setEvents(prev => prev.map(e => {
            if (e.id === activeEventId) {
                const newParticipant: Participant = {
                    id: e.participants.length > 0 ? Math.max(...e.participants.map(p => p.id)) + 1 : 1,
                    name,
                    emoji,
                    code,
                    hasGift: false,
                };
                return { ...e, participants: [...e.participants, newParticipant] };
            }
            return e;
        }));
    };

    const makeAssignments = (participants: Participant[]): Record<number, number> => {
        const ids = participants.map(p => p.id);
        let receivers = [...ids];
        const assignments: Record<number, number> = {};
        let valid = false;
      
        while (!valid) {
          // Shuffle receivers
          for (let i = receivers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
          }
      
          // Check for self-assignment
          valid = true;
          for (let i = 0; i < ids.length; i++) {
            if (ids[i] === receivers[i]) {
              valid = false;
              break;
            }
          }
        }
      
        for (let i = 0; i < ids.length; i++) {
          assignments[ids[i]] = receivers[i];
        }
      
        return assignments;
    };
      

    const handleStartAssignments = () => {
        if (!activeEvent || activeEvent.participants.length < 2) return;
        const assignments = makeAssignments(activeEvent.participants);
        setEvents(prev => prev.map(e => 
            e.id === activeEventId ? { ...e, assignments, status: 'assignments_made' } : e
        ));
        setView('assignments_sent');
    };

    const handleSendMessage = (senderId: number, receiverId: number, message: string) => {
        if (!activeEventId) return;
        setEvents(prev => prev.map(e => {
            if (e.id === activeEventId) {
                const newMessages = { ...e.messages };
                if (!newMessages[receiverId]) {
                    newMessages[receiverId] = [];
                }
                newMessages[receiverId].push(message);

                const newParticipants = e.participants.map(p => p.id === senderId ? {...p, hasGift: true} : p)

                return { ...e, messages: newMessages, participants: newParticipants };
            }
            return e;
        }));
    }

    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        setEventToDeleteId(null);
        if (activeEventId === id) {
            goHome();
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'create':
                return <CreateEventForm onSave={handleSaveEvent} onCancel={goHome} />;
            case 'edit':
                return <CreateEventForm onSave={handleSaveEvent} onCancel={() => { setView('join'); setEditingEventId(null); }} initialData={editingEventInitialData} />;
            case 'join':
                if (activeEvent) {
                    return <JoinEventPage 
                        event={activeEvent} 
                        onParticipantAdded={handleAddParticipant}
                        onStartAssignments={handleStartAssignments}
                        onGoHome={goHome}
                    />;
                }
                return null;
            case 'assignments_sent':
                if (activeEvent) {
                    return <AssignmentsSentPage 
                        participants={activeEvent.participants}
                        onSelectParticipant={(id) => { setViewingParticipantId(id); setView('assignment_view'); }}
                    />
                }
                return null;
            case 'assignment_view':
                if (activeEvent && viewingParticipantId) {
                    const viewer = activeEvent.participants.find(p => p.id === viewingParticipantId);
                    const assigneeId = activeEvent.assignments[viewingParticipantId];
                    const assignee = activeEvent.participants.find(p => p.id === assigneeId);
                    if (viewer && assignee) {
                        return <AssignmentView 
                            viewer={viewer}
                            assignee={assignee}
                            receivedMessages={activeEvent.messages[viewer.id] || []}
                            onSendMessage={handleSendMessage}
                            eventDetails={activeEvent.details}
                            onGoBack={() => { setViewingParticipantId(null); setView('assignments_sent'); }}
                        />;
                    }
                }
                return null;
            case 'list':
            default:
                return <EventListPage 
                    events={events}
                    onCreateNewEvent={() => setView('create')}
                    onJoinEvent={(id) => { setActiveEventId(id); setView('join'); }}
                    onViewAssignments={(id) => { setActiveEventId(id); setView('assignments_sent'); }}
                    onEditEvent={(id) => { setEditingEventId(id); setActiveEventId(id); setView('edit'); }}
                    onDeleteEvent={(id) => setEventToDeleteId(id)}
                />;
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Header onGoHome={goHome} />
            <main className="container mx-auto px-4 py-8">
                {renderContent()}
            </main>
            <ConfirmationModal
                isOpen={!!eventToDeleteId}
                onClose={() => setEventToDeleteId(null)}
                onConfirm={() => eventToDeleteId && handleDeleteEvent(eventToDeleteId)}
                title="Delete Event?"
                message="Are you sure you want to delete this event? This action cannot be undone."
            />
        </div>
    );
};

export default App;
