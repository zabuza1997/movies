const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');
const tagsEl = document.getElementById('tags');
//Pagination buttons
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

const API_KEY = 'api_key=897c383710074e59d9aaabca38664372'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const SEARCH_URL = `${BASE_URL}/search/movie?&${API_KEY}`
const SORT_URL = `https: //api.themoviedb.org/3/discover/movie?with_genres=28,12&sort_by=popularity.desc&api_key=897c383710074e59d9aaabca38664372`

getMovies(API_URL);
///get genres from API
function getGenres(url) {
    fetch(url).then(res => res.json()).then(data => {
        const genres = data.genres;
        genres.forEach(genre => {
            displayGenreTags(genre);
        });

    })
}
// const categoryBtns = categories
//     .map(function (category) {
//         return `<button type="button" class="filter-btn" data-id=${category}>
//           ${category}
//         </button>`;
//     })
//     .join("");

//Display genre tags
function displayGenreTags(genre) {
    const tagElement = document.createElement('div');
    tagElement.classList.add('tag');
    tagElement.textContent = genre.name;
    tagElement.id = genre.id;
    tags.appendChild(tagElement);
    tagElement.addEventListener('click', e => {
        highlightSelected(e.target);
    });

}

//highlight selected genres
const selectedTags = new Set();

function highlightSelected(tag) {

    if (!tag.classList.contains('highlight')) {
        tag.classList.add('highlight');
        selectedTags.add(tag.id);

    } else {
        tag.classList.remove('highlight');
        selectedTags.delete(tag.id);
    }
    console.log(selectedTags.size);

    if (selectedTags.size > 0) {
        clearBtn();
        getMovies(`https://api.themoviedb.org/3/discover/movie?with_genres=${[...selectedTags].join(',')}&sort_by=popularity.desc&api_key=897c383710074e59d9aaabca38664372`)
    } else {
        getMovies(API_URL);
    }

}

getGenres('https://api.themoviedb.org/3/genre/movie/list?api_key=897c383710074e59d9aaabca38664372&language=en-US')


//Clear btn
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight')
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedTags.clear();
            const highlightedTags = document.querySelectorAll('.highlight');
            highlightedTags.forEach(tag => {
                tag.classList.remove('highlight')
            });
            tags.removeChild(clear)
            getMovies(API_URL);
        })
        tags.append(clear);
    }

}

//Get movies function
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        // showMovies(data.results);
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            } else if (currentPage >= totalPages) {
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({
                behavior: 'smooth'
            })

        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }
    })
}


//show rating color 
function getColor(rating) {
    if (rating >= 8) {
        return 'green';
    } else if (rating < 8 && rating >= 7) {
        return 'orange';
    } else {
        return 'red';
    }
}
//Show movies function
function showMovies(data) {
    main.innerHTML = '';
    data.forEach(movie => {
        const {
            title,
            id,
            vote_average,
            overview,
            poster_path
        } = movie;
        const movieElement = document.createElement("div");
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
         <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>
        `
        main.appendChild(movieElement);
        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
    })
}
//Search input
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    getMovies(`${SEARCH_URL}&query=${searchTerm}`)
})
const overlayContent = document.getElementById('overlay-content');

//Open when someone clicks on the span element
function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if (videoData) {
            document.getElementById("myNav").style.width = "100%";
            if (videoData.results.length > 0) {
                var embed = [];
                var dots = [];
                videoData.results.forEach((video, idx) => {
                    let {
                        name,
                        key,
                        site
                    } = video

                    if (site == 'YouTube') {

                        embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `)

                        dots.push(`
              <span class="dot">${idx + 1}</span>
            `)
                    }
                })

                var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

        <div class="dots">${dots.join('')}</div>
        
        `
                overlayContent.innerHTML = content;
                activeSlide = 0;
                showVideos();
            } else {
                overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }
        }
    })
}

// Close when someone clicks on the "x" symbol inside the overlay 
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');

    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, idx) => {
        if (activeSlide == idx) {
            embedTag.classList.add('show')
            embedTag.classList.remove('hide')

        } else {
            embedTag.classList.add('hide');
            embedTag.classList.remove('show')
        }
    })

    dots.forEach((dot, indx) => {
        // dot.addEventListener('click', (e) => {
        //     console.log(e.target.textContent);
        //     activeSlide = e.target.textContent;
        //     dot.classList.add('active');

        // })
        if (activeSlide == indx) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active')
        }
    })
}
const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
    if (activeSlide > 0) {
        activeSlide--;
    } else {
        activeSlide = totalVideos - 1;
    }

    showVideos()
})

rightArrow.addEventListener('click', () => {
    if (activeSlide < (totalVideos - 1)) {
        activeSlide++;
    } else {
        activeSlide = 0;
    }
    showVideos()
})

//Pagination function
prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})

next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' + page
        getMovies(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b
        getMovies(url);
    }
}