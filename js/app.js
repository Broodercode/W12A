const postBox = document.getElementById("postBox");
const titleBox = document.getElementById("titleBox");
const postSubmit = document.getElementById("submit");

var postDelete;
var postBoxText;
var titleBoxText;
var postArr;
var API;

function onBuildPosts() {
  let list;
  list = document.getElementById("content-list");
  list.innerHTML = "";

  postArr.forEach((el, index) => {
    let title = el.title;
    let content = el.body;
    let user = el.userId;
    let li = document.createElement("li");
    li.setAttribute("id", `${index}`);
    li.setAttribute("class", "");
    let cardNode = document.createElement("div");
    cardNode.setAttribute("class", "card");
    let titleNode = document.createElement("h2");
    titleNode.setAttribute("class", "card-header");
    let titleContent = document.createTextNode(title);
    titleNode.appendChild(titleContent);
    let commentNode = document.createElement("p");
    commentNode.setAttribute("class", "card-text");
    let commentContent = document.createTextNode(content);
    let buttonGroup = document.createElement("div");
    buttonGroup.setAttribute("class", "btn-group");
    let updateButton = document.createElement("button");
    updateButton.setAttribute("class", "btn btn-primary btn-sm update-button");
    updateButton.setAttribute("type", "button");
    let updateButtonContent = document.createTextNode("UPDATE");
    updateButton.appendChild(updateButtonContent);
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger btn-sm delete-button");
    deleteButton.setAttribute("type", "button");
    let deleteButtonContent = document.createTextNode("DELETE");
    deleteButton.appendChild(deleteButtonContent);
    commentNode.appendChild(commentContent);
    cardNode.appendChild(titleNode);
    cardNode.appendChild(commentNode);
    buttonGroup.appendChild(updateButton);
    buttonGroup.appendChild(deleteButton);
    li.appendChild(cardNode);
    li.appendChild(buttonGroup);
    list.append(li);
    deleteButton.addEventListener("click", onDelete);
    updateButton.addEventListener("click", onEdit);
  });
}
//response success
function onSuccess(response) {
  if ((response.status = 201)) {
    let result = JSON.parse(response.config.body);

    postArr.unshift(result);

    onBuildPosts();
  }
}
function onGetPostSuccess(response) {
  postArr = response.data;

  onBuildPosts();
}

//error
function onError(error) {
  if (error) {
    alert();
  }
}
function handleDelete(response) {
  let index = response.config.data;
  postArr = postArr.slice(index + 1);

  onBuildPosts();
}
function onDelete(response) {
  index = parseInt(response.path[2].attributes[0].value);

  axios
    .request({
      method: "DELETE",
      url: `https://jsonplaceholder.typicode.com/posts/${index + 1}`,
      data: `${index}`,
    })
    .then(handleDelete)
    .then((json) => json);
}
function handleEdit(response) {
  let index = parseInt(response.data.id) - 1;
  postArr[index].body = "non-dynamic update";
  onBuildPosts();
}

function onEdit(response) {
  index = parseInt(response.path[2].attributes[0].value);

  axios
    .request({
      method: "PATCH",
      url: `https://jsonplaceholder.typicode.com/posts/${index + 1}`,
      data: `${index}`,
    })
    .then(handleEdit)
    .then((json) => json);
}

function onTextInput(e) {
  postBoxText = e.target.value;
}

function onTitleInput(e) {
  titleBoxText = e.target.value;
}
//getting posts
function getPosts() {
  axios
    .request({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts",
    })
    .then(onGetPostSuccess)
    .then((json) => json);
}
getPosts();

//api POST call
function onPost() {
  let title = titleBoxText;
  let msg = postBoxText;
  axios
    .request({
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/posts",
      body: JSON.stringify({
        title: title,
        body: msg,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    .then(onSuccess)
    .then((json) => json);
}

titleBox.addEventListener("input", onTitleInput);
postBox.addEventListener("input", onTextInput);
postSubmit.addEventListener("click", onPost);
