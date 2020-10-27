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
  var feedintext2 = document.getElementById("feedtext").value;

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


function boxclear(myElementId)
{

document.getElementById(myElementId).value = '';
	
}