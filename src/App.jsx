import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";

// L'ancienne intro à clic (BoxIntro.jsx) est remplacée par l'ouverture de la
// boîte pilotée au scroll, directement dans Home (voir src/three/ScrollScene.jsx).
// Le fichier BoxIntro.jsx n'est plus utilisé et peut être supprimé.

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nos-box" element={<Catalogue />} />
          <Route path="/nos-box/:id" element={<ProductDetail />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </CartProvider>
  );
}
