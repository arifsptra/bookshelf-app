// variable declaration to store book data
const books = [];
const RENDER_EVENT = "render-book";

// event when DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // event when the form is submitted
  const submitForm = document.getElementById("bookData");
  submitForm.addEventListener("submit", function (event) {
    // so that the event does not become a default event of a DOM
    event.preventDefault();
    // call the add book function
    addBook();
  });
  // add book function
  function addBook() {
    // variable declaration
    const bookTitle = document.getElementById("title").value;
    const bookWriter = document.getElementById("writer").value;
    const bookYear = document.getElementById("year").value;
    const bookCheck = document.getElementById("check").checked;
    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, bookTitle, bookWriter, bookYear, bookCheck);
    // save data into todos variable
    books.push(bookObject);
    // render event
    document.dispatchEvent(new Event(RENDER_EVENT));
    // call the save data function
    saveData();
  }
  // the generate id function makes use of the built-in function
  function generateId() {
    return +new Date();
  }
  // function to create book object
  function generateBookObject(id, title, writer, year, check) {
    return {
      id,
      title,
      writer,
      year,
      check,
    };
  }
  // event to render input result
  document.addEventListener(RENDER_EVENT, function () {
    // variable declaration
    const unRead = document.getElementById("bookshelfUnRead");
    const alreadyRead = document.getElementById("bookshelfAlreadyRead");
    // fill with empty value
    unRead.innerHTML = "";
    alreadyRead.innerHTML = "";
    // loop to fill book items
    for (const bookItem of books) {
      // variable declaration
      const bookElement = makeBook(bookItem);
      // condition if the check value is true then the data will be stored in alreadyRead otherwise it will be stored in unRead
      if (bookItem.check === true) {
        alreadyRead.append(bookElement);
      } else {
        unRead.append(bookElement);
      }
    }
  });
  //
  function makeBook(bookObject) {
    // variable declaration and assign a variable value from the book object value
    // to display book title
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;
    // to display book writer
    const textWriter = document.createElement("p");
    textWriter.innerText = "Penulis: " + bookObject.writer;
    // to display book year
    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + bookObject.year;
    // to wrap title, writer, and year element
    const textDescription = document.createElement("div");
    textDescription.classList.add("description");
    // to wrap description element and actionButton element
    const container = document.createElement("div");
    textDescription.append(textTitle, textWriter, textYear);
    container.append(textDescription);
    container.setAttribute("id", "book-${bookObject.id}");
    container.classList.add("list");
    // to delete button variable
    const trashButton = document.createElement("button");
    trashButton.setAttribute("id", "deleteButton");
    trashButton.innerText = "Hapus Buku";
    // to already read or un read button variable
    const readCheck = document.createElement("button");
    // function to remove book
    function removeBookList(bookId) {
      // variable declaration
      const bookTarget = findBookIndex(bookId);
      // function to find book index
      function findBookIndex(bookId) {
        // loops take value from books object
        for (const index in books) {
          // condition if books[i].id is equal to bookId then return index value;
          if (books[index].id === bookId) {
            return index;
          }
        }
        // if it does not match the conditions it will return -1
        return -1;
      }
      // consition if bookTarget is equal to -1 then return empty value;
      if (bookTarget === -1) return;
      // use the splice method to remove the element
      books.splice(bookTarget, 1);
      // render event
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
    // variable to wrap unread/alreadyRead Button and removeButton
    const actionButton = document.createElement("div");
    actionButton.classList.add("actionButton");
    // consition if bookObject.check is true
    if (bookObject.check === true) {
      // set attribute, change display text, and click event
      readCheck.setAttribute("id", "unReadButton");
      readCheck.innerText = "Belum Selesai Dibaca";
      readCheck.addEventListener("click", function () {
        // call the move to unread function
        moveToUnRead(bookObject.id);
      });
      // function to move to unread
      function moveToUnRead(bookId) {
        const bookTarget = findBook(bookId);
        if (bookTarget == null) return;
        bookTarget.check = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }
      // add event click trashButton for remove unread list
      trashButton.addEventListener("click", function () {
        // call function removeBookList
        removeBookList(bookObject.id);
      });
      // add readCheck and trashButton elements into actionButton
      actionButton.append(readCheck, trashButton);
      // add actionButton into container
      container.append(actionButton);
    } else {
      // condition bookObject.check is false
      // set attribute, change display text, and click event
      readCheck.setAttribute("id", "alreadyReadButton");
      readCheck.innerText = "Selesai Dibaca";
      readCheck.addEventListener("click", function () {
        // call the move to already read function
        moveToAlreadyRead(bookObject.id);
      });
      // function to move to already read
      function moveToAlreadyRead(bookId) {
        const bookTarget = findBook(bookId);
        if (bookTarget == null) return;
        bookTarget.check = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }
      // add event click trashButton for remove unread list
      trashButton.addEventListener("click", function () {
        // call function removeBookList
        removeBookList(bookObject.id);
      });
      // add readCheck and trashButton elements into actionButton
      actionButton.append(readCheck, trashButton);
      // add actionButton into container
      container.append(actionButton);
    }
    // function search for books in array
    function findBook(bookId) {
      // loop that takes values from array books
      for (const bookItem of books) {
        // condition if the id value of the bookItem is the same as the bookId parameter it will return the bookItem value
        if (bookItem.id === bookId) {
          return bookItem;
        }
      }
      // otherwise the condition will return null
      return null;
    }
    // the makeBook function will return the value of the container variable
    return container;
  }
  // condition if isStorageExist() value is true
  if (isStorageExist()) {
    // call function loadDataFromStorage()
    loadDataFromStorage();
  }
});
// variable declaration
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
// check browser support web storage or not
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Not Supported!");
    return false;
  }
  return true;
}
// function to save data
function saveData() {
  // condition if isStorageExist() value is true
  if (isStorageExist()) {
    // variable declaration by convert javascript object to JSON string
    const parsed = JSON.stringify(books);
    // save value to local storage
    localStorage.setItem(STORAGE_KEY, parsed);
    // saved event
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
// function for load data from storage
function loadDataFromStorage() {
  // variable declaration by fetching value from local storage
  const serializedData = localStorage.getItem(STORAGE_KEY);
  // variable declaration by converting JSON string to javascript object
  let data = JSON.parse(serializedData);
  // condition if value of data not equal to null
  if (data !== null) {
    // loops by retrieving data from data
    for (const book of data) {
      // add data to books object
      books.push(book);
    }
  }
  // render event
  document.dispatchEvent(new Event(RENDER_EVENT));
}
