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

  const [resetKey, setResetKey] = useState(0);

  const handleFullReset = () => {
    setDataTable(props.data);
    setActivePage(1);
    setResetKey((prev) => prev + 1);
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
        key={`filter-${resetKey}`}
        filtering={updateDataTable}
        fullData={props.data}
        onFullReset={handleFullReset}
      />

      <h4>Сортировка</h4>
      <Sort
        key={`sort-${resetKey}`}
        data={dataTable}
        fullData={props.data}
        sorting={updateDataTable}
        onFullReset={handleFullReset}
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
