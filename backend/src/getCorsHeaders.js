function getCorsHeaders(origin) {
    const allowedOrigins = [
        process.env.CORS_ALLOWED_ORIGIN,
        "http://localhost:3000" // Always allow localhost, for third parties to develop against
    ]

    return allowedOrigins.includes(origin) ? {'Access-Control-Allow-Origin': origin} : {}
}

module.exports = getCorsHeaders
