document.getElementById("filetoRead").addEventListener("change",function()

{
  var file = this.files[0];
  if (file) {

    var reader = new FileReader();
    
     reader.onprogress = updateProgress;

      reader.onload = function (evt)
      {
        var arrayBuffer = reader.result;
		var gen_checksum ;
			
		switch( document.getElementById("xxhsum").value ) 
		{
			case  "h32":  
				gen_checksum= XXH.h32().update( arrayBuffer ).digest().toString(16) ; 
				gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;
			break; 
			
			case  "h64":  
				gen_checksum= XXH.h64().update( arrayBuffer ).digest().toString(16) ; 
				gen_checksum = ( "0000000000000000" + gen_checksum ).slice(-16) ;
			break;
			

			default:
				gen_checksum= XXH.h64().update( arrayBuffer ).digest().toString(16) ; 
				gen_checksum = ( "0000000000000000" + gen_checksum ).slice(-16) ;
			break ; 
		}
		
			
		// if ( gen_checksum.length < 8 ) { 
		//     gen_checksum = ("0".repeat(8 - gen_checksum.length) + gen_checksum);  };
			 
		
		var feedChecksum = document.getElementById("checksum").value.trim().toLowerCase();
		
		document.getElementById("read_blks").innerHTML = '100 %' ;
		document.getElementById("feedChecksum").innerHTML =  feedChecksum ;	
        document.getElementById("checksumOut").innerHTML =  gen_checksum ;
		document.getElementById("checksumOut").style.border="2px solid black";

   if   ( gen_checksum === feedChecksum )
          { document.getElementById("ok").innerHTML = "CheckSum Matched! &#10004;" ;
            document.getElementById("ok").style.color="#0000FF"; 
	        document.getElementById("feedChecksum").style.border="2px solid black"; }
	      
		else if ( feedChecksum != "" )
					{ 	document.getElementById("ok").innerHTML = "CheckSum Mismatch !! &#10007;"
						document.getElementById("ok").style.color="#FF4000"; 
					 	document.getElementById("feedChecksum").style.border="2px solid black"; 
					}
			else {  document.getElementById("feedChecksum").innerHTML = "(missing)" }


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
if (evt.lengthComputable) 
{
var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
// Increase the progress bar length.
if (percentLoaded < 100) 
{ document.getElementById("read_blks").innerHTML =  percentLoaded + '%' ;  }
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





document.getElementById("checksum").addEventListener("mouseover",function()
{
    document.getElementById("checksumOut").innerHTML = "" ;
	document.getElementById("feedChecksum").innerHTML = "" ;
	document.getElementById("ok").innerHTML = "" ;
	
	document.getElementById("checksumOut").style.border="0px solid black";
	document.getElementById("feedChecksum").style.border="0px solid black";
},false);

document.getElementById("checksumOut").addEventListener("click",function()
{  navigator.clipboard.writeText( event.target.innerHTML); } ,false);  
// copy the checksum to clipboard