import { 
    getProduits, 
    ajouterProduit, 
    supprimerProduit 
} from "./supabase.js";

const formProduit = document.getElementById("form-produit");
const adminProduits = document.getElementById("admin-produits");

// Charger et afficher la liste admin
async function chargerAdmin() {
    adminProduits.innerHTML = "<tr><td colspan='5'>Chargement...</td></tr>";
    const produits = await getProduits() || [];
    
    adminProduits.innerHTML = "";
    
    if (produits.length === 0) {
        adminProduits.innerHTML = "<tr><td colspan='5'>Aucun bijou dans la base.</td></tr>";
        return;
    }

    produits.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${p.image_url || p.image || 'images/default.jpg'}" alt=""></td>
            <td><strong>${p.nom}</strong><br><small>${p.categorie}</small></td>
            <td>${p.prix?.toLocaleString()} FCFA</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn-delete" data-id="${p.id}">Supprimer</button>
            </td>
        `;
        adminProduits.appendChild(tr);
    });
}

// Ajouter un nouveau bijou
formProduit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nouveauProduit = {
        nom: document.getElementById("nom").value.trim(),
        prix: Number(document.getElementById("prix").value),
        categorie: document.getElementById("categorie").value,
        stock: Number(document.getElementById("stock").value),
        image: document.getElementById("image").value.trim()
    };

    const succes = await ajouterProduit(nouveauProduit);

    if (succes) {
        alert("Bijou ajouté avec succès ! ✨");
        formProduit.reset();
        chargerAdmin();
    } else {
        alert("Erreur lors de l'ajout.");
    }
});

// Supprimer un bijou
adminProduits.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        
        if (confirm("Es-tu sûr de vouloir supprimer ce bijou ?")) {
            const succes = await supprimerProduit(id);
            if (succes) {
                alert("Bijou supprimé.");
                chargerAdmin();
            } else {
                alert("Erreur lors de la suppression.");
            }
        }
    }
});

// Initialisation
chargerAdmin();
