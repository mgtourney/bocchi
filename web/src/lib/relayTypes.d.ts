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
  teamMembersGUIDs?: string[];
}

export interface Team {
  guid: string;
  players?: Map<string, Player>; // playerguid -> Player
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

export interface Match {
  guid: string;
  coordinator: string;
  players?: Map<string, Player>; // playerguid -> Player
  teams?: Map<string, Team>; // teamguid -> Team
  song?: Song;
}

export interface State {
  matches: Map<string, Match>;
  match?: Match;
  players?: Map<string, Player>;
  teams?: Map<string, Team>;
}

export interface RTState {
  team: {
    guid: string,
    score: Score
  };
  player: {
    guid: string,
    score: Score
  };
}