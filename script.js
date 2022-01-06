class Visualizer{
	constructor(audio, canvas){
		this.audio = audio;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		
		this.colors = [
			'rgb(140, 0, 252)', //purple
			'rgb(53, 0, 255)', //blue
			'rgb(1, 254, 1)', //green
			'rgb(255, 254, 55)', //yellow
			'rgb(255, 134, 0)', //orange
		];

		this.gradient = null;
		this.makeGradient(this.colors); 

		this.styles = [
			'lines',
			'bars',
			'bars_filled',
			'circle_line',
			'curved_line',
			'middle_line',
			'circles',
			'circle'
		];

		this.style = this.styles[0];
	}

	start(){
		//these can throw an error if attempted right away before th user interacts with the page
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.audioSource = this.audioCtx.createMediaElementSource(this.audio);
		this.analyser = this.audioCtx.createAnalyser();
		this.audioSource.connect(this.analyser);
		this.analyser.connect(this.audioCtx.destination);
		this.analyser.fftSize = 128;
		this.bufferlength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(this.bufferlength);
	}

	makeGradient(colors){
		//ctx built in gradient function.  used for the background of the visualizer
		let gradient = this.ctx.createLinearGradient(0, this.canvas.height, this.canvas.width, 0);
		gradient.addColorStop(0, colors[4]);
		gradient.addColorStop(0.13, colors[3]);
		gradient.addColorStop(0.25, colors[2]);
		gradient.addColorStop(0.38, colors[1]);
		gradient.addColorStop(0.5, colors[0]);
		gradient.addColorStop(0.63, colors[1]);
		gradient.addColorStop(0.75, colors[2]);
		gradient.addColorStop(0.88, colors[3]);
		gradient.addColorStop(0, colors[4]);

		this.gradient = gradient;
	}

	lines(){
		let height;
		const width = this.canvas.width / this.dataArray.length;
		this.ctx.strokeStyle = this.gradient;
		for(let i=0; i<this.bufferlength; i++){
			height = this.dataArray[i];
			if(height>0){
				this.ctx.beginPath();
				this.ctx.moveTo(width*i, this.canvas.height-300-height)
				this.ctx.lineTo(width*i+width, this.canvas.height-300-height)
				this.ctx.stroke();
			}
			
			
		}
	}

	bars(){
		let height;
		const gap = 5;
		const width = this.canvas.width / this.dataArray.length;
		for(let i=0; i<this.bufferlength; i++){
			height = this.dataArray[i];
			if(height>0){
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.gradient;
				this.ctx.rect((width+gap)*i, this.canvas.height-300-height, width, height);
				this.ctx.stroke();
			}
			
			
		} 

	}

	bars_filled(){
		let height;
		const gap = 5;
		const width = this.canvas.width / this.dataArray.length;
		for(let i=0; i<this.bufferlength; i++){
			height = this.dataArray[i];
			if(height > 0){
				this.ctx.beginPath();
				this.ctx.fillStyle = this.gradient;
				this.ctx.fillRect((width+gap)*i, this.canvas.height-300-height, width, height);
				this.ctx.stroke();
			}
			
			
		} 
	}

	circle_line(){
		let height;
		const width = this.canvas.width / this.dataArray.length;
		for(let i=0; i<this.bufferlength; i++){
			height = this.dataArray[i];
			
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.gradient;
			//this.ctx.moveTo(width*i, this.canvas.height-300-height)
			//this.ctx.lineTo(width*i+width, this.canvas.height-300-height)
			this.ctx.arc(width*i, this.canvas.height-300-height, 5, 0, Math.PI*2);
			this.ctx.stroke();
			
		}
	}

	curved_line(){
		let height;
		const width = this.canvas.width / this.dataArray.length;
		
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.gradient;
		for(let i=1; i<this.bufferlength-1; i++){
			height = this.dataArray[i];
			this.ctx.arcTo(width*i, this.canvas.height-300-height, width*(i+1), this.canvas.height-300-height, 10);
			this.ctx.stroke();
		}

	}

	middle_line(){
		let height;
		const width = this.canvas.width / this.dataArray.length;
		const center = this.canvas.width/2;
		const radius = 25;
		
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.gradient;
		for(let i=0; i<this.bufferlength-1; i++){
			height = this.dataArray[i];
			this.ctx.arcTo(center - width*i, this.canvas.height-300-height, center-width*(i+1), this.canvas.height-300-height, radius);
			this.ctx.stroke();
		}

		this.ctx.beginPath();
		for(let i=0; i<this.bufferlength-1; i++){
			height = this.dataArray[i];
			this.ctx.arcTo(center + width*i, this.canvas.height-300-height, center+width*(i+1), this.canvas.height-300-height, radius);
			this.ctx.stroke();
		}
	}

	circles(){
		
		const dist = this.canvas.width / this.dataArray.length;
		this.ctx.strokeStyle = this.gradient;
		for(let i=0; i<this.bufferlength-1; i++){
			let radius = this.dataArray[i];
			this.ctx.beginPath();
			this.ctx.arc(dist*i, this.canvas.height-300, radius, 0, 2*Math.PI);
			this.ctx.stroke();
		}
		
	}

	circle(){
		const center = [
			this.canvas.width/2,
			this.canvas.height/2
		];
		const dist = 100;
		this.ctx.strokeStyle = this.gradient;
		for(let i=0; i<this.bufferlength-1; i++){
			let radius = dist + dist*(this.dataArray[i] / 100);
			if(radius > dist){
				this.ctx.beginPath();
				this.ctx.arc(center[0], center[1], radius, 0, 2*Math.PI);
				this.ctx.stroke();
			}
			
		}
	}

	play(){
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		this.analyser.getByteFrequencyData(this.dataArray);
		this[this.style]();

		window.requestAnimationFrame(()=>{this.play()});
	}	
}
///////////////////////////////////////
//grap the audio element and set its src and volume
let audio1 = document.getElementById('audio1');
audio1.src = 'dubstep.mp3';
audio1.volume = 0.25;

//grab the canvas element and set its size
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//instantiate a new visualizer object
const visualizer = new Visualizer(audio1, canvas);

//add event listener for the audio element
audio1.addEventListener('playing', e=>{
	e.preventDefault(); 
	audio1.play();
	visualizer.start();
	visualizer.play();
})

//add event listener for the file upload to change the music src
const music = document.getElementById('music');
music.addEventListener('change', e=>{
	e.preventDefault();
	audio1.src = music.files[0].name;
})

//add the different styles to the screen and add their on click listeners
const styles = document.getElementById('styles');
visualizer.styles.forEach(s=>{
	let span = document.createElement('SPAN');
	span.innerText = s.replace(/_/i, ' ');
	span.addEventListener('click', e=>{
		visualizer.style = s;
	});
	styles.appendChild(span)
})

///////////////////////////////////////////////////

