export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "File path is required!" });
  }

  const cloudinaryURL = `https://res.cloudinary.com/ddivtyns4/image/upload/${path}`;

  try {
    const response = await fetch(cloudinaryURL);
    if (!response.ok) throw new Error("File not found!");

    const data = await response.arrayBuffer();

    res.setHeader("Content-Type", response.headers.get("Content-Type"));
    res.send(Buffer.from(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch file!" });
  }
}
