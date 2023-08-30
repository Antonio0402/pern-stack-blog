import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorCallback";

const Layout = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={["layout"]}>
      <Navbar />
      <Outlet />
      <Footer />
    </ErrorBoundary>
  );
};

export default Layout;
