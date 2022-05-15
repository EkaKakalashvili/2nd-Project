function main() {
    addsearchedItems();

    document.getElementById('search-bar').addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById("submit").click();
    })
}
//original listed items
let searchedItems =["Internet Cats", "Meme's", "Typing", "Space", "Rick and Morty"];

function addsearchedItems() {
    document.getElementById("history").innerHTML='';
    searchedItems.forEach(searchedItems => {
        fieldText = document.createElement("button");
        fieldText.innerHTML = searchedItems;
        fieldText.value=searchedItems;
        document.getElementById("history").appendChild(fieldText).classList.add("btn", "btn-history");
    })
    // after new searched items are added, adding EventListener on them
    document.querySelectorAll(".btn").forEach( button => {
        button.addEventListener('click', findResult)
    })
}

async function findResult() {
    let x;
    let input = document.getElementById("searchingWord").value;

    if(this.classList.contains("btn-history")){
        x = {
            q: this.value,
            api_key: 'LZUsjE9N2zpPI5QnY6gIBJEFpZ2opbUa',
        };

        await DataService.retrieveGif(x);        
    }

    //SUBMIT
    if(this.classList.contains("btn-submit")){
        document.getElementById("searchingWord").value='';
        x = {
            q: input,
            api_key: 'LZUsjE9N2zpPI5QnY6gIBJEFpZ2opbUa',
        };  


        if(!searchedItems.includes(input)){  //update current list
            searchedItems.push(input);
            searchedItems.shift();
            addsearchedItems();
        } 
        
        //sending requst
        await DataService.retrieveGif(x);
    }
    

    //TRENDS 

     if(this.classList.contains("btn-trend")){
        x = {
            api_key: 'LZUsjE9N2zpPI5QnY6gIBJEFpZ2opbUa',
        };
        
        await DataService.retrieveGifTrends(x);
    }
}


class DataService {
    static async retrieveGif(x) {
      
            const response = await fetch("https://api.giphy.com/v1/gifs/search?" + new URLSearchParams(x));
            const gifs = await response.json();
            display(gifs.data);

    }
    static async retrieveGifTrends(x) {
            const response = await fetch("https://api.giphy.com/v1/gifs/trending?" + new URLSearchParams(x));
            const gifs = await response.json();
            display(gifs.data);
    }
}

function display(gifs){
    const gifRoot=document.querySelector('.output');
    const renderer = new RenderGifs(gifRoot);
    renderer.renderGifs(gifs);
}

class RenderGifs {
    constructor (root) {
        this.root = root;
    }

    renderGifs(gifs) {
        this.root.innerHTML='';
        if(gifs){
            for (let index = 0; index < gifs.length; index++) {
                this.root.innerHTML += this._gifToHTML(gifs[index]);            
            }
        }
    }

    _gifToHTML(gif){
        let gifhtml='';        
            gifhtml += 
            `
                <div class="gif">
                <img src="${gif.images.downsized.url}" alt="">
                <h4>${gif.title}</h4>
                </div>
            `;
       
        return `
        ${gifhtml}
        `;
    }

}

window.addEventListener('load',main);
