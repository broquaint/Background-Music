$(function() {
  var audio = chrome.extension.getBackgroundPage().document.getElementById('bgm');
  $('#curplay').text( (audio.src.match(/\/([^/]+)$/))[1] );
  $('#cursrc').text( localStorage.getItem('origUrl') );
});
