import { Match, LastScene, Player, Team, Score } from "shared/relayTypes";

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

interface TeamScore {
  teamGUID: string;
  score: Score
}

export class RelayState {
  selectedMatch?: Match;
  private matches: Match[] = [];
  private playerScores: Map<string, TeamScore> = new Map();
  private lastScene: LastScene = {
    page: "not-live",
    data: "",
  };

  private addMatchFull(match: Models.Match, TAClient: Client) {
    if (this.selectedMatch == undefined) return;
    //console.log("FULL MATCH ADD");

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
      const team = this.selectedMatch?.teams?.find((team) => team.guid == teamID);
      if (team == undefined) return;

      if (team.playerGUIDs == undefined) team.playerGUIDs = [] // (this exceeds the callstack, and fails. WHY WHY ON EARTH)

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

      if (!team.playerGUIDs.includes(player.guid)) team.playerGUIDs?.push(player.guid); //TODO: some fuckery here
      console.log(team)
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

      team.playerGUIDs?.forEach((playerGUID: string) => {
        this.selectedMatch!.players!.find((e) => e.guid == playerGUID)!.team = team; //* hazmat: look out for assertion bug here.
      });
    });

    this.selectedMatch.players?.forEach((player: Player) => {
      if (player.team == undefined) return;

      let memberGUIDs = this.selectedMatch?.teams?.find((team) => team.guid == player.team?.guid)?.playerGUIDs
      if (memberGUIDs == undefined) return;

      player.teamMembersGUIDs = [];
      memberGUIDs.forEach((member) => {
        if (member == player.guid) return;
        player.teamMembersGUIDs?.push(member);
      });
    });
  }

  private addMatchGeneral(match: Models.Match, TAClient: Client) {
    let matchPlayers: Player[] = [];
    let matchTeams: Team[] = [];

    TAClient.getMatchPlayers(match).forEach((player: PlayerWithScore) => {
      if (!player.has_team) return; // TODO: Support no teams

      if (matchTeams.find((t) => t.guid == player.team.id) == undefined) {
        matchTeams.push({
          guid: player.team.id,
          name: player.team.name
        });
      }

      matchPlayers.push({
        guid: player.guid,
        steamid: player.user_id,
        name: player.name
      });
    });

    let tempMatch = {
      guid: match.guid,
      coordinator: {
        guid: match.leader,
        name: TAClient.getCoordinator(match.leader)?.name ?? "",
      },
      players: matchPlayers,
      teams: matchTeams
    };

    if (this.matches.find((e) => e.guid == match.guid) != undefined) {
      this.matches = this.matches.map((e) => e.guid == match.guid ? tempMatch : e);
    } else {
      this.matches.push(tempMatch);
    }
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

    if (match.associated_users.find((e) => e == TAClient.Self.guid) === undefined) {
      match.associated_users.push(TAClient.Self.guid);
      TAClient.updateMatch(match);
    }

    this.selectedMatch = this.matches.find((e) => e.guid == matchGUID);
    this.addMatchFull(match, TAClient);
  }

  deleteMatch(matchGUID: string | undefined) {
    if (matchGUID == undefined) return;
    if (this.selectedMatch?.guid == matchGUID) this.selectedMatch = undefined;
    this.matches = this.matches.filter((e) => e.guid != matchGUID)
    console.log(this.matches)
  }

  updateUser(user: Models.User) {
    this.selectedMatch?.players?.forEach((player: Player) => {
      if (player.guid == user.guid) {
        player.name = user.name;
        player.steamid = user.user_id;
        player.playing = user.play_state == Models.User.PlayStates.InGame;
      }
    })
  }

  getState(): any {
    return {
      selectedMatch: this.selectedMatch,
      matches: this.matches,
      players: this.selectedMatch?.players,
      teams: this.selectedMatch?.teams
    };
  }

  updateRTScore(
    realtimeScore: TAEvents.PacketEvent<Packets.Push.RealtimeScore>,
    callback: CallableFunction
  ) {
    let teamGUID = this.selectedMatch?.players?.find((e) => e.guid == realtimeScore.data.user_guid)?.team?.guid;
    let otherPlayersGUID = this.selectedMatch?.players?.find((e) => e.guid == realtimeScore.data.user_guid)?.teamMembersGUIDs;
    if (teamGUID == undefined || otherPlayersGUID == undefined) return;// come here

    let updatedPlayer = this.selectedMatch?.players?.find((e) => e.guid == realtimeScore.data.user_guid);
    if (updatedPlayer == undefined) return;

    console.log(realtimeScore);
    updatedPlayer.score = {
      score: realtimeScore.data.score_with_modifiers,
      accuracy: realtimeScore.data.accuracy,
      misscount: realtimeScore.data.scoreTracker.notesMissed,
      badcutcount: realtimeScore.data.scoreTracker.badCuts,
      totalmisscount:
        realtimeScore.data.scoreTracker.notesMissed +
        realtimeScore.data.scoreTracker.badCuts,
    };

    this.playerScores.set(updatedPlayer.guid, <TeamScore>{ teamGUID: teamGUID, score: updatedPlayer.score })

    // if (!this.teamScores.has(player)) {
    //   this.teamScores.set(, )
    // } else {
    //   let teamScore = this.teamScores.get(teamGUID)!
    //   teamScore.accuracy += 
    //   this.teamScores.set(teamGUID, teamScore)
    // }
    let teamLen = Array.from(this.playerScores.values()).filter((e) => e.teamGUID == teamGUID).length;
    let teamScore = Array.from(this.playerScores.values()).filter((e) => e.teamGUID == teamGUID).reduce((a, b) => <TeamScore>{
      teamGUID: teamGUID,
      score: {
        score: a.score.score + b.score.score,
        accuracy: a.score.accuracy + b.score.accuracy,
        misscount: a.score.misscount + b.score.misscount,
        badcutcount: a.score.badcutcount + b.score.badcutcount,
        totalmisscount: a.score.totalmisscount + b.score.totalmisscount
      }
    }).score;
    teamScore.accuracy = teamScore.accuracy / teamLen;
    // teamScore.points = this.selectedMatch?.teams?.find((e) => e.guid == teamGUID)?.score?.points;
    this.selectedMatch!.teams = this.selectedMatch!.teams?.map((e) => e.guid == teamGUID ? {...e, score: {...teamScore}} : e)

    callback({
      team: {
        guid: teamGUID,
        score: teamScore,
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

    this.selectedMatch!.teams = this.selectedMatch!.teams?.map((e) => e.guid == teamGUID ? teamBackup! : e);
  }
}
