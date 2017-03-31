var vgaButton = document.querySelector("button#vga");
var hvgaButton = document.querySelector("button#hvga");
var qvgaButton = document.querySelector("button#qvga");
//var hdButton = document.querySelector("button#hd");

var dimensions = document.querySelector("p#dimensions");

var video = document.querySelector("video");
var stream;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function successCallback(gotStream) {
  window.stream = gotStream; // stream available to console
  video.src = window.URL.createObjectURL(stream);
  //video.src = stream;
  video.play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

/*
function displayVideoDimensions() {
	  dimensions.innerHTML = "Actual video dimensions: " + video.videoWidth +
	    "x" + video.videoHeight + 'px.';
	}

video.addEventListener('play', function(){
  //setTimeout(function(){
    displayVideoDimensions();
  //}, 500);
});
*/


/*
video.addEventListener('play', function(){
  console.log('width: ' + video.videoWidth);
  console.log('height: ' + video.videoHeight);

  alert('Video dimensions set to: ' + video.videoWidth +
		    "x" + video.videoHeight + 'px.' );
});
*/


var qvgaConstraints  = {
  video: {
    mandatory: {
      maxWidth: 320,
      maxHeight: 240
    }
  }
};

var hvgaConstraints  = {
  video: {
    mandatory: {
      maxWidth: 480,
      maxHeight: 360
    }
  }
};

var vgaConstraints  = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480
    }
  }
};

/*
var hdConstraints  = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 960
    }
  }
};
*/

qvgaButton.onclick = function(){getMedia(qvgaConstraints)};
hvgaButton.onclick = function(){getMedia(hvgaConstraints)};
vgaButton.onclick = function(){getMedia(vgaConstraints)};
//hdButton.onclick = function(){getMedia(hdConstraints)};

function getMedia(constraints){
  if (!!stream) {
    // 2017/02/10
    // quitada la línea siguiente porque da mensaje de error en el servidor
    // video.src = null;
    //
    // https://github.com/andyet/SimpleWebRTC/issues/363
    // Problem is fairly simple, and related to M47's change in stopping media streams.
    // https://github.com/andyet/SimpleWebRTC/blob/master/simplewebrtc.js#L426
    // replace
    //stream.stop();
    // with
    stream.getTracks().forEach(function (track) { track.stop(); });
  }
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}