document.addEventListener(
"DOMContentLoaded",
()=>{


const container =
document.getElementById("cart-container");


const totalZone =
document.getElementById("total");


const bouton =
document.getElementById("order-whatsapp");



let panier =
JSON.parse(
localStorage.getItem("keo_panier")
) || [];





function afficherPanier(){


container.innerHTML="";


let total = 0;



if(panier.length === 0){

container.innerHTML =
`
<p>
Votre panier est vide 🛒
</p>
`;

totalZone.textContent =
"Total : 0 FCFA";

return;

}




panier.forEach(
(produit,index)=>{


total += Number(produit.prix);



const article =
document.createElement("div");


article.className =
"cart-item";



article.innerHTML = `

<img src="${produit.image}">


<div>

<h3>
${produit.nom}
</h3>

<p>
${produit.prix} FCFA
</p>


<button class="supprimer">
Supprimer
</button>


</div>

`;




article
.querySelector(".supprimer")
.onclick=()=>{


panier.splice(index,1);


localStorage.setItem(
"keo_panier",
JSON.stringify(panier)
);


afficherPanier();


};




container.appendChild(article);


});



totalZone.textContent =
"Total : " + total + " FCFA";

}





bouton.onclick=()=>{


let message =
"Bonjour KEO Accessoires,%0AJe souhaite commander :%0A";


panier.forEach(produit=>{

message +=
"- "+produit.nom+
" : "+produit.prix+
" FCFA%0A";

});



window.open(
"https://wa.me/VOTRE_NUMERO?text="
+message
);


};



afficherPanier();



});