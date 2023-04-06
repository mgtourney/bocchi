// import { Client, Models, Packets, type TAEvents } from "tournament-assistant-client";
import {
  Client,
  Models,
  Packets,
  type TAEvents,
} from "tournament-assistant-client";
import { Server } from "socket.io";
import type { RTState } from "shared/relayTypes"; // fix this skkeye lmao // f u
import { RelayState } from "../lib/RelayState";

export default class Relay {
  ta: Client;
  io: Server;
  rstate: RelayState = new RelayState();

  constructor() {
    this.ta = new Client("Magnesium Overlay", {
      url: "ws://ta.magnesium.gg:32001",
      options: {
        autoReconnect: true,
        autoReconnectInterval: 1000,
      },
    });

    this.io = new Server(3000, {
      cors: {
        origin: '*', // dev workaround
      }
    });

    this.setSocketListeners();
    this.setTAListeners();

    console.log("Successfully injected the Relay server.");
  }

  setSocketListeners() {
    this.io.on("connection", (socket) => {
      socket.on("updateState", () => {
        socket.emit("state", this.rstate.getState());
      });

      socket.on("ChangeScene", (msg) => {
        this.rstate.setLastScene(msg);
        socket.broadcast.emit("ChangeScene", this.rstate.getLastScene().page);
      });

      socket.on("getLastSceneChange", () => {
        socket.emit("sendLastSceneChange", this.rstate.getLastScene().page);
      });

      socket.on("SetMatch", (matchId: string) => {
        this.rstate.selectMatch(matchId, this.ta);
      });

      socket.on("effect", (type: string) => {
        socket.broadcast.emit("effect", type);
      })

      socket.on("getPageData", () => {
        socket.emit("pageData", this.rstate.getLastScene().data);
      })

      socket.on("setTeamPoints", (teamGUID: string, points: number) => {
        this.rstate.setTeamPoints(teamGUID, points);
      })
    });
  }

  setTAListeners() {
    this.ta.on("taConnected", () => {
      this.rstate.initMatches(this.ta);
      this.io.emit("state", this.rstate.getState());
    });

    this.ta.on("matchCreated", (event: TAEvents.PacketEvent<Models.Match>) => {
      this.rstate.addMatch(event.data, this.ta);
      this.io.emit("state", this.rstate.getState());
    });

    this.ta.on("matchUpdated", (event: TAEvents.PacketEvent<Models.Match>) => {
      this.rstate.updateMatch(event.data, this.ta);
      this.io.emit("state", this.rstate.getState());
    });

    this.ta.on("matchDeleted", (event: TAEvents.PacketEvent<Models.Match>) => {
      this.rstate.deleteMatch(event.data.guid);
      this.io.emit("state", this.rstate.getState());
    });

    this.ta.on("realtimeScore", (recv: TAEvents.PacketEvent<Packets.Push.RealtimeScore>) => {
      let delay = this.ta.getUser(recv.data.user_guid)?.stream_delay_ms;
      if (delay == undefined) delay = 0;

      this.rstate.updateRTScore(recv, (data: RTState) => {
        setTimeout(() => {
          this.io.emit("realtimeScore", data);
        }, delay);
      });
    });
  }
}
