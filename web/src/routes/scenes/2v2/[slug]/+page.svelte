<script lang="ts">
  import ScoreLine from "$lib/components/ScoreLine.svelte";
  import GameView from "$lib/components/GameView/GameView.svelte";
  import DiffBar from "$lib/components/DiffBar.svelte";
  import ScoreCluster from "$lib/components/ScoreCluster.svelte";
  import TeamInfo from "$lib/components/TeamInfo.svelte";
  import SongTitle from "$lib/components/SongTitle.svelte";
  import { io } from "$lib/socket";
  import { gql } from "graphql-request";
  import { GQL } from "$lib/constants";
  import type { Player, RTState, Song, State, Team } from "$lib/relayTypes";

  let globalScale = 0.412;
  
  let song: Song;
  let team1: string;
  let team2: string;
  let teams: Map<string, Team> = new Map<string, Team>();
  let player1: string;
  let player2: string;
  let player3: string;
  let player4: string;
  let players: Map<string, Player> = new Map<string, Player>();
  let diff: number = 0;

  // please for the love of god end me.  - niko@velvet.moe
  let qTeams: Map<string, any> = new Map();
  let qTeam1: any;
  let qTeam2: any;
  let qTeam1Users: Set<string> = new Set();
  let qTeam2Users: Set<string> = new Set();
  let qTeam1UsersStr: string = "";
  let qTeam2UsersStr: string = "";

  function updateTeam(id: string) {
    let query = gql`
      query Query($where: PlayerWhereUniqueInput!) {
        getPlayer(where: $where) {
          team
        }
      }
    `;
    GQL.request(query, { where: { steam: id } }).then((val: any) => {
      //console.log(val)
      let query = gql`
        query Query($where: TeamWhereUniqueInput!) {
          getTeam(where: $where) {
            name
            logo
          }
        }
      `;

      GQL.request(query, { where: { id: val.getPlayer.team } }).then(
        (val: any) => {
          // console.log(val)
          qTeams.set(id, val.getTeam);
        }
      );
    }).catch(() => {
      return;
    });
  }

  io.on("state", ({match}: State) => {
    

    // match = state.matches.filter(
    //   (e: Models.Match) => e.guid == data.matchId
    // )[0];
    // if (match != undefined) {
    //   if (match.selected_level != undefined) {
    //     songName = match.selected_level.name;
    //     if (match.selected_characteristic != undefined) {
    //       songChar = match.selected_characteristic.serialized_name;

    //       songDiff =
    //         GameDifficulty[match.selected_difficulty] == undefined
    //           ? "Expert+"
    //           : GameDifficulty[match.selected_difficulty];
    //     }
    //   }

    //   let _players = match!.associated_users.filter(
    //     (e) => e != match!.leader && e != state.self.guid
    //   );
    //   let players = state.users.filter((e: Models.User) =>
    //     _players.includes(e.guid)
    //   );

    //   team1 = players.filter(
    //     (e: Models.User) => e.team.id == "c99d666c-0bbb-4530-9803-0d2e1d6034e1"
    //   );
    //   team1.forEach((e) => {
    //     updateTeam(e.user_id);
    //     qTeam1 = qTeams.get(e.user_id);
    //     if(!qTeam1Users.has(e.name)) qTeam1Users.add(e.name);
    //     qTeam1UsersStr = Array.from(qTeam1Users)[0] + " & " + Array.from(qTeam1Users)[1] // forgive my sins :3 - niko
    //   });

    //   team2 = players.filter(
    //     (e: Models.User) => e.team.id == "c195776a-6307-4cc3-b6f2-f1f122c89c81"
    //   );
    //   team2.forEach((e) => {
    //     updateTeam(e.user_id);
    //     qTeam2 = qTeams.get(e.user_id);
    //     if(!qTeam2Users.has(e.name)) qTeam2Users.add(e.name);
    //     qTeam2UsersStr = Array.from(qTeam2Users)[0] + " & " + Array.from(qTeam2Users)[1]
    //   });

    //   team1GUIDS = team1.flatMap((e) => e.guid);
    //   team2GUIDS = team2.flatMap((e) => e.guid);
    // }
  });

  io.on("realtimeScore", ({ team, player }: RTState) => {
    if(team.guid === teams.get(team1)?.guid) {
      let modified = teams.get(team2);
      if(modified != undefined) {
        modified.score = team.score;
        
      }
    } else if(team.guid === team2.guid) {
      team2.score = team.score;
    }
    if(teams.get(team1)?.score?.accuracy == undefined || teams.get(team2)?.score?.accuracy == undefined) return;
    diff = team1.score?.accuracy - team2.score?.accuracy;
  });
</script>

<div class="flex-col w-full h-full">
  <DiffBar bind:diff />
  <div class="flex items-center justify-center">
    <div class="flex-col">
      {#if team1 != undefined}
        <GameView
          playerName={player1.name}
          accuracy={player1.score?.accuracy ?? 100}
          missCount={player1.score?.misscount ?? 0}
          steamId={player1.steamid}
          scale={globalScale}
          muted={false}
        />
        <GameView
          playerName={player2.name}
          accuracy={player2.score?.accuracy ?? 100}
          missCount={player2.score?.misscount ?? 0}
          steamId={player2.steamid}
          scale={globalScale}
          muted={true}
          bottom={true}
        />
      {/if}
      <!-- <GameView playerName="!!!" scale={globalScale} muted={true} pos={1} /> -->
    </div>

    <div class="flex-col w-full">
      <div class="flex m-10 mb-28">
        <ScoreCluster teamGUID={team1.guid} />
        <div class="flex-grow" />
      </div>
      <div class="flex mx-7">
        <ScoreLine points={team1.score?.points ?? 0} />
        <div class="flex-grow" />
        <ScoreLine points={team2.score?.points ?? 0} />
      </div>
      <div class="flex m-10 mt-28">
        <div class="flex-grow" />
        <ScoreCluster flipped={true} teamGUID={team2.guid} />
      </div>
    </div>

    <div class="flex-col">
      {#if team2 != undefined}
        <GameView
          playerName={player3.name}
          accuracy={player3.score?.accuracy ?? 100}
          missCount={player3.score?.misscount ?? 0}
          steamId={player3.steamid}
          scale={globalScale}
          muted={true}
          flipped={true}
        />
        <GameView
          playerName={player4.name}
          accuracy={player4.score?.accuracy ?? 100}
          missCount={player4.score?.misscount ?? 0}
          steamId={player4.steamid}
          scale={globalScale}
          muted={true}
          flipped={true}
          bottom={true}
        />
      {/if}
    </div>
  </div>
  <div class="flex items-center justify-center">
    <TeamInfo avatar={team1.avatar} name={team1.name} members={`${player1} ${player2}`}/>
    <div class="w-full" />
    <TeamInfo flipped={true} avatar={team2.avatar} name={team2.name} members={`${player3} ${player4}`}/>
  </div>
  <div class="flex h-full items-center justify-center">
    <SongTitle songName={song?.name ?? "Loading..."} songDiff={song?.difficulty ?? "Loading..."} />
  </div>
</div>
