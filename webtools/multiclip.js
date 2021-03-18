// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md

document.addEventListener("DOMContentLoaded", function()
{  var searchParams = new URLSearchParams(window.location.search);
   someid = searchParams.get("ls");
   document.getElementById("localStoreKey").value = someid;
   check_version();
   
   // var page = searchParams.get("p") || searchParams.get("page") ;
   // document.getElementById("localStoreKeyPage").value = page ; 
    
   var keyFilter = searchParams.get("kf") || searchParams.get("keyFilter") ;  
   var valueFilter = searchParams.get("vf") || searchParams.get("valueFilter") ; 
   reFreshTable( keyFilter , valueFilter);} );

document.getElementById("mylocalStore").addEventListener("click",function()
{
    var my_table_node = document.getElementById(event.target.id).parentElement.parentElement.children ;

    for ( var i=0 ; i < my_table_node.length; i++)
      { my_table_node[i].firstElementChild.style.color = "black";
        my_table_node[i].firstElementChild.nextSibling.style.color = "black"; }

   	if ( event.target.id.substring(0,6) === "lsKey_" )
    { document.getElementById(event.target.id).style.color = "blue";
      document.getElementById(event.target.id).parentElement.firstElementChild.nextSibling.style.color = "blue" ;
      document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
	  
	  document.getElementById("feed_box").value = 
					localStorage.getItem( ":j35mc:" + document.getElementById("localStoreKeyPage").value 
							+ ":"  +  event.target.id.split("_")[1] );   	  
							
    };

    if ( event.target.id.substring(0,6) === "lsVal_" )
    { document.getElementById(event.target.id).style.color = "blue";
      document.getElementById(event.target.id).parentElement.firstElementChild.style.color = "blue";
      document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
      document.getElementById("feed_box").value = 
					localStorage.getItem(  ":j35mc:" + document.getElementById("localStoreKeyPage").value 
							+ ":"  +   event.target.id.split("_")[1]  );
	  copyTo()
    };


});

function delPair()
{
  var someid1 = ":j35mc:" + document.getElementById("localStoreKeyPage").value 
							+ ":"  + document.getElementById("localStoreKey").value ;
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
  if ( someid1.includes("_") ) { alert ("Key included '_' is NOT allowed");  return; }
  if ( someid1.includes(":") ) { alert ("Key included ':' is NOT allowed");  return; }
  // TODo some users may use ':' before the updated....
  

  if ( someid1 != '' )
          {
		  someid1 = ":j35mc:" + document.getElementById("localStoreKeyPage").value 
							+ ":"  + document.getElementById("localStoreKey").value ;		
			  
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
   {  
   var lastVersion = localStorage.getItem( ":j35mc:_version" );
   Object.keys( localStorage ).forEach( 
		function(key) { localStorage.removeItem( key ); } );
   localStorage.setItem( ":j35mc:_version", lastVersion ); 
   var mylocalStore = document.getElementById("mylocalStore");
   html_table_header("mylocalStore");
   document.getElementById("feed_box").value = "" ;
   };

if ( document.getElementById("localStoreKey").value === '_tojson'  || 
		document.getElementById("localStoreKey").value === '_tojsonF'
	)
  {   var myObjs = [] ;
      addItem = Object.create( {} );
      Object.keys( localStorage ).forEach( function(key) {
		    if ( key.split(":")[2].includes("_") )  return;  // skip;
             addItem = { "Key" : key.split(":")[2] + ":" + key.split(":")[3]  
					, "Value" : localStorage.getItem(key) } ;
             myObjs.push(addItem);  } )  // eo forEach
       var jsonFeed = JSON.stringify(myObjs) ;
	   
	   if ( document.getElementById("localStoreKey").value === '_tojson' ) 
			jsonFeed = jsonFeed.replace("[","'[").replace("]","]'") ;

      document.getElementById("feed_box").value = jsonFeed ;
  };  // eo _tojson

  if ( document.getElementById("localStoreKey").value === '_fromjson'  ||
		document.getElementById("localStoreKey").value === '_fromjsonF'
	) {  
	fromJSON( document.getElementById("localStoreKey").value, 
				document.getElementById("feed_box").value  );					
	}  // eo _fromjson
	
	if ( document.getElementById("localStoreKey").value === '_lspage' ){
		var myObjs = [] ;
		addItem = Object.create( {} );
		Object.keys( localStorage ).forEach( function(key) {
			 if ( key.split(":")[2].includes("_") )  return;  
		
			myObjs.push( key.split(":")[2] );
			myObjs.sort();
			var uniqueArray = Array.from(new Set(myObjs));
			var jsonFeed = JSON.stringify(uniqueArray) ;  
			document.getElementById("feed_box").value = "Page(s): " +jsonFeed ;		
		
			} )
	} //eo _lspage
	
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



function reFreshTable(keyFilter, storeFilter)
  {
   	
	var mylocalStore = document.getElementById("mylocalStore");
    html_table_header("mylocalStore");
	
	var checkStringKey = new RegExp(keyFilter,"g");
	if ( keyFilter == null ) { checkStringKey = RegExp("","g") };
	
	var checkStringValue = new RegExp(storeFilter,"g");
	if ( storeFilter == null ) { checkStringValue = RegExp("","g") };
 	
	// alert ( "kf :" + keyFilter + "-->" + checkStringKey );

    Object.keys( localStorage ).forEach( function(key,value)
	{  if ( key.split(":")[2] != document.getElementById("localStoreKeyPage").value )
		{ // alert ("skip" + key.split(":")[2] ) ; 
	      return };
		
		if ( ! checkStringKey.test(key.split(":")[3]) ) 
				{ 
				// alert (" test case on " + checkStringKey + ":"  + key.split(":")[3]); 
				return } ;
			
		if 	( ! checkStringValue.test(localStorage.getItem( key ) ) ) 
		        { 
				//  alert ("TEST " + localStorage.getItem(key ) ); 
				return;}
		
		    var rowNum = mylocalStore.insertRow();
            var keyCell = rowNum.insertCell(0);
            keyCell.innerHTML =  key.split(":")[3]  ;
            keyCell.id = "lsKey_"+  key.split(":")[3]  ;
            var localStorgeString = localStorage.getItem( key );
            var keyCell2 = rowNum.insertCell(1);
            keyCell2.innerHTML = localStorgeString.substring(0,10) + '...' ;
            keyCell2.id = "lsVal_"+ key.split(":")[3]  ; 
	} )

  } ;  // eo function reFreshTable;
     
  
function  check_version()
{
var myversion = localStorage.getItem(":j35mc:_version");

if ( myversion === null )  
	{ alert ("Multiclip is about to upgrade to 2.0 "); 
		  Object.keys( localStorage ).forEach( function(key,value) {
				if (key.substring(0, 6) != ":j35mc:")  
				{ // alert ( "upgrade " + key );
					var swap_value = localStorage.getItem( key );
					localStorage.setItem( ":j35mc:page1:"+key, swap_value );
					localStorage.removeItem(key);
				}
			  
		  } )
	alert ("upgrade Done!!");	  
	localStorage.setItem( ":j35mc:_version", "2.0" );
	return };

if ( myversion === "2.0" )
	{
	localStorage.setItem( ":j35mc:_version", "2.1" );
	alert ("Multiclip is about to upgrade to 2.1 \n" +
            "You may use keyFilter and valueFilter in search box to do fitlering\n" +
			"e.g. https://j35tor.github.io/webtools/multiclip.html?keyFilter=a&valueFilter=b"
	);
		
	}
	
if ( myversion === "2.1" )
	{
	localStorage.setItem( ":j35mc:_version", "2.2" );
	alert ("Multiclip is about to upgrade to 2.2 \n" +
            "Now multiclip is supporting dump stored content as json \n" +
			"And restore dump from reading json file"
	);
		
	}	


// alert ( "Version Checked" ) ;
};
  
function switchPage() 
{ 
var someid1 = document.getElementById("localStoreKeyPage").value ;

if ( someid1.includes(":") )
     {
		  if ( someid1 === ':list' )
                {
                var myObjs = [] ;
                ddItem = Object.create( {} );
                Object.keys( localStorage )
						.forEach( function(key) {
                            addItem = key.split(":")[2] ;
                            if ( addItem[0] != "_" )  { myObjs.push(addItem); }  })  // eo forEach

                var myObjs_uniq = myObjs
						.filter( function(item, pos) { return myObjs.indexOf(item) == pos } );
                var jsonFeed = myObjs_uniq.toString();
				document.getElementById("feed_box").value = "Page: " + jsonFeed ;		
				
				return; }
		/// All :command catched		
	    alert ("Page name included ':' is NOT allowed");  return; }

reFreshTable(); }


function fromJSON( fromJSON_type, content ){ 

var myObjs = [] ; 
var jsonFeed = content ;

if ( fromJSON_type === '_fromjson' ) 
	jsonFeed = jsonFeed.replace("'[","[").replace("]'","]") ;

myObjs = JSON.parse( jsonFeed );
Object.keys( myObjs ).forEach( function(key) {
	localStorage.setItem( ":j35mc:" + myObjs[key].Key , myObjs[key].Value );
    } );

document.getElementById("feed_box").value = 
	"(Restore is completed,\n you may clear this message by clear button)";
reFreshTable();
}


// function toJSON() {} 


FileReaderJS.setupInput(document.getElementById('loadDocument'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		// document.getElementById("feed_box").value = event.target.result ;
		fromJSON( "fromDump", event.target.result );		
      }
    }
  })


document.getElementById('saveDocument').onclick = function () {
    // Save Dialog
    let fname = window.prompt("Save as...")

    // Check json extension in file name
    if (fname.indexOf(".") === -1) {
      fname = fname + ".json"
    } else {
      if (fname.split('.').pop().toLowerCase() === "json") {
        // Nothing to do
      } else {
        fname = fname.split('.')[0] + ".json"
      }
    }
	
	var myObjs = [] ;
    addItem = Object.create( {} );
    Object.keys( localStorage ).forEach( function(key) {
		if ( key.split(":")[2].includes("_") )  return;  // skip;
        addItem = { "Key" : key.split(":")[2] + ":" + key.split(":")[3]  
			, "Value" : localStorage.getItem(key) } ;
        myObjs.push(addItem);  } )  // eo forEach
			 
			 
    // var jsonFeed = JSON.stringify(myObjs) ;
	const blob = new Blob([ JSON.stringify(myObjs) ], 
			{type: 'application/json;charset=utf-8'})

	// const blob = new Blob([ document.getElementById("feed_box").value ], {type: 'application/json;charset=utf-8'})
    saveAs(blob, fname);
	document.getElementById("feed_box").value = 
	"(Dump is completed,\n you may clear this message by clear button)";
}	