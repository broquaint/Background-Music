$("a[href$='mp3']").click(function() {
  console.log('Sending request of ', this.href);
  chrome.extension.sendRequest({audioSrc: this.href}, function(response) {
     console.log(response.result);
  });
  return false;
});
