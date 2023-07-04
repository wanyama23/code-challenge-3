const movies_node = document.querySelector("#films")

let loadedMovie = {}

function Fetch_all_movies() {
    fetch("http://localhost:3000/films")
        .then(Response => Response.json())
        .then(movies => {
            display_all_movies(movies)
        })
}

function updateMovieTickets(movie) {
    return fetch(`http://localhost:3000/films/${movie.id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "Application/json"
        },
        body: JSON.stringify(movie)
    })
        .then(Response => Response.json())
        .then(movie => movie)
        
}

Fetch_all_movies();

function display_all_movies(movies){
movies.forEach(movie => {
    const li=document.createElement("li")
    li.textContent=movie.title
    li.id=movie.id
    li.addEventListener("click", display_one_movie_details)
    movies_node.appendChild(li)
});
}


function display_one_movie_details(e){
    const id=e.target.id
    fetchmovieById(id)
   }

   function fetchmovieById(id){
    fetch(`http://localhost:3000/films/${id}`)
    .then(Response => Response.json())
    .then(movie => {
        display_one_movie(movie)
    })
}

  function display_one_movie(movie){
    loadedMovie = movie

    const animalDetailsElement=document.querySelector("#movie-details")
    const title=animalDetailsElement.querySelector("#title")
    const image=animalDetailsElement.querySelector("#image")
    const descr=animalDetailsElement.querySelector("#descr")
    
    //id.textContent=data.title
    title.textContent=movie.title 
    image.src=movie.poster 
    descr.textContent=movie.description
    display_available_movies(movie)
    }

    function display_available_movies(movie){
        const movieDetailsElement=document.querySelector("#tickets")
        const Run_time=movieDetailsElement.querySelector("#Run_time span")
        const Show_time=movieDetailsElement.querySelector("#Show_time span")
        const Available_tickets=movieDetailsElement.querySelector("#Available_tickets")

        const  Buy_tickets=movieDetailsElement.querySelector("#Buy_tickets")
        const Remove=movieDetailsElement.querySelector("#Remove")

        const IsSoldout = already_sold_tickets(movie)
        if(IsSoldout){
            Buy_tickets.textContent="Sold out"
            Buy_tickets.disabled=true
        }else {
            Buy_tickets.textContent="Buy ticket"
            Buy_tickets.disabled=false
        }

        Buy_tickets.addEventListener("click", handleBuyTicket)
        //id.textContent=data.title
        Run_time.textContent=movie.runtime 
        Show_time.textContent=movie.showtime 
        //Available_tickets.textContent=movie.title 
        Available_tickets.textContent=movie.capacity-movie.tickets_sold

    
        }



function already_sold_tickets(movie){
return movie.capacity===movie.tickets_sold

}

async function handleBuyTicket(e) {
    e.preventDefault()
    loadedMovie.tickets_sold += 1
    const updatedMovie = await updateMovieTickets(loadedMovie)
    display_available_movies(updatedMovie)
}