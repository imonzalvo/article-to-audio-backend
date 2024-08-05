export declare class ScraperService {
    private readonly logger;
    scrapeArticle(url: string): Promise<{
        title: string;
        content: string;
        author: string;
    }>;
    private isMediumArticle;
    private isSubstackArticle;
    private getTextContent;
    private getAuthorContent;
    private getMediumAuthor;
    private getSubstackContent;
}
