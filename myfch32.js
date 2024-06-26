document.addEventListener("DOMContentLoaded", function() {
   // init();
   mytab2 = document.getElementById("sha1table");
   Object.keys(mydata).forEach(function(key) {
      var rowNum = mytab2.insertRow();
      rowNum.insertCell(0).innerHTML = mydata[key].checkSum ;
      rowNum.cells[0].id = mydata[key].fileName ;
      rowNum.insertCell(1).innerHTML = mydata[key].link;
      rowNum.insertCell(2).innerHTML = mydata[key].fileName;
    })
	document.getElementById("ok").style.color="#FFC300";

}, false);



document.getElementById("filetoRead").addEventListener("change",function( evt ) {
	var file = this.files[0];

	// alert ("len->" + evt.target.formAction );
	 	 
	if (file) {
		var reader = new FileReader();
		reader.onprogress = updateProgress;

    reader.onload = function (evt) {
        var arrayBuffer = reader.result;
		// var gen_checksum = sha1(arrayBuffer);
		// var gen_checksum = XXH.h32().update( arrayBuffer ).digest().toString(16);
		
		
		// This code block is opt out as the stack overflow issue of String.apply()
		// It segement can work if the arrayBuffer.length is short
		const { h32, h64, h32Raw, h64Raw } = xxhash();
		
		xxhash().then( hasher => {
			// var gen_checksum1 = hasher.h32( String.fromCharCode.apply(null, new Uint8Array( arrayBuffer ) ) );
			var gen_checksum1 = ( hasher.h32Raw( new Uint8Array( arrayBuffer ) ) ).toString(16) ;
			
			gen_checksum1 = ( "00000000" + gen_checksum1 ).slice(-8) ;
			// alert ( "Check " + 	gen_checksum1 );
			document.getElementById("checksumOut").innerHTML =  gen_checksum1 ;
			
			var feedChecksum = document.getElementById("checksum").value.trim().toLowerCase();

			document.getElementById("read_blks").innerHTML = '100 %' ;
			
			document.getElementById("feedChecksum").innerHTML =  feedChecksum ;
			document.getElementById("checksumOut").style.border="2px solid black";

			if   ( gen_checksum1 === feedChecksum ) {
				document.getElementById("ok").innerHTML = "CheckSum Matched! &#10004;" ;
				document.getElementById("ok").style.color="#00b300";
				document.getElementById("feedChecksum").style.border="2px solid black"; }

			else if ( document.getElementById("checksum").value.trim() != "" ) {
				document.getElementById("ok").innerHTML = "CheckSum Mismatch !! &#10060;"
				document.getElementById("ok").style.color="#FF4000";
				document.getElementById("feedChecksum").style.border="2px solid black";  }

			else {  document.getElementById("feedChecksum").innerHTML = "(missing)" }			
			
			
        });
	


		/*
		var feedChecksum = document.getElementById("checksum").value.trim().toLowerCase();

		document.getElementById("read_blks").innerHTML = '100 %' ;
		//  document.getElementById("checksumOut").innerHTML =  gen_checksum ;	

		//  var gen_checksum =  document.getElementById("checksumOut").innerHTML  ;			
		document.getElementById("feedChecksum").innerHTML =  feedChecksum ;
		document.getElementById("checksumOut").style.border="2px solid black";

		if   ( gen_checksum === feedChecksum ) {
			document.getElementById("ok").innerHTML = "CheckSum Matched! &#10004;" ;
            document.getElementById("ok").style.color="#00b300";
			document.getElementById("feedChecksum").style.border="2px solid black"; }

		else if ( document.getElementById("checksum").value.trim() != "" ) {
			document.getElementById("ok").innerHTML = "CheckSum Mismatch !! &#10060;"
			document.getElementById("ok").style.color="#FF4000";
			document.getElementById("feedChecksum").style.border="2px solid black";  }

			else {  document.getElementById("feedChecksum").innerHTML = "(missing)" }
		*/	
		};

	reader.onerror = function (evt) {
			console.error("An error ocurred reading the file",evt); 
			};
			
    reader.readAsArrayBuffer(file);
    }

},false);

document.getElementById("filetoRead")
        .addEventListener('dragover', handleDragOver, false);

function updateProgress(evt) {
		// evt is an ProgressEvent.
		if (evt.lengthComputable) {
			var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
			// Increase the progress bar length.
			if (percentLoaded < 100) { 
				document.getElementById("read_blks").innerHTML =  percentLoaded + '%' ; 
				}
			}
		}


function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // show as copy
	}

function boxclear(myElementId) {
	document.getElementById(myElementId).value = '';
	}



document.getElementById("sha1table").addEventListener("click",function() {
    document.getElementById("checksumOut").innerHTML = "" ;
	document.getElementById("feedChecksum").innerHTML = "" ;
	document.getElementById("ok").innerHTML = "Checksum status: unknown?" ;
	document.getElementById("ok").style.color="#FFC300";
//
	document.getElementById("checksumOut").style.border="0px solid black";
	document.getElementById("feedChecksum").style.border="0px solid black";

	document.getElementById("checksum").value =  "" ;
	document.getElementById("checksumFile").value =  "" ;

	if ( event.target.innerHTML.includes(".") ) {
	/// Local url //  document.getElementById("quickLink").href =  "./" +  event.target.innerHTML ;
	// document.getElementById("quickLink").innerHTML = event.target.innerHTML ;

	document.getElementById("quickLink").href =  "" ;
	document.getElementById("quickLink").innerHTML =  "_" ;
	}
	else if  //  ( event.target.innerHTML.length < 40 )
		 ( event.target.innerHTML.toString().slice(0,2) === "/s" ) {
				//  local url // document.getElementById("quickLink").href =  event.target.innerHTML ;
                document.getElementById("quickLink").href =
                    "https://cloud.disroot.org" +  event.target.innerHTML ;
				document.getElementById("quickLink").innerHTML =  "_" ;
				navigator.clipboard.writeText( "https://cloud.disroot.org" + event.target.innerHTML);
				}

	else {
		document.getElementById("checksum").value =  event.target.innerHTML ;
		document.getElementById("checksumFile").value =  event.target.id ;
		document.getElementById("quickLink").href =  "./" ;
		document.getElementById("quickLink").innerHTML = "";
		} ;

},false);
