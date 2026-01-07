import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Website Performance Checker API is running' });
});

app.post("/sendUrl", async (req, res) => {
  try {
    // Extract URL from request body
    const { url } = req.body;

    // Validate URL is provided
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate API key is configured
    const apiKey = process.env.Google_API;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Encode the URL properly
    const encodedUrl = encodeURIComponent(url);
    const mobileUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=mobile&key=${apiKey}`;
    const desktopUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=desktop&key=${apiKey}`;

    // Fetch both mobile and desktop data
    const [mobileResponse, desktopResponse] = await Promise.all([
      fetch(mobileUrl),
      fetch(desktopUrl)
    ]);

    // Check if responses are OK
    if (!mobileResponse.ok || !desktopResponse.ok) {
      return res.status(400).json({
        error: 'Failed to fetch PageSpeed data. Please check if the URL is valid.'
      });
    }

    const mobileData = await mobileResponse.json();
    const desktopData = await desktopResponse.json();

    const data = { mobile: mobileData, desktop: desktopData };
    res.status(200).json(data);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}.`);
});
