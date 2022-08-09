document.addEventListener("keypress", start, {once: true});
const title = document.getElementById("titleID");
const subTitle = document.getElementById("subTitleID");
const board = document.getElementById("boardID");




// make the shit for the bird
const birdElement = document.getElementById("birdID");
const birdSpeed = 0.35;
let timeSinceLastJump = Number.POSITIVE_INFINITY;
const jumpTime = 180;
function setBird(){
    setTop(board.scrollHeight / 2);
    document.removeEventListener('keydown', jump);
    document.addEventListener('keydown', jump);
}
function getBirdPos(){
    return birdElement.getBoundingClientRect();
}
function updateBird(alpha){
    if(timeSinceLastJump < jumpTime) setTop(getTop() - birdSpeed * alpha);
    else setTop(getTop() + birdSpeed * alpha);
    timeSinceLastJump += alpha;
}
function setTop(top){
    birdElement.style.setProperty("--birdTop", top);
}
function getTop(){
    return parseFloat(getComputedStyle(birdElement).getPropertyValue("--birdTop"));
}

function jump(e){
    if(e.code !== "Space") return;
    timeSinceLastJump = 0;
}




//poles
const holeHeight = 300;
const poles = [];
const poleSpeed = 0.75;
let timePole = 0;
const poleWidth = 80;
const poleInterval = 1500;
let poleScore;

function getScore(){
    return poleScore;
}
function getPoleRects(){
    return poles.flatMap(pole => pole.rects());
}
function setPipes(){
    document.documentElement.style.setProperty("--poleWidth", poleWidth);
    document.documentElement.style.setProperty("--holeHeight", holeHeight);
    poles.forEach(pole => pole.remove());
    timePole = poleInterval;
    poleScore = 0;
}
function updatePoles(alpha){
    timePole += alpha;
    if(timePole < 1500){
        timePole -= 1500;
        makePole();
    }
    poles.forEach(pole => {
        if(pole.left + poleWidth < 0){
            poleScore++;
            return pole.remove();
        }
        pole.left = pole.left - alpha* poleSpeed;
    });
}
function makePole(){
    const poleElement = document.createElement("div");
    const topElement = createPoleSegment("poleTop")
    const bottomElement = createPoleSegment("poleBottom");
    poleElement.append(topElement);
    poleElement.append(bottomElement);
    poleElement.classList.add("pole");
    poleElement.style.setProperty("--holeTop", randN(holeHeight * 1.5, 700 - holeHeight * 0.5));
    const pole = {
        get left() {
            return parseFloat(getComputedStyle(poleElement).getPropertyValue("--poleLeft"));
        },
        set left(val){
            poleElement.style.setProperty("--poleLeft", val);
        },
        remove(){
            poles = poles.filter(pol => pol !== pole)
            poleElement.remove();
        },
        rects(){
            return [topElement.getBoundingClientRect(),
            bottomElement.getBoundingClientRect(),]
        },
    }

    pole.left = 700;
    board.append(poleElement);
    poles.push(pole);
}
function createPoleSegment(pos){
    const seg = document.createElement("div");
    seg.classList.add("segment", pos);
    return seg;
}
function randN(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}





let lastTime;
function update(time){
    if(lastTime == null){
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }
    const alpha = time - lastTime;
    updateBird(alpha);
    updatePoles(alpha);
    if(checkStop()) return restart();
    lastTime = time;
    window.requestAnimationFrame(update);
}

function checkStop(){
    const birdPos = getBirdPos();
    const hitPipe = getPoleRects().some(rect => collides(birdPos, rect));
    const outsideFrame = birdPos.top < 184 || birdPos.bottom > 881;
    return outsideFrame || hitPipe;
}

function collides(a, b){
    if(a.left >= b.right) return false;
    if(a.top >= b.bottom) return false;
    if(a.right <= b.left) return false;
    if(a.bottom <= b.top) return false;
    return true;
}

function start(){
    title.classList.add("hide");
    setBird();
    setPipes();
    lastTime = null;
    window.requestAnimationFrame(update);
}

function restart(){
    setTimeout(() => {
        title.classList.remove("hide");
        subTitle.classList.remove("hide");
        subTitle.textContent = `${getScore()} Points`;
        document.addEventListener("keypress", start, {once: true});
    }, 100);
}





