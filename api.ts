import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

const slugMap: Record<string, string> = {
    "er41": "www.google.com"
}
const urlMap: Record<string, string> = {
    "www.google.com": "er41"
}


app.get("/t/:slug", (req, res) => {
    let slug = req.params.slug;
    let redirectLink = slugMap[slug];
    if (!redirectLink) {
        return res.status(404).json({ "message": 'url does not exist'});
        
    }
    return res.redirect(redirectLink)
});

app.get("/links", (req, res) => {
    return res.json(urlMap);
})

app.delete("/links/:id", (req, res) => {
  const link = req.params.id;
  if (!urlMap[link]) {
    return res.status(400).json({ message: "ID does not exist" });}
    delete urlMap[link]
    return res.json(urlMap)
})


app.post("/", (req, res) => {
    const url = req.body.url
    const slug = urlMap[url]
    if (slug) {
        return res.json({ slug })
    }
    let uniqueSlug: string = generateSlug()
    let isSlugUnique = false
    while (!isSlugUnique) {
        if (!slugMap[uniqueSlug]) {
            slugMap[uniqueSlug] = url
            urlMap[url] = uniqueSlug
            isSlugUnique = true
        } else {
            uniqueSlug = generateSlug()
        }
    }
})

const generateSlug = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ1234567890"
    let newUrl = ''
    for (let i = 0; i < 4; i++) {
        newUrl += chars[Math.floor(Math.random() * chars.length - 1)]
    }
    return newUrl
}

app.listen(4000, () => {
    console.log("Listening on PORT: 4000");
});