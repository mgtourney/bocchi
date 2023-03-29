import { PrismaClient } from "@prisma/client";

let players: any[] = [];
let steamid: string = "";
let name: string = "";
let twitch: string = "";
let discord: string = "";

const prisma = new PrismaClient();

prisma.player.findMany().then((res) => {
  players = res;
});

async function SetPlayer(
  steamid: string,
  name: string,
  twitch: string,
  discord: string
) {
  prisma.player
    .upsert({
      where: {
        steam: steamid,
      },
      update: {
        name: name,
        twitch: twitch,
        discord: discord,
      },
      create: {
        steam: steamid,
        name: name,
        twitch: twitch,
        discord: discord,
      },
    })
    .then(() => {
      return null;
    });
}

function DeletePlayer(steamid: string) {
  prisma.player
    .delete({
      where: {
        steam: steamid,
      },
    })
    .then(() => {
      return null;
    });
}

function UpdatePlayer(
  steamid: string,
  name: string,
  twitch: string,
  discord: string
) {
  prisma.player
    .update({
      where: {
        steam: steamid,
      },
      data: {
        name: name,
        twitch: twitch,
        discord: discord,
      },
    })
    .then(() => {
      return null;
    });
}

export async function post(req) {

}

export async function get(req) {

}