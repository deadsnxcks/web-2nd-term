/*
   компонент, для фильтрации таблицы
*/

const Filter = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const filterField = {
      Название: event.target["name"].value.toLowerCase(),
      Исполнитель: event.target["author"].value.toLowerCase(),
      Жанр: event.target["genre"].value.toLowerCase(),
      Страна: event.target["country"].value.toLowerCase(),
      Год: [
        event.target["year_min"].value !== ""
          ? Number(event.target["year_min"].value)
          : -Infinity,
        event.target["year_max"].value !== ""
          ? Number(event.target["year_max"].value)
          : Infinity,
      ],
      Прослушивания: [
        event.target["streams_min"].value !== ""
          ? Number(event.target["streams_min"].value)
          : -Infinity,
        event.target["streams_max"].value !== ""
          ? Number(event.target["streams_max"].value)
          : Infinity,
      ],
    };

    let arr = props.fullData;
    for (const key in filterField) {
      const searchValue = filterField[key];

      if (Array.isArray(searchValue)) {
        const [min, max] = searchValue;

        // Если хотя бы одно значение не равно бесконечности, значит юзер что-то ввел
        if (min !== -Infinity || max !== Infinity) {
          arr = arr.filter((item) => {
            const itemValue = Number(item[key]);
            // Эквивалент: itemValue >= min AND itemValue <= max
            return itemValue >= min && itemValue <= max;
          });
        }
      }
      // Обработка строковых полей (как было раньше)
      else if (searchValue !== "") {
        arr = arr.filter((item) =>
          String(item[key]).toLowerCase().includes(searchValue),
        );
      }
    }

    props.filtering(arr);
  };

  const handleReset = () => {
    props.filtering(props.fullData);
  };

  return (
    <form onSubmit={handleSubmit} onReset={props.onFullReset}>
      <p>
        <label>Название:</label>
        <input name="name" type="text" />
      </p>
      <p>
        <label>Исполнитель:</label>
        <input name="author" type="text" />
      </p>
      <p>
        <label>Жанр: </label>
        <input name="genre" type="text" />
      </p>
      <p>
        <label>Страна: </label>
        <input name="country" type="text" />
      </p>
      <p>
        <label>Год: </label>
        от <input
          name="year_min"
          type="number"
          className="number-input"
        /> до <input name="year_max" type="number" className="number-input" />
      </p>
      <p>
        <label>Прослушивания:</label>
        от{" "}
        <input
          name="streams_min"
          type="number"
          className="number-input"
          step="0.1"
        />{" "}
        до{" "}
        <input
          name="streams_max"
          type="number"
          className="number-input"
          step="0.1"
        />
      </p>
      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset">Очистить фильтр</button>
      </p>
    </form>
  );
};

export default Filter;
