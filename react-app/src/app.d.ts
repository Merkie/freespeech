type PartOfSpeech =
  | 'Noun'
  | 'Pronoun'
  | 'Verb'
  | 'Adjective'
  | 'Adverb'
  | 'Preposition'
  | 'Conjunction'
  | 'Interjection'
  | 'Determiner'
  | 'Numeral'
  | 'Participle'
  | 'Auxiliary Verb'
  | 'Modal Verb'
  | 'Gerund'
  | 'Infinitive'
  | 'Contraction'
  | 'Exclamation'
  | 'Other';

type Project = {
  format: string;
  id: string;
  name: string;
  description: string;
  locale: string;
  boards: Board[];
};

type Board = {
  id: string;
  name: string;
  tiles: Tile[];
  grid: {
    rows: number;
    columns: number;
    order: number[][];
  };
};

type Tile = {
  id: number;
  label: string;
  border_color: string;
  background_color: string;
  part_of_speech: PartOfSpeech;
  image: {
    url: string;
  };
};
