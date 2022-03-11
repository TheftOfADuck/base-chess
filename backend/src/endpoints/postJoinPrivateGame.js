import {startQueuedGame} from "../shared/gameHelper.js";
import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

export async function lambdaHandler(event) {
    let gameId = event.pathParameters.gameId
    let requestBody = JSON.parse(event.body)
    let response = await postJoinPrivateGame(requestBody.playerId, requestBody.playerColour, gameId)
    return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.responseBody),
    };
}

export async function postJoinPrivateGame(secondPlayerId, playerColour, gameId) {
    const client = new DynamoDBClient({region: "eu-west-2"})
    const queueTable = "merge-chess-private-queue"

    let getResults = await client.send(new GetItemCommand({
        TableName: queueTable,
        Key: marshall({gameId: gameId})
    }))
    let queueItem = unmarshall(getResults.Item)
    await startQueuedGame(secondPlayerId, playerColour, queueItem, true)
    return {
        statusCode: 200,
        responseBody: {gameId: gameId}
    }
}
