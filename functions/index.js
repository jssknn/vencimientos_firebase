const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("./firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});
const db = admin.firestore();

 exports.quincedias = functions.https.onRequest((request, response) => {
	var usuario = request.query.user
	let venci = db.collection('usuarios').doc(usuario).collection('vencimientos');
	let datosuser = db.collection('usuarios').doc(usuario);
	var usuarioelemento;
	var usuariotelefono;
	var usuarionombre;
	
	datosuser.get().then((doc1) => {
    if (doc1.exists) {
        usuarioelemento = doc1.data().elemento;
		usuariotelefono = doc1.data().telefono;
		usuarionombre = doc1.data().nombre;
		return;
    } else {
        // doc1.data() will be undefined in this case
        console.log("No such document!");
		return;
    }
	}).catch(function(error) {
    console.log("Error getting document:", error);
	});
	
	let date_ob = new Date();
	date_ob.setDate(date_ob.getDate() + 15)
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);
	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	// current year
	let year = date_ob.getFullYear();
	let diaactual = year + "-" + month + "-" + date
	let query = venci.where('vencimiento', '==', diaactual).get()
	.then(snapshot => {
		if (snapshot.empty) {
		console.log('No matching documents.');
		return;
		}
	
		snapshot.forEach(doc => {
			const https = require('https');
			https.get('https://api.callmebot.com/whatsapp.php?phone=+549'+doc.data().telefono+'&text=⚠📢 Buenos dias,%0ANos comunicamos de '+ usuarionombre +' para informarle que su '+usuarioelemento+' de *'+doc.data().descripcion+'* vence el día *'+date + "-" + month + "-" + year+'*.%0APor cualquier consulta comunicarse al 📞 '+usuariotelefono+'.%0ASaludos.&apikey='+doc.data().apikey, (resp) => {
			let data1 = '';
			// a data chunk has been received.
			resp.on('data1', (chunk) => {
				data1 += chunk;
			});
			// complete response has been received.
			resp.on('end', () => {
				console.log(JSON.parse(data1).name);
			});
			}).on("error", (err) => {
				console.log("Error: " + err.message);
			});
	
			functions.logger.info(doc.data());
		});
	return;	
	})
	.catch(err => {
		console.log('Error getting documents', err);
	});   

	
		response.sendStatus(200); 
});

 exports.mismodia = functions.https.onRequest((request, response) => {
	var usuario = request.query.user
	let venci = db.collection('usuarios').doc(usuario).collection('vencimientos');
	let datosuser = db.collection('usuarios').doc(usuario);
	var usuarioelemento;
	var usuariotelefono;
	var usuarionombre;
	
	datosuser.get().then((doc1) => {
    if (doc1.exists) {
        usuarioelemento = doc1.data().elemento;
		usuariotelefono = doc1.data().telefono;
		usuarionombre = doc1.data().nombre;
		return;
    } else {
        // doc1.data() will be undefined in this case
        console.log("No such document!");
		return;
    }
	}).catch(function(error) {
    console.log("Error getting document:", error);
	});
	
	let date_ob = new Date();
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);
	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	// current year
	let year = date_ob.getFullYear();
	let diaactual = year + "-" + month + "-" + date
	let query = venci.where('vencimiento', '==', diaactual).get()
	.then(snapshot => {
		if (snapshot.empty) {
		console.log('No matching documents.');
		return;
		}
	
		snapshot.forEach(doc => {
			const https = require('https');
			https.get('https://api.callmebot.com/whatsapp.php?phone=+549'+doc.data().telefono+'&text=⛔La '+usuarioelemento+' de *'+doc.data().descripcion+'* vence el día *HOY*&apikey='+doc.data().apikey, (resp) => {
			let data1 = '';
			// a data chunk has been received.
			resp.on('data1', (chunk) => {
				data1 += chunk;
			});
			// complete response has been received.
			resp.on('end', () => {
				console.log(JSON.parse(data1).name);
			});
			}).on("error", (err) => {
				console.log("Error: " + err.message);
			});
	
			functions.logger.info(doc.data());
		});
	return;	
	})
	.catch(err => {
		console.log('Error getting documents', err);
	});   

	
		response.sendStatus(200); 
});
 

