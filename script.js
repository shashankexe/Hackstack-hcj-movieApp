const apiKey = "842c6b24cc9ca77b33e2e07f57ccabdd";
const URL ="https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=842c6b24cc9ca77b33e2e07f57ccabdd&page=1";
const imgURL = "https://image.tmdb.org/t/p/w1280";
const searchURL ="https://api.themoviedb.org/3/search/movie?&api_key=842c6b24cc9ca77b33e2e07f57ccabdd&query=";
const form = document.getElementById("search-form");
const query = document.getElementById("query");
const root = document.getElementById("root");

let movies = [],
  page = 1,
  inSearchPage = false;

async function fetchData(URL) {
  try {
    const data = await fetch(URL).then((res) => res.json());
    return data;
  } catch (error) {
    return null;
  }
}

const fetchAndDisplay = async (URL) => {
  const data = await fetchData(URL);
  data && showResults(data.results);
};

const getSpecificPage = (page) => {
  const URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
  fetchAndDisplay(URL);
};

const displayCard = (movie) =>
  `<div class="col">
          <div class="card">
            <a class="card-media" >
              <img src="${movie.poster_path}" alt="Image not available" width="100%" />
            </a>

            <div class="card-content">
              <div class="card-cont-header">
                <div class="cont-left">
                  <h3 style="font-weight: 600">${movie.original_title}</h3>
                </div>
                <div class="cont-right">
                  <a href="${movie.poster_path}" target="_blank" class="btn">More</a>
                </div>
              </div>

              <div class="describe">
                ${movie.overview}
              </div>
            </div>
          </div>
        </div>`;

const showResults = (items) => {
  let content = !inSearchPage ? root.innerHTML : "";
  if (items && items.length > 0) {
    items.map((item) => {
      let { poster_path, original_title,overview } = item;

      if (poster_path) {
        poster_path = imgURL + poster_path;
      }

      if (original_title.length > 15) {
        original_title = original_title.slice(0, 15) + "...";
      }

      if (!overview) {
        overview = "No overview yet...";
      }

      const movieItem = {
        poster_path,
        original_title,
        overview,
      };

      content += displayCard(movieItem);
    });
  } else {
    content += "<p>Something went wrong!</p>";
  }

  root.innerHTML = content;
};

const loadMore = () => {
  getSpecificPage(++page);
};

const loadMoreAfterEnd = (e) => {
  let elem = document.documentElement;
  if (!inSearchPage && elem.scrollTop + elem.clientHeight == elem.scrollHeight) {
    loadMore();
  }
};

form.addEventListener("submit", async (e) => {
  inSearchPage = true;
  e.preventDefault();
  const searchTerm = query.value;
  searchTerm && fetchAndDisplay(searchURL + searchTerm);
  query.value = "";
});

window.addEventListener("scroll", loadMoreAfterEnd);

function init() {
  inSearchPage = false;
  fetchAndDisplay(URL);
}

init();
