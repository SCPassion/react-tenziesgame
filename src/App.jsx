import React from 'react';
import { nanoid } from 'nanoid';

export default function () {
    const [diceState, setDiceState] = React.useState(() => generateRandomNumbers())

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
            >
                {dice.number}
            </button>
        )
    }
    )

    function handleDiceClick(id) {
        setDiceState(prevState =>
            prevState.map(dice =>
                dice.id === id ?
                    {
                        ...dice,
                        isHeld: !dice.isHeld
                    } : dice
            ))
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

    return (
        <main>
            <header>
                <h1>Tenzies</h1>
                <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            </header>
            <section className="section-dice">
                {diceElements}
            </section>
            <button className="btn-roll">Roll</button>
        </main>
    )
}