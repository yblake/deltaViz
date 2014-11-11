define(["jquery", "text!./graphics-deltaviz-delta.css", "./d3.min"], function($, cssContent) {

	'use strict';
	$("<style>").html(cssContent).appendTo("head");

	// Add some number & strings methods
	Number.prototype.toRound = function( precision ) {
		if ( precision === undefined ) { 
			// Default rounding to 2 decimal
			precision = 2; 
		}
		var multiplier = Math.pow(10,precision);
		return Math.round(this*multiplier)/multiplier;
	}

	Number.prototype.toAmount = function( currency ) {
		var v = this, unit = "";
		if (Math.abs(v) >= 1000000000.) {
			v = Math.round(v/100000000.)/10.;
			unit = "G"; 
		} else if (Math.abs(v) >= 1000000.) {
			v = Math.round(v/100000.)/10.;
			unit = "M"; 
		} else if (Math.abs(v) >= 1000.) {
			v = Math.round(v/100.)/10.;
			unit = "k"; 
		} else {
			v = Math.round(v*100.)/100.;
		}
		return v.toLocaleString()+ " " + unit + currency ;
	}

	Number.prototype.toMoney = function( currency ) {
		return this.toLocaleString()+ " " + currency ;
	}

	Number.prototype.toPercent = function( precision ) {
		if ( precision === undefined ) { 
			// Default % to 1 decimal
			precision = 1; 
		}
		var multiplier = Math.pow(10,precision);
		return (Math.round(this*multiplier*100)/multiplier).toLocaleString() + " %";
	}

	Number.prototype.sign = function () {
		return this > 0 ? 1 : this < 0 ? -1 : 0;
	}

	String.prototype.translate = function() {
		var translations = {};
		var locale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || 'en');
		if ( locale.indexOf('fr') >= 0 ) {
			// Do nothing, this is already done
		} else {
			// Default to english
			translations = {
				"Options": "Options",
				"Focus": "Focus",
				"Afficher le total": "Show total",
				"Symbole": "Symbol",
				"Icône":"Icon",
				"Delta":"Delta",
				"Classique":"Classic",
				"Léger":"Light",
				"Dessin":"Drawing",
				"Angle":"Angle",
				"Taille relative": "Relative size",
				"Neutralité":"Neutral",
				"Devise":"Currency",
				"€": "$",
				"Style":"Style",
				"Design":"Design",
				"Candy":"Candy",
				"Executive":"Executive",
				"Espacement":"Spacing",
				"Arrondi":"Rounding",
				"Contraste":"Contrast",
				"Normal":"Normal",
				"Elevé":"High"
			};
		};
		return translations[this] ? translations[this] : this;
	}
	
	return {

		// new object properties
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInterColumnSortOrder : [],
				qInitialDataFetch: [{
					qWidth: 3,
					qHeight: 400
				}],
				// Custom properties
				qFocus:"percent",
				qTotal:true,
				qNeutrality:5,
				qCurrency:"€".translate(),
				qCandyStyle:false,
				qSymbol: "delta",
				qAngle: 90,
				qAutosize: true,
				qSpacing:5,
				qRounding:0,
				qContrast:false
			}
		},

		// property panel definition
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 2,
					max: 2
				},
				sorting: {
					uses: "sorting"
				},
				options: {
					label: "Options".translate(),
					type : "items",
					items : {
						focus : {
							type: "string",
							label: "Focus".translate(),
							component: "radiobuttons",
							ref: "qHyperCubeDef.qFocus",   
							options: [ {
								value: "current",
								label: "N"
							}, {
								value: "percent",
								label: "%"
							}, {
								value: "delta",
								label: "Δ"
							}],
							defaultValue: "percent"
						},
						showtotal: {
							type: "boolean",
							label: "Afficher le total".translate(),
							ref: "qHyperCubeDef.qTotal",
							defaultValue: true
						},
						neutrality: {
							type: "number",
							label: "Neutralité".translate() + " [0% - 15%]",
							ref: "qHyperCubeDef.qNeutrality",
							defaultValue: 7.5,
							show:true,
							component: "slider",
							min: 0,
							max: 15,
							step: 2.5
						},
						currency: {
							type: "string",
							label: "Devise".translate(),
							ref: "qHyperCubeDef.qCurrency",
							defaultValue: "€".translate(),
							maxlength: 3,
							show:true
						}
					}
				},
				settings: {
					uses: "settings",
					type : "items",
					items : {
						symbolGroup : {
							label : "Symbole".translate(),
							type : "items",
							items:{
								shape : {
									type: "string",
									label: "Icône".translate(),
									component: "dropdown",
									ref: "qHyperCubeDef.qSymbol", 
									options: [
									{
										value: "delta",
										label: "Delta".translate()
									},{
										value: "classic",
										label: "Classique".translate()
									},{
										value: "light",
										label: "Léger".translate()
									},{
										value: "draw",
										label: "Dessin".translate()
									}],
									defaultValue: "delta"
								},
								angle: {
									type: "number",
									label: "Angle".translate() + " [30° - 90°]",
									ref: "qHyperCubeDef.qAngle",
									defaultValue: 90,
									show:true,
									component: "slider",
									min: 30,
									max: 90,
									step: 15
								},
								autosize: {
									type: "boolean",
									label: "Taille relative".translate(),
									ref: "qHyperCubeDef.qAutosize",
									defaultValue: true
								}
							} // Symbol Group items
						}, // Symbol Group
						styleGroup: {
							label: "Style".translate(),
							type : "items",
							items:{
								design: {
									type: "boolean",
									label: "Design".translate(),
									ref: "qHyperCubeDef.qCandyStyle",
									component: "switch",
									options: [ {
										value: false,
										label: "Candy".translate()
										}, {
										value: true,
										label: "Executive".translate()
									} ],
									defaultValue: false
								},
								spacing: {
									type: "number",
									label: "Espacement".translate(),
									ref: "qHyperCubeDef.qSpacing",
									defaultValue: 5,
									show:true,
									component: "slider",
									min: 0,
									max: 15,
									step: 5
								},
								rounding: {
									type: "number",
									label: "Arrondi".translate(),
									ref: "qHyperCubeDef.qRounding",
									defaultValue: 0,
									show:true,
									component: "slider",
									min: 0,
									max: 15,
									step: 5
								},
								contrast: {
									type: "boolean",
									label: "Contraste".translate(),
									ref: "qHyperCubeDef.qContrast",
									component: "switch",
									options: [ {
										value: false,
										label: "Normal".translate()
										}, {
										value: true,
										label: "Elevé".translate()
									} ],
									defaultValue: false
								} 
							} // Style group items
						} // Style group
					} // Settings items
				} // Settings
			}
		},

		// Snapshot availability
		snapshot: {
			canTakeSnapshot: true
		},

		// Object rendering
		paint: function ( $element, layout ) {

			//var parentscope = angular.element($element).scope().$parent.$parent;
			//console.log(parentscope.editmode ? 'In Edit Mode' : 'Not in Edit mode');

			// Get object properties and force unset values (new releases)
			var properties = {
				"focus" : (layout.qHyperCube.qFocus === undefined ? "percent" : layout.qHyperCube.qFocus),
				"total"  : (layout.qHyperCube.qTotal === undefined ? true : layout.qHyperCube.qTotal),
				"neutrality"  : (layout.qHyperCube.qNeutrality === undefined ? 7.5 : layout.qHyperCube.qNeutrality),
				"currency" : (layout.qHyperCube.qCurrency === undefined ? "€".translate() : layout.qHyperCube.qCurrency),
				"symbol" : (layout.qHyperCube.qSymbol === undefined ? "delta" : layout.qHyperCube.qSymbol),
				"angle" : (layout.qHyperCube.qAngle === undefined ? 90 : layout.qHyperCube.qAngle),
				"autosize" : (layout.qHyperCube.qAutosize === undefined ? true : layout.qHyperCube.qAutosize),
				"executive" : (layout.qHyperCube.qCandyStyle === undefined ? false : layout.qHyperCube.qCandyStyle),
				"spacing"  : (layout.qHyperCube.qSpacing === undefined ? 5 : layout.qHyperCube.qSpacing),
				"rounding"  : (layout.qHyperCube.qRounding === undefined ? 0 : layout.qHyperCube.qRounding),
				"contrast"  : (layout.qHyperCube.qContrast === undefined ? false : layout.qHyperCube.qContrast)
			};

			// Single dimension component
			var dimension = 0; 
			var measure_current = 1; 
			var measure_previous = 2; 

			// Create a new array that contains the measure labels & bounds
			var measures = layout.qHyperCube.qMeasureInfo.map( function(d) {
				return {
					"title":d.qFallbackTitle,
					"min":d.qMin,
					"max":d.qMax
					}
			});
			// console.log(measures);

			// Legend text
			var legend = "";
			if ( properties.total) {
				legend = measures[0].title + " / " + measures[1].title; 
				// TBS : May be better parsing here... ?
				var re;
				re = /(Sum\(|Count\(|Avg\(|Min\(|Max\(|\)|\[|\])/gi; legend = legend.replace(re, "");
				re = /  /gi; legend = legend.replace(re, " ");
			}

			// Create a new array for our extension with a row for each row in the qMatrix
			var othersLabel = this.backendApi.getDimensionInfos()[dimension].othersLabel;
			var page = 0;
			var dataD3 = layout.qHyperCube.qDataPages[page].qMatrix.map( function(d) {
				// for each element in the matrix, create a new object that has a property for first dimension and two measures
				return {
					"item": d[dimension].qIsOtherCell ? othersLabel : d[dimension].qText,
					"current":d[measure_current].qNum,
					"previous":d[measure_previous].qNum,
					// Computations
					"delta":(d[measure_current].qNum - d[measure_previous].qNum),
					"variation":(d[measure_previous].qNum != 0 ? (d[measure_current].qNum - d[measure_previous].qNum) / Math.abs(d[measure_previous].qNum) : null),
					"size":100,
					// Used for selection
					"dimensionid":d[dimension].qIsOtherCell ? null : d[dimension].qElemNumber,
					"selected":0
					}
				})
			;
			// console.log(dataD3);
			
			// Suppress null values
			for (var cell = dataD3.length-1; cell >= 0; --cell) {
				if (dataD3[cell].current == 0 && dataD3[cell].previous == 0)
					dataD3.splice(cell, 1);
			}

			// Summarize totals
			var sc=0, sp=0, sep=0, sen=0, se=0;
			for (var cell = 0; cell < dataD3.length; ++cell) {
				sc += dataD3[cell].current;
				sp += dataD3[cell].previous;
				if ( dataD3[cell].delta >= 0 && dataD3[cell].delta > sep ) {
					sep = dataD3[cell].delta;
				} else if (dataD3[cell].delta < 0 &&  -dataD3[cell].delta > sen) {
					sen = (-dataD3[cell].delta);
				}
			}
			sc = sc.toRound(); 
			sp = sp.toRound(); 
			se = Math.max(sep,sen);

			// Computes symbol size %
			if ( properties.autosize && dataD3.length > 1) {
				for (var cell = 0; cell < dataD3.length; ++cell) {
					dataD3[cell].size = Math.round((100 * dataD3[cell].delta.sign() * dataD3[cell].delta)/se);
				}
			}

			// Insert total cell
			if ( properties.total && dataD3.length > 1) {
				dataD3.unshift({
					item: "Σ",
					current: sc,
					previous: sp,
					delta: sc-sp,
					variation: (sp != 0) ? (sc-sp)/Math.abs(sp) : null,
					size:100,
					dimensionid: null,
					selected: 0
				});
			}

			// Chart object area 
			var width = $element.width();
			var height = $element.height();

			// Chart object id
			var id = "graphics-deltaviz-delta-" + layout.qInfo.qId;

			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$("#" + id).empty();
			}
			else {
				// if it hasn't been created, create it with the appropiate id and size
				$element.append($('<div />;').attr("id", id).width(width).height(height));
			}

			// D3 rendering
			var self = this;
			dashboardViz (
				self,
				dataD3, 
				measures, 
				width, 
				height, 
				id, 
				legend,
				properties
			);

		} // Paint

	}; // Extension function

} ); // Extension definition

var dashboardViz = function ( self, dataD3, measures, width, height, id, legend, properties ) { 

	// Responsive area
	var rows, columns;
	if ( height*1.5 > width ) {
		columns = Math.floor(Math.sqrt(dataD3.length));
		rows = Math.ceil(dataD3.length/columns);
	} else {
		columns = Math.ceil(Math.sqrt(1.5*dataD3.length)/1.5);
		rows = Math.ceil(dataD3.length/columns);
	};

	// Push fake data to fill with columns x rows missing squares in grey
	for (i = dataD3.length; i < rows * columns; i++) {
		dataD3.push({
			item: null,
			current: 0,
			previous: 0,
			delta: 0,
			variation: 0,
			size:0,
			dimensionid: null,
			selected: 0
		});
	}

	// =====================================================================================================================
	// Tiles coordinates
	// =====================================================================================================================

	// Tile area
	var kx = 0;
	var ky = 0;
	var kw = Math.floor(width/columns);
	var kh = Math.floor(height/rows);
	var cx = Math.floor(kw/2);
	var cy = Math.floor(kh/2);

	// Background area
	var bx = kx + Math.floor(properties.spacing/2);
	var by = ky + Math.floor(properties.spacing/2);
	var bw = kw - properties.spacing;
	var bh = kh - properties.spacing;

	// Responsive drawing area
	var padding = Math.min(Math.max(2,Math.floor((kw-properties.spacing)*0.025)),50); 
	var dx = bx + padding;
	var dy = by + padding;
	var dw = bw - padding*2;
	var dh = bh - padding*2;

	// Responsive font and path sizes
	var fsCaption = Math.min(Math.floor(dh/6),Math.floor(dw/10),24); // Caption font size
	var fsCenter;
	switch ( properties.focus ) {
		case "delta":
		case "current":
			// Δ font size
			fsCenter = Math.max(Math.min(Math.floor(dw/6),Math.floor(dh*0.25),30),10); 
			break;
		default:
			// % font size
			fsCenter = Math.max(Math.min(Math.floor(dw/5),Math.floor(dh*0.30),50),6); 
			break;
	};

	var psArrow = Math.max(Math.min(Math.floor(dw/6),Math.floor(dh*0.25)),10); // Arrow path size
	var fsBottom = Math.min(Math.floor(dh/7),Math.floor(dw/12),22); // Bottom caption font size

	// Needed for SVG masking (QS uses HTML5 base tag)
	var url = $(location).attr('href');

	// =====================================================================================================================
	// SVG container
	// =====================================================================================================================
	var svg = d3.select("#"+id).append("svg")
		.attr("position", "absolute")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.style("font-family","qlikview sans")
		.style("shape-rendering","geometricPrecision")
	;

	// Symbols mask definitions
	var defs = svg.append("defs")

	// Delta symbol (default)
	defs.append("mask")
	.attr("id", "deltaMask")
	.attr("maskContentUnits", "objectBoundingBox")
	.append("polygon")
	.attr("fill", "white")
	.attr("stroke-width", 0)
	.attr("points", "0,0 0,1 1,0.5")

	// Classic arrow 
	defs.append("mask")
	.attr("id", "classicMask")
	.attr("maskContentUnits", "objectBoundingBox")
	.append("polygon")
	.attr("fill", "white")
	.attr("stroke-width", 0)
	.attr("points", "0,0.28 0.38,0.28 0.38,0 1,0.5 0.38,1 0.38,0.72 0,0.72")

	// Light arrow 
	defs.append("mask")
	.attr("id", "lightMask")
	.attr("maskContentUnits", "objectBoundingBox")
	.append("polygon")
	.attr("fill", "white")
	.attr("stroke-width", 0)
	.attr("points", "0,0.432 0.705,0.432 0.335,0.101 0.447,0 1,0.50 0.447,1 0.335,0.902 0.705,0.571 0,0.571")

	// Hand drawing arrow 
	defs.append("mask")
	.attr("id", "drawMask")
	.attr("maskContentUnits", "objectBoundingBox")
	.append("path")
	.attr("fill", "white")
	.attr("stroke-width", 0)
	.attr("d","M0.055,0.996l0.927-0.469c0.011-0.006,0.018-0.016,0.018-0.026c0.000-0.011-0.007-0.021-0.018-0.026" +
		"L0.055,0.004C0.044-0.001,0.030-0.001,0.018,0.004C0.007,0.009,0.000,0.020,0.000,0.031v0.939c0.000,0.011,0.007,0.021,0.018,0.027" +
		"C0.030,1.001,0.044,1.001,0.055,0.996zM0.073,0.148c0.003,0.001,0.007,0.001,0.010,0.002c-0.003,0.005-0.006,0.011-0.010,0.016" +
		"V0.148 zM0.073,0.249c0.010-0.005,0.023-0.013,0.044-0.024l-0.044,0.073" +
		"V0.249 zM0.073,0.379L0.073,0.379c0.011-0.009,0.026-0.024,0.049-0.047" +
		"c-0.018,0.029-0.035,0.057-0.049,0.080V0.379 zM0.073,0.493l0.090-0.099" +
		"c-0.001,0.001-0.001,0.002-0.002,0.003C0.120,0.464,0.092,0.511,0.073,0.543V0.493zM0.073,0.625" +
		"c0.000,0.000,0.001-0.001,0.001-0.002c0.021-0.020,0.059-0.064,0.140-0.158c0.001-0.001,0.001-0.001,0.002-0.002C0.144,0.579,0.100,0.652,0.073,0.699V0.625 " +
		"zM0.073,0.787l0.190-0.233C0.133,0.767,0.091,0.839,0.079,0.865c-0.001,0.001-0.001,0.002-0.002,0.003" +
		"l0.001,0.000c-0.005,0.011-0.004,0.013-0.003,0.015c0.002,0.005,0.006,0.009,0.011,0.011c0.010,0.004,0.022,0.001,0.028-0.007c0.059-0.079,0.131-0.174,0.198-0.262" +
		"l-0.108,0.180c-0.005,0.009-0.001,0.020,0.010,0.025c0.010,0.004,0.014,0.006,0.029-0.008l0.001,0.000l0.001-0.002" +
		"c0.012-0.013,0.032-0.038,0.066-0.082c0.020-0.026,0.043-0.055,0.067-0.086c-0.022,0.037-0.043,0.070-0.057,0.095c0.000,0.000,0.000,0.000,0.000,0.000c-0.005,0.009-0.002,0.019,0.008,0.024" +
		"c0.010,0.005,0.022,0.003,0.029-0.005L0.500,0.599c-0.005,0.008-0.009,0.015-0.013,0.021c-0.041,0.066-0.041,0.066-0.038,0.074c0.002,0.005,0.006,0.009,0.011,0.011" +
		"c0.009,0.004,0.013,0.006,0.029-0.009l0.001,0.000c0.000,0.000,0.001-0.001,0.002-0.003c0.010-0.010,0.025-0.027,0.048-0.055c-0.002,0.008,0.002,0.017,0.011,0.021" +
		"c0.008,0.003,0.012,0.005,0.028-0.008l0.001,0.000l0.001-0.002c0.011-0.010,0.028-0.026,0.054-0.053c0.000,0.001,0.001,0.003,0.001,0.004" +
		"c0.002,0.006,0.008,0.010,0.014,0.012c0.007,0.002,0.014,0.001,0.020-0.003l0.122-0.081l0.018,0.005c0.001-0.003,0.006-0.009,0.010-0.016" +
		"c0.003-0.005,0.006-0.009,0.007-0.012c0.006-0.009,0.006-0.012,0.004-0.018c-0.002-0.006-0.007-0.010-0.014-0.012c-0.007-0.002-0.014-0.001-0.020,0.003l-0.077,0.051" +
		"c0.013-0.022,0.028-0.045,0.039-0.064c0.000,0.000,0.000,0.000,0.000,0.000c0.005-0.008,0.002-0.019-0.008-0.024c-0.009-0.005-0.022-0.003-0.029,0.004c-0.016,0.016-0.034,0.035-0.052,0.055" +
		"l0.037-0.061c0.005-0.009,0.001-0.020-0.010-0.025c-0.009-0.004-0.013-0.006-0.028,0.009l-0.001,0.000l-0.002,0.004" +
		"c-0.009,0.009-0.020,0.022-0.037,0.041c0.035-0.058,0.034-0.060,0.031-0.067c-0.002-0.005-0.006-0.009-0.011-0.011c-0.010-0.004-0.021-0.002-0.027,0.006l-0.140,0.162" +
		"c0.063-0.104,0.090-0.150,0.101-0.171c0.001-0.002,0.002-0.003,0.003-0.004L0.586,0.380c0.006-0.013,0.006-0.014,0.005-0.017c-0.002-0.005-0.006-0.009-0.011-0.011" +
		"c-0.008-0.003-0.012-0.005-0.028,0.010l-0.002-0.001c0.000,0.001-0.002,0.004-0.005,0.008c-0.021,0.023-0.058,0.071-0.132,0.166l0.115-0.190" +
		"c0.005-0.009,0.001-0.020-0.010-0.025c-0.007-0.003-0.012-0.005-0.028,0.009L0.489,0.330l-0.003,0.005c-0.024,0.024-0.072,0.084-0.177,0.224" +
		"c0.051-0.084,0.105-0.172,0.151-0.246c0.000,0.000,0.000,0.000,0.000,0.000c0.005-0.009,0.002-0.019-0.008-0.024c-0.010-0.005-0.023-0.003-0.029,0.005L0.205,0.560" +
		"c0.057-0.094,0.123-0.201,0.177-0.287c0.003-0.005,0.003-0.009,0.001-0.014c-0.002-0.005-0.006-0.009-0.011-0.011c-0.008-0.003-0.012-0.005-0.028,0.008l-0.001-0.001" +
		"c-0.001,0.001-0.002,0.003-0.002,0.004c-0.022,0.020-0.062,0.068-0.150,0.170c0.003-0.005,0.006-0.010,0.009-0.015c0.067-0.110,0.094-0.155,0.104-0.175l0.002-0.002" +
		"l-0.001,0.000c0.006-0.012,0.005-0.014,0.004-0.017c-0.002-0.006-0.009-0.011-0.017-0.012c-0.008-0.001-0.016,0.001-0.021,0.007L0.184,0.310" +
		"C0.251,0.200,0.250,0.197,0.247,0.190c-0.002-0.005-0.006-0.009-0.011-0.011c-0.009-0.004-0.020-0.002-0.027,0.005c-0.015,0.016-0.033,0.034-0.052,0.053l0.036-0.059" +
		"c0.005-0.008,0.002-0.017-0.005-0.022c-0.007-0.006-0.018-0.006-0.027-0.001c0.000,0.000-0.024,0.014-0.051,0.030c0.026-0.043,0.026-0.044,0.023-0.051c-0.002-0.005-0.006-0.009-0.011-0.011" +
		"c-0.002-0.001-0.003-0.001-0.041-0.009c0.001-0.006-0.003-0.012-0.010-0.016V0.085l0.820,0.415l-0.820,0.415" +
		"V0.787z")
	;

	// =====================================================================================================================
	// KPI tile area
	// =====================================================================================================================
	var kpi = svg.selectAll("g")
		.data(dataD3)
		.enter()
		.append("g")
		.attr("transform", function(d,i) { return "translate(" + (kw*(i%columns)) + "," + (kh*Math.floor(i/columns)) + ")"; })
		// Selectable area
		.attr("data-dimensionid", function(d) { return d.dimensionid; })
		.attr("cursor",cursor)
		.on("click", clickArea)
	;

	// Show hand cursor on selectable area
	function cursor (d) {
		if (d.dimensionid === null || d.item === null || d.item === undefined) 
			return "default"; 
		return "pointer";
	};

	// When user select a kpi
	function clickArea(d,i) {

		// No dimension here...
		if ( self.selectionsEnabled == false || d.dimensionid === null || d.item === undefined)
			return;

		// Toggle selection
		d.selected = 1-d.selected;

		// Visual feedback
		if ( properties.executive ) {

			// Highlight in QS green
			d3.selectAll("rect").filter(function(d) { return d.selected })
				.attr("fill-opacity", 0.3)
				.attr("fill", "#52cc52")
			;

			// Dimmed light gray
			d3.selectAll("rect").filter(function(d) { return !d.selected && d.dimensionid !== null})
				.attr("fill-opacity", 0.2)
				.attr("fill", "#cccccc")
			;

		} else {

			// Selections remains fullfilled
			d3.selectAll("rect").filter(function(d) { return d.selected })
				.attr("fill-opacity", 1.)
			;

			// Unselected elements have half transparency
			d3.selectAll("rect").filter(function(d) { return !d.selected && d.dimensionid !== null})
				.attr("fill-opacity", 0.5)
			;

		};

		// Toggle QS selection for first dimension
		var dim = 0, value = d.dimensionid;
		self.selectValues(dim, [value], true);

	}

	// =====================================================================================================================
	// Tooltip
	// =====================================================================================================================
	kpi.append("title")
		.text( function (d) {
			var t;
			if (d.item === null) return "";
			t = (d.item === undefined) ? "" : d.item;
			if (d.current !== null) t+= "\n" + measures[0].title + " = " + d.current.toMoney(properties.currency);
			if (d.previous !== null) t+= "\n" + measures[1].title + " = " + d.previous.toMoney(properties.currency);
			if (d.delta !== null) t+= "\n" + "Delta = " + ( d.delta > 0 ? "+" : "") + d.delta.toMoney(properties.currency);
			if (d.variation !== null) t+= "\n" + "Variation = " + ( d.variation > 0 ? "+" : "") + d.variation.toPercent(2); 
			//if (d.size !== null) t+= "\n" + "size = " + d.size;
			return t;
		})
	;

	// =====================================================================================================================
	// Background
	// =====================================================================================================================
	if ( !properties.executive ) {

		// Candy design : Rectangle
		kpi.append("rect")
			.attr("x", bx) 
			.attr("y", by) 
			.attr("rx", properties.rounding)
			.attr("ry", properties.rounding)
			.attr("width", bw) 
			.attr("height", bh) 
			.attr("fill", deltaColor)
			.attr("fill-opacity", 1)
			;

	} else {

		// Executive design
		if (properties.spacing == 0 && properties.rounding == 0) {

			// No spacing : Rectangle and grid path
			kpi.append("rect")
				.attr("x", bx) 
				.attr("y", by) 
				.attr("rx", properties.rounding)
				.attr("ry", properties.rounding)
				.attr("width", bw) 
				.attr("height", bh) 
				.attr("fill", "white")
				.attr("fill-opacity", 1)
			;

			kpi.append("path")
				.attr("stroke", "#cccccc")
				.attr("stroke-width", "1px")
				.attr("fill", "none")
				.attr("stroke-linecap","butt")
				.attr("stroke-linejoin","miter")
				.attr("d", gridPath) 
			;

		} else { 

			// When spacing > 0, we can use stroke in executive mode
			kpi.append("rect")
				.attr("x", bx) 
				.attr("y", by) 
				.attr("rx", properties.rounding)
				.attr("ry", properties.rounding)
				.attr("width", bw) 
				.attr("height", bh) 
				.attr("fill", "white")
				.attr("fill-opacity", 0)
				.attr("stroke-width", "1px")
				.attr("stroke", "#cccccc")
				.attr("stroke-opacity", 1)
				.attr("stroke-linecap","butt")
				.attr("stroke-linejoin","miter")
			;
		}
	}

	// Full screen grid for executive mode (works nice in IE & Chrome)
	function gridPath(d,i) {
		var path; 
		if (i == 0) {

			// Upper left cell
			path  = "M" + (bx+1) + " " + (by+1);
			path += "h" + (bw-2);
			path += "v" + (bh-2);
			path += "h" + (-bw+2);
			path += "z";

		} else if (i < columns) {

			// Upper row
			path  = "M" + (bx) + " " + (by+1);
			path += "h" + (bw-1);
			path += "v" + (bh-2);
			path += "h" + (-bw+1);

		} else if (i%columns == 0) {

			// Leftmost column
			path  = "M" + (bx+1) + " " + (by);
			path += "v" + (bh-1);
			path += "h" + (bw-2);
			path += "v" + (-bh+1);

		} else {

			// Other cells
			path  = "M" + (bx) + " " + (by+bh-1);
			path += "h" + (bw-1);
			path += "v" + (-bh+1);

		}
		return path
	}

	// Highlight color (Background for Candy; Symbol, % and delta for Executive)
	function deltaColor(d) {
		var green, red, blue, discrete, total;
		if ( properties.contrast ) {
			// High contrast
			green = "#008a00";
			red = "#a20025";
			blue = "#0050ef";
			discrete = "#87794e";
			total="#647687"; 
		} else {
			// Normal (default)
			green = "#a4c400";
			red = "#d80073";
			blue = "#1ba1e2";
			discrete = "#bbbbbb";
			total="#647687"; 
		}

		if ( d.item == "Σ" ) return total;
		if ( (d.item === null) || (d.previous == 0) ) return discrete;
		if (d.variation > (properties.neutrality /100.)) { 
			return green;
		} else if (d.variation < (-properties.neutrality /100.)) { 
			return red;
		} else {
			return blue;
		};

	};

	// =====================================================================================================================
	// Background image for missing data
	// =====================================================================================================================
	var iw = Math.floor(Math.min(bw,bh)*0.75);
	kpi.filter(function(d) { return d.item === null }).append("svg:image")  
		.attr('x',cx-iw/2)
		.attr('y',cy-iw/2)
		.attr('width', iw)
		.attr('height', iw)
		.attr("xlink:href","/extensions/graphics-deltaviz-delta/background.png")
	;

	// =====================================================================================================================
	// Top right caption
	// =====================================================================================================================
	kpi.append("text")
		.attr("x", dx+dw-1) 
		.attr("y", dy+fsCaption-1) 
		.attr("text-anchor", "end")
		.attr("font-size", fsCaption + "px")
		.attr("fill", !properties.executive ? "white" : "grey")
		.text( function (d) {
			if ( d.item === null || d.item === undefined) return "";
			var s = d.item;
			// No label (i.e. missing Other dimensions label)
			if (s == "") return ""
			// Total legend
			if ( legend != "" && s == "Σ" ) s = "Σ " + legend;
			// Truncate long text
			var maxLength = Math.max(2,Math.floor( dw / (fsCaption * 0.6)));
			if (s.length > maxLength) {
				s = s.substr(0,maxLength-1) + "…";
			}
			return s;
		})
	;

	// =====================================================================================================================
	// Main centered text
	// =====================================================================================================================
	kpi.append("text")
		.attr("x", dx+dw-1) 
		.attr("y", cy-5+fsCenter/2)
		.attr("text-anchor", "end")
		.attr("font-size", fsCenter + "px")
		.attr("fill", !properties.executive ? "white" : properties.focus == "current" ? "grey" : deltaColor)
		.text(function(d) { 
			if ( d.item === null ) return "";
			switch ( properties.focus ) {
				case "delta":
					// Show delta
					return ( d.delta > 0 ? "+" : "") + d.delta.toAmount(properties.currency);
					break;
				case "current":
					// Show current amount
					return d.current.toAmount(properties.currency);
					break;
				default:
					// Show % 
					if ( d.previous == 0 || d.variation === null) return (d.current == 0 ? "0 %" : (d.current > 0 ? "++ %" : "-- %"));
					if ( d.variation >= 10 ) {
						return "+>>> %"
					} else if ( d.variation <= -10 ) {
						return "-<<< %"
					} else {
						var decimals = 1;
						if (d.variation > 1 || d.variation < -1 || bw <= 125 || bh < 100) decimals=0;
						return ( d.variation > 0 ? "+" : "") + d.variation.toPercent(decimals);
					}
					break;
				}
		})
	;

	// =====================================================================================================================
	// Symbol
	// =====================================================================================================================
	console.log ("css",document.styleSheets);
	kpi.filter( function(d) { return !( (d.item === null) || (d.previous == 0 && d.current == 0) )}).append("path")
		.attr("stroke", "none")
		.attr("fill", !properties.executive ? "white" : deltaColor)
		.attr("d","M0 0v" + psArrow + "h" + psArrow + "v-" + psArrow + "z")
		.attr("mask", "url(" + url + "#" + properties.symbol + "Mask" + ")")
		.attr("transform", function (d) {
			// Step 4 : Translate symbol center to final position
			var transform = "translate("+Math.floor(dx + 3*padding + psArrow/2)+","+Math.floor(cy)+")";
			// Step 3 : Rotate symbol
			if (d.variation > (properties.neutrality /100.)) { 
				transform += " rotate(-" + properties.angle + ")";
			} else if (d.variation < (-properties.neutrality /100.)) { 
				transform += " rotate(" + properties.angle + ")";
			}
			// Step 2 : Scale size
			transform += " scale(" + ((psArrow/2) + ((psArrow * d.size/100)/2)) / psArrow + ")";
			// Step 1 : Translate to symbol center to apply rotation and scale transformations
			transform += " translate("+Math.floor(-psArrow/2)+","+Math.floor(-psArrow/2)+")";
			return transform;
		})
	;

	// Bottom left & right caption
	if (fsBottom >= 8) {

		// =====================================================================================================================
		// Bottom left caption
		// =====================================================================================================================
		kpi.append("text")
			.attr("y", dy+dh-1) 
			.attr("x", dx) 
			.attr("text-anchor", "start")
			.attr("font-size", fsBottom + "px")
			.attr("fill", !properties.executive ? "white" : deltaColor)
			.text(function(d) { 
				if (d.item === null) return "";
				switch ( properties.focus ) {
					case "percent":
						// Show delta
						return (!properties.executive ? "Δ " : "" ) + ( d.delta > 0 ? "+" : "") + d.delta.toAmount(properties.currency);
						break;
					default:
						// Show %
						if ( d.previous == 0 || d.variation === null) return (d.current == 0 ? "0 %" : (d.current > 0 ? "++ %" : "-- %"));
						if ( d.variation >= 10 ) {
							return "+>>> %"
						} else if ( d.variation <= -10 ) {
							return "-<<< %"
						} else {
							var decimals = 1;
							if (d.variation > 1 || d.variation < -1 || bw <= 125 || bh < 100) decimals=0;
							return ( d.variation > 0 ? "+" : "") + d.variation.toPercent(decimals);
						}
						break;
				}
			})
		;

		// =====================================================================================================================
		// Bottom right caption
		// =====================================================================================================================
		kpi.append("text")
			.attr("y", dy+dh-1) 
			.attr("x", dx+dw-1) 
			.attr("text-anchor", "end")
			.attr("font-size", (fsBottom+2) + "px")
			.attr("fill", !properties.executive ? "white" : properties.focus == "current" ? deltaColor : "grey")
			.text( function(d) { 
				if (d.item === null) return "";
				switch ( properties.focus ) {
					case "percent":
					case "delta":
						// Show current
						return d.current.toAmount(properties.currency);
						break;
					default:
						// Show delta
						return (!properties.executive ? "Δ " : "" ) + ( d.delta > 0 ? "+" : "") + d.delta.toAmount(properties.currency);
						break;
				}
			})
		;

	}; // Display bottom captions

}; // dashboardViz
