import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

type Url = {
  slug: string;
  url: string;
};

const urls: Url[] = [
  {
    slug: "er41",
    url: "www.google.com",
  },
];

app.get("/t/:slug", (req, res) => {
  let slug = req.params.slug;
  let redirectLink = urls.find((e) => e.slug === slug);
  if (!redirectLink) {
    return res.status(404).json({ message: "url does not exist" });
  }
  return res.redirect(redirectLink.url);
});

app.get("/links", (req, res) => {
  return res.json(urls);
});

app.delete("/links/:id", (req, res) => {
  const slug = req.params.id;
  const urlToDelete = urls.findIndex((e) => e.slug === slug);
  if (urlToDelete === -1) {
    return res.status(400).json({ message: "Url cannot be found" });
  } else {
    urls.splice(urlToDelete, 1);
  }
  return res.status(200).send();
});

app.post("/", (req, res) => {
  const url = req.body.url;
  const found = urls.find((element) => element.url === url);
  if (found) {
    return res.json(found); // { "url": x, "slug": y}
  }

  const slug = generateSlug();
  const newUrlSlug = {
    slug,
    url,
  };
  urls.push(newUrlSlug);
  return res.json(newUrlSlug);
});

const generateSlug = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ1234567890";

  while (true) {
    let slug = "";

    for (let i = 0; i < 4; i++) {
      slug += chars[Math.floor(Math.random() * chars.length)];
    }

    const slugFound = urls.find((element) => element.slug === slug);

    if (slugFound) {
      continue;
    } else {
      return slug;
    }
  }
};

app.listen(4000, () => {
  console.log("Listening on PORT: 4000");
});
