document.addEventListener("DOMContentLoaded", function() {
    createTable(buildings, 'list');
    setSortSelects(buildings[0], document.getElementById('sort'));
});

document.getElementById('search').addEventListener('click', function() {
    filterTable(buildings, 'list', document.getElementById('filter'));
    console.log('click');
});

document.getElementById('reset').addEventListener('click', function() {
    clearFilter(buildings, 'list', document.getElementById('filter'));
    resetSort('list', document.getElementById('sort'));
    console.log('click');
});

const fieldsFirst = document.getElementById('fieldsFirst');

document.getElementById('fieldsFirst').addEventListener('change', function(event) {
    changeNextSelect(fieldsFirst, 'fieldsSecond');
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
		
        // САМОСТОЯТЕЛЬНО все SELECT, кроме первого, сделать неизменяемым
    }

    for (let i = 1; i < allSelect.length; i++) {
        allSelect[i].disabled = true;   
    }
}

// настраиваем поле для следующего уровня сортировки
const changeNextSelect = (curSelect, nextSelectId) => {
    
    let nextSelect = document.getElementById(nextSelectId);
    
    nextSelect.disabled = false;
    
    // в следующем SELECT выводим те же option, что и в текущем
    nextSelect.innerHTML = curSelect.innerHTML;
    
    // удаляем в следующем SELECT уже выбранную в текущем опцию
    // если это не первая опция - отсутствие сортировки
    if (curSelect.value != 0) {
       nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
    }
}