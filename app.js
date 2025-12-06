const firebaseConfig = {
  apiKey: "AIzaSyAkPqrjrXqtdDxxBhLgRXjRfPciw7XtAj4",
  authDomain: "novely-4421d.firebaseapp.com",
  projectId: "novely-4421d",
  storageBucket: "novely-4421d.appspot.com",
  messagingSenderId: "597056434307",
  appId: "1:597056434307:web:xxxxxx"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const PASSWORD = "dhogo";

const uploadMovieBtn = document.getElementById("uploadMovieBtn");
const movieFileInput = document.getElementById("movieFileInput");

uploadMovieBtn.addEventListener("click", () => {
  const pw = prompt("Enter password to upload movies:");
  if (pw === PASSWORD) movieFileInput.click();
  else alert("Incorrect password!");
});

movieFileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const title = prompt("Enter movie title:");
  if (!title) return;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://upload.uploadcare.com/base/', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Uploadcare.Simple f77e2afd69e72fdae840:' 
      }
    });
    const result = await response.json();
    const fileUrl = `https://ucarecdn.com/${result.file}/`;
    const thumbUrl = prompt("Enter thumbnail URL for this movie:");

    db.collection("movies").add({
      title: title,
      file: fileUrl,
      thumbnail: thumbUrl || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert("Movie uploaded successfully!");
      loadMovies();
    }).catch(err => alert(err));

  } catch (err) {
    alert("Upload failed: " + err.message);
  }
});

// ===== AD IMAGES =====
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
  } else alert("Incorrect password!");
});

let adImages = [], adIndex = 0;
function loadAds() {
  db.collection("ads").orderBy("createdAt", "desc").get().then(snapshot => {
    adImages = snapshot.docs.map(doc => doc.data().url);
    if (adImages.length > 0) showAd();
  });
}

function showAd() {
  const adImg = document.getElementById("adImage");
  adImg.src = adImages[adIndex];
  adIndex = (adIndex + 1) % adImages.length;
  setTimeout(showAd, 5000);
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

function downloadMovie(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.click();
}

document.getElementById("searchBox").addEventListener("input", e => {
  loadMovies(e.target.value);
});

window.onload = function() {
  loadAds();
  loadMovies();
};