const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.querySelector("body").classList.add("loaded");
    }, 500)
});

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");
navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

const cont = document.getElementById('contributor');
const owner = 'Rakesh9100';
const repoName = 'CalcDiverse';

async function fetchContributors(pageNumber) {
    const perPage = 100;
    const url = `https://api.github.com/repos/${owner}/${repoName}/contributors?page=${pageNumber}&per_page=${perPage}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch contributors data. Status code: ${response.status}`);
    }

    const contributorsData = await response.json();
    return contributorsData;
}

// Function to fetch all contributors
async function fetchAllContributors() {
    let allContributors = [];
    let pageNumber = 1;

    try {
        while (true) {
            const contributorsData = await fetchContributors(pageNumber);
            if (contributorsData.length === 0) {
                break;
            }
            allContributors = allContributors.concat(contributorsData);
            pageNumber++;
        }
        allContributors.forEach((contributor) => {
            const contributorCard = document.createElement('div');
            contributorCard.classList.add('contributor-card');

            const avatarImg = document.createElement('img');
            avatarImg.src = contributor.avatar_url;
            avatarImg.alt = `${contributor.login}'s Picture`;

            const loginLink = document.createElement('a');
            loginLink.href = contributor.html_url;
            loginLink.appendChild(avatarImg);

            contributorCard.appendChild(loginLink);

            cont.appendChild(contributorCard);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchAllContributors();

let calcScrollValue = () => {
    let scrollProg = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;
    let calcHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    if (pos > 100) {
        scrollProg.style.display = "grid";
    } else {
        scrollProg.style.display = "none";
    }
    scrollProg.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });
    scrollProg.style.background = `conic-gradient(#0063ba ${scrollValue}%, #d499de ${scrollValue}%)`;
};

window.addEventListener('scroll', function () {
    var scrollToTopButton = document.getElementById('progress');
    if (window.pageYOffset > 200) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;
const input = document.getElementById('calculatorSearch');
let calculators = document.querySelectorAll('.container .box');
let h2TextContents = [];

calculators.forEach(calculator => {
    let h2Element = calculator.querySelector('h2');
    if (h2Element) {
        h2TextContents.push(h2Element.textContent);
    }
});

let search_input_container = document.querySelector('.search-input-container'),
    calculatorSearch = document.getElementById('calculatorSearch')
input.addEventListener('input', (e) => {
    let search_input_container = document.querySelector('.search-input-container')
    let result = document.getElementById('searchResults_Container') ? document.getElementById('searchResults_Container') : false
    if (result) {
        search_input_container.removeChild(result)
    }
    let searchResults_Container = document.createElement('div')
    let div = document.createElement('div')
    searchResults_Container.setAttribute('id', 'searchResults_Container')
    let filtered = h2TextContents.filter(ele => {
        const searchTerm = e.target.value.toLowerCase();
        const elementText = ele.toLowerCase();
        return elementText.includes(searchTerm);
    });
    if (filtered && e.target.value.length > 0) {
        filtered.map((item, index) => {
            let p = document.createElement('p')
            p.textContent = item
            p.setAttribute('key', index)
            div.appendChild(p)
            p.addEventListener('click', () => {
                calculatorSearch.value = item
                searchResults_Container.removeChild(div)
            })
        })
        searchResults_Container.appendChild(div)
        search_input_container.appendChild(searchResults_Container)
    }
    if (e.target.value.length === 0) {
        searchResults_Container.removeChild(div)
    }
})

// Function to filter calculators
function filterCalculators() {
    var input, filter, calculators, i;
    input = document.getElementById('calculatorSearch');
    filter = input.value.toUpperCase();
    calculators = document.querySelectorAll('.container .box');
    var noResults = document.getElementById('noResults');
    var hasResults = false;
    for (i = 0; i < calculators.length; i++) {
        var calculator = calculators[i];
        var h2 = calculator.querySelector('h2');
        var h3 = calculator.querySelector('h3');
        var calculatorName = h2.textContent || h2.innerText;
        var calculatorDescription = h3.textContent || h3.innerText;

        if ((calculatorName.toUpperCase().indexOf(filter) > -1) || (calculatorDescription.toUpperCase().indexOf(filter) > -1)) {
            calculator.style.display = "flex";
            hasResults = true;
        } else {
            calculator.style.display = "none";
        }
    }

    if (hasResults) {
        noResults.style.display = 'none';
    } else {
        noResults.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('noResults').style.display = 'none';
});

// Voice command in search bar feature
const searchBar = document.querySelector("#searchBar");
const searchBarInput = searchBar.querySelector("input");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if (SpeechRecognition) {
    console.log("Your Browser supports speech Recognition");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    // recognition.lang = "en-US";

    searchBar.insertAdjacentHTML("beforeend", '<button type="button"><i class="fas fa-microphone"></i></button>');
    // searchBarInput.style.paddingRight = "50px";

    const micBtn = searchBar.querySelector("button");
    const micIcon = micBtn.firstElementChild;

    micBtn.addEventListener("click", micBtnClick);

    function micBtnClick() {
        if (micIcon.classList.contains("fa-microphone")) { // Start Voice Recognition
            recognition.start(); // First time you have to allow access to mic!
        } else {
            recognition.stop();
        }
    }

    recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
    function startSpeechRecognition() {
        micIcon.classList.remove("fa-microphone");
        micIcon.classList.add("fa-microphone-slash");
        searchFormInput.focus();
        console.log("Voice activated, SPEAK");
    }

    recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
    function endSpeechRecognition() {
        micIcon.classList.remove("fa-microphone-slash");
        micIcon.classList.add("fa-microphone");
        searchBarInput.focus();
        console.log("Speech recognition service disconnected");
    }

    recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
    function resultOfSpeechRecognition(event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        newtranscript = transcript.endsWith('.') ? transcript.slice(0, -1) : transcript;
        console.log(newtranscript)
        searchBarInput.value = newtranscript;
        filterCalculators();
    }
} else {
    console.log("Your Browser does not support speech Recognition");
    info.textContent = "Your Browser does not support Speech Recognition";
}
 //Custom Cursor

 const coords = { x: 0, y: 0 };
 const circles = document.querySelectorAll(".circle");

 const colors = [
   "#800080",
   "#800080",
   "#800080",
   "#6A006A",
   "#6A006A",
   "#6A006A",
   "#550055",
   "#550055",
   "#550055",
   "#400040",
   "#400040",
   "#2B002B",
   "#2B002B",
   "#150015",
   "#150015",
   "#000000",
   "#000000",
   "#000000" ,
   "#000000"
 ];

 circles.forEach(function (circle, index) {
   circle.x = 0;
   circle.y = 0;
   circle.style.backgroundColor = colors[index % colors.length];
 });

 window.addEventListener("mousemove", function (e) {
   coords.x = e.clientX;
   coords.y = e.clientY;

 });

 function animateCircles() {

   let x = coords.x;
   let y = coords.y;

   circles.forEach(function (circle, index) {
     circle.style.left = x - 12 + "px";
     circle.style.top = y - 12 + "px";

     circle.style.scale = (circles.length - index) / circles.length;

     circle.x = x;
     circle.y = y;

     const nextCircle = circles[index + 1] || circles[0];
     x += (nextCircle.x - x) * 0.3;
     y += (nextCircle.y - y) * 0.3;
   });

   requestAnimationFrame(animateCircles);
 }

 animateCircles();


 // Function to toggle dark mode
 function toggleDarkMode() {
   const isDarkMode = isDarkModePreferred();
   setDarkModePreference(!isDarkMode);
   applyDarkModePreference();
 }

 // Function to apply dark mode preference
 function applyDarkModePreference() {
   const isDarkMode = isDarkModePreferred();
   if (isDarkMode) {
     document.body.classList.add('dark-mode');
     document.getElementById('theme-icon').src = 'assets/images/icons8-sun.svg';
   } else {
     document.body.classList.remove('dark-mode');
     document.getElementById('theme-icon').src = 'assets/images/moon_solid.svg';
   }
 }

 // Function to set dark mode preference
 document.addEventListener('DOMContentLoaded', () => {
   const currentTheme = localStorage.getItem('theme');
   const switchCheckbox = document.getElementById('switch'); // Define switchCheckbox here
   const starRating = document.querySelector('.star_rating');
   const thankYouMessage = document.querySelector(".thank_you_message");
   if (switchCheckbox) { // Check if switchCheckbox is not null
     function applyDarkModeStyles() {
       document.body.classList.remove('light-mode');
       document.body.classList.add('dark-mode');
       starRating.style.backgroundColor = '#2d2828';
       thankYouMessage.style.backgroundColor = '#2d2828';
     }

     function applyLightModeStyles() {
       document.body.classList.remove('dark-mode');
       document.body.classList.add('light-mode');
       starRating.style.backgroundColor = 'white';
       thankYouMessage.style.backgroundColor = 'white';
     }

     if (currentTheme) {
       if (currentTheme === 'dark-mode') {
         applyDarkModeStyles();
         switchCheckbox.checked = true;
       } else {
         applyLightModeStyles();
       }
     }

     switchCheckbox.addEventListener('change', () => {
       if (switchCheckbox.checked) {
         applyDarkModeStyles();
         localStorage.setItem('theme', 'dark-mode');
       } else {
         applyLightModeStyles();
         localStorage.setItem('theme', 'light-mode');
       }
     });
   } else {
     console.error("Switch checkbox not found!"); // Log an error if switchCheckbox is null
   }
 });