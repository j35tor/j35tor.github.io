// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md
//
function onReady() {
		var searchParams = new URLSearchParams(window.location.search);
		//  var initPage = searchParams.get("page");
		//  document.getElementById("localStoreKeyPage").value = initPage;
		
		var box_width = document.documentElement.clientWidth - 40;
		box_width = box_width + "px";
		document.getElementById('feed_box').style.width = box_width ;
		
		var inp_width =  document.documentElement.clientWidth / 3 ;
		document.getElementById('encKey').style.width = inp_width + 'px' ;



		
		check_version();
		//  var keyFilter = searchParams.get("kf") || searchParams.get("keyFilter") ;
		//  var valueFilter = searchParams.get("vf") || searchParams.get("valueFilter") ;
		readPageCombo();
		readPubKeyCombo();
		// reFreshTable( keyFilter , valueFilter);
		setColwidth();

		reFreshTable("","", 1 )
		}

if (document.readyState !== "loading") {
    onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}

document.getElementById("pageTag").addEventListener("change", () => {
			if (!document.getElementById("swapPageClear").checked ) {
						boxclear("localStoreKey");
						boxclear("feed_box");
					}

			reFreshTable ("","", 1 );

} )

function swapPageClearChange()
{

		if  (document.getElementById("swapPageClear").checked )
				 { document.getElementById("swapPageClearLock").innerHTML="&#128274;"; }
				else { document.getElementById("swapPageClearLock").innerHTML="&#128275;"; }

}


document.getElementById("mylocalStore").addEventListener("click",function() {
    var my_table_node = document.getElementById(event.target.id).parentElement.parentElement.children ;

    for ( var i=0 ; i < my_table_node.length; i++)
      { my_table_node[i].firstElementChild.style.color = "black";
        my_table_node[i].firstElementChild.nextSibling.style.color = "black"; }

		document.getElementById("valueHeader").style.color = "blue";
		document.getElementById("filterKey").style.color = "red" ;
		document.getElementById("filterValue").style.color = "red" ;

   	if ( event.target.id.substring(0,6) === "lsKey_" ) {
		document.getElementById(event.target.id).style.color = "blue";
		document.getElementById(event.target.id).parentElement
				.firstElementChild.nextSibling.style.color = "blue" ;

		var clickStoreKey = event.target.id.split("_")[1];
		if ( clickStoreKey.includes(":") ) {
					document.getElementById("localStoreKey").value = clickStoreKey.split(":")[1];
					document.getElementById("feed_box").value =
								localStorage.getItem( ":j35mc:" + clickStoreKey );
					return;
					}
		document.getElementById("localStoreKey").value = event.target.id.split("_")[1] ;

		document.getElementById("feed_box").value =
					localStorage.getItem( ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  +  event.target.id.split("_")[1] );

    };

    if ( event.target.id.substring(0,6) === "lsVal_" ) {
		document.getElementById(event.target.id).style.color = "blue";
		document.getElementById(event.target.id).parentElement
				.firstElementChild.style.color = "blue";

	 	var clickStoreKey = event.target.id.split("_")[1];
		if ( clickStoreKey.includes(":") ) {
				document.getElementById("localStoreKey").value = clickStoreKey.split(":")[1];
				document.getElementById("feed_box").value =
				localStorage.getItem( ":j35mc:" + clickStoreKey );
				copyTo();
				return;
				}

		document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
		document.getElementById("feed_box").value =
					localStorage.getItem(  ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  +   event.target.id.split("_")[1]  );
		copyTo()
		};

	if ( event.target.id === "filterKey" ) {
		// reFreshTable( document.getElementById("feed_box").value , "" );
		if ( document.getElementById("pageTag").value === "*" ) {
					alert ('filter for Keys with Page "*" is NOT allowed');
			return;
			}
		var filterKey = window.prompt ("Please Input Filter for Keys" );
		reFreshTable( filterKey , "" );
		};

	if ( event.target.id === "filterValue" ) {
		// reFreshTable( "" , document.getElementById( "feed_box").value );
		if ( document.getElementById("pageTag").value === "*" ) {
					alert ('filter for Boxes with Page "*" is NOT allowed');
			return;
			}
		var filterValue = window.prompt ("Please Input Filter for Box(es)" );
			reFreshTable( "" , filterValue );
		};

	if ( event.target.id === "keyHeader" ) {
		reFreshTable( "" , "" , 1 );
	};
});

function delPair()  {

	if ( document.getElementById("pageTag").value === "*" ) {
				alert ('Delete Key-Pair in Page "*" is NOT allowed');
		return;
		}

	if  ( ! document.getElementById("delConfirm").checked  ) {
			let sure2Kill = window.confirm( "Really delete selected Key-Box Pair ?" );
			if ( ! sure2Kill )  return  ;
		}
	var someid1 = ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  + document.getElementById("localStoreKey").value ;
	localStorage.removeItem( someid1 );
	document.getElementById("localStoreKey").value = "";
	document.getElementById("feed_box").value = "";
	// document.getElementById("delConfirm").checked = false ;
	reFreshTable("", "", 1 );
	}

function readPageCombo() {
	var myObjs = [] ;
	addItem = Object.create( {} );
	Object.keys( localStorage ).forEach( function(key) {
				//  if ( key.split(":")[2].includes("_") )  return ;
				if ( key.includes(":j35mc:_") )  return ;

		myObjs.push( key.split(":")[2] );
	      })

		myObjs.sort();
		var uniqueArray = Array.from(new Set(myObjs));
		var list = document.getElementById("pageTag");
		uniqueArray.forEach( (item, i) => {
								//alert (item ) ;
								var option = document.createElement("option");
								option.text =  item ;
								option.value =  item ;
								list.add(option) ;
							} )
		//===Pending the page with a wild card
		var wildCardOption =  document.createElement("option");
		wildCardOption.text =  "*" ;
		wildCardOption.value =  "*" ;
		list.add(wildCardOption);
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


function copyTo() {
	var copyText = document.getElementById("feed_box");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
	};


function storeValue() {

	if ( document.getElementById("feed_box").value.includes("<script") ) {
		alert ("your input is invalid, please use '&lt;' instead"); return;
		}

	var someid1 = document.getElementById("localStoreKey").value ;
	if ( someid1.includes("_") ) { alert ("Key included '_' is NOT allowed");  return; }
	if ( someid1.includes(":") ) { alert ("Key included ':' is NOT allowed");  return; }
	if ( someid1.includes("<") ) { alert ("Key included '<' is NOT allowed");  return; }
	// TODo some users may use ':' before the updated....
	if ( someid1 === '' ) return;

	if ( document.getElementById("pageTag").value === "*" ) {
		alert ("Unknown Page Name is NOT allow to append \n"
	  	+ "Please change to corresponding page for update/append");  return;
		}

	if  ( document.getElementById("pageTag").value === "(new)" ) {
		let newPage = window.prompt("Please input name for new page");

		if ( newPage.includes("_") ) { alert ("Page Name included '_' is NOT allowed");  return; }
		if ( newPage.includes(":") ) { alert ("Page Name included ':' is NOT allowed");  return; }
		if ( newPage.includes("*") ) { alert ("Page Name included '*' is NOT allowed");  return; }
		if ( newPage.includes("<") ) { alert ("Page Name included '<' is NOT allowed");  return; }

		someid1 = ":j35mc:" + newPage + ":"
				+ document.getElementById("localStoreKey").value ;
		localStorage.setItem( someid1, document.getElementById("feed_box").value );

		location.reload();
		readPageCombo();
		document.getElementById("pageTag").value = newPage ;
		reFreshTable("","", 1 );
		return;
	}


	if ( someid1 != '' ) {
			someid1 = ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  + document.getElementById("localStoreKey").value ;
			// TODO Beware of double-quote, in feed_box
			if ( localStorage.getItem( someid1 ) != null ) { // Old data found
				if  ( localStorage.getItem( someid1 ) !=   // if found data mismatch feedbox
						document.getElementById("feed_box").value ) {
							if ( ! window.confirm( "Overwrite old value ?") ) return;  //Check Overwrite
							// if user confirmed to Overwrite TextBox
							localStorage.setItem( someid1, document.getElementById("feed_box").value );
							reFreshTable("","",1); return;
							} ;
						alert ("Same value in Box has been found");
						return ; //	 skip when new value is equal stored value
						}
      localStorage.setItem( someid1, document.getElementById("feed_box").value );
      reFreshTable("","",1 );
	  }

	}


function boxclear(myElementId) {
	document.getElementById(myElementId).value = '';
	}

function storeChkSum () {
	var nowjson = store2json();
	document.getElementById("xxh32sum").innerHTML = localStorage.getItem( ":j35mc:_nowXXH32") ;

	if ( localStorage.getItem( ":j35mc:_nowXXH32")!= localStorage.getItem( ":j35mc:_feedXXH32") ) {
		alert ("The content of store has been changed, \n"
			+ "Please backup the change or perform the sync") ;

		document.getElementById("xxh32sum").style.color = "red";
		return;
		}

	document.getElementById("xxh32sum").style.color = "black";
	}

function clearKeyOver(){ }

function clearStore(){
		Object.keys( localStorage ).forEach(
		function(key) {
			 	if ( key.includes(":j35mc:_") ) return;
				localStorage.removeItem( key );
				} );
		localStorage.removeItem(":j35mc:_nowXXH32");
		localStorage.removeItem(":j35mc:_feedXXH32");
	}


function clearKey() {
if ( document.getElementById("localStoreKey").value === '_killall' ) {
	let sure2Kill = window.confirm( "\u2b9a" + "REALLY to KILL ALL !?" + "\u2b98" );
	if ( ! sure2Kill )  return  ;

	clearStore();
	var mylocalStore = document.getElementById("mylocalStore");
	html_table_header("mylocalStore");
	document.getElementById("feed_box").value = "" ;
	reFreshTable();
	boxclear("localStoreKey");
	boxclear("feed_box");
	location.reload();
	// return ;
	};

if 	( document.getElementById("localStoreKey").value.split(":")[0] === '_addPk' ) {

	if (document.getElementById("localStoreKey").value.split(":")[1] === '' ) {
		alert ("Please specify the KeyID")
	return;}

	localStorage.setItem( ":j35mc:_pubKey:"
			+ document.getElementById("localStoreKey").value.split(":")[1] ,
			document.getElementById("feed_box").value
			);
	alert ("PubKey has been added/updated");
	readPubKeyCombo();
	boxclear("localStoreKey");
	boxclear("feed_box");

	}

if 	( document.getElementById("localStoreKey").value.split(":")[0]  === '_rmPk' ) {

	if (document.getElementById("localStoreKey").value.split(":")[1] === '' ) {
		alert ("Please specify the KeyID")
	return;}

	document.getElementById("feed_box").value =
		localStorage.getItem( ":j35mc:_pubKey:"
			+ document.getElementById("localStoreKey").value.split(":")[1] ) ;

	let sure2Kill = window.confirm( "Really delete Public Key "
			+  document.getElementById("localStoreKey").value.split(":")[1] );
			if ( ! sure2Kill )  return  ;

	localStorage.removeItem( ":j35mc:_pubKey:"
			+ document.getElementById("localStoreKey").value.split(":")[1]  );

	readPubKeyCombo();
	boxclear("localStoreKey");
	boxclear("feed_box");

	}


if 	( document.getElementById("localStoreKey").value === '_help' ) {
	document.getElementById("feed_box").value =
			"_help : print this help \n"
		+	"_killall : KILL ALL contents (CAUTION) \n"
//		+	"_tojsonF : dump content in Box as json file \n"
//		+	"_fromjsonF : restore content from Box \n"
//		+	"_lspage : list page(s) (same as click page)\n"
		+ "_width:nn : set Box Column width <mum> \n \t e.g. _width:10 \n"
		+ "_addPk:KeyID : add Public key under KeyID \n \t e.g. _addPk:SomeKey \n"
		+ "_rmPk:KeyID : remove the Pulic Key with KeyId \n"

		;

	};

if 	( document.getElementById("localStoreKey").value.split(":")[0] == '_width' ) {
	var  number = document.getElementById("localStoreKey").value;
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
		if ( localStorage.getItem( ":j35mc:_colwidth" ) > 0 )  return;
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
	if ( document.getElementById("pageTag").value === "*" ) {
			keyHeaderCell.innerHTML = "Page:Key" ;}
			else { keyHeaderCell.innerHTML = "Key" ; }

	keyHeaderCell.id = "keyHeader" ;
	var valueHeaderCell = tableHeader.insertCell(1) ;
	// valueHeaderCell.innerHTML = "Value" ;
	valueHeaderCell.innerHTML = "Box" ;
	valueHeaderCell.style.color = "blue";
	valueHeaderCell.id = "valueHeader"
	}



function reFreshTable( keyFilter, storeFilter ,  sorting ) {

	var mylocalStore = document.getElementById("mylocalStore");
    html_table_header("mylocalStore");

	var checkStringKey = new RegExp(keyFilter,'') ;
	if ( keyFilter === null ) checkStringKey = new RegExp("",'') ;

	//alert ("MyValue :" + keyFilter  );
	var checkStringValue = new RegExp(storeFilter,'');
	if ( storeFilter === null ) checkStringValue = RegExp("",'') ;

	var pageFilter =  document.getElementById("pageTag").value ;

	if ( pageFilter === "*" ) { pageFilter = '' ;}

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

			if ( key.includes(":j35mc:_") ) return ;

			if ( pageFilter === '') {
				myObjs.push( key.split(":")[2] + ":" + key.split(":")[3] );
				return;
				}
			else if ( key.split(":")[2] != pageFilter ) {return ;}

			myObjs.push( key.split(":")[3] );
			} )

		myObjs.sort();

		Object.keys( myObjs ).forEach( (key) =>  {
			tailDot = '...' ;
			var rowNum = mylocalStore.insertRow();
			var keyCell = rowNum.insertCell(0);

			var localStorgeString;

			if ( pageFilter != '' ) {
				keyCell.innerHTML = myObjs[key] ;
				keyCell.id = "lsKey_"+ myObjs[key] ;

				localStorgeString = localStorage.getItem( ":j35mc:"
										+ document.getElementById("pageTag").value
										+ ":"  +  myObjs[key] );
							}
			else {
				keyCell.innerHTML = myObjs[key] ;
				keyCell.id = "lsKey_"+ myObjs[key] ;
				localStorgeString =
						localStorage.getItem( ":j35mc:" + myObjs[key] );
				}

			var keyCell2 = rowNum.insertCell(1);

			if  ( localStorgeString.length <= colwidth ) tailDot = '';

			keyCell2.innerHTML = localStorgeString.substring(0,colwidth) + tailDot ;
			keyCell2.id = "lsVal_"+ myObjs[key]  ;

			} )

		return; };


    Object.keys( localStorage ).forEach( function(key,value) {

		if ( key.split(":")[2] != pageFilter )
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
					//alert ( "upgrade " + key );
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
		//alert ("Welcome");  // if this client is first time access
		localStorage.setItem( ":j35mc:_version", "2.0" );
		return ;}


if ( myversion === "2.0" )
	{
	localStorage.setItem( ":j35mc:_version", "2.1" );
	/*
	alert ("Multiclip is about to upgrade to 2.1 \n" +
            "You may use keyFilter and valueFilter in search box to do fitlering\n" +
			"e.g. https://j35tor.github.io/webtools/multiclip.html?keyFilter=a&valueFilter=b"
	);
	*/
	}
//alert ( "Version Checked" ) ;
};

function switchPage()  {
	var someid1 = document.getElementById("pageTag").value ;
	reFreshTable("","", 1 ); }


function fromJSON( fromJSON_type, content ){

	var myObjs = [] ;
	var jsonFeed = content ;

	clearStore();  // need to flush the store to prevent orphan pile-up

	if ( fromJSON_type === '_fromjson' )
			jsonFeed = jsonFeed.replace("'[","[").replace("]'","]") ;

	try { myObjs = JSON.parse( jsonFeed ) }
			catch(err) {
				alert ("Invalid json feed ->" + err.message);
				boxclear("feed_box");
				return;
				}

	var gen_checksum = XXH.h32().update( content ).digest().toString(16);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;  //  front padding with '0'
		localStorage.setItem( ":j35mc:_feedXXH32" , gen_checksum )


	Object.keys( myObjs ).forEach( function(key) {
		localStorage.setItem( ":j35mc:" + myObjs[key].Key , myObjs[key].Value );
		} );

	document.getElementById("feed_box").value =
		"(Restore is completed,\n Please REMEMBER press 'Refresh' buttom reload page )";
	reFreshTable("","",1 );
	}


// function toJSON() {}


function box2File() {

	let fname = window.prompt("Save as...");

	const blob = new Blob([ document.getElementById("feed_box").value ],
					{type: 'text/plain;charset=utf-8'})

	saveAs( blob , fname);
    // document.getElementById("feed_box").value =
	alert ("Box content is saved");
	// "(Dump is completed,\n you may clear this message by &#10060; button)";

	}

function dump2box () {

	if ( document.getElementById("feed_box").value != '' ) {
		alert ("Please clear the box before export");
		return ;
		} ;

	var jsonFeed = store2json();

	document.getElementById("feed_box").value = jsonFeed ;
	if  ( gen_checksum !=  localStorage.getItem(":j35mc:_feedXXH32") )
			alert ("The content of DataStore has been changed, you better back-it-up ")
	};


function box2Store() {
	if  ( document.getElementById("feed_box").value.substr(0,8) != '[{"Key":' ) {
	alert ( "Invalid input to restore" );
	boxclear("feed_box");
 	return;}

	fromJSON( "_fromjsonF", document.getElementById("feed_box").value ) ;
	};


function store2json() {

	var myObjs = [] ;
	var keySort = [] ;
	addItem = Object.create( {} );

	// extract the Page:Key from store
	Object.keys( localStorage ).forEach( function(key) {
		if ( key.includes(":j35mc:_") ) return ;
		keySort.push( key.split(":")[2] + ":" + key.split(":")[3] );
		})  // eo forEach

	keySort.sort();

	Object.keys( keySort ).forEach( (key) =>  {
		addItem = { "Key" : keySort[key]
					, "Value" : localStorage.getItem( ":j35mc:" + keySort[key] ) } ;
		myObjs.push(addItem);
		});

	var jsonFeed = JSON.stringify(myObjs) ;
	var gen_checksum = XXH.h32().update( jsonFeed ).digest().toString(16);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;  //  front padding with '0'

		localStorage.setItem( ":j35mc:_nowXXH32", gen_checksum );

	return jsonFeed ;
	} // eo store2json()

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

		if 	( document.getElementById("encKey").value != '' ) {
				var encTXT = symGnuPG_dec( event.target.result );

				Promise.resolve( encTXT ).then ( val => {
					fromJSON( "_fromjsonF" , val );
					});
				return;
			};
		if ( event.target.result.substr(0,8) != '[{"Key":' ) {
		 alert ("Invalid file format!" ); return; };

		fromJSON( "_fromjsonF" , event.target.result );
      }
    }
  });

// document.getElementById('saveDocument').onclick = function () {}

function dump2file() {

	var fileExt = '.gpg' ;
	if 	( ( document.getElementById("encKey").value === '' )
			&& ( document.getElementById("pubKey").value === '' ) ) {

		fileExt = '.json';
		if ( ! window.confirm( "You are about to dump store in Plain json" ) ) return;
		}

    let fname = window.prompt("Save as...")

    if (fname.indexOf(".") === -1) {  // Check json extension in file name
		fname = fname + fileExt
		} else {
			if (fname.split('.').pop().toLowerCase() === fileExt ) {
			// Nothing to do
		} else {
			fname = fname.split('.')[0] + fileExt ;
		}
    }
	var store = store2json() ;

	if ( document.getElementById("encKey").value != '' ) {
		var encTXT =  symGnuPG_enc( store , document.getElementById("encKey").value  );

		Promise.resolve( encTXT ).then ( val => {
			const blob = new Blob( [ val.data ],
							{type: 'application/json;charset=utf-8'})

			saveAs(blob, fname);
			document.getElementById("feed_box").value =
				'(Dump is completed,\n you may clear this message by clear button "X" )';
			} );
			localStorage.setItem( ":j35mc:_feedXXH32", localStorage.getItem(":j35mc:_nowXXH32")) ;
			return ;
			} else if ( document.getElementById("pubKey").value != '' ) {

				var encTXT = pKGnuPG_enc( store , localStorage
					.getItem( ":j35mc:_pubKey:" + document.getElementById("pubKey").value ) );

				Promise.resolve( encTXT ).then ( val => {
				const blob = new Blob( [ val.data ],
							{type: 'application/json;charset=utf-8'})

				saveAs(blob, fname);
				document.getElementById("feed_box").value =
				'(Dump is completed,\n you may clear this message by clear button "X" )';
				} ) ;
				localStorage.setItem( ":j35mc:_feedXXH32", localStorage.getItem(":j35mc:_nowXXH32")) ;
				return ;
		}

	const blob = new Blob([ store ],
			{type: 'application/json;charset=utf-8'})

    saveAs(blob, fname);
	document.getElementById("feed_box").value =
	'(Dump is completed,\n you may clear this message by clear button "X" )';
}
 //

function encBox(inputTXT) {
	//alert (inputTXT.value);

	if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;

	var encTXT = symGnuPG_enc( inputTXT.value , document.getElementById("encKey").value  );

	
	Promise.resolve( encTXT ).then ( val => {
			document.getElementById("feed_box").value = val.data ;
			} );
	

}

function encBoxPub( inputTXT ) {
	if ( document.getElementById("pubKey").value  === '' ) {
		alert ("PubKey is mssing");
		return;
		} ;

	var encTXT = pKGnuPG_enc( inputTXT.value ,
		localStorage.getItem( ":j35mc:_pubKey:" + document.getElementById("pubKey").value ) );

	Promise.resolve( encTXT ).then ( val => {
			document.getElementById("feed_box").value = val.data ;
			} );
			}

function boxDec ( inputTXT ) {
	if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
	} ;

	var encTXT = symGnuPG_dec( inputTXT.value );


	Promise.resolve( encTXT ).then ( val => {
		document.getElementById("feed_box").value = val ;
		// alert (val);
		});
	
}


// async function symGnuPG_enc( inputTXT ) {

async function symGnuPG_enc( inputTXT, Key ) {
	// if ( document.getElementById("encKey").value  === '' ) {
	if ( Key  === '' ||  Key === '(none)' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;

  /// var feed = document.getElementById("encKey").value;
  //// DEBUG:   console.log(feedintext2);
  const options = {
       message : window.openpgp.message.fromText(inputTXT) ,
       passwords : Key ,
       armor : true
   }
   //// DEBUG:alert ("options.feed ==>>>>" + options.passwords );

   const encText = await window.openpgp.encrypt(options);

   /// DEBUG:  console.log("encText \n " + encText.data );
   return (encText);
}


async function pKGnuPG_enc( inputTXT, Key ) {

	var pubkey = await openpgp.key.readArmored(Key);

	Object.keys( pubkey.keys ).forEach( function(myIt) {
			console.log (  pubkey.keys[myIt].users[0].userId.userid ) } );

	 const options = {
     message : window.openpgp.message.fromText(inputTXT) ,
     publicKeys: pubkey.keys ,
     armor : true
    }

	var encText = await window.openpgp.encrypt(options);
	//  document.getElementById("outtext").value = encText.data ;
	return (encText);


	}


async function symGnuPG_dec( inputTXT ) {

	if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;
	var feed = document.getElementById("encKey").value;
	//// DEBUG:   console.log(feed);
	//// DEBUG:   console.log(feedintext2);


   
    const options = {
       message : await openpgp.message.readArmored( inputTXT ) ,
       passwords : feed //,
       // armor : true
		}
   
   

    try { var outText = await window.openpgp.decrypt(options) ;
           // document.getElementById("feed_box").value = outText.data ;
		   return (outText.data);
           }
    catch  (err) {alert ( err.message )  }
}
