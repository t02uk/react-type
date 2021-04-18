import React from 'react';
import './App.scss';
import Title from './Title';
import {useSelector} from "react-redux";
import {State} from "./redux/scores";
import Typing from "./Typing";

function App() {

    const phase = useSelector((state: State) => state.phase);
    const view = phase === 'title' ? (<Title/>) :
        phase === 'typing' ? (<Typing startedAt={+new Date()}/>) : null

    return (
        <div className="App">
            {view}
        </div>
    );
}

export default App;
