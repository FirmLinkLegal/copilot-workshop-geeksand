import './App.css';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Kanban Board</h1>
      </header>
      <main className="app__main">
        <KanbanBoard />
      </main>
    </div>
  );
}

export default App;
