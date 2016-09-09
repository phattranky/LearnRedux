//a reducer takes in two things:

//1. the action (info about what happend)
//2. copy of current state

function postComments(state = [], action) {
  console.log('Action', action);
  switch (action.type) {
    case 'ADD_COMMENT':
      console.log('Add Comment', action);
      //return the new state with the new comment
      return [...state, {
        user: action.author,
        text: action.comment
      }];
    case 'REMOVE_COMMENT':
      //We need to return the new state without deleted comment
      return [
        //from the start to the one we want to delete
        ...state.slice(0, action.i),
        //after the deleted one, to the end
        ...state.slice(action.i + 1)
      ]
    default:
      return state;
  }
  return state;
}

function comments(state = [], action) {
  console.log(state, action);
  if (typeof action.postId !== 'undefined') {
    return {
      //take the curren state
      ...state,
      //overwrite this post with a new one
      [action.postId]: postComments(state[action.postId], action)
    }
  }
  return state;
}

export default comments;