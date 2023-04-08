export interface Score {
  points?: number;
  score: number;
  accuracy: number;
  misscount: number;
  badcutcount: number;
  totalmisscount: number;
}

export interface Player {
  guid: string;
  steamid: string;
  name: string;
  score?: Score;
  team?: Team;
  playing?: boolean;
  teamMembersGUIDs?: string[];
}

export interface Team {
  guid: string;
  playerGUIDs?: string[];
  name: string;
  score?: Score;
  avatar?: string;
}

export interface Song {
  id: string;
  name: string;
  characteristic: string;
  difficulty: string;
}

export interface Coordinator {
  guid: string;
  name: string;
}

export interface Match {
  guid: string;
  coordinator: Coordinator;
  players?: Player[];
  teams?: Team[];
  song?: Song;
}

export interface State {
  selectedMatch?: Match;
  players?: Player[];
  matches: Match[];
  teams?: Team[];
}

export interface RTState {
  // team: {
  //   guid: string,
  //   score: Score
  // };
  player: {
    guid: string,
    score: Score
  };
}

export interface LastScene {
  page: string;
  data: any;
}