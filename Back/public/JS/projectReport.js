let projectId = window.location.pathname.split('/');
const output = document.querySelector('#output');
const outputBtn = document.querySelector('#output-btn');
const card = document.querySelector('.card');
projectId = projectId[projectId.length - 1];


outputBtn.addEventListener('click', () => {
    console.log(card);
    const data = fetch(`/projects/output/${projectId}`)
        .then(res => res.json())
        .then(resJson => output.innerHTML += `${resJson.electricitySum}`);
    card.classList.remove('d-none')
})

