function onReady() {
		
		var searchParams = new URLSearchParams(window.location.search);
		someid = searchParams.get("feed");
		document.getElementById("feedtext").value = someid;
   
		if (document.getElementById("feedtext").value == '' )  {  
			document.getElementById("feedtext").value = "(Text to generate QR code)";
			}
			
			
		var box_width = document.documentElement.clientWidth - 40;
			document.getElementById('feedtext').style.width = box_width + 'px' ;	
		
		}

if (document.readyState !== "loading") {
    onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}


function genRan() {
var bytes = new Uint8Array(35);
window.crypto.getRandomValues(bytes);

document.getElementById("feedtext").value = base32.encode(bytes);
}



function qrcode_gen() {
   ///// DEBUG:  alert ("QRCode");
   if ( document.getElementById('feedtext').length >= 1990 )
        { alert ("Input is too long") ;
          neu_clear() ;return  } ;

    var qr = qrcode(0, "M");
	var qr_feed = document.getElementById('feedtext').value ; 
	
	
	var utf8 = unescape(encodeURIComponent( qr_feed ));
		qr.addData(utf8);
    qr.make();
     document.getElementById('qr').innerHTML =  qr.createImgTag();
}

function boxclear(myElementId)  {

	document.getElementById(myElementId).value = '';
	
}


window.addEventListener('resize', () => {

	var box_width = document.documentElement.clientWidth - 40;
	document.getElementById('feedtext').style.width = box_width + 'px';
	

} );