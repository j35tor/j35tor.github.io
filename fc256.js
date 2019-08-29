document.getElementById("filetoRead").addEventListener("change",function()

{
  var file = this.files[0];
  if (file) {

    var reader = new FileReader();

      reader.onload = function (evt)
      {
        var arrayBuffer = reader.result;
        var gen_checksum = sha256(arrayBuffer);
        document.getElementById("checksumOut").innerHTML =  gen_checksum ;


   if   ( gen_checksum == document.getElementById("checksum").value )
          { document.getElementById("ok").innerHTML = "&#10004;" ;
            document.getElementById("checksumOut").style.color="#0000FF";

          }
     else { document.getElementById("ok").innerHTML = "&#10007;"
            document.getElementById("checksumOut").style.color="#FF4000";}

      };

      reader.onerror = function (evt) {
        console.error("An error ocurred reading the file",evt);
      };
      reader.readAsArrayBuffer(file);
      }

},false);