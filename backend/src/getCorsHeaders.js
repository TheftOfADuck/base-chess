function getCorsHeaders(origin) {
    const allowedOrigins = [
        "http://base-chess.theftofaduck.com",  // Official UI
        "http://localhost:3000" // Allow development by 3rd party integrators
    ]

    return allowedOrigins.includes(origin) ? {'Access-Control-Allow-Origin': origin} : {}
}

module.exports = getCorsHeaders
