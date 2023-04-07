export interface BeatSaverMetadata {
  bpm: number;
  duration: number;
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
}

export async function getBeatSaverMeta(hash: string | undefined): Promise<BeatSaverMetadata | undefined> {
  if (hash === undefined) return;
  const res = await fetch("https://api.beatsaver.com/maps/hash/" + hash);
  let json = await res.json();
  return <BeatSaverMetadata> json.metadata;
}
