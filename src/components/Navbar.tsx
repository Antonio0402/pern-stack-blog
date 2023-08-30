import { Link } from "react-router-dom";
import { Suspense } from "react";
import Profile from "./Profile";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorCallback";

const Navbar = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link to="/">
            <img src="porfolio_logo.jpg" alt="blog logo" />
          </Link>
        </div>
        <nav aria-label="primary navigation" className="header__nav">
          <Link className="color-gray-300" to="/?cate=art">
            <h6 className="text-400 fw-normal">ART</h6>
          </Link>
          <Link className="color-gray-300" to="/?cate=science">
            <h6 className="text-400 fw-normal">SCIENCE</h6>
          </Link>
          <Link className="color-gray-300" to="/?cate=technology">
            <h6 className="text-400 fw-normal">TECHNOLOGY</h6>
          </Link>
          <Link className="color-gray-300" to="/?cate=cinema">
            <h6 className="text-400 fw-normal">CINEMA</h6>
          </Link>
          <Link className="color-gray-300" to="/?cate=design">
            <h6 className="text-400 fw-normal">DESIGN</h6>
          </Link>
          <Link className="color-gray-300" to="/?cate=food">
            <h6 className="text-400 fw-normal">FOOD</h6>
          </Link>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            resetKeys={["profile"]}
          >
            <Suspense fallback={<p>Loading...</p>}>
              <Profile />
            </Suspense>
          </ErrorBoundary>
          <span className="btn" data-style="create">
            <Link className="color-gray-300" to="/create">
              New blog
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
