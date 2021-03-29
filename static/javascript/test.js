console.log('loaded')


document.getElementById('hamburger-button').addEventListener('click', () => {
    console.log('clicked')
    document.querySelector('.nav').classList.toggle('hidden')
})