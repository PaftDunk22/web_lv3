fetch('movies.csv')
    .then(res => res.text())
    .then(csv => {
        const rezultat = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });

        const filmovi = rezultat.data.map(film => ({
            title: film.title,
            year: Number(film.year),
            genre: film.genre,
            duration: Number(film.duration),
            rating: Number(film.rating),
            directors: film.directors
        }));

        sviFilmovi = filmovi;

        prikaziTablicu(filmovi.slice(0, 50));
    })
    .catch(err => {
        console.error('Greška pri dohvaćanju CSV-a:', err);
    });

let sviFilmovi = [];
let kosarica = [];

function prikaziTablicu(filmovi) {
    const tbody = document.querySelector('#filmovi-tablica tbody');
    tbody.innerHTML = '';

    for (const film of filmovi) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.genre}</td>
            <td>${film.duration} min</td>
            <td>${film.rating}</td>
            <td>${film.directors}</td>
            <td><button class="dodaj-kosarica">Dodaj</button></td>
        `;

        row.querySelector('.dodaj-kosarica').addEventListener('click', () => dodajUKosaricu(film));
        tbody.appendChild(row);
    }
}

document.getElementById('filter-rating').addEventListener('input', e => {
    document.getElementById('rating-value').textContent = e.target.value;
});

document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);

function filtriraj() {
    const zanr = document.getElementById('filter-genre').value.trim().toLowerCase();
    const godinaOd = parseInt(document.getElementById('filter-year').value);
    const trajanje = parseInt(document.getElementById('duration').value);
    const ocjena = parseFloat(document.getElementById('filter-rating').value);

    const filtrirani = sviFilmovi.filter(film => {
        const matchZanr = !zanr || film.genre.toLowerCase().includes(zanr);
        const matchGodina = isNaN(godinaOd) || film.year >= godinaOd;
        const matchTrajanje = isNaN(trajanje) || film.duration <= trajanje;
        const matchOcjena = isNaN(ocjena) || film.rating >= ocjena;

        return matchZanr && matchGodina && matchTrajanje && matchOcjena;
    });

    prikaziTablicu(filtrirani);
}

function dodajUKosaricu(film) {
    if (!kosarica.includes(film)) {
        kosarica.push(film);
        osvjeziKosaricu();
    } else {
        alert("Film je već u košarici.");
    }
}

function ukloniIzKosarice(index) {
    kosarica.splice(index, 1);
    osvjeziKosaricu();
}

function osvjeziKosaricu() {
    const lista = document.getElementById('lista-kosarice');
    lista.innerHTML = '';

    kosarica.forEach((film, index) => {
        const li = document.createElement('li');
        li.textContent = `${film.title} (${film.year}) - ${film.genre}`;

        const btn = document.createElement('button');
        btn.textContent = 'Ukloni';
        btn.addEventListener('click', () => ukloniIzKosarice(index));

        li.appendChild(btn);
        lista.appendChild(li);
    });
}

document.getElementById('potvrdi-kosaricu').addEventListener('click', () => {
    if (kosarica.length === 0) {
        alert("Košarica je prazna!");
    } else {
        alert(`Uspješno ste dodali ${kosarica.length} filmova!`);
        kosarica = [];
        osvjeziKosaricu();
    }
});
