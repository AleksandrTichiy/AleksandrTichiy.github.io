// region Сортировка динамических таблиц
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