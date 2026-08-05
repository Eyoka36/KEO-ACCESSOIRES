// =====================================
// CONNEXION SUPABASE - KEO ACCESSOIRES
// =====================================


// Import de Supabase
import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";



// Informations du projet Supabase

const SUPABASE_URL = 
"https://tjlmqgwnacoupsijamfd.supabase.co";


// Mets ici ta clé publique Supabase
const SUPABASE_KEY = 
"sb_publishable_StW5cna9zvVnAHhLLIMIMg_nNbI4IMy";




// Création de la connexion

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);





// =====================================
// RÉCUPÉRER LES PRODUITS
// =====================================


export async function getProduits(){


    const { data, error } = await supabase

    .from("produits")

    .select("*")

    .order("date_creation", {
        ascending:false
    });



    if(error){

        console.error(
            "Erreur produits :",
            error
        );

        return [];

    }



    return data;


}






// =====================================
// RÉCUPÉRER LES AVIS
// =====================================


export async function getAvis(){


    const {data,error} = await supabase

    .from("avis")

    .select("*")

    .order("date", {
        ascending:false
    });



    if(error){

        console.error(
            "Erreur avis :",
            error
        );

        return [];

    }



    return data;


}







// =====================================
// FAVORIS
// =====================================


export function ajouterFavori(produit){


    let favoris = JSON.parse(

        localStorage.getItem(
            "keo_favoris"
        )

    ) || [];



    const existe = favoris.find(

        item => item.id === produit.id

    );



    if(!existe){


        favoris.push(produit);



        localStorage.setItem(

            "keo_favoris",

            JSON.stringify(favoris)

        );


    }


}






// =====================================
// PANIER
// =====================================


export function ajouterAuPanier(produit){


    let panier = JSON.parse(

        localStorage.getItem(
            "keo_panier"
        )

    ) || [];



    panier.push(produit);



    localStorage.setItem(

        "keo_panier",

        JSON.stringify(panier)

    );


}






// =====================================
// STOCK EN TEMPS RÉEL
// =====================================


export function surveillerStock(callback){


    supabase

    .channel("keo-stock")

    .on(

        "postgres_changes",

        {

            event:"*",

            schema:"public",

            table:"produits"

        },


        (payload)=>{


            console.log(
                "Modification stock :",
                payload
            );


            callback(payload);


        }


    )

    .subscribe();



}