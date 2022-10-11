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