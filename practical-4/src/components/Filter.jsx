const Filter = (props) => {
  const { filterState, setFilterState } = props;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const filterField = {
      Название: filterState.name.toLowerCase(),
      Исполнитель: filterState.author.toLowerCase(),
      Жанр: filterState.genre.toLowerCase(),
      Страна: filterState.country.toLowerCase(),
      Год: [
        filterState.year_min !== "" ? Number(filterState.year_min) : -Infinity,
        filterState.year_max !== "" ? Number(filterState.year_max) : Infinity,
      ],
      Прослушивания: [
        filterState.streams_min !== ""
          ? Number(filterState.streams_min)
          : -Infinity,
        filterState.streams_max !== ""
          ? Number(filterState.streams_max)
          : Infinity,
      ],
    };

    let arr = props.fullData;

    for (const key in filterField) {
      const searchValue = filterField[key];

      if (Array.isArray(searchValue)) {
        const [min, max] = searchValue;
        if (min !== -Infinity || max !== Infinity) {
          arr = arr.filter((item) => {
            const itemValue = Number(item[key]);
            return itemValue >= min && itemValue <= max;
          });
        }
      } else if (searchValue !== "") {
        arr = arr.filter((item) =>
          String(item[key]).toLowerCase().includes(searchValue),
        );
      }
    }

    props.filtering(arr);
  };

  const handleReset = (e) => {
    e.preventDefault();
    props.onClearAll();
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} className="filter-form">
      <p>
        <label>Название: </label>
        <input
          name="name"
          type="text"
          value={filterState.name}
          onChange={handleChange}
        />
      </p>
      <p>
        <label>Исполнитель: </label>
        <input
          name="author"
          type="text"
          value={filterState.author}
          onChange={handleChange}
        />
      </p>
      <p>
        <label>Жанр: </label>
        <input
          name="genre"
          type="text"
          value={filterState.genre}
          onChange={handleChange}
        />
      </p>
      <p>
        <label>Страна: </label>
        <input
          name="country"
          type="text"
          value={filterState.country}
          onChange={handleChange}
        />
      </p>

      <p>
        <label>Год: </label>
        от{" "}
        <input
          name="year_min"
          type="number"
          className="number-input"
          value={filterState.year_min}
          onChange={handleChange}
        />
        до{" "}
        <input
          name="year_max"
          type="number"
          className="number-input"
          value={filterState.year_max}
          onChange={handleChange}
        />
      </p>
      <p>
        <label>Прослушивания: </label>
        от{" "}
        <input
          name="streams_min"
          type="number"
          className="number-input"
          step="0.1"
          value={filterState.streams_min}
          onChange={handleChange}
        />
        до{" "}
        <input
          name="streams_max"
          type="number"
          className="number-input"
          step="0.1"
          value={filterState.streams_max}
          onChange={handleChange}
        />
      </p>

      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset" style={{ marginLeft: "10px" }}>
          Сбросить всё
        </button>
      </p>
    </form>
  );
};

export default Filter;