export type Category =
  | "History & Counterfactuals"
  | "Geopolitics & International Relations"
  | "Economics & Markets"
  | "Domestic Politics & Governance"
  | "Technology & AI Futures"
  | "Climate & Environment"
  | "Business Strategy & Startups"
  | "Sports"
  | "Social & Cultural Dynamics"
  | "Security & Conflict";

export type Domain = "political" | "economic" | "security" | "technological" | "mixed";
export type TimeHorizon = "1-year" | "3-year" | "5-year" | "Time-irrelevant"; 
export type Difficulty = "Introductory" | "Intermediate" | "Advanced";
export type Reusability = "Low" | "Medium" | "High";

// The raw output from Prompt #1
export interface RawScenarioEntry {
  scenarioId: string;
  title: string;
  category: Category;
  canonicalQuestion: string;
  systemActor: string;
  issueFocus: string;
  timeHorizon: TimeHorizon[] | ["Time-irrelevant"] | string[]; // Allow strings for robustness
  domain: Domain;
  geography: string;
  notes?: string;
  tags?: string[];
}

// The Curated/Final Schema (Prompt #2 Output & Export Schema)
export interface ScenarioLibraryEntry {
  scenarioId: string;
  title: string;
  category: Category;
  canonicalQuestion: string;
  systemActor: string;
  issueFocus: string;
  timeHorizon: "Time-irrelevant" | Array<1 | 3 | 5> | Array<string> | string[]; 
  domain: Domain;
  geography?: string; 
  
  // Metadata added by Curation
  difficulty?: Difficulty;
  reusability?: Reusability;
  idealUseCases?: string[];
  
  tags?: string[];
  notes?: string;
}

export interface GenerationStats {
  total: number;
  byCategory: Record<string, number>;
}

// --- MEMORY / WATCHLIST TYPES ---

export type DriftStatus = 'Stable' | 'Gradual Shift' | 'Widening Uncertainty' | 'New';

export interface PromptVersion {
  id: string;
  versionNumber: number;
  type: 'Manual' | 'Enhanced' | 'Canonical';
  text: string;
  created: string; // ISO Date
  notes?: string;
  changes?: string[]; // e.g. ["Removed inevitability", "Added constraints"]
}

export interface SavedScenario {
  id: string;
  watchlistId: string;
  libraryId?: string; // If linked to a canonical scenario
  title: string;
  category: Category | string;
  domain: Domain | string;
  timeHorizon: string[];
  lastRunDate?: string;
  driftStatus: DriftStatus;
  versions: PromptVersion[];
  notes?: string;
  runCount: number;
}

export interface Watchlist {
  id: string;
  name: string;
  type: 'active' | 'library' | 'personal';
  subtype?: 'draft' | 'refined' | 'archived';
}
