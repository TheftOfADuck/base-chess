const {DeleteItemCommand, PutItemCommand} = require("@aws-sdk/client-dynamodb")
const {marshall} = require("@aws-sdk/util-dynamodb")
const randomWords = require("random-words")

const {ValidMovesHelper} = require("shared/src/validMovesHelper.js")
const {gamesTableName, privateQueueTableName, publicQueueTableName} = require("shared/src/constants.js")
const {dynamodbClient} = require("./aws_clients");


async function queueNewGame(playerId, allowWhiteOpponents, allowBlackOpponents, isPrivate) {
    const queueTable = isPrivate ? privateQueueTableName : publicQueueTableName

    let newGameId = randomWords({exactly: 5, join: "-"})
    console.log("Generated gameId:", newGameId)

    let newQueueItem = {
        startTime: new Date().toISOString(),
        gameId: newGameId,
        allowWhite: allowWhiteOpponents,
        allowBlack: allowBlackOpponents,
        firstPlayerId: playerId
    }

    // TODO - Test how dynamoDB handles the rare cases of PK clashes, and write code to retry
    await dynamodbClient.send(new PutItemCommand({
        TableName: queueTable,
        Item: marshall(newQueueItem)
    }))

    return newGameId
}

async function startQueuedGame(secondPlayerId, playerColour, queuedItem, isPrivate) {
    const queueTable = isPrivate ? privateQueueTableName : publicQueueTableName

    // Decide how to assign the white and black colours
    let playerConfig = {white: null, black: null}

    if (!(queuedItem.allowWhite && queuedItem.allowBlack)) { // A preference exists on the queue, fulfill it
        playerConfig.white = queuedItem.allowWhite ? secondPlayerId : queuedItem.firstPlayerId
        playerConfig.black = queuedItem.allowBlack ? secondPlayerId : queuedItem.firstPlayerId
    } else if (playerColour !== "either") { // A preference exists from the second player, fulfill it
        playerConfig.white = playerColour === "white" ? secondPlayerId: queuedItem.firstPlayerId
        playerConfig.black = playerColour === "black" ? secondPlayerId: queuedItem.firstPlayerId
    } else { // No preference exists, flip a coin to assign colours
        let coinToss = Math.random() > 0.5
        playerConfig.white = coinToss ? secondPlayerId : queuedItem.firstPlayerId
        playerConfig.black = coinToss ? queuedItem.firstPlayerId : secondPlayerId
    }

    // Create a new game, with the players set accordingly
    let newGame = Object.assign({players: playerConfig}, ValidMovesHelper.defaultServerState)
    newGame.gameId = queuedItem.gameId
    newGame.gameStatus = "started"
    await dynamodbClient.send(new PutItemCommand({
        TableName: gamesTableName,
        Item: marshall(newGame)
    }))

    // Remove this game from the queue
    await dynamodbClient.send(new DeleteItemCommand({
        TableName: queueTable,
        Key: marshall({gameId: queuedItem.gameId})
    }))
    console.log("Joining gameId:", newGame.gameId)
    return newGame.gameId
}

module.exports = {
    queueNewGame: queueNewGame,
    startQueuedGame: startQueuedGame
}
