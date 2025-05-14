import { createSlice } from "@reduxjs/toolkit";
const initialState={
    mode:'light'
}
const themeSlice=createSlice({
    name:'themeSlice',
    initialState,
    reducers:{
     changeTheme:(state)=>{
        state.mode = state.mode =='light' ?'dark':'light'
     }  
    }
})
export const {changeTheme}=themeSlice.actions
export default themeSlice.reducer