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
		
		let fname = outText.filename ;
		if 	( (fname === 'msg.txt') || ( fname === '' ) ) fname = window.prompt("Save as...");

		const blob = new Blob([ outText.data ], 
					// {type: 'application/octet-stream'}
					{type: 'application/x-binary' }  
					)
	
		saveAs( blob , fname );
		   
		return (outText);
		}
    catch  (err) { alert (err.message )  }

	}

async function pKunSym( inputTXT, secKeyPW, storeKey ) { 

	const options = {
		message : await openpgp.message.readArmored( storeKey ) ,
		passwords : secKeyPW //,
		// armor : true
		}
		
	try {   var outText = await window.openpgp.decrypt(options);
			return (outText.data);
		} catch  (err) {
			alert ("Some problem with the Key :\n" + err.message);
			return;}	


};


async function decFromSKFile( secKey, evt ) { 
	var r2gKey = await openpgp.key.readArmored(secKey);
	
	const options = {
		message : await openpgp.message.readArmored( evt ) ,
		privateKeys: r2gKey.keys ,
		format: 'binary' 
		}
	
	var decText = await window.openpgp.decrypt(options);
	
	console.log(decText.filename );
	
	let fname = decText.filename ; 
	
	if ( ( fname === '') || ( fname === 'msg.txt') ) fname = window.prompt("Save as...");
	
	
	const blob = new Blob([ decText.data ], 
	//					{type: 'text/plain;charset=utf-8'}) ;
						{type: 'application/octet-stream'}) ;
	saveAs(blob, fname);

}


function passwdHard() {
	
	var passwdFlip = window.prompt ("Please at least 6 chars" );
	if  ( ( document.getElementById("symKey").value === '' ) || 
			(  document.getElementById("symKey").value === '(Press Dice button)' ) )  genRan() ;
			
	if 	( passwdFlip.length < 6 ) {
		alert ("Please at least feed 6 chars ");
		return ;
		};	
	
	var hardPasswd_len = passwdFlip.length ;
	var passwd_blend = document.getElementById("symKey").value ;
	var passwd_original = document.getElementById("symKey").value ;
	
	if ( hardPasswd_len % 2 == 1 )    hardPasswd_len -= 1 ; 
	
	for (let i = 0; i <= ( hardPasswd_len - 2 ) ; i=i+2 ) {
		
		let x = passwdFlip[i];	
		let y = passwdFlip[i+1];	
		// DEBUG // alert ( `${x} <->  ${y}` );
		passwd_blend = passwd_blend.replaceAll( `${x}`, `${y}` ) ;
		// DEGUG  // alert ( document.getElementById("symKey").value  + "\n" + passwd_blend );
	};

	if (passwd_original == passwd_blend) {

	alert ("Warning! Password unchanged!");	
	return;	
	}
	document.getElementById("symKey").value	 =  passwd_blend ;
} 

function genRan() {
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

document.getElementById("fileSelect").addEventListener("click", () => {
	if (  document.getElementById("file2gpg") ) {
			 document.getElementById("file2gpg").click();
		}
	
}, false);

document.getElementById("fileSelectDec").addEventListener("click", () => {
	if (  document.getElementById("file2dec") ) {
			 document.getElementById("file2dec").click();
		}
	
}, false);

document.getElementById("fileSelectPubDec").addEventListener("click", () => {

	if (  document.getElementById("pubgpgDec") ) {
			 document.getElementById("pubgpgDec").click();
		}
	
}, false);

document.getElementById("fileSelectPubEnc").addEventListener("click", () => {
	if (  document.getElementById("file2gpgPub") ) {
			 document.getElementById("file2gpgPub").click();
		}
	
}, false);
  
FileReaderJS.setupInput(document.getElementById('file2gpgPub'), {
    readAsDefault: 'ArrayBuffer',
    on: {
      load: function (event, file) {
		console.log ( file.name );
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
				let options = {
						// message : window.openpgp.message.fromBinary(  uint8View  ) ,
						message : window.openpgp.message.fromBinary(  uint8View  ),  
						publicKeys: armored.keys ,
						armor : true
						}
					
				options.message.packets[0].filename	= file.name ;
				
				console.log (options.message.packets[0].format);	
				//

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

		let options = {
			message : window.openpgp.message.fromBinary( uint8View ) ,
			passwords : feed ,
			armor : true
			}
			
		options.message.packets[0].filename	= file.name ;


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
		  
		if 	( file.size > 100000000 ){ 
				alert ("The input file is too big");
				return ;	
				}

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

///=====================
FileReaderJS.setupInput(document.getElementById('pubgpgDec'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		  
		if (  document.getElementById("pubKey").value === '(none)' )  { 
			alert ("PubKey is missing"); return  }
			
		if 	( file.size > 100000000 ){ 
				alert ("The input file is too big");
				return ;	
				} ;	

		let gen_checksum = XXH.h32().update( event.target.result ).digest().toString(16);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;  //  front padding with '0'


		document.getElementById("inFilePub").innerHTML = "xxh32 checksum :" + gen_checksum ; 
		
		var secKeyPW = window.prompt ("Please Input password to unlock SecKey" );

		var storeKey = document.getElementById("pubKey").value;
			storeKey = localStorage.getItem(":j35mc:_pubKey:" + storeKey );
			
		//  var encTXT =  pKunSym( inputTXT.value, secKeyPW, storeKey );

		try {  var encTXT = pKunSym( event.target.result, secKeyPW, storeKey ) 
				// console.log (encTXT);
				Promise.resolve( encTXT ).then( val => { 
				//  console.log ( val );
				if  ( val === 'undefined' ) return ;
				
				decFromSKFile ( val, event.target.result );
				
								
				// let fname = window.prompt("Save as...");	
				// const blob = new Blob([ val ], 
							// {type: 'text/plain;charset=utf-8'}) ;
				// saveAs(blob, fname);

			} ) 
			}
			catch  (err) { alert (err.message )  }	
			

		/*
		try {symGnuPG_decF( event.target.result ) }
			catch  (err) { alert (err.message )  }
		*/	
			
      } ,
	  
	progress: function (event, file) { 
	  
			//====
			
			if (event.lengthComputable)  {
					var percentLoaded = Math.round((event.loaded / event.total) * 100);
					// Increase the progress bar length.
					if (percentLoaded < 100) {
						document.getElementById("read_blksPubDec").innerHTML 
									=  percentLoaded + '%' ;  } }
			
			
			//=====
	  
		}, // eo on progress
	loadend: function(e, file) { 
			document.getElementById("read_blksPubDec").innerHTML = "100%";
		} ,	  
	  
    }
  })  


//================
