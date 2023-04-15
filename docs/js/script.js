const siteWrapper = document.getElementById('siteWrapper');

const cardsList = document.getElementById('cardsList');
const cardsListArray = cardsList.querySelectorAll('.card');

//checkTextSize
checkTextSize = cardEl => {
    const paragraph = cardEl.querySelector('.card-text');
    const textWrapper = paragraph.querySelector('span');
    const textSize = textWrapper.clientHeight;

    if ( textSize > 48 ) {
        cardEl.classList.add('need-more');
    } else {
        cardEl.classList.remove('need-more');
    }
    paragraph.dataset.textSize = textSize + 'px';
}


cardsListArray.forEach(cardEl => checkTextSize(cardEl));

//Toggle text
cardsList.addEventListener('click', event => {
    const btn = event.target.closest('.show-more');
    if ( !btn ) return false;

    const parentEl = btn.closest('.card-body');
    const textParagraph = parentEl.querySelector('.card-text');

    if ( !parentEl.classList.contains('less') ) {
        parentEl.classList.add('less');
        textParagraph.style.height = textParagraph.dataset.textSize;
    } else {
        parentEl.classList.remove('less');
        textParagraph.style.height = '';
    }
});


//Card
const cardTemplate = data => (`
    <div class="card">
        <div class="card-image">
            <img src="${data.download_url}" class="card-img-top" alt="${data.author}">
        </div>
        <div class="card-body">
            <h3 class="card-title h4">${data.author}</h3>
            <p class="card-text">
                <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</span>
            </p>
            <span class="show-more"></span>
        </div>
        <div class="card-footer d-flex">
            <a href="#" class="btn btn-primary">Save to collection</a>
            <a href="#" class="btn btn-secondary">Share</a>
        </div>
    </div>
`);

createCard = data => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(...['card-wrapper', 'col-12', 'col-md-6']);
    wrapper.innerHTML = cardTemplate(data);

    return wrapper;
};

//Infinite scroll
let page = 1;
let loadStart = false;

const loadMoreCards = async () => {
    await fetch(`https://picsum.photos/v2/list?page=${page}&limit=4`)
        .then(response => response.json())
        .then(list => {

            for ( const card of list ) {

                const html = createCard(card);

                cardsList.append(html);
                checkTextSize(html.querySelector('.card'));
            }

            loadStart = false;
            page += 1;
        });
};

const getPointOfLoad = callback => {
    const scroll = (window.pageYOffset || window.scrollTop) - (window.clientTop || 0) || 0;
    const height = window.innerHeight;
    let contentHeight = siteWrapper.clientHeight;

    if (contentHeight - (scroll + height) < contentHeight / 20 && !loadStart) {
        loadStart = true;
        callback();
    }
};
window.addEventListener('scroll', () => getPointOfLoad(loadMoreCards));


//Change theme
const themeLink = document.getElementById('theme');
const themeBtn = document.getElementById('themeChangeBtn');

const toggleTheme = () => {
    const currentTheme = themeLink.dataset.current
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    themeLink.setAttribute('href', `css/theme_${newTheme}.css`);
    themeLink.dataset.current = newTheme;
    document.body.className = newTheme;
};

themeBtn.addEventListener('click', toggleTheme);

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    themeLink.setAttribute('href', `css/theme_dark.css`);
    themeLink.dataset.current = 'dark';
    document.body.className = 'dark';
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    themeLink.setAttribute('href', `css/theme_${event.matches ? "dark" : "light"}.css`);
    themeLink.dataset.current = event.matches ? "dark" : "light";
    document.body.className = event.matches ? "dark" : "light";
});
