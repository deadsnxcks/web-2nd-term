/*формируем массив для сортировки по двум уровням вида 
  [
    {column: номер столбца, по которому осуществляется сортировка, 
     direction: порядок сортировки (true по убыванию, false по возрастанию)
    }, 
    ...
   ]
*/
const createSortArr = (data) => {
    let sortArr = [];
    
    const sortSelects = data.getElementsByTagName('select');
    
    for (const item of sortSelects) {   
       // получаем номер выбранной опции
        const keySort = item.value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort == 0) {
            break;
        }
        // получаем порядок сортировки очередного уровня
        // имя флажка сформировано как имя поля SELECT и слова Desc
        const desc = document.getElementById(item.id + 'Desc').checked;
        // очередной элемент массива - по какому столбцу и в каком порядке сортировать 
        sortArr.push(
          {column: keySort - 1, 
           direction: desc}
        ); 
    }
    return sortArr; 
};

const sortTable = (idTable, formData) => {
    
    // формируем управляющий массив для сортировки
    const sortArr = createSortArr(formData);
    
    // сортировать таблицу не нужно, во всех полях выбрана опция Нет
    
    //находим нужную таблицу
    let table = document.getElementById(idTable);

    // преобразуем строки таблицы в массив 
    let rowData = Array.from(table.rows);
    
    // удаляем элемент с заголовками таблицы
    const headerRow = rowData.shift();
    
    //сортируем данные по всем уровням сортировки
    rowData.sort((first, second) => {
        for (let { column, direction } of sortArr) {
            const firstCell = first.cells[column].innerHTML;
            const secondCell = second.cells[column].innerHTML;

            const isNumericColumn = (column === 4 || column === 5);

            if (isNumericColumn) {
                const n1 = parseFloat(firstCell);
                const n2 = parseFloat(secondCell);
            
                if (n1 !== n2) {
                    return direction ? n2 - n1 : n1 - n2;
                }
            } else {
                const comparison = firstCell.localeCompare(secondCell);
                if (comparison !== 0) {
                    return direction ? - comparison : comparison;
                }
            }
        }
        return 0; 
    });
    
    //выводим отсортированную таблицу на страницу
    table.append(headerRow);
	
	let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
	table.append(tbody);
}

const resetSort = (idTable, formData) => {
    for (const item of formData.elements) {
        if (item.tagName === 'SELECT') {
            item.value = 0;
        } else if (item.type === 'checkbox') {
            item.checked = false;
        }   
    }

    allSelect = formData.getElementsByTagName('select');
    for (let i = 1; i < allSelect.length; i++) {
        allSelect[i].disabled = true;   
    }

    clearFilter(buildings, idTable, document.getElementById('filter'));
}