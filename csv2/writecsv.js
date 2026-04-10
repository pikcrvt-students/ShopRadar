function writeCSV(file, data, headers) {
    const rows = [
        headers.join(","),
        ...data.map(obj => headers.map(h => obj[h]).join(","))
    ];

    fs.writeFileSync(file, rows.join("\n"));
}