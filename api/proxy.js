export default async function handler(req, res) {
    const { slug } = req.query;
    if (!slug || slug.length < 2) return res.status(400).send("Invalid URL format!");

    try {
        const [cloudName, fileName] = slug;
        const response = await fetch(`https://res.cloudinary.com/ddivtyns4/image/upload/${fileName}`);
        if (!response.ok) return res.status(404).send("File not found!");

        res.setHeader("Content-Type", response.headers.get("content-type"));
        res.send(Buffer.from(await response.arrayBuffer()));
    } catch {
        res.status(500).send("Server error!");
    }
}
