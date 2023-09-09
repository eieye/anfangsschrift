// THU 29-JUN-23
// FOR NEW TYPE(BOX) DIMENSIONS FOR VERSALHÖHE/XHEIGHT/BASELINE
// FROM CSV CONVERTED TO NEW VALUES
		// ALL Y-COORDS -= 100
// MANUALLY ADJUST "DOTS" (TREMA)
		// "UMLAUTE" (AOU) FILENAME CONTAINS "uml"
		// LOWERCASE // LAST TWO LINES CONTAIN Y=293   AND Y=286 FOR DOTS 	// CHANGE T0 Y=Y-60
		// UPPERCASE // LAST TWO LINES CONTAIN Y=120.5 AND Y=113.5 FOR DOTS // CHANGE TO Y=Y-50

// 16-JUL-23
// EXPORTING SVG (STROKE-WISE)
// IN TYPEBOX ADJUSTED Y-COORD OF LINES FOR CAP-HEIGHT RESP. X-HEIGHT 
// TO #MINUS# AND FOR BASELINE TO #PLUS# STROKEWIDTH/2




// GLOBAL SCOPE
	var glyphname = "nn";
	var doctitle = "nn";

  let csv_import_raw;
	let vbwidth;																																				// VIEWBOX WIDTH READ FROM CSV

	let csv_data;																																				// RAW NET POINT COORDINATES ONLY
	let pathD = "";																																			// THE SVG PATH-TAG "D"-ARG FOR STROKE
	const svg_elem = document.getElementById('svg_elem');
	let stroke = [];
	let strokes = [[]];

													// ### CONVERTED TO NEW TYPE-HEIGHT VALS ###
	const strokew = 100;
	const VH = 221 - strokew/2; 																												// VERSALHÖHE // ALL -=100

// ### OVERSHOOT FOR X-HEIGHT (VALUE FOR TOP POSITION) IS NOT ALWAYS ENOUGH ###
	const XH = 381 - strokew/2; 																												// X-HEIGHT

	const BL = 882 + strokew/2; 					 											 												// BASELINE 
	const VBH = 1160;  											 											 											// NEW VIEWBOX HEIGHT
	const SHIFTVAL = 100;  											 											 									// ALL Y-KOORDS MOVED UP

	var svg_composite;  											 											 										// (RETURN) THE EXPORT STRING





											// PICK AND READ A FILE (CSV) FROM LOCAL DIRECTORY

function loadFile() {

  [file] = document.querySelector('input[type=file]').files;													// UNPACK PROPERTY FROM OBJECT
	console.log(file);
	glyphname = file.name.split('.')[0];

// ----------------------------------------------------------------------------------------------
											// IF FILENAME CONTAINS "UML" THROW EXCEPTION FOR "DOTS"
																	// TO BE FIXED MANUALLY

	if (file.name.includes('uml')) {
		console.log(
`* * * * * * * * * * * * * *
FOR "${file.name.toUpperCase()}" 
ADJUST DOTS MANUALLY
#AFTER CONVERSION#
Y += 40 FOR LOWER CASE 
Y += 50 FOR UPPER CASE
* * * * * * * * * * * * * *`);
	}

  const reader = new FileReader();

  reader.addEventListener("load", () => {
		csv_import_raw = reader.result;
  	parseFile(csv_import_raw);
  }, false);

  if (file) {
    reader.readAsText(file);
  }

}






								// PARSE BASED ON *FIXED* INDICES IN CSV FOR LINES AND COLUMNS

function parseFile(str) {

	str = str.replaceAll(' ', '');																											// TRIM WHITE SPACE IN FULL STRING (PRESERVE LINE BREAKS)
	str = str.replaceAll('\n\n', '\n');																								  // STRIP EMPTY LINES (REMOVE DBL LINEBREAK)
	let temp_rows = str.split('\n');

	let csv_data_raw = [];
	for (const row of temp_rows) {
		let line = row.split(',');
		line.shift();																																			// STRIP LINE NUMBER FROM LINE
		line.pop();																																				// STRIP COMMENT FROM LINE
		if (line[0] != "#") {
			csv_data_raw.push(line);																												// STRIP EMPTY LINES (IF ANY)
		}
	}
	vbwidth = csv_data_raw[3][0];																												// RETRIEVE FROM *FIXED* INDICES FOR VIEWBOX
	csv_data_raw.splice(0,13);																													// REMOVE "PROLOG"/HEADER
	//console.log(csv_data_raw);
	convertToSVG(csv_data_raw);

}







															// GROUP CURVE-WISE AND APPLY SVG-MARKUP

function convertToSVG(points) {

// PAD THE ARRAY FRONT AND BACK TO SIMPLIFY MODULO DIVISION/CHECK
	points.unshift([]);
	points.push([]);							
	//console.log("POINTS (AFTER SHIFT)", points);


// ------------------------------------------------------------------------------------------------
										// CHECK THAT PATH IS CONTINUOUS // ELSE BREAK INTO STROKES
// CHECKING FOR DIS-CONTINUITY "LAST PT OF CURR QUAD NOT-EQUAL FIRST PT OF NEXT"
// IF ONLY #ONE# COORDINATE (X #OR# Y) IS DIFFERENT IT CAN #NOT# BE A CONTINUOUS PATH


	let j = 0;																																					// IS INCREMENTED AFTER 4 ROWS
	for (let i = 1; i < points.length; i++) {
		strokes[j].push(points[i]);																												// INDEX=1 IS NOW FIRST POINT


// END OF A "QUAD"/TUPLE/SEGMENT (AFTER ADDING POINT)
		if ( i % 4 === 0) {																																// (0 % 4 === 0)

			if (points[i][0] != points[i+1][0] || points[i][1] != points[i+1][1] ) {
				strokes.push(new Array());																										// ON DISCONTINUITY START NEW STROKE

				console.log("DISCONTD", "(x1)", points[i][0], "(x2)", points[i+1][0], "(y1)", points[i][1], "(y2)", points[i+1][1]);
				console.log("ADDED STROKE (ARRAY)"); // DEBUG ONLY

// INCREMENT INDEX SUBARRAY
				j = j+1;																																			// (!) AN EMPTY ARRAY IS ADDED AFTER LAST POINT
			}

		} // END IF

	} // END FOR



// ----------------------------------------------------------------------------------------------
			// PROCESS SHORT PATH_FORMAT (DROP "M" FOR IDENTICAL VALUES) FOR STROKE-WISE BEZIER

	for (let j = 0; j < strokes.length - 1; j++) {																			// SKIP LAST (UNDEFINED) ELEMENT OF "STROKES"
		stroke = strokes[j];
		//newstroke = true; // ADD COMMENT (PATH-WISE ONLY)

// 3 ELEMENTS IN EACH RAW (SOURCE CSV) LINE [X, Y, COMMENT/TYPE]
// GROUP OF 4 PTS DEFINES A (CUBIC) BEZIER CURVE SEGMENT
		let ax, ay, bx, by, cx, cy, dx, dy;

// (STROKE-WISE) GET COMMON START-PT AND MOVE_TO
		ax = stroke[0][0];							// A1
		ay = stroke[0][1] - SHIFTVAL;
		let start = `M ${ax} ${ay} `;
// APPEND
		pathD += start;

// FOR CONTINUOUS CURVES DROP REPEATED A1
		for (let i = 0; i < stroke.length; i += 4) {
			bx = stroke[i+1][0];						// C1
			by = stroke[i+1][1] - SHIFTVAL;
			cx = stroke[i+2][0];						// C2
			cy = stroke[i+2][1] - SHIFTVAL;
			dx = stroke[i+3][0];						// A2
			dy = stroke[i+3][1] - SHIFTVAL;
			let segment = `C ${bx} ${by} ${cx} ${cy} ${dx} ${dy}
`; // (NEWLINE)
// APPEND
			pathD += segment;
		} // FOR POINTS

		svg_composite = concatSTROKEtoSVG(pathD);
	} // FOR STROKE

// WRITE ONLY ONCE WITH COMPLETED STRING
	writeToHTML(svg_composite);

} // END CONVERSION



// -------------------------------------------------------------------------------------------
													// CONCATENATE STROKES TO COMPOSITE GLYPH

function concatSTROKEtoSVG(pathD) {

// REPEATED FOR EACH STROKE
	let svg_path = ` <g class="glyph">		
  <path d="
${pathD}" />
 </g>`;


// ADD NEW GROUP TO COMPOSITE
	let svg_strokes = "";
	svg_strokes += svg_path;

															// INSERT STROKE(S) TO SVG TAGS

	return `<svg viewBox="0 0 ${vbwidth} ${VBH}" xmlns="http://www.w3.org/2000/svg">
<!-- METRICS -->
 <g class="typebox">
  <rect width="${vbwidth}" height="${VBH}" />
  <line x1="0" y1="${VH}" x2="${vbwidth}" y2="${VH}" />
  <line x1="0" y1="${XH}" x2="${vbwidth}" y2="${XH}" />
  <line x1="0" y1="${BL}" x2="${vbwidth}" y2="${BL}" />
 </g>
<!-- GLYPH -->
${svg_strokes}
</svg>`;

}



																/* WRITE SVG-ELEMENT TO DOCUMENT */

function writeToHTML(svg_composite) {

													// ###TBD### // CHANGE THIS TO ELEMENT "APPEND"
	svg_elem.innerHTML = svg_composite;
	console.log(svg_composite.toString());																					// THIS LOGS A CLEAN STRING (HTML) OF THE SVG


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


