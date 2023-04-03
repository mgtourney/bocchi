export interface Pool {
    id: string,
    tournamentId: string,
    poolName: string,
    image: string,
    description: string,
    live: boolean,
    is_qualifiers: number,
    songs: BkSong[]
}

export interface BkSong {
    id: number,
    hash: string,
    name: string,
    songAuthor: string,
    levelAuthor: string,
    diff: string,
    key: string,
    ssLink: string,
    numNotes: number,
    team: number | undefined,
    banned: boolean | undefined
}

export async function getPool(tournyId: string): Promise<Pool[]> {
    const res = await fetch(`https://beatkhana.com/api/tournament/${tournyId}/map-pools`);
    let json = await res.json()
    let pools: Pool[] = []
    for (var key in json) {
        pools.push(<Pool> json[key])
    }
    return pools
}