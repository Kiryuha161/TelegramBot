const Exceljs = require('exceljs');

let data = [];
let dataBankrot = [];
let dataRosim = [];
let dataArt = [];
let sites = [
    "Viomitra.Банкротство",
    "Viomitra.Коммерческие торги",
    "Viomitra.Росимущество",
    "Viomitra.Арт"
]

let handleData = async () => {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile('./excelQuestions.xlsx');
    const worksheet = workbook.getWorksheet('Пример вопросов');

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        const subcategory = worksheet.getCell(`B${i}`).value;
        const question = worksheet.getCell(`C${i}`).value;
        const answer = worksheet.getCell(`D${i}`).value;

        const existingCategory = data.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            data.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    await workbook.xlsx.readFile('./bankrotQuestions.xlsx');
    const worksheetBankrot = workbook.getWorksheet('Лист1');

    for (let i = 1; i <= worksheetBankrot.lastRow.number; i++) {
        const category = worksheetBankrot.getCell(`A${i}`).value;
        const subcategory = worksheetBankrot.getCell(`B${i}`).value;
        const question = worksheetBankrot.getCell(`C${i}`).value;
        const answer = worksheetBankrot.getCell(`D${i}`).value;

        const existingCategory = dataBankrot.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            dataBankrot.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    await workbook.xlsx.readFile('./rosimQuestions.xlsx');
    const worksheetRosim = workbook.getWorksheet('Лист1');

    for (let i = 1; i <= worksheetRosim.lastRow.number; i++) {
        const category = worksheetRosim.getCell(`A${i}`).value;
        const subcategory = worksheetRosim.getCell(`B${i}`).value;
        const question = worksheetRosim.getCell(`C${i}`).value;
        const answer = worksheetRosim.getCell(`D${i}`).value;

        const existingCategory = dataRosim.find((item) => item.category === category);
        if (existingCategory) {
            const existingSubcategory = existingCategory.subcategories.find((sub) => sub.name === subcategory);
            if (existingSubcategory) {
                existingSubcategory.questions.push({ question, answer });
            } else {
                existingCategory.subcategories.push({ name: subcategory, questions: [{ question, answer }] });
            }
        } else {
            dataRosim.push({ category, subcategories: [{ name: subcategory, questions: [{ question, answer }] }] });
        }
    }

    await workbook.xlsx.readFile('./artQuestions.xlsx');
    const worksheetArt = workbook.getWorksheet('Пример вопросов - арт');

    for (let i = 1; i <= worksheetArt.lastRow.number; i++) {
        const category = worksheetArt.getCell(`A${i}`).value;
        const question = worksheetArt.getCell(`B${i}`).value;
        const answer = worksheetArt.getCell(`C${i}`).value;

        const existingCategory = dataArt.find((item) => item.category === category);

        if (existingCategory) {
            existingCategory.questions.push({ question, answer });
        } else {
            dataArt.push({ category, questions: [{ question, answer }] });
        }
    }
}

module.exports = {
    handleData: handleData,
    state: {
        data: data,
        sites: sites,
        dataBankrot: dataBankrot,
        dataRosim: dataRosim,
        dataArt: dataArt
    }
}