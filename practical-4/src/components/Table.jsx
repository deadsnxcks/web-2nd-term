import TableHead from "./TableHead.jsx";
import TableBody from "./TableBody.jsx";
import Filter from "./Filter.jsx";
import Sort from "./Sort.jsx";
import { useState } from "react";

/*
   компонент, выводящий на страницу таблицу с пагинацией
   пропсы:
      data - данные для таблицы в виде массива объектов
*/

const Table = (props) => {
  const [dataTable, setDataTable] = useState(props.data);

  const [activePage, setActivePage] = useState(1);

  const [sortState, setSortState] = useState({
    level1: "",
    desc1: false,
    level2: "",
    desc2: false,
    level3: "",
    desc3: false,
  });

  const [filterState, setFilterState] = useState({
    name: "",
    author: "",
    genre: "",
    country: "",
    year_min: "",
    year_max: "",
    streams_min: "",
    streams_max: "",
  });

  const handleClearAll = () => {
    setDataTable(props.data);
    
    setSortState({
      level1: "",
      desc1: false,
      level2: "",
      desc2: false,
      level3: "",
      desc3: false,
    });

    setFilterState({
      name: "",
      author: "",
      genre: "",
      country: "",
      year_min: "",
      year_max: "",
      streams_min: "",
      streams_max: "",
    });
  };

  const updateDataTable = (filteredArray) => {
    setDataTable(filteredArray);
    setActivePage(1);
  };

  const changeActive = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const amount = props.pagination ? Number(props.amountRows) : dataTable.length;

  const n = Math.ceil(dataTable.length / amount);
  const arr = Array.from({ length: n }, (v, i) => i + 1);

  const pages = arr.map((item, index) => (
    <span
      key={index}
      className={item === activePage ? "active-page" : "page-link"}
      onClick={() => changeActive(item)}
    >
      {item}
    </span>
  ));

  return (
    <>
      <h4>Фильтры</h4>
      <Filter
        filtering={updateDataTable}
        fullData={props.data}
        filterState={filterState}
        setFilterState={setFilterState}
        onClearAll={handleClearAll}
      />

      <h4>Сортировка</h4>
      <Sort
        data={dataTable}
        fullData={props.data}
        sorting={updateDataTable}
        sortState={sortState}
        setSortState={setSortState}
        onClearAll={handleClearAll}
      />

      <table>
        <TableHead head={Object.keys(props.data[0])} />
        <TableBody body={dataTable} amountRows={amount} numPage={activePage} />
      </table>

      {props.pagination && dataTable.length > amount && (
        <div className="pagination-block">{pages}</div>
      )}
    </>
  );
};

export default Table;
