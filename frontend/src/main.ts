document.querySelector<HTMLButtonElement>("#submit-button")?.addEventListener("click", e => {
  e.preventDefault();
  const keyword = document.querySelector<HTMLInputElement>("#keyword-input")!.value;
  const url = "http://localhost:3000/api/scrape?keyword=" + keyword;
  let xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.onreadystatechange = () => {
    if (xmlHttpRequest.readyState == 4) {
      if (xmlHttpRequest.status == 200) {
        const data = JSON.parse(xmlHttpRequest.responseText);
        const table = document.getElementById("products-table");
        if (table) {
          table.hidden = false;
          document.getElementById("products-table-body")?.remove();
          const tableBody = document.createElement("tbody");
          tableBody.setAttribute("id", "products-table-body");
          table.appendChild(tableBody);
          data.forEach((product: any, index: number) => {
            const tr = createTrElement(product, index + 1);
            tableBody?.appendChild(tr);
          })
        }
      } else {
        console.log("Something went wrong with the server request.");
      }
    }
  };
  xmlHttpRequest.open("GET", url);
  xmlHttpRequest.send();
})

function createTrElement(productJson: { title: string; rating: string; reviews: string; imageUrl: string}, key: number) {
  const tr = document.createElement("tr");
  tr.setAttribute("key", key.toString());
  const indexTd = document.createElement("td");
  indexTd.innerHTML = key.toString();
  indexTd.className = "indexColumn";
  tr.appendChild(indexTd);
  const titleTd = document.createElement("td");
  titleTd.innerHTML = productJson.title;
  titleTd.className = "titleColumn";
  tr.appendChild(titleTd);
  const ratingTd = document.createElement("td");
  ratingTd.innerHTML = productJson.rating;
  ratingTd.className = "ratingColumn";
  tr.appendChild(ratingTd);
  const reviewsTd = document.createElement("td");
  reviewsTd.innerHTML = productJson.reviews;
  reviewsTd.className = "reviewsColumn";
  tr.appendChild(reviewsTd);
  const imageTd = document.createElement("td");
  const image = document.createElement("img");
  image.src = productJson.imageUrl;
  imageTd.appendChild(image);
  imageTd.className = "imageUrlColumn";
  tr.appendChild(imageTd);
  return tr;
}








// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
