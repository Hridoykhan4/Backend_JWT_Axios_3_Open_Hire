import { Outlet, useNavigation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { state } = useNavigation();
  return (
    <>
      <header className="bg-base-100/10 shadow-sm">
        <Navbar></Navbar>
      </header>

      <main className="min-h-[calc(100vh-303px)]">
        {state === "loading" ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <Outlet></Outlet>
        )}
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
}

export default App;
