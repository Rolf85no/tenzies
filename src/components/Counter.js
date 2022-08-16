import React from 'react'

export default function Counter(props) {

    const timerStyles = {
        color: props.timer > 5 ? 'green' : 'red',
        fontSize: props.timer > 0 ? `calc(1em + 1vw)` : `calc(1em + 1vw)`,
        display: props.tenzies ? 'none' : 'block'
    }

    return (
        <div className="timer" style={timerStyles}>{props.timer > 0 ? props.timer : `GAME OVER`}</div>
    )
}