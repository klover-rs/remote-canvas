import express, { Express, Request, Response, ErrorRequestHandler, NextFunction } from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("no escape..");
});

app.post("/welcome_canv", async (req: Request, res: Response) => {
  try {
    const jsonData = req.body;

    console.log(jsonData);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const filePath = 'file://' + process.cwd() + '/canv/welcome_canv/index.html'

    await page.goto(filePath);

    const result = await page.evaluate((data) => {
      const pfpImg = document.querySelector('.welcome-pfp') as HTMLImageElement;
      const usernameHeader = document.querySelector('.wlcome-header') as HTMLHeadingElement;
    
      if (pfpImg && usernameHeader) {
        pfpImg.src = data.pfp_url;
        usernameHeader.textContent = "Welcome " + data.username;

        return new Promise((resolve) => {
          pfpImg.onload = () => resolve(true);
          pfpImg.onerror = (error) => resolve(error.toString());
        });
      } else {
        throw new Error('pfpImg or usernameHeader not found');
      }
    }, jsonData);
  
    const rootElement = await page.waitForSelector('#root');

    const screenshotBuffer = await rootElement?.screenshot();
    if (screenshotBuffer) {
      const base64Screenshot = screenshotBuffer.toString('base64');
      res.send(base64Screenshot);
    } else {
      res.status(500).send('Screenshot buffer is undefined');
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).send(error.message);
    } else {
      console.error("an unknown error occurred", error);
      res.status(500).send("an unknown error occurred");
    }
    
  } 
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});