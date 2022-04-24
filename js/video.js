
var Video = function(){

    let video = null

    const network = {
        algorithm: 'single-pose', // or multi-pose
        input: {
            architecture: 'MobileNetV1', //[M] Or ResNet50 [R]
            outputStride: 16, //(8 or 16)M or (16 or 32)R [Default: 16M 32R]
            inputResolution: 500, //Ranges from 200 to 800 [Default: 500M 250R]
            multiplier: 0.75, // (0.5 or 0.75 or 1)M or (1)R [Default: 0.75M 1R]
            quantBytes: 2 //1 or 2 or 4 (Default: 2M 2R)
        },
        singlePoseDetection: {
            minPoseConfidence: 0.1, //Ranges from 0 to 1 [Default: 0.1]
            minPartConfidence: 0.5, //Ranges from 0 to 1 [Default: 0.5]
        },
        multiPoseDetection: {
            maxPoseDetections: 5, //Ranges from 1 to 20 [Default: 5]
            minPoseConfidence: 0.15, //Ranges from 0 to 1 [Default: 0.15]
            minPartConfidence: 0.1, //Ranges from 0 to 1 [Default: 0.1]
            nmsRadius: 30.0, //Ranges from 0 to 40[Default: 30]
        },
        netState: null,
    }

    async function runPoseDetection() {
        const netState = await posenet.load({
            architecture: network.input.architecture,
            outputStride: network.input.outputStride,
            inputResolution: network.input.inputResolution,
            multiplier: network.input.multiplier,
            quantBytes: network.input.quatBytes
        });

        network.net = netState;

        async function poseDetectionFrame() {
            const pose = await network.net.estimatePoses(video, {
                flipHorizontal: true,
                decodingMethod: 'single-person'
            })
            
            window.nose = pose[0].keypoints[0]
            window.leftEye = pose[0].keypoints[1]
            window.rightEye = pose[0].keypoints[2]
            
            requestAnimationFrame(poseDetectionFrame)
        }
        poseDetectionFrame()
    }

    this.start = function(){
        video = document.getElementById('video')


        startVideo = function(){
            navigator.getUserMedia(
                { video: {} },
                stream => video.srcObject = stream,
                err => console.error(err)
            )

           
        }


        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('js/face-api.js/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('js/face-api.js/models'),
            /*faceapi.nets.faceRecognitionNet.loadFromUri('../../../../third-party/face-api.js/models'),*/
            faceapi.nets.faceExpressionNet.loadFromUri('js/face-api.js/models')
          ]).then(startVideo)


          setTimeout(() => { 
            //console.log("detect")
            const canvas = faceapi.createCanvasFromMedia(video)
            canvas.style.position = "relative"
            document.getElementById('videoHolder').append(canvas)
            const displaySize = { width: video.width, height: video.height }
            faceapi.matchDimensions(canvas, displaySize)
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                if (detections[0]){
                    window.expressions = detections[0].expressions
                    window.expressionScore = detections[0].detection.score
                }
                const resizedDetections = faceapi.resizeResults(detections, displaySize)
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resizedDetections)
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            }, 100)

            runPoseDetection()
          }, 3000)


    }
}