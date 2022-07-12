let projectMenu = document.getElementById('projects');
let addProjectButton = document.getElementById('addProject');
let dialog = document.getElementById('dialog');
let dialogEvents = document.getElementById('events');
let timerEl = document.getElementById('timer');
let inputEl = document.getElementById('inputPart');
let inputProject = document.getElementById('inputProject');

// audio
let sound = new Audio("click.mp3");


// Local storage
let projects;
!localStorage.projects ? projects = [] : projects = JSON.parse(localStorage.getItem('projects'));
const UpdateLocalStorage = () =>{
    localStorage.setItem('projects', JSON.stringify(projects));
}

class Timer{
    seconds = 0;
    isStarted = false;
    timerInterval;
    eventInput;
    timerHtml
    constructor(eventInput, timerHtml) {
        this.eventInput = eventInput;
        this.timerHtml = timerHtml;
    }

    getTime(){
        let hour = Math.floor(this.seconds/3600);
        let minute = Math.floor(this.seconds/60)%60;
        let second = this.seconds%60;
        return hour + ":" + minute + ":" + second;
    }

    startTimer(){
        if (!this.isStarted){
            this.isStarted = true;
            this.timerInterval = setInterval(function () {
                this.seconds += 1;
                this.timerHtml.innerHTML = "Timer: " + this.getTime();
            }.bind(this), 1000);
        }
    }
    stopTimer(){
        if (this.isStarted){
            this.seconds = 0;
            this.timerHtml.innerHTML = "Timer: " + this.getTime();
            clearInterval(this.timerInterval);
            this.isStarted = false;
        }
    }
}

// class represents project
class Project {
    constructor(name) {
        this.name = name;
        this.events = [];
    }
}

// class represent event
function ProjectEvent(name, seconds){
    this.name = name;
    this.seconds = seconds;
}

// create template for project
const createProjectTemplate = (project, index) =>{
    return `
        <div class="project">
            <span>${project.name}</span>
            <button onclick="deleteProject(${index})" class="btn btn-danger">delete</button>
            <button onclick="openModal(${index})" class="btn btn-warning">open</button>
        </div>
    `;
};

// create template for event
const createEventTemplate = (event) =>{
    return `
        <div class="project">
            <span>${event.name}</span>
            <span>[${event.seconds}]</span>
        </div>
    `;
};

// fill projects as html
const fillHtmlProjects = () => {
    projectMenu.innerHTML = "";
    if (projects.length > 0){
        projects.forEach((item, index) => {
            projectMenu.innerHTML += createProjectTemplate(item, index);
        })
    }
};
fillHtmlProjects();

// add new project
addProjectButton.addEventListener('click', ()=>{
    sound.play();
    if (inputProject.value === '' || inputProject.value.length > 16){
        inputProject.style.borderColor = 'red';
    }else {
        inputProject.style.borderColor = null;
        projects.push(new Project(inputProject.value));
        UpdateLocalStorage();
        fillHtmlProjects();
        inputProject.value = '';
    }

});

// delete project
const deleteProject = index =>{
    projects.splice(index, 1);
    UpdateLocalStorage();
    fillHtmlProjects();
};

// Timer
let timer = new Timer(inputEl, timerEl);

// Start timer
const startTimer = () => {
    sound.play();
    let eventInput = document.getElementById('inputEvent')
    if (eventInput.value === '' || eventInput.value.length > 30){
        eventInput.style.borderColor = 'red';

    }else {
        eventInput.style.borderColor = null;
        timer.startTimer();
    }
};

// Stop timer and add event to project
const stopTimer = index => {
    sound.play();
    if (timer.isStarted){
        let eventInput = document.getElementById('inputEvent');
        let time = timer.getTime();
        timer.stopTimer();
        projects[index].events.push(new ProjectEvent(eventInput.value, time));
        UpdateLocalStorage();
        dialogEvents.innerHTML = ``;
        projects[index].events.forEach((item) =>{
            dialogEvents.innerHTML += createEventTemplate(item);
        });
        eventInput.value = '';
    }
};


// Open dialog
const openModal = index =>{
    sound.play();
    let headEl = document.getElementById('modalHeaderName');
    // Add name of project to header
    headEl.innerText = projects[index].name;
    timerEl.innerHTML = "Timer: " + timer.getTime();

    // Add buttons
    inputEl.innerHTML += `
        <button onclick="startTimer(${index})" class="btn btn-success" id="addEvent">Start</button>
        <button onclick="stopTimer(${index})" class="btn btn-warning" id="addEvent">Stop</button>
    `;

    // Fill events as html
    dialogEvents.innerHTML = ``;
    projects[index].events.forEach((item) =>{
        dialogEvents.innerHTML += createEventTemplate(item);
    });
    dialog.showModal();
};

// Close dialog
const closeModal = () =>{
    sound.play();
    let headEl = document.getElementById('modalHeaderName');
    timer.stopTimer();
    headEl.innerText = '';
    inputEl.innerHTML = `
        <input placeholder="Add an event" id="inputEvent">
    `;
    dialog.close();
};