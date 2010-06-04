function durationToString(duration) {
  if(!duration)
   return '0:00';

  var hr  = Number(duration / 3600).toFixed(0),
      min = Number(duration / 60).toFixed(0),
      sec = Number(duration % 60).toFixed(0);
  var hrStr  = ( hr  > 1 ? hr  + ':' : '' ),
      minStr = ( min > 1 ? (min < 10 ? '0'+min : min) + ':' : '0:' ),
      secStr = ( sec > 1 ? (sec < 10 ? '0'+sec : sec) : '00' );

  return hrStr + minStr + secStr;
}

$(function() {
  // Should be safe to do this on each load as the audio src can't
  // change without closing and reopening the popup.
  var audio = chrome.extension.getBackgroundPage().document.getElementById('bgm');

  // Setup controls
  $('#play').click(function() {
    if(audio.readyState != audio.HAVE_ENOUGH_DATA) {
      $('#status').text('Audio not available');
      return;
    }
    
    audio.play();
  });
  $('#pause').click(function() {
    if(audio.readyState != audio.HAVE_ENOUGH_DATA)
      return;

    audio.pause();
  });

  // Set status to the appropriate state
  $('#status').text(
    audio.readyState != audio.HAVE_ENOUGH_DATA
      ? 'Inactive'
      : audio.seeking   // XXX Doesn't seem to work presently
        ? 'Seeking ...'
        : !audio.paused
          ? 'Playing ...'
          : 'Paused.'
  );

  $(audio).bind('play',  function() { $('#status').text('Playing ...') });
  $(audio).bind('pause', function() { $('#status').text('Paused.')     });

  // Setup original source
  if(localStorage.getItem('origUrl')) {
    var origUrl = localStorage.getItem('origUrl');
    $('#source')
      .html("<a title='"+origUrl+"' href='"+origUrl+"'>Origin page</a>")
      .click(function() { chrome.tabs.create({url: origUrl}); return false; });
  }

  // Enable tracking and display current time.
  $('#track-seek')
    .attr('max', audio.duration)
    .change(function() {
      audio.pause();
      audio.currentTime = this.value;
      audio.play();
  });
  $('#track-len').text( durationToString(audio.duration) );

  function updatePos() {
    var now = audio.currentTime;
    $('#pos').text( durationToString(now) );
    $('#track-seek').attr('value', now);
  }

  $(audio).bind('timeupdate', updatePos);
  updatePos();
});
