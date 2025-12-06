// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyAkPqrjrXqtdDxxBhLgRXjRfPciw7XtAj4",
  authDomain: "novely-4421d.firebaseapp.com",
  projectId: "novely-4421d",
  storageBucket: "novely-4421d.appspot.com",
  messagingSenderId: "597056434307",
  appId: "1:597056434307:web:xxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== PASSWORD =====
const PASSWORD = "dhogo";

// ===== UPLOAD MOVIE =====
const uploadMovieBtn = document.getElementById("uploadMovieBtn");
uploadMovieBtn.addEventListener("click", () => {
  const pw = prompt("Enter password to upload movies:");
  if (pw === PASSWORD) {
    const title = prompt("Enter movie title:");
    const file = prompt("Enter movie Uploadcare URL:"); // You can integrate Uploadcare widget here
    const thumb = prompt("Enter thumbnail URL:");

    if (title && file && thumb) {
      db.collection("movies").add({
        title: title,
        file: file,
        thumbnail: thumb,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        alert("Movie uploaded successfully!");
        loadMovies(); // refresh movie list
      }).catch(err => alert(err));
    }
  } else {
    alert("Incorrect password!");
  }
});

// ===== UPLOAD AD IMAGE =====
const uploadAdBtn = document.getElementById("uploadAdBtn");
uploadAdBtn.addEventListener("click", () => {
  const pw = prompt("Enter password to upload ad image:");
  if (pw === PASSWORD) {
    const adUrl = prompt("Enter ad image URL:");
    if (adUrl) {
      db.collection("ads").add({
        url: adUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        alert("Ad uploaded!");
        loadAds();
      }).catch(err => alert(err));
    }
  } else {
    alert("Incorrect password!");
  }
});

// ===== DISPLAY ADS =====
let adImages = [];
let adIndex = 0;

function loadAds() {
  db.collection("ads").orderBy("createdAt", "desc").get().then(snapshot => {
    adImages = snapshot.docs.map(doc => doc.data().url);
    if (adImages.length > 0) {
      showAd();
    }
  });
}

function showAd() {
  const adImg = document.getElementById("adImage");
  adImg.src = adImages[adIndex];
  adIndex = (adIndex + 1) % adImages.length;
  setTimeout(showAd, 5000); // rotate every 5 seconds
}

// ===== DISPLAY MOVIES =====
const moviesContainer = document.getElementById("moviesContainer");

function loadMovies(searchTerm = "") {
  moviesContainer.innerHTML = "";
  db.collection("movies").orderBy("createdAt", "desc").get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
          <img src="${data.thumbnail}" alt="${data.title}">
          <div class="movie-info">
            <h3>${data.title}</h3>
            <button class="download-btn" onclick="downloadMovie('${data.file}')">Download</button>
          </div>
        `;
        moviesContainer.appendChild(card);
      }
    });
  });
}

// ===== DOWNLOAD FUNCTION =====
function downloadMovie(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.click();
}

// ===== SEARCH FUNCTIONALITY =====
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", () => {
  loadMovies(searchBox.value);
});

// ===== INITIAL LOAD =====
window.onload = function() {
  loadAds();
  loadMovies();
};