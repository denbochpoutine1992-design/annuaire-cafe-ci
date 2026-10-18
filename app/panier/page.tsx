import NavBar from "@/components/NavBar";
import CartView from "@/components/CartView";
import { getAvailableMethods } from "@/lib/payment";

// Les moyens de paiement dépendent des variables Vercel : on les lit à chaque visite.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mon panier",
};

// Page serveur : NavBar utilise la session (cookies), donc elle ne peut pas
// être importée depuis un composant client. Le panier lui-même est dans CartView.
export default function PanierPage() {
  // Seuls l'identifiant et le nom des moyens sont transmis : jamais les numéros.
  const methods = getAvailableMethods();

  return (
    <>
      <NavBar />
      <CartView methods={methods} />
    </>
  );
}
