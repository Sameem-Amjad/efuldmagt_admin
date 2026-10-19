import Papa from "papaparse";

export async function readCSVFile(file) {
  if (!file) {
    throw new Error("No file selected.");
  }

  const parseCSV = new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function (result) {
        resolve(result.data);
      },
      error: function (error) {
        reject(error);
      },
      header: true,
      skipEmptyLines: true,
    });
  });

  return await parseCSV;
}
