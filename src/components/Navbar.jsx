import { Link } from "react-router-dom";
import  logo  from "../assets/img/starWars_logo.png"
import { useContext } from "react";
import { StoreContext } from "./Contexts/StoreProvider";

export const NavBar = () => {
    const {favs} = useContext(StoreContext);
    
     return (
        <nav className="navbar bg-body-tertiary w-100 p-0">
            <div className="container-fluid px-5">
                <Link className="navbar-brand" to={"/"}>
                    <img src={logo} className="img-fluid" alt="Logo StarWars" height={100} width={100} />
                </Link>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Favourites ({favs.length})
                    </button>
                    <ul className="dropdown-menu">
                        {
                            favs.length !== 0 ?
                            favs.map((item, i) => {
                                console.log("dropdown button: ", item)
                                return <li key={i} className="dropdown-item">{item.properties.name}</li>
                            }) :
                            <li className="dropdown-item">No favs</li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
     );
}