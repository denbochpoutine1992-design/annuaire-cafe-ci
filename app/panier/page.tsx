import NavBar from "@/components/NavBar";
import CartView from "@/components/CartView";

export const metadata = {
  title: "Mon panier",
};

// Page serveur : NavBar utilise la session (cookies), donc elle ne peut pas
// être importée depuis un composant client. Le panier lui-même est dans CartView.
export default function PanierPage() {
  return (
    <>
      <NavBar />
      <CartView />
    </>
  );
}
