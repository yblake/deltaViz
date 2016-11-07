/**
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * The name Yves Blake may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @license    deltaViz : Copyright (c) 2014-2016, Yves Blake All rights reserved.
 * @library    d3 : Copyright (c) 2010-2016, Michael Bostock All rights reserved.
 * @release    1.3
 * @details    https://github.com/yblake/deltaViz
 */
 
 define(['qlik','jquery', 'text!./graphics-deltaviz-delta.css', './d3.min'], function(qlik, $, cssContent) {

	'use strict';
	$('<style>').html(cssContent).appendTo('head');

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
		var v = this, unit = '';
		if (Math.abs(v) >= 1000000000.) {
			v = Math.round(v/100000000.)/10.;
			unit = 'G'; 
		} else if (Math.abs(v) >= 1000000.) {
			v = Math.round(v/100000.)/10.;
			unit = 'M'; 
		} else if (Math.abs(v) >= 1000.) {
			v = Math.round(v/100.)/10.;
			unit = 'k'; 
		} else {
			v = Math.round(v*100.)/100.;
		}
		return v.toLocaleString()+ ' ' + unit + currency ;
	}

	Number.prototype.toMoney = function( currency ) {
		return this.toLocaleString()+ ' ' + currency ;
	}

	Number.prototype.toPercent = function( precision ) {
		if ( precision === undefined ) { 
			// Default % to 1 decimal
			precision = 1; 
		}
		var multiplier = Math.pow(10,precision);
		return (Math.round(this*multiplier*100)/multiplier).toLocaleString() + ' %';
	}

	Number.prototype.sign = function () {
		return this > 0 ? 1 : this < 0 ? -1 : 0;
	}

	String.prototype.translate = function() {

		var locale = (window.navigator.languages && window.navigator.languages.length > 0 ) ? window.navigator.languages[0] : null;
		locale = locale || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage || 'en';
		if (locale.indexOf('-') !== -1)
			locale = locale.split('-')[0];
		if (locale.indexOf('_') !== -1)
			locale = locale.split('_')[0];

		var translations = {};

		// ISO 639-1 language code
		switch( locale.toLowerCase().trim() ) {

			case 'fr':

				// Do nothing, this is already done
				break;

			case 'de':

				// German translation (with help of R. Vecera)
				translations = {
					'Options': 'Optionen',
					'Focus': 'Fokus',
					'Afficher le total': 'Gesamtsumme anzeigen',
					'Symbole': 'Symbol',
					'Icône':'Ikone',
					'Delta':'Delta',
					'Classique':'Klassisch',
					'Léger':'Zierlich',
					'Dessin':'Gezeichnet',
					'Angle':'Winkel',
					'Taille relative': 'Relative Größe',
					'Neutralité':'Neutral',
					'Devise':'Währung',
					'€': '€',
					'Style':'Stil',
					'Design':'Design',
					'Candy':'Candy',
					'Executive':'Executive',
					'Espacement':'Abstand',
					'Arrondi':'Abgerundete Ecken',
					'Contraste':'Kontrast',
					'Normal':'Normal',
					'Elevé':'Hoch',
					'Dégradé' : 'Abstufung',
					'Inverser les couleurs':'Farben invertieren',
					'Légende' : 'Beschriftung',
					'Total' : 'Gesamtsumme',
					'Couleurs' : 'Farben',
					'Bordure' : 'Rand',
					'Aucun' : 'Keine',
					'Sélection' : 'Auswahl'
				};
				break;

			default:

				// Default to english
				translations = {
					'Options': 'Options',
					'Focus': 'Focus',
					'Afficher le total': 'Show total',
					'Symbole': 'Symbol',
					'Icône':'Icon',
					'Delta':'Delta',
					'Classique':'Classic',
					'Léger':'Light',
					'Dessin':'Drawing',
					'Angle':'Angle',
					'Taille relative': 'Relative size',
					'Neutralité':'Neutral',
					'Devise':'Currency',
					'€': '$',
					'Style':'Style',
					'Design':'Design',
					'Candy':'Candy',
					'Executive':'Executive',
					'Espacement':'Spacing',
					'Arrondi':'Rounding',
					'Contraste':'Contrast',
					'Normal':'Normal',
					'Elevé':'High',
					'Dégradé' : 'Gradient',
					'Inverser les couleurs':'Invert colors',
					'Légende' : 'Caption',
					'Total' : 'Total',
					'Couleurs' : 'Colors',
					'Bordure' : 'Border',
					'Aucun' : 'None',
					'Sélection' : 'Selection'
				};
		}

		return translations[this] ? translations[this] : this;
	}

	return {

		// new object properties
		initialProperties: {
			version: 1.4,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInterColumnSortOrder : [],
				qInitialDataFetch: [{
					qWidth: 3,
					qHeight: 400
				}],
				qFocus:'percent',
				qTotal:true,
				qNeutrality:5,
				qCandyStyle:false,
				qSymbol: 'delta',
				qAngle: 90,
				qAutosize: true,
				qSpacing:5,
				qRounding:0,
				qContrast:false,
				qInverted:false,
				qGradient:false,
				qCustomCaption:false,
				qBorder:true,
				qEnableSelect:true
			},
			dvTotalCaption:{
				qStringExpression:{
					qExpr: "=''"
				}
			},
			dvCurrency:{
				qStringExpression:{
					qExpr: "='" + '€'.translate() + "'"
				}
			}
		},

		// property panel definition
		definition: {
			type: 'items',
			component: 'accordion',
			items: {
				dimensions: {
					uses: 'dimensions',
					min: 1,
					max: 1
				},
				measures: {
					uses: 'measures',
					min: 2,
					max: 2
				},
				sorting: {
					uses: 'sorting'
				},
				options: {
					label: 'Options'.translate(),
//					component:"expandable-items",
					type: 'items',
					items: {
						focus: {
							type: 'string',
							label: 'Focus'.translate(),
							component: 'buttongroup',
							ref: 'qHyperCubeDef.qFocus',
							options: [ {
								value: 'actual',
								label: 'N'
							}, {
								value: 'percent',
								label: '%'
							}, {
								value: 'variance',
								label: 'Δ'
							}],
							defaultValue: 'percent'
						},
						currency: {
							type: 'string',
							label: 'Devise'.translate(),
							ref: 'dvCurrency',
							defaultValue: '€'.translate(),
							expression: 'optional'
						},
						showTotal: {
							type: 'boolean',
							label: 'Afficher le total'.translate(),
							ref: 'qHyperCubeDef.qTotal',
							defaultValue: true
						},
						customCaption: {
							type: 'boolean',
							label: 'Légende'.translate(),
							ref: 'qHyperCubeDef.qCustomCaption',
							component: 'switch',
							defaultValue: false,
							options: [{
								value: false,
								translation: 'Common.Auto'
							}, {
								value: true,
								translation: 'Common.Custom'
							}],
							show: function(d) {
								return d.qHyperCubeDef.qTotal
							}
						},
						captionText: {
							type: 'string',
							label: 'Total'.translate(),
							ref: 'dvTotalCaption',
							defaultValue: '',
							expression: 'optional',
							show: function(d) {
								return d.qHyperCubeDef.qTotal && d.qHyperCubeDef.qCustomCaption
							}
						},
						enableSelect: {
							type: 'boolean',
							label: 'Sélection'.translate(),
							ref: 'qHyperCubeDef.qEnableSelect',
							component: 'switch',
							options: [
								{
									value: false,
									translation: 'properties.off'
								}, {
									value: true,
									translation: 'properties.on'
								}
							],
							defaultValue: true
						}
					}
				},
				settings: {
					uses: 'settings',
					type: 'items',
					items: {
						styleGroup: {
							label: 'Style'.translate(),
							type : 'items',
							items:{
								design: {
									type: 'boolean',
									label: 'Design'.translate(),
									ref: 'qHyperCubeDef.qCandyStyle',
									component: 'switch',
									options: [ {
										value: false,
										label: 'Candy'.translate()
										}, {
										value: true,
										label: 'Executive'.translate()
									} ],
									defaultValue: false
								},
								spacing: {
									type: 'number',
									label: 'Espacement'.translate(),
									ref: 'qHyperCubeDef.qSpacing',
									defaultValue: 5,
									component: 'slider',
									min: 0,
									max: 15,
									step: 5
								},
								border: {
									type: 'boolean',
									label: 'Bordure'.translate(),
									ref: 'qHyperCubeDef.qBorder',
									defaultValue: true,
									show: function(d) {
										return d.qHyperCubeDef.qCandyStyle
									}
								},
								rounding: {
									type: 'number',
									label: 'Arrondi'.translate(),
									ref: 'qHyperCubeDef.qRounding',
									defaultValue: 0,
									component: 'slider',
									min: 0,
									max: 15,
									step: 5,
									show: function(d) {
										return d.qHyperCubeDef.qBorder || !d.qHyperCubeDef.qCandyStyle
									}
								}
							} // Style group items
						}, // Style group
						symbolGroup : {
							label : 'Symbole'.translate(),
							type : 'items',
							items:{
								shape : {
									type: 'string',
									label: 'Icône'.translate(),
									component: 'dropdown',
									ref: 'qHyperCubeDef.qSymbol', 
									options: [
									{
										value: 'none',
										label: 'Aucun'.translate()
									},{
										value: 'delta',
										label: 'Delta'.translate()
									},{
										value: 'classic',
										label: 'Classique'.translate()
									},{
										value: 'light',
										label: 'Léger'.translate()
									},{
										value: 'draw',
										label: 'Dessin'.translate()
									}],
									defaultValue: 'delta'
								},
								angle: {
									type: 'number',
									label: 'Angle'.translate() + ' [30° - 90°]',
									ref: 'qHyperCubeDef.qAngle',
									defaultValue: 90,
									component: 'slider',
									min: 30,
									max: 90,
									step: 15,
									show: function(d) {
										return d.qHyperCubeDef.qSymbol != 'none'
									}
								},
								autosize: {
									type: 'boolean',
									label: 'Taille relative'.translate(),
									ref: 'qHyperCubeDef.qAutosize',
									defaultValue: true,
									show: function(d) {
										return d.qHyperCubeDef.qSymbol != 'none'
									}
								}
							} // Symbol Group items
						}, // Symbol Group
						colorGroup: {
							label: 'Couleurs'.translate(),
							type : 'items',
							items:{
								contrast: {
									type: 'boolean',
									label: 'Contraste'.translate(),
									ref: 'qHyperCubeDef.qContrast',
									component: 'switch',
									options: [ {
										value: false,
										label: 'Normal'.translate()
										}, {
										value: true,
										label: 'Elevé'.translate()
									} ],
									defaultValue: false
								},
								neutrality: {
									type: 'number',
									label: 'Neutralité'.translate() + ' [0% - 15%]',
									ref: 'qHyperCubeDef.qNeutrality',
									defaultValue: 7.5,
									component: 'slider',
									min: 0,
									max: 15,
									step: 2.5
								},
								gradient: {
									type: 'boolean',
									label: 'Dégradé'.translate(),
									ref: 'qHyperCubeDef.qGradient',
									defaultValue: false
								},
								inverted: {
									type: 'boolean',
									label: 'Inverser les couleurs'.translate(),
									ref: 'qHyperCubeDef.qInverted',
									defaultValue: false
								}
							} // Color group items
						} // Color group
					} // Settings items
				} // Settings
			}
		},

		// v1.4 : Added QS 3.0 Export and print capability
		support : {
			export: function( layout ) {
				return layout.qHyperCube.qDataPages[0].qMatrix.length;
			},
			exportData: function( layout ) {
				return layout.qHyperCube.qDataPages[0].qMatrix.length;
			}
		},

		// Snapshot availability
		snapshot: {
			canTakeSnapshot: true
		},

		// Object rendering
		paint: function ( $element, layout ) {

			// Get object properties and force unset values (new releases)
			var properties = {
				'focus' : (layout.qHyperCube.qFocus === undefined ? 'percent' : layout.qHyperCube.qFocus),
				'total' : (layout.qHyperCube.qTotal === undefined ? true : layout.qHyperCube.qTotal),
				'neutrality' : (layout.qHyperCube.qNeutrality === undefined ? 7.5 : layout.qHyperCube.qNeutrality),
				'currency' : (layout.dvCurrency === undefined ? '€'.translate(): layout.dvCurrency),
				'symbol' : (layout.qHyperCube.qSymbol === undefined ? 'delta' : layout.qHyperCube.qSymbol),
				'angle' : (layout.qHyperCube.qAngle === undefined ? 90 : layout.qHyperCube.qAngle),
				'autosize' : (layout.qHyperCube.qAutosize === undefined ? true : layout.qHyperCube.qAutosize),
				'executive' : (layout.qHyperCube.qCandyStyle === undefined ? false : layout.qHyperCube.qCandyStyle),
				'spacing' : (layout.qHyperCube.qSpacing === undefined ? 5 : layout.qHyperCube.qSpacing),
				'rounding' : (layout.qHyperCube.qRounding === undefined ? 0 : layout.qHyperCube.qRounding),
				'contrast' : (layout.qHyperCube.qContrast === undefined ? false : layout.qHyperCube.qContrast),
				'inverted' : (layout.qHyperCube.qInverted === undefined ? false : layout.qHyperCube.qInverted),
				'gradient' : (layout.qHyperCube.qGradient === undefined ? false : layout.qHyperCube.qGradient),
				'customCaption' : (layout.qHyperCube.qCustomCaption === undefined ? false : layout.qHyperCube.qCustomCaption),
				'totalCaption' : (layout.dvTotalCaption === undefined ? "" : layout.dvTotalCaption),
				'border' : (layout.qHyperCube.qBorder === undefined ? true : layout.qHyperCube.qBorder),
				'enableSelect' : (layout.qHyperCube.qEnableSelect === undefined ? true : layout.qHyperCube.qEnableSelect)
			};

			// Upward compatibility <= 1.2
			if (properties.focus == 'current') properties.focus = 'actual';
			if (properties.focus == 'delta') properties.focus = 'variance';

			// Single dimension component
			var dimension = layout.qHyperCube.qDimensionInfo.length == 1 ? 0 : -1; 
			var measure_actual = dimension+1; 
			var measure_previous = dimension+2; 

			// Create a new array that contains the measure labels & bounds
			var measures = layout.qHyperCube.qMeasureInfo.map( function(d) {
				return {
					'title':d.qFallbackTitle,
					'min':d.qMin,
					'max':d.qMax
					}
			});

			// Legend text
			var legend = '';
			if ( properties.total ) {
				if ( !properties.customCaption ) {
					legend = measures[0].title + ' / ' + measures[1].title; 
					// TBS : May be better parsing here... ?
					var re;
					re = /(Sum\(|Count\(|Avg\(|Min\(|Max\(|\)|\[|\])/gi; legend = legend.replace(re, '');
					re = /  /gi; legend = legend.replace(re, ' ');
				} else {
					legend = properties.totalCaption;
				}
			}

			// Create a new array for our extension with a row for each row in the qMatrix
			var page = 0;

			var dataD3 = layout.qHyperCube.qDataPages[page].qMatrix.map( function(d) {
				// for each element in the matrix, create a new object that has a property for first dimension and two measures
				return {
					'item': (dimension < 0 ? 'Δ' : (d[dimension].qIsOtherCell ? layout.qHyperCube.qDimensionInfo[dimension].othersLabel : d[dimension].qText)),
					'actual':d[measure_actual].qNum,
					'previous':d[measure_previous].qNum,
					// Computations
					'variance':(d[measure_actual].qNum - d[measure_previous].qNum),
					'percent':(d[measure_previous].qNum != 0 ? (d[measure_actual].qNum - d[measure_previous].qNum) / Math.abs(d[measure_previous].qNum) : null),
					'size':100,
					// Used for selection
					// Sense V2.0 and higher : qElemNumber value -3 now allows to select others dimension values
					//'dimensionid':d[dimension].qIsOtherCell ? null : d[dimension].qElemNumber,
					'dimensionid': (dimension < 0 ? null : d[dimension].qElemNumber),
					'selected':0
					}
				})
			;

			// Suppress null values
			for (var cell = dataD3.length-1; cell >= 0; --cell) {
				if (dataD3[cell].actual == 0 && dataD3[cell].previous == 0)
					dataD3.splice(cell, 1);
			}

			// Summarize totals
			var sumActual=0, sumPrevious=0, maxPositiveVariance=0, maxNegativeVariance=0, maximumVariance=0;
			for (var cell = 0; cell < dataD3.length; ++cell) {
				sumActual += dataD3[cell].actual;
				sumPrevious += dataD3[cell].previous;
				if ( dataD3[cell].variance >= 0 && dataD3[cell].variance > maxPositiveVariance ) {
					maxPositiveVariance = dataD3[cell].variance;
				} else if (dataD3[cell].variance < 0 && -dataD3[cell].variance > maxNegativeVariance) {
					maxNegativeVariance = (-dataD3[cell].variance);
				}
			}
			sumActual = sumActual.toRound(); 
			sumPrevious = sumPrevious.toRound(); 
			maximumVariance = Math.max(maxPositiveVariance,maxNegativeVariance);

			// Computes symbol relative size %
			if ( properties.autosize && dataD3.length > 1 && maximumVariance > 0) {
				for (var cell = 0; cell < dataD3.length; ++cell) {
					dataD3[cell].size = Math.round((100 * dataD3[cell].variance.sign() * dataD3[cell].variance)/maximumVariance);
				}
			}

			// Insert total cell
			if ( properties.total && dataD3.length > 1) {
				dataD3.unshift({
					item: 'Σ',
					actual: sumActual,
					previous: sumPrevious,
					variance: sumActual-sumPrevious,
					percent: (sumPrevious != 0) ? (sumActual-sumPrevious)/Math.abs(sumPrevious) : null,
					size:100,
					dimensionid: null,
					selected: 0
				});
			}

			// Chart object area 
			var width = $element.width();
			var height = $element.height()-4; // QS 2.2 apply rounding

			// Chart object id
			var id = 'graphics-deltaviz-delta-' + layout.qInfo.qId;

			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$('#' + id).empty();
			}
			else {
				// if it hasn't been created, create it with the appropiate id and size
				$element.append($('<div />;').attr('id', id).width(width).height(height));
			}

			// D3 rendering
			var self = this;
			deltaViz (
				self,
				dataD3, 
				measures, 
				width, 
				height, 
				id, 
				legend,
				properties,
				maxNegativeVariance,
				maxPositiveVariance
			);

			// v1.4 : Added QS 3.0 "finished rendering" notification
			return qlik.Promise.resolve();
		
		} // Paint

	}; // Extension function

} ); // Extension definition

var deltaViz = function ( self, dataD3, measures, width, height, id, legend, properties, maxNegativeVariance, maxPositiveVariance ) { 

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
			actual: 0,
			previous: 0,
			variance: 0,
			percent: 0,
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
	var kw = Math.floor((width-1)/columns);
	var kh = Math.floor((height-1)/rows);
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
		case 'variance':
		case 'actual':
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

	// Red color gradient
	var redScale = d3.scale.quantize()
		.domain(properties.inverted ? [-maxPositiveVariance,0] : [-maxNegativeVariance,0])
		.range(properties.contrast ? ['#a20025','#bd002c','#f00038'] : ['#a60058','#bf0066','#d80073'])
	;

	// Green color gradient
	var greenScale = d3.scale.quantize()
		.domain(properties.inverted ? [0,maxNegativeVariance] : [0,maxPositiveVariance])
		.range(properties.contrast ? ['#00bd00','#00a300','#008a00'] : ['#a4c400','#8eab00','#799100'])
	;

	// =====================================================================================================================
	// SVG container
	// =====================================================================================================================

	var svg = d3.select('#'+id).append('svg')
		.attr('position', 'absolute')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', width)
		.attr('height', height)
		.style('font-family','qlikview sans')
		.style('shape-rendering','geometricPrecision')
	;

	// =====================================================================================================================
	// Symbols mask definitions
	// =====================================================================================================================
	var defs = svg.append('defs')

	// Variance icon (default)
	defs.append('mask')
	.attr('id', id + '_deltaMask')
	.attr('maskContentUnits', 'objectBoundingBox')
	.append('polygon')
	.attr('fill', 'white')
	.attr('stroke-width', 0)
	.attr('points', '0,0 0,1 1,0.5')

	// Classic arrow icon
	defs.append('mask')
	.attr('id', id + '_classicMask')
	.attr('maskContentUnits', 'objectBoundingBox')
	.append('polygon')
	.attr('fill', 'white')
	.attr('stroke-width', 0)
	.attr('points', '0,0.28 0.38,0.28 0.38,0 1,0.5 0.38,1 0.38,0.72 0,0.72')

	// Light arrow icon
	defs.append('mask')
	.attr('id', id + '_lightMask')
	.attr('maskContentUnits', 'objectBoundingBox')
	.append('polygon')
	.attr('fill', 'white')
	.attr('stroke-width', 0)
	.attr('points', '0,0.432 0.705,0.432 0.335,0.101 0.447,0 1,0.50 0.447,1 0.335,0.902 0.705,0.571 0,0.571')

	// Hand drawing arrow icon
	defs.append('mask')
	.attr('id', id + '_drawMask')
	.attr('maskContentUnits', 'objectBoundingBox')
	.append('path')
	.attr('fill', 'white')
	.attr('stroke-width', 0)
	.attr('d','M0.055,0.996l0.927-0.469c0.011-0.006,0.018-0.016,0.018-0.026c0.000-0.011-0.007-0.021-0.018-0.026' +
		'L0.055,0.004C0.044-0.001,0.030-0.001,0.018,0.004C0.007,0.009,0.000,0.020,0.000,0.031v0.939c0.000,0.011,0.007,0.021,0.018,0.027' +
		'C0.030,1.001,0.044,1.001,0.055,0.996zM0.073,0.148c0.003,0.001,0.007,0.001,0.010,0.002c-0.003,0.005-0.006,0.011-0.010,0.016' +
		'V0.148 zM0.073,0.249c0.010-0.005,0.023-0.013,0.044-0.024l-0.044,0.073' +
		'V0.249 zM0.073,0.379L0.073,0.379c0.011-0.009,0.026-0.024,0.049-0.047' +
		'c-0.018,0.029-0.035,0.057-0.049,0.080V0.379 zM0.073,0.493l0.090-0.099' +
		'c-0.001,0.001-0.001,0.002-0.002,0.003C0.120,0.464,0.092,0.511,0.073,0.543V0.493zM0.073,0.625' +
		'c0.000,0.000,0.001-0.001,0.001-0.002c0.021-0.020,0.059-0.064,0.140-0.158c0.001-0.001,0.001-0.001,0.002-0.002C0.144,0.579,0.100,0.652,0.073,0.699V0.625 ' +
		'zM0.073,0.787l0.190-0.233C0.133,0.767,0.091,0.839,0.079,0.865c-0.001,0.001-0.001,0.002-0.002,0.003' +
		'l0.001,0.000c-0.005,0.011-0.004,0.013-0.003,0.015c0.002,0.005,0.006,0.009,0.011,0.011c0.010,0.004,0.022,0.001,0.028-0.007c0.059-0.079,0.131-0.174,0.198-0.262' +
		'l-0.108,0.180c-0.005,0.009-0.001,0.020,0.010,0.025c0.010,0.004,0.014,0.006,0.029-0.008l0.001,0.000l0.001-0.002' +
		'c0.012-0.013,0.032-0.038,0.066-0.082c0.020-0.026,0.043-0.055,0.067-0.086c-0.022,0.037-0.043,0.070-0.057,0.095c0.000,0.000,0.000,0.000,0.000,0.000c-0.005,0.009-0.002,0.019,0.008,0.024' +
		'c0.010,0.005,0.022,0.003,0.029-0.005L0.500,0.599c-0.005,0.008-0.009,0.015-0.013,0.021c-0.041,0.066-0.041,0.066-0.038,0.074c0.002,0.005,0.006,0.009,0.011,0.011' +
		'c0.009,0.004,0.013,0.006,0.029-0.009l0.001,0.000c0.000,0.000,0.001-0.001,0.002-0.003c0.010-0.010,0.025-0.027,0.048-0.055c-0.002,0.008,0.002,0.017,0.011,0.021' +
		'c0.008,0.003,0.012,0.005,0.028-0.008l0.001,0.000l0.001-0.002c0.011-0.010,0.028-0.026,0.054-0.053c0.000,0.001,0.001,0.003,0.001,0.004' +
		'c0.002,0.006,0.008,0.010,0.014,0.012c0.007,0.002,0.014,0.001,0.020-0.003l0.122-0.081l0.018,0.005c0.001-0.003,0.006-0.009,0.010-0.016' +
		'c0.003-0.005,0.006-0.009,0.007-0.012c0.006-0.009,0.006-0.012,0.004-0.018c-0.002-0.006-0.007-0.010-0.014-0.012c-0.007-0.002-0.014-0.001-0.020,0.003l-0.077,0.051' +
		'c0.013-0.022,0.028-0.045,0.039-0.064c0.000,0.000,0.000,0.000,0.000,0.000c0.005-0.008,0.002-0.019-0.008-0.024c-0.009-0.005-0.022-0.003-0.029,0.004c-0.016,0.016-0.034,0.035-0.052,0.055' +
		'l0.037-0.061c0.005-0.009,0.001-0.020-0.010-0.025c-0.009-0.004-0.013-0.006-0.028,0.009l-0.001,0.000l-0.002,0.004' +
		'c-0.009,0.009-0.020,0.022-0.037,0.041c0.035-0.058,0.034-0.060,0.031-0.067c-0.002-0.005-0.006-0.009-0.011-0.011c-0.010-0.004-0.021-0.002-0.027,0.006l-0.140,0.162' +
		'c0.063-0.104,0.090-0.150,0.101-0.171c0.001-0.002,0.002-0.003,0.003-0.004L0.586,0.380c0.006-0.013,0.006-0.014,0.005-0.017c-0.002-0.005-0.006-0.009-0.011-0.011' +
		'c-0.008-0.003-0.012-0.005-0.028,0.010l-0.002-0.001c0.000,0.001-0.002,0.004-0.005,0.008c-0.021,0.023-0.058,0.071-0.132,0.166l0.115-0.190' +
		'c0.005-0.009,0.001-0.020-0.010-0.025c-0.007-0.003-0.012-0.005-0.028,0.009L0.489,0.330l-0.003,0.005c-0.024,0.024-0.072,0.084-0.177,0.224' +
		'c0.051-0.084,0.105-0.172,0.151-0.246c0.000,0.000,0.000,0.000,0.000,0.000c0.005-0.009,0.002-0.019-0.008-0.024c-0.010-0.005-0.023-0.003-0.029,0.005L0.205,0.560' +
		'c0.057-0.094,0.123-0.201,0.177-0.287c0.003-0.005,0.003-0.009,0.001-0.014c-0.002-0.005-0.006-0.009-0.011-0.011c-0.008-0.003-0.012-0.005-0.028,0.008l-0.001-0.001' +
		'c-0.001,0.001-0.002,0.003-0.002,0.004c-0.022,0.020-0.062,0.068-0.150,0.170c0.003-0.005,0.006-0.010,0.009-0.015c0.067-0.110,0.094-0.155,0.104-0.175l0.002-0.002' +
		'l-0.001,0.000c0.006-0.012,0.005-0.014,0.004-0.017c-0.002-0.006-0.009-0.011-0.017-0.012c-0.008-0.001-0.016,0.001-0.021,0.007L0.184,0.310' +
		'C0.251,0.200,0.250,0.197,0.247,0.190c-0.002-0.005-0.006-0.009-0.011-0.011c-0.009-0.004-0.020-0.002-0.027,0.005c-0.015,0.016-0.033,0.034-0.052,0.053l0.036-0.059' +
		'c0.005-0.008,0.002-0.017-0.005-0.022c-0.007-0.006-0.018-0.006-0.027-0.001c0.000,0.000-0.024,0.014-0.051,0.030c0.026-0.043,0.026-0.044,0.023-0.051c-0.002-0.005-0.006-0.009-0.011-0.011' +
		'c-0.002-0.001-0.003-0.001-0.041-0.009c0.001-0.006-0.003-0.012-0.010-0.016V0.085l0.820,0.415l-0.820,0.415' +
		'V0.787z')
	;

	// =====================================================================================================================
	// Tiles area
	// =====================================================================================================================
	var selectionCount = 0;
	var tile = svg.selectAll('g')
		.data(dataD3)
		.enter()
		.append('g')
		.attr('transform', function(d,i) { return 'translate(' + (Math.floor(kw*(i%columns))+0.5) + ',' + (Math.floor(kh*Math.floor(i/columns))+0.5) + ')'; })
		// Selectable area
		.attr('data-dimensionid', function(d) { return d.dimensionid; })
		.attr('cursor',cursor)
		.on('click', clickTile)
	;

	// Show hand cursor on selectable area
	function cursor (d) {
		if (properties.enableSelect === false || self.inEditState() === true || d.dimensionid === null || d.item === null || d.item === undefined || self.options.selections === false) 
			return 'default'; 
		return 'pointer';
	};

	// When user select a tile
	function clickTile(d,i) {

		// No selection here...
		if (properties.enableSelect === false || self.inEditState() === true || self.selectionsEnabled == false || d.dimensionid === null || d.item === undefined  || self.options.selections === false)
			return;

		// Toggle selection
		d.selected = 1-d.selected;
		selectionCount += (d.selected === 1 ? 1 : -1);

		// Visual feedback
		if ( properties.executive ) {
			// Highlight selections in QS green
			svg.selectAll('rect')
			.attr('fill-opacity', function(d) { 
				return selectionCount > 0 ? ( d.selected ? 0.3 : 0.2 ) : 0. ; 
			})
			.attr('fill', function(d) { 
				return selectionCount > 0 ? ( d.selected ? '#52cc52' : '#cccccc' ) : 'white' ; 
			})
		} else {
			// Highlight selections by opacity
			svg.selectAll('rect')
			.attr('fill-opacity', function(d) { 
				return selectionCount > 0 ? ( d.selected ? 1. : 0.5 ) : 1. ; 
			})
		}

		// Toggle QS selection for first dimension
		var dim = 0, value = d.dimensionid;
		// QS 2.0 and higher reported issue ID QLIK-37933 : Does'nt unselect last selected value. (Solved in QS 2.2)
		self.selectValues( dim, [value], true );

	}

	// =====================================================================================================================
	// Tooltip
	// =====================================================================================================================
	tile.append('title')
		.text( function (d) {
			var t;
			if (d.item === null) return '';
			t = (d.item === undefined) ? '' : (d.item == 'Σ' ? 'Σ ' + legend : d.item);
			if (d.actual !== null) t+= '\n' + measures[0].title + ' = ' + d.actual.toMoney(properties.currency);
			if (d.previous !== null) t+= '\n' + measures[1].title + ' = ' + d.previous.toMoney(properties.currency);
			if (d.variance !== null) t+= '\n' + 'Δ = ' + ( d.variance > 0 ? '+' : '') + d.variance.toMoney(properties.currency);
			if (d.percent !== null) t+= ' (' + ( d.percent > 0 ? '+' : '') + d.percent.toPercent(2) + ')'; 
			return t;
		})
	;

	// =====================================================================================================================
	// Background
	// =====================================================================================================================
	tile.append('rect')
		.attr('x', bx) 
		.attr('y', by) 
		.attr('rx', properties.rounding)
		.attr('ry', properties.rounding)
		.attr('width', bw) 
		.attr('height', bh) 
		.attr('fill', properties.executive ? 'white' : deltaColor)
		.attr('fill-opacity', properties.executive ? 0 : 1)
		.attr('stroke-width', properties.executive && properties.border ? '1px' : '0')
		.attr('stroke', '#cccccc')
	;

	// =====================================================================================================================
	// Highlight color (Background for Candy style; Symbol, % and variance for Executive style)
	// =====================================================================================================================
	function deltaColor(d) {

		// Total
		if ( d.item == 'Σ') return properties.contrast ? '#647687' : '#647687';
		
		// Discrete
		if ( (d.item === null) || (d.previous == 0) ) return properties.contrast ? '#87794e' : '#bbbbbb';
		
		// Delta palette
		var invert = properties.inverted ? -1 : 1;
		// Positive variance ?
		if (d.percent * invert > (properties.neutrality /100.)) { 
			// Green
			return properties.gradient ? greenScale(d.variance * invert) : properties.contrast ? '#008a00' : '#a4c400'; 
		// Négative variance ?
		} else if (d.percent * invert < (-properties.neutrality /100.)) { 
			// Red
			return properties.gradient ? redScale(d.variance * invert) : properties.contrast ? '#a20025' : '#d80073'; 
		// Neutral zone
		} else {
			// Amber
			// return properties.contrast ? '#fa6800' : '#f0a30a';
			// // Blue
			return properties.contrast ? '#0050ef' : '#1ba1e2';
		};
	};

	// =====================================================================================================================
	// Background image for missing data
	// =====================================================================================================================
	var iw = Math.floor(Math.min(bw,bh)*0.75);
	tile.filter(function(d) { return d.item === null }).append('svg:image')
		.attr('x',cx-iw/2)
		.attr('y',cy-iw/2)
		.attr('width', iw)
		.attr('height', iw)
		.attr('xlink:href','/extensions/graphics-deltaviz-delta/background.png')
	;

	// =====================================================================================================================
	// Top right caption
	// =====================================================================================================================
	tile.append('text')
		.attr('x', dx+dw-1) 
		.attr('y', dy+fsCaption-1) 
		.attr('text-anchor', 'end')
		.attr('font-size', fsCaption + 'px')
		.attr('fill', !properties.executive ? 'white' : 'grey')
		.text( function (d) {
			if ( d.item === null || d.item === undefined) return '';
			var s = d.item;
			// No label (i.e. missing Other dimensions label)
			if (s == '') return ''
			// Total legend
			if ( legend != '' && (s == 'Σ' || s == 'Δ') ) s += ' ' + legend;
			// Truncate long text
			var maxLength = Math.max(2,Math.floor( dw / (fsCaption * 0.6)));
			if (s.length > maxLength) {
				s = s.substr(0,maxLength-1) + '…';
			}
			return s;
		})
	;

	// =====================================================================================================================
	// Main centered text
	// =====================================================================================================================
	tile.append('text')
		.attr('x', dx+dw-1) 
		.attr('y', cy-5+fsCenter/2)
		.attr('text-anchor', 'end')
		.attr('font-size', fsCenter + 'px')
		.attr('fill', !properties.executive ? 'white' : properties.focus == 'actual' ? 'grey' : deltaColor)
		.text(function(d) { 
			if ( d.item === null ) return '';
			switch ( properties.focus ) {
				case 'variance':
					// Show variance
					return ( d.variance > 0 ? '+' : '') + d.variance.toAmount(properties.currency);
					break;
				case 'actual':
					// Show actual amount
					return d.actual.toAmount(properties.currency);
					break;
				default:
					// Show % 
					if ( d.previous == 0 || d.percent === null) return (d.actual == 0 ? '0 %' : (d.actual > 0 ? '++ %' : '-- %'));
					if ( d.percent >= 10 ) {
						return '+>>> %'
					} else if ( d.percent <= -10 ) {
						return '-<<< %'
					} else {
						var decimals = 1;
						if (d.percent > 1 || d.percent < -1 || bw <= 125 || bh < 100) decimals=0;
						return ( d.percent > 0 ? '+' : '') + d.percent.toPercent(decimals);
					}
					break;
				}
		})
	;

	// =====================================================================================================================
	// Icon
	// =====================================================================================================================
	if (properties.symbol != 'none') {
		tile.filter( function(d) { return !( (d.item === null) || (d.previous == 0 && d.actual == 0) )}).append('path')
			.attr('stroke', 'none')
			.attr('fill', !properties.executive ? 'white' : deltaColor)
			.attr('d','M0 0v' + psArrow + 'h' + psArrow + 'v-' + psArrow + 'z')
			.attr('mask', 'url(' + url + '#' + id + '_' + properties.symbol + 'Mask' + ')')
			.attr('transform', function (d) {
				// Step 4 : Translate symbol center to final position
				var transform = 'translate('+Math.floor(dx + 3*padding + psArrow/2)+','+Math.floor(cy)+')';
				// Step 3 : Rotate symbol
				if (d.percent > (properties.neutrality /100.)) { 
					transform += ' rotate(-' + properties.angle + ')';
				} else if (d.percent < (-properties.neutrality /100.)) { 
					transform += ' rotate(' + properties.angle + ')';
				}
				// Step 2 : Scale size
				transform += ' scale(' + ((psArrow/2) + ((psArrow * d.size/100)/2)) / psArrow + ')';
				// Step 1 : Translate to symbol center to apply rotation and scale transformations
				transform += ' translate('+Math.floor(-psArrow/2)+','+Math.floor(-psArrow/2)+')';
				return transform;
			})
	}; // Display icon

	// Bottom left & right caption
	if (fsBottom >= 8) {

		// =====================================================================================================================
		// Bottom left caption
		// =====================================================================================================================
		tile.append('text')
			.attr('y', dy+dh-1) 
			.attr('x', dx) 
			.attr('text-anchor', 'start')
			.attr('font-size', fsBottom + 'px')
			.attr('fill', !properties.executive ? 'white' : deltaColor)
			.text(function(d) { 
				if (d.item === null) return '';
				switch ( properties.focus ) {
					case 'percent':
						// Show variance
						return (!properties.executive ? 'Δ ' : '' ) + ( d.variance > 0 ? '+' : '') + d.variance.toAmount(properties.currency);
						break;
					default:
						// Show %
						if ( d.previous == 0 || d.percent === null) return (d.actual == 0 ? '0 %' : (d.actual > 0 ? '++ %' : '-- %'));
						if ( d.percent >= 10 ) {
							return '+>>> %'
						} else if ( d.percent <= -10 ) {
							return '-<<< %'
						} else {
							var decimals = 1;
							if (d.percent > 1 || d.percent < -1 || bw <= 125 || bh < 100) decimals=0;
							return ( d.percent > 0 ? '+' : '') + d.percent.toPercent(decimals);
						}
						break;
				}
			})
		;

		// =====================================================================================================================
		// Bottom right caption
		// =====================================================================================================================
		tile.append('text')
			.attr('y', dy+dh-1) 
			.attr('x', dx+dw-1) 
			.attr('text-anchor', 'end')
			.attr('font-size', (fsBottom+2) + 'px')
			.attr('fill', !properties.executive ? 'white' : properties.focus == 'actual' ? deltaColor : 'grey')
			.text( function(d) { 
				if (d.item === null) return '';
				switch ( properties.focus ) {
					case 'percent':
					case 'variance':
						// Show actual
						return d.actual.toAmount(properties.currency);
						break;
					default:
						// Show variance
						return (!properties.executive ? 'Δ ' : '' ) + ( d.variance > 0 ? '+' : '') + d.variance.toAmount(properties.currency);
						break;
				}
			})
		;

	}; // Display bottom captions

}; // deltaViz
