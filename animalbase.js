"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

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
  document.querySelectorAll("[data-action='sort']").forEach((sort) => sort.addEventListener("click", selectSort));
}

function selectFilter(event) {
  // defines the filter as the dataset of the button that has been clicked
  const filter = event.target.dataset.filter;

  // calls the filterList-function with the filter-parameter
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function selectSort(event) {
  // defines the "sorting by" as the dataset of the button that has been clicked
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // toggles between ascending or descending sorting direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  // calls the sortList-function with the sortBy- and sortDir-parameter
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
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

function filterList(filteredList) {
  // by default the filteredList is allAnimals
  // let filteredList = allAnimals;

  // if the filter is set to "cat" then filter the allAnimals-list with the isCat-function
  if (settings.filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  }
  // if the filter is set to "dog" then filter the allAnimals-list with the isDog-function
  else if (settings.filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }

  // call the displayList-function with the filteredList as a parameter
  return filteredList;
}

function isCat(animal) {
  // returns all the animals which has the value of cat in its type-property
  return animal.type === "cat";
}

function isDog(animal) {
  // returns all the animals which has the value of dog in its type-property
  return animal.type === "dog";
}

function sortList(sortedList) {
  // by default the sortedList is allAnimals
  // let sortedList = allAnimals;

  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  }

  // a new sortedList is made by sorting allAnimals with the sortByProperty-function
  sortedList = sortedList.sort(sortByProperty);

  // converts the properties into strings and compare the sequence of UTF-16 code units values in ascending order
  // by using function-closure it is possible to call the sortBy-variable as the sortByProperty-function is inside the sortList-function
  function sortByProperty(animalA, animalB) {
    // using the sortBy-parameter from the selectSort-function as a "property"
    if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allAnimals);
  const sortedList = sortList(currentList);
  displayList(sortedList);
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
