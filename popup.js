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
    if(audio.ended == true)
      audio.currentTime = 0;
    
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
      ? 'Inactive.'
      : !audio.paused
        ? 'Playing ...'
        : 'Paused.'
  );

  $((audio.paused ? '#pause' : '#play') +' img').toggleClass('inactive');

  $(audio).bind('play',  function() {
    $('#status').text('Playing ...');
    $('#play img').toggleClass('inactive');
    $('#pause img').toggleClass('inactive');
  });
  $(audio).bind('pause', function() {
    $('#status').text('Paused.');
    $('#play img').toggleClass('inactive');
    $('#pause img').toggleClass('inactive');
  });

  // Setup original source
  if(localStorage.getItem('origUrl')) {
    var origUrl = localStorage.getItem('origUrl'),
        origSrc = localStorage.getItem('origSrc');
    $('#save')
      .click(function() { chrome.tabs.create({url: origSrc}); return false; })
      .find('a').attr({title: "Save to disk\n"+origSrc, href: origSrc});
    $('#source')
      .click(function() { chrome.tabs.create({url: origUrl}); return false; })
      .find('a').attr({title: "Source of audio\n"+origUrl, href: origUrl});
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
    var now = this.currentTime;
    $('#pos').text( durationToString(now) );
    $('#track-seek').attr('value', now);
    try {
      localStorage.setItem('origPos', now);
    } catch (x) {
      // XXX The above works *and* throws:
      // TypeError: Cannot call method 'setItem' of null
    }
  }

  updatePos.call(audio);

  $(audio)
    .bind('timeupdate', updatePos)
    .bind('ended', function() {
      localStorage.setItem('origPos', false);
      $('#status').text('End of track.');
    })
    .bind('durationchange', function() {
      // If the popup is displayed and this event is fired it probably means
      // that the track is still loading.
      $('#track-seek').attr('max', this.duration);
      $('#track-len').text( durationToString(this.duration) );
      $('#status').text('Paused.');
    });
});
