// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md
//
function onReady() {
		var searchParams = new URLSearchParams(window.location.search);
		//  var initPage = searchParams.get("page");
		//  document.getElementById("localStoreKeyPage").value = initPage;
		check_version();
		//  var keyFilter = searchParams.get("kf") || searchParams.get("keyFilter") ;
		//  var valueFilter = searchParams.get("vf") || searchParams.get("valueFilter") ;
		readPageCombo();
		// reFreshTable( keyFilter , valueFilter);
		setColwidth();

		reFreshTable()
		}

if (document.readyState !== "loading") {
    onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}

document.getElementById("pageTag").addEventListener("change", () => {
			reFreshTable ("","", 1 );

} )

/*
document.getElementById("pageTag").addEventListener("click", () => {
	document.getElementById("localStoreKey").value = "_lspage";
	clearKey();
	document.getElementById("localStoreKey").value = "";
	} )
*/



/*
document.getElementById("keyHeader").addEventListener("click",function() {

	//  alert ("AAAA");


	} , false );  */


document.getElementById("mylocalStore").addEventListener("click",function() {
    var my_table_node = document.getElementById(event.target.id).parentElement.parentElement.children ;

    for ( var i=0 ; i < my_table_node.length; i++)
      { my_table_node[i].firstElementChild.style.color = "black";
        my_table_node[i].firstElementChild.nextSibling.style.color = "black"; }

   	if ( event.target.id.substring(0,6) === "lsKey_" ) {
		document.getElementById(event.target.id).style.color = "blue";
		document.getElementById(event.target.id).parentElement
				.firstElementChild.nextSibling.style.color = "blue" ;
		document.getElementById("localStoreKey").value = event.target.id.split("_")[1] ;

		document.getElementById("feed_box").value =
					localStorage.getItem( ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  +  event.target.id.split("_")[1] );

    };

    if ( event.target.id.substring(0,6) === "lsVal_" ) {
		document.getElementById(event.target.id).style.color = "blue";
		document.getElementById(event.target.id).parentElement
				.firstElementChild.style.color = "blue";
		document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
		document.getElementById("feed_box").value =
					localStorage.getItem(  ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  +   event.target.id.split("_")[1]  );
		copyTo()
		};

	if ( event.target.id === "filterKey" ) {
		// reFreshTable( document.getElementById("feed_box").value , "" );
		var filterKey = window.prompt ("Please Input Filter for Keys" );
		reFreshTable( filterKey , "" );
		};

	if ( event.target.id === "filterValue" ) {
		// reFreshTable( "" , document.getElementById( "feed_box").value );
		var filterValue = window.prompt ("Please Input Filter for Values" );
			reFreshTable( "" , filterValue );
		};

	if ( event.target.id === "keyHeader" ) {
		reFreshTable( "" , "" , 1 );
	};
});

function delPair()  {

	if  ( ! document.getElementById("delConfirm").checked  ) {
			let sure2Kill = window.confirm( "Really delete selected Key-Box Pair ?" );
			if ( ! sure2Kill )  return  ;
		}


	var someid1 = ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  + document.getElementById("localStoreKey").value ;
	localStorage.removeItem( someid1 );
	document.getElementById("localStoreKey").value = "";
	document.getElementById("feed_box").value = "";
	document.getElementById("delConfirm").checked = false ;
	reFreshTable();
	}

function readPageCombo() {
	var myObjs = [] ;
	addItem = Object.create( {} );
	Object.keys( localStorage ).forEach( function(key) {
				if ( key.split(":")[2].includes("_") )  return;
		myObjs.push( key.split(":")[2] );
	      })

		myObjs.sort();
		var uniqueArray = Array.from(new Set(myObjs));
		var list = document.getElementById("pageTag");
		uniqueArray.forEach( (item, i) => {
								// alert (item ) ;
								var option = document.createElement("option");
								option.text =  item ;
								option.value =  item ;
								list.add(option) ;
							} )


		}

function copyTo() {
	var copyText = document.getElementById("feed_box");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
	};


function storeValue() {
	var someid1 = document.getElementById("localStoreKey").value ;
	if ( someid1.includes("_") ) { alert ("Key included '_' is NOT allowed");  return; }
	if ( someid1.includes(":") ) { alert ("Key included ':' is NOT allowed");  return; }
	// TODo some users may use ':' before the updated....
	if ( someid1 === '' ) return;

	if  ( document.getElementById("pageTag").value === "(new)" ) {
		let newPage = window.prompt("Please input name for new page");

		if ( newPage.includes("_") ) { alert ("Page Name included '_' is NOT allowed");  return; }
		if ( newPage.includes(":") ) { alert ("Page Name included ':' is NOT allowed");  return; }

		someid1 = ":j35mc:" + newPage + ":"
				+ document.getElementById("localStoreKey").value ;
		localStorage.setItem( someid1, document.getElementById("feed_box").value );
		readPageCombo();
		document.getElementById("pageTag").value = newPage ;
		reFreshTable();
		return;
	}


	if ( someid1 != '' ) {
			someid1 = ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  + document.getElementById("localStoreKey").value ;

			if ( localStorage.getItem( someid1 ) != null ) { // Old data found
						if  ( localStorage.getItem( someid1 ) !=   // if found data mismatch feedbox
										document.getElementById("feed_box").value ) {
											  if ( ! window.confirm( "Overwrite old value ?") ) return;  //Check Overwrite
												// if user confirmed to Overwrite TextBox
												localStorage.setItem( someid1, document.getElementById("feed_box").value );
												reFreshTable(); return;
												} ;
								alert ("Same value in TextBox has been found");
								return ; //	 skip when new value is equal stored value

						}

				//======
      localStorage.setItem( someid1, document.getElementById("feed_box").value );
      reFreshTable();
		}

	}

/*
function clearText() {
	document.getElementById("feed_box").value = "" ;
	}
*/

function boxclear(myElementId) {
	document.getElementById(myElementId).value = '';
	}



function clearKey() {
if ( document.getElementById("localStoreKey").value === '_killall' ) {
	let sure2Kill = window.confirm( "\u2b9a" + "REALLY to KILL ALL !?" + "\u2b98" );
	if ( ! sure2Kill )  return  ;

	var lastVersion = localStorage.getItem( ":j35mc:_version" );
	Object.keys( localStorage ).forEach(
		function(key) { localStorage.removeItem( key ); } );
	localStorage.setItem( ":j35mc:_version", lastVersion );
	var mylocalStore = document.getElementById("mylocalStore");
	html_table_header("mylocalStore");
	document.getElementById("feed_box").value = "" ;
	};
/*
if ( document.getElementById("localStoreKey").value === '_tojson'  ||
		document.getElementById("localStoreKey").value === '_tojsonF'
	) {
		var myObjs = [] ;
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

if ( document.getElementById("localStoreKey").value === '_lspage' ) {
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
*/
if 	( document.getElementById("localStoreKey").value === '_help' ) {
	document.getElementById("feed_box").value =
				"_help : print this help \n"
			+	"_killall : KILL ALL contents (CAUTION) \n"
//			+	"_tojsonF : dump content in Box as json file \n"
//			+	"_fromjsonF : restore content from Box \n"
//			+	"_lspage : list page(s) (same as click page)\n"
			+ "_width : set TextBox width <mum> \n \t e.g. _width:10 \n"
			;

	};



if 	( document.getElementById("localStoreKey").value.split(":")[0] == '_width' ) {

	var  number = document.getElementById("localStoreKey").value;
	// alert ( document.getElementById("localStoreKey").value.split(":")[1]  );

	var new_width = document.getElementById("localStoreKey").value.split(":")[1] ;

	if ( isNaN(new_width) ) new_width = 20 ;
	if ( new_width >= 255 || new_width <= 0  ) new_width = 20 ;

	localStorage.setItem( ":j35mc:_colwidth" ,  new_width );
	reFreshTable("","",1);

	};

    document.getElementById("localStoreKey").value = "" ;
}

function setColwidth(input) {
			if ( input === undefined ) {
					if ( localStorage.getItem( ":j35mc:_colwidth" ) >= 0 )  return;

					localStorage.setItem( ":j35mc:_colwidth",20 );
					return;
					}
			localStorage.setItem( ":j35mc:_colwidth", input );
			}


function html_table_header(localID) {
	var mylocalStore = document.getElementById(localID);
	document.getElementById(localID).innerHTML = "";

	var tableHeader =   mylocalStore.insertRow() ;
	var keyHeaderCell = tableHeader.insertCell(0) ;
	keyHeaderCell.innerHTML = "Key" ;
	keyHeaderCell.id = "keyHeader" ;
	var valueHeaderCell = tableHeader.insertCell(1) ;
	// valueHeaderCell.innerHTML = "Value" ;  //DDDD
	valueHeaderCell.innerHTML = "TextBox" ;
	valueHeaderCell.id = "valueHeader"
	}



function reFreshTable( keyFilter, storeFilter ,  sorting ) {

	var mylocalStore = document.getElementById("mylocalStore");
    html_table_header("mylocalStore");

	var checkStringKey = new RegExp(keyFilter,'') ;
	if ( keyFilter === null ) checkStringKey = new RegExp("",'') ;

	// alert ("MyValue :" + keyFilter  );

	var checkStringValue = new RegExp(storeFilter,'');
	if ( storeFilter === null ) checkStringValue = RegExp("",'') ;

	// filter Block
	var rowNum = mylocalStore.insertRow();
	var keyCell = rowNum.insertCell(0);

	keyCell.innerHTML = "Filter:" + checkStringKey ;    //+ "<br />" + checkStringKey ;
	keyCell.style.color = "red";   // keyCell.style.backgroundColor = "red";
	keyCell.id = "filterKey";
	var keyCell2 = rowNum.insertCell(1);
	keyCell2.innerHTML = "Filter:" + checkStringValue ; // + "<br />" + checkStringValue ;
	keyCell2.style.color = "red";
	keyCell2.id = "filterValue";
	//  eo filter block

	var colwidth = localStorage.getItem(":j35mc:_colwidth");
	var tailDot = '...' ;

	if (sorting  === 1 ) {

		var myObjs = [] ;
		Object.keys( localStorage ).forEach( function(key,value) {
			if ( key.split(":")[2] != document.getElementById("pageTag").value )  return ;
			myObjs.push( key.split(":")[3] );
			} )

		myObjs.sort();

		// var colwidth = localStorage.getItem(":j35mc:_colwidth")
		Object.keys( myObjs ).forEach( (key) =>  {
				// alert ( myObjs[key] );
				// var colwidth = localStorage.getItem(":j35mc:_colwidth")
				tailDot = '...' ;
				var rowNum = mylocalStore.insertRow();
				var keyCell = rowNum.insertCell(0);
				keyCell.innerHTML = myObjs[key] ;
				keyCell.id = "lsKey_"+ myObjs[key] ;

				var localStorgeString = localStorage.getItem( ":j35mc:"
					+ document.getElementById("pageTag").value
					+ ":"  +  myObjs[key] );

				var keyCell2 = rowNum.insertCell(1);

				if  ( localStorgeString.length <= colwidth ) tailDot = '';

				keyCell2.innerHTML = localStorgeString.substring(0,colwidth) + tailDot ;
				keyCell2.id = "lsVal_"+ myObjs[key]  ;

				} )


		return; };


    Object.keys( localStorage ).forEach( function(key,value) {
				if ( key.split(":")[2] != document.getElementById("pageTag").value )
						return ;  // skip pairs when the page is NOT matched

				if ( ! ( checkStringKey.test(key.split(":")[3]) ) )
						return  ;  // skip pairs when key is NOT matched

				if 	( ! checkStringValue.test(localStorage.getItem( key ) ) )
						return ;  // skip pairs when Value is NOT matched

				// var colwidth = localStorage.getItem(":j35mc:_colwidth")
				tailDot = '...' ;
				var rowNum = mylocalStore.insertRow();

    		var keyCell = rowNum.insertCell(0);
    				keyCell.innerHTML =  key.split(":")[3]  ;
    				keyCell.id = "lsKey_"+  key.split(":")[3]  ;

    		var localStorgeString = localStorage.getItem( key );
    		var keyCell2 = rowNum.insertCell(1);
						if  ( localStorgeString.length <= colwidth ) tailDot = '' ;
        		keyCell2.innerHTML = localStorgeString.substring(0,colwidth) + tailDot ;
        		keyCell2.id = "lsVal_"+ key.split(":")[3]  ;
	} )

  } ;  // eo function reFreshTable;


function  check_version() {
var myversion = localStorage.getItem(":j35mc:_version");

if (  ( myversion === null )  &&  localStorage.length >= 1    ) {

		alert ('Your stored data will be put under "page1" ');
		Object.keys( localStorage ).forEach( function(key,value) {
				if (key.substring(0, 6) != ":j35mc:") {
					// alert ( "upgrade " + key );
					var swap_value = localStorage.getItem( key );
					localStorage.setItem( ":j35mc:page1:"+key, swap_value );
					localStorage.removeItem(key);
					}
				} )
		alert ("upgrade Done!!");
		localStorage.setItem( ":j35mc:_version", "2.0" );
		return
		};
if ( myversion === null ) {
		//  alert ("Welcome");  // if this client is first time access
		localStorage.setItem( ":j35mc:_version", "2.0" );
		return ;}


if ( myversion === "2.0" )
	{
	localStorage.setItem( ":j35mc:_version", "2.1" );
	alert ("Multiclip is about to upgrade to 2.1 \n" +
            "You may use keyFilter and valueFilter in search box to do fitlering\n" +
			"e.g. https://j35tor.github.io/webtools/multiclip.html?keyFilter=a&valueFilter=b"
	);

	}


// alert ( "Version Checked" ) ;
};

function switchPage()  {
	var someid1 = document.getElementById("pageTag").value ;
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
	"(Restore is completed,\n Please REMEMBER press 'Refresh' buttom reload page )";
reFreshTable();
}


// function toJSON() {}


function box2File() {

	let fname = window.prompt("Save as...");

	const blob = new Blob([ document.getElementById("feed_box").value ],
					{type: 'text/plain;charset=utf-8'})

	// saveAs( document.getElementById("feed_box").value , fname);
	saveAs( blob , fname);
    document.getElementById("feed_box").value =
	"(Dump is completed,\n you may clear this message by &#10060; button)";

	}

function dump2box () {
	var myObjs = [] ;
	addItem = Object.create( {} );
	Object.keys( localStorage ).forEach( function(key) {
		if ( key.split(":")[2].includes("_") )  return;  // skip;
        addItem = { "Key" : key.split(":")[2] + ":" + key.split(":")[3]
					, "Value" : localStorage.getItem(key) } ;
        myObjs.push(addItem);
		} )  // eo forEach

	var jsonFeed = JSON.stringify(myObjs) ;
	document.getElementById("feed_box").value = jsonFeed ;
	};


function box2Store() {

	if  ( document.getElementById("feed_box").value.substr(0,8) != '[{"Key":' ) {
	alert ( "Invalid input to restore" );
	boxclear("feed_box");
 	return;
	}

	fromJSON( "_fromjsonF", document.getElementById("feed_box").value  )
	};


FileReaderJS.setupInput(document.getElementById('file2Box'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		document.getElementById("feed_box").value = event.target.result ;
		// fromJSON( "fromDump", event.target.result );
      }
    }
  })



FileReaderJS.setupInput(document.getElementById('loadDocument'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		// document.getElementById("feed_box").value = event.target.result ;
		fromJSON( "fromDump", event.target.result );
      }
    }
  });


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
	'(Dump is completed,\n you may clear this message by clear button "X" )';
}

function encBox(inputTXT) {
	// alert (inputTXT.value);

	if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;

	var encTXT = symGnuPG_enc( inputTXT.value );
	Promise.resolve( encTXT ).then ( val => {
			document.getElementById("feed_box").value = val.data ;
			} );
}


/*
document.getElementById('contentEnc2Box').onclick = function () {

	var myObjs = [] ;
    addItem = Object.create( {} );
    Object.keys( localStorage ).forEach( function(key) {
		if ( key.split(":")[2].includes("_") )  return;  // skip;
        addItem = { "Key" : key.split(":")[2] + ":" + key.split(":")[3]
			, "Value" : localStorage.getItem(key) } ;
        myObjs.push(addItem);  } )  // eo forEach

	//  const blob = new Blob([ JSON.stringify(myObjs) ],
	//				{type: 'application/json;charset=utf-8'}) ;

	// const encTXT = symGnuPG_enc(blob);
	const encTXT = symGnuPG_enc( JSON.stringify(myObjs));

	Promise.resolve( encTXT ).then ( val => {
			document.getElementById("feed_box").value = val.data ;
			} );

	};
*/

async function symGnuPG_enc( inputTXT ) {

	if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;

  var feed = document.getElementById("encKey").value;
  //// DEBUG:   console.log(feedintext2);
  const options = {
       message : window.openpgp.message.fromText(inputTXT) ,
       passwords : feed ,
       armor : true
   }
   //// DEBUG:  alert ("options.feed ==>>>>" + options.passwords );

   const encText = await window.openpgp.encrypt(options);

   /// DEBUG:  console.log("encText \n " + encText.data );
   return (encText);
}


async function symGnuPG_dec( inputTXT ) {
	//  function symGnuPG_dec()

		if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;


  var feed = document.getElementById("encKey").value;
  //// DEBUG:   console.log(feed);
  //// DEBUG:   console.log(feedintext2);

  const options = {
       message : await openpgp.message.readArmored( inputTXT.value ) ,
       passwords : feed // ,
       // armor : true
   }

    try { var outText = await window.openpgp.decrypt(options) ;
           document.getElementById("feed_box").value = outText.data ;
           return (outText);
           }
    catch  (err) { alert (err.message )  }
}
