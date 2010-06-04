$("a[href$='mp3']").click(function() {
  chrome.extension.sendRequest({audioSrc: this.href});
  // TODO - Add notification the song has been queued to play.
  return false;
});
