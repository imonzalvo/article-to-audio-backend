import { Injectable, Logger } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeArticle(
    url: string
  ): Promise<{ title: string; content: string; author: string }> {
    const browser = await puppeteer.launch({
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle0" });

      const isMedium = await this.isMediumArticle(page);
      const isSubstack = await this.isSubstackArticle(page);

      let title, content, author;

      if (isMedium) {
        title = await this.getTextContent(page, "h1");
        content = await this.getTextContent(page, "article");
        author = await this.getMediumAuthor(page);
      } else if (isSubstack) {
        title = await this.getTextContent(page, "h1.post-title");
        content = await this.getSubstackContent(page);
        
        const authorSelector = '.byline-wrapper a';
        author = await page.$$eval(authorSelector, anchors => {
          // Check if there are at least 2 `a` tags
          if (anchors.length >= 2) {
            return anchors[1].innerText; // Get the text of the second `a` tag
          } else {
            throw new Error('Less than two anchor tags found');
          }
        });
      } else {
        throw new Error("Unsupported website");
      }
      return { title, content, author };
    } catch (error) {
      this.logger.error(`Failed to scrape article: ${error.message}`);
      throw new Error(`Failed to scrape article: ${error.message}`);
    } finally {
      await browser.close();
    }
  }

  private async isMediumArticle(page: puppeteer.Page): Promise<boolean> {
    return page.evaluate(() => {
      return (
        document.querySelector(
          'meta[name="twitter:app:name:iphone"][content="Medium"]'
        ) !== null
      );
    });
  }

  private async isSubstackArticle(page: puppeteer.Page): Promise<boolean> {
    return page.evaluate(() => {
      // Check for Substack-specific elements or attributes
      const substackElements = [
        'div[data-substack-iframe="true"]',
        'iframe[data-substack-iframe="true"]',
        "div.post-content",
        "div.single-post",
      ];
      return substackElements.some(
        (selector) => document.querySelector(selector) !== null
      );
    });
  }

  private async getTextContent(
    page: puppeteer.Page,
    selector: string
  ): Promise<string> {
    try {
      return await page.$eval(selector, (el) => el.textContent.trim());
    } catch (error) {
      this.logger.warn(`Failed to find element with selector "${selector}"`);
      return "";
    }
  }

  private async getAuthorContent(
    page: puppeteer.Page,
    selector: string
  ): Promise<string> {
    try {
      console.log("what!?!>>!>!>")
      return await page.$eval(selector, el => el.innerHTML);
    } catch (error) {
      this.logger.warn(`Failed to find element with selector "${selector}"`);
      return "";
    }
  }

  private async getMediumAuthor(page: puppeteer.Page): Promise<string> {
    const selectors = [
      'a[rel="author"]',
      'a[data-testid="authorName"]',
      ".author-name",
      'span[data-testid="authorName"]',
    ];

    for (const selector of selectors) {
      try {
        const author = await this.getTextContent(page, selector);
        if (author) return author;
      } catch (error) {
        this.logger.warn(`Failed to find author with selector "${selector}"`);
      }
    }

    this.logger.warn("Failed to find author with any known selector");
    return "Unknown Author";
  }

  private async getSubstackContent(page: puppeteer.Page): Promise<string> {
    try {
      const content = await page.evaluate(() => {
        // Find the main content area
        const articleBody =
          document.querySelector(".body.markup") ||
          document.querySelector(".post-content");
        if (!articleBody) return "";

        // Remove elements that are not part of the main content
        const elementsToRemove = articleBody.querySelectorAll(
          ".captioned-image-container, .subscription-widget-wrap"
        );
        elementsToRemove.forEach((el) => el.remove());

        // Find the boundary where "Other articles people like" begins
        const boundaryElement = Array.from(
          articleBody.querySelectorAll("*")
        ).find((el) => {
          return el.textContent.includes("Other articles people like");
        });

        // Extract content up to the boundary element
        let content = "";
        if (boundaryElement) {
          const range = document.createRange();
          range.setStart(articleBody, 0);
          range.setEnd(boundaryElement, 0);
          content = range.toString().trim();
        } else {
          // If no boundary element is found, return all the content
          content = articleBody.textContent.trim();
        }

        return content;
      });

      return content;
    } catch (error) {
      this.logger.warn("Failed to extract content from Substack article");
      return "";
    }
  }
}
