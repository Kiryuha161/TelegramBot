const Exceljs = require('exceljs');

let data = []; 
let sites = [
    "Viomitra.Банкротство",
    "Viomitra.Коммерческие торги",
    "Viomitra.Китай",
    "Росимущество"
]

let handleData = async() => {
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
}

module.exports = {
    handleData: handleData,
    state: {
        data: data,
        sites: sites
    }
}