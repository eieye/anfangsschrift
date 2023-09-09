// 16-JUL-23
// SAVE-OUT SVG (STROKE-WISE)





																				// ASSEMBLE HTML PARTS

// DOC-HEADER AND STYLES
let header = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
`;


let styles = `  <style>
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0px;
    background-color: rgba(0 0 5 / .70);
  }
/* SCALE TO WINDOW HEIGHT */
  svg {
    height: 100vH;
  }
/* METRICS */
  .typebox rect {
    fill: none;
    stroke: rgba(255 0 0 / 1);
    stroke-width: 2px;
  }
  .typebox line {
    fill: none;
    stroke: rgba(255 255 0 / 1);
    stroke-width: 1px;
  }
/* GLYPH */
  .glyph {
    fill: none;
    stroke: rgba(255 255 255 / .75);
    stroke-width: 100px;
    stroke-linecap: square; /* butt square round */
    stroke-linejoin: round; /* bevel miter round */
  }
  </style>
</head>

<body>
`;


// CLOSING TAGS
let postfix = `
</body>

</html>`;






																					// EXPORT CONTENT

(function () {
	var exportFile = null,
  makeExportFile = function (text) {
		var data = new Blob([text], {type: 'text/plain'});
    		// "IF WE ARE REPLACING A PREVIOUSLY GENERATED FILE WE NEED TO
    		// MANUALLY REVOKE THE OBJECT URL TO AVOID MEMORY LEAKS"	
    if (exportFile !== null) {
			window.URL.revokeObjectURL(exportFile);
    }
			exportFile = window.URL.createObjectURL(data);
    	return exportFile;
		};

// ADD LISTENER
		document.getElementById('exportbtn').addEventListener('click', (e) => {
    var link = document.createElement('a');
    link.setAttribute('download', `${glyphname}.html`);
// TITLE AND TIME AT SAVE
		doctitle = `  <title>Exported glyph "${glyphname}" (SVG stroke-wise) part of "Anfangsschrift" (v0.3) ${writeTimestamp()}</title>
`; // (NEWLINE)


    																	// CONCATENATE GLYPH DATA

    link.href = makeExportFile(header + doctitle + styles + svg_composite.toString() + postfix);
    document.body.appendChild(link);

// "WAIT FOR THE LINK TO BE ADDED TO THE DOCUMENT"
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
		});


  }, false); // LISTENER

})(); // (IIFY)




																						// TIMESTAMP
function writeTimestamp() {
	let dat = new Date(); // RAW GMT+0200
	let options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};
	let timestamp = new Intl.DateTimeFormat('de-DE', options).format(dat).toUpperCase();
	let re = /\.|,/g;
	timestamp = timestamp.replace(re, '');
	re = /:/g;
	timestamp = timestamp.replace(re, ':');
// REPLACE SELECTED SPACES
	let temp = timestamp.split(' ');
	let numday = temp[1].length < 2 ? "0" + temp[1] : temp[1]; // PAD DAY WHEN SINGLE DIGIT
	return timestamp = `${temp[0]} ${numday}-${temp[2]}-${temp[3]} ${temp[4]}`;
}



