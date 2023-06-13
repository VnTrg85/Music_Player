var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const header = $('header h2')
const cd_thumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs:
        [
            {
                "name": "phodalenden",
                "singer": "embe",
                "path": "./assets/music/embe.mp3",
                "img": "./assets/img/embe.jpg"
            },
            {
                "name": "GonnaBeYu",
                "singer": "Anhbe",
                "path": "./assets/music/motdoanGonnaBeYu.mp3",
                "img": "./assets/img/motdoanGonnaBeYu.png"
            },
            {
                "name": "luuluyensauchiatay",
                "singer": "zaiDn",
                "path": "./assets/music/luuluyensauchiatay.mp3",
                "img": "./assets/img/luuluyensauchiatay.jpeg"
            },
            {
                "name": "cohenvoithanhxuan",
                "singer": "GeyD",
                "path": "./assets/music/cohenvoithanhxuan.mp3",
                "img": "./assets/img/cohenvoithanhxuan.png"
            },
            {
                "name": "reallove",
                "singer": "Justatee",
                "path": "./assets/music/reallove.mp3",
                "img": "./assets/img/reallove.png"
            },
            {
                "name": "vaicaunoicokhiennguoithaydoi",
                "singer": "GeyD",
                "path": "./assets/music/vaicaunoicokhiennguoithaydoi.mp3",
                "img": "./assets/img/vaicaunoicokhiennguoithaydoi.png"
            },
            {
                "name": "toidaquenthatroi",
                "singer": "Issac",
                "path": "./assets/music/toidaquenthatroi.mp3",
                "img": "./assets/img/toidaquenthatroi.png"

            }

        ],
    start: function () {
        //Định nghĩa các thuột tính cho object
        this.defineProperties()


        //Tải thông tin bài hát đầu tiên vào UI khi load ứng dụng
        this.loadCurrentSong();

        //Lắng nghe , xử lý các sự kiện
        this.handlEvent()

        //Render ra playlist
        this.render()
        this.activeCurrentSong();

    },

    //------------Get songs by JSON server----------------
    // getSongs:function (playlist) {
    //     var hostApi = "http://localhost:3000/playlist"
    //     fetch(hostApi)
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (songs) {
    //             playlist = songs;
    //         })
    // },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function () {
        var _this = this;
        const htmls = this.songs.map(function (song, index) {
            return `
                    <div class="song" dataIndex = ${index} >
                            <div class="thumb"
                                style="background-image: url(${song.img})">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                    </div>`
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    handlEvent: function (event) {
        const _this = this
        //Xử lý quay đĩa
        var cd_thumbAnimate = cd_thumb.animate([{ transform: "rotate(360deg)" }], { duration: 10000, iterations: Infinity, direction: "alternate" })
        cd_thumbAnimate.pause();

        //Xủ lý cd-thumb khi scroll chuột thì cd-thumb sẽ nhỏ lại và mờ dần
        var cdWidth = cd.offsetWidth
        document.onscroll = function (e) {
            var scrollTop = window.scrollY || document.documentElement.scrollTop
            var newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth
        }

        //Xử lý khi nhấn vào button play
        playBtn.onclick = function () {
            if (_this.isPlaying === false) {
                audio.play();
            }
            else {
                audio.pause();
            }
        }
        //Xử lý khi song đang play/ Xử lý event play cua audio
        audio.onplay = function () {
            _this.isPlaying = true;
            playBtn.classList.add('active')
            cd_thumbAnimate.play();
        }
        //Xử lý khi song đang pause/ Xử lý event pause cua audio
        audio.onpause = function () {
            _this.isPlaying = false;
            playBtn.classList.remove('active')
            cd_thumbAnimate.pause();
        }
        //Xử lý khi song play thi progress bar phải chạy
        audio.ontimeupdate = function () {
            if (audio.duration) {
                var valueProgress = audio.currentTime / audio.duration * 100
                progress.value = valueProgress
            }
        }
        //Xử lý khi người dùng tua song bằng progressBar
        progress.onclick = function () {
            const currentProgress = this.value
            audio.currentTime = currentProgress / 100 * audio.duration
        }
        //Xử lý button prev song
        prevBtn.onclick = function (e) {
            if (_this.isRandom) {
                _this.randomSong()
            } else
                _this.prevSong()
            audio.play()
            _this.scrollIntoActiveSong()
        }
        //Xử lý button next  song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else
                _this.nextSong()
            audio.play()
            _this.scrollIntoActiveSong()
        }
        //Xử lý button random song
        randBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randBtn.classList.toggle("active", _this.isRandom)
        }
        //Xử lý khi song ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else
                nextBtn.click()
        }
        //Xử lý button repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }
        //Xử lý khi ấn vào song thì song đó sẽ play
        playlist.onclick = function (e) {
            const songElement = e.target.closest('.song:not(.active)')
            const optionElement = e.target.closest('.option')
            if(optionElement)
            {

            }
            else if (songElement) {
                _this.currentIndex = songElement.getAttribute('dataIndex')
                _this.loadCurrentSong()
                audio.play()
            }
        }

    },
    loadCurrentSong: function () {
        header.innerHTML = `${this.currentSong.name}`
        cd_thumb.style.backgroundImage = `url(${this.currentSong.img})`
        this.activeCurrentSong()
        audio.src = this.currentSong.path
    },
    prevSong: function () {
        this.currentIndex--;
        this.currentIndex = this.currentIndex >= 0 ? this.currentIndex : this.songs.length - 1
        this.loadCurrentSong();
    },
    nextSong: function () {
        this.currentIndex++;
        this.currentIndex = this.currentIndex < this.songs.length ? this.currentIndex : 0
        this.loadCurrentSong();
    },
    randomSong: function () {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * (this.songs.length))
        } while (randomIndex === this.currentIndex)
        this.currentIndex = randomIndex
        this.loadCurrentSong();
    },
    activeCurrentSong: function () {
        var songElements = $$('.song')
        songElements.forEach((songElement, index) => {
            songElement.classList.remove('active')
        });
        songElements[this.currentIndex].classList.add('active')
    },
    scrollIntoActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 1000)
    }
}

app.start()