import { 
    getProduits, 
    ajouterProduit, 
    supprimerProduit,
    uploaderImage 
} from "./supabase.js";

const formProduit = document.getElementById("form-produit");
const adminProduits = document.getElementById("admin-produits");
const btnEnvoyer = document.getElementById("btn-envoyer");

// 1. AFFICHER LES PRODUITS DÉJÀ PUBLIÉS
async function chargerProduitsPublies() {
    adminProduits.innerHTML = "<tr><td colspan='5'>Chargement des produits...</td></tr>";
    
    const produits = await getProduits() || [];
    
    adminProduits.innerHTML = "";
    
    if (produits.length === 0) {
        adminProduits.innerHTML = "<tr><td colspan='5'>Aucun bijou en ligne pour le moment.</td></tr>";
        return;
    }

    produits.forEach(p => {
        const tr = document.createElement("tr");
        const imageSrc = p.image || p.image_url || 'images/default.jpg';

        tr.innerHTML = `
            <td><img src="${imageSrc}" alt="${p.nom}"></td>
            <td><strong>${p.nom}</strong><br><small style="color:#777;">${p.categorie}</small></td>
            <td>${p.prix ? p.prix.toLocaleString() : '0'} FCFA</td>
            <td>${p.stock ?? 0}</td>
            <td>
                <button class="btn-delete" data-id="${p.id}">Supprimer</button>
            </td>
        `;
        adminProduits.appendChild(tr);
    });
}

// 2. AJOUTER UN NOUVEAU PRODUIT (AVEC IMAGE)
formProduit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("image-file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez choisir une image.");
        return;
    }

    btnEnvoyer.disabled = true;
    btnEnvoyer.textContent = "Téléversement en cours...";

    // Upload de l'image sur Supabase Storage
    const imageUrl = await uploaderImage(file);

    if (!imageUrl) {
        alert("Erreur lors de l'envoi de l'image. Vérifiez votre bucket Storage Supabase.");
        btnEnvoyer.disabled = false;
        btnEnvoyer.textContent = "Poster le bijou";
        return;
    }

    // Création de l'objet produit
    const nouveauProduit = {
        nom: document.getElementById("nom").value.trim(),
        prix: Number(document.getElementById("prix").value),
        categorie: document.getElementById("categorie").value,
        stock: Number(document.getElementById("stock").value),
        image: imageUrl
    };

    const succes = await ajouterProduit(nouveauProduit);

    if (succes) {
        alert("Bijou publié avec succès ! ✨");
        formProduit.reset();
        await chargerProduitsPublies();
    } else {
        alert("Erreur lors de l'enregistrement dans la base de données.");
    }

    btnEnvoyer.disabled = false;
    btnEnvoyer.textContent = "Poster le bijou";
});

// 3. SUPPRIMER UN PRODUIT
adminProduits.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        
        if (confirm("Voulez-vous vraiment supprimer ce bijou de la boutique ?")) {
            const succes = await supprimerProduit(id);
            if (succes) {
                alert("Bijou supprimé !");
                await chargerProduitsPublies();
            } else {
                alert("Erreur lors de la suppression.");
            }
        }
    }
});

// Chargement automatique au démarrage
chargerProduitsPublies();
