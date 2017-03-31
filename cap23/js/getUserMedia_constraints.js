var vgaButton = document.querySelector("button#vga");
var hvgaButton = document.querySelector("button#hvga");
var qvgaButton = document.querySelector("button#qvga");
//var hdButton = document.querySelector("button#hd");

var dimensions = document.querySelector("p#dimensions");

var video = document.querySelector("video");
var stream = new MediaStream();

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = (constraints) => {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

/*
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
*/
/*
function successCallback(gotStream) {
  window.stream = gotStream; // stream available to console
  video.src = window.URL.createObjectURL(stream);
  //video.src = stream;
  video.play();
}

  function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error);
  }
*/

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
    width: {min: 320, max: 320},
    height: {min:240, max: 240}
  }
};

var hvgaConstraints  = {
  video: {
      width: {min: 480, max: 480},
    height: {min: 360, max: 360}
  }
};

var vgaConstraints  = {
  video: {
    width: {min: 640, max: 640},
    height: {min: 480, max: 480}
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
    stream.getTracks().forEach((track)=> { track.stop(); });
  }

  //2017/03/18
  //reemplazando esta linea para seguir los nuevos standares de promesas y de navigator.mediaDevices
  // navigator.getUserMedia pasa a estar deprecado y se sustituye por navigator.mediaDevices.getUserMedia
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
  // además se adapta el código para seguir ES6 siguiendo las arrow function
  // replace
  //navigator.getUserMedia(constraints, successCallback, errorCallback);
  // se comentan las funciones Callback para seguir el nuevo standar de promesas
  // además las constraints se adaptan
  // exac esta en draft por lo que se tiene que poner min y max https://developer.mozilla.org/en-US/docs/Web/API/ConstrainLong
  // with  
  navigator.mediaDevices.getUserMedia(constraints)
  .then((mediaStream) => {
    
    window.stream = mediaStream; // stream available to console
    video.src = window.URL.createObjectURL(stream);
    video.play();
  }).catch((err) => {
    console.log(err.name + ": " + err.message); 
  }); // always check for errors at the end.
}