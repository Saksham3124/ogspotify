console.log("hemlo hemlo");
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function gaanee(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);

  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="svgs/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Saksham</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="svgs/play.svg" alt="">
                            </div> </li>`;
    }


  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}
const playmusic = (track, pause = false) => {
  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "svgs/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


async function main() {
  await gaanee("songs/English%20Remix");

  playmusic(songs[0], true);


  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentsong.pause();
      play.src = "svgs/play1.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    currentsong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentsong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentsong.volume = parseInt(e.target.value) / 100;
      if (currentsong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("mute.svg", "volume.svg");
      }
    });

    Array.from(document.getElementsByClassName("songs")).forEach((e) => {
        e.addEventListener("click", async (item) => {
        console.log("Fetching Songs");
        songs = await gaanee(`songs/${item.currentTarget.dataset.folder}`);
        playmusic(songs[0]);
        });
    });

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}
main();
