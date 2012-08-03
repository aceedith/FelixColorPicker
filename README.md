# FelixColorPicker
FelixColorPicker is static colorpicker.

## Usage
### HTML
```html
<div></div>
<input type="button" value="ColorPicker" />
```

### Javascript
```Javascript
$('div').felixColorPicker();
$('input').felixColorPicker({
	pickerMode: true
});
```

### Options
```Javascript
$('div').felixColorPicker({
	pickerMode : false,		// ture|false : 모드설정, true 일 경우에는 div가 따로 생성되고, false 인 경우에는 해당 객체 내부에 append
	pickerWidth : 11,		// 각 색상의 너비값
	pickerHeight : 11,		// 각 색상의 높이값
	layerWidth : 204,		// 해당 레이어의 너비값
	layerHeight : 85,		// 해당 레이어
	layerStyle : 'border: 1px solid black; padding: 2px; background-color: white;',		// 해당 레이어의 스타일 지정
	pickerStyle : 'border: 1px solid #A0A0A0; margin: 2px',		// 각 색상의 스타일 지정
	selection : null,		// 선택 되었을때 실행할 함수
	zIndex : 10000			// z-index 값
});
```