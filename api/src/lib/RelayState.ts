import {
  Client,
  Models,
  Packets,
  type TAEvents,
} from "tournament-assistant-client";

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
  score: Score;
  team: Team;
  match: Match;
}

export interface Team {
  guid: string;
  players: Map<string, Player>; // playerguid -> Player
  name: string;
  score: Score;
  avatar: string;
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
  players: Map<string, Player>; // playerguid -> Player
  teams: Map<string, Team>; // teamguid -> Team
}

export interface LastScene {
  page: string;
  slug: string;
}

export class RelayState {
  selectedMatch?: string;
  private matches?: Map<string, Match>; // matchguid -> Match
  private lastScene: LastScene = {
    page: "not-live",
    slug: ""
  };

  getLastScene() {
    return this.lastScene;
  }

  setLastScene(scene: LastScene) {
    this.lastScene = scene;
  }

  getAllMatches() {
    return this.matches;
  }

  getMatch() {
    if(this.selectedMatch == undefined) return undefined;
    return this.matches?.get(this.selectedMatch);
  }

  selectMatch(match: string | undefined) {
    this.selectedMatch = match;
  }

  updateState(taClient: Client) {

  }

  updateRTScore(realtimeScore: Packets.Push.RealtimeScore) {

  }
}