async function symGnuPG_dec()
//  function symGnuPG_dec()
{
  var feed = document.getElementById("symKey").value;
  //// DEBUG:  console.log(feed);

  var feedintext2 = document.getElementById("feedtext").value;
  document.getElementById("outtext").value = '' ;

  //// DEBUG:   console.log(feedintext2);
  const options = {
       message : await openpgp.message.readArmored(feedintext2) ,
       passwords : feed // ,
       // armor : true
   }

    try { var outText = await window.openpgp.decrypt(options) ;
           document.getElementById("outtext").value = outText.data ;
           return (outText);
           }
    catch  (err) { alert (err.message )  }
}

function copy2clip(myElementId)
{

  var copyText = document.getElementById(myElementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  //// DEBUG:   alert("Copied the text: " + copyText.value);
}

function boxclear(myElementId) {
	document.getElementById(myElementId).value = '';
	}



function genRan() {
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

