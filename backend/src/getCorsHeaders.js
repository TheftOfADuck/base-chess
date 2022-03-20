function getCorsHeaders(origin) {
    const allowedOrigins = [
        // TODO - Make work dynamically with staging environments.
        "http://base-chess-prod.theftofaduck.com",  // Official UI
        "http://base-chess-test.theftofaduck.com",  // Test Stage environment
        "http://localhost:3000" // Allow development by 3rd party integrators
    ]

    return allowedOrigins.includes(origin) ? {'Access-Control-Allow-Origin': origin} : {}
}

module.exports = getCorsHeaders
