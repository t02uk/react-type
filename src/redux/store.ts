import { configureStore } from '@reduxjs/toolkit'
import {scoreSlice} from "./scores";

export default configureStore({
    reducer: scoreSlice.reducer,
})