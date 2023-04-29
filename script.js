const imagesWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchBtn = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const closeBtn = lightBox.querySelector(".fa-xmark")
const downloadBtn = lightBox.querySelector(".fa-download")

const apiKey = "Ket81OmgRZd1ilOcSLqdlrS26kotPw60CzAI3DDZGOscSVUKj7ouRy0B";
const perPage = 15;
let currentPage = 1;
let searchTerm = null

const downloadImg = (imgUrl) => {
    fetch(imgUrl).then(res => res.blob()).then(file => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime();
        a.click()
    }).catch(() => alert("Failed to Download Image!!"))
}

const showLightBox = (name, img) => {
    lightBox.querySelector("img").src = img
    lightBox.querySelector("span").innerText = name
    downloadBtn.setAttribute("data-img", img)
    lightBox.classList.add("show")
    document.body.style.overflow = "hidden"
}

const hideLightBox = () => {
    lightBox.classList.remove("show")
    document.body.style.overflow = "auto"
}


const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                 <i class="fa-solid fa-download"></i>
            </button>
        </div>
        </li>`
    ).join("");
}

const getImages = (apiUrl) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiUrl, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos)
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled")
    }).catch(() => alert("Failed to Load Images !"))
}

const loadMoreImages = () => {
    currentPage++
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl
    getImages(apiUrl)
}

const loadSearchImages = (e) => {
    if (e.target.value === "") return searchTerm = null
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value
        imagesWrapper.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
loadMoreBtn.addEventListener("click", loadMoreImages)
searchBtn.addEventListener("keyup", loadSearchImages)
closeBtn.addEventListener("click", hideLightBox)
downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img))