import express, { response } from 'express';
import cors from  'cors';
import dotenv from 'dotenv'
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/sendUrl", async (req, res) => {
  const url = req.body;
  const apiKey =process.env.Google_API
  const mobileUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${(url)}&strategy=mobile&key=${apiKey}`;
  const desktopUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${(url)}&strategy=desktop&key=${apiKey}`;
  try {
    
    const mobileResponse = await fetch(mobileUrl);
    const desktopResponse = await fetch(desktopUrl);

    const mobileData = await mobileResponse.json();
  const desktopData = await desktopResponse.json();

  const data = {mobile:mobileData,desktop:desktopData}
  res.json(data);
} 
  catch (err) {
  res.status(500).json({ error: err.message });
}
});

app.listen(8000)
app.listen(console.log(`✅ Backend running`));
