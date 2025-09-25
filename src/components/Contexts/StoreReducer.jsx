export const StoreReducer = (state, action) => {
    switch(action.type) {
        case "TOGGLE_FAV": 
            return {...state, items: state.items.map(item => 
                item.uid === action.payload ? item.isFav = !item.isFav : item)};
        case "GET_FAVS": 
            return {...state, items: state.items.filter(item => item.isFav)};
    }
}