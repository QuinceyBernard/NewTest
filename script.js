const video = document.getElementById('video');
const mVideo = document.getElementById('mVideo');
const source = document.getElementById('source');
var ageID;

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
      // console.log(age)

      function generationAge(){
        if(age<=36){
          var ageID = 1;
      } else if(age<=50){
        var ageID = 2
      } else {
        var ageID = 3
        }
        return ageID;
      }

      function maleVidRun(){
        document.getElementById("docVid").src = "/assets/test_1.mp4"
        // mVideo.source.setAttribute('/assets/test_1.mp4', srcVideo);
        docVid.load();
        docVid.play();

      }

      function maleVideo(){
        maleAge = generationAge();
        if(genders === 'male'){
          var maleID = "a";
          var maleSource = maleID + maleAge
          console.log(maleSource)
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

      function femaleVidRun(){
        document.getElementById("docVid").src = "/assets/test_2.mp4"
        // mVideo.source.setAttribute('/assets/test_1.mp4', srcVideo);
        docVid.load();
        docVid.play();

      }

      function femaleVideo(){
        femaleAge = generationAge();
        if(genders === 'female'){
          var femaleID = 'b'
          var femaleSource = femaleID + femaleAge
          console.log(femaleSource);
          var fv = 2;
          var f = document.getElementById("myCanvas");
          var ftx = f.getContext("2d");
          ftx.beginPath();
          ftx.rect(0,0,150,150);
          ftx.stroke();
          ftx.fillStyle = "red";
          ftx.fill();
          femaleVidRun();
        }
      }

      maleVideo();
      femaleVideo();


    })
  }, 1000)
})
