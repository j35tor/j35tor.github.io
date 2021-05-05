// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md

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



function genRan()  {
	var bytes = new Uint8Array(35);
	window.crypto.getRandomValues(bytes);
	document.getElementById("symKey").value = base32.encode(bytes);
	}
	

function qrcode_gen()
{
   ///// DEBUG:  alert ("QRCode");
   if ( document.getElementById('symKey').length >= 1990 )
        { alert ("Input is too long") ;
          neu_clear() ;return  } ;

    var qr = qrcode(0, "M");
    qr.addData( document.getElementById('symKey').value );
    qr.make();
     document.getElementById('qr').innerHTML =  qr.createImgTag();
	}

	
	

function copy2clip(myElementId)  {
	var copyText = document.getElementById(myElementId);
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
	//// DEBUG:   alert("Copied the text: " + copyText.value);
	}


function boxclear(myElementId) { 
	document.getElementById(myElementId).value = '';
	}
  
FileReaderJS.setupInput(document.getElementById('file2gpg'), {
    readAsDefault: 'ArrayBuffer',
    on: {
      load: function (event, file) {

		if  (event.total >= 367001600)  { 
				alert ("The input file size is limited to 350M"); 
				document.getElementById("read_blks").innerHTML = "Error";
				return ;  }


		var feed = document.getElementById("symKey").value;
		
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
	  			
			if (event.lengthComputable)  {
					var percentLoaded = Math.round((event.loaded / event.total) * 100);
					// Increase the progress bar length.
					if (percentLoaded < 100) {
						document.getElementById("read_blks").innerHTML 
									=  percentLoaded + '%' ;  } }
		
			console.log("FileSize: " +  event.total  );
		}, // eo on progress
		
	  loadend: function(e, file) { 
			document.getElementById("read_blks").innerHTML = "100%";
			if  (event.total >= 367001600)  
					document.getElementById("read_blks").innerHTML = "Error";

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

		var feed = document.getElementById("symKey").value;
		
		if ( (! feed ) || feed === '(Press GenKey)' )  { 
			alert ("passwd missing"); return  
			}
		
		try {symGnuPG_decF( event.target.result ) }
			catch  (err) { alert (err.message )  }
      }
    }
  })  




  