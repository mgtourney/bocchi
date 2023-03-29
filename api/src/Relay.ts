// import { Client, Models, Packets, type TAEvents } from "tournament-assistant-client";
import {
  Client,
  Models,
  Packets,
  type TAEvents,
} from "tournament-assistant-client";
import { Server } from "socket.io";

class RelayState {
  players: Map<string, string> = new Map(); // matchgu=d -> playerguid
}

export default class Relay {
  ta: Client;
  io: Server;
  rstate: RelayState = new RelayState();
  lastScene: Object = {
    page: `starting-soon`,
    slug: ""
  };

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

    this.initSocketIo();
    this.initTA();

    console.log("Successfully injected the Relay server.");
  } // its broken because the rest of the overlay needs to be updated to reflect the new state shz, check the emits and I'll BRB

  initSocketIo() {
    this.io.on("connection", (socket) => {
      socket.on("ChangeScene", (msg) => {
        this.lastScene = msg;
        socket.broadcast.emit("ChangeScene", msg);
      });

      socket.on("SetMatch", (matchId: string) => {
        let event = this.ta.State.matches.filter((e) => e.guid == matchId)[0];
        if (event.associated_users.includes(this.ta.Self.guid)) return;

        event.associated_users.push(this.ta.Self.guid);
        this.ta.updateMatch(event);
      });

      socket.on("getLastSceneChange", () => {
        socket.emit("sendLastSceneChange", this.lastScene);
      });
    });
  }

  initTA() {
    this.ta.on("matchCreated", (event: TAEvents.PacketEvent<Models.Match>) => {
      this.io.emit("matchCreated", event.data);
    });

    this.ta.on(
      "realtimeScore",
      (recv: TAEvents.PacketEvent<Packets.Push.RealtimeScore>) => {
        // console.log("realtimeScore", recv.data);
        let delay = this.ta.State.users.filter(
          (e) => e.guid == recv.data.user_guid
        )[0].stream_delay_ms;

        setTimeout(() => {
          this.io.emit("realtimeScore", recv.data.toObject());
        }, delay + 1);
      }
    );

    setInterval(() => {
      this.refreshCache();
    }, 1000);
  }

  refreshCache() {
    this.io.emit("state", {
      matches: this.ta.State.matches.map((e) => e.toObject()),
      users: this.ta.State.users.map((e) => e.toObject()),
      self: this.ta.Self.toObject(),
    });
  }
}
