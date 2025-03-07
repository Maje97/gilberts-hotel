import { Link } from "react-router-dom";

function Navbar() {
    return (
      <nav className="bg-amber-800 py-1">
        <ul className="flex flex-col justify-center items-center md:flex-row">
          <li className="box-border h-10 w-20 border-2 border-black rounded-md mx-2 text-center text-lg"><Link to="/">Home</Link></li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;