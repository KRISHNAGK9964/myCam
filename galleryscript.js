console.log("running");
let backBtn = document.querySelector(".back-btn");
backBtn.addEventListener("click", () => {
  location.assign("./index.html");
});
setTimeout(() => {
  if (db) {
    console.log("runnin");
    let imageDBTransaction = db.transaction("image", "readonly");
    let imageStore = imageDBTransaction.objectStore("image");
    let imageRequest = imageStore.getAll();
    imageRequest.onsuccess = () => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".image-gallery");
      imageResult.forEach((imageObj) => {
        let imageElem = document.createElement("div");
        imageElem.setAttribute("class", "imgBox");
        imageElem.setAttribute("id", imageObj.id);
        let url = imageObj.url;
        let liked = imageObj.liked;
        imageElem.innerHTML = `
        <img src="${url}">
        <div class="logo_icons">
            <div><i class="fa-solid fa-trash-can delete"></i></div>
            <div class="icons">
                <i class="fas fa-heart like"></i>
                <i class="fas fa-arrow-down download"></i>
            </div>
        </div>
        `;
        galleryCont.appendChild(imageElem);
        // console.log(imageElem);
        let deleteBtn = imageElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        
        let downloadBtn = imageElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);          
        
        let likeBtn = imageElem.querySelector(".like");
        likeBtn.addEventListener("click", likeListener);
        if(liked){
          likeBtn.classList.add("liked");
        }
        let sourceimg = imageElem.querySelector('img')
        sourceimg.addEventListener("click" , modalHandler);
      });
    };
    let videoDBTransaction = db.transaction("video", "readonly");
    let videoStore = videoDBTransaction.objectStore("video");
    let videoRequest = videoStore.getAll();
    videoRequest.onsuccess = () => {
      let videoResult = videoRequest.result;
      let galleryCont = document.querySelector(".image-gallery");
      videoResult.forEach((videoObj) => {
        let videoElem = document.createElement("div");
        videoElem.setAttribute("class", "imgBox");
        videoElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);
        let liked = videoObj.liked;
        videoElem.innerHTML = `
        <video autoplay loop src="${url}"></video>
        <div class="logo_icons">
            <div><i class="fa-solid fa-trash-can delete"></i></div>
            <div class="icons">
                <i class="fas fa-heart like"></i>
                <i class="fas fa-arrow-down download"></i>
            </div>
        </div>
        `;
        galleryCont.appendChild(videoElem);

        let deleteBtn = videoElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        
        let downloadBtn = videoElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);   
        
        let likeBtn = videoElem.querySelector(".like");
        likeBtn.addEventListener("click", likeListener);
        if(liked){
          likeBtn.classList.add("liked");
        }
        
        let video = videoElem.querySelector("video");
        video.addEventListener("click",modalHandler);
      });
    };
  }
}, 1000);


function deleteListener(ev) {
  console.log("delete clicked");
    // console.log(ev.target.parentElement.parentElement.parentElement);
    let id = ev.target.parentElement.parentElement.parentElement.getAttribute("id");
    let type = id.split('-')[0];
    let transaction;
    let store;
    let storeName;
    if(type == "img"){
      storeName="image"
    }else{
      storeName = "video"
    }
    transaction = db.transaction(storeName,"readwrite")
    store = transaction.objectStore(storeName);
    store.delete(id);
    ev.target.parentElement.parentElement.parentElement.remove();
}

function downloadListener(ev) {
  let id = ev.target.parentElement.parentElement.parentElement.getAttribute("id");
  let type = id.split("-")[0];
  let storeName,extension;
  if(type=="img"){
    storeName = "image";
    extension = "png";
  }else{
    storeName = "video";
    extension = "mp4";
  }
  let transaction = db.transaction(storeName,"readonly");
  let store = transaction.objectStore(storeName);
  let request = store.get(id);
  request.onsuccess = () =>{
    let result = request.result;
    let url = result.url;
    let anchorTag = document.createElement('a');
    anchorTag.href = url;
    anchorTag.download = `${storeName}.${extension}`;
    anchorTag.click();
  }
}
// let liked = false;
function likeListener(e){
  let id = e.target.parentElement.parentElement.parentElement.getAttribute("id");
    let type = id.split('-')[0];
    let transaction;
    let store;
    let storeName;
    if(type == "img"){
      storeName="image"
    }else{
      storeName = "video"
    }
    let liked;
    transaction = db.transaction(storeName,"readwrite")
    store = transaction.objectStore(storeName);
    let request = store.get(id);
    request.onsuccess = () =>{
      let result = request.result;
      liked = result.liked;
      console.log(liked);
      liked = !liked;
      result.liked = liked;
      updateRequest = store.put(result);
      console.log(result);
      if(liked){
        e.target.classList.add("liked")
      }else{
        e.target.classList.remove("liked")
      }
      console.log(e.target);
    }
    
}

function modalHandler(e){
  console.log(e.target.parentElement);
  let lightBox = document.querySelector("section .lightBox");
  lightBox.style.display = 'block';
  let elem = e.target.parentElement;
  let type = elem.getAttribute('id').split('-')[0];
  let imgtoShow = document.querySelector(".lightBox .showImg .image img");
  let vidtoShow = document.querySelector(".lightBox .showImg .image video")
  if(type == "img"){
    vidtoShow.style.display = "none";
    imgtoShow.style.display = 'block';
    imgtoShow.setAttribute('src' , e.target.getAttribute('src'));
  }else{
    imgtoShow.style.display = 'none';
    vidtoShow.style.display = 'block';
    vidtoShow.setAttribute('src' , e.target.getAttribute('src'));
  }
  let liked = e.target.parentElement.querySelector(".liked");
  let likeBtn = lightBox.querySelector(".like");
  if(liked){
    likeBtn.classList.add("liked");
  }

  let closeBtn = lightBox.querySelector(".close")
  console.log(closeBtn);
  closeBtn.addEventListener("click" , ()=>{
    lightBox.style.display = 'none';
  })

  let downloadBtn = lightBox.querySelector('.download');
}