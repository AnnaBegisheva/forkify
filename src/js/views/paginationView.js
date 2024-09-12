import View from "./View";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination')

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            console.log(btn);
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            console.log(goToPage);
            handler(goToPage);
        })
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const markupBtnPrev = `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
        </button>
        `;
        const markupBtnNext = `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
        `

        // Page 1 and there are other pages
        if (currentPage === 1 && numPages > 1) {
            return markupBtnNext;
        }
        // Last page
        if (currentPage === numPages && numPages > 1) {
            return markupBtnPrev;
        }
        // Other page
        if (currentPage < numPages) {
            return `${markupBtnPrev} ${markupBtnNext}`;
        }
        // Page 1 and there are No other pages
        return ''

    }
}

export default new PaginationView();