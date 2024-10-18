
import { useEffect } from 'react';
import $ from 'jquery';
window.$ = $;
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  useEffect(() => {
    const state = {};
    const elements = {
      searchForm: document.getElementById('form-search'),
      searchInput: document.getElementById('txt-keyword'),
      movieListHeader: document.getElementById('movie-list-header'),
      movieList: document.getElementById('movie-list'),
      movieListContainer: document.getElementById('movie-list-container'),
      movieDetails: document.getElementById('movie-details'),
      movieDetailsContainer: document.getElementById('movie-details-container'),
      movieDetailsClose: document.getElementById('movie-details-close'),
    };

    elements.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const keyword = elements.searchInput.value;

      if (keyword) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=ace3f12c7c03dadc26b9ffb14e4552b3&page=1&query=${keyword}`);
        state.search = await response.json();

        console.log(state);

        elements.searchInput.value = '';
        elements.movieList.innerHTML = '';

        const loader = `<div class="nb-spinner"></div>`;
        elements.movieListContainer.insertAdjacentHTML('beforebegin', loader);
        state.search.results.forEach((movie) => {
          const html = `
                  <li class="mb-3">
                      <a class="w-full d-block" href="#${movie.id}">
                          <img class="w-full" src="https://image.tmdb.org/t/p/w92/${movie.poster_path}" onerror="this.src='https://via.placeholder.com/92x138';" alt="${movie.title}">
                          <span class="btn btn-primary d-block mt-2">Go Detail</span>
                      </a>
                  </li>
              `;

          elements.movieListHeader.innerHTML = `"${keyword}" ${state.search.total_results} results found.`;
          elements.movieListContainer.classList.remove('d-none');
          elements.movieListContainer.classList.add('d-block');
          elements.movieList.insertAdjacentHTML('beforeend', html);
        });
        setTimeout(() => {
          const loader = elements.movieListContainer.previousSibling;
          if (loader) { loader.parentNode.removeChild(loader); }
        }, 1000);
      } else {
        alert('Please enter keyword!');
      }
    });

    window.addEventListener('hashchange', async () => {
      const id = window.location.hash.replace('#', '');
      if (id) {
        let response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=ace3f12c7c03dadc26b9ffb14e4552b3`);
        state.movie = await response.json();

        const loader = `<div class="nb-spinner"></div>`;
        elements.movieDetailsContainer.insertAdjacentHTML('beforebegin', loader);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        let html = '<div class="row">';
        let genres = "";
        state.movie.genres.forEach((genre) => {
          genres += `<span class="badge bg-primary" style="margin-right: 5px">${genre.name}</span>`;
        });
        html += `
            <div class="col-md-2">
                <img style="height: fit-content;" src="https://image.tmdb.org/t/p/w500/${state.movie.poster_path}" onerror="this.src='https://via.placeholder.com/92x138';" class="mr-3 w-100" alt="${state.movie.title}">
            </div>
            <div class="col-10">
                <div>
                    <h5>${state.movie.original_title} <small class="badge bg-primary">${state.movie.vote_average}</small></h5>
                    <p>${state.movie.overview}</p>
                    ${genres}
                </div>
            </div>   
        `;

        html += '</div>';

        elements.movieDetailsContainer.classList.remove('d-none');
        elements.movieDetailsContainer.classList.add('d-block');
        elements.movieDetails.innerHTML = html;
        setTimeout(() => {
          const loader = elements.movieDetailsContainer.previousSibling;
          if (loader) { loader.parentNode.removeChild(loader); }
        }, 1000);
      }
    });

    elements.movieDetailsClose.addEventListener('click', () => {
      elements.movieDetailsContainer.classList.remove('d-block');
      elements.movieDetailsContainer.classList.add('d-none');
    });
  });

  return (
    <>
      <nav className="navbar navbar-dark bg-primary mb-3">
        <div className="container justify-content-center">
          <a href="#" className="navbar-brand">Movie Finder</a>
        </div>
      </nav>

      <div className="container">
        <div className="card mb-3">
          <div className="card-body">
            <form id="form-search">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Searh your favorite movie!" name="keyword" id="txt-keyword" />
                <div className="input-group-append">
                  <input type="submit" value="FIND IT!" className="btn btn-primary" id="btn-submit" />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div id="movie-details-container" className="card mt-3 d-none">
          <div className="card-header bg-warning d-flex justify-content-between">
            <h3>Movie Detail</h3>
            <button id="movie-details-close" className="btn btn-danger">X</button>
          </div>
          <div className="card-body bg-warning">
            <div id="movie-details"></div>
          </div>
        </div>

        <div id="movie-list-container" className="card mt-3 d-none">
          <div className="card-header">
            <span id="movie-list-header"></span>
          </div>
          <div className="card-body">

            <ul className="list-unstyled" id="movie-list">

            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
