let selectedTrack = "trava";
const trackSelect = document.querySelector('.track-select').addEventListener('change', (event) => { selectedTrack = event.target.id });

let size = 10;

let storedGrid = []
const grid = document.querySelector(".grid")

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
        localStorage.setItem(projectName, storedGrid)
        
    }
});