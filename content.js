$("a[href$='mp3'], a.download").click(function() {
  chrome.extension.sendRequest({audioSrc: this.href});
  // TODO - Add notification the song has been queued to play.
  return false;
});

$(function() {
  var src = document.getElementsByTagName('script');
      js  = src[src.length - 1].innerText.match(/db:({.*})\}/),
      db  = JSON.parse(js[1]),
      trck= $('#main-content-inner div.player:first').attr('data-sc-track');
  chrome.extension.sendRequest({audioSrc: db.tracks[trck].streamUrl});
});
