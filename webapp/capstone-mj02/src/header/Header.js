import { Navbar } from "../components/Navbar";

function Header(props){
    return (
    <div>
        <Navbar />
        <main>
            {props.children}
        </main>
    </div>);
}

export default Header;