// region Сортировка динамических таблиц
/**
 * Author: Aleksandr Tichiy
 * Динамическая сортировка сложных списков
 */
document.addEventListener('DOMContentLoaded', function() {
    const lists = [...document.querySelectorAll('.table--sortable-list')];
    for (const list of lists) {
        const headers = document.querySelectorAll('.table--sortable');
        const rows = list.querySelectorAll('.table--sortable-item');

        // Направление сортировки
        const directions = Array.from(headers).map(function(header) {
            return '';
        });

        // Преобразовать содержимое данной ячейки в заданном столбце
        const transform = function(index, content) {
            // Получить тип данных столбца
            const type = headers[index].getAttribute('data-type')
            const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
            console.log(content)
            switch (type) {
                case 'number':
                    return parseFloat(content);
                case 'date':
                    return new Date(content.replace(pattern,'$3-$2-$1'));
                case 'string':
                default:
                    return content;
            }
        };

        const sortColumn = function(index) {
            // Получить текущее направление
            const direction = index === 0 ? (directions[index] || 'desc') : (directions[index] || 'asc');

            // Фактор по направлению
            const multiplier = (direction === 'asc') ? 1 : -1;

            const newRows = Array.from(rows);

            //Снимаем активность ячейки
            for (let i = 0; i < headers.length; i++){
                headers[i].classList.remove('--active')
                headers[i].setAttribute('data-direction', 'asc')
            }

            //Меняем направление svg
            headers[index].classList.add('--active')
            headers[index].setAttribute('data-direction', direction)

            let data = 'data-name';
            if(headers[index].getAttribute('data-type') === 'date') data = 'data-date'

            newRows.sort(function(rowA, rowB) {
                const cellA = rowA.getAttribute(data);
                const cellB = rowB.getAttribute(data);

                const a = transform(index, cellA);
                const b = transform(index, cellB);

                switch (true) {
                    case a > b: return 1 * multiplier;
                    case a < b: return -1 * multiplier;
                    case a === b: return 0;
                }
            });

            // Удалить старые строки
            [].forEach.call(rows, function(row) {
                list.removeChild(row);
            });

            // Поменять направление
            directions[index] = direction === 'asc' ? 'desc' : 'asc';

            // Добавить новую строку
            newRows.forEach(function(newRow) {
                list.appendChild(newRow);
            });
        };

        [].forEach.call(headers, function(header, index) {
            header.addEventListener('click', function() {
                sortColumn(index);
            });
        });
    }
});
// endregion

// region AT_POPUP - всплывающие окна
/**
 * Author: Aleksandr Tichiy
 * Универсальный скрипт показа\обработки popup окон
 */
let AT_POPUP = {};

document.addEventListener("DOMContentLoaded", function () {
    //Строгий режим
    "use strict";

    //CONFIG SECTION
    const className = {
        close: 'd--close',// Класс при клике на который скрывается диалог
        show: 'd--show', // Класс при клике на который вызывается диалог
        dialog: 'd--dialog', // Класс контейнера формы
        form: 'd--form', //Класс формы
        submit: 'd--submit', //Кнопка сабмита
        focus: 'd--focus', //Элемент на котором нужно установить фокус
        activation: 'd--active', // Класс активации нужной формы
        formSuccess: 'd--formSuccess', // id формы успеха
        row: 'd--row', //Класс обертки для поля ввода
        validatation: 'd--required', // Класс для валидации
        success: 'd--success', // Класс успешной валидации
        error: 'd--error', // Класс ошибки валидации

        product: 'js--product', // Класс ошибки валидации
        disabled: 'd--disabled', //Класс отключенного поля или кнопки

        custom: 'd--custom', // Класс ошибки валидации

        phone: 'd--PHONE', //поле телефона
        email: 'd--EMAIL', //поле почты
        mail: 'd--MAIL', //поле почты
        name: 'd--NAME', //поле Имя
    }

    const config = {
        validate: true, // Нужна валидация формы или нет
        scrollDisable: true, // Отключаем скролл
        clickToBackCloseForm: true, // Закрытие формы при клике на черный фон
    }

    //application object map
    var application = {
        event: {},
        tools: {},
        check: {},
        ajax: {},
        elements: {
            dialog: document.querySelector('.' + className.dialog),
            close: document.querySelector('.' + className.close),
        },
    }

    //AJAX SECTION
    // region application.ajax.send -- Отправка через ajax
    application.ajax.send = function(data){
        // region Modern fetch fucntion
        fetch(data.url, {
            method: "POST",
            body: JSON.stringify(data.data),
            headers:{"content-type": "application/x-www-form-urlencoded"}
        })
            .then( (response) => {
                if (response.status !== 200) {
                    return Promise.reject();
                }
                return response.text()
            })
            .then(i => console.log(i))
            .catch(() => console.log('ошибка'));
        // endregion
        // region jQuery ajax function for comptability
        /*$.ajax({
            url: data.url,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data.data),
            async: true,
            success: function(response) {
                if(aHelper().isJson(response))
                    window[data.callback](response, data)
            },
            beforeSend: function(jqXHR, settings){
                application.tools.launchLoader(forEngageloader);
            },
            complete: function(jqXHR, textStatus){
                application.tools.stopLoader(forEngageloader);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.error({httpResponse: jqXHR.responseText, status: jqXHR.statusText});
                console.error(jqXHR, textStatus, errorThrown);
            }
        });*/
        // endregion
    };
    // endregion

    //CHECK SECTION
    // region application.check.event -- Общая функция проверки кликов
    application.check.event = function(e){
        application.elements.element = e.target

        // region Проверяем был ли клик по крестику
        var el = e.target.closest('.' + className.close)
        if (!!el) application.tools.fadeOut()
        // endregion
        // region Проверяем был ли клик по кнопке с вызовом формы
        el = e.target.closest('.' + className.show)
        if (!!el) {
            var current = el.getAttribute('data-form')

            application.tools.show(current)

            e.preventDefault()
            e.stopPropagation()
        }
        // endregion
        // region Проверяем был ли клик по темному фону, но не форме
        if (e.target.classList.contains(className.dialog) && application.tools.isVisible(application.elements.dialog) && config.clickToBackCloseForm) {
            application.tools.fadeOut()
        }
        // endregion

        // region Инкремент товара в покупке в 1 клик
        el = e.target.closest('.d--product-increment')
        if(!!el){
            var input = document.querySelector('[name="BUY_ONE_CLICK_QUANTITY"]')

            if(!!input) input.value = parseInt(input.value) + 1
        }
        // endregion
        // region Декремент товара в покупке в 1 клик
        el = e.target.closest('.d--product-decrement')
        if(!!el){
            var input = document.querySelector('[name="BUY_ONE_CLICK_QUANTITY"]')

            if(!!input){
                var val = parseInt(input.value) - 1
                input.value = (val >= 1 ? val : 1)
            }
        }
        // endregion
        // region При нажатии d--submit делаем валидацию
        if (e.target.closest('.' + className.submit + ':not(.' + className.disabled + ')')) {
            form = e.target.closest('form');

            if(!!form){
                if(form.classList.contains('do--restore'))
                    application.tools.setSkipElements(form, form.querySelector('.custom-radio:checked').value)

                application.check.validate(form)
            }
        }
        // endregion

        // region Submit button Event example -- Восстановление пароля
        if (e.target.closest('.js--d--restore')) {
            var form = e.target.closest('form');

            if(!!form){
                if(api.formSubmit(form)){
                    let data = {
                        url: '/ajax/user/restore/',
                        callback: 'userRestore',
                        data: {
                            sessid: BX.bitrix_sessid()
                        },
                    };

                    var dop = api.serialize(new FormData(form));
                    data.data = Object.assign(data.data, dop);

                    BX.showWait();

                    clearTimeout(formTimeout);

                    new Promise(resolve => api.sendRequest(data));
                }
            }
        }
        // endregion
    };
    // endregion
    // region application.check.input -- Проверка изменения текстовых полей
    application.check.input = function(e){
        application.elements.element = e.target

        //Проверяем было ли изменено текстовое поле
        if (e.target.classList.contains(className.validatation) && config.validate) {
            application.check.validate(e.target.closest('form'));
        }
    };
    // endregion
    // region application.check.validate - Валидация форм
    application.check.validate = function(form){
        let flag = 0,
            reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            reg_phone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/

        const formElems = [...form.querySelectorAll('.' + className.validatation)]

        for (const formElem of formElems) {
            var value = formElem.value,
                row = formElem.closest('.' + className.row);

            if (formElem.classList.contains(className.phone)) {
                if (reg_phone.test(value)) {
                    row.classList.add(className.success);
                    row.classList.remove(className.error);
                } else {
                    row.classList.remove(className.success);
                    row.classList.add(className.error);
                    flag++;
                }
            } else if (formElem.classList.contains(className.email)) {
                if (reg_email.test(value)) {
                    row.classList.add(className.success);
                    row.classList.remove(className.error);
                } else {
                    row.classList.remove(className.success);
                    row.classList.add(className.error);
                    flag++;
                }
            } else if (formElem.classList.contains(className.name)) {
                if (value.length > 2) {
                    row.classList.add(className.success);
                    row.classList.remove(className.error);
                } else {
                    row.classList.remove(className.success);
                    row.classList.add(className.error);
                    flag++;
                }
            } else if (formElem.classList.contains(className.mail)) {
                //Пропускаем фиктивное поля для остановки ботов
                //Рекомендую вам сменить имя и тип проверки на ботов
            } else {
                if (value) {
                    row.classList.add(className.success);
                    row.classList.remove(className.error);
                } else {
                    row.classList.remove(className.success);
                    row.classList.add(className.error);
                    flag++;

                }
            }
        }

        return flag ? false : true
    };
    // endregion

    //EVENTS SECTION
    // region application.event.click -- клик
    application.event.click = (e) => application.check.event(e)
    // endregion
    // region application.event.keydown -- нажатия клавиш
    application.event.keydown = (e) => {
        if (e.keyCode === 27) application.tools.fadeOut() //Esc
    }
    // endregion
    // region application.event.change -- Отслеживаем изменения текстовых полей
    application.event.change = (e) => application.check.input(e)
    // endregion
    // region application.event.input -- Отслеживаем ввод в текстовые поля
    application.event.input = (e) => application.check.input(e)
    // endregion

    //TOOLS SECTION
    // region application.tools.fadeOut -- Скрываем диалог
    application.tools.fadeOut = () =>{
        if (config.scrollDisable) application.tools.enableScroll();

        let opacity = 1,
            el = application.elements.dialog;

        if (!!el && application.tools.isVisible(el)) {
            el.style.display = "flex";

            var timer = setInterval(() => {
                if (opacity <= 0.01) {
                    clearInterval(timer);
                    el.style.display = "none";

                    //После сокрытия формы подчищаем все хвосты
                    application.tools.customToolsRemove()
                }
                el.style.opacity = opacity;
                opacity -= opacity * 0.1;
            }, 5);
        }
    };
    // endregion
    // region application.tools.fadeIn -- Показываем диалог
    application.tools.fadeIn = () =>{
        let d = application.elements.dialog,
            opacity = 0.01;

        if (d && application.tools.isHidden(d)) {
            d.style.opacity = opacity;
            d.style.display = "flex";

            var timer = setInterval(() => {
                if (opacity >= 1) {
                    clearInterval(timer);

                    if (config.scrollDisable) application.tools.disableScroll()
                }
                d.style.opacity = opacity;
                opacity += opacity * 0.1;
            }, 5);
        }
    };
    // endregion
    // region application.tools.show -- Показываем форму
    application.tools.show = (form) =>{
        var focus = application.elements.dialog.querySelector( '.' + form + ' .' + className.focus)

        application.tools.customToolsAdd(form);
        application.tools.hideAndShowNeeded(form);
        application.tools.fadeIn();

        if(!!focus) focus.focus();
    };
    // endregion
    // region application.tools.hideAndShowNeeded -- Если уже видна какая-либо форма, то скрываем ее и показываем нужную
    application.tools.hideAndShowNeeded = (need) => {
        const forms = [...application.elements.dialog.querySelectorAll('.' + className.form)];

        for (const form of forms) {
            if (form.classList.contains(need))
                form.classList.add(className.activation);
            else
                form.classList.remove(className.activation);
        }
    };
    // endregion
    // region application.tools.customToolsAdd -- Добавляем кастомные обработчики
    application.tools.customToolsAdd = (formClass) => {
        var form = application.elements.dialog.querySelector('.' + formClass);
        console.log(formClass)
        console.log(form)
        if(!!form){
            if(form.classList.contains(className.custom))
                application.elements.dialog.classList.add(className.custom);

            if(formClass === 'd--adress'){
                document.querySelector('.d--dialog').classList.add('d--popup-adres')
            }

            if(formClass === 'do--table'){
                application.elements.dialog.classList.add('popup--big')
                form.querySelector('.d--body').innerHTML = application.elements.element.closest('.detail--scu-table').querySelector('.table--form-html').innerHTML
            }
        }
    };
    // endregion
    // region application.tools.customToolsRemove -- Убираем кастомные обработчики формы
    application.tools.customToolsRemove = () => {
        application.elements.dialog.classList.remove(config.customDialogClass)
        application.elements.dialog.classList.remove('d--popup-adres')
        application.elements.dialog.classList.remove('popup--big')
    };
    // endregion
    // region application.tools.getActiveForm -- Получаем активную форму
    application.tools.getActiveForm = (form) => {
        return application.elements.dialog.querySelector('.' + form)
    }
    // endregion
    // region application.tools.isHidden -- Проверяем скрыта ли форма
    application.tools.isHidden = (el) => {
        return (el.offsetParent === null)
    }
    // endregion
    // region application.tools.isVisible -- Проверяем видна ли форма
    application.tools.isVisible = (el) => {
        return !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
    // endregion
    // region application.tools.serialize -- Сериализириуем данные формы
    application.tools.serialize = (data) => {
        let obj = {};
        for (let [key, value] of data) {
            if(!value) continue;

            if (obj[key] !== undefined) {
                if (!Array.isArray(obj[key])) {
                    obj[key] = [obj[key]];
                }
                obj[key].push(value);
            } else {
                obj[key] = value;
            }
        }
        return obj;
    }
    // endregion
    // region application.tools.reloadPage -- Перезагружаем страницу
    application.tools.reloadPage = (time) => {
        setTimeout(() => {
            document.location.reload(true)
        }, time);
    }
    // endregion
    // region application.tools.enableScroll -- Разрешаем скролл
    application.tools.enableScroll = () => {
        document.querySelector('html').removeAttribute('style');
        document.body.removeAttribute('style');

        window.scrollTo(0, sessionStorage.getItem('scrollPosition')|0);
    }
    // endregion
    // region application.tools.disableScroll -- Запрещаем скролл
    application.tools.disableScroll = () => {
        //if(document.body.clientWidth < 990) {
        document.querySelector('html').style.height = window.innerHeight + 'px';

        var scrollPosition = window.pageYOffset;
        sessionStorage.setItem('scrollPosition', scrollPosition)

        document.body.setAttribute('style', 'height: ' + window.innerHeight + 'px;width: 100%;position: fixed;overflow: hidden;');
        //}
    }
    // endregion

    //write to global var
    AT_POPUP = application;

    //Отслеживаем системные события
    document.addEventListener('click', application.event.click);
    document.addEventListener('keydown', application.event.keydown);
    document.addEventListener('input', application.event.input);
    document.addEventListener('change', application.event.change);
});
// endregion


/* Domcontent Load Start */
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('click', function (e) {
        var el = e.target;

        //Показываем\скрываем фейк выпадающий список
        target = el.closest('.select--list-visible')
        if(!!target){
            var span = target.querySelector('span'),
                parent = target.closest('.select--list'),
                opened = parent.classList.contains('opened');

            let selects = document.querySelectorAll('.select--list.opened');
            for (let i = 0; i < selects.length; i++)
                selects[i].classList.remove('opened');

            if(opened){
                parent.classList.remove('opened')
            }else{
                parent.classList.add('opened')
            }
        }

        //Выбираем вариант фейка выпадающего списка
        target = el.closest('.select--list-item:not(.selected)')
        if(!!target){
            var parent = target.closest('.select--list'),
                visible = parent.querySelector('.select--list-visible span');

            parent.classList.remove('opened')
            visible.innerHTML = target.innerHTML

            parent.querySelector('[type="hidden"]').value = target.textContent

            let selects = parent.querySelectorAll('.select--list-item');
            for (let i = 0; i < selects.length; i++)
                selects[i].classList.remove('selected');

            target.classList.add('selected');
        }

        //Скрываем фейковые селекты при любом клике вовне
        target = el.closest('.select--list')
        if(!!target) {
        }else{
            let selects = document.querySelectorAll('.select--list');
            for (let i = 0; i < selects.length; i++)
                selects[i].classList.remove('opened');
        }
    });
});
/* Domcontent Load Ends */