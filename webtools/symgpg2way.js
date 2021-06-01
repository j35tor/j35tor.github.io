// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md

async function symGnuPG_enc()
{
  var feed = document.getElementById("symKey").value;
  var feedintext2 = document.getElementById("feedtext").value;
  document.getElementById("outtext").value = '';

  
  const options = {
       message : window.openpgp.message.fromText(feedintext2) ,
       passwords : feed ,
       armor : true
   }


   var encText = await window.openpgp.encrypt(options);
    document.getElementById("outtext").value = encText.data ;
    return (encText);
}

async function symGnuPG_dec(feedintext)
{
	var feed = document.getElementById("symKey").value;

	
	const options = {
       message : await openpgp.message.readArmored(feedintext.value) ,
       passwords : feed 
	   }

    try { var outText = await window.openpgp.decrypt(options) ;
           document.getElementById("feedtext").value = outText.data ;
           return (outText);
           }
    catch  (err) { alert (err.message )  }
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
	}


function qrcode_gen() {
   
   if ( document.getElementById('symKey').length >= 1990 )
        { alert ("Input is too long") ;
          boxclear('symKey') ;return  } ;

    var qr = qrcode(0, "M");
    qr.addData( document.getElementById('symKey').value );
    qr.make();
    document.getElementById('qr').innerHTML =  qr.createImgTag();
	}


function boxclear(myElementId) { 
	document.getElementById(myElementId).value = '';
	}


function box2File(myElementId) {
	
	let fname = window.prompt("Save as...");
	const blob = new Blob([ document.getElementById(myElementId).value ], 
					{type: 'text/plain;charset=utf-8'})
	
	saveAs( blob , fname );
	
	//  alert ("FileSave is completed");
	}



FileReaderJS.setupInput(document.getElementById('file2Box'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		document.getElementById("feedtext").value = event.target.result ;
			
      }
    }
  })


FileReaderJS.setupInput(document.getElementById('file2Enc'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		document.getElementById("outtext").value = event.target.result ;
		
      }
    }
  })  

  

  
  