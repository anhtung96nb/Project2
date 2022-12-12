const robots = document.querySelectorAll(".robot");
const root = document.getElementById("root")
const rover = document.getElementById("rover")
const roverPhotos = document.getElementById("rover-photos")
window.addEventListener("load", async() => {

    await getAllData(storage, "curiosity");
    renderSite(storage, storage.robotInformation, storage.imageData);
});
const getAllData = async(storage, currentID) => {
    await getRobootInfor(storage, currentID);
    await getImageData(storage, currentID);
}
const renderSite = async(storage, robotInformation, imageData) => {
    renderRoot(storage, robotInformation, imageData, renderInfo, renderImages);
}
const renderRoot = (storage, robotInformation, imageData, generateInfo, generateImages) => {
    rover.innerHTML = generateInfo(robotInformation);
    roverPhotos.innerHTML = generateImages(imageData);
}

let storage = {
    currentID: "curiosity",
    robotInformation: {},
    imageData: [],
}

const updateStorage = (storage, newState) => {
    storage = Object.assign(storage, newState)
    renderSite(storage, storage.robotInformation, storage.imageData);
}


const getRobootInfor = (storage, robotName) => {
    fetch(`http://localhost:3000/getInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ robotName: robotName })
        })
        .then(res => res.json())
        .then(roverInfo => updateStorage(storage, { robotInformation: roverInfo }))
}

const getImageData = (storage, robotName) => {
        fetch(`http://localhost:3000/getImage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ robotName: robotName })
            })
            .then(res => res.json())
            .then(roverImages => updateStorage(storage, { imageData: roverImages }))
    }
    // A pure function that renders images requested from the backend
const renderImages = (images) => {
    var imagesHtml = images.slice(0, 9).map((image) => {
        return `
        <picture class="image-card">
            <img src="${image.img_src}" alt="Rover image" class="rover-image"/>
            <pictureCaption >
                <p><b>Camera :</b> ${image.camera.full_name}</p>
                <p><b>Earth date:</b> ${image.earth_date}</p>
                <p><b>Rover :</b> ${image.rover.name}</p>
            </pictureCaption>
        </picture>`
    })
    return imagesHtml.join("");
}
const renderInfo = (info) => {
    return `
        <section class="info-robot" style=" background-image: url('${info.imageUrl}')";>
                <div class="title">name:${info.name} </div>
                <p>Launch Date : ${info.launchDate}</p>
                <p>Landing Date: ${info.landingDate}</p>
                <p>Max_date: ${info.max_date}</p>
                <p>Cost: ${info.max_sol}</p>
                <p>Status: ${info.status}</p>
        </section>
    `
}
for (var i = 0; i < robots.length; i++) {
    robots[i].addEventListener("click", async function() {
        var current = document.getElementsByClassName("active");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }

        // Add the active class to the current/clicked button
        this.className += " active";
        await updateStorage(storage, { currentID: this.id });
        getAllData(storage, this.id);
    });
}