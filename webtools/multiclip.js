// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md

document.addEventListener("DOMContentLoaded", function()
{  var searchParams = new URLSearchParams(window.location.search);
   someid = searchParams.get("ls");
   document.getElementById("localStoreKey").value = someid;
   reFreshTable(); });


document.getElementById("mylocalStore").addEventListener("click",function()
{
    var my_table_node = document.getElementById(event.target.id).parentElement.parentElement.children ;

    for ( var i=0 ; i < my_table_node.length; i++)
      { my_table_node[i].firstElementChild.style = "black";
        my_table_node[i].firstElementChild.nextSibling.style = "black"; }

   	if ( event.target.id.substring(0,6) === "lsKey_" )
    { document.getElementById(event.target.id).style.color = "blue";
      document.getElementById(event.target.id).parentElement.firstElementChild.nextSibling.style.color = "blue" ;
      document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
      document.getElementById("feed_box").value = localStorage.getItem( event.target.id.split("_")[1]   );
    };

    if ( event.target.id.substring(0,6) === "lsVal_" )
    { document.getElementById(event.target.id).style.color = "blue";
      document.getElementById(event.target.id).parentElement.firstElementChild.style.color = "blue";
      document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
      document.getElementById("feed_box").value = localStorage.getItem( event.target.id.split("_")[1] );
    };


});

function delPair()
{
  var someid1 = document.getElementById("localStoreKey").value ;
  localStorage.removeItem( someid1 );
  document.getElementById("localStoreKey").value = "";
  document.getElementById("feed_box").value = "";
  reFreshTable();
}

function copyTo()
{
  var copyText = document.getElementById("feed_box");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
};


function storeValue()
{
  var someid1 = document.getElementById("localStoreKey").value ;
  if ( someid1 != '' )
          {
          localStorage.setItem( someid1, document.getElementById("feed_box").value );
          reFreshTable(); }
}

function clearText()
{
  document.getElementById("feed_box").value = "" ;
}

function clearKey()
{
if ( document.getElementById("localStoreKey").value === '_killall' )
   {  Object.keys( localStorage ).forEach( function(key) { localStorage.removeItem( key ); } )
   var mylocalStore = document.getElementById("mylocalStore");
   html_table_header("mylocalStore");
   document.getElementById("feed_box").value = "" ;
   };

if ( document.getElementById("localStoreKey").value === '_tojson' )
  {   var myObjs = [] ;
      addItem = Object.create( {} );
      Object.keys( localStorage ).forEach( function(key) {
             addItem = { "Key" : key , "Value" : localStorage.getItem(key) } ;
             myObjs.push(addItem);  } )  // eo forEach
       var jsonFeed = JSON.stringify(myObjs) ;
       jsonFeed = jsonFeed.replace("[","'[").replace("]","]'") ;

      document.getElementById("feed_box").value = jsonFeed ;
  };  // eo _tojson

  if ( document.getElementById("localStoreKey").value === '_fromjson' )
    {   var myObjs = [] ;  //  alert ("_fromjson") ;
        var jsonFeed = document.getElementById("feed_box").value ;
        jsonFeed = jsonFeed.replace("'[","[").replace("]'","]") ;

        myObjs =  JSON.parse( jsonFeed );
        Object.keys( myObjs ).forEach( function(key) {
            localStorage.setItem( myObjs[key].Key , myObjs[key].Value );
        } )
        reFreshTable();
    }  // eo _fromjson
    document.getElementById("localStoreKey").value = "" ;
}



function html_table_header(localID)
{
  var mylocalStore = document.getElementById(localID);
  document.getElementById(localID).innerHTML = "";
  var tableHeader =   mylocalStore.insertRow() ;
  var keyHeaderCell = tableHeader.insertCell(0) ;
  keyHeaderCell.innerHTML = "Key" ;
  keyHeaderCell.id = "keyHeader" ;
  var valueHeaderCell = tableHeader.insertCell(1) ;
  valueHeaderCell.innerHTML = "Value" ;
  valueHeaderCell.id = "valueHeader"
}



function reFreshTable()
  {
    var mylocalStore = document.getElementById("mylocalStore");
    html_table_header("mylocalStore");

    Object.keys( localStorage ).forEach( function(key,value)
          { var rowNum = mylocalStore.insertRow();
            var keyCell = rowNum.insertCell(0);
            keyCell.innerHTML = key ;
            keyCell.id = "lsKey_"+ key ;
            var localStorgeString = localStorage.getItem( key );
            var keyCell2 = rowNum.insertCell(1);
            keyCell2.innerHTML = localStorgeString.substring(0,10) + '...' ;
            keyCell2.id = "lsVal_"+ key ;  })

  } ;  // eo function reFreshTable;
