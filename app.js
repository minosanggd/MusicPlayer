const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "SANG_PLAYER";

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumbnail = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist'); 

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},    
    songs: [
{
    name: 'Hãy trao cho anh',
    singer: 'Sơn Tùng M-TP',
    path: './assets/music/song1.mp3',
    image: './assets/image/htcaST.jpg'
},
{
    name: 'They Ain\'t Ready',
    singer: 'BeckyG',
    path: './assets/music/song2.mp3',
    image: './assets/image/pc2.jpg'
},
{
    name: 'Fresa',
    singer: 'TINI, Lalo Ebratt',
    path: './assets/music/song3.mp3',
    image: './assets/image/pc3.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
},
{
    name: 'End of time',
    singer: 'Kenneth Nilsen, Alan Walker, Ahrix',
    path: './assets/music/song4.mp3',
    image: './assets/image/pic4.jpg'
}
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return ` <div  class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        }); 
            playlist.innerHTML = htmls.join('')
        },   
        defineProperties: function (){
            Object.defineProperty(this, 'currentSong', {
                get: function () {
                    return this.songs[this.currentIndex];
                }
            });
        }, 
        handleEvents: function() {
            const _this = this;
            const cdWidth = cd.offsetWidth;
            // console.log(cdWidth);

            // Xử lý CD quay/ dừng 
            const cdThumbAnimate =  cdThumbnail.animate([
                {transform: 'rotate(360deg)'},
            ], {
                duration: 10000, // 10 seconds
                iterations: Infinity, // lap vo han 
            });
            // cho animatetion cua cdThumb dừng lúc chưa chạy
            // console.log(cdThumbAnimate);
            cdThumbAnimate.pause();

            // Xử lý phóng to/ thu nhỏ CD
            document.onscroll = function () {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop;
          
                cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
                cd.style.opacity = newCdWidth / cdWidth;
              };
            
            // Xử lý khi click Play 
            playBtn.onclick = function() {
                if(_this.isPlaying) {
                    audio.pause();
                    cdThumbAnimate.pause();
                }else {
                    audio.play();
                    cdThumbAnimate.play();
                }
            }
            // Khi song được play
            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add('playing');
            }
            // Khi song bị pause
            audio.onpause = function () {   
                _this.isPlaying = false;
                player.classList.remove('playing');
            }
            // Khi tiến độ bài hát thay đổi (thời gian chạy phát nhạc)
            audio.ontimeupdate = function() { 
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100); 
                    progress.value = progressPercent;   
                }
            } 
            // Xử lý khi tua song 
            progress.onchange = function(e) {
                const seekTime = e.target.value * audio.duration / 100
                // tinh tong so giay cua a song
                // console.log(e.target.value * audio.duration / 100);
                audio.currentTime = seekTime;
            }
            //Khi next song  
            nextBtn.onclick = function() {
                if(_this.isRandom) {
                        _this.playRandomSong();
                    }else {
                        _this.nextSong();
                    }
                audio.play();
                _this.render();
                _this.scrollTopActiveSong();
            }
            // Khi previous song
            prevBtn.onclick = function() {
                if(_this.isRandom){
                        _this.playRandomSong();
                    }else{
                        _this.previousSong();
                    }
                audio.play();
                _this.render();
                _this.scrollTopActiveSong();
            }
            // Khi bật/ tắt nút ngẫu nhiên Random 
            randomBtn.onclick = function(e) {
                    _this.isRandom = !_this.isRandom;       
                    _this.setConfig('isRandom', _this.isRandom);      
                    randomBtn.classList.toggle('active', _this.isRandom);
            }
            // Xử lý khi nhấn nút lặp lại 
            repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat',  _this.isRepeat);
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
            // Xử lý next song khi audio ended
            audio.onended = function() {
                if(_this.isRepeat) {
                    audio.play();
                }else  {                    
                    nextBtn.click();      
                }   
            }
            // lắng nghe hành vi click vào playlist
            playlist.onclick = function(e) {
                const songNode  = e.target.closest('.song:not(.active');
                if(songNode || e.target.closest('.option')){
                    //xử lý khi click vào song
                    if(songNode) {
                        // console.log(songNode.dataset.index); // sử dụng như này hoặc
                            // ..hoặc dataset 
                            // console.log(songNode.dataset('data-index'));
                        _this.currentIndex = Number(songNode.dataset.index)
                        // convert Index chuỗi sang number: console.log(typeof songNode.dataset.index);
                        _this.loadCurrentSong();
                        _this.render();
                        audio.play();
                    }
                    //XỬ lý khi click vào option
                    if(e.target.closest('.option')) {

                    }
                }
            }
        },
        playRandomSong: function(){
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentIndex);
        //            console.log(newIndex);
                this.currentIndex = newIndex;
                this.loadCurrentSong();
        },
        scrollTopActiveSong: function(){
            setTimeout(() => {
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'end',
                    });

            }, 300)
        },
        loadCurrentSong: function() {

            heading.textContent = this.currentSong.name;
            cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
            // console.log([heading,cdThumbnail,audio]);
        },
        loadConfig: function() {
            this.isRandom =  this.config.isRandom;
            this.isRepeat =  this.config.isRepeat;

        },
        nextSong: function (){
            this.currentIndex++;
            // console.log(this.currentIndex, this.songs.length );
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },
        previousSong: function() {
            this.currentIndex--;
            // console.log(this.currentIndex, this.songs.length );
            if(this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1   ;
            }
            this.loadCurrentSong();
        },

    start: function() {
        // Gán cấu hình từ config vào ứng dụng obj App 
        this.loadConfig();
        
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        
        // Lắng nghe / xử lý các sự kiện (DOM events) 
        this.handleEvents();
        
        // Tải thông tin bài hát đầu tiên vào UI (User Interface) khi chạy ứng dụng
        this.loadCurrentSong();
        
        //Render Playlist
        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
         }
    }
app.start();