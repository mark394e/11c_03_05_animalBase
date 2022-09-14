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
  star: false,
  winner: false,
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

  // find previous sortBy element and remove the sortBy-class
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // indicate active sort
  event.target.classList.add("sortby");

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
  allAnimals = jsonData.map(prepareObject);

  // filter and sort on the first load
  buildList();
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

  if (animal.star === true) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }

  clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

  function clickStar() {
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }

    buildList();
  }

  // winners
  clone.querySelector("[data-field='winner']").dataset.winner = animal.winner;
  clone.querySelector("[data-field='winner']").addEventListener("click", clickWinner);
  function clickWinner() {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      tryToMakeAWinner(animal);
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeAWinner(selectedAnimal) {
  const winners = allAnimals.filter((animal) => animal.winner);

  const numbersOfWinners = winners.length;

  const other = winners.filter((animal) => animal.type === selectedAnimal.type).shift();
  if (other !== undefined) {
    console.log("there can only be one winner of this type");
    removeOther(other);
  } else if (numbersOfWinners >= 2) {
    console.log("there can only be two winners");
    removeAorB(winners[0], winners[1]);
  } else {
    makeWinner(selectedAnimal);
  }

  function removeOther(other) {
    // removes hide from warning-box and adds eventlistners to exit and remove button
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    // if exit button is clicked then add hide to warning-box, and remove the eventlisteners
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
    }

    // if remove other button is clicked then remove the other animal of this type and make the selected animal a winner
    // closes the warning-box as well
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }

  function makeWinner(animal) {
    animal.winner = true;
  }
}
