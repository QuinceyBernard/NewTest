const video = document.getElementById('video');
const mVideo = document.getElementById('mVideo');
const source = document.getElementById('source');
var genderID;
var ageID;
var documentaryAge;
var documentaryGender;
var currentGender;
var previousGender;
var documentaryRunning = 0;
var constraints = { audio: true, video: true};


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models'),
  faceapi.nets.ageGenderNet.loadFromUri('./models')
]).then(startVideo)



function startVideo() {
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream){
    var video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e){
      video.play();
    };
  })
  .catch(function(err){console.log(err.name + ":" + err.message);});
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
         // console.log(ageID)
         // console.log(documentaryGender);
         // console.log(documentaryAge);
         document.getElementById("docVid").src = "./assets/V02_" + documentaryGender + documentaryAge + ".mp4"
         documentaryPlaying();
      }

      function documentaryPlaying(){
        // console.log(documentaryGender)
        previousGender = documentaryGender;
        currentGender = generationGender();
        console.log(previousGender);
        console.log(currentGender);
        if ( previousGender === currentGender){
          console.log('unchanged')
        } else {
          console.log('changed')
        }
        var video = document.getElementById("docVid");
        docVid.load();
        docVid.play();
        documentaryRunning = 1;
        docVid.onended = function(){
          documentaryRunning = 0;
          // something to check current age and gender id to the one given to the current video playing
          //can seperate the play video part and have it called in docselet
        }
        // documentaryRunning = 1;
      }



      console.log(documentaryRunning);
      if (documentaryRunning === 0){
        documentarySelection();


      }
      // documentarySelection();


    })
  }, 1000)
})
