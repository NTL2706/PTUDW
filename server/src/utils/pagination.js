function pagination(totalPage, currentPage) {
    const pagesToShow = 3;

    const pages = [];
    let startPage = currentPage - Math.floor(pagesToShow / 2);
    if (startPage <= 0) {
        startPage = 1;
    }
    let endPage = startPage + pagesToShow - 1;

    if (endPage > totalPage) {
        endPage = totalPage;
        startPage = endPage - pagesToShow + 1;
        if (startPage <= 0) {
            startPage = 1;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
}

export { pagination }