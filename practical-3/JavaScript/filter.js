const correspond = {
    "Название": "titleFilter",
    "Исполнитель": "authorFilter",
    "Жанр": "genreFilter",
    "Страна": "countryFilter",
    "Прослушивания": ["streamsFrom", "streamsTo"],
    "Год": ["yearFrom", "yearTo"]
}

/* Структура возвращаемого ассоциативного массива:
{
input_id: input_value,
...
}
*/
const dataFilter = (dataForm) => {
    let dictFilter = {};
    // перебираем все элементы формы с фильтрами
    for (const item of dataForm.elements) {
        // получаем значение элемента
        let valInput = item.value;
        // если поле типа text - приводим его значение к нижнему регистру
        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        }
        /* САМОСТОЯТЕЛЬНО обработать значения числовых полей:
        - если в поле занесено значение - преобразовать valInput к числу;
        - если поле пусто и его id включает From - занести в valInput
        -бесконечность
        - если поле пусто и его id включает To - занести в valInput
        +бесконечность
        */
        if (item.type === "number") {
            if (valInput === "" && item.id.includes("From")) {
                valInput = -Infinity;
                console.log(valInput, item.id);
            } 
            
            if (valInput === "" && item.id.includes("To")) {
                valInput = Infinity;
                console.log(valInput, item.id);
            } else {
                valInput = Number(valInput);
                console.log(valInput, item.id);
            }
             
        }
        // формируем очередной элемент ассоциативного массива
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
}

const filterTable = (data, idTable, dataForm) =>{
    // получаем данные из полей формы
    const datafilter = dataFilter(dataForm);
    // выбираем данные соответствующие фильтру и формируем таблицу из них
    let tableFilter = data.filter(item => {
    /* в этой переменной будут "накапливаться" результаты сравнения данных
    с параметрами фильтра */
        let result = true;
        // строка соответствует фильтру, если сравнение всех значения из input
        // со значением ячейки очередной строки - истина
        Object.entries(item).map(([key, val]) => {
            // текстовые поля проверяем на вхождение
            if (typeof val == 'string') {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]])
            }
            // САМОСТОЯТЕЛЬНО проверить числовые поля на принадлежность интервалу
            if (typeof val == 'number') {
                result &&= (val >= datafilter[correspond[key][0]] && val <= datafilter[correspond[key][1]]);
            }
        });
        return result;
    });
    // САМОСТОЯТЕЛЬНО вызвать функцию, которая очищает таблицу с id=idTable
    clearTable(idTable);
    // показать на странице таблицу с отфильтрованными строками

    createTable(tableFilter, idTable);
};

const clearFilter = (songs, idTable, dataForm) => {
    for (const item of dataForm.elements) {
        if (item.type === "button") {
            continue;
        }
        item.value = '';
    }
    clearTable(idTable);
    createTable(songs, idTable);
};
     