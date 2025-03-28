const {JSDOM} = require("jsdom");

const server = Bun.serve({
    port: 3000,
    routes: {
        "/api/scrape": {
            GET: req => {
                const url = req.url;
                const keyword = url.split("?keyword=")[1];
                console.log("keyword: " + keyword);
                const amazonUrl = `https://www.amazon.com.br/s?k=${keyword}`;
                return fetch(amazonUrl).then(resp => {
                    console.log(resp.status)
                    if (resp.status != 200) {
                        return new Response("Something went wrong fetching amazon.");
                    }
                    return resp.text().then(rawHtml => {
                        const dom = new JSDOM(rawHtml);
                        const document = dom.window.document;
                        const listLength = document.querySelectorAll("div[role=listitem][data-index]").length
                        // product element attribute 'data-index' starts with index 3
                        console.log(listLength);
                        let iterator = 3;
                        let listCount = 0;
                        const products = [];
                        while (listCount < listLength) {
                            const productNode = document.querySelector(`div[role=listitem][data-index='${iterator}']`);
                            if (productNode != null) {
                                const titleNode = document.querySelector(`div[role=listitem][data-index='${iterator}'] h2 span`);
                                const ratingNode = document.querySelector(`div[role=listitem][data-index='${iterator}'] span.a-icon-alt`);
                                const reviewsNode = document.querySelector(`div[role=listitem][data-index='${iterator}'] div[data-cy=reviews-block] span[aria-hidden=true]`);
                                const imageUrlNode = document.querySelector(`div[role=listitem][data-index='${iterator}'] img`);
                                products.push({
                                    title: titleNode ? titleNode.textContent : undefined,
                                    rating: ratingNode ? ratingNode.textContent : undefined,
                                    reviews: reviewsNode ? reviewsNode.textContent : undefined,
                                    imageUrl: imageUrlNode ? imageUrlNode.src : undefined
                                });
                                listCount++;
                            }
                            iterator++;
                        }
                        const responseInit: ResponseInit = {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*"
                            }
                        }
                        return new Response(JSON.stringify(products), responseInit);
                    })
                })
                // return new Response(keyword);
            }
        }
    }
});

console.log("Listening on https:localhost:3000...");
