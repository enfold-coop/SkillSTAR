// import {
//     ADD_SESSION_LOADING,
//     ADD_SESSION_SUCCESS,
//     ADD_SESSION_ERROR
// } from "../../constants/action_types"
// import {session} from "../initial_states/initialSession"

// const sessions = (state, { payload, type }) => {
//     switch (type) {
//       case ADD_SESSION_LOADING: {
//         return {
//           ...state,
//           sessions: {
//             ...state.session,
//             loading: true,
//           },
//         };
//       }
//       case ADD_SESSION_SUCCESS: {
//         return {
//           ...state,
//           sessions: {
//             ...state.session,
//             loading: false,
//             session
//           },
//         };
//       }
//       case ADD_SESSION_ERROR: {
//         return {
//           ...state,
//           sessions: {
//             ...state.session,
//             loading: false,
//           },
//         };
//       }
//     }
