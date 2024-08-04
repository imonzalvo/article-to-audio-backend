"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = require("puppeteer");
let ScraperService = ScraperService_1 = class ScraperService {
    constructor() {
        this.logger = new common_1.Logger(ScraperService_1.name);
    }
    async scrapeArticle(url) {
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
            }
            else if (isSubstack) {
                title = await this.getTextContent(page, "h1.post-title");
                content = await this.getSubstackContent(page);
                author = await this.getTextContent(page, ".byline-names");
            }
            else {
                throw new Error("Unsupported website");
            }
            return { title, content, author };
        }
        catch (error) {
            this.logger.error(`Failed to scrape article: ${error.message}`);
            throw new Error(`Failed to scrape article: ${error.message}`);
        }
        finally {
            await browser.close();
        }
    }
    async isMediumArticle(page) {
        return page.evaluate(() => {
            return (document.querySelector('meta[name="twitter:app:name:iphone"][content="Medium"]') !== null);
        });
    }
    async isSubstackArticle(page) {
        return page.evaluate(() => {
            const substackElements = [
                'div[data-substack-iframe="true"]',
                'iframe[data-substack-iframe="true"]',
                "div.post-content",
                "div.single-post",
            ];
            return substackElements.some((selector) => document.querySelector(selector) !== null);
        });
    }
    async getTextContent(page, selector) {
        try {
            return await page.$eval(selector, (el) => el.textContent.trim());
        }
        catch (error) {
            this.logger.warn(`Failed to find element with selector "${selector}"`);
            return "";
        }
    }
    async getMediumAuthor(page) {
        const selectors = [
            'a[rel="author"]',
            'a[data-testid="authorName"]',
            ".author-name",
            'span[data-testid="authorName"]',
        ];
        for (const selector of selectors) {
            try {
                const author = await this.getTextContent(page, selector);
                if (author)
                    return author;
            }
            catch (error) {
                this.logger.warn(`Failed to find author with selector "${selector}"`);
            }
        }
        this.logger.warn("Failed to find author with any known selector");
        return "Unknown Author";
    }
    async getSubstackContent(page) {
        try {
            const content = await page.evaluate(() => {
                const articleBody = document.querySelector(".body.markup") ||
                    document.querySelector(".post-content");
                if (!articleBody)
                    return "";
                const elementsToRemove = articleBody.querySelectorAll(".captioned-image-container, .subscription-widget-wrap");
                elementsToRemove.forEach((el) => el.remove());
                const boundaryElement = Array.from(articleBody.querySelectorAll("*")).find((el) => {
                    return el.textContent.includes("Other articles people like");
                });
                let content = "";
                if (boundaryElement) {
                    const range = document.createRange();
                    range.setStart(articleBody, 0);
                    range.setEnd(boundaryElement, 0);
                    content = range.toString().trim();
                }
                else {
                    content = articleBody.textContent.trim();
                }
                return content;
            });
            return content;
        }
        catch (error) {
            this.logger.warn("Failed to extract content from Substack article");
            return "";
        }
    }
};
ScraperService = ScraperService_1 = __decorate([
    (0, common_1.Injectable)()
], ScraperService);
exports.ScraperService = ScraperService;
//# sourceMappingURL=scraper.service.js.map