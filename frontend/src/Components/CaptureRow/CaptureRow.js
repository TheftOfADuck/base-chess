import React from "react"

import Square from "../Square/Square.js"


class CaptureRow extends React.Component {

    render() {
        // console.log("RENDER: CaptureRow", this.props)
        // TODO - Order these based on piece value, not order of capture
        return (
            <div className="CaptureRow">
                {this.props.capturedPieces.map((x, i) => <Square key={i} piece={x} squareType="Capture"/>)}
            </div>
        )
    }
}

export default CaptureRow
