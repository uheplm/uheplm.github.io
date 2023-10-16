let tg = window.Telegram.WebApp; //получаем объект webapp телеграма 

const type_map = {
    'buy': "#покупка",
    'sell': "#продажа",
    'service': "#услуга",
}

const class_map = {
    'sph': '#смартфон',
    'tab': '#планшет',
    'pcn': '#пк_ноутбуки',
    'acc': '#аксессуары',
    'com': '#комплектующие',
    'par': '#запчасти',
    'per': '#переферия',
    'vid': '#видео',
    'aud': '#аудио',
    'pho': '#фототехника',
    'con': '#расходники',
    'etc': '#прочее',
    'ser': '#услуга',
}

const currency_map = {
    'rub': '₽',
    'uah': '₴',
    'usd': '$',
    'kzt': '₸',
    'byn': 'Br',
    'gel': '₾',
    'amd': '֏'
}

const country_map = {
    'ru': {'flag': "🇷🇺", 'name': 'Россия', 'hashtag': '#россия'},
    'ua': {'flag': "🇺🇦", 'name': 'Украина', 'hashtag': '#украина'},
    'kz': {'flag': "🇰🇿", 'name': 'Казахстан', 'hashtag': '#казахстан'},
    'by': {'flag': "🇧🇾", 'name': 'Беларусь', 'hashtag': '#беларусь'},
    'ge': {'flag': "🇬🇪", 'name': 'Грузия', 'hashtag': '#грузия'},
    'ar': {'flag': "🇦🇲", 'name': 'Армения', 'hashtag': '#армения'},
}

const delivery_map = {
    "ciw": 'по городу',
    'cow': 'по стране',
    'wow': 'по миру'
}

const delivery_pay_map = {
    'byClient': 'за ваш счет',
    'byMe': 'за мой счет',
}

function shake(){
    const body = document.querySelector('body')
    body.style.animation = 'kf_shake 0.4s ease-in-out 0s';
    setTimeout(() => {body.style.animation = ''}, 400)
}

function toast(text){
    const toast = document.querySelector('#toast')
    const bsToast = new bootstrap.Toast(toast)
    toast.querySelector('.toast-body').innerHTML = text;
    bsToast.show()
}

function showFallback(){
    const fallback = document.getElementById('fallback')
    fallback.style.zIndex = '10';
    fallback.style.opacity = '1'

    tg.MainButton.isVisible = false;
    tg.MainButton.color = "#143F6B";

    setTimeout(() => {tg.sendData(JSON.stringify(collectData()));tg.close()}, 3500)
    
}

function validateAndProceed(){
    const form = document.querySelector('#mainForm')
    if(!form.checkValidity()){
        tg.HapticFeedback.notificationOccurred('error')
        shake()
    }else{
        tg.HapticFeedback.notificationOccurred('success')
        showConfirmation()
    }
    form.classList.add('was-validated')
}


function showConfirmation(){
    const confirmation = document.getElementById('confirmation-fallback')
    const bubble = document.getElementById('bubble')

    document.querySelector('body').style.overflowY = 'hidden'
    
    let data = collectData()
    // { 
    //     action: 'create',
    //     name: "Моторолла эдж 20",
    //     type: 'sell',
    //     description: 'Купите я всех заебал уже',
    //     category: 'sph',
    //     price: {
    //         isContractPrice: true,
    //         exchange: true,
    //         price: 1,
    //         currency: 'rub'
    //     },
    //     location: {
    //         country: 'ru',
    //         city: 'KALUGA'
    //     },
    //     delivery: {
    //         hasDelivery: false,
    //         deliveryRange: 'ciw',
    //         deliveryPayment: 'byMe'
    //     },
    //     contacts: {
    //         useTelegram: true,
    //         useSiteLink: true,
    //         contactLink: '',
    //         siteLink: '',
    //     }
    // }
    
    bubble.innerHTML = bubble.innerHTML.replace('{name}', data.name)
    bubble.innerHTML = bubble.innerHTML.replace('{hashtag_type}', type_map[data.type])
    bubble.innerHTML = bubble.innerHTML.replace('{hashtag_class}', class_map[data.category])
    bubble.innerHTML = bubble.innerHTML.replace('{hashtag_country}', country_map[data.location.country].hashtag)
    bubble.innerHTML = bubble.innerHTML.replace(
        '{hashtag_optional}', 
        '' + (data.delivery.hasDelivery ? '#доставка' : '') + 
        '' + (data.price.exchange ? ' #обмен' : '')

    )

    bubble.innerHTML = bubble.innerHTML.replace('{description}', data.description)
    bubble.innerHTML = bubble.innerHTML.replace('{flag}', country_map[data.location.country].flag)
    bubble.innerHTML = bubble.innerHTML.replace('{country}', country_map[data.location.country].name)
    bubble.innerHTML = bubble.innerHTML.replace('{city}', data.location.city)
    bubble.innerHTML = bubble.innerHTML.replace(
        '{price}',
        !data.price.isContractPrice & !data.price.exchange ? data.price.price : (data.price.isContractPrice ? 'Договорная' : 'Обмен')
    )
    bubble.innerHTML = bubble.innerHTML.replace(
        '{currency}', 
        !data.price.isContractPrice & !data.price.exchange ? currency_map[data.price.currency] : ''
    )
    bubble.innerHTML = bubble.innerHTML.replace(
        '{shipping}', 
        data.delivery.hasDelivery ? (`Доставка ${delivery_map[data.delivery.deliveryRange]} ${delivery_pay_map[data.delivery.deliveryPayment]}`)
        : 'Самовывоз'
    )
    bubble.innerHTML = bubble.innerHTML.replace(
        '{ad_link}', 
        data.contacts.useSiteLink ? `<br><a href="${data.contacts.siteLink}">Объявление на сайте</a>` : ''
    )
    bubble.innerHTML = bubble.innerHTML.replace(
        '{seller_name}', 
        tg.initDataUnsafe.user.first_name + ' ' + tg.initDataUnsafe.user.last_name
    )
    bubble.innerHTML = bubble.innerHTML.replace('{reports}', 0)
    bubble.innerHTML = bubble.innerHTML.replace('{rating}', 0)
    bubble.innerHTML = bubble.innerHTML.replace('{id}', tg.initDataUnsafe.user.id)
    bubble.innerHTML = bubble.innerHTML.replace('{profile}', 'https://t.me/theresell_bot/?start=p_' + tg.initDataUnsafe.user.id)
    

    tg.MainButton.offClick(validateAndProceed)
    tg.MainButton.text = 'Отправить'
    tg.MainButton.onClick(showFallback)

    confirmation.style.zIndex = '5';
    confirmation.style.opacity = '1'
}

function hideConfirmation(){
    const confirmation = document.getElementById('confirmation-fallback')
    document.querySelector('body').style.overflowY = 'scroll'
    document.getElementById('bubble').innerHTML = `
            <b>{name}</b>
            <br><br>
            {hashtag_type} {hashtag_class} {hashtag_country} {hashtag_optional}
            <br><br>
            <i>{description}</i>
            <br><br>
            {flag} {country}, {city}<br>
            <b>💳 {price}{currency}</b><br>
            <b>📦 {shipping}</b>{ad_link}<br>
            <br>
            👤 <a>{seller_name}</a> | ⭐️ {rating} | ⚠️ {reports} | <a>профиль</a>
    `
    confirmation.style.opacity = '0'
    confirmation.style.zIndex = '-1000';
    tg.MainButton.offClick(showFallback)
    tg.MainButton.text = 'Далее'
    tg.MainButton.onClick(validateAndProceed)
}

const valueOf = (id) => document.querySelector(id) ? document.querySelector(id).value : undefined
const isChecked = (id) => document.querySelector(id) ? document.querySelector(id).checked : undefined


function collectData(){
    return {
        action: 'create',
        name: valueOf('#name'),
        type: document.querySelector('#typeBuy').checked ? 'buy' : document.querySelector('#typeService').checked ? 'service' : 'sell',
        description: valueOf('#description'),
        category: valueOf('#category'),
        price: {
            isContractPrice: isChecked('#contractPrice '),
            exchange: isChecked('#exchange'),
            price: valueOf('#price'),
            currency: valueOf('#currency')
        },
        location: {
            country: valueOf('#country'),
            city: valueOf('#city')
        },
        delivery: {
            hasDelivery: isChecked("#delivery"),
            deliveryRange: valueOf("#deliveryRange"),
            deliveryPayment: valueOf("#deliveryPayment")
        },
        contacts: {
            useTelegram: isChecked("#useTelegram"),
            useSiteLink: isChecked("#useSiteLink"),
            contactLink: valueOf("#contactLink"),
            siteLink: valueOf("#siteLink"),
        }
    }
}

(function(){
    document.querySelectorAll('button, input, select, textarea')
        .forEach(e => e.addEventListener('click', () => {tg.HapticFeedback.impactOccurred('medium')}))
    document.querySelectorAll('select').forEach(e => e.addEventListener('change', tg.HapticFeedback.selectionChanged()))
    document.querySelector('body').setAttribute("data-bs-theme", tg.colorScheme)
    tg.MainButton.isVisible = true;
    tg.MainButton.text = "Далее"; //изменяем текст кнопки
    tg.onEvent('viewportChanged', (e) => {
        if(tg.isExpanded){
            document.querySelector('body').style.marginTop = '1.2rem';
            // document.querySelector("#logo").classList.add('logo-fixed')
        }else{
            document.querySelector('body').style.marginTop = '0';
            // document.querySelector("#logo").classList.remove('logo-fixed')
        }
    })

    document.querySelector('#contractPrice').addEventListener('change', (event) => {
        document.querySelectorAll('#price, #currency').forEach(e => e.disabled = event.target.checked)
    })

    document.querySelectorAll('#typeService, #typeBuy, #typeSell').forEach(el => el.addEventListener('change', (event) => {
            const icon = document.querySelector('#categoryIcon')
            document.querySelector('#category').disabled = document.querySelector('#typeService').checked
            if(document.querySelector('#typeService').checked){
                document.querySelector('#category').value = 'ser'
                icon.innerHTML = '<i class="bi bi-person-fill-gear"></i>'
            }else{
                document.querySelector('#category').value = ''
                icon.innerHTML = '<i class="bi bi-hash"></i>'
            }
        })
    )

    document.querySelector('#exchange').addEventListener('change', (event) => {
        if(event.target.checked){
            document.querySelector('#contractPrice').checked = false
        } 
        document.querySelectorAll('#price, #currency, #contractPrice').forEach(e => e.disabled = event.target.checked)
    })

    document.querySelector('#useSiteLink').addEventListener('change', (event) => {
        document.querySelector('#siteLink').disabled = !event.target.checked
    })

    document.querySelector('#delivery').addEventListener('change', (event) => {
        document.querySelector('#deliveryRange').disabled = !event.target.checked
        document.querySelector('#deliveryPayment').disabled = !event.target.checked
    })

    document.querySelector('#useTelegram').addEventListener('change', (event) => {
        document.querySelector('#contactLink').disabled = event.target.checked
    })

    document.querySelector('#rulesAll').addEventListener('change', (event) => {
        document.querySelector('#rules1').checked = event.target.checked
        document.querySelector('#rules2').checked = event.target.checked
        document.querySelector('#rules3').checked = event.target.checked
    })

    document.querySelector('#country').addEventListener('change', (event) => {
        const icon = document.querySelector('#countryIcon')
        console.log(event.target.value)
        switch(event.target.value){
            case 'ru':
                icon.innerHTML = '<i class="em em-ru" aria-role="presentation" aria-label="Russia Flag"></i>'
                break;
            case 'ua':
                icon.innerHTML = '<i class="em em-flag-ua" aria-role="presentation" aria-label="Ukraine Flag"></i>'
                break;
            case 'kz':
                icon.innerHTML = '<i class="em em-flag-kz" aria-role="presentation" aria-label="Kazakhstan Flag"></i>'
                break;
            case 'by':
                icon.innerHTML = '<i class="em em-flag-by" aria-role="presentation" aria-label="Belarus Flag"></i>'
                break;
            case 'ge':
                icon.innerHTML = '<i class="em em-flag-ge" aria-role="presentation" aria-label="Georgia Flag"></i>'
                break;
            case 'ar':
                icon.innerHTML = '<i class="em em-flag-am" aria-role="presentation" aria-label="Armenia Flag"></i>'
                break;
        }
    }) 

    document.querySelector('#category').addEventListener('change', (event) => {
        const icon = document.querySelector('#categoryIcon')
        console.log(event.target.value)
        switch(event.target.value){
            case 'sph':
                icon.innerHTML = '<i class="bi bi-phone"></i>'
                break;
            case 'tab':
                icon.innerHTML = '<i class="bi bi-tablet"></i>'
                break;
            case 'pcn':
                icon.innerHTML = '<i class="bi bi-pc-display"></i>'
                break;
            case 'acc':
                icon.innerHTML = '<i class="bi bi-sd-card"></i>'
                break;
            case 'com':
                icon.innerHTML = '<i class="bi bi-pci-card"></i>'
                break;
            case 'par':
                icon.innerHTML = '<i class="bi bi-gear-wide"></i>'
                break;
            case 'per':
                icon.innerHTML = '<i class="bi bi-keyboard"></i>'
                break;
            case 'aud':
                icon.innerHTML = '<i class="bi bi-earbuds"></i>'
                break;
            case 'vid':
                icon.innerHTML = '<i class="bi bi-camera-reels"></i>'
                break;
            case 'con':
                icon.innerHTML = '<i class="bi bi-droplet"></i>'
                break;
            case 'pho':
                icon.innerHTML = '<i class="bi bi-camera2"></i>'
                break;
            case 'etc':
                icon.innerHTML = '<i class="bi bi-three-dots"></i>'
                break;
            case 'ser':
                icon.innerHTML = '<i class="bi bi-person-fill-gear"></i>'
                break;
            default:
                icon.innerHTML = '<i class="bi bi-hash"></i>'
                break;

            
        }
    }) 
    

    document.querySelectorAll('#rules1, #rules2, #rules3').forEach(el => el.addEventListener('change', e => {
            if (document.querySelector('#rules1').checked && document.querySelector('#rules2').checked && document.querySelector('#rules3').checked){
                document.querySelector('#rulesAll').checked = true
            }else{
                document.querySelector('#rulesAll').checked = false
            }
        })
    )

    document.querySelectorAll('a').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()
            tg.openLink(el.href, {try_instant_view: true})
        })
    })
    
    
    tg.MainButton.onClick(validateAndProceed)

    tg.ready()
})()