async function symGnuPG_dec()
{
  var feed = document.getElementById("symKey").value;
  //// DEBUG:  console.log(feed);

  var feedintext2 = document.getElementById("feedtext").value;
  //// DEBUG:   console.log(feedintext2);
  const options = {
       message : await openpgp.message.readArmored(feedintext2) ,
       passwords : feed // ,
       // armor : true
   }

   var outText = await window.openpgp.decrypt(options);
   //  console.log(outText);
   document.getElementById("outtext").value = outText.data ;
//    return (encText);
}

function copy2clip(myElementId)
{

  var copyText = document.getElementById(myElementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  //// DEBUG:   alert("Copied the text: " + copyText.value);
}
