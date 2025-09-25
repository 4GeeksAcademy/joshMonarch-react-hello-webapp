import { useNavigate } from "react-router-dom";
import  logo  from "../assets/img/starWars_logo.png";
import { useContext } from "react";
import { StoreContext } from "./Contexts/StoreProvider";

export const Card = ({item}) => {
    const {favs, toggleFav} = useContext(StoreContext);
    const navigate = useNavigate();
    const isFav = favs.some(fav => fav._id === item._id);

    const favHandler = (e) => {
        e.stopPropagation();
        toggleFav(item);
    }

    return (
        <div className="card" onClick={() => navigate("../details", {state: {cardItem: item}})}>
            <button className="position-absolute float-left border-0 bg-transparent" onClick={favHandler}>
                <i className={isFav ? "bi bi-heart-fill" : "bi bi-heart"}></i>
            </button>
            <img src={logo} className="card-img-top border-bottom" alt="Item img" />
            <div className="card-body">
                <h6 className="text-truncate card-title m-0">{(item.properties.title ?? item.properties.name)}</h6>
            </div>
        </div>
    )
}