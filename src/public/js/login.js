//

const form = document.getElementById('loginForm')

form.addEventListener('submit', ()=>{

    let usuario = getElementById('usuario').value
    let pass = getElementById('pass').value

    let obj = {usuario, pass}

    fetch('/login', {
        method:'POST',
        body:JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(result => result.json())
    .then(json => {
        localStorage.setItem('authToken',json.token)
    })
//si los datos son correctos, el servidor contesta con un token
})

