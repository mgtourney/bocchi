import { Match, LastScene, Player, Team, State } from "../../shared/relayTypes";

import {
  Client,
  Models,
  Packets,
  PlayerWithScore,
  type TAEvents,
} from "tournament-assistant-client";

export const GameDifficulty = ["Easy", "Normal", "Hard", "Expert", "Expert+"];
export const GameCharacteristic = [
  "Standard",
  "OneSaber",
  "NoArrows",
  "Lawless",
];

export class RelayState {
  selectedMatch?: Match;
  private matches: Match[] = [];
  private lastScene: LastScene = {
    page: "not-live",
    data: "",
  };

  private addMatchFull(match: Models.Match, TAClient: Client) {
    if (this.selectedMatch == undefined) return;

    if (match.has_selected_level && match.has_selected_characteristic) {
      this.selectedMatch.song = {
        id: match.selected_level.level_id,
        name: match.selected_level.name,
        characteristic: match.selected_characteristic.serialized_name,
        difficulty: GameDifficulty[match.selected_difficulty],
      };
    }

    this.selectedMatch?.players?.forEach((player: Player) => {
      let teamID = TAClient.getPlayer(player.guid)?.team.id; // TeamGUID is from TA
      if (teamID == undefined) return;

      // this.selectedMatch?.teams?.get(teamID)?.players?.set(player.guid, player);
      // in array form:
      let team = this.selectedMatch?.teams?.find((team) => team.guid == teamID)

      if (team == undefined) return;
      team.players?.push(player);

      if (player.score == undefined) {
        player.score = {
          points: 0,
          score: 0,
          accuracy: 1,
          misscount: 0,
          badcutcount: 0,
          totalmisscount: 0,
        };
      }
    });

    // TODO: Match.Teams.Avatar
    this.selectedMatch.teams?.forEach((team: Team) => {
      if (team.score == undefined) {
        team.score = {
          points: 0,
          score: 0,
          accuracy: 1,
          misscount: 0,
          badcutcount: 0,
          totalmisscount: 0,
        };
      }

      team.players?.forEach((player: Player) => {
        player.team = team;
      });
    });

    this.selectedMatch.players?.forEach((player: Player) => {
      if (player.team == undefined) return;

      let iterMembers = this.selectedMatch?.teams
        ?.find((team) => team.guid == player.team?.guid)
        ?.players?.map((player) => player.guid);

      if (iterMembers == undefined) return;
      Array.from(iterMembers).forEach((member) => {
        if (member == player.guid) return;
        player.teamMembersGUIDs?.push(member);
      });
    });
  }

  private addMatchGeneral(match: Models.Match, TAClient: Client) {
    if (this.matches.find((m) => m.guid == match.guid) != undefined) return;

    TAClient.getMatchPlayers(match).forEach((player: PlayerWithScore) => {
      this.matches.push({
        guid: match.guid,
        coordinator: {
          guid: match.leader,
          name: TAClient.getCoordinator(match.leader)?.name ?? "",
        },
        players: [],
        teams: []
      });
    });
  }

  initMatches(TAClient: Client) {
    TAClient.State.matches.forEach((match: Models.Match) => {
      this.addMatchGeneral(match, TAClient);
    });
  }

  addMatch(match: Models.Match, TAClient: Client) {
    this.addMatchGeneral(match, TAClient);
  }

  updateMatch(match: Models.Match, TAClient: Client) {
    if (match.guid == this.selectedMatch?.guid) {
      this.addMatchFull(match, TAClient);
    } else {
      this.addMatchGeneral(match, TAClient);
    }
  }

  selectMatch(matchGUID: string | undefined, TAClient: Client) {
    if (matchGUID == undefined) return;
    let match = TAClient.getMatch(matchGUID);
    if (match == undefined) return;
    match.associated_users.push(TAClient.Self.guid);
    TAClient.updateMatch(match);
    this.selectedMatch = this.matches.find((e) => e.guid == matchGUID);
    this.addMatchFull(match, TAClient);
  }

  deleteMatch(matchGUID: string | undefined) {
    if (matchGUID == undefined) return;
    if (this.selectedMatch?.guid == matchGUID) this.selectedMatch = undefined;
    this.matches.delete(matchGUID);
  }

  getState(): any {
    return {
      match: this.selectedMatch,
      matches: this.matches,
      players: this.selectedMatch?.players,
      teams: this.selectedMatch?.teams
    };
  }

  updateRTScore(
    realtimeScore: TAEvents.PacketEvent<Packets.Push.RealtimeScore>,
    callback: CallableFunction
  ) {
    let teamGUID = this.selectedMatch?.players?.get(
      realtimeScore.data.user_guid
    )?.team?.guid;
    let otherPlayersGUID = this.selectedMatch?.players?.get(
      realtimeScore.data.user_guid
    )?.teamMembersGUIDs;
    if (teamGUID == undefined || otherPlayersGUID == undefined) return;

    let updatedPlayer = this.selectedMatch?.players?.find((e) => e.guid == realtimeScore.data.user_guid);
    if (updatedPlayer == undefined) return;

    updatedPlayer.score = {
      score: realtimeScore.data.score_with_modifiers,
      accuracy: realtimeScore.data.accuracy,
      misscount: realtimeScore.data.scoreTracker.notesMissed,
      badcutcount: realtimeScore.data.scoreTracker.badCuts,
      totalmisscount:
        realtimeScore.data.scoreTracker.notesMissed +
        realtimeScore.data.scoreTracker.badCuts,
    };

    let cumulScore = 0,
      cumulAcc = 0,
      totalAcc = 0,
      cumulMiss = 0,
      cumulBad = 0,
      cumulTotalMiss = 0;
    let updatedPlayers = this.selectedMatch?.players;
    if (updatedPlayers == undefined) return;

    updatedPlayers.forEach((player) => {
      if (player.score == undefined) return;
      if (!otherPlayersGUID?.includes(player.guid)) return;
      cumulScore += player.score.score;
      cumulAcc += player.score.accuracy;
      totalAcc += 1;
      cumulMiss += player.score.misscount;
      cumulBad += player.score.badcutcount;
      cumulTotalMiss += player.score.totalmisscount;
    });

    let updatedTeam = this.selectedMatch?.teams?.find((e) => e.guid == teamGUID);
    if (updatedTeam == undefined) return;

    updatedTeam.score = {
      score: cumulScore + updatedPlayer.score.score,
      accuracy: (cumulAcc + updatedPlayer.score.accuracy) / (totalAcc + 1),
      misscount: cumulMiss + updatedPlayer.score.misscount,
      badcutcount: cumulBad + updatedPlayer.score.badcutcount,
      totalmisscount: cumulTotalMiss + updatedPlayer.score.totalmisscount,
    };

    callback({
      team: {
        guid: updatedTeam.guid,
        score: updatedTeam.score,
      },
      player: {
        guid: updatedPlayer.guid,
        score: updatedPlayer.score,
      },
    });
  }

  getLastScene() {
    return this.lastScene;
  }

  setLastScene(scene: LastScene) {
    this.lastScene = scene;
  }

  setTeamPoints(teamGUID: string, points: number) {
    let teamBackup = this.selectedMatch?.teams?.find((e) => e.guid == teamGUID);
    if (teamBackup?.score == undefined) return;
    teamBackup.score.points = points;
    this.selectedMatch?.teams?.set(teamGUID, teamBackup);
  }
}
