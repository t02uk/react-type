import React, {useCallback, useEffect, useState} from "react";
import "./Typing.scss"
import {CSSTransitionGroup} from "react-transition-group";
import {useDispatch} from "react-redux";
import {addElapsedTime, switchPhase} from "./redux/scores";

type KeyMatcherResult = {
    inputtedSentence: string,
    allMatched: boolean,
    isCorrect: boolean
    incorrectCount: number
}

const useKeyMatcher = (expectedSentence: string): KeyMatcherResult => {
    const [inputtedSentence, setInputtedSentence] = useState("");
    const [isCorrect, setIsCorrect] = useState(true);
    const [incorrectCount, setIncorrectCount] = useState(0);
    let cleanedUp = false;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (cleanedUp) return;
        if (expectedSentence.startsWith(inputtedSentence + e.key)) {
            setInputtedSentence(inputtedSentence + e.key);
            setIsCorrect(true);
        } else {
            setIsCorrect(false)
            setIncorrectCount(prevState => prevState + 1);
        }
    }, [inputtedSentence, expectedSentence, cleanedUp]);

    useEffect(() => {
        window.addEventListener("keypress", handleKeyDown);
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            cleanedUp = true;
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [handleKeyDown]);

    const allMatched = expectedSentence === inputtedSentence;
    return {inputtedSentence: inputtedSentence, allMatched, isCorrect, incorrectCount};
};

type TypingProblemProps = {
    expectedSentence: string,
    nextSentence: string,
    onProblemSolved: () => void,
}

const TypingProblem: React.FC<TypingProblemProps> = ({expectedSentence, nextSentence, onProblemSolved}) => {

    const {inputtedSentence, allMatched, isCorrect, incorrectCount} = useKeyMatcher(expectedSentence);

    useEffect(() => {
        if (allMatched) {
            onProblemSolved();
        }
    }, [allMatched]);

    return (
        <>
            <CSSTransitionGroup
                transitionName="incorrect-effect"
                transitionEnter={true}
                transitionEnterTimeout={1}
                transitionLeave={false}
            >
                <span key={incorrectCount}>
                    <CSSTransitionGroup
                        transitionName="hit-effect"
                        transitionEnter={true}
                        transitionEnterTimeout={150}
                        transitionLeave={false}
                    >
                        {inputtedSentence.split("").map((letter, index) => {
                            return <span className="sentence sentence__inputted" key={index}>{letter}</span>
                        })}
                    </CSSTransitionGroup>
                    {expectedSentence.substring((inputtedSentence).length).split("").map((letter, index) => {
                        return <span className="sentence sentence__expected" key={index}>{letter}</span>
                    })};
                    <div style={{"marginTop": "4rem"}}>
                        <span className="sentence--next">next &gt;&gt; </span>
                        {nextSentence.split("").map((letter, index) => {
                            return <span className="sentence sentence--next" key={index}>{letter}</span>
                        })}
                    </div>
                </span>
            </CSSTransitionGroup>
        </>
    );
};

type Props = {
    startedAt: number
}

const Typing: React.FC<Props> = ({startedAt}) => {
    const dispatch = useDispatch();
    const expectedSentences = Object.keys(React);
    const [solvedCount, setSolvedCount] = useState(0);
    const onProblemSolved = useCallback(() => {
        setSolvedCount(prevState => prevState + 1);
    }, [setSolvedCount]);
    const hasSolvedAll = expectedSentences.length === solvedCount;

    useEffect(() => {
        if (hasSolvedAll) {
            const elapsedTime = 0.001 * (+new Date() - startedAt);
            dispatch(addElapsedTime(elapsedTime));
            dispatch(switchPhase("title"));
        }
    });

    return (
        <>
            <CSSTransitionGroup
                transitionName="switch-effect"
                transitionEnter={true}
                transitionEnterTimeout={150}
                transitionLeave={true}
                transitionLeaveTimeout={250}
            >
                {expectedSentences.map((sentence, index) => {
                    if (index === solvedCount) {
                        const expectedSentence = expectedSentences[solvedCount];
                        const nextSentence = expectedSentences.length <= solvedCount + 1 ? "" : expectedSentences[solvedCount + 1];
                        return (
                            <div className={"container"} style={{
                                "padding": "4rem",
                                "position": "absolute",
                                "left": "0px",
                                "right": "0px",
                                "margin": " 10rem auto",
                            }}
                                 key={index}
                            >
                                <TypingProblem expectedSentence={expectedSentence}
                                               nextSentence={nextSentence}
                                               onProblemSolved={onProblemSolved}
                                               key={index}
                                />
                            </div>
                        );
                    } else {
                        return false;
                    }
                })}
            </CSSTransitionGroup>
            <div className={"meter"}
                 style={{"width": `${100.0 * solvedCount / expectedSentences.length}%`}}>
            </div>

        </>
    )
}


export default Typing;