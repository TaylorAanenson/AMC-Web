const initialState = {
    user_info: [],
    user_crypto: [],
    transactions: [],
    loading: false,
    error: null
  };
  
  export default function userInfoReducer(state = initialState, action) {
    switch(action.type) {
      case "FETCH_USER_BEGIN":
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
          ...state,
          loading: true,
          error: null
        };
  
      case "FETCH_USER_SUCCESS":
        // All done: set loading "false".
        // Also, replace the items with the ones from the server
       console.log("User has successfully called!")
       console.log(action);
        return {
          ...state,
          loading: false,
          user_info: action.payload.user_info,
          user_crypto: action.payload.user_crypto,
          transactions: action.payload.transactions
        };
  
      case "FETCH_USER_FAILURE":
        // The request failed, but it did stop, so set loading to "false".
        // Save the error, and we can display it somewhere
        // Since it failed, we don't have items to display anymore, so set it empty.
        // This is up to you and your app though: maybe you want to keep the items
        // around! Do whatever seems right.
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          user_info: [],
          user_crypto: [],
          transactions: [],
        };
  
      default:
        // ALWAYS have a default case in a reducer
        return state;
    }
  }