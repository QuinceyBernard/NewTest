const video = document.getElementById('video')

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
      // console.log(genders)
      if (genders === 'female'){
        console.log("Hello Woman")
        var f = document.getElementById("myCanvas");
        var ftx = f.getContext("2d");
        ftx.beginPath();
        ftx.rect(0,0,150,150);
        ftx.stroke();
        ftx.fillStyle = "red";
        ftx.fill();
      } else if (genders === 'male'){
        console.log("Hello Man")
        var m = document.getElementById("myCanvas");
        var mtx = m.getContext("2d");
        mtx.beginPath();
        mtx.rect(0,0,150,150);
        mtx.stroke();
        mtx.fillStyle = "blue";
        mtx.fill();
      }


    })
  }, 1000)
})
