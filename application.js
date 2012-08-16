$(function (){

  prettyPrint();

  $('#picker01').felixColorPicker({
    select: function (color){
      $('.select-color').css({
        backgroundColor: color
      });
    }
  });
  $('#picker02').felixColorPicker({
    pickerMode: true,
    select: function (color){
      $('#picker02').css({
        backgroundColor: color
      });
    }
  });
  $('#picker03').felixColorPicker();
  $('#picker04').felixColorPicker({
    select: function (color){
      $(this).next().css({
        backgroundColor: color
      });
    }
  });
  $('#picker05').felixColorPicker({
    pickerMode: true,
    select: function (color){
      $(this).css({
        backgroundColor: color
      });
    }
  });
  $('#picker06').felixColorPicker({
    pickerMode: true,
    select: function (color){
      $(this).css({
        backgroundColor: color
      });
    }
  });

  $('ul.nav').on('click.active', 'li', function (){
    $(this).parent().children().removeClass('active');
    $(this).addClass('active');
  });
  $('.brand').click(function (){
    $('ul.nav').children().removeClass('active');
  });
});