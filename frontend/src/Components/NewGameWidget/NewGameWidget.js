import React from "react"

import "./NewGameWidget.css"

class NewGameWidget extends React.Component {

    queueGame = (event) => {
        event.preventDefault()
        let colourChoice = [...event.target].filter(x => x.name === "colour").filter(x => x.checked)[0].value
        let privateGame = [...event.target].filter(x => x.name === "privateGame")[0].checked

        if (privateGame) {
            this.props.createPrivateGame(colourChoice)
        } else {
            this.props.joinPublicGame(colourChoice)
        }
    }

    joinPrivateGame = (event) => {
        event.preventDefault()
        let colourChoice = [...event.target].filter(x => x.name === "colour").filter(x => x.checked)[0].value
        let gameId = [...event.target].filter(x => x.id === "gameId")[0].value
        this.props.joinPrivateGame(colourChoice, gameId)
    }

    render() {
        console.log("RENDER: NewGameWidget", this.props)

        return (
            <>
                {this.props.gameId && !this.props.checkmate ?
                    <>
                        <p><strong>Game ID:</strong> {this.props.gameId}</p>
                        {/* TODO - Waiting for second player*/}
                        <p><button onClick={this.props.resetGame}>Start new game</button></p>
                    </> :
                    <>
                        <div className="NewGameOption">
                            <h3>Join Public Game</h3>
                            <form onSubmit={this.queueGame}>
                                <p>I play as:</p>
                                <input type="radio" value="either" name="colour" defaultChecked/>Either<br/>
                                <input type="radio" value="white" name="colour"/>White<br/>
                                <input type="radio" value="black" name="colour"/>Black<br/><br/>
                                <input type="checkbox" name="privateGame" hidden />
                                <input type="submit" value="Join"/>
                            </form>
                        </div>
                        <div className="NewGameOption">
                            <h3>Create Private Game</h3>
                            <form onSubmit={this.queueGame}>
                                <p>I play as:</p>
                                <input type="radio" value="either" name="colour" defaultChecked/>Either<br/>
                                <input type="radio" value="white" name="colour"/>White<br/>
                                <input type="radio" value="black" name="colour"/>Black<br/>
                                <input type="checkbox" name="privateGame" hidden checked/>
                                <input type="submit" value="Create"/>
                            </form>
                        </div>
                        <div className="NewGameOption">
                            <h3>Join Private Game</h3>
                            <form onSubmit={this.joinPrivateGame}>
                                <p>I play as:</p>
                                <input type="radio" value="either" name="colour" defaultChecked/>Either<br/>
                                <input type="radio" value="white" name="colour"/>White<br/>
                                <input type="radio" value="black" name="colour"/>Black<br/>
                                <label htmlFor="gameId">Game ID: </label><input id="gameId"/><br/>
                                <input type="submit" value="Join"/>
                            </form>
                        </div>
                    </>
                }
            </>
        )
    }

}

export default NewGameWidget
