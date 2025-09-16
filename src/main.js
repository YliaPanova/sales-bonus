/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   // Извлекаем необходимые данные из покупки
    const { 
        discount,    // процент скидки
        sale_price,  // цена продажи
        quantity     // количество проданных единиц
    } = purchase;

    // Проверка корректности входных данных
    if (
        typeof sale_price !== 'number' ||
        typeof quantity !== 'number' ||
        typeof discount !== 'number'
    ) {
        throw new Error('Некорректные входные данные');
    }

    // Шаг 1: Переводим скидку в десятичное число
    const decimalDiscount = discount / 100;

    // Шаг 2: Рассчитываем полную стоимость без скидки
    const fullCost = sale_price * quantity;

    // Шаг 3: Рассчитываем итоговую выручку с учетом скидки
    const revenue = fullCost * (1 - decimalDiscount);

    return Math.round(revenue * 100) / 100; // округляем до двух знаков после запятой
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
     // Проверяем корректность входных данных
    if (total <= 0 || !seller || typeof seller.profit !== 'number') {
        return 0;
    }

    // Извлекаем необходимые данные из объекта продавца
    const { 
        profit,        // прибыль продавца
        experience,    // опыт работы (лет)
        performance,   // показатель эффективности
        loyalty        // коэффициент лояльности
    } = seller;

    // Базовый расчет бонуса по позиции
    let baseBonus = 0;
    if (index === 0) {
        baseBonus = 15;
    } else if (index === total - 1) {
        baseBonus = 0;
    } else if (index <= 2) {
        baseBonus = 10;
    } else {
        baseBonus = 5;
    }

    // Модификаторы бонуса на основе дополнительных параметров
    const modifiers = {
        experience: experience >= 5 ? 1.1 : 1,     // бонус за опыт
        performance: performance >= 85 ? 1.05 : 1, // бонус за эффективность
        loyalty: loyalty >= 0.8 ? 1.02 : 1         // бонус за лояльность
    };

    // Итоговый расчет бонуса с учетом модификаторов
    const finalBonus = baseBonus * modifiers.experience * modifiers.performance * modifiers.loyalty;

    return Math.round(finalBonus * 100) / 100;     // округляем до двух знаков
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
    // Проверка обязательных параметров
     // Проверка обязательных параметров
    if (!data || !options || 
        !options.calculateRevenue || 
        !options.calculateBonus) {
        throw new Error('Некорректные входные параметры');
    }

    const { calculateRevenue, calculateBonus } = options;
    
    // Извлекаем данные из входных параметров
    const { purchase_records, products, sellers } = data;
    
    // Создаем индексы для быстрого доступа
    const productsMap = new Map(products.map(p => [p.id, p]));
    const sellersMap = new Map(sellers.map(s => [s.id, s]));
    
    // Создаем карту для накопления статистики по продавцам
    const statsMap = new Map();
    
    // Проходим по всем записям покупок
    purchase_records.forEach(record => {
        const { seller_id, items } = record;
        
        // Получаем данные продавца
        const seller = sellersMap.get(seller_id);
        
        // Если продавца нет в базе или он уже есть в статистике
        if (!seller || statsMap.has(seller_id)) {
            return;
        }
        
        // Инициализируем статистику продавца
        statsMap.set(seller_id, {
            id: seller_id,
            name: `${seller.first_name} ${seller.last_name}`,
            revenue: 0,
            profit: 0,
            sales_count: 0,
            products_sold: {}
        });
        
        // Обрабатываем каждую позицию в чеке
        items.forEach(item => {
            // Получаем товар из индекса
            const product = productsMap.get(item.product_id);
            
            if (!product) return; // пропускаем, если товар не найден
            
            // Рассчитываем выручку по позиции
            const revenue = calculateRevenue(item, product);
            
            // Рассчитываем прибыль (выручка минус себестоимость)
            const profit = revenue - (product.cost * item.quantity);
            
            // Обновляем статистику продавца
            const stats = statsMap.get(seller_id);
            stats.revenue += revenue;
            stats.profit += profit;
            stats.sales_count++;
            
            // Обновляем статистику по товарам
            if (!stats.products_sold[product.id]) {
                stats.products_sold[product.id] = 0;
            }
            stats.products_sold[product.id] += item.quantity;
        });
    });

    // Преобразуем карту в массив и сортируем по убыванию прибыли
    const sortedSellers = Array.from(statsMap.values())
        .sort((a, b) => b.profit - a.profit);

    // Рассчитываем бонусы для каждого продавца
    sortedSellers.forEach((seller, index) => {
        const totalSellers = sortedSellers.length;
        const bonusPercent = calculateBonus(index, totalSellers, seller);
        
        // Рассчитываем сумму бонуса
        seller.bonus = seller.profit * (bonusPercent / 100);
    });

    // Формируем итоговый результат
    return sortedSellers.map(seller => ({
        name: seller.name,
        seller_id: seller.id,
        revenue: seller.revenue,
        profit: seller.profit,
        bonus: seller.bonus,
        sales_count: seller.sales_count,
        top_products: Object.entries(seller.products_sold)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // берем топ-5 товаров
    }));
}

