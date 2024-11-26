import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  sender_id:string
  sender_name:string
  receiver_id:string
  receiver_name:string
  user_image:string
}

const initialState: AuthState = {
  isAuthenticated: false,
  sender_id: '',
  sender_name: '',
  receiver_id: '',
  receiver_name: '',
  user_image: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{sender_name: string,sender_id: string,user_image: string}>) => {
      const {sender_name,sender_id,user_image} = action.payload;
      state.sender_name = sender_name;
      state.sender_id=sender_id
      state.isAuthenticated=true;
      state.user_image=user_image;
    },
    logout: (state) => {
      state.sender_id = '';
      state.sender_name = '';
      state.isAuthenticated=false;
    },
    togglemysender:(state,action: PayloadAction<{receiver_id:string,receiver_name:string}>)=>{
        state.receiver_id = action.payload.receiver_id;
        state.receiver_name = action.payload.receiver_name;
    },
    setUserImage:(state,action:PayloadAction<{user_image:string}>)=>{
      console.log("incose the state",action.payload.user_image)
      state.user_image=action.payload.user_image
    }
  },
});

export const { setCredentials, logout,togglemysender,setUserImage } = authSlice.actions;

export default authSlice.reducer;
