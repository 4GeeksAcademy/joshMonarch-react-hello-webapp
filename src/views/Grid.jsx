import { useEffect, useState } from "react"
import { Card } from "../components/Card";
import { Spinner } from "react-bootstrap";

const initialState = (key) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
const saveInLocalStorage = (data, key) => localStorage.setItem(key, JSON.stringify(data));

export const Grid = () => {
    const URI = "https://www.swapi.tech/api";
    const [items , setItems] = useState(initialState("items"));
    const [category, setCategory] = useState("films");
    const [loading , setLoading] = useState(true);

    const getURIs = async (URI) => {
        try {
            const resp = await fetch(URI);
            console.log("Get URIs response: ", resp.ok, resp.status);
            const data = await resp.json();
            console.log("Get URIs data: ", data);
            return data.result;
        } catch (error) {
            console.log("Some error while getting the URIs from ", URI);
            console.log(error);
        }
    }

    useEffect(() => {
        setLoading(true);

        const savedItems = localStorage.getItem("items");
        if(savedItems) {
            setItems(JSON.parse(savedItems));
            setLoading(false);
            return;
        }

        getURIs(URI).then(URIs => {
            console.log("URIs: ", URIs);
            return Promise.all(Object.values(URIs).map(uri => fetch(`${uri}/?expanded=true`)))
        })
        .then(responses => {
            console.log("Promises responses: ", responses);
            return Promise.all(responses.map(resp => resp.json()))
        })
        .then(data => {
            console.log("promises data: ", data);
            let obj = {
                people:    [data[1]],
                planets:   [data[2]],
                vehicles:  [data[5]],
            }
            setItems(obj);
            setLoading(false);
        })
        .catch(error => console.log(error));

    }, []);

    useEffect(() => {
        saveInLocalStorage(items, "items");
    }, [items])

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
            <div className="container vh-100 mt-3">
                <div className="row overflow-auto" style={{height: "29rem"}}>
                    <div className="col-2">
                        <div className="border-end h-100 w-100 d-flex justify-content-center">
                            <div className="btn-group flex-column h-100 justify-content-evenly ">
                                <button onClick={() => setCategory("people")}>People</button>
                                <button onClick={() => setCategory("planets")}>Planets</button>
                                <button onClick={() => setCategory("vehicles")}>Vehicles</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-10">
                        <div className="container">
                            <div className="row">
                            {
                                items[category] &&
                                items[category].map(item => 
                                    (item.result ?? item.results)?.map((item, i) => (
                                        <div key={i} className="col-2 mb-3">
                                            <Card item={item} />
                                        </div>
                                    ))
                                )
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}