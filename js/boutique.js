import { 
    getProduits,
    ajouterFavori,
    ajouterAuPanier
} from "./supabase.js";

// ===============================
// ÉLÉMENTS DU DOM
// ===============================
const zoneProduits = document.getElementById("boutique-produits");
const rechercheInput = document.getElementById("search");
const boutonsCategories = document.querySelectorAll(".categories button");

let produits = [];
let produitsFiltres = [];

// ===============================
// AFFICHAGE DES PRODUITS
// ===============================
function afficherProduits(liste) {
    if (!zoneProduits) return;
    
    zoneProduits.innerHTML = "";

    if (!liste || liste.length === 0) {
        zoneProduits.innerHTML = `<p class="no-products">Aucun bijou trouvé.</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();

    liste.forEach((produit) => {
        const carte = document.createElement("div");
        carte.className = "product-card";
        
        const imageSrc = produit.image_url || produit.image || "images/default.jpg";
        const nomProduit = produit.nom || "Bijou KEO";
        const prixProduit = produit.prix ? produit.prix.toLocaleString() : "0";
        const stockProduit = produit.stock ?? 0;

        carte.innerHTML = `
            <img src="${imageSrc}" alt="${nomProduit}">
            <h3>${nomProduit}</h3>
            <p class="price">${prixProduit} FCFA</p>
            <p class="stock">Stock : ${stockProduit}</p>
            <div class="product-actions">
                <button class="btn-favori" data-id="${produit.id}">❤️</button>
                <button class="btn-panier" data-id="${produit.id}">Ajouter au panier</button>
            </div>
        `;

        fragment.appendChild(carte);
    });

    zoneProduits.appendChild(fragment);
}

// ===============================
// CHARGEMENT SUPABASE
// ===============================
async function chargerProduits() {
    if (!zoneProduits) return;

    zoneProduits.innerHTML = `<p class="loading">Chargement des bijoux...</p>`;

    try {
        produits = await getProduits() || [];
        produitsFiltres = [...produits];
        afficherProduits(produitsFiltres);
    } catch (erreur) {
        console.error("Erreur Supabase :", erreur);
        zoneProduits.innerHTML = `<p class="error">Impossible de charger la collection pour le moment.</p>`;
    }
}

// ===============================
// GESTION DES INTERACTIONS (Délégation d'événements)
// ===============================
if (zoneProduits) {
    zoneProduits.addEventListener("click", (e) => {
        const target = e.target;
        const btnFavori = target.closest(".btn-favori");
        const btnPanier = target.closest(".btn-panier");

        if (btnFavori) {
            const id = btnFavori.dataset.id;
            const produit = produits.find(p => String(p.id) === String(id));
            if (produit) {
                ajouterFavori(produit);
                alert("Ajouté aux favoris ❤️");
            }
        }

        if (btnPanier) {
            const id = btnPanier.dataset.id;
            const produit = produits.find(p => String(p.id) === String(id));
            if (produit) {
                ajouterAuPanier(produit);
                alert("Ajouté au panier 🛒");
            }
        }
    });
}

// ===============================
// RECHERCHE INSTANTANÉE
// ===============================
if (rechercheInput) {
    rechercheInput.addEventListener("input", () => {
        const texte = rechercheInput.value.toLowerCase().trim();

        produitsFiltres = produits.filter((produit) =>
            produit.nom && produit.nom.toLowerCase().includes(texte)
        );

        afficherProduits(produitsFiltres);
    });
}

// ===============================
// FILTRE PAR CATÉGORIES
// ===============================
boutonsCategories.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        boutonsCategories.forEach(b => b.classList.remove("active"));
        bouton.classList.add("active");

        const categorie = bouton.dataset.cat;

        if (!categorie || categorie === "Tous") {
            produitsFiltres = [...produits];
        } else {
            produitsFiltres = produits.filter(
                (produit) => produit.categorie === categorie
            );
        }

        afficherProduits(produitsFiltres);
    });
});

// Initialisation
chargerProduits();
