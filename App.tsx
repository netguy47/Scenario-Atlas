import React, { useState } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Curator } from './components/Curator';
import { Library } from './components/Library';
import { MemoryView } from './components/MemoryView';
import { RawScenarioEntry, ScenarioLibraryEntry, Watchlist, SavedScenario } from './types';

// Mock Data
const MOCK_WATCHLISTS: Watchlist[] = [
    { id: 'w1', name: 'Geopolitical Risks', type: 'active' },
    { id: 'w2', name: 'Sports Teams (2026)', type: 'active' },
    { id: 'w3', name: 'Startup Ideas', type: 'personal', subtype: 'draft' },
    { id: 'w4', name: 'Drafts', type: 'personal', subtype: 'draft' },
    { id: 'w5', name: 'Core Strategy (Refined)', type: 'personal', subtype: 'refined' },
    { id: 'w6', name: '2024 Archive', type: 'personal', subtype: 'archived' }
];

function App() {
  const [view, setView] = useState<'library' | 'generator' | 'curator' | 'memory'>('generator');
  const [scenarios, setScenarios] = useState<(RawScenarioEntry | ScenarioLibraryEntry)[]>([]);
  
  // Memory State
  const [watchlists, setWatchlists] = useState<Watchlist[]>(MOCK_WATCHLISTS);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  const addScenarios = (newScenarios: RawScenarioEntry[]) => {
    setScenarios(prev => [...prev, ...newScenarios]);
    setView('library');
  };

  const updateScenarios = (curated: ScenarioLibraryEntry[]) => {
    setScenarios(curated);
    setView('library');
  };

  const addToWatchlist = (scenario: ScenarioLibraryEntry | RawScenarioEntry) => {
    // Default to first watchlist for now
    const targetWatchlistId = watchlists[0].id;
    const newSaved: SavedScenario = {
        id: `save-${Date.now()}`,
        watchlistId: targetWatchlistId,
        libraryId: scenario.scenarioId,
        title: scenario.title,
        category: scenario.category,
        domain: scenario.domain,
        timeHorizon: Array.isArray(scenario.timeHorizon) ? scenario.timeHorizon.map(String) : [String(scenario.timeHorizon)],
        driftStatus: 'New',
        runCount: 0,
        versions: [{
            id: `v1-${Date.now()}`,
            versionNumber: 1,
            type: 'Canonical',
            text: scenario.canonicalQuestion,
            created: new Date().toISOString(),
            notes: 'Imported from Library'
        }]
    };
    setSavedScenarios(prev => [...prev, newSaved]);
    setView('memory');
  };

  const addNewPrompt = (data: any) => {
      const { title, category, domain, timeHorizon, text, watchlistId } = data;
      const newSaved: SavedScenario = {
          id: `custom-${Date.now()}`,
          watchlistId: watchlistId || watchlists.find(w => w.type === 'personal')?.id || watchlists[0].id,
          title,
          category,
          domain,
          timeHorizon,
          driftStatus: 'New',
          runCount: 0,
          versions: [{
              id: `v1-${Date.now()}`,
              versionNumber: 1,
              type: 'Manual',
              text,
              created: new Date().toISOString(),
              notes: 'Initial Manual Draft'
          }]
      };
      setSavedScenarios(prev => [...prev, newSaved]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Header currentView={view} setView={setView} totalItems={scenarios.length} />
      
      <main className="flex-grow">
        {view === 'generator' && (
          <Generator onAddScenarios={addScenarios} />
        )}
        {view === 'curator' && (
          <Curator currentScenarios={scenarios} onUpdateScenarios={updateScenarios} />
        )}
        {view === 'library' && (
          <Library scenarios={scenarios} onAddToWatchlist={addToWatchlist} />
        )}
        {view === 'memory' && (
            <MemoryView 
                watchlists={watchlists} 
                savedScenarios={savedScenarios} 
                onAddPrompt={addNewPrompt}
                onSetView={(v) => setView(v)}
            />
        )}
      </main>

      {/* Only show footer on scrollable pages or if content is short */}
      {view !== 'memory' && (
        <footer className="bg-white border-t border-slate-200 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-slate-400">
                Scenario Atlas &copy; {new Date().getFullYear()}. Designed for QLSV2 Integration.
            </p>
            <p className="text-xs text-slate-300 mt-1 font-mono">
                Powered by Gemini 2.5 Flash
            </p>
            </div>
        </footer>
      )}
    </div>
  );
}

export default App;
