async function symGnuPG_enc()
{
  var feed = document.getElementById("symKey").value;
  //// DEBUG:  console.log(feed);

  var feedintext2 = document.getElementById("feedtext").value;
  document.getElementById("outtext").value = '';

  //// DEBUG:   console.log(feedintext2);
  const options = {
       message : window.openpgp.message.fromText(feedintext2) ,
       passwords : feed ,
       armor : true
   }


   var encText = await window.openpgp.encrypt(options);
    document.getElementById("outtext").value = encText.data ;
    return (encText);
}


function genRan()
{
var bytes = new Uint8Array(35);
window.crypto.getRandomValues(bytes);

document.getElementById("symKey").value = base32.encode(bytes);

}

function copy2clip(myElementId)
{

  var copyText = document.getElementById(myElementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  //// DEBUG:   alert("Copied the text: " + copyText.value);
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


function boxclear(myElementId)
{

document.getElementById(myElementId).value = '';
	
}
