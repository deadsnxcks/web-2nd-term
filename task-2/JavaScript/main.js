document.addEventListener("DOMContentLoaded", function() {
    const booksByAuthor = d3.groups(books, d => d.author);
    
    const ol = d3.select('#list-container')
        .append('ol');

    const authorItems = ol.selectAll('li')
        .data(booksByAuthor)
        .enter()
        .append('li');
    
    authorItems.append('span')
        .text(d => d[0]);

    const bookLists = authorItems.append('ul');

    bookLists.selectAll('li')
        .data(d => d[1])
        .enter()
        .append('li')
        .text(d => d.title + ' (' + d.price + ' руб.)');
});