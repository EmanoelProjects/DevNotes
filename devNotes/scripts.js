// elementos
const addBtn = document.querySelector("#add-btn");
const noteInput = document.querySelector("#note-value");
const notesContainer = document.querySelector(".notes-container");
const searchInput = document.querySelector("#search-input");

// funções

function showNotes() {
  clearNotes();
  getNotes().forEach((notes) => {
    createNote(notes.content, notes.id, notes.fixed);
  });
}

function clearNotes() {
  notesContainer.replaceChildren();
}

function addNote() {
  let notes = getNotes();

  const noteObject = {
    content: noteInput.value,
    id: generateId(),
    fixed: false,
  };

  notes.push(noteObject);
  saveNotes(notes);
  createNote(noteObject.content, noteObject.id, noteObject.fixed);
  noteInput.value = "";
}

function generateId() {
  const id = Math.floor(Math.random() * 5000);
  return id;
}

function removeNote(element, id) {
  const targetNotes = getNotes().filter((notes) => notes.id != id);
  notesContainer.removeChild(element);
  saveNotes(targetNotes);
}

function copyNote(content) {
  const notes = getNotes();

  const newNote = {
    content: content,
    id: generateId(),
  };

  notes.push(newNote);

  saveNotes(notes);
  showNotes();
}

function fixedNote(id) {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.fixed = !targetNote.fixed;

  saveNotes(notes);

  showNotes();
}

function searchNote(content) {
  clearNotes();

  const notes = getNotes();

  const target = notes.filter((note) => note.content.includes(content));

  if (content != "") {
    target.forEach((notes) => {
      createNote(notes.content, notes.id, notes.fixed);
    });
  } else {
    clearNotes();
    showNotes();
  }
}

function upadateNote(newContent, id) {
  const notes = getNotes();

  const target = notes.filter((note) => note.id === id)[0];

  target.content = newContent;

  saveNotes(notes);
}

function createNote(content, id, fixed) {
  const note = document.createElement("div");

  note.classList.add("note");

  const removeIcon = document.createElement("i");

  removeIcon.classList.add("bi-x-lg");

  note.appendChild(removeIcon);

  note
    .querySelector(".bi-x-lg")
    .addEventListener("click", () => removeNote(note, id));

  const copyIcon = document.createElement("i");

  copyIcon.classList.add("bi-file-earmark-plus");

  note.appendChild(copyIcon);

  note
    .querySelector(".bi-file-earmark-plus")
    .addEventListener("click", () => copyNote(content));

  const fixedIcon = document.createElement("i");

  fixedIcon.classList.add("bi-pin");

  note.appendChild(fixedIcon);

  note.querySelector(".bi-pin").addEventListener("click", () => fixedNote(id));

  const textArea = document.createElement("textarea");

  textArea.placeholder = "Tarefas...";

  textArea.innerText = content;

  note.appendChild(textArea);

  textArea.addEventListener("keyup", (e) => upadateNote(e.target.value, id));

  notesContainer.appendChild(note);

  if (fixed) {
    note.classList.add("fixed");
  }
}

// localStorage

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("@notes")) || [];

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
}

function saveNotes(notes) {
  localStorage.setItem("@notes", JSON.stringify(notes));
}

// Eventos
addBtn.addEventListener("click", () => {
  addNote();
});

noteInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    addNote();
  }
});

searchInput.addEventListener("keyup", (e) => {
  const content = e.target.value;

  searchNote(content);
});

// inicialização
showNotes();
