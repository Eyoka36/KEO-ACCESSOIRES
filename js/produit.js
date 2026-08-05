import { 
    supabase,
    ajouterFavori,
    ajouterAuPanier
} from "./supabase.js";


const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");


const imageZone = document.getElementById("product-image");
const infoZone = document.getElementById("product-info");
const whatsapp = document.getElementById("whatsapp-order");



async function chargerProduit(){

    const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("id", id)
        .single();


    if(error){
        console.log(error);
        infoZone.innerHTML = "Produit introuvable";
        return;
    }



    imageZone.innerHTML = `
        <img src="${data.image}" alt="${data.nom}">
    `;



    infoZone.innerHTML = `

        <h1>${data.nom}</h1>

        <h2>${data.prix} FCFA</h2>

        <p>${data.description}</p>

        <p>
        📦 Stock disponible : ${data.stock}
        </p>

        <button id="fav">
        ❤️ Ajouter aux favoris
        </button>


        <button id="cart">
        🛒 Ajouter au panier
        </button>

    `;



    document
    .getElementById("fav")
    .onclick = ()=>{

        ajouterFavori(data);

        alert("Ajouté aux favoris ❤️");

    };



    document
    .getElementById("cart")
    .onclick = ()=>{

        ajouterAuPanier(data);

        alert("Ajouté au panier 🛒");

    };



    whatsapp.href =
    `https://wa.me/VOTRE_NUMERO?text=Bonjour KEO Accessoires, je souhaite commander ${data.nom} à ${data.prix} FCFA`;

}


chargerProduit();