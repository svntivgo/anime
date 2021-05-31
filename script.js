window.onload = () => {
// a
    let container = document.getElementById('container')
    let button = document.getElementById('button')
    let modalButton = document.getElementById('modalButton')
    let search = document.getElementById('search')
    let modalBackground = document.getElementById('modalBackground')
    let modal = document.getElementById('modal')
    let card = document.getElementsByClassName('card')

    let animeArray = {};

    async function getAnimeInfo(anime) {
        try {
            let response = await fetch(`https://api.jikan.moe/v3/search/anime?q=${anime}`)
            response = await response.json()
            return response
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getAnimeMoreInfo(id) {
        try {
            let responseModal = await fetch(`https://api.jikan.moe/v3/anime/${id}/episodes/1`)
            responseModal = responseModal.json()
            return responseModal
        } catch (error) {
            console.log(error.message);
        }
    }

    function buttonListener() {
        button.addEventListener('click', () => {
            getAnimeInfo(search.value)
                .then((response) => {
                    animeArray = response.results
                    localStorage.setItem("fecthed", `${JSON.stringify(`${animeArray}`)}`)
                    drawCard(animeArray)
                })
        })
    }
    buttonListener()

    function drawCard() {
        container.innerHTML = ("")
        for (let i = 0; i < animeArray.length; i++) {
            let newCard = document.createElement('div')
            let image = animeArray[i].image_url
            let title = animeArray[i].title
            let synopsis = animeArray[i].synopsis

            image = animeArray[i].image_url
            title = animeArray[i].title
            synopsis = animeArray[i].synopsis

            newCard.setAttribute("class", "card")
            newCard.setAttribute("id", `"card${i}"`)
            newCard.innerHTML = (`
                                <div class="synopsisContainer">
                                <p class="synopsis">${synopsis}</p>
                                </div>
                                <img src="${image}" alt="" class="cardImage">
                                <p class="title">${title}</p>
            `)

            container.appendChild(newCard)
        }
        cardHover(card)
        cardListener(animeArray)
    }

    function cardHover() {
        let synopsis = document.getElementsByClassName('synopsisContainer')
        for (let i = 0; i < card.length; i++) {
            card[i].addEventListener("mouseenter", () => {
                synopsis[i].style.display = "block"
                card[i].style.background = "darkorchid"
            })
            card[i].addEventListener("mouseleave", () => {
                synopsis[i].style.display = "none"
                card[i].style.background = ""
            })
        }
    }

    // // Modal card expanded info
    function cardListener(animeArray) {
        for (let i = 0; i < animeArray.length; i++) {
            document.getElementById(`"card${i}"`).addEventListener("click", () => {
                modalBackground.style.display = "block"
                let id = animeArray[i].mal_id
                let newCard = document.createElement('div')
                let image = animeArray[i].image_url
                let title = animeArray[i].title
                let synopsis = animeArray[i].synopsis
                newCard.setAttribute("class", "modalCard")
                newCard.setAttribute("id", `"modalCard${i}"`)
                newCard.innerHTML = (`
                                    <img src="${image}" alt="" class="cardImage">
                                    <p class="title">${title}</p>
                                    <div class="modalSynopsisContainer">
                                    <p class="synopsis">${synopsis}</p>
                                    </div>
                                `)

                modal.appendChild(newCard)

                getAnimeMoreInfo(id).then(
                    (responseModal) => {
                        
                            
                            let newUrl = document.createElement('div')
                            newUrl.setAttribute("class", "modalUrl")
                            for (let x = 0; x < responseModal.episodes.length; x++) {
                                let urlEpisodio = responseModal.episodes[x].video_url
                                let newUrl = document.createElement('div')
                                
                                newUrl.setAttribute("class", "modalUrl")
                            
                            if (urlEpisodio == null) {
                                newUrl.innerHTML = (`
                                    <a>El episodio ${x+1} no está disponible :(</a>
                                `)
                                modal.appendChild(newUrl)
                            } else {
                                newUrl.innerHTML = (`
                                <a href="${urlEpisodio}" target="_blank" rel="noopener noreferrer">Ep. ${x+1}</a>
                                `)
                                modal.appendChild(newUrl)
                            }
                        }
                    })
            })
        }

        modalButton.addEventListener("click", () => {
            modalBackground.style.display = "none"
            modal.innerHTML = ""
        })
    }
}