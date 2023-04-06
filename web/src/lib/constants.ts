import { GraphQLClient } from "graphql-request";
// glob.py

export const GameDifficulty = ["Easy", "Normal", "Hard", "Expert", "Expert+"];
export const scenes = [
  {
    name: "Starting Soon",
    id: "starting-soon",
  },
  {
    name: "Stream Ending",
    id: "stream-ending",
  },
  {
    name: "2v2 Match",
    id: "2v2",
  },
  {
    name: "Pre 1v1",
    id: "pre-1v1",
  }
];

export const settings = [
  {
    name: "Players",
    id: "players"
  },
  {
    name: "Teams",
    id: "teams"
  }
];

export const subScenes = [
  {
    name: "Match",
    id: "match"
  }
]

export const GQL = new GraphQLClient("https://api.magnesium.gg/graphql", {});