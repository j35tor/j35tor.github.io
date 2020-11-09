document.addEventListener("DOMContentLoaded", function()
{  var searchParams = new URLSearchParams(window.location.search);
   someid = searchParams.get("feed");
   document.getElementById("feedtext").value = someid;
   
   if (document.getElementById("feedtext").value == '' ) 
		{  
			document.getElementById("feedtext").value = "(Text to generate QR code)";
		}
		
   
  });



function genRan()
{
var bytes = new Uint8Array(35);
window.crypto.getRandomValues(bytes);

document.getElementById("feedtext").value = base32.encode(bytes);
}



function qrcode_gen()
{
   ///// DEBUG:  alert ("QRCode");
   if ( document.getElementById('feedtext').length >= 1990 )
        { alert ("Input is too long") ;
          neu_clear() ;return  } ;

    var qr = qrcode(0, "M");
	var qr_feed; 
	const encoder = new TextEncoder();
	
	qr_feed = document.getElementById('feedtext').value ;
	
    //DEBUG  alert (qr_feed + ">>\n" + toUTF8Array(qr_feed) + "===\n" +  encoder.encode(qr_feed) );	
	//  qr.addData( document.getElementById('feedtext').value );
	/// qr.addData( bin2String(qr_feed)  );
	
	//  var playplay = qr.stringToBytes("sadfdsaf"); 
	//  alert ("PP " + playplay);
	
	qr.addData(qr_feed, 'Byte');
    qr.make();
     document.getElementById('qr').innerHTML =  qr.createImgTag();
}

function boxclear(myElementId)
{

document.getElementById(myElementId).value = '';
	
}

function toUTF8Array(str) 
{
      var utf8 = [];
      for (var i=0; i < str.length; i++) 
	  {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }  /// eo for loop
      
	  //===================
	  return utf8;
    }

function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}

