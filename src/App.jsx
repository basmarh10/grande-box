import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import IntroBalloons from "./components/IntroBalloons";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";

// Intro « grands ballons » (IntroBalloons.jsx) : jouée une seule fois par
// navigateur (localStorage), forçable avec ?intro=1 pour la QA.
// L'ancien BoxIntro.jsx (Framer Motion) n'est plus utilisé : à supprimer,
// avec src/components/Balloon.jsx que lui seul importait.

export default function App() {
  return (
    <CartProvider>
      <IntroBalloons />
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
