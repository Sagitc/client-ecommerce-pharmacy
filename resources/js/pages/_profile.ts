//  DECLARATIONS
const options = document.querySelectorAll('.info__option-btn');


//  EVENTS
options.forEach(btn => {
    btn.addEventListener('click', () => {  
        toggleInfoOption(btn);  
    });
});




//  FUNCTIONS
function toggleInfoOption(btn: Element) {
    let resumeSection = document.getElementById('info__resume');
    let profileSection = document.getElementById('info__profile');
    let requestsSection = document.getElementById('info__requests');
    let covenantSection = document.getElementById('info__covenant');
    let favoritesSection = document.getElementById('info__favorites');

    if (!resumeSection || !profileSection || !requestsSection || !covenantSection || !favoritesSection) return;

    document.querySelector('.info__option-btn.active')?.classList.remove('active');
    btn.classList.add('active');

    switch (btn.getAttribute('data-option')) {
        case 'resume':
            resumeSection?.classList.remove('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'profile':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.remove('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'requests':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.remove('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'covenant':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.remove('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'favoritos':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.remove('is-disabled');
            break;
        case 'sair':
            window.location.href = '/logout';
            break;
        default:
            break;
    }
}