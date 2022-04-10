const {ScanCommand, DeleteItemCommand} = require("@aws-sdk/client-dynamodb")
const {unmarshall, marshall} = require("@aws-sdk/util-dynamodb")

const {publicQueueTableName} = require("shared/src/constants.js")
const {dynamodbClient} = require("../aws_clients");

async function lambdaHandler(event) {
    console.log("Starting Teardown:", event.time)
    let scanResults = await dynamodbClient.send(new ScanCommand({TableName: publicQueueTableName}))
    let nowTimestamp = new Date().getTime()

    for (let queuedGame of scanResults.Items) {
        queuedGame = unmarshall(queuedGame)
        let gameStart = new Date(queuedGame.startTime)
        let timeDiffMinutes = (nowTimestamp - gameStart.getTime()) / (1000 * 60)
        if (timeDiffMinutes > 5) {
            console.log('Deleting queued game:', queuedGame)
            dynamodbClient.send(new DeleteItemCommand({
                    TableName: publicQueueTableName,
                    Key: marshall({gameId: queuedGame.gameId})
                }
            ))
        }
    }
}

module.exports = {
    lambdaHandler: lambdaHandler
}
