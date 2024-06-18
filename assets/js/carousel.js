function initCarousel() {
    const cardStage = document.querySelector('.cards-stage');
    const cards = Array.from(cardStage.children)
        .filter(node => node.nodeType === Node.ELEMENT_NODE);

    const mainCarousel = document.getElementById('Main_Carousel');
    const mainCarouselWidth = mainCarousel.clientWidth; // Ancho del contenedor Main_Carousel

    const cardsToShow = 5; // Número de tarjetas visibles
    const cardWidth = mainCarouselWidth / 4; // Ancho de cada tarjeta calculado dinámicamente para que entren 4 tarjetas visibles

    if (cards.length > 4) { // Verificar con 4 tarjetas visibles en el contenedor
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
        });

        const first3Cards = cards.slice(0, 3).map(card => card.cloneNode(true));
        const last3Cards = cards.slice(-3).map(card => card.cloneNode(true));

        last3Cards.reverse().forEach(clone => {
            clone.classList.add('clonned');
            cardStage.insertBefore(clone, cardStage.firstChild);
        });

        first3Cards.forEach(clone => {
            clone.classList.add('clonned');
            cardStage.appendChild(clone);
        });

        const totalCardsIncludingClones = cards.length + 6;
        const containerFullWidth = totalCardsIncludingClones * cardWidth;
        cardStage.style.width = `${containerFullWidth}px`;

        const initialCardIndex = 2; // El índice donde debería estar la tarjeta real 0 (segunda tarjeta visible)
        const offset = -((initialCardIndex - (cardsToShow / 2)) * cardWidth);

        cardStage.style.transition = 'all 0.25s ease 0s';
        cardStage.style.transform = `translate3d(${offset}px, 0, 0)`;

        cards[0].classList.add('center');
    } else {
        const sectionCards = document.getElementById('Section_Cards');
        if (sectionCards !== null) sectionCards.style.display = 'none';
    }
}
