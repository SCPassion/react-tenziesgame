import React from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function () {
    const [diceState, setDiceState] = React.useState(() => generateRandomNumbers())
    const ref = React.useRef(null)
    const audio = new Audio('../public/click.wav')

    const isWinning = diceState.every(dice => dice.isHeld && dice.number === diceState[0].number)

    const diceElements = diceState.map(dice => {
        const style = {
            backgroundColor: dice.isHeld ? "#59E391" : "#FFFFFF"
        }
        return (
            <button
                key={dice.id}
                style={style}
                className="dice"
                onClick={() => handleDiceClick(dice.id)}
                disabled={isWinning}
            >
                {dice.number}
            </button>
        )
    })


    if (isWinning && ref.current !== null) {
        ref.current.focus()
    }

    function generateRandomNumbers() {
        return new Array(10).fill(0).map(() => (
            {
                number: Math.floor(Math.random() * 10) + 1,
                id: nanoid(),
                isHeld: false
            }
        ))
    }

    function handleDiceClick(id) {
        audio.play()
        setDiceState(prevState =>
            prevState.map(dice =>
                dice.id === id ?
                    {
                        ...dice,
                        isHeld: !dice.isHeld
                    } : dice
            ))
    }

    function handleRoll() {
        if (!isWinning) {
            setDiceState(prevState => prevState.map(dice =>
                dice.isHeld ?
                    dice : { ...dice, number: Math.floor(Math.random() * 10 + 1) }
            ))
        } else {
            setDiceState(generateRandomNumbers())
        }
    }

    return (
        <main>
            <header>
                <h1>Tenzies</h1>
                <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            </header>
            <section className="section-dice">
                {diceElements}
            </section>
            <button
                onClick={handleRoll}
                className="btn-roll"
                ref={ref}
            >{isWinning ? "New Game!" : "Roll"}
            </button>
            {isWinning && <Confetti />}
        </main>
    )
}