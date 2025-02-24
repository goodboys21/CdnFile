export default async function handler(req, res) {
  try {
    const { cloudName, fileName } = req.query;
    
    if (!cloudName || !fileName) {
      return res.status(400).json({ error: "Invalid URL format! Use /api/proxy?cloudName=yourCloud&fileName=yourFile.jpg" });
    }

    const imageUrl = `https://res.cloudinary.com/ddivtyns4/image/upload/${fileName}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(404).json({ error: "File not found!" });
    }

    const contentType = response.headers.get("Content-Type");
    const imageBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
