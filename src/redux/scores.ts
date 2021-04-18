import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type Phase = "title" | "typing";

export type State = {
    elapsedTimes: Array<number>
    phase: Phase
};

const initialState: State = {
    elapsedTimes: [],
    phase: "title"

}

export const scoreSlice = createSlice({
    name: 'score',
    initialState: initialState,
    reducers: {
        addElapsedTime: (state: State, action: PayloadAction<number>): State => {
            const elapsedTimes = [action.payload, ...state.elapsedTimes];
            elapsedTimes.sort((lhs, rhs) => lhs - rhs);
            return {
                ...state,
                elapsedTimes,
            }
        },
        switchPhase: (state: State, {payload: phase}: PayloadAction<Phase>): State => {
            return {
                ...state,
                phase
            }
        }
    },
})

export const {
    addElapsedTime,
    switchPhase
} = scoreSlice.actions

export default scoreSlice.reducer