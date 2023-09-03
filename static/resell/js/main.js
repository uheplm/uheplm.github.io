let tg = window.Telegram.WebApp; //получаем объект webapp телеграма 

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
    fallback.style.zIndex = '5';
    fallback.style.opacity = '1'

    tg.MainButton.setText("Круто, спасибо"); //изменяем текст кнопки иначе
    tg.MainButton.color = "#143F6B";

    setTimeout(tg.close, 4500)
}

const valueOf = (id) => document.querySelector(id) ? document.querySelector(id).value : undefined
const isChecked = (id) => document.querySelector(id) ? document.querySelector(id).checked : undefined

hash_class = [
    "#смартфон", "#планшет", "#пк_ноутбуки", "#аксессуары",
    "#комплектующие", "#запчасти", "#периферия", "#аудио",
    "#вейпинг", "#расходники", "#прочее"
]

function collectData(){
    return {
        action: 'create',
        name: valueOf('#name'),
        type: document.querySelector('#typeBuy').checked ? 'buy' : document.querySelector('#typeService').checked ? 'service' : 'sell',
        description: valueOf('#description'),
        price: {
            isContractPrice: isChecked('#contractPrice '),
            exchange: isChecked('#exchange'),
            price: valueOf('#price') | '',
            currency: valueOf('#currency') | ''
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
    tg.MainButton.text = "Сохранить"; //изменяем текст кнопки 
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
            case 'vaa':
                icon.innerHTML = '<i class="bi bi-earbuds"></i>'
                break;
            case 'con':
                icon.innerHTML = '<i class="bi bi-droplet"></i>'
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
    
    const form = document.querySelector('#mainForm')
    
    tg.MainButton.onClick(() => {
        if(!form.checkValidity()){
            tg.HapticFeedback.notificationOccurred('error')
            shake()
        }else{
            tg.HapticFeedback.notificationOccurred('success')
            showFallback()
            tg.sendData()
        }
        form.classList.add('was-validated')
    })

    tg.ready()
})()