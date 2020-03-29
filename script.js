const video = document.getElementById('video');
const source = document.getElementById('source');
var genderID;
var ageID;
var documentaryAge;
var documentaryGender;
var currentGender;
var previousGender;
var documentaryRunning = 0;
var constraints = { audio: true, video: true};
var vidid = ['malemillenial','femalemillenial', 'malegenx', 'femalegenx', 'maleboomer', 'femaleboomer'];
var iframe = document.querySelector('iframe');
var player = new Vimeo.Player(iframe);
var options01 = {
  id: '246436086',
  width: '640'
};
var documentaryvideoPlayer = new Vimeo.Player('{video01_name}', options01);
documentaryvideoPlayer.setVolume(0);


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
    resizedDetections.forEach(detection => {


      var genders = detections[0].gender
      var age = Math.round(detections[0].age)

      function generationGender(){
        if(genders === "male"){
          var genderID = 0;
        } if (genders === "female"){
          var genderID = 1;
        }
        return genderID;
      }

      function generationAge(){
        if(age<=36){
          var ageID = 0;
      } else if(age<=50){
        var ageID = 2
      } else {
        var ageID = 4
        }
        return ageID;
      }


      player.on('play',function(){
        console.log('Played the video');
      });

      player.getVideoTitle().then(function(title){
        console.log('title:',title)
      })

      function docmunetaryVimeo(){
        documentaryvideoPlayer.on('play', function(){
          console.log('Played the first video');
        });
      }
      documentaryVimeo();

      function documentarySelection(){
         documentaryGender = generationGender();
         documentaryAge = generationAge();
         classificationID = documentaryGender + documentaryAge;
         vimeoID = vidid[classificationID];
         console.log(vimeoID);
         documentaryPlaying();
      }

      function documentaryPlaying(){
        previousGender = documentaryGender;
        currentGender = generationGender();
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
      }



      if (documentaryRunning === 0){
        documentarySelection();


      }


    })
  }, 1000)
})
