const initialState = {
    items: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REMOVE_ITEMS_FROM_CART':
        return {
          ...state,
          items: state.items.filter(item => !action.payload.includes(item._id)),
        };
      default:
        return state;
    }
  };
  
  
  export default cartReducer;
  