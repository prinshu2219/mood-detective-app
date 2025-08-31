export interface Character {
  name: string;
  role: string;
  description: string;
  dialogue: string[];
}

export interface Characters {
  luna: Character;
  tom: Character;
  maya: Character;
  rex: Character;
}

export interface Welcome {
  title: string;
  subtitle: string;
  startButton: string;
  description: string;
}

export interface Story {
  intro: string[];
  howItWorks: string[];
  challenge: string[];
}

export interface Sentences {
  happy: string[];
  sad: string[];
  angry: string[];
  neutral: string[];
}

export interface Game {
  instructions: string;
  round: string;
  score: string;
  correct: string;
  incorrect: string;
  nextRound: string;
  finish: string;
  congratulations: string;
}

export interface MLPeek {
  title: string;
  subtitle: string;
  rulesMethod: string;
  mlMethod: string;
  explanation: string;
  trySentence: string;
}

export interface Certificate {
  title: string;
  subtitle: string;
  achievement: string;
  skills: string;
  skill1: string;
  skill2: string;
  skill3: string;
  date: string;
  signature: string;
  download: string;
}

export interface UI {
  loading: string;
  error: string;
  back: string;
  next: string;
  skip: string;
  continue: string;
  start: string;
  finish: string;
  retry: string;
}

export interface Strings {
  welcome: Welcome;
  characters: Characters;
  story: Story;
  sentences: Sentences;
  game: Game;
  mlPeek: MLPeek;
  certificate: Certificate;
  ui: UI;
}
