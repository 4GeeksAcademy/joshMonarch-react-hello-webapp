import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext();

const initialState = (key) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
const saveInLocalStorage = (data, key) => localStorage.setItem(key, JSON.stringify(data));

export const StoreProvider = ({children}) => {

    const [favs, setFavs] = useState(initialState("favs"));

    useEffect(() => {
        saveInLocalStorage(favs, "favs");
    }, [favs]);

    const toggleFav= (item) => {
        setFavs((prev) => {
        const exists = prev.find(fav => fav._id === item._id);
        if (exists) {
            return prev.filter(fav => fav._id !== item._id); 
        } else {
            return [...prev, item];
        }
        });
    };

    return (
        <StoreContext.Provider value={{favs, toggleFav}}> 
            {children}
        </StoreContext.Provider>
    )
}