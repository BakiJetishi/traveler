'use strict'

//////////////////////////////////////////////////////
const alert = document.querySelector('#alert')
addEventListener('DOMContentLoaded', () => {
    alert.style.display = 'none'
    document.body.classList.remove('overflow')
})
//////////////////////////////////////////////////////

import items from './data.js'

//////////////////////////////////////////////////
// Navbar
const navbar = document.querySelector('.navbar')

window.onscroll = function () {
    if (document.body.scrollTop >= 100 || document.documentElement.scrollTop >= 200) {
        navbar.classList.add("sticky-nav");
    }
    else {
        navbar.classList.remove("sticky-nav");
    }
};

// Menu fade animation
const handleHover = function (e) {
    if (
        e.target.classList.contains('nav__link') || e.target.classList.contains('show-cart-btn')
    ) {
        document.querySelectorAll('.nav__link').forEach((e2) => {
            if (e2 !== e.target) e2.style.opacity = this;
        });
        const navLogo = document.querySelector('.logo');
        if (navLogo !== e.target) navLogo.style.opacity = this;
    }
};

// Mouse hover
navbar.addEventListener('mouseover', handleHover.bind(0.5));
navbar.addEventListener('mouseout', handleHover.bind(1));

document.querySelector('.navbarlist').addEventListener('click', function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: "center" });
    }
});

///////////////////////////////////////
// Slider
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.prev');
    const btnRight = document.querySelector('.next');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;

    // Functions
    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const activateDot = function (slide) {
        document
            .querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));

        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    };

    const goToSlide = function (slide) {
        slides.forEach((s, i) => {
            s.style.transform = `translateX(${100 * (i - slide)}%)`
        });
    };

    // Next slide
    const nextSlide = function () {
        if (curSlide === slides.length - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = slides.length - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const init = function () {
        goToSlide(0);
        createDots();

        activateDot(0);
    };
    init()

    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();

///////////////////////////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.reveal-onscroll');

const revealSection = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('reveal-hidden');
    observer.unobserve(entry.target);
};

const Observer = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.1,
});

allSections.forEach((e) => {
    Observer.observe(e);
    e.classList.add('reveal-hidden');
});

/////////////////////////////////////////////////////////////////
// Form validate
const form = document.querySelector('#form');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

form.addEventListener('submit', e => {
    e.preventDefault();

    checkInputs();
});

function checkInputs() {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (usernameValue === '' || usernameValue.length < 3) {
        setErrorFor(username, 'Username cannot be blank or shorter than 3 characters');
    } else {
        setSuccessFor(username);
    }

    if (emailValue === '') {
        setErrorFor(email, 'Email cannot be blank');
    } else if (!validEmail(emailValue)) {
        setErrorFor(email, 'Not a valid email');
    } else {
        setSuccessFor(email);
    }

    if (!validPassword(passwordValue) || passwordValue.length < 8) {
        setErrorFor(password, 'Enter a combination of at least eight numbers,letters and punctuation marks (like ! and &)')
    } else {
        setSuccessFor(password);
    }
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function validEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function validPassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password);
}


//////////////////////////////////////////////////////////////////
// Add to cart
let cart = JSON.parse(localStorage.getItem('cart')) || []

const packages = () => {
    const packages = document.querySelector('.packages')
    const showCartBtn = document.querySelector('.show-cart-btn')
    const showCart = document.querySelector('.cart-container')
    const cartContainer = document.querySelector('.cart')

    items.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('package')
        div.innerHTML = `
            <img src="${e.img}" alt="" />
            <div class="icons">
                <i class="fa-solid fa-location-dot">
                    <p>${e.country}</p>
                </i>
                <i class="fa-solid fa-calendar-days">
                    <p>${e.duration}</p>
                </i>
                <i class="fa-solid fa-user">
                    <p>${e.persons}</p>
                </i>
            </div>
            <div class="thailand-text">
                <a href="#">${e.description}</a>
            </div>
            <div class="rating">
                <i class="fa-solid fa-star">
                    <h3>4.5</h3>
                </i>
                <div class='add-to-cart'>
                <h2>${e.price}$</h2>
                <button id='add_to_cart' type='submit''>Add to Cart</button>
                </div>
            </div>`
        packages.appendChild(div)
    })
    const addToCart = document.querySelectorAll('#add_to_cart')

    addToCart.forEach((e, i) => {
        e.addEventListener('click', (e) => {
            e.preventDefault()
            const existItem = cart.find(x => x.id == items[i].id)
            if (!existItem) {
                cart = [...cart, { id: items[i].id, img: items[i].img, country: items[i].country, duration: items[i].duration, persons: items[i].persons, price: items[i].price, qty: 1 }]
                displayCartItems()
                cartToStorage()
            } else {
                alert('You already have this item in cart')
            }
        })
    })


    showCartBtn.addEventListener('click', e => {
        e.preventDefault()
        showCart.classList.toggle('show-cart')
    })

    const displayCartItems = () => {
        let items = ``
        let total = 0

        cart.forEach((item) => {
            items += `
        <div class='thailand-package'>
            <div class="package">
                <img src="${item.img}" alt="">
                <div>
                    <p>${item.country}</p>
                    </i>
                    <p>${item.duration}</p>
                    </i>
                    <p>${item.persons}</p>
                    </i>
                </div>
            </div>
            <div class="price">
                <span>Price: <b>${item.price}$</b></span>
                <button id='delete-btn'><i class="fa-solid fa-trash-can"></i><button>
            </div>
        </div>`

            total += item.price

        })

        cartContainer.innerHTML = items

        document.querySelector('.total').textContent = 'Total: ' + total + '$'

        document.querySelectorAll('#delete-btn').forEach((e, i) => {
            e.addEventListener('click', () => {
                cart.splice(i, 1)
                displayCartItems()
                cartToStorage()
            })
        })

        document.querySelector('.items').textContent = cart.length

    }

    displayCartItems()
}


packages()

function cartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart))
}