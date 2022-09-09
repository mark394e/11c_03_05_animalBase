"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons
  document.querySelector("[data-filter=cat]").addEventListener("click", catFilter);
  document.querySelector("[data-filter=dog]").addEventListener("click", dogFilter);
  document.querySelector("[data-filter=all]").addEventListener("click", loadJSON);
  loadJSON();
}

function catFilter() {
  const onlyCats = allAnimals.filter(isCat);
  displayList(onlyCats);
}

function dogFilter() {
  const onlyDogs = allAnimals.filter(isDog);
  displayList(onlyDogs);
}

async function loadJSON() {
  console.log("loadJSON");
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  console.log("prepareObject");
  allAnimals = jsonData.map(prepareObject);

  // if (filter === "cat") {
  //   const onlyCats = allAnimals.filter(isCat);
  //   displayList(onlyCats);
  // } else if (filter === "dog") {
  //   const onlyDogs = allAnimals.filter(isDog);
  //   displayList(onlyDogs);
  // } else {
  //   displayList(allAnimals);
  // }

  displayList(allAnimals);
}

function isCat(animal) {
  console.log("isCat");
  if (animal.type === "cat") {
    return true;
  }
  return false;
}

function isDog(animal) {
  console.log("isDog");
  if (animal.type === "dog") {
    return true;
  }
  return false;
}

function prepareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
