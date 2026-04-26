import { useState } from "react";

const Sort = (props) => {
  const columns = props.data.length > 0 ? Object.keys(props.data[0]) : [];

  const [level1, setLevel1] = useState("");
  const [desc1, setDesc1] = useState(false);

  const [level2, setLevel2] = useState("");
  const [desc2, setDesc2] = useState(false);

  const [level3, setLevel3] = useState("");
  const [desc3, setDesc3] = useState(false);

  const handleLevel1Change = (e) => {
    const val = e.target.value;
    setLevel1(val);
    if (val === "") {
      setLevel2("");
      setLevel3("");
    }
  };

  const handleLevel2Change = (e) => {
    const val = e.target.value;
    setLevel2(val);
    if (val === "") {
      setLevel3("");
    }
  };

  const handleLevel3Change = (e) => {
    setLevel3(e.target.value);
  };

  const renderOptions = (currentSelected, avoid1, avoid2) => {
    // Оставляем только те колонки, которые не равны avoid1 и avoid2
    const availableColumns = columns.filter(
      (col) => col !== avoid1 && col !== avoid2,
    );

    return (
      <>
        <option value="">Нет</option>
        {availableColumns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </>
    );
  };

  const handleSort = (e) => {
    e.preventDefault();

    const rules = [];
    if (level1) rules.push({ field: level1, desc: desc1 });
    if (level2) rules.push({ field: level2, desc: desc2 });
    if (level3) rules.push({ field: level3, desc: desc3 });

    if (rules.length === 0) return;

    const sortedData = [...props.data];

    sortedData.sort((a, b) => {
      for (let rule of rules) {
        let valA = a[rule.field];
        let valB = b[rule.field];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA === valB) continue;

        const order = rule.desc ? -1 : 1;

        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
      }
      return 0;
    });

    props.sorting(sortedData);
  };

  const handleReset = () => {
    setLevel1("");
    setDesc1(false);
    setLevel2("");
    setDesc2(false);
    setLevel3("");
    setDesc3(false);

    props.sorting(props.fullData);
  };

  return (
    <form
      onSubmit={handleSort}
      onReset={props.onFullReset}
      style={{ marginBottom: "20px" }}
    >
      <p>
        <label style={{ width: "130px", display: "inline-block" }}>
          Первый уровень:
        </label>
        <select
          value={level1}
          onChange={handleLevel1Change}
          style={{ width: "150px" }}
        >
          {renderOptions(level1, level2, level3)}
        </select>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={desc1}
            onChange={(e) => setDesc1(e.target.checked)}
          />{" "}
          по убыванию?
        </label>
      </p>

      <p>
        <label style={{ width: "130px", display: "inline-block" }}>
          Второй уровень:
        </label>
        <select
          value={level2}
          onChange={handleLevel2Change}
          disabled={!level1}
          style={{ width: "150px" }}
        >
          {renderOptions(level2, level1, level3)}
        </select>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={desc2}
            onChange={(e) => setDesc2(e.target.checked)}
            disabled={!level1}
          />{" "}
          по убыванию?
        </label>
      </p>

      <p>
        <label style={{ width: "130px", display: "inline-block" }}>
          Третий уровень:
        </label>
        <select
          value={level3}
          onChange={handleLevel3Change}
          disabled={!level2}
          style={{ width: "150px" }}
        >
          {renderOptions(level3, level1, level2)}
        </select>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={desc3}
            onChange={(e) => setDesc3(e.target.checked)}
            disabled={!level2}
          />{" "}
          по убыванию?
        </label>
      </p>

      <p>
        <button type="submit">Сортировать</button>
        <button type="reset" style={{ marginLeft: "10px" }}>
          Сбросить сортировку
        </button>
      </p>
    </form>
  );
};

export default Sort;
