//
function onReady() {
		readPubKeyCombo();

		var cellWidth = document.documentElement.clientWidth - 20;

		document.getElementById("feedtext").style.width = cellWidth ;
		document.getElementById("outtext").style.width =  cellWidth ;
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

async function symGnuPG_enc()	{
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

async function pKeyGnuPG_enc() {

	if ( document.getElementById("pubKey").value === "(none)" ) {
		alert ("Please select the PubKey") ; return ;
			}
	var StoredKey = localStorage.getItem( ":j35mc:_pubKey:" + document.getElementById("pubKey").value );
	var feedintext2 = document.getElementById("feedtext").value;

	let armored = await openpgp.key.readArmored(StoredKey);
	/* // DEBUG to check userId in the pubKeys
	Object.keys( armored.keys ).forEach( function(myIt) {
					console.log (  armored.keys[myIt].users[0].userId.userid ) } );
	*/
	const options = {
		message : window.openpgp.message.fromText(feedintext2)  ,
		publicKeys: armored.keys ,
		armor : true
		}

	try {
		var encText = await window.openpgp.encrypt(options);
		document.getElementById("outtext").value = encText.data ;
		return (encText)

		} catch (error) { alert(error) };


}


async function symGnuPG_dec(feedintext)
{
	var feed = document.getElementById("symKey").value;

	//// DEBUG:   console.log(feedintext2);
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


function genRan()  {
	var bytes = new Uint8Array(35);
	window.crypto.getRandomValues(bytes);
	document.getElementById("symKey").value = base32.encode(bytes);
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

	if ( hardPasswd_len % 2 == 1 )    hardPasswd_len -= 1 ;

	for (let i = 0; i <= ( hardPasswd_len - 2 ) ; i=i+2 ) {

		let x = passwdFlip[i];
		let y = passwdFlip[i+1];
		// DEBUG // alert ( `${x} <->  ${y}` );
		passwd_blend = passwd_blend.replaceAll( `${x}`, `${y}` ) ;
		// DEGUG  // alert ( document.getElementById("symKey").value  + "\n" + passwd_blend );
	};
	document.getElementById("symKey").value	 =  passwd_blend ;
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

function kill_qr() {  document.getElementById('qr').innerHTML = '' }

function box2File(myElementId) {

	let fname = window.prompt("Save as...");
	const blob = new Blob([ document.getElementById(myElementId).value ],
					{type: 'text/plain;charset=utf-8'})

	saveAs( blob , fname );

    //  document.getElementById("outtext").value =
	// "(FileSave is completed,\n you may clear this message by clear button)";
	alert ("FileSave is completed");
	}

function cutHead() {
		const swapTXT = document.getElementById("outtext").value ;
		// const wip = swapTXT.split(/\r*\n/);
		const wip = swapTXT.split('\n');
		document.getElementById("outtext").value = wip.slice( 4 , ( wip.length-1 ) ) ;

		/*
		var i;
			for (i = 0; i < cars.length; i++) {
			text += cars[i] + "<br>";
		} */


		}


document.getElementById("file2BoxALT").addEventListener("click", () => {
		if ( document.getElementById("file2Box") ) {
					document.getElementById("file2Box").click();
				}

		}, false);

FileReaderJS.setupInput(document.getElementById('file2Box'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		document.getElementById("feedtext").value = event.target.result ;
		// fromJSON( "fromDump", event.target.result );
      }
    }
  })

document.getElementById("file2EncALT").addEventListener("click", () => {
		if ( document.getElementById("file2Enc") ) {
					document.getElementById("file2Enc").click();
				}

		}, false);


FileReaderJS.setupInput(document.getElementById('file2Enc'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		document.getElementById("outtext").value = event.target.result ;
		// fromJSON( "fromDump", event.target.result );
      }
    }
  })
