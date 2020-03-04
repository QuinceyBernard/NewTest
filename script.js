const video = document.getElementById('video');
const mVideo = document.getElementById('mVideo');
const source = document.getElementById('source');
var mage;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)



function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    resizedDetections.forEach(detection => {
      // const box = detection.detection.box
      // const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age)+"years old" + detection.gender})
      // drawBox.draw(canvas)

      var genders = detections[0].gender
      var age = Math.round(detections[0].age)
      console.log(age)

      function generationAge(){
        if(age<=36){
          mage = 1;
        // console.log('millenial');
      } else if(age<=50){
        // console.log('gen x');
        var mage = 2
      } else {
        // console.log('baby boomer');
        var mage = 3
        }
      }

      function maleVidRun(){
        document.getElementById("mVideo").src = "/assets/test_1.mp4"
        // mVideo.source.setAttribute('/assets/test_1.mp4', srcVideo);
        mVideo.load();
        mVideo.play();

      }

      function maleVideo(){
        if(genders === 'male'){
          var mv = "a";
          var ma = mv + mage
          console.log(ma)
          // console.log(mv);
          var m = document.getElementById("myCanvas");
          var mtx = m.getContext("2d");
          mtx.beginPath();
          mtx.rect(0,0,150,150);
          mtx.stroke();
          mtx.fillStyle = "blue";
          mtx.fill();
          maleVidRun();


        }
      }

      function femaleVideo(){
        if(genders === 'female'){
          var fv = 2;
          // console.log(fv);
          var f = document.getElementById("myCanvas");
          var ftx = f.getContext("2d");
          ftx.beginPath();
          ftx.rect(0,0,150,150);
          ftx.stroke();
          ftx.fillStyle = "red";
          ftx.fill();
        }
      }

      generationAge();
      maleVideo();
      femaleVideo();


    })
  }, 1000)
})
