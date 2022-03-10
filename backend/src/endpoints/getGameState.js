import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

export async function lambdaHandler(event) {
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'getGameState', input: event}),
    };
}

export async function getGameState(gameId, playerId) {
    const client = new DynamoDBClient({region: "eu-west-2"})
    let getGameResponse = await client.send(new GetItemCommand({
        TableName: "merge-chess-games",
        Key: marshall({"gameId": gameId})
    }))

    if (!getGameResponse.Item) {
        // See if that game has been queued, but not yet started
        let getPublicQueueResponse = await client.send(new GetItemCommand({
            TableName: "merge-chess-public-queue",
            Key: marshall({"gameId": gameId})
        }))
        let getPrivateQueueResponse = await client.send(new GetItemCommand({
            TableName: "merge-chess-private-queue",
            Key: marshall({"gameId": gameId})
        }))

        if (!getPublicQueueResponse.Item && !getPrivateQueueResponse.Item ) {
            return { // TODO - Figure out how to handle 400 responses in the AWS integration
                statusCode: 400,
                responseBody: {msg: "GameID not found"}
            }
        }

        let game = getPublicQueueResponse.Item ? unmarshall(getPublicQueueResponse.Item) : unmarshall(getPrivateQueueResponse.Item)
        return { // TODO - Figure out how to handle 400 responses in the AWS integration
            statusCode: 200,
            responseBody: {gameId: game.gameId}
        }
    }
    let game = unmarshall(getGameResponse.Item)
    let playerColour = game.players.white === playerId ?  "white" : game.players.black === playerId ? "black" : null
    return {
        statusCode: 200,
        responseBody: {
            gameId: game.gameId,
            gameStatus: game.gameStatus,
            playerColour: playerColour,
            activePieces: game.activePieces,
            turnColour: game.turnColour,
            turnNumber: game.turnNumber,
            checkmate: game.checkmate,
            whiteCaptures: game.whiteCaptures,
            blackCaptures: game.blackCaptures,
            attackedKing: game.attackedKing
        }
    }
}