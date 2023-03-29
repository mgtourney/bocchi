import "reflect-metadata"
import { resolvers } from "@generated/type-graphql"
import { buildSchema } from "type-graphql"
import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client';
import Relay from "./Relay";

async function main() {
    const prisma = new PrismaClient();
    const schema = await buildSchema({
        resolvers,
        validate: false,
    })

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res, prisma }),
    })

    const relay = new Relay();

    await server.listen(4000).then(({ url }) => {
        console.log(`🚀 Server ready at: ${url}`)
    })
}

(async () => {
    await main()
})()