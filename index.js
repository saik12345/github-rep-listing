// let arr=[1,2,3];
// for(var x in arr){
//     let listItem=document.createElement("p");
//     listItem.textContent =arr[x];
// document.getElementById("repo").appendChild(listItem);
// }
// arr=[4,5];
// document.querySelector(".next").onclick=function(){
// document.getElementById("repo").innerHTML="";
// for(var x in arr){
//     let listItem=document.createElement("p");
//     listItem.textContent =arr[x];
// document.getElementById("repo").appendChild(listItem);
// }}
let BASE_URL="https://api.github.com/users";
let userName='';
let pageNum=1;
let repo_per_page=10;
let repo_max_reached=false;
let root=document.getElementById("root");
let searchButton=document.getElementById("search");
let prev=document.getElementById("prev");
let next=document.getElementById("next");
let Select=document.getElementById("repo_per_page");
//--------------events------------------
hide(true);
function hide(searchHidden){
if(searchHidden===true){
document.getElementById("user-section").style.display="none";
document.getElementById("user-repo").style.display="none";
}
else{
    document.getElementById("user-section").style.display="grid";
document.getElementById("user-repo").style.display="block";
}
}
document.getElementById("user-search").onkeyup=function(){
    userName=this.value.trim();
    if(userName==""){
        hide(true);
    }
    console.log(userName);
}

Select.addEventListener("change", function () {
    repo_per_page = this.value;
    console.log("value: " + repo_per_page);
    document.getElementById("repo").innerHTML='';
    getUser();
  });
  next.onclick=async function(){
    if(!repo_max_reached){
    
    document.getElementById("repo").innerHTML='';
    pageNum++;
    document.getElementById("page_no").textContent=pageNum;
    getUser();
    
    
    }
  }
  prev.onclick=function(){
    if(pageNum>1){
        repo_max_reached=false;
    pageNum--;
    console.log(pageNum);
    document.getElementById("page_no").textContent=pageNum;
    document.getElementById("repo").innerHTML='';
    getUser();
    }
  }
searchButton.onclick=function(){
    if(userName!=""){
    pageNum=1;
    document.getElementById("page_no").textContent=pageNum;
    document.getElementById("repo").innerHTML='';
    userBio(); 
    getUser();
    }
}



//-----user-bio-----------------
async function userBio(){
    // document.getElementById("search-bar").style.visibility="hidden";
    // document.getElementById("user-section").style.visibility="hidden";
    // document.getElementById("user-repo").style.visibility="hidden";
    root.classList.add("loader");
    try{
    const res=await fetch(`${BASE_URL}/${userName}`);
    const data=await res.json();
    root.classList.remove("loader");
    // document.getElementById("search-bar").style.visibility="visible";
    // document.getElementById("user-section").style.visibility="visible";
    // document.getElementById("user-repo").style.visibility="visible";
    console.log(data);
    
    if(res>=400 && res<=500 && data.length!=0){
        hide(false);
    const imgURL=data.avatar_url;
    const githubURL=data.html_url;
    const user=data.login;
    const bio=data.bio?data.bio:"no data on bio..";
    const location=data.location?data.location:"no data on location..";
    const twitterUserName=data.twitter_username;
    document.getElementById("u_img").src=imgURL;
    document.querySelector("#user-section--bio :nth-child(1)").innerText=`${user}`;
    document.querySelector("#user-section--bio :nth-child(2)").innerText=`Bio: ${bio}`;
    document.querySelector("#user-section--bio :nth-child(3)").innerText=`Location: ${location}`;
    document.querySelector("#user-section--image :nth-child(2)").innerHTML=`<a href=${githubURL} target="-blank">${githubURL}</a>`;
        if(twitterUserName!=null){
        
        document.querySelector("#user-section--bio :nth-child(4)").innerHTML=`<a href=https://twitter.com/${twitterUserName} target="-blank">https://twitter.com/${twitterUserName}</a>`;
    }
    else{
        document.querySelector("#user-section--bio :nth-child(4)").textContent=`No twitter link found..`;
    }
}
}catch(err){
    console.log("error in userBio() : "+err.message());
}
}

//-------repo----------
async function getUser(){
const res=await fetch(`${BASE_URL}/${userName}/repos?per_page=${repo_per_page}&page=${pageNum}`);
const data=await res.json();

// console.log(data);
if(res>=400 && res<=500 && data.length!=0){
for(var x in data){
    let repo=document.createElement('div');
    let repoTitle=document.createElement('h2');
    repoTitle.textContent=data[x].name;
    let repoDes=document.createElement('p');
    repoDes.textContent=(data[x].description==null)?"No Description":data[x].description;
    repo.appendChild(repoTitle);
    repo.appendChild(repoDes);
    // document.getElementById("repo").appendChild(repo);
    let topics=data[x].topics;
    console.log(topics);
    if(topics.length>0){
        let topicsDiv=document.createElement("div");
        repo.appendChild(topicsDiv);
    for(var i in topics){
        let topic=document.createElement("button");
        topic.textContent=topics[i];
        topicsDiv.appendChild(topic);
    }
}
document.getElementById("repo").appendChild(repo);
}
}
else{
    repo_max_reached=true;
    pageNum--;
    document.getElementById("page_no").textContent=pageNum;
    getUser();
}
}
// getUser();
