chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  var snd = request.audioSrc,
      bgm = $('#bgm').remove();
  
  // Recreate the audio element so we can switch tracks.
  bgm     = $('<audio src="" id="bgm"></audio>').get(0);
  bgm.src = snd;
  bgm.play();

  document.body.appendChild(bgm);

  localStorage.setItem('origUrl', sender.tab.url);
  localStorage.setItem('origSrc', snd);

  var notification = webkitNotifications.createNotification(
    'icons/icon_128.png', 'About to play',
    (snd.match(/\/([^/]+)$/))[1]
  );
  notification.show();
});

$(function() {
  // Load up the last piece of audio if available.
  var snd = localStorage.getItem('origSrc');
  if(!snd)
    return;

  var bgm = $('#bgm').get(0);
  bgm.src = snd;
  bgm.load();
    
  var pos = localStorage.getItem('origPos');
  if(pos)
    // Only set the track position when it's valid to.
    $(bgm).bind('loadedmetadata', function() { this.currentTime = pos });
});
