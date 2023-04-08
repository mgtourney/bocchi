export interface PlayerBadge {
    description: string,
    image: string
}

export interface PlayerScoreStats {
    totalScore: number,
    totalRankedScore: number,
    averageRankedAccuracy: number,
    totalPlayCount: number,
    rankedPlayCount: number,
    replaysWatched: number
}

export interface PlayerInfoFull {
    id: string,
    name: string,
    profilePicture: string,
    country: string,
    pp: number,
    rank: number,
    countryRank: number,
    role: string,
    badges: PlayerBadge[],
    histories: string,
    scoreStats: PlayerScoreStats,
    permissions: number,
    benned: boolean,
    inactive: boolean
}

export async function getPlayerInfoFull(id: String): Promise<PlayerInfoFull> {
    //if (id.length != 17) throw null; // for "legacy" reasons
    const response = await fetch(`https://skillsaber.vercel.app/api/player?id=${id}`);
    return await response.json();
}