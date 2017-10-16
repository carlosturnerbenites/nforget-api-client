import firebase from "firebase";
import "firebase/firestore";

var config = { 
  apiKey: 'AIzaSyDpwfjfDkaNCbaFTmTbs5wiLw4ew3LlbI4',
  authDomain: 'nforget-459b1.firebaseapp.com',
  databaseURL: 'https://nforget-459b1.firebaseio.com',
  projectId: 'nforget-459b1',
  storageBucket: 'nforget-459b1.appspot.com',
  messagingSenderId: '958497156154'
}

firebase.initializeApp(config);

var firebaseDatabase = firebase.firestore();
var firebaseAuth = firebase.auth();

const email = "carlosturnerbenites@gmail.com"
const password = "carlos123"

firebaseAuth.onAuthStateChanged(function(user) {
	if (user) {
		console.log(user)

		getItems()
			.then(function(res){ console.log(res)})
			.catch(function(err){console.error(err)});

	} else {
		console.log("no User")
		// User is signed out.
		// ...
	}
});

firebaseAuth.createUserWithEmailAndPassword(email, password)
.then(function(error) {
	console.log("account create")
})
.catch(function(error) {
	console.log(error)
	var errorCode = error.code;
	var errorMessage = error.message;
	
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function(error) {
		console.log("account sigin")
	})
	.catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
	});
});


function addItem(item){
	var user = firebase.auth().currentUser;
	return firebaseDatabase.collection("users").doc(user.uid).collection("items").add(item)
}

function updateItem(id, data){
	return getRefItem(id).update(data).then(() => {
		console.log("item update")
	})
}

function deleteItem(id){
	return getRefItem(id).delete().then(() => {
		console.log("item delete")
	})
}

function getItems(){
	var user = firebase.auth().currentUser;
	return firebaseDatabase.collection("users").doc(user.uid).collection("items").get().then((snap) => {
		return snap.docs.map(e => {
			var data = e.data()
			data["id"] = e.id
			return data
		})
	})
}


function getRefItem(id){
	var user = firebase.auth().currentUser;
	return firebaseDatabase.collection("users").doc(user.uid).collection("items").doc(id)
}

function getItem(id){
	var user = firebase.auth().currentUser;
	return getRefItem().get()
}

export {
  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
}