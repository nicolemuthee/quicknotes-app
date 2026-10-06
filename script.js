const MAX_LENGTH = 200;
const CATEGORIES = ["Personal", "Work", "Study"];

const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const characterCount = document.querySelector("#character-count");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const clearAllBtn = document.querySelector("#clear-all-btn");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = "You have " + notes.length + " notes.";
  }
}

function updateCharacterCount() {
  characterCount.textContent =
    noteInput.value.length + " / " + MAX_LENGTH + " characters";
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

function render() {
  notesList.textContent = "";

  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.text.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "All" || note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  if (filteredNotes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";

    if (notes.length === 0) {
      emptyMessage.textContent = "No notes yet. Add your first note!";
    } else {
      emptyMessage.textContent = "No notes match your search or filter.";
    }

    notesList.append(emptyMessage);
    updateCount();
    return;
  }
  filteredNotes.forEach((note) => {
    const category = CATEGORIES.includes(note.category)
      ? note.category
      : "Personal";

    const li = document.createElement("li");
    li.className = "note-card category-" + category.toLowerCase();

    const text = document.createElement("p");
    text.className = "note-text";
    text.textContent = note.text;

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const label = document.createElement("span");
    label.className = "category-label";
    label.textContent = category;

    const date = document.createElement("span");
    date.textContent = note.createdAt;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    meta.append(label, date, deleteBtn);
    li.append(text, meta);
    notesList.append(li);
  });

  updateCount();
}

noteInput.addEventListener("input", updateCharacterCount);

searchInput.addEventListener("input", render);

categoryFilter.addEventListener("change", render);

clearAllBtn.addEventListener("click", () => {
  if (notes.length === 0) {
    return;
  }

  const confirmed = confirm("Are you sure you want to delete all notes?");

  if (confirmed) {
    notes = [];
    saveNotes();
    render();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > MAX_LENGTH) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const note = {
    id: Date.now(),
    text: text,
    category: categorySelect.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(note);
  saveNotes();

  noteInput.value = "";
  updateCharacterCount();

  render();
});

render();
updateCharacterCount();
