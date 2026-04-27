const Sort = (props) => {
  const columns = props.fullData.length > 0 ? Object.keys(props.fullData[0]) : [];

  const { level1, desc1, level2, desc2, level3, desc3 } = props.sortState;
  const setSortState = props.setSortState;

  const handleLevel1Change = (e) => {
    const val = e.target.value;
    setSortState((prev) => ({
      ...prev,
      level1: val,

      level2: val === "" ? "" : prev.level2,
      level3: val === "" ? "" : prev.level3,
    }));
  };

  const handleLevel2Change = (e) => {
    const val = e.target.value;
    setSortState((prev) => ({
      ...prev,
      level2: val,
      level3: val === "" ? "" : prev.level3,
    }));
  };

  const handleLevel3Change = (e) => {
    setSortState((prev) => ({ ...prev, level3: e.target.value }));
  };

  const handleDesc1Change = (e) => setSortState((prev) => ({ ...prev, desc1: e.target.checked }));
  const handleDesc2Change = (e) => setSortState((prev) => ({ ...prev, desc2: e.target.checked }));
  const handleDesc3Change = (e) => setSortState((prev) => ({ ...prev, desc3: e.target.checked }));

  const renderOptions = (currentSelected, avoid1, avoid2) => {
    const availableColumns = columns.filter((col) => col !== avoid1 && col !== avoid2);
    return (
      <>
        <option value="">Нет</option>
        {availableColumns.map((col) => (
          <option key={col} value={col}>{col}</option>
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

  const handleReset = (e) => {
    e.preventDefault();
    props.onClearAll(); 
  };

  return (
    <form onSubmit={handleSort} onReset={handleReset} style={{ marginBottom: "20px" }}>
      <p>
        <label style={{ width: "130px", display: "inline-block" }}>Первый уровень:</label>
        <select value={level1} onChange={handleLevel1Change} style={{ width: "150px" }}>
          {renderOptions(level1, level2, level3)}
        </select>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={desc1} onChange={handleDesc1Change} /> по убыванию?
        </label>
      </p>

      <p>
        <label style={{ width: "130px", display: "inline-block" }}>Второй уровень:</label>
        <select value={level2} onChange={handleLevel2Change} disabled={!level1} style={{ width: "150px" }}>
          {renderOptions(level2, level1, level3)}
        </select>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={desc2} onChange={handleDesc2Change} disabled={!level1} /> по убыванию?
        </label>
      </p>

      <p>
        <label style={{ width: "130px", display: "inline-block" }}>Третий уровень:</label>
        <select value={level3} onChange={handleLevel3Change} disabled={!level2} style={{ width: "150px" }}>
          {renderOptions(level3, level1, level2)}
        </select>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={desc3} onChange={handleDesc3Change} disabled={!level2} /> по убыванию?
        </label>
      </p>

      <p>
        <button type="submit">Сортировать</button>
        <button type="reset" style={{ marginLeft: "10px" }}>Сбросить всё</button>
      </p>
    </form>
  );
};

export default Sort;