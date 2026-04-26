/*
   компонент, для фильтрации таблицы
*/

const Filter = (props) => {
    const handleSubmit= (event) => {        
        event.preventDefault();		

		const filterField = {
			"Название": event.target["structure"].value.toLowerCase(),
		    "Тип": event.target["type"].value.toLowerCase(),
            "Страна": event.target["country"].value.toLowerCase(),
            "Город": event.target["city"].value.toLowerCase(),
            "Год": [
                event.target["year_min"].value !== "" ? Number(event.target["year_min"].value) : -Infinity,
                event.target["year_max"].value !== "" ? Number(event.target["year_max"].value) : Infinity
            ],
            "Высота": [
                event.target["height_min"].value !== "" ? Number(event.target["height_min"].value) : -Infinity,
                event.target["height_max"].value !== "" ? Number(event.target["height_max"].value) : Infinity
            ]
	    };
			
        let arr = props.fullData;
        for(const key in  filterField) {
			const searchValue = filterField[key];

            if (Array.isArray(searchValue)) {
                const [min, max] = searchValue;
                
                // Если хотя бы одно значение не равно бесконечности, значит юзер что-то ввел
                if (min !== -Infinity || max !== Infinity) {
                    arr = arr.filter(item => {
                        const itemValue = Number(item[key]);
                        // Эквивалент: itemValue >= min AND itemValue <= max
                        return itemValue >= min && itemValue <= max;
                    });
                }
            } 
            // Обработка строковых полей (как было раньше)
            else if (searchValue !== "") {
                arr = arr.filter(item => 
                    String(item[key]).toLowerCase().includes(searchValue)
                );  
            } 
        }  
        
        props.filtering(arr);
	}

    const handleReset = () => {
        props.filtering(props.fullData);
    };

    return (
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <p>
          <label>Название:</label>
          <input name="structure" type="text" />
        </p>  
        <p>
          <label>Type:</label>		
          <input name="type" type="text" />
        </p>
        <p>
          <label>Страна: </label>		
          <input name="country" type="text" />
        </p>
        <p>
          <label>Город: </label>		
          <input name="city" type="text" />
        </p>
        <p>
          <label>Год: </label>		
          от <input name="year_min" type="number" className="number-input" />
          до <input name="year_max" type="number" className="number-input" />
        </p>
        <p>
          <label>Высота: </label>		
          от <input name="height_min" type="number" className="number-input" step="0.1" />
          до <input name="height_max" type="number" className="number-input" step="0.1" />
        </p>
        <p>         
          <button type="submit">Фильтровать</button>   
		  <button type="reset">Очистить фильтр</button>
		</p>  
      </form> 
    )
}

export default Filter;