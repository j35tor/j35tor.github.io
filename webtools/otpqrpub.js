document.getElementById("qrtext").addEventListener("click",function()
{
	navigator.clipboard.writeText(event.target.innerHTML);

} );

function ramdomKeyGen()
{
  var bytes = new Uint8Array(35);
  window.crypto.getRandomValues(bytes);
  document.getElementById('randomKey').value = base32.encode(bytes) ;
  onValueChanged();
}

function onKeyChanged()
{
if ( (document.getElementById('randomKey')
		.value.search(/[8-9]|[0-1]|[\W]/i ) ) >= 0 )
   { alert ("Base32 encoding char. are A–Z, followed by 2–7" );
     document.getElementById('oauth_url').value = "(URL  mis-formed)" ; 
	return}
onValueChanged();
}

function onValueChanged()
{
if ( document.getElementById('randomKey').value == 0 )
   { ramdomKeyGen();  }

document.getElementById('oauth_url').value = 'otpauth://totp/'+
    document.getElementById('issue_org').value  + ':' +
    document.getElementById('userID').value + '?secret=' +
    document.getElementById('randomKey').value + '&algorithm=' +
    document.getElementById('algorithm').value + '&digits=' +
    document.getElementById('numOfDigits').value + '&period=' +
    document.getElementById('timeSlot').value ;
}

function neu_clear()
{
  alert ("Clear");
  document.getElementById('userID').value = '' ;
  document.getElementById('issue_org').value = '' ;
  document.getElementById('randomKey').value = '' ;
  document.getElementById('oauth_url').value = '' ;
  document.getElementById('qr').innerHTML = '' ;
}


function qrcode_gen()
{
   ///// DEBUG:  alert ("QRCode");
   if ( document.getElementById('oauth_url').length >= 1990 )
        { alert ("Input is too long") ;
          neu_clear() ;return  } ;

   if ( document.getElementById('userID').value  === '' )
        { alert ("Missing UID") ;
          return  } ;

   if ( document.getElementById('oauth_url')
		.value.search("mis-formed") >= 0  )
        { alert ("otpauth URL misformed") ;
          return  } ; 

     alert ( "aas " + document.getElementById('oauth_url')
                .value.search("mis-formed") );

    var qr = qrcode(0, "M");
    qr.addData( document.getElementById('oauth_url').value );
    qr.make();
     document.getElementById('qr').innerHTML =  qr.createImgTag();
}

async function keyLookup()
{
  
  /// var hkp = new window.openpgp.HKP('https://pgp.key-server.io');
  ///// DEBUG:  console.log( document.getElementById("pubKeyServ").value  );
  var hkp = new window.openpgp.HKP( document.getElementById("pubKeyServ").value );


  var options = {
    // query: '0x8E61EFC0E635945B'
    query: document.getElementById("keyID").value
  };

  try  {
    let armoredPubkey = await hkp.lookup(options) ;
      document.getElementById("keyPub").value = armoredPubkey ;
  }
    catch ( rejectedValue )  { alert ("Problem with loading key. Error :" +  rejectedValue) }


}


async function pubKey_enc()
{
  var armoredPubkey = document.getElementById("keyPub").value;

  var pubkey = await openpgp.key.readArmored(armoredPubkey);
  //// DEBUG: console.log(pubkey.keys[0]);
  var feedintext2 = document.getElementById("oauth_url").value;

  const options = {
     message : window.openpgp.message.fromText(feedintext2) ,
     publicKeys: pubkey.keys[0] ,
     armor : true
    }

  var encText = await window.openpgp.encrypt(options);
  document.getElementById("outtext").value = encText.data ;
  return (encText);
}

function copy2clip(myElementId)
{

  var copyText = document.getElementById(myElementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  //// DEBUG:   alert("Copied the text: " + copyText.value);

}
