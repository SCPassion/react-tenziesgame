import React from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function () {
    const timeRequired = 120
    const [diceState, setDiceState] = React.useState(() => generateRandomNumbers())
    const [rollCount, setRollCount] = React.useState(0)
    const [hasInteracted, setHasinteracted] = React.useState(false)

    const [seconds, setSeconds] = React.useState(timeRequired)
    const intervalHandlerRef = React.useRef(null)
    const ref = React.useRef(null)

    const isWinning = diceState.every(dice => dice.isHeld && dice.number === diceState[0].number)
    const gameOver = seconds <= 0 || isWinning

    React.useEffect(() => {
        if (!gameOver) {
            intervalHandlerRef.current = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1)
            }, 1000)
        }
        return () => {
            clearInterval(intervalHandlerRef.current)
        }
    }, [gameOver])

    if (hasInteracted && seconds <= 0) {
        new Audio('/losing.wav').play()
    }

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
        const winningAudio = new Audio("/winning.wav")
        winningAudio.play()
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
        const clickAudio = new Audio('/click.wav')
        clickAudio.play()
        setHasinteracted(true)
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
        if (!isWinning && !gameOver) {
            setRollCount(prevCount => prevCount + 1)
            setDiceState(prevState => prevState.map(dice =>
                dice.isHeld ?
                    dice : { ...dice, number: Math.floor(Math.random() * 10 + 1) }
            ))
        } else {
            setRollCount(0)
            setSeconds(timeRequired)
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
            >{(isWinning || gameOver) ? "New Game!" : "Roll"}
            </button>
            <section className="section-stats">
                <p>Count: <span>{rollCount}</span></p>
                <p>Time in seconds: <span>{seconds}</span></p>
            </section>
            {isWinning && <Confetti />}
        </main>
    )
}