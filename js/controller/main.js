import CallApiServices from "../services/CallApi.js";
import ToDo from "../module/ToDo.js";

const callApi = new CallApiServices();

const getEle = (id) => { return document.getElementById(id) }

const renderHTML = (data) => {
    let contentNotYet = "";
    let contentComp = "";

    data.forEach(toDo => {
        if (toDo.status === "not yet") {
            contentNotYet += `
            <li>
                <p>${toDo.name}</p>
                <div class="buttons">
                    <button class="remove" onclick="removeItem(${toDo.id})"><i class="fa-solid fa-trash"></i></button>
                    <button class="complete" onclick="changeStatus(${toDo.id},true)"><i class="fa-solid fa-circle-check"></i></button>
                </div>
            </li>
            `
        } else if (toDo.status === "complete") {
            contentComp += `
            <li>
                <p>${toDo.name}</p>
                <div class="buttons">
                    <button class="remove" onclick="removeItem(${toDo.id})"><i class="fa-solid fa-trash"></i></button>
                    <button class="complete" onclick="changeStatus(${toDo.id},false)"><i class="fa-solid fa-circle-check fas"></i></button>
                </div>
            </li>
            `
        }
    });

    getEle('todo').innerHTML = contentNotYet;
    getEle('completed').innerHTML = contentComp;
}

const getToDoList = () => {
    callApi.callApi("", "GET")
        .then((result) => {
            console.log(result.data);
            renderHTML(result.data);
        })
        .catch((err) => {
            console.log(err)
        })
}

getToDoList()

// thêm task

getEle('addItem').onclick = ()=>{
    const name = getEle('newTask').value;
    console.log(name);
    if(!name){
        alert('nhập nội dung công việc');
        return;
    }
    const task = new ToDo('',name,"not yet");
    callApi.callApi('','POST',task)
    .then((result) => {
        getToDoList();
    })
    .catch((err)=>{
        console.log(err);
    })
    
}

// xóa task

const removeItem = (id) => {
    callApi.callApi(id,'DELETE')
    .then((result)=>{
        getToDoList();
    })
    .catch((err)=>{
        console.log(err);
    })
}

window.removeItem = removeItem;

// chuyển task
const changeStatus = async  (id,status) => {
    let stt = ""
    if(!status){
        stt = "not yet";
    }else if(status){
        stt = "complete";
    }
    let task = await  callApi.callApi(id,"GET","")
    .then((result)=>{
        return result.data;
    }).catch((err) => {
        console.log(err)
    })
    task.status = stt;
    console.log(task.status)
    callApi.callApi(id,"PUT",task)
    .then((result) => {
        getToDoList();
    }).catch((err)=>{
        console.log(err);
    })
}

window.changeStatus = changeStatus;

// sort A to Z
 getEle('two').onclick = () => {
    callApi.callApi('',"GET")
    .then((rs) => {
        let data = rs.data;
        let byName = data.slice(0);
        byName.sort((a,b)=>{
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        renderHTML(byName);
    })
    .catch((err) => {
        console.log(err)
    })
 }

 // sort Z to A 
 getEle("three").onclick = () => {
    callApi.callApi('',"GET")
    .then((rs) => {
        let data = rs.data;
        let byName = data.slice(0);
        byName.sort((a,b)=>{
            let x = b.name.toLowerCase();
            let y = a.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        renderHTML(byName);
    })
    .catch((err) => {
        console.log(err)
    })
 }