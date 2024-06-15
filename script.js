document.addEventListener('DOMContentLoaded', function() {
    function isMobile(){
        const userAgent = /Mobi|Android/i.test(navigator.userAgent)
        const screenSize = window.innerWidth <=768
        return userAgent || screenSize
    }

    function fetchContent(url){
        return fetch(url)
            .then(response => response.text())
            .then(data => data)
            .catch(error => {
                console.error('Error fetching the content', error)
                return '<h2>Error loading content</h2><br><p>There was an error loading the content</p>'
            })
    }

    async function loadContent(ArgPage){
        let contentUrl = `pages/${
            ArgPage === 'Home' && localStorage.token ?
            'App' :
            ArgPage === 'Login' ?
                'Login' :
                'info'
        }.html`
        const content = await fetchContent(contentUrl)
        main.innerHTML = content
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });    
    }

    function toggleActive(){
        const btn_mobile = document.querySelector('a.btn_mobile')
        const hamburger = btn_mobile.querySelector('#hamburger')
        const html = document.documentElement
        const mmMenu = document.getElementById('mm-menu')
        
        if(hamburger.classList.contains('is-active')){
            hamburger.classList.remove('is-active')
            html.classList.remove('mm-opened', 'mm-blocking', 'mm-background', 'mm-opening')
            mmMenu.classList.remove('mm-opened')
        } else {
            hamburger.classList.add('is-active')
            html.classList.add('mm-opened', 'mm-blocking', 'mm-background', 'mm-opening')
            mmMenu.classList.add('mm-opened')
        }
    }

    async function initPage(){
        const mainPage = document.getElementById('page')
        const main = document.getElementById('main')
        const mainHeight = window.innerHeight
        main.style.minHeight = mainPage.style.minHeight = mainHeight + 'px'

        const token = localStorage.getItem('token')
        document.getElementById(`${token ? 'li_login' : 'li_logout'}`).style.display = 'none'
        
        const btn_mobile = document.querySelector('a.btn_mobile')
        btn_mobile?.addEventListener('click', function(event){
            event.preventDefault()
            toggleActive()
        })

        loadContent('Home')
    }

    const body = document.body
    const main = document.getElementById('main')

    const menuLinks = document.querySelectorAll('a[data-id]')

    menuLinks.forEach((link) => {
        link.addEventListener('click', function(event){
            event.preventDefault()
            loadContent(link.dataset.id)
        })
    })
    
    isMobile() ? body?.classList.add('mobile-device') : body.classList.remove('mobile-device')

    this.querySelectorAll('#logout').forEach((link) => {
        link?.addEventListener('click', function(event){
            event.preventDefault()

            localStorage.removeItem('token')
            loadContent('Home')
        })
    })

    const loginForm = document.getElementById('loginForm')

    loginForm?.addEventListener('submit', async function(event){
        event.preventDefault()

        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch('assets/json/users.json')
            const users = await response.json()

            const user = users.find(u => u.username === username && u.password === password)
            if(user){
                const token = Math.random().toString(36).substr(2)
                localStorage.setItem('token', token)

                loadContent('Home')
            } else {
                alert('Invalid Username or password')
            }
        } catch (e) {
            console.log('Error fetching users json', e)
            alert('There was an error logging in. Please Try again later')
        }
    })

    initPage()
})