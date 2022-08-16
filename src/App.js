import React from 'react'
import './style.css'
import Die from './components/Die'
import Counter from './components/Counter'
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

export default function App() {
    let cookie = document.cookie ? document.cookie.split('=')[1] : 0;
    const [dice, setDice] = React.useState(() => allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [timer, setTimer] = React.useState(20)
    const [lost, setLost] = React.useState(false)
    const [highScore, setHighScore] = React.useState(cookie);


    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const sameValue = dice.every(die => die.value === dice[0].value)

        if (sameValue && allHeld) {
            setTenzies(true)
            if (timer > highScore) {
                document.cookie = `score=${timer}`;
                setHighScore(timer);
            }
        }
    }, [dice])

    React.useEffect(() => {
        const countdown = setInterval(function () {
            if (timer > 0) setTimer(prevTimer => prevTimer - 1)
        }, 1000)
        return () => clearInterval(countdown)
    }, [])

    React.useEffect(() => {
        if (timer < 0 && !tenzies) setLost(true)
    }, [timer])

    function generateNewDice() {
        return {
            "value": Math.floor(Math.random() * 6) + 1,
            "isHeld": false,
            "id": nanoid()
        }
    }

    function newGame() {
        document.querySelector('.timer').style.display = 'block';
        setDice(allNewDice())
        setTenzies(false)
        setLost(false)
        setTimer(20)
    }

    function allNewDice() {
        const dieArr = []
        for (let i = 0; i < 10; i++) {
            dieArr.push(generateNewDice())
        }
        return dieArr

    }

    function rollDice() {
        setDice(oldDice => oldDice.map(dice => {
            return (dice.isHeld ? dice : generateNewDice()
            )
        }))
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(item => {
            return (
                item.id === id ? { ...item, isHeld: !item.isHeld } : item
            )
        }))
    }



    const diceElements = dice.map(die =>
        <Die
            value={die.value}
            key={die.id}
            id={die.id}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    )

    return (
        <main>
            <h1 className='title'>Tenzies</h1>
            {highScore !== 0 && <h4 className="highscore"> High-score: {highScore} </h4>
            }
            <Counter
                timer={timer}
                lost={lost}
                tenzies={tenzies}

            />
            {tenzies && <Confetti />}
            {!tenzies ?
                <p className='description'>
                    Roll until all dice are the same. Click each die to freeze it at its current value  between rolls.
                </p>
                :
                <p className="winnerText"> You got Tenzies </p>}
            <section className="dieContainer">
                {diceElements}
            </section>
            {tenzies || lost ?
                <button className="resetButton" onClick={newGame}>New Game</button>
                :
                <button className="rollButton" onClick={rollDice}>Roll</button>

            }
        </main>
    )
}