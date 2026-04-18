import './App.css';
import { KanbanBoard } from './components/KanbanBoard';
import MissionControl from './components/MissionControl';
import { useState } from 'react';

function App() {
  const [view, setView] = useState<'kanban' | 'mission'>('kanban');

  return (
    <div className="app">
      <header className="app__header" style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <h1 className="app__title">Kanban Board</h1>
        <div style={{marginLeft: 'auto'}}>
          <button className="btn btn--ghost" onClick={() => setView('kanban')} aria-pressed={view === 'kanban'}>Kanban</button>
          <button className="btn btn--ghost" onClick={() => setView('mission')} aria-pressed={view === 'mission'} style={{marginLeft:8}}>Mission Control</button>
        </div>
      </header>
      <main className="app__main">
        {view === 'kanban' ? <KanbanBoard /> : <MissionControl />}
      </main>
    </div>
  );
}

export default App;
