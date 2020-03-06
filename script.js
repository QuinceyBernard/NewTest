const video = document.getElementById('video');
const mVideo = document.getElementById('mVideo');
const source = document.getElementById('source');
var genderID;
var ageID;


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models'),
  faceapi.nets.ageGenderNet.loadFromUri('./models')
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
      // console.log (age)
      // console.log (genders)

      function generationGender(){
        if(genders === "male"){
          var genderID = "a";
        } if (genders === "female"){
          var genderID = "b";
        }
        return genderID;
      }

      function generationAge(){
        if(age<=36){
          var ageID = 1;
      } else if(age<=50){
        var ageID = 2
      } else {
        var ageID = 3
        }
        return ageID;
        // console.log(ageID)
      }


      function documentarySelection(){
         documentaryGender = generationGender();
         documentaryAge = generationAge();
         console.log(documentaryGender);
         console.log(documentaryAge);
         document.getElementById("docVid").src = "./assets/test_" + documentaryGender + documentaryAge + ".mp4"
         docVid.load();
         docVid.play();
      }

      documentarySelection();


    })
  }, 1000)
})
