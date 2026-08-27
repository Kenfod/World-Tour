import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";

function Homepage() {
  return (
    <div>
      <PageNav />
      <h1>WorldTour</h1>

      <Link to="/pricing">Pricing</Link>
      {/* <a href="/pricing">Pricing</a> */}
    </div>
  );
}

export default Homepage;
