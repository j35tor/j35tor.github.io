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
	document.getElementById("read_blks").innerHTML = '100 %' ;     
        document.getElementById("checksumOut").innerHTML =  gen_checksum ;


   if   ( gen_checksum == document.getElementById("checksum").value )
          { document.getElementById("ok").innerHTML = "&#10004; CheckSum Good! " ;
            document.getElementById("checksumOut").style.color="#0000FF";

          }
     else { document.getElementById("ok").innerHTML = "&#10007; CheckSum Failed!!"
            document.getElementById("checksumOut").style.color="#FF4000";}

      };

      reader.onerror = function (evt) {
        console.error("An error ocurred reading the file",evt);
      };
      reader.readAsArrayBuffer(file);
      }

},false);


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
