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
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

function selectFilter(event) {
  // defines the filter as the dataset of the button that has been clicked
  const filter = event.target.dataset.filter;

  // calls the filterList-function with the filter-parameter
  filterList(filter);
}

function selectSort(event) {
  // defines the filter as the dataset of the button that has been clicked
  const sortBy = event.target.dataset.sort;

  // calls the sortList-function with the sortBy-parameter
  sortList(sortBy);
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

  displayList(allAnimals);
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

function filterList(filterBy) {
  // by default the filteredList is allAnimals
  let filteredList = allAnimals;

  // if the filter is set to "cat" then filter the allAnimals-list with the isCat-function
  if (filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  }
  // if the filter is set to "dog" then filter the allAnimals-list with the isDog-function
  else if (filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }

  // call the displayList-function with the filteredList as a parameter
  displayList(filteredList);
}

function isCat(animal) {
  // returns all the animals which has the value of cat in its type-property
  return animal.type === "cat";
}

function isDog(animal) {
  // returns all the animals which has the value of dog in its type-property
  return animal.type === "dog";
}

function sortList(sortBy) {
  let sortedList = allAnimals;

  if (sortBy === "name") {
    sortedList = sortedList.sort(sortByName);
  } else if (sortBy === "type") {
    sortedList = sortedList.sort(sortByType);
  }

  displayList(sortedList);
}

function sortByName(animalA, animalB) {
  if (animalA.name < animalB.name) {
    return -1;
  } else {
    return 1;
  }
}

function sortByType(animalA, animalB) {
  if (animalA.type < animalB.type) {
    return -1;
  } else {
    return 1;
  }
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
