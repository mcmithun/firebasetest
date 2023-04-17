import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("library/" + sUser).on("value", (snapshot) => {
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
        $$("#bookList").html("");
        for (let n = 0; n < aKeys.length; n++) {
            let checkId = aKeys[n];
            let sCard = `
            <div class="card">
            <div class="card-content card-content-padding" data-key="${checkId}">
            <span class="${oItems[aKeys[n]].datePurchased ? 'strikethrough' : 'nostrikethrough'}">${oItems[aKeys[n]].item} 
                                                                                [${oItems[aKeys[n]].author}, 
                                                                                ${oItems[aKeys[n]].genre}, 
                                                                                ${oItems[aKeys[n]].published}]</span>
                </div>
            <button class="bookButton" id="saveBook">I bought this</button>
            <button class="bookButton" id="deleteBook">I don't need this</button>
            </div>
            `
            $$("#bookList").append(sCard);
        }
    });

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("library/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});

$$("#tab2").on("click", "#deleteBook", e => {
    const card = e.target.closest(".card");
    const sUser = firebase.auth().currentUser.uid;
    const key = card.querySelector('.card-content').getAttribute("data-key");
    firebase.database().ref("library/" + sUser + "/" + key).remove()
        .then(() => {
            console.log("Item removed from database");
        })
        .catch((error) => {
            console.error("Error removing item from database", error);
        });
});

$$("#tab2").on("click", "#saveBook", (event) => {
    const card = event.target.closest(".card");
    const key = card.querySelector('.card-content').getAttribute("data-key");
    const sUser = firebase.auth().currentUser.uid;
    const datePurchased = new Date().toISOString();

    firebase.database().ref("library/" + sUser + "/" + key).update({
        datePurchased: datePurchased
    })
        .then(() => {
            alert("Item purchased on " + datePurchased + " has been updated in the database");
        })
        .catch((error) => {
            console.error("Error adding date purchased to item in database", error);
        });
});