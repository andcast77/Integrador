document.addEventListener('DOMContentLoaded', function() {
    function isMobile(){
        const userAgent = /Mobi|Android/i.test(navigator.userAgent)
        const screenSize = window.innerWidth <=768
        return userAgent || screenSize
    }

    function fetchContent(url) {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                return parser.parseFromString(data, 'text/html');
            })
            .catch(error => {
                console.error('Error fetching the content', error);
                const errorHtml = '<h2>Error loading content</h2><br><p>There was an error loading the content</p>';
                const parser = new DOMParser();
                return parser.parseFromString(errorHtml, 'text/html');
            });
    }
    
    function loadControls(ArgContent) {
        ArgContent.addEventListener('submit', async function(event){
            if(event.target && event.target.id === 'loginForm'){
                event.preventDefault();

                const username = loginForm.querySelector('#username').value;
                const password = loginForm.querySelector('#password').value;
    
                try {
                    const response = await fetch('/assets/json/users.json');
                    const users = await response.json();
    
                    const user = users.find(u => u.username === username && u.password === password);
    
                    if (user) {
                        const token = Math.random().toString(36).substr(2);
                        localStorage.setItem('token', token);
    
                        loadContent('Home');
                    } else {
                        alert('Invalid Username or password');
                    }
                } catch (e) {
                    console.log('Error fetching users json', e);
                    alert('There was an error logging in. Please Try again later');
                }
            }
        })
    }
    
    async function loadContent(ArgPage) {

        let currentPage = 
        ArgPage === 'Home' && !localStorage.token ? 'info' :
        ArgPage === 'Login' && !localStorage.token ? 'Login' :
        'App'

        let contentUrl = `pages/${currentPage}.html`;

        const content = await fetchContent(contentUrl);
        const main = document.getElementById('main');
        const token = localStorage.getItem('token')

        main.innerHTML = '';
        Array.from(content.body.childNodes).forEach(node => {
            main.appendChild(document.importNode(node, true));
        });
    
        loadControls(main)
        if(currentPage === 'info') initCarousel()

        document.getElementById(`${!isMobile() ? 'li_login' : 'mm-li_login'}`).style.display = !token ? 'inline-block' : 'none'
        document.getElementById(`${!isMobile() ? 'li_logout' : 'mm-li_logout'}`).style.display = token ? 'inline-block' : 'none'

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
        const body = document.body

        main.style.minHeight = mainPage.style.minHeight = mainHeight + 'px'
        
        const btn_mobile = document.querySelector('a.btn_mobile')
        btn_mobile?.addEventListener('click', function(event){
            event.preventDefault()
            toggleActive()
        })

    
        const menuLinks = document.querySelectorAll('a[data-id]')
    
        menuLinks.forEach((link) => {
            link.addEventListener('click', function(event){
                event.preventDefault()
                if(isMobile()) btn_mobile?.click()

                if(link.dataset.id !== 'Logout') {
                    loadContent(link.dataset.id)
                } else {
                    event.preventDefault()
                    localStorage.removeItem('token')

                    loadContent('Home')
                }
            })
        })
        
        isMobile() ? body?.classList.add('mobile-device') : body.classList.remove('mobile-device')
    
        loadContent('Home')
    }

    initPage()
})