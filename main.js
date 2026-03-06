let size = 10;
let storedGrid = []

const trackSelect = document.querySelector('.track-select').addEventListener('change', (event) => { selectedTrack = event.target.id });
const grid = document.querySelector(".grid")

const importBtn = document.querySelector('.import-btn');
const fileInput = document.querySelector('.file-input');

let isMouseDown = false;

selectedTrack = "trava";
displaySavedMaps()

// Dynamicka generace gridu
for (let index = 0; index < size * size; index++) {
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

grid.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);


grid.addEventListener('mouseover', (e) => {
    if (isMouseDown && e.target !== grid) {
        e.target.style.backgroundImage = `url(./assets/${selectedTrack}.png)`;
        e.target.style.border = "none";
        storedGrid[e.target.id].trackStyle = selectedTrack;
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
        storedGrid[e.target.id].trackStyle = selectedTrack;
    }
});

importBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        parsedData = JSON.parse(e.target.result)
        parsedMap = JSON.stringify(parsedData);
        saveMap(parsedData.name, parsedData.map)
        displaySavedMaps();
    };
    reader.readAsText(file);

})

document.querySelector(".save-as-btn").addEventListener("click", (e) => {
    let projectName = prompt("Name your creation:")

    if (projectName) {
        saveMap(projectName, storedGrid)
    }
});


document.querySelector(".main-menu-btn").addEventListener("click", (e) => {
    ShowMenu()
    displaySavedMaps()
});

document.querySelector(".editor-btn").addEventListener("click", ShowGame)

function saveMap(name, grid) {
    let maps = JSON.parse(localStorage.getItem('storedMaps')) || [];
    currentMap = maps.find(m => m.name == name)

    if (currentMap) {
        currentMap.map = grid;
    } else {
        const savedMap = {
            name: name,
            map: grid
        }
        maps.push(savedMap)
    }
    localStorage.setItem('storedMaps', JSON.stringify(maps))
}

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
    mapContainer.innerHTML = '';

    const storedMapsRaw = localStorage.getItem('storedMaps');

    console.log(storedMapsRaw)
    if (storedMapsRaw | storedMapsRaw != '[]') {
        storedMaps = JSON.parse(storedMapsRaw).reverse() || [];
        document.querySelector(".no-saves-text").classList.add("hidden")
        document.querySelector(".save-load-screen").classList.remove("hidden")

        storedMaps.forEach(element => {

            // The divs
            const mapItem = document.createElement("div");
            const buttonDiv = document.createElement("div");
            mapItem.classList.add("map-item")
            buttonDiv.classList.add("map-item-buttons")

            // Map name
            const name = document.createElement('p')
            name.innerText = element.name;

            // Load Button
            const loadBtn = document.createElement('button');
            loadBtn.textContent = 'Load';
            loadBtn.addEventListener('click', () => LoadMap(element.map));

            // Export button
            const exportBtn = document.createElement('button');
            exportBtn.textContent = 'Export';

            exportBtn.addEventListener('click', () => downloadJson({ name: element.name, map: element.map }, `${element.name}_exported.json`));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';

            deleteBtn.addEventListener('click', () => removeMap(element));

            // Put it on the page
            mapItem.appendChild(name);
            mapItem.appendChild(buttonDiv);

            buttonDiv.appendChild(loadBtn)
            buttonDiv.appendChild(exportBtn)
            buttonDiv.appendChild(deleteBtn)
            mapContainer.appendChild(mapItem)

        });
    }
}

function downloadJson(content, fileName) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);

    a.download = fileName;
    a.click();
}

function removeMap(map) {
    let maps = JSON.parse(localStorage.getItem('storedMaps')) || [];
    maps.splice(maps.indexOf(map), 1);
    localStorage.setItem('storedMaps', JSON.stringify(maps))
    displaySavedMaps();
}

// would need to check if it's changed and unsaved, might do later
// window.onbeforeunload = function () {
//     if (true) {
//         return "If you reload this page, your unsaved progress will be lost!";
//     } else {
//         //Don't return anything
//     }
// }