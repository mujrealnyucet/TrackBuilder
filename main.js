let selectedTrack = "trava";
const trackSelect = document.querySelector('.track-select').addEventListener('change', (event) => { selectedTrack = event.target.id });

let size = 10;

let storedGrid = []
const grid = document.querySelector(".grid")

window.onload = function () {
    displaySavedMaps()
}

// Dynamicka generace gridu
for (let index = 0; index < size * size; index++) {
    //const coordinates = "" + Math.floor(index / size) + index % size // peak readibility
    const gridChild = document.createElement("div");

    gridChild.className = "grid-child";
    gridChild.id = index;

    const storedGridChild = {
        id: index,
        trackStyle: null,
        rotation: 0
    }

    storedGrid.push(storedGridChild);
    grid.appendChild(gridChild)
}

let isMouseDown = false; // Keep track if mouse is held

grid.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);

grid.addEventListener('mouseover', (e) => {
    if (isMouseDown && e.target !== grid) {
        e.target.style.backgroundImage = `url(./assets/${selectedTrack}.png)`;
        e.target.style.border = "none";
        storedGrid[e.target.id].trackStyle = selectedTrack; // update in storage
    }
});

// Also trigger on click (not just drag)
grid.addEventListener('mousedown', (e) => {
    if (storedGrid[e.target.id].trackStyle == selectedTrack) {
        e.target.style.transform += "rotate(90deg)";
        storedGrid[e.target.id].rotation = (storedGrid[e.target.id].rotation + 1) % 4; // only keep track of 4 states
    }
    else if (e.target !== grid) {
        e.target.style.backgroundImage = `url(./assets/${selectedTrack}.png)`;
        e.target.style.border = "none";
        console.log(storedGrid[e.target.id])
        storedGrid[e.target.id].trackStyle = selectedTrack; // update in storage
    }
});

document.querySelector(".save-as-btn").addEventListener("click", (e) => {
    let projectName = prompt("Name your creation:")

    if (projectName) {
        let maps = JSON.parse(localStorage.getItem('storedMaps')) || [];
        const savedMap = {
            name: projectName,
            map: storedGrid
        }
        maps.push(savedMap)

        localStorage.setItem('storedMaps', JSON.stringify(maps))
    }
});

document.querySelector(".main-menu-btn").addEventListener("click", (e) => {
    ShowMenu()
});

document.querySelector(".editor-btn").addEventListener("click", ShowGame)

function LoadMap(savedMap) {
    savedMap.forEach(element => {
        const tile = document.getElementById(element.id)
        if (element.trackStyle != null) {
            tile.style.backgroundImage = `url(./assets/${element.trackStyle}.png)`;
            tile.style.border = "none"
            tile.style.transform = `rotate(${90 * element.rotation}deg)`;
        } else {
            tile.style.backgroundImage = "none";
            tile.style.border = "1px solid #ccc"
        }
    });
    storedGrid = savedMap;
    ShowGame();
}

function ShowGame() {
    document.querySelector(".main-menu").classList.add("hidden")
    document.querySelector(".game").classList.remove("hidden")
}

function ShowMenu() {
    document.querySelector(".game").classList.add("hidden")
    document.querySelector(".main-menu").classList.remove("hidden")
}

function displaySavedMaps() {
    const mapContainer = document.querySelector('.saved-maps');

    const storedMaps = JSON.parse(localStorage.getItem('storedMaps')).reverse() || [];

    if (storedMaps) {
        document.querySelector(".no-saves-text").classList.add("hidden")
        mapContainer.classList.remove("hidden")

        storedMaps.forEach(element => {

            // The div
            const mapItem = document.createElement("div");

            // Map name
            const name = document.createElement('p')
            name.innerText = element.name;

            // Load Button
            const btn = document.createElement('button');
            btn.textContent = 'Load';
            btn.dataset.map = JSON.stringify(element.map);
            btn.addEventListener('click', () => LoadMap(JSON.parse(btn.dataset.map)));
            
            // Put it on the page
            mapItem.appendChild(name);
            mapItem.appendChild(btn)
            mapContainer.appendChild(mapItem)

        });
    }
}

// window.onbeforeunload = function () {
//     if (true) {
//         return "If you reload this page, your unsaved progress will be lost!";
//     } else {
//         //Don't return anything
//     }
// }