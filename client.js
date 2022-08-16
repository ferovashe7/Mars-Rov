// intial state array w/ inmutable.map
// three Rovers, C,O,S
let state = Immutable.Map({
    user: { name: "Udacity Mentor" },
    selection: "",
    rovers: ['Curiosity','Opportunity','Spirit'],
    photo: {}

})


const createButton = (item) =>{
    return `<button id=${item} type="button" class="btn btn-primary mr-1 flex-item" onclick="load(this.id)">${item}</button>`
}

//first HOF - Receives any item and deliver a result
const loopItems = (items, fn)=>{
    return  items.map(fn).join(" ")
}

const listItem =(arr,fn)=>{

    let temp =[`Mission Status: ${arr.get("photo").roverStatus}`,
    `Rover Landing Date: ${arr.get("photo").roverLanding}`, 
    `Rover Launching Date: ${arr.get("photo").roverLauch}`,
    `Camara Used: ${arr.get("photo").camara_name}`]

    return fn (temp, cardItem)
}


const cardItem =(item)=>{

    return `<li class="list-group-item">${item}</li>`
}
// Creates Card 
const Card = (arr) =>{
    return `  
    <div class="card-container">
        <div class="float-layout">
        <div class="card-image">
            <img src=${arr.get("photo").image}?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260">
            <div class="card">
            <div class="card-title">Rover Name: ${arr.get("photo").name}</div>
            <div class="card-desc">
                ${listItem(arr,loopItems)}
            </div>
            </div>
        </div>
        </div>
    </div>
  `
}

//put the initial info
const Intro = () =>{
    return `
    <h1>Hey Udacity World!</h1>
    <h4>Welcome to the Mars Rovers Photos</h4>
    <h5>Each rover has its own set of photos stored in the database, which can be queried separately. There are several possible queries that can be made against the API. Photos are organized by the sol (Martian rotation or day) on which they were taken, counting up from the rover's landing date. A photo taken on Curiosity's 1000th Martian sol exploring Mars, for example, will have a sol attribute of 1000. If instead you prefer to search by the Earth date on which a photo was taken, you can do that, too.

Along with querying by date, results can also be filtered by the camera with which it was taken and responses will be limited to 25 photos per call. Queries that should return more than 25 photos will be split onto several pages, which can be accessed by adding a 'page' param to the query.

Each camera has a unique function and perspective, and they are named as follows:</h5>
    `
}
// This part creates dropdowns with buttons 
// Rerf: getbootstrap.com - dropdowns part
const Navbar =(rovers,dropDown)=>{
    return (`
        <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Select your Rover
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Curiosity</a></li>
    <li><a class="dropdown-item" href="#">Opportunity</a></li>
    <li><a class="dropdown-item" href="#">Spirit</a></li>
  </ul>
</div>
            ${loopItems(rovers,dropDown)}
        </div>`)
    }

//get random Rover photo info
// Second HOF that get random rover photos info
const hofN2 = (fn, state) =>{
    let variable = state.get("rovers")
    return fn(variable)
}


//main function 
const App = (state) => {

    return `
        ${Intro()}
        ${Navbar(state.get("rovers"),createButton)}
        ${Card(state)}
    `
}

//random number with the function math.floor
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor

const randNumber = (arr) => {
   return  arr[Math.floor(Math.random()*arr.length)];
}

const root = document.getElementById('root')
const render = async (state) => {root.innerHTML = App(state)}

//load: this function is what renders the page
const load = (id,randNumber) =>{
    if (state.get("selection") ===""){
        state = state.set("selection",hofN2(randNumber,state))

        
    } else {
        state = state.set("selection",id)

    }
    
    getRoverImg(state.get("selection"),render)
    
}



// this function calls the endpoint to get the last mars pic to the specified info Rover
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
const getRoverImg = async (rover,render) =>{

    let data = await fetch(`http://localhost:3000/rovers/${rover}`)
        .then(res => res.json())
        .then(roverData =>  
            updatePhoto({"id":roverData.id, 
            "sol":roverData.sol, 
            "camara_name":roverData.camera.full_name,
            "camara_code":roverData.camera.name,
            "image":roverData.img_src,
            "name":roverData.rover.name,
            "roverStatus":roverData.rover.status,
            "roverLanding":roverData.rover.landing_date,
            "roverLauch":roverData.rover.launch_date
        },render))
     
    return data
}

const updatePhoto = (photo,render)=>{
    state = state.set("photo",photo)
    root.innerHTML = "<h1>Loading...</h1>"
    render(state)

}

window.addEventListener('load',load(state,randNumber))
