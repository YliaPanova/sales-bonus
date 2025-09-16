/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   const { discount = 0, sale_price, quantity } = purchase;

    // Переводим скидку в десятичную дробь
    const discountDecimal = discount / 100;

    // Считаем полную стоимость продажи
    const total = sale_price * quantity;

    // Итоговая сумма с учётом скидки
    const revenue = total * (1 - discountDecimal);

    return revenue;
}


/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}   !размер бонуса в процентах
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    // Можно использовать profit, если понадобится для расширения логики
    // const { profit } = seller;

    if (index === 0) {
        return 15; // 15% — лучший продавец
    }
    if (index === 1 || index === 2) {
        return 10; // 10% — 2 и 3 место
    }
    if (index === total - 1) {
        return 0; // 0% — последний продавец
    }
    return 5; // 5% — все остальные

    
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    if (
        !data
        || !Array.isArray(data.sellers)
        || !Array.isArray(data.products)
        || !Array.isArray(data.purchases)
        || data.sellers.length === 0
        || data.products.length === 0
        || data.purchases.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    }

    // @TODO: Проверка наличия опций
     if (!options || typeof options !== "object") {
        throw new Error('Некорректные опции');
    }

    const { calculateRevenue, calculateBonus } = options;

    if (!calculateRevenue || !calculateBonus) {
        throw new Error('Отсутствуют необходимые функции в опциях');
    }

    // (Опционально) Проверка, что это функции
    if (typeof calculateRevenue !== "function" || typeof calculateBonus !== "function") {
        throw new Error('Некорректные типы функций в опциях');
    }

    // @TODO: Подготовка промежуточных данных для сбора статистики
     const sellerStats = data.sellers.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: 0,        // Выручка (будет рассчитана позже)
        profit: 0,         // Прибыль (будет рассчитана позже)
        sales_count: 0,    // Количество продаж (будет рассчитано позже)
        top_products: [],  // Топовые товары (будет рассчитано позже)
        bonus: 0           // Бонус (будет рассчитан позже)
        // Можно добавить другие поля, если потребуется
    }));

    // @TODO: Индексация продавцов и товаров для быстрого доступа
    // Индекс продавцов: ключ — id, значение — объект статистики продавца
    const sellerIndex = Object.fromEntries(
        sellerStats.map(stat => [stat.seller_id, stat])
    );

    // Индекс товаров: ключ — sku, значение — карточка товара
    const productIndex = Object.fromEntries(
        data.products.map(product => [product.sku, product])
    );


        // @TODO: Расчет выручки и прибыли для каждого продавца
     for (const purchase of data.purchases) {
        const seller = sellerIndex[purchase.seller_id];
        if (!seller) continue;

        let purchaseRevenue = 0;
        let purchaseProfit = 0;

        for (const item of purchase.items) {
            const product = productIndex[item.sku];
            if (!product) continue;

            const revenue = calculateRevenue(item, product);
            const cost = product.cost_price * item.quantity;
            const profit = revenue - cost;

            purchaseRevenue += revenue;
            purchaseProfit += profit;

            // Можно добавить подсчёт топовых товаров
            // (например, seller.top_products.push(product.sku) и потом обработать)
        }

        seller.revenue += purchaseRevenue;
        seller.profit += purchaseProfit;
        seller.sales_count += purchase.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // @TODO: Сортировка продавцов по прибыли
    const sortedStats = [...sellerStats].sort((a, b) => b.profit - a.profit);

    // @TODO: Назначение премий на основе ранжирования
    sortedStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sortedStats.length, seller);
    });

    // @TODO: Подготовка итоговой коллекции с нужными полями
     return sellerStats.map(seller => ({
        seller_id: String(seller.seller_id),
        name: String(seller.name),
        revenue: Number(seller.revenue.toFixed(2)),
        profit: Number(seller.profit.toFixed(2)),
        sales_count: Math.round(seller.sales_count),
        top_products: seller.top_products,
        bonus: Number(seller.bonus.toFixed(2))
    }));
    
}




/**

Дано:
* Функция для расчета выручки
* @param purchase запись о покупке
* @param _product карточка товара
* @returns {number}
*/   /**
function calculateSimpleRevenue(purchase, _product) {
// @TODO: Расчет выручки от операции
}*/

/**
* Функция для расчета бонусов
* @param index порядковый номер в отсортированном массиве
* @param total общее число продавцов
* @param seller карточка продавца
* @returns {number}
*/   /**
function calculateBonusByProfit(index, total, seller) {
// @TODO: Расчет бонуса от позиции в рейтинге
}

/**
* Функция для анализа данных продаж
* @param data
* @param options
* @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
*/   /**
function analyzeSalesData(data, options) {
// @TODO: Проверка входных данных

// @TODO: Проверка наличия опций

// @TODO: Подготовка промежуточных данных для сбора статистики

// @TODO: Индексация продавцов и товаров для быстрого доступа

// @TODO: Расчет выручки и прибыли для каждого продавца

// @TODO: Сортировка продавцов по прибыли

// @TODO: Назначение премий на основе ранжирования

// @TODO: Подготовка итоговой коллекции с нужными полями*/