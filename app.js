import {fetchMovieAvailability,fetchMovieList} from "./api.js"
const mainContant = document.getElementById("main");
let bookerContentHolder = document.getElementById("booker-grid-holder");
let ticketBookingBtn = document.getElementById("book-ticket-btn");
let booker = document.getElementById("booker");

async function moviesRenderFn() {
  mainContant.innerHTML = `<div id='loader'></div>`;
  let movies = await fetchMovieList();
  let movieContentCard = document.createElement("div");
  movieContentCard.setAttribute("class", "movie-holder");
  movies.forEach((movie) => {
    createNewMovieCard(movie, movieContentCard);
  });
  mainContant.innerHTML = "";
  mainContant.appendChild(movieContentCard);
  setMovieLinks();
}
moviesRenderFn();

function createNewMovieCard(data, wrapper) {
  let a = document.createElement("a");
  a.setAttribute("data-movie-name", `${data.name}`);
  a.classList.add("movie-link");
  a.href = `#${data.name}`;
  a.innerHTML = `<div class="movie" data-id=${data.name}>
                    <div class="movie-img-wrapper" style="background-image:url(${data.imgUrl})"></div>
                    <h4>${data.name}</h4>
               </div>`;
  wrapper.appendChild(a);
}
function setMovieLinks() {
  let movieLinks = document.querySelectorAll(".movie-link");
  movieLinks.forEach((movieLink) => {
    movieLink.addEventListener("click", (e) => {
      renderAvailableSeats(movieLink.getAttribute("data-movie-name"));
    });
  });
}

async function renderAvailableSeats(movieName) {
  bookerContentHolder.innerHTML = `<div id='loader'></div>`;
  ticketBookingBtn.classList.add("v-none");
  let data = await fetchMovieAvailability(movieName);
  renderSeatsToFillData(data);
  setEventsToSelectedSeats();
}

function renderSeatsToFillData(data) {
  if (booker.firstElementChild.tagName !== "H3") {
    seatsSelected = [];
    booker.innerHTML = `<h3 class="v-none">Seat Selector</h3>
                              <div id="booker-grid-holder"></div>
                              <button id="book-ticket-btn" class="v-none">Book my seats</button>`;
  }
  bookerContentHolder = document.getElementById("booker-grid-holder");
  ticketBookingBtn = document.getElementById("book-ticket-btn");
  bookerContentHolder.innerHTML = "";
  booker.firstElementChild.classList.remove("v-none");
  createSeatsGridData(data);
}
function createSeatsGridData(data) {
  let bookingGridFirst = document.createElement("div");
  let bookingGridSecond = document.createElement("div");
  bookingGridSecond.classList.add("booking-grid");
  bookingGridFirst.classList.add("booking-grid");
  for (let i = 1; i < 25; i++) {
    let seat = document.createElement("div");
    seat.innerHTML = i;
    seat.setAttribute("id", `booking-grid-${i}`);
    if (data.includes(i)) seat.classList.add("seat", "unavailable-seat");
    else seat.classList.add("seat", "available-seat");
    if (i > 12) bookingGridSecond.appendChild(seat);
    else bookingGridFirst.appendChild(seat);
  }
  bookerContentHolder.appendChild(bookingGridFirst);
  bookerContentHolder.appendChild(bookingGridSecond);
  setTicketBooking();
}

let seatsSelected = [];
function setEventsToSelectedSeats() {
  let AvaliableSeats = document.querySelectorAll(".available-seat");
  AvaliableSeats.forEach((seat) => {
    seat.addEventListener("click", (_) => {
      saveSelectedSeat(seat);
    });
  });
}

function saveSelectedSeat(seat) {
  if (!seat.classList.contains("select-seat")) {
    seat.classList.add("select-seat");
    seatsSelected.push(seat.innerText);
    ticketBookingBtn.classList.remove("v-none");
  } else {
    seat.classList.remove("select-seat");
    seatsSelected = seatsSelected.filter((item) => seat.innerText !== item);
    if (seatsSelected.length == 0) {
      ticketBookingBtn.classList.add("v-none");
    }
  }
}
function setTicketBooking() {
  ticketBookingBtn.addEventListener("click", () => {
    if (seatsSelected.length > 0) {
      booker.innerHTML = "";
      confirmedTicket();
    }
  });
}

function confirmedTicket() {
  let confirmSeatTicket = document.createElement("div");
  confirmSeatTicket.setAttribute("id", "confirm-purchase");
  let h3 = document.createElement("h3");
  h3.innerText = `Confirm your booking for seat numbers:${seatsSelected.join(
    ","
  )}`;
  confirmSeatTicket.appendChild(h3);
  confirmSeatTicket.appendChild(createForm());
  booker.appendChild(confirmSeatTicket);
  success();
}

function createForm() {
  let form = document.createElement("form");
  let formElements = `<input type="email" id="email" placeholder="email" required><br><br>
                         <input type="tel" id="phone" placeholder="phone" required><br><br>
                         <button id="submitBtn" type="submit">Purchase</button>`;
  form.setAttribute("method", "post");
  form.setAttribute("id", "customer-detail-form");
  form.innerHTML = formElements;
  return form;
}
function success() {
  let submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", (e) => {
    let form = document.getElementById("customer-detail-form");
    if (form.checkValidity()) {
      e.preventDefault();
      let email = document.getElementById("email").value;
      let phone = document.getElementById("phone").value;
      renderSuccessMessage(email, phone);
    }
  });
}

function renderSuccessMessage(email, phone) {
  booker.innerHTML = "";
  createSuccessMessage(email, phone);
}

function createSuccessMessage(email, phone) {
  let successElement = document.createElement("div");
  successElement.setAttribute("id", "success");
  successElement.innerHTML = `<h3>Booking details</h3>
                               <p>Seats: ${seatsSelected.join(", ")}</p>
                              <p>Email: ${email}</p>
                              <p>Phone number: ${phone}</p>`;
  booker.appendChild(successElement);
}