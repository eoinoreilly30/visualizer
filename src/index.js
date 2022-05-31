document.getElementById("button").addEventListener("click", main);
const ctx = document.getElementById("canvas").getContext('2d');

function main() {

    let audio = new Audio();
    audio.src = "song.mp3";

    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource = null;
    let analyser = null;

    audio.play();
    audioSource = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer({
            bufferLength,
            dataArray,
            barWidth
        });
        requestAnimationFrame(animate);
    }

    const drawVisualizer = ({
        bufferLength,
        dataArray,
        barWidth
    }) => {
        let barHeight;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const red = (i * barHeight) / 10;
            const green = i * 4;
            const blue = barHeight / 4 - 12;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(
                canvas.width / 2 - x,
                canvas.height - barHeight,
                barWidth,
                barHeight
            );
            x += barWidth;
        }

        // for (let i = 0; i < bufferLength; i++) {
        //     barHeight = dataArray[i];
        //     const red = (i * barHeight) / 10;
        //     const green = i * 4;
        //     const blue = barHeight / 4 - 12;
        //     ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        //     ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        //     x += barWidth;
        // }
    };

    animate();
}