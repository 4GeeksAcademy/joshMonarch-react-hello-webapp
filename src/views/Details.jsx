import { useLocation } from "react-router-dom";
import  logo  from "../assets/img/starWars_logo.png"
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { StoreContext } from "../components/Contexts/StoreProvider";

const initialState = (key) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
const saveInLocalStorage = (data, key) => localStorage.setItem(key, JSON.stringify(data));

export const Details = () => {
    const location = useLocation();
    const item = location.state?.cardItem;
    const [details, setDetails] = useState(initialState(`details_${item._id}`));
    const [loading, setLoading] = useState(false);
    const columns = ["vehicles", "starships", "planets", "films", "homeworld", "characters", "species", "pilots"];
    const excluded = ["edited", "created", "url", "name", "title", "episode_id", "opening_crawl"]
    const {favs, toggleFav} = useContext(StoreContext);
    const isFav = favs.some(fav => fav._id === item._id);

    const favHandler = (e) => {
        e.stopPropagation();
        toggleFav(item);
    }
    
    const getDetails = async (props) => {
        try {
            setLoading(true);

            if(Object.keys(details).length > 0) {
                setLoading(false);
                return;
            }

            for(const prop in props) {
                if(typeof props[prop] === "string") props[prop] = [props[prop]];
    
                const responses = await Promise.all(props[prop].map(uri => fetch(uri)));
                const data = await Promise.all(responses.map(resp => resp.json()));
                props[prop] = data;
            }

            console.log("props: ", props)
            setDetails(props);
            setLoading(false);
            
        } catch (error) {
            console.error("Some error while fetching details: ", error);
        }
    }

    const nestedURIs = Object.fromEntries(
        Object.entries(item.properties)
        .filter(([key]) => columns.includes(key))
    );

    useEffect(() => {        
        getDetails(nestedURIs);
    }, [])

    useEffect(() => {
        saveInLocalStorage(details, `details_${item._id}`);
    }, [details, item._id])

    if(loading) {
        return (
            <div className="vh-100 vw-100">
                <Spinner 
                    className="position-absolute start-50 top-50 translation-middle" 
                    animation="border" 
                    variant="primary"
                />
            </div>
        );
    } else {
        return (
        <div className="container h-100 py-3">
            <div className="row h-50">
                <div className="col h-100">
                    <div className="card w-100 h-100">
                        <div className="row g-0 h-100">
                            <div className="col-md-8 h-100 border-end">
                            <button 
                                className="position-absolute float-left border-0 bg-transparent fs-2 ms-2 mt-2" 
                                onClick={favHandler}>
                                    <i className={isFav ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                            </button>
                                <img src={logo} className="d-block mx-auto h-100 object-fit-cover" alt="img" />
                            </div>
                            <div className="col-md-4">
                                <div className="card-body">
                                    <h5 className="card-title">{item.properties.name ?? item.properties.title}</h5>
                                    <p className="card-text">{item.description ?? item.properties.opening_crawl}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row h-50 overflow-auto">
                <div className="col h-100">
                    <table className="table m-0 h-100">
                        <thead>
                            <tr>
                                {
                                    Object.keys(item.properties).map((col, i) => {
                                        console.log(col)
                                        if(!excluded.includes(col)){
                                            return <th key={i} className="text-uppercase">{col}</th>
                                        } 
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {
                                    Object.entries(item.properties).map(([itemKey, itemValue], i) => {
                                        console.log("item key and value: ", itemKey, itemValue, itemValue.length);
                                        if(!excluded.includes(itemKey)){
                                            if(columns.includes(itemKey)){
                                                return (
                                                    <td className="text-nowrap" key={i}>
                                                        {
                                                            details[itemKey]?.length === 0 ? <p>{"n/a"}</p> :
                                                            details[itemKey]?.map((value, j) => {
                                                                if(itemValue.length === 0) {
                                                                    return <p key={j}>{"n/a"}</p>
                                                                } else {
                                                                    return <p key={j}>{value.result.properties.title ?? value.result.properties.name}</p>
                                                                }
                                                            })
                                                        }
                                                    </td>
                                                )
                                            }
                                            return <td key={i}>{itemValue}</td>
                                        } 
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    }

    
}