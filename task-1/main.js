const minAverages = (...arrays) => {
    const averages = arrays.map(arr => {
        const sum = arr.reduce((acc, val) => { 
            return acc + val; 
        }, 0);
        return sum / arr.length;
    });

    const min = averages.reduce((min, val) => {
        return val < min ? val : min;
    });

    return min;
};

const res = minAverages([1, 2, 3], [10, 20], [0, 5]); 
console.log(res);