export type FormatType = 
  | 'Interpretation debate'
  | 'Thought experiment'
  | 'Big question'
  | 'Paper of the day';

export type LevelType = 'Beginner' | 'Curious' | 'Advanced';
export type LengthType = '3 min' | '5 min' | '8 min';
export type MoodType = 'Curious' | 'Playful' | 'Serious';

export interface PresetCard {
  id: string;
  title: string;
  description: string;
  prompt: string;
  format: FormatType;
}

export type PresetTab = 'Quantum' | 'Cosmos' | 'Fresh papers';

export const FORMAT_OPTIONS: FormatType[] = [
  'Interpretation debate',
  'Thought experiment',
  'Big question',
  'Paper of the day',
];

export const LEVEL_OPTIONS: LevelType[] = ['Beginner', 'Curious', 'Advanced'];

export const LENGTH_OPTIONS: LengthType[] = ['3 min', '5 min', '8 min'];

export const MOOD_OPTIONS: MoodType[] = ['Curious', 'Playful', 'Serious'];

export const PRESET_TABS: PresetTab[] = ['Quantum', 'Cosmos', 'Fresh papers'];

export const PRESET_CARDS: Record<PresetTab, PresetCard[]> = {
  Quantum: [
    {
      id: 'moon-there',
      title: 'Is the Moon There?',
      description: 'Copenhagen, Many-Worlds and pilot wave argue about measurement',
      prompt: 'Is the Moon there when nobody looks? Copenhagen, Many-Worlds, and pilot wave interpretations clash over the nature of observation.',
      format: 'Interpretation debate',
    },
    {
      id: 'schrodingers-cat',
      title: "Schrödinger's Cat, Properly",
      description: 'The thought experiment and what it was meant to criticise',
      prompt: "Schrödinger's Cat, properly: unraveling the original 1935 thought experiment and what Erwin Schrödinger actually meant to criticise.",
      format: 'Thought experiment',
    },
  ],
  Cosmos: [
    {
      id: 'dark-matter',
      title: 'What Is Dark Matter?',
      description: 'What is measured and what is still open',
      prompt: 'What is dark matter? What have we actually measured from galactic rotation curves and gravitational lensing, and what is still wide open?',
      format: 'Big question',
    },
    {
      id: 'black-hole-inside',
      title: 'Inside a Black Hole',
      description: 'Event horizons and the information puzzle',
      prompt: 'Inside a black hole: crossing the event horizon, spaghettification, singularity physics, and Hawking’s black hole information paradox.',
      format: 'Big question',
    },
  ],
  'Fresh papers': [
    {
      id: 'quantum-paper-day',
      title: 'Quantum Paper of the Day',
      description: 'Newest arXiv quant-ph preprints in plain English',
      prompt: 'Quantum Paper of the Day: breakdown of the most intriguing new preprint from arXiv quant-ph explained in plain, vivid English.',
      format: 'Paper of the day',
    },
    {
      id: 'cosmology-paper-day',
      title: 'Cosmology Paper of the Day',
      description: 'Newest astro-ph.CO preprints',
      prompt: 'Cosmology Paper of the Day: deep dive into the latest preprint from astro-ph.CO on cosmic inflation, the Hubble tension, or large-scale structure.',
      format: 'Paper of the day',
    },
  ],
};

export const GENERATION_STEPS = [
  'Researching',
  'Writing script',
  'Recording voices',
  'Composing music',
  'Mixing',
  'Painting cover',
] as const;
