let APIimg = 'http://localhost:8000/img';
let APIadd = 'http://localhost:8000/add';

//! SEARCH input
let searchInp = document.querySelector('#searchInp');
let searchValue = '';
// !

// ! PAGINATION
let paglist = document.querySelector('.paglist');
let prev = document.querySelector('.prev');
let next = document.querySelector('.next');
let pageTotal = 1;
let currentPage = 1;
// !
let diaLog = document.querySelector('#diaLog');
let addBtn = document.querySelector('.addBtn');
let addList = document.querySelector('.addList');
let addUrl = document.querySelector('#urlInp');

let btn_cancel = document.getElementById('cancel');
let btn_cancel3 = document.getElementById('cancel3');
let addMenu = document.getElementById('addMenu');

addBtn.addEventListener('click', function () {
    diaLog.showModal();
});

btn_cancel.addEventListener('click', function () {
    diaLog.close();
});

//! ADD
addMenu.addEventListener('click', async function () {
    let newAdd = {
        url: addUrl.value,
    };
    await fetch(APIadd, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(newAdd),
    });
    addMenuRender();
});

async function addMenuRender() {
    let apiadd = await fetch(APIadd).then((res) => res.json());
    
    apiadd.forEach((element) => {
        let div = document.createElement('div');
        div.innerHTML = `<div class="add-item"><img src=${element.url}></div>`;
        addList.prepend(div);
        // console.log(element);
    });
}

//!RENDER PHOTOS

let showModalAdd = document.querySelector('.create');
let photoDialog = document.querySelector('#photo-add');
let addPhoto = document.querySelector('#photoAdd');

// add photo inputs
let likeInp = document.querySelector('#likes');
let commentInp = document.querySelector('#comments');
let viewsInp = document.querySelector('#views');
let photoInp = document.querySelector('#photo');

let btn_cancel2 = document.getElementById('cancel2');

let photosList = document.querySelector('.photos');

btn_cancel2.addEventListener('click', function () {
    photoDialog.close();
});

btn_cancel3.addEventListener('click', function () {
    editDialog.close();
});

showModalAdd.addEventListener('click', function () {
    photoDialog.showModal();
});

addPhoto.addEventListener('click', async function () {
    let newPhoto = {
        photo: photoInp.value,
        likes: likeInp.value,
        comments: commentInp.value,
        views: viewsInp.value,
    };
    await fetch(APIimg, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(newPhoto),
    });
    photoInp.value = '';
    likeInp.value = '';
    commentInp.value = '';
    viewsInp.value = '';
    render();
});

async function render() {
    let photos = await fetch(
        `${APIimg}?q=${searchValue}&_page=${currentPage}&_limit=8`
    ).then((res) => res.json());
    pagination();
    photosList.innerHTML = '';
    photos.forEach((element) => {
        photosList.innerHTML += `<div class="photo-item" id='${element.id}'><div><img src=${element.photo}></div>
        <div class='photo-info'><p><img style="width:20px;height:20px;" src=https://cdn-icons-png.flaticon.com/512/1077/1077035.png>${element.likes}</p><p><img 
       style="width:20px;height:20px;" src=https://cdn-icons-png.flaticon.com/512/3114/3114810.png>${element.comments}</p><p>${element.views}</p></div>
        <div class="card-buttons">
                        <button id=${element.id} class="photo-edit">Edit</button>
                        <button id=${element.id} onclick='deleteContact(${element.id})'>Delete</button>
        </div></div>`;
    });
}
addMenuRender();

render();

//!PAGINATION
function pagination() {
    fetch(`${APIimg}?q=${searchValue}`)
        .then((res) => res.json())
        .then((data) => {
            pageTotal = Math.ceil(data.length / 4);
            paglist.innerHTML = '';
            for (let i = 1; i <= pageTotal; i++) {
                let page = document.createElement('li');
                page.innerHTML = ` <li class="page-item"><a class="page-link page-number" href="#">${i}</a></li>`;
                paglist.append(page);
            }
        });
}
prev.addEventListener('click', () => {
    if (currentPage <= 1) {
        return;
    }
    currentPage--;
    render();
});

next.addEventListener('click', () => {
    if (currentPage >= pageTotal) {
        return;
    }
    currentPage++;
    render();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-number')) {
        currentPage = e.target.innerText;
        render();
    }
});

//! DELETE PHOTO

function deleteContact(id) {
    fetch(`${APIimg}/${id}`, { method: 'DELETE' }).then(() => render());
}

//! EDIT PHOTOS

let editDialog = document.getElementById('photo-edit');
let likeEditInp = document.querySelector('#editLikes');
let commentEditInp = document.querySelector('#editComments');
let viewsEditInp = document.querySelector('#editViews');
let photoEditInp = document.querySelector('#editPhoto');

let photoEditBtn = document.querySelector('#photo-edit-btn');

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('photo-edit')) {
        editDialog.showModal();
        let id = e.target.id;
        fetch(`${APIimg}/${id}`).then((res) =>
            res.json().then((data) => {
                likeEditInp.value = data.likes;
                commentEditInp.value = data.comments;
                viewsEditInp.value = data.views;
                photoEditInp.value = data.photo;
                photoEditBtn.setAttribute('id', data.id);
            })
        );
    }
});

photoEditBtn.addEventListener('click', function () {
    let id = this.id;
    let likes = likeEditInp.value;
    let photo = photoEditInp.value;
    let comments = commentEditInp.value;
    let views = viewsEditInp.value;

    let editedPhoto = {
        likes: likes,
        photo: photo,
        comments: comments,
        views: views,
    };
    editPhoto(editedPhoto, id);
});

function editPhoto(editedPhoto, id) {
    fetch(`${APIimg}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; carset=utf-8' },
        body: JSON.stringify(editedPhoto),
    }).then(() => render());
    editDialog.close();
}

//! SEARCH

searchInp.addEventListener('input', () => {
    searchValue = searchInp.value;
    render();
});