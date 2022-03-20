const appName = "base-chess"
const stage = process.env.STAGE_NAME || "dev"

module.exports.appName = appName
module.exports.gamesTableName = `${appName}-${stage}-games`
module.exports.publicQueueTableName = `${appName}-${stage}-public-queue`
module.exports.privateQueueTableName = `${appName}-${stage}-private-queue`
