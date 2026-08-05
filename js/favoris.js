document.addEventListener(
"DOMContentLoaded",
()=>{


const container =
document.getElementById(
"favoris-container"
);



let favoris =
JSON.parse(
localStorage.getItem("keo_favoris")
) || [];





function afficherFavoris(){


container.innerHTML="";



if(favoris.length===0){

container.innerHTML =
`
<p>
Aucun favori pour le moment ❤️
</p>
`;

return;

}





favoris.forEach(
(produit,index)=>{


const carte =
document.createElement("div");


carte.className =
"product-card";



carte.innerHTML = `

<img src="${produit.image}">


<h3>
${produit.nom}
</h3>


<p>
${produit.prix} FCFA
</p>


<button class="panier">
🛒 Ajouter au panier
</button>


<button class="supprimer">
❌ Retirer
</button>

`;





carte.querySelector(".supprimer")
.onclick=()=>{


favoris.splice(index,1);



localStorage.setItem(
"keo_favoris",
JSON.stringify(favoris)
);


afficherFavoris();


};





carte.querySelector(".panier")
.onclick=()=>{


let panier =
JSON.parse(
localStorage.getItem("keo_panier")
) || [];



panier.push(produit);



localStorage.setItem(
"keo_panier",
JSON.stringify(panier)
);



alert(
"Ajouté au panier 🛒"
);


};




container.appendChild(carte);


});



}




afficherFavoris();


});