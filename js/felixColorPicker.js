(function($, undefined) {

	var PROP_NAME = 'FelixColorPicker';
	var director = 'Felix Sungchul Kang';
	var version = '1.0';
	var base = 'jquery-1.6.2';
	// 클래스 정의 및 데이터 정의
	function FelixColorPicker() {
		this.debug = false;
		this.director = director;
		this.version = version;
		this.base = base;
		this._defaultColors = {
			colors : ['#FFCCFF', '#FF99FF', '#CC66CC', '#66FFFF', '#FF9933', '#000066', '#99FF66', '#CC0066', '#3300CC', '#330000', '#336600', '#000000', '#FFFF99', '#FF66FF', '#FF33FF', '#00CCFF', '#FFCC33', '#0000CC', '#66CC66', '#990066', '#990099', '#333300', '#339933', '#333333', '#99FF99', '#FF3333', '#FF00FF', '#0099FF', '#FFFF00', '#660099', '#00CC00', '#990033', '#CC00CC', '#003300', '#336699', '#666666', '#99FFFF', '#FF6633', '#FF0099', '#0066FF', '#CCFF66', '#6600FF', '#009900', '#990000', '#CC0099', '#003333', '#3333CC', '#CCCCCC', '#9999CC', '#FFCC66', '#FF0000', '#0033CC', '#CCFF00', '#CC3399', '#006600', '#993300', '#660033', '#000033', '#333366', '#FFFFFF']
		}
		this._defaults = {
			pickerMode : false,		// ture|false : 모드설정, true 일 경우에는 div가 따로 생성되고, false 인 경우에는 해당 객체 내부에 append
			pickerWidth : 11,		// 각 색상의 너비값
			pickerHeight : 11,		// 각 색상의 높이값
			layerWidth : 204,		// 해당 레이어의 너비값
			layerHeight : 85,		// 해당 레이어
			layerStyle : 'border: 1px solid black; padding: 2px; background-color: white;',		// 해당 레이어의 스타일 지정
			pickerStyle : 'border: 1px solid #A0A0A0; margin: 2px',		// 각 색상의 스타일 지정
			selection : null,		// 선택 되었을때 실행할 함수
			zIndex : 10000			// z-index 값
		}
		$.extend(this._defaults, this._defaultColors);
	}

	// 클래스 확장 및 함수 확장
	$.extend(FelixColorPicker.prototype, {
		log : function() {
			if(this.debug) {
				console.log.apply('', arguments);
			}
		},
		setDefault : function(settings) {
			extendRemove(this._defaults, settings || {});
			return this;
		},
		_attachColorPicker : function(target, settingsArgs) {
			var settings = $.extend({}, this._defaults, settingsArgs);
			var inst = {}
			inst.settings = $.extend({}, this._defaults, settings);
			$.data(target, PROP_NAME, inst);
			var _tagClass = 'felix-colorPickerLayer';
			if(!inst.settings.pickerMode) {
				var staticClass = _tagClass + 'Static';
				$(target).append('<div class="' + staticClass + '" style="' + inst.settings.layerStyle + '"></div>');
				$('.' + staticClass).css('position', 'absolute');
				$('.' + staticClass).width(inst.settings.pickerWidth < inst.settings.layerWidth ? inst.settings.layerWidth : inst.settings.pickerWidth);
				this._colorPickerAppend('.' + staticClass, $('.' + staticClass), inst.settings);
			} else {
				$(target).click(function() {
					var absoluteClass = _tagClass + 'Absolute';
					var _colorPicerPosition = $(target).position();
					$.felixColorPicker._destroy();
					$('body').append('<div class="' + absoluteClass + '" style="' + inst.settings.layerStyle + '"></div>');
					$('.' + absoluteClass).css({
						position: 'absolute',
						top: _colorPicerPosition.top,
						left: _colorPicerPosition.left,
						width: inst.settings.layerWidth,
						height: inst.settings.layerHeight,
						zIndex: inst.settings.zIndex,
					});
					$.felixColorPicker._colorPickerAppend(target, $('.' + absoluteClass), inst.settings);
				});
			}

		},
		_colorPickerAppend : function(target, appendTo, settings) {
			var chipsHTML = '';
			var chipsPrefix = 'colorChip_';
			for(var i = 0; i < settings.colors.length; i++) {
				var colorChipsClass = chipsPrefix + i;
				var colorChip = settings.colors[i];

				chipsHTML = chipsHTML + '<div class="colorChips" style="background-color: ' + colorChip + ';"></div>';
			}

			$(appendTo).append(chipsHTML);
			$('.colorChips').css({
				position: 'relative',
				width: settings.pickerWidth,
				height: settings.pickerHeight,
				float: 'left'
			});
			$(appendTo).on('click.chip', '.colorChips', function (){
				$.felixColorPicker._selection(target, $(this).css('background-color'), settings.selection, settings.pickerMode);
			});
			$('.colorChips').css('cursor', 'pointer');
			if(settings.layerStyle && settings.pickerMode) {
				this._setStyle($('.felix-colorPickerLayer'), settings.layerStyle);
			} else if(settings.layerStyle && !settings.pickerMode) {
				this._setStyle(target, settings.layerStyle);
			}
			if(settings.pickerStyle) {
				this._setStyle($('.colorChips'), settings.pickerStyle);
			}

			var space = $(target).css('padding').toString().replace(/px/gi, '') * 2;
			space = $(target).css('border-width').toString().replace(/px/gi, '') * 2 + space;

			$(target).parent().css({
				width: $(target).width() + space,
				height: $(target).height() + space
			});
		},
		_setStyle : function(target, style) {
			var cssStyle = style.split(';');
			for(var i = 0; i < cssStyle.length; i++) {
				var tmpCss = cssStyle[i].split(':');
				if(tmpCss[0].trim()) {
					$(target).css(tmpCss[0].trim(), tmpCss[1].trim());
				}
			}
		},
		_optionColorPicker : function(target, name, val) {
			var inst = this._getInst(target);
			var settings = name || {};
			if(!val){
				return inst.settings[name];
			}
			if( typeof name == 'string') {
				settings = {};
				settings[name] = val;
			}
			extendRemove(inst.settings, settings);
		},
		_destroy : function() {
			$('.felix-colorPickerLayer').remove();
		},
		_getInst : function(target) {
			try {
				return $.data(target, PROP_NAME);
			} catch (err) {
				throw 'Missing instance data for this colorpicker.';
			}
		},
		_selection : function(target, pickColor, func, mode) {
			if(func) {
				func(pickColor);
			}
			else {
				if(!mode){
					$(target).val(pickColor);
				}
			}
			if(mode) {
				$('.felix-colorPickerLayerAbsolute').remove();
			}
		}
	});

	// $(객체).colorPicker() 로 사용 가능하도록 지정. $.fn.이름 으로 한다.
	$.fn.felixColorPicker = function(option) {
		if(!this.length) {
			return this;
		}
		var otherArgs = Array.prototype.slice.call(arguments, 1);

		if( typeof option == 'string' && otherArgs.length >= 1 && option == 'option') {
			return $.felixColorPicker['_' + option + 'ColorPicker'].apply($.felixColorPicker, [this[0]].concat(otherArgs));
		} else if( typeof option == 'string' && option != 'option') {
			return false;
		}
		// 여기서 this는 jQuery의 객체
		return this.each(function() {
			// 여기서 this는 .get(0), 즉 DOM의 객체
			$.felixColorPicker._attachColorPicker(this, option);
		});
	};
	// 기본 세팅값을 변경해주는 함수
	/* jQuery extend now ignores nulls! */
	function extendRemove(target, props) {
		$.extend(target, props);
		for(var name in props)
		if(props[name] == null || props[name] == undefined)
			target[name] = props[name];
		return target;
	}

	// $.felixColorPicker 생성
	$.felixColorPicker = new FelixColorPicker();
	$.felixColorPicker.director = director;
	$.felixColorPicker.version = version;
	$.felixColorPicker.base = base;

	// 요긴 자바스크립트에서 trim(), rtrim(), ltrim() 함수 구현
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	}

	String.prototype.ltrim = function() {
		return this.replace(/^\s+/, "");
	}

	String.prototype.rtrim = function() {
		return this.replace(/\s+$/, "");
	}
})(jQuery);
