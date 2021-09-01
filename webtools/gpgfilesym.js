//

function onReady() {
		readPubKeyCombo();
		}

if (document.readyState !== "loading") {
    onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}


function readPubKeyCombo() {
	var myObjs = [] ;
	addItem = Object.create( {} );
	Object.keys( localStorage ).forEach( function(key) {
			//  if ( key.split(":")[2] != "_pubKey" )  return ;
			if ( ! key.includes(":j35mc:_pubKey") )  return ;
			myObjs.push( key.split(":")[3] );
			})
	myObjs.sort();
	var list = document.getElementById("pubKey");
	myObjs.forEach( (item, i) => {
			var option = document.createElement("option");
				option.text =  item ;
				option.value =  item ;
			list.add(option) ;
			} )

	}



async function symGnuPG_decF( myvalue ) {
	var passwd = document.getElementById("symKey").value;
	const options = {
		message: await openpgp.message.readArmored(myvalue) ,
		passwords: passwd ,
		format: 'binary'
		}

    try {
		var outText = await window.openpgp.decrypt(options) ;

		let fname = window.prompt("Save as...");
		const blob = new Blob([ outText.data ],
					// {type: 'application/octet-stream'}
					{type: 'application/x-binary' }
					)

		saveAs( blob , fname );

		return (outText);
		}
    catch  (err) { alert (err.message )  }

	}

function passwdHard() {
	
	var passwdFlip = window.prompt ("Please at least 8 chars" );
	if  ( ( document.getElementById("symKey").value === '' ) || 
			(  document.getElementById("symKey").value === '(Press Dice button)' ) )  genRan() ;
	
	console.log  ( "A=" + passwdFlip.length + "::" + ( passwdFlip.length % 2 == 0 ) );	
	
	if ( !(passwdFlip.length % 2 == 0 ) ) {    passwdFlip.length -= 1 } ;
	
	console.log ( "B=" + passwdFlip.length + "AAAA" );
	
	for (let i = 0; i < passwdFlip.length; i=i+2 ) {
		
		let x = passwdFlip[i];	
		let y = passwdFlip[i+1];	
		alert ( `${x} <->` + y );
		
	};
		
	
	/*	
	let x22 = passwdFlip[0];
 	let y = passwdFlip[1];
	alert ( `${x22} <->`  + y );
	
	let passwd_blend = document.getElementById("symKey").value ;
	let new_passed = passwd_blend.replaceAll( `${x22}`, `${y}` ) ;  
	alert ( document.getElementById("symKey").value  + "\n" + new_passed );
	*/
	
} 



function genRan()  {
var bytes = new Uint8Array(35);
window.crypto.getRandomValues(bytes);

document.getElementById("symKey").value = base32.encode(bytes);

}

function copy2clip(myElementId) {

  var copyText = document.getElementById(myElementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  //// DEBUG:   alert("Copied the text: " + copyText.value);
}


function qrcode_gen() {
   ///// DEBUG:  alert ("QRCode");
   if ( document.getElementById('symKey').length >= 1990 )
        { alert ("Input is too long") ;
          neu_clear() ;return  } ;

    var qr = qrcode(0, "M");
    qr.addData( document.getElementById('symKey').value );
    qr.make();
     document.getElementById('qr').innerHTML =  qr.createImgTag();
}


function boxclear(myElementId) {
	document.getElementById(myElementId).value = '';
	}

function kill_qr() {  document.getElementById('qr').innerHTML = '' }
  
FileReaderJS.setupInput(document.getElementById('file2gpgPub'), {
    readAsDefault: 'ArrayBuffer',
    on: {
      load: function (event, file) {

		if (  document.getElementById("pubKey").value === '(none)' )  {
			alert ("PubKey is missing"); return  }

		document.getElementById("inFilePub").innerHTML = "xxh32 checksum:"
					+  XXH.h32().update( event.target.result ).digest().toString(16) ;

		//  var feed = document.getElementById("PubKey").value;

		document.getElementById("symKey").setAttribute("myNewvalue","aaaa" );

		var StoredKey = localStorage.getItem( ":j35mc:_pubKey:" + document.getElementById("pubKey").value );

		//  alert (StoredKey);
		//  var pubkey = openpgp.key.readArmored(StoredKey);
		const readKey = async () => {
				let armored = await openpgp.key.readArmored(StoredKey);

				Object.keys( armored.keys ).forEach( function(myIt) {
					console.log (  armored.keys[myIt].users[0].userId.userid ) } );
				//  console.log( armored.keys[1].users[0].userId.userid  );

				var uint8View = new Uint8Array( event.target.result );
				const options = {
						message : window.openpgp.message.fromBinary(  uint8View  ) ,
						publicKeys: armored.keys ,
						armor : true
						}

					try {
						var encOut = window.openpgp.encrypt(options) ;
						Promise.resolve( encOut ).then ( val => {
						//  console= val.data ;
						let fname = window.prompt("Save as...");
						const blob = new Blob([ val.data  ],
									{type: 'text/plain;charset=utf-8'}) ;
						saveAs(blob, fname);
						} );  // eo Promise

						} catch (error) { alert(error) };
				};

			readKey();


		}, // eo on load

	  progress: function (event, file) {

			//====

			if (event.lengthComputable)  {
					var percentLoaded = Math.round((event.loaded / event.total) * 100);
					// Increase the progress bar length.
					if (percentLoaded < 100) {
						document.getElementById("read_blksPub").innerHTML
									=  percentLoaded + '%' ;  } }


			//=====

		}, // eo on progress

	  loadend: function(e, file) {
			document.getElementById("read_blksPub").innerHTML = "100%";
		} ,

	  error: function (event, file) {
			alert ("Error on reading file: " + event.err );
		}, // eo on errot

    }  // eo read event
  })






FileReaderJS.setupInput(document.getElementById('file2gpg'), {
    readAsDefault: 'ArrayBuffer',
    on: {
      load: function (event, file) {

		document.getElementById("inFile").innerHTML = "xxh32 checksum:"
					+  XXH.h32().update( event.target.result ).digest().toString(16) ;
		var feed = document.getElementById("symKey").value;

		document.getElementById("symKey").setAttribute("myNewvalue","aaaa" );


		/* alert ( "Checked ->"
				//  + document.getElementById("symKey").getAttribute("Id")
				+ document.getElementById("symKey").getAttribute("myNewvalue")
				) ; */

		if ( (! feed ) || feed === '(Press GenKey)' )  {
			alert ("passwd missing"); return  }

		var uint8View = new Uint8Array( event.target.result );

		const options = {
			message : window.openpgp.message.fromBinary(  uint8View  ) ,
			passwords : feed ,
			armor : true
			}

		try {

			var encOut = window.openpgp.encrypt(options) ;

			Promise.resolve( encOut ).then ( val => {
			//  console= val.data ;
			let fname = window.prompt("Save as...");
			const blob = new Blob([ val.data  ],
					{type: 'text/plain;charset=utf-8'}) ;
			saveAs(blob, fname);

			} );  // eo Promise

		}

		catch (error) { alert(error) };

		}, // eo on load

	  progress: function (event, file) {

			//====

			if (event.lengthComputable)  {
					var percentLoaded = Math.round((event.loaded / event.total) * 100);
					// Increase the progress bar length.
					if (percentLoaded < 100) {
						document.getElementById("read_blks").innerHTML
									=  percentLoaded + '%' ;  } }


			//=====

		}, // eo on progress

	  loadend: function(e, file) {
			document.getElementById("read_blks").innerHTML = "100%";
		} ,

	  error: function (event, file) {
			alert ("Error on reading file: " + event.err );
		}, // eo on errot

    }  // eo read event
  })




FileReaderJS.setupInput(document.getElementById('file2dec'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {

		let gen_checksum = XXH.h32().update( event.target.result ).digest().toString(16);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;  //  front padding with '0'

		document.getElementById("outFile").innerHTML = "xxh32 checksum :" + gen_checksum ;

		var feed = document.getElementById("symKey").value;

		if ( (! feed ) || feed === '(Press GenKey)' )  {
			alert ("passwd missing"); return
			}

		try {symGnuPG_decF( event.target.result ) }
			catch  (err) { alert (err.message )  }
      } ,

	progress: function (event, file) {

			//====

			if (event.lengthComputable)  {
					var percentLoaded = Math.round((event.loaded / event.total) * 100);
					// Increase the progress bar length.
					if (percentLoaded < 100) {
						document.getElementById("read_blks_dec").innerHTML
									=  percentLoaded + '%' ;  } }


			//=====

		}, // eo on progress
	loadend: function(e, file) {
			document.getElementById("read_blks_dec").innerHTML = "100%";
		} ,

    }
  })
