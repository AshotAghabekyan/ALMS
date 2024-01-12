export class Book {
    aditional_info = {};
    constructor(title, authors, isbn, category, published_year, page_count, language = "English", publisher, availability = true, cover_url, online_version_url) {
        this.title = title;
        this.authors = authors;
        this.isbn = isbn;
        this.category = category;
        this.published_year = published_year;
        this.aditional_info.publisher = publisher;
        this.aditional_info.language = language;
        this.aditional_info.page_count = page_count;
        this.availability = availability;
        this.cover_url = cover_url || `https://example.com/thumbnails/${title.split(" ").join("-")}.jpg`;
        this.online_version_url = online_version_url || `https://example.com/ebooks/${title.split(" ").join("-")}.pdf`;
    }
}