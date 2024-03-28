/* const uniqueRealtyCategories = new Set();

    for (let i = 1; i <= worksheet.lastRow.number; i++) {
        const category = worksheet.getCell(`A${i}`).value;
        uniqueRealtyCategories.add(category);
    }

    const categoriesRealtyArray = Array.from(uniqueRealtyCategories);

    categoryRealtyButtons = Markup.keyboard([
        categoriesRealtyArray.map((category) => ({
            text: category,
            callback_data: category,
        })),
    ]); */