const btn = document.querySelector("button");

btn.addEventListener('click', () => {
    alert(`Размеры экрана: ширина ${window.screen.width}, высота ${window.screen.width}`);
    alert(`Размеры области просмотра: ширина ${document.documentElement.clientWidth}, высота ${document.documentElement.clientHeight}`);
})