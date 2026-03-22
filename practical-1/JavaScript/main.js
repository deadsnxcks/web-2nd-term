document.addEventListener("DOMContentLoaded", function() {
    createTable(songs, 'list');
    setSortSelects(songs[0], document.getElementById('sort'));
});

document.getElementById('search').addEventListener('click', function() {
    filterTable(songs, 'list', document.getElementById('filter'));
    console.log('click');
});

document.getElementById('clearFilter').addEventListener('click', function() {
    clearFilter(songs, 'list', document.getElementById('filter'));
    resetSort('list', document.getElementById('sort'));
    console.log('click');
});

// Когда меняется ПЕРВОЕ поле
document.getElementById('fieldsFirst').addEventListener('change', function(event) {
    changeNextSelect(event.target, 'fieldsSecond', 'fieldsThird');
});

// Когда меняется ВТОРОЕ поле
document.getElementById('fieldsSecond').addEventListener('change', function(event) {
    changeNextSelect(event.target, 'fieldsThird');
});

document.getElementById('sortBtn').addEventListener('click', function() {
    sortTable('list', document.getElementById('sort'));
});

document.getElementById('resetSortBtn').addEventListener('click', function() {
    resetSort('list', document.getElementById('sort'));
});

// формирование полей элемента списка с заданным текстом и значением

const createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

// формирование поля со списком 
// параметры – массив со значениями элементов списка и элемент select

const setSortSelect = (arr, sortSelect) => {
    
    // создаем OPTION Нет и добавляем ее в SELECT
    sortSelect.append(createOption('Нет', 0));
    // перебираем массив со значениями опций
    arr.forEach((item, index) => {
       // создаем OPTION из очередного ключа и добавляем в SELECT
       // значение атрибута VALUE увеличиваем на 1, так как значение 0 имеет опция Нет
        sortSelect.append(createOption(item, index + 1));
    });
}

// формируем поля со списком для многоуровневой сортировки
const setSortSelects = (data, dataForm) => { 

    // выделяем ключи словаря в массив
    const head = Object.keys(data);

    // находим все SELECT в форме
    const allSelect = dataForm.getElementsByTagName('select');
    
    for(const item of dataForm.elements){
        // формируем очередной SELECT
        setSortSelect(head, item);
        
        for (let i = 1; i < allSelect.length; i++) {
            allSelect[i].disabled = true;   
        }
        // САМОСТОЯТЕЛЬНО все SELECT, кроме первого, сделать неизменяемым
    }
}

// настраиваем поле для следующего уровня сортировки
const changeNextSelect = (curSelect, nextSelectId, thirdSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);
    let thirdSelect = thirdSelectId ? document.getElementById(thirdSelectId) : null;

    // Активируем следующий селект
    nextSelect.disabled = false;
    
    // Если есть третий селект (мы меняем первое поле), 
    // его нужно заблокировать и сбросить, так как цепочка прервана
    if (thirdSelect) {
        thirdSelect.disabled = true;
        thirdSelect.value = 0;
    }

    // Копируем опции
    nextSelect.innerHTML = curSelect.innerHTML;

    // Удаляем выбранную опцию
    if (curSelect.value != 0) {
        // Используем selectedIndex, так как метод remove() ожидает индекс элемента
        nextSelect.remove(curSelect.selectedIndex);
    } else {
        nextSelect.disabled = true;
    }
}