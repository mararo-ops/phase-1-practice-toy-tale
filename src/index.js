let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  fetchToys();
  const addToyForm = document.querySelector(".add-toy-form");
  addToyForm.addEventListener("submit", createToy);
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });
}

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const toyCard = document.createElement("div");
  toyCard.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";

  const p = document.createElement("p");
  p.textContent = `${toy.likes} Likes`;

  const btn = document.createElement("button");
  btn.className = "like-btn";
  btn.id = toy.id;
  btn.textContent = "Like ❤️";
  btn.addEventListener("click", increaseLikes);

  toyCard.append(h2, img, p, btn);
  toyCollection.appendChild(toyCard);
}

function createToy(event) {
  event.preventDefault();
  
  const toyName = event.target.name.value;
  const toyImage = event.target.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": toyName,
      "image": toyImage,
      "likes": 0
    })
  })
  .then(response => response.json())
  .then(toy => renderToy(toy));
}

function increaseLikes(event) {
  const btn = event.target;
  const currentLikes = parseInt(btn.previousSibling.textContent.split(" ")[0]);
  const newLikes = currentLikes + 1;

  fetch(`http://localhost:3000/toys/${btn.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then(response => response.json())
  .then(toy => {
    btn.previousSibling.textContent = `${toy.likes} Likes`;
  });
}
