// NEW 08-JAN-23 
// FIX FOR OCCASIONAL "UNDEFINED" POINTS IN PARSING
	// STRIP EMPTY LINES // REMOVE DBL LINEBREAK



// GLOBAL SCOPE
  let csv_import_raw;
	let vbwidth;																																				// VIEWBOX DIMENSIONS
	let vbheight;
	let csv_data;																																				// NET POINT COORDINATES ONLY
	let path = "";																																			// SVG (CUBIC) BEZIER CURVE (SEGMENT)
	const svg_elem = document.getElementById('svg_elem');
	let stroke = [];
	let strokes = [[]];																																	// INITIAL STROKES WITH INDEX[0]
	//let svg_composite = "";																															// LINE#138# // (RETURN CREATES TEMP VAR)







// ==============================================================================================
											/* PICK AND READ A FILE (CSV) FROM LOCAL DIRECTORY */

function loadFile() {

  [file] = document.querySelector('input[type=file]').files;													// UNPACK PROPERTY FROM OBJECT
	console.log(file);
  const reader = new FileReader();

  reader.addEventListener("load", () => {
		csv_import_raw = reader.result;
		//console.log(csv_import_raw);																										// LOG // RAW STRING OF IMPORT (WITH PRESERVED WHITE SPACES)
  	parseFile(csv_import_raw);
  }, false);

  if (file) {
    reader.readAsText(file);
  }

}



// ==============================================================================================
								/* PARSE BASED ON *FIXED* INDICES IN CSV FOR LINES AND COLUMNS */

function parseFile(str) {

	str = str.replaceAll(' ', '');																											// TRIM WHITE SPACE IN FULL STRING (PRESERVE LINE BREAKS)
	str = str.replaceAll('\n\n', '\n');																								  // STRIP EMPTY LINES (REMOVE DBL LINEBREAK)
	let temp_rows = str.split('\n');
	//console.log(temp_rows);																														// LOG // INCLUDING "PROLOG"/HEADER OF CSV

	let csv_data_raw = [];
	for (const row of temp_rows) {
		let line = row.split(',');
		line.shift();																																			// STRIP LINE NUMBER FROM LINE
		line.pop();																																				// STRIP COMMENT FROM LINE
		if (line[0] != "#") {
			csv_data_raw.push(line);																												// STRIP EMPTY LINES (IF ANY)
		}
	}
	//console.log(csv_data_raw); // (LINE #62#)
	vbwidth = csv_data_raw[3][0];																												// RETRIEVE FROM *FIXED* INDICES FOR VIEWBOX
	vbheight = csv_data_raw[3][1];
	console.log("VIEWBOX", vbwidth, vbheight);																					// LOG // VIEWBOX DIMENSIONS

	csv_data_raw.splice(0,13);																													// REMOVE "PROLOG"/HEADER
	//console.log(csv_data_raw);																												// (!)ORIGINAL ARRAY IS MUTATED (AS OF LINE#62#)

	convertToSVG(csv_data_raw);

}



// ==============================================================================================
														/* GROUP SEGMENTS AND APPLY SVG-MARKUP */


function convertToSVG(points) {

// PAD THE ARRAY FRONT AND BACK TO SIMPLIFY MODULO DIVISION/CHECK
	points.unshift([]);
	points.push([]);							
	//console.log(points);																															// PADDED FIRST AND LAST INDEX

// ----------------------------------------------------------------------------------------------
										// CHECK THAT PATH IS CONTINUOUS // ELSE BREAK INTO STROKES

	let j = 0;																																					// IS INCREMENTED AFTER 4 ROWS
	for (let i = 1; i < points.length; i++) {
		strokes[j].push(points[i]);																												// INDEX=1 IS NOW FIRST POINT

// END OF A "QUAD"/SEGMENT (AFTER ADDING POINT)
		if ( i % 4 === 0) {																																// (0 % 4 === 0)
// CHECK FOR CONTINUATION // "LAST PT OF CURR QUAD IS-NOT FIRST PT OF NEXT"
			if (points[i][0] != points[i+1][0] && points[i][1] != points[i+1][1] ) {
				strokes.push(new Array());																										// ON DISCONTINUITY START NEW STROKE
				console.log("ADDED ARRAY"); // DEBUG ONLY
// INCREMENT INDEX SUBARRAY
				j = j+1;																																			// (INADVERTENTLY EMPTY ARRAY WAS ADDED AT END OF STROKES)
			}
		} // END IF

	} // END FOR

// ----------------------------------------------------------------------------------------------
																		// PROCESS SVG STROKE-WISE

	for (let i = 0; i < strokes.length - 1; i++) {																			// SKIP EMPTY (LAST) ELEMENT OF "STROKES"
		stroke = strokes[i];
		//console.log(stroke);																														// CHECK ALL SEPARATE PATHS

// 3 ELEMENTS IN EACH RAW ARRAY-INDEX [X, Y, COMMENT/TYPE]
/* GROUP OF 4 PTS ("QUAD") DEFINES A (CUBIC) BEZIER CURVE SEGMENT */
// A1x A1y
// C1x C1y
// C2x C2y
// A2x A2y
// A3x ...

// PREFIX 1ST POINT WITH "M"
	let start = "M " + stroke[0][0] + " " + stroke[0][1] + " ";
	path += start;

// SKIP EVERY 4TH POINT (COUNTING IS FROM INDEX 1)
	for (let i = 0; i < stroke.length; i += 4) {
		let segment = `C ${stroke[i+1][0]} ${stroke[i+1][1]} ${stroke[i+2][0]} ${stroke[i+2][1]} ${stroke[i+3][0]} ${stroke[i+3][1]}
`; // (NEWLINE)
		path += segment;
	}

	//console.log(path);
	svg_composite = concatStrokeToSVG(path); // LINE#138#																// TYPING/GLOBAL SCOPE IS AUTO FOR RETURN ARG (?)
						// THIS STAYS IN MEMORY WITH ESCAPED QUOTES (\")
						// AND CAN NOT BE READ BY BROWSER IF SAVED AS SVG
	} // END FOR

// WRITE ONLY ONCE WITH COMPLETED STRING
	writeToHTML(svg_composite);

} // END CONVERT



// ==============================================================================================
													/* CONCATENATE STROKES TO COMPOSITE GLYPH(S) */

function concatStrokeToSVG(path) {

// REPEATED FOR EACH STROKE
	let svg_path = ` <g class="glyph">		
  <path d="
${path}" />
 </g>`;

// ADD NEW PATH/GROUP TO COMPOSITE
	let svg_strokes = "";
	svg_strokes += svg_path;

// ----------------------------------------------------------------------------------------------
											// INSERT STROKE(S)/GLYPH(S) TO SVG TAGS

	return `<svg viewBox="0 0 ${vbwidth} ${vbheight}" xmlns="http://www.w3.org/2000/svg">
<!-- METRICS -->
 <g class="typebox">
  <rect width="${vbwidth}" height="${vbheight}" fill="none" stroke="red" stroke-width="1px" />
  <line x1="0" y1="321" x2="${vbwidth}" y2="321" stroke="blue" stroke-width="1" />
  <line x1="0" y1="481" x2="${vbwidth}" y2="481" stroke="blue" stroke-width="1" />
  <line x1="0" y1="982" x2="${vbwidth}" y2="982" stroke="blue" stroke-width="1" />
 </g>
<!-- GLYPH(S) -->
${svg_strokes}
</svg>`;

}



// ==============================================================================================
																/* WRITE SVG-ELEMENT TO DOCUMENT */

function writeToHTML(svg_composite) {

													/* TBD // CHANGE THIS TO ELEMENT APPEND */
	svg_elem.innerHTML = svg_composite;																							// THIS LOGS A CLEAN STRING (HTML) OF THE SVG
	console.log(svg_composite);

// ----------------------------------------------------------------------------------------------
													// RESET TO CLEAR SVG_ELEM FOR NEXT SELECTION

	path = "";																																			// MUST RESET ELSE STILL IN MEMORY
	stroke = [];
	strokes = [[]];
	svg_composite = "";																															// (THIS IS A DIFFERENT VAR FROM RETURN ARG LINE#135#)

console.log("   RESET AFTER WRITE");
console.log(path);
console.log(stroke);
console.log(strokes);
console.log(svg_composite); 																											// THIS LOGS AS EMPTY // BUT COPY STILL IN MEMORY

}


