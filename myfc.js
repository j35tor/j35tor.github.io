document.getElementById("filetoRead").addEventListener("change",function()

{
  var file = this.files[0];
  if (file) {

    var reader = new FileReader();
    
     reader.onprogress = updateProgress;

      reader.onload = function (evt)
      {
        var arrayBuffer = reader.result;
        var gen_checksum = sha1(arrayBuffer);
		var feedChecksum = document.getElementById("checksum").value.trim().toLowerCase();
		
		document.getElementById("read_blks").innerHTML = '100 %' ;		
		document.getElementById("checksumOut").innerHTML =  gen_checksum ;
		document.getElementById("feedChecksum").innerHTML =  feedChecksum ;
		document.getElementById("checksumOut").style.border="2px solid black";
		

   if   ( gen_checksum === feedChecksum )
          { document.getElementById("ok").innerHTML = "CheckSum Matched! &#10004;" ;
            document.getElementById("ok").style.color="#0000FF"; 	
			document.getElementById("feedChecksum").style.border="2px solid black"; }
			
		else if ( document.getElementById("checksum").value.trim() != "" )
					{ 	document.getElementById("ok").innerHTML = "CheckSum Mismatch !! &#10007;"
						document.getElementById("ok").style.color="#FF4000"; 
						document.getElementById("feedChecksum").style.border="2px solid black";  }
						
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


function handleDragOver(evt)
  {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // show as copy
  }


document.getElementById("sha1table").addEventListener("click",function()
{
    document.getElementById("checksumOut").innerHTML = "" ;
	document.getElementById("feedChecksum").innerHTML = "" ;
	document.getElementById("ok").innerHTML = "Checksum status: unknown" ;
	
	document.getElementById("checksumOut").style.border="0px solid black";
	document.getElementById("feedChecksum").style.border="0px solid black";
	
	document.getElementById("checksum").value =  "" ;
	document.getElementById("checksumFile").value =  "" ;

	if ( event.target.innerHTML.length < 18 )
	{ 
	document.getElementById("quickLink").href =  "./" +  event.target.innerHTML ;
	// document.getElementById("quickLink").innerHTML = event.target.innerHTML ;
	document.getElementById("quickLink").innerHTML =  "_" ;
	} 
	else if  //  ( event.target.innerHTML.length < 40 ) 
		 ( event.target.innerHTML.toString().slice(0,2) === "/s" )
		
			{  //  alert ("That me " + event.target.cellIndex ); 
					document.getElementById("quickLink").href =  event.target.innerHTML ;
					document.getElementById("quickLink").innerHTML =  "_" ;
					navigator.clipboard.writeText(event.target.innerHTML);
			}
	
	else 	
	{	
	document.getElementById("checksum").value =  event.target.innerHTML ;
 	document.getElementById("checksumFile").value =  event.target.id ;
	document.getElementById("quickLink").href =  "./" ; 
	document.getElementById("quickLink").innerHTML = "";

	} ;
	
},false);