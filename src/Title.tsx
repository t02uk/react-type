import React, {useCallback, useEffect, useState} from "react";
import "./Title.scss";
import {useDispatch, useSelector} from "react-redux";
import {State, switchPhase} from "./redux/scores";

const Title: React.FC = () => {

    const dispatch = useDispatch();
    const [started, setStarted] = useState(false);
    const elapsedTimes = useSelector((state: State) => state.elapsedTimes);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === " ") {
            setStarted(true);
        }
    }, [setStarted]);

    useEffect(() => {
        window.addEventListener("keypress", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [handleKeyDown]);

    if (started) {
        dispatch(switchPhase("typing"));
    }

    return (
        <div>
            <h1 className="title">
                React Type.
            </h1>
            <div className="explanation">
                Hit the <u>spacebar</u> to start typing <span className="cursor">_</span>
            </div>
            <table className={"ranking"}>
                <tbody>
                {Array.from(Array(10)).map((_, rank) => {
                    return (
                        <tr key={rank}>
                            <td style={{"width": "2rem"}}>{rank + 1}</td>
                            <td>{elapsedTimes[rank] ? elapsedTimes[rank].toFixed(3) : "  _.___"} Seconds</td>
                        </tr>);
                })}
                </tbody>
            </table>
        </div>
    );

};

export default Title;