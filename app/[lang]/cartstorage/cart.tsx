import { getCookie } from 'cookies-next';
import { applyDiscountRule, getAvailableDeliveryDates, getCouponData, getDoorstepCart, getExpressRegional, getFeesCart, getFreeGiftCart, getPaymentCart, getProductDataCart, getShippingData, getUserLoyaltyData, getWarehouseCart, recheckCartRegionalData, submitOrderCart } from "@/lib/cartstorage/cart.client";

interface product {
    gift_quantity: number;
    new_gift: boolean;
    key: String,
    id: number,
    sku: String,
    name: String,
    name_arabic: String,
    image: String,
    price: number,
    regular_price: number,
    quantity: number,
    total_quantity: number,
    gift_id: number,
    fbt_id: number,
    // discount:number,
    discounted_amount: number,
    gift: product[],
    fbt: product[],
    brand: {},
    bogo: number,
    pre_order: number,
    express: boolean,
    express_qty: number,
    express_total_qty: number,
    discounttype: number,
    addtionaldiscount: number,
    fgcart: number,
    directcashback: number,
    directcashback_title: string,
    directcashback_title_arabic: string,
    item_list_id: string,
    item_list_name: string,
}

interface fees {
    id: number,
    title: string,
    title_arabic: string,
    amount: any
}

interface discount {
    id: number,
    title: string,
    title_arabic: string,
    amount: any
}

interface cart {
    products: product[],
    discounts: {
        coupon: {},
        discuountRules: fees[],
        additionalDiscount: {}
    },
    fees: {
        shipping: {},
        express: {},
        fee: fees[],
        wrapper: {},
        installation: {},
        doorstep: {}
    },
    loyalty: discount,
    loyalty_shipping: any,
    extradata: any,
    paymentMethod: string,
    shippingAddress: any,
    orderId: any,
    deliveryDate: any,
    storeId?: any,
    storeType?: any,
    storeCity?: any
}

const emptyCart = (): cart => ({
    products: [],
    discounts: {
        coupon: {} as discount,
        discuountRules: [],
        additionalDiscount: {} as discount
    },
    fees: {
        shipping: {} as fees,
        express: {} as fees,
        doorstep: {} as fees,
        fee: [],
        wrapper: {} as fees,
        installation: {} as fees
    },
    loyalty: {} as discount,
    loyalty_shipping: false,
    extradata: false,
    paymentMethod: '',
    shippingAddress: false,
    orderId: false,
    deliveryDate: false,
    storeId: false,
    storeType: 0,
    storeCity: false
});

const createCart = <T extends Partial<cart>>(initialValues: T): cart & T => {
    return Object.assign(emptyCart(), initialValues);
};

const removecheckoutdata = () => {
    var cartdata = getCart()
    cartdata.extradata = false
    cartdata.paymentMethod = ''
    cartdata.shippingAddress = false
    cartdata.discounts.coupon = {}
    cartdata.fees.express = {}
    cartdata.fees.doorstep = {}
    cartdata.fees.wrapper = {}
    cartdata.fees.installation = {}
    cartdata.fees.fee = []
    cartdata.loyalty = {} as discount;
    for (let index = 0; index < cartdata.products.length; index++) {
        cartdata.products[index].express = false
    }
    setCart(cartdata)
    return cartdata
}
const getCartItems = async () => {
    var cartdata;
    if (localStorage.getItem('cartData')) {
        var d: any = localStorage.getItem('cartData')
        var decodedata = Buffer.from(d, 'base64').toString("utf-8")
        cartdata = JSON.parse(decodedata) as cart;
    }
    else
        cartdata = createCart({ products: [] });
    return cartdata.products;
}

const searchItem = (array: any, data: any) => {
    return Object.keys(array).find(key => array[key].id === data.id && array[key].price === data.price && data.gift.length == array[key].gift.length && array[key].gift.map(function (a: any) { return a.id; }).filter((element: any) => data.gift.map(function (a: any) { return a.id; }).includes(element)).length == data.gift.length);
}

const removeCart = () => {
    localStorage.removeItem('cartData');
    return false
}

const removeCartItem = (key: number) => {
    var cartdata = getCart();
    cartdata.products.splice(key, 1)
    setCart(cartdata)
    // setDiscountRule()
    // setDiscountRuleBogo()
    return cartdata;
}

const removeCartItemFbt = (prokey: number, fbtkey: number) => {
    var cartdata = getCart();
    cartdata.products[prokey]?.fbt?.splice(fbtkey, 1)
    setCart(cartdata)
    return cartdata;
}

const updateCartItemFbtQty = (qty: number, prokey: number, fbtkey: number) => {
    var cartdata: any = getCart();
    if (cartdata.products && cartdata.products[prokey] && cartdata.products[prokey].fbt && cartdata.products[prokey].fbt[fbtkey]) {
        cartdata.products[prokey].fbt[fbtkey].quantity = qty;
    }
    setCart(cartdata)
    return cartdata;
}

const removeCartItemGift = (prokey: number, fbtkey: number) => {
    var cartdata = getCart();
    cartdata.products[prokey]?.gift?.splice(fbtkey, 1)
    setCart(cartdata)
    return cartdata;
}

const removeBogo = (cartdata: any) => {
    // var cartdata = getCart();
    // cartdata.products.splice(key,1)
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];
        if (element.bogo) {
            cartdata.products.splice(index, 1)
        }
    }
    // setCart(cartdata)
    return cartdata;
}

const getCart = () => {
    if (!localStorage.getItem("cartexpiry")) {
        removeCart()
    } else {
        const cartexpiry: any = localStorage.getItem("cartexpiry");
        if (Date.now() > cartexpiry) {
            removeCart()
            localStorage.removeItem("cartexpiry")
        }
    }
    // removeCart()
    var cartdata;
    if (localStorage.getItem('cartData')) {
        var d: any = localStorage.getItem('cartData')
        var decodedata = Buffer.from(d, 'base64').toString("utf-8")
        cartdata = JSON.parse(decodedata) as cart;
    }
    else
        cartdata = createCart({ products: [] });
    return cartdata;
}

const increaseQty = (cartdata: cart, qty: number, key: number, setdata = false) => {
    if (cartdata.products[key].total_quantity >= qty)
        cartdata.products[key].quantity = qty
    else
        cartdata.products[key].quantity = cartdata.products[key].total_quantity
    if (cartdata.products[key].gift) {
        for (let index = 0; index < cartdata.products[key].gift.length; index++) {
            if (cartdata.products[key].total_quantity >= qty)
                cartdata.products[key].gift[index].quantity = qty
            else
                cartdata.products[key].gift[index].quantity = cartdata.products[key].total_quantity
        }
    }

    // New free gift setting
    // if (cartdata.products[key].gift) {
    //     for (let index = 0; index < cartdata.products[key].gift?.length; index++) {
    //         const elem = cartdata.products[key].gift[index]
    //         if ((cartdata.products[key].total_quantity >= qty) && elem?.new_gift)
    //             cartdata.products[key].gift[index].quantity = qty * elem?.gift_quantity
    //         else
    //             cartdata.products[key].gift[index].quantity = cartdata.products[key].total_quantity
    //     }
    // }

    if (setdata)
        setCart(cartdata)
    return cartdata;
}

const addBogo = (data: [product], cartdata: any) => {
    // var key = Math.random().toString(16).slice(2)
    // data.key = key
    //var cartdata = getCart();
    cartdata.products = cartdata.products.concat(data)
    return cartdata
}

const addgifttextraitem = async (data: product, gift: [product]) => {
    var cartdata = getCart();
    var checktData: any = searchItem(cartdata.products, data)
    if (checktData) {
        if (gift.length) {
            var newgift = (cartdata.products[checktData].gift.length) ? cartdata.products[checktData].gift : []
            if (newgift.length) {
                for (let index = 0; index < gift.length; index++) {
                    const element = gift[index];
                    cartdata.products[checktData].gift.push(element)
                }
            }
            else {
                cartdata.products[checktData].gift = gift
            }
        }
    }
    setCart(cartdata)
}

const addfbtextraitem = async (data: product, fbt: [product]) => {
    var cartdata = getCart();
    var checktData: any = searchItem(cartdata.products, data)
    if (checktData) {
        if (fbt.length) {
            var newfbt = (cartdata.products[checktData].fbt.length) ? cartdata.products[checktData].fbt : []
            if (newfbt.length) {
                for (let index = 0; index < fbt.length; index++) {
                    const element = fbt[index];
                    var checktDatafbt: any = Object.keys(cartdata.products[checktData].fbt).find((key: any) => cartdata.products[checktData].fbt[key].id === element.id && cartdata.products[checktData].fbt[key].price === element.price)
                    if (checktDatafbt) {
                        if (cartdata.products[checktData].fbt[checktDatafbt].total_quantity >= (cartdata.products[checktData].fbt[checktDatafbt].quantity + element.quantity))
                            cartdata.products[checktData].fbt[checktDatafbt].quantity += element.quantity
                        else
                            cartdata.products[checktData].fbt[checktDatafbt].quantity = cartdata.products[checktData].fbt[checktDatafbt].total_quantity
                    }
                    else {
                        cartdata.products[checktData].fbt.push(element)
                    }
                }
            }
            else {
                cartdata.products[checktData].fbt = fbt
            }
        }
    }
    setCart(cartdata)
}

const setCartItems = async (data: product, gift: [product], fbt: [product]) => {
    var key = Math.random().toString(16).slice(2)
    data.key = key
    if (gift) {
        data.gift = gift
    }
    else {
        data.gift = []
    }
    if (fbt) {
        data.fbt = fbt
    }
    else {
        data.fbt = []
    }
    var cartdata = getCart();
    var checktData: any = searchItem(cartdata.products, data)
    if (checktData) {
        cartdata = increaseQty(cartdata, cartdata.products[checktData].quantity + data.quantity, checktData);
        if (data.fbt.length) {
            var newfbt = (cartdata.products[checktData].fbt.length) ? cartdata.products[checktData].fbt : []
            if (newfbt.length) {
                for (let index = 0; index < data.fbt.length; index++) {
                    const element = data.fbt[index];
                    var checktDatafbt: any = Object.keys(cartdata.products[checktData].fbt).find((key: any) => cartdata.products[checktData].fbt[key].id === element.id && cartdata.products[checktData].fbt[key].price === element.price)
                    if (checktDatafbt) {
                        if (cartdata.products[checktData].fbt[checktDatafbt].total_quantity >= (cartdata.products[checktData].fbt[checktDatafbt].quantity + element.quantity))
                            cartdata.products[checktData].fbt[checktDatafbt].quantity += element.quantity
                        else
                            cartdata.products[checktData].fbt[checktDatafbt].quantity = cartdata.products[checktData].fbt[checktDatafbt].total_quantity
                    }
                    else {
                        cartdata.products[checktData].fbt.push(element)
                    }
                }
            }
            else {
                cartdata.products[checktData].fbt = data.fbt
            }
        }
    }
    else
        cartdata.products.push(data)
    setCart(cartdata, true)
    // setDiscountRule()
    // setDiscountRuleBogo()

}

const setCartExpiry = () => {
    var addexpirytime = 172800000;
    // var addexpirytime = 60000;
    const cacheExpireDate: any = Date.now() + addexpirytime;
    localStorage.setItem("cartexpiry", cacheExpireDate);
}

const setCart = (cartdata: cart, cache: any = false) => {
    const myJSON = JSON.stringify(cartdata);
    let objJsonB64 = Buffer.from(myJSON).toString("base64");
    localStorage.setItem('cartData', objJsonB64)
    if (cache) {
        setCartExpiry()
    }

    window.dispatchEvent(new CustomEvent('cartDataChanged', {
        detail: {
            cartData: objJsonB64
        }
    }));
}

const getCartCount = () => {
    var cartdata = getCart();
    var count = cartdata.products.length
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];
        if (element.gift?.length > 0)
            count += element.gift?.length
        if (element.fbt?.length > 0)
            count += element.fbt?.length
    }
    return count;
}

const getSubtotal = () => {
    var cartdata = getCart();
    var amount = 0
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];

        if (element.bogo)
            amount += element.quantity * element.regular_price
        // amount += element.quantity * element.discounted_amount
        else
            amount += element.quantity * element.regular_price
        // amount += element.quantity * element.price
        for (let g = 0; g < element?.gift?.length; g++) {
            const elementgift = element?.gift[g];
            amount += elementgift.quantity * elementgift.regular_price
            // amount += elementgift.quantity * elementgift.discounted_amount
        }
        for (let f = 0; f < element?.fbt?.length; f++) {
            const elementfbt = element?.fbt[f];
            amount += elementfbt.quantity * elementfbt.regular_price
            // amount += elementfbt.quantity * elementfbt.discounted_amount
        }
    }
    return amount;
}

const getSubtotalSale = () => {
    var cartdata = getCart();
    var amount = 0
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];

        if (element.bogo)
            amount += element.quantity * element.discounted_amount
        else
            amount += element.quantity * element.price
        for (let g = 0; g < element?.gift?.length; g++) {
            const elementgift = element?.gift[g];
            amount += elementgift.quantity * elementgift.discounted_amount
        }
        for (let f = 0; f < element?.fbt?.length; f++) {
            const elementfbt = element?.fbt[f];
            amount += elementfbt.quantity * elementfbt.discounted_amount
        }
    }
    return amount;
}

const getCashBackDiscount = () => {
    var cartdata = getCart();
    var amount = 0
    // for (let index = 0; index < cartdata.products.length; index++) {
    //     const element = cartdata.products[index];
    //     if (element.discounttype === 1 || element.discounttype === 2)
    //         amount += element.quantity * element.discounted_amount
    // }
    return amount;
}

const getDirectCashbackDiscount = () => {
    var cartdata = getCart();
    var amount = 0
    var summary: any = []
    if (cartdata.products.length) {
        for (let index = 0; index < cartdata.products?.length; index++) {
            const element: any = cartdata.products[index];
            if (element.directcashback != null && element.directcashback >= 1) {
                summary.push({ key: 'save', title: element?.directcashback_title, title_arabic: element?.directcashback_title_arabic, price: '- ' + (element.quantity * element.directcashback).toFixed(2) })
                amount += element.quantity * element.directcashback;
            }
        }
    }
    return { amount: amount, summary: summary };
}

const getVatOnUsDiscount = () => {
    var cartdata = getCart();
    var amount = 0
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];
        if (element.discounttype === 3)
            amount += element.quantity * element.discounted_amount
    }
    return amount;
}


const getSaveAmount = () => {
    var cartdata = getCart();
    var amount = 0
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];
        if (element.bogo)
            amount += (element.quantity * element.regular_price) - (element.quantity * element.discounted_amount)
        else
            amount += (element.quantity * element.regular_price) - (element.quantity * element.price)
        if (element?.gift) {
            for (let g = 0; g < element?.gift.length; g++) {
                const elementgift = element?.gift[g];
                amount += (elementgift.quantity * elementgift.regular_price) - (elementgift.quantity * elementgift.discounted_amount)
            }
        }
        if (element?.fbt) {
            for (let f = 0; f < element?.fbt.length; f++) {
                const elementfbt = element?.fbt[f];
                amount += (elementfbt.quantity * elementfbt.regular_price) - (elementfbt.quantity * elementfbt.discounted_amount)
            }
        }
    }
    if (getDiscountes().amount) {
        amount += getDiscountes().amount
    }
    if (getCashBackDiscount() > 0) {
        amount += getCashBackDiscount()
    }
    if (getVatOnUsDiscount()) {
        amount += getVatOnUsDiscount()
    }
    return amount;
}

const getShippingAddress = () => {
    var cartdata: any = getCart();
    return cartdata.shippingAddress
}

const setShippingAddress = (id: any) => {
    var cartdata: any = getCart();
    cartdata.shippingAddress = id
    setCart(cartdata)
    return cartdata
}

const getPaymentMethod = () => {
    var cartdata: any = getCart();
    return cartdata.paymentMethod
}

const setPaymentMethod = (id: any) => {
    var cartdata: any = getCart();
    cartdata.paymentMethod = id
    setCart(cartdata)
}

const getShipping = () => {
    var cartdata: any = getCart();
    var amount = 0;
    if (cartdata.fees.shipping) {
        amount += cartdata.fees.shipping.amount;
    }
    return amount;
}


const setInstallation = (qty: number) => {
    var cartdata: any = getCart();
    var feesdata: any = {
        id: 0,
        title: 'Installation Cost',
        title_arabic: 'تكلفـة التغــليـف',
        amount: qty * 95,
    }
    cartdata.fees.installation = feesdata as fees
    setCart(cartdata);
}
const getInstallation = () => {
    var cartdata: any = getCart();
    var amount = 0;
    if (cartdata.fees.installation) {
        amount += cartdata.fees.installation.amount;
    }
    return amount;
}
const unsetInstallation = () => {
    var cartdata: any = getCart();
    cartdata.fees.installation = {} as fees;
    setCart(cartdata)
    return cartdata;
}


const setWrapper = () => {
    var cartdata: any = getCart();
    var feesdata: any = {
        id: 0,
        title: 'Packaging Cost',
        title_arabic: 'تكلفـة التغــليـف',
        amount: 95,
    }
    cartdata.fees.wrapper = feesdata as fees
    setCart(cartdata);
}
const getWrapper = () => {
    var cartdata: any = getCart();
    var amount = 0;
    if (cartdata.fees.wrapper) {
        amount += cartdata.fees.wrapper.amount;
    }
    return amount;
}
const unsetWrapper = () => {
    var cartdata: any = getCart();
    cartdata.fees.wrapper = {} as fees;
    setCart(cartdata)
    return cartdata;
}
const getDiscountes = () => {
    var cartdata = getCart();
    var amount: any = 0;
    var summary: any = []
    if (cartdata.discounts.discuountRules) {
        for (let index = 0; index < cartdata.discounts.discuountRules.length; index++) {
            const element = cartdata.discounts.discuountRules[index];
            const amountStr = String(element?.amount ?? '');
            const cleanedStr = amountStr.replace(/,/g, '');
            const amountNum = parseFloat(cleanedStr);
            const amountPrice = !isNaN(amountNum) ? amountNum.toFixed(2) : '0.00';
            // summary.push({ key: element.title, price: '- ' + amountPrice, title: element.title, title_arabic: element.title_arabic })
            summary.push({ key: 'discountRule', price: '- ' + amountPrice, title: element.title, title_arabic: element.title_arabic })
            amount += Number(amountPrice);
        }
    }
    return { amount: amount, summary: summary };
}

// const getAdditionalDiscount = () => {
//     // setAdditionalDiscount()
//     var cartdata: any = getCart();
//     var amountData = {} as discount;
//     if (cartdata.discounts.additionalDiscount) {
//         amountData = cartdata.discounts.additionalDiscount;
//     }
//     return amountData;
// }

const getExtraFees = () => {
    var cartdata = getCart();
    var amount: any = 0;
    var summary: any = []
    if (cartdata.fees.fee) {
        for (let index = 0; index < cartdata.fees.fee.length; index++) {
            const element = cartdata.fees.fee[index];
            summary.push({ key: element.title, title: element.title, title_arabic: element.title_arabic, price: '- ' + parseFloat(element.amount).toFixed(2) })
            amount += Number(parseFloat(element.amount).toFixed(2));
        }
    }
    return { amount: amount, summary: summary };
}

const getTotal = () => {
    var total = getSubtotal();
    total -= getSaveAmount();
    var cartdata = getCart();
    if (getShipping()) {
        total += getShipping();
    }
    if (getWrapper()) {
        total += getWrapper();
    }

    if (getInstallation()) {
        total += getInstallation();
    }
    // if (getDiscountes().amount) {
    //     total = getDiscountes().amount
    // }
    if (getCoupon().amount) {
        total -= Number(parseFloat(getCoupon().amount).toFixed(2))
    }

    if (getLoyalty().amount && getLoyalty().amount > 0) {
        total -= getLoyalty().amount
    }

    // if(getDirectCashbackDiscount().amount) {
    //     total -= getDirectCashbackDiscount().amount

    // }
    // if (getAdditionalDiscount().amount) {
    //     total -= Number(parseFloat(getAdditionalDiscount().amount).toFixed(2))
    // }
    if (getExpressDelivery().amount) {
        total += Number(parseFloat(getExpressDelivery().amount).toFixed(2))
    }
    if (getDoorStep().amount) {
        total += Number(parseFloat(getDoorStep().amount).toFixed(2))
    }
    if (getExtraFees().amount) {
        total += getExtraFees().amount
    }

    // total -= getCashBackDiscount();
    return total;
}

const getSummary = () => {
    var summary: any = []
    summary.push({
        key: 'subtotal',
        title: 'Subtotal',
        title_arabic: 'المجموع الفرعي',
        price: getSubtotal()
    })
    if (getShipping())
        summary.push({
            key: 'shipping',
            title: 'Shipping',
            title_arabic: 'الشحن',
            price: getShipping()
        })
    // if (getAdditionalDiscount().amount)
    //     summary.push({ key: 'additionalDiscount', price: '- ' + Number(parseFloat(getAdditionalDiscount().amount).toFixed(2)), title: getAdditionalDiscount().title, title_arabic: getAdditionalDiscount().title_arabic })

    if (getWrapper())
        summary.push({
            key: 'Packaging',
            title: 'Packaging',
            title_arabic: 'التغليف',
            price: getWrapper()
        })
    if (getInstallation())
        summary.push({
            key: 'Installation',
            title: 'Installation',
            title_arabic: 'التركيب',
            price: getInstallation()
        })
    if (getDiscountes().amount) {
        summary = summary.concat(getDiscountes().summary)
    }
    if (getExtraFees().amount) {
        summary = summary.concat(getExtraFees().summary)
    }
    // if (getDirectCashbackDiscount().amount) {
    //     summary = summary.concat(getDirectCashbackDiscount().summary)
    // }
    if (getCoupon().amount)
        summary.push({ key: 'discountCoupon', price: '- ' + Number(parseFloat(getCoupon().amount).toFixed(2)), title: getCoupon().title, title_arabic: getCoupon().title_arabic })

    if (getExpressDelivery().amount)
        summary.push({ key: getExpressDelivery().title, price: Number(parseFloat(getExpressDelivery().amount).toFixed(2)), title: getExpressDelivery().title, title_arabic: getExpressDelivery().title_arabic })

    if (getDoorStep().amount)
        summary.push({ key: getDoorStep().title, price: Number(parseFloat(getDoorStep().amount).toFixed(2)), title: getExpressDelivery().title, title_arabic: getExpressDelivery().title_arabic })

    if (getLoyalty().amount && getLoyalty().amount > 0) {
        summary.push({
            key: 'loyalty',
            title: getLoyalty().title,
            title_arabic: getLoyalty().title_arabic,
            price: '- ' + Number(parseFloat(getLoyalty().amount).toFixed(2))
        })
    }
    // if(getWrapper())


    if (getCashBackDiscount() > 0)
        summary.push({
            key: 'save',
            title: "Cashback Discount",
            title_arabic: "خصم المنتجات",
            price: '- ' + getCashBackDiscount()?.toFixed(2)
        })

    if (getVatOnUsDiscount() > 0)
        summary.push({
            key: 'save',
            title: "Vat On US",
            title_arabic: "خصم المنتجات",
            price: '- ' + getVatOnUsDiscount()?.toFixed(2)
        })

    summary.push({
        key: 'save',
        title: "Product's Discount",
        title_arabic: "خصم المنتجات",
        price: '- ' + getSaveAmount()?.toFixed(2)
    })

    summary.push({
        key: 'total',
        title: 'Total',
        title_arabic: 'إجمالي المبلغ',
        price: getTotal()
    })
    return summary;
}

const getLoyalty = () => {
    var cartdata: any = getCart();
    var amountData = {} as discount;
    if (cartdata.loyalty) {
        amountData = cartdata.loyalty;
    }
    return amountData;
}

const getLoyaltyData = async () => {
    var loyaltyData: any = false;
    var cartdata: any = getCart();
    var loyaltyDataResponse: any = await getUserLoyaltyData();
    loyaltyData = loyaltyDataResponse?.loyaltyData?.data;
    if (loyaltyData && loyaltyData?.shipping_charges_eligiblity) {
        cartdata.loyalty_shipping = loyaltyData.shipping_charges_eligiblity
        var feesdata: any = {
            id: cartdata.fees.shipping?.id,
            title: cartdata.fees.shipping?.name,
            title_arabic: cartdata.fees.shipping?.name_arabic,
            amount: 0,
        }
        cartdata.fees.shipping = feesdata as fees
    }
    setCart(cartdata);
    return loyaltyData;
}

const setLoyalty = (data: any) => {
    var cartdata: any = getCart();
    var amountData: any = {
        id: data?.id,
        title: data?.title,
        title_arabic: data?.title_arabic,
        amount: data?.amount,
    }
    cartdata.loyalty = amountData as discount;
    setCart(cartdata);
}

const removeLoyalty = () => {
    var cartdata: any = getCart();
    cartdata.loyalty = {} as discount;
    setCart(cartdata);
}

const setShipping = async (city: any = false) => {
    var cartdata = getCart();
    var proid = getProductids()
    if (proid?.id?.length >= 1) {
        var setData: any = {
            userid: localStorage.getItem("userid"),
            city: city ? city : localStorage.getItem("globalcity"),
            productids: proid.id,
            subtotal: getTotal(),
            extraData: cartdata,
        }
        const shippingResponse = await getShippingData(setData);
        const responseJson = shippingResponse?.shippingData;
        if (responseJson.success) {
            cartdata = getCart();
            var feesdata: any = {
                id: responseJson?.data?.id,
                title: responseJson?.data?.name,
                title_arabic: responseJson?.data?.name_arabic,
                // loyalty work
                amount: (cartdata?.loyalty_shipping) ? 0 : (cartdata?.storeType === '1' || cartdata?.storeType === 1) ? 0 : responseJson?.data?.amount,
                // amount: responseJson?.data?.amount,
            }
            cartdata.fees.shipping = feesdata as fees
            setCart(cartdata)
        }
        else {
            cartdata = getCart();
            cartdata.fees.shipping = {} as fees
            setCart(cartdata)
        }
    }
    return cartdata;
}

const getPaymentMethodStatus = async (city: any = false) => {
    var proid = getProductids(true)
    var setData: any = {
        city: city ? city : localStorage.getItem("globalcity"),
        productids: proid.id,
        orderamount: getTotal()
    }
    var data: any;
    const paymentData = await getPaymentCart(setData);
    const responseJson = paymentData?.paymentData;
    data = responseJson.data
    return data
}

const getExpressDelivery = () => {
    var cartdata: any = getCart();
    var amountData = {} as fees;
    if (cartdata?.fees?.express) {
        amountData = cartdata?.fees?.express;
    }
    return amountData;
}

const getExpressDeliveryCart = async (city: any = false) => {
    // var proid = getProductids(true)
    var cityId = getCookie('selectedCity')
    var proid = getProductidsDuplicate(true)
    var setData: any = {
        productids: proid.id,
        product_qty: proid.quantity,
        // city: 'Jeddah',
        city: city ? city : cityId,
    }
    const localSCity = cityId
    // const localSCity = globalCity
    var EXdata: never[] = [];
    const productextra = await getProductDataCart(localSCity, setData)
    const responseJson = productextra?.productData
    EXdata = responseJson
    return EXdata;
}

function hasAnyGiftWithFgcart(products: product[]): boolean {
    return products?.some(product => product?.gift?.some(g => g?.fgcart === 1) ?? false);
}

const getFGCart = async (city: any = false) => {
    // var proid = getProductids(true)
    var cartdata = getCart();

    if (hasAnyGiftWithFgcart(cartdata?.products)) {
        return null
    }
    if (cartdata?.products)
        var proid = getProductids(true)
    var setData: any = {
        product_ids: proid.id,
        qtys: proid.quantity,
        sale_prices: proid.price,
        city: city ? city : localStorage.getItem("globalcity"),
        subtotal: getSubtotalSale()
    }
    var EXdata: never[] = [];
    const freegift = await getFreeGiftCart(setData)
    EXdata = freegift?.fgData
    return EXdata;
}

const setPickupStoreCart = (id: any, type: any, city: any) => {
    var cartdata: any = getCart();
    cartdata.storeId = id
    cartdata.storeType = type
    cartdata.storeCity = city
    setCart(cartdata)
    return cartdata;
}

const getPickupStoreCart = async (lang: any = 'ar', city: any = false) => {
    // var proid = getProductids(true)
    var proid = getProductidsDuplicate(true)
    var setData: any = {
        product_id: proid.id,
        qty: proid.quantity,
        city: city ? city : localStorage.getItem("globalcity"),
        store_id: localStorage.getItem("globalStore"),
        type: localStorage.getItem("globalStore") ? 0 : 0,
        lang: lang
    }
    var EXdata: never[] = [];
    const warehouse: any = await getWarehouseCart(setData);
    EXdata = warehouse?.warehouseData
    return EXdata;
}

const getDeliveryDate = async (city: any = false, express: any = 0) => {
    // var proid = getProductids(true)
    var proid = getProductidsDuplicate(true)
    var setData: any = {
        product_ids: proid.id,
        quantities: proid.quantity,
        city: city ? city : localStorage.getItem("globalcity"),
        express: express
    }
    var cartdata: any = getCart();
    var preprocount = cartdata.products.filter((element: any) => element.pre_order == 1).length
    if (preprocount == 1) {
        return [];
    }
    var EXdata: any = [];
    const deliverydate = await getAvailableDeliveryDates(setData)
    EXdata = deliverydate?.deliveryData
    setDeliveryDate(EXdata?.available_dates ? EXdata?.available_dates[0] : false)
    // console.log('cartdata?.deliveryDate', cartdata?.deliveryDate)
    // console.log('EXdata?.available_dates', EXdata?.available_dates)
    // console.log('include dates:', EXdata?.available_dates.includes(cartdata?.deliveryDate))
    // if(!cartdata?.deliveryDate) {
    //     setDeliveryDate(EXdata?.available_dates ? EXdata?.available_dates[0] : false)
    // }
    // else if(EXdata?.available_dates && !EXdata?.available_dates.includes(cartdata?.deliveryDate)) {
    //     console.log('setDeliveryDate', EXdata?.available_dates[0])
    //     setDeliveryDate(EXdata?.available_dates ? EXdata?.available_dates[0] : false)
    // }
    // cartdata.deliveryDate = EXdata?.available_dates ? EXdata?.available_date[    0] : false
    // setCart(cartdata)    

    return EXdata;
}

const getdeliveryDateData = () => {
    var cartdata: any = getCart();
    if (cartdata?.deliveryDate) {
        return cartdata?.deliveryDate
    }
    return false;
}

const setDeliveryDate = (date: any) => {
    var cartdata: any = getCart();
    cartdata.deliveryDate = date
    setCart(cartdata)
    return cartdata;
}

const getExpressDeliveryData = async (city: any = false) => {
    // var proid = getProductids(true)
    var proid = getProductidsDuplicate(true)
    var setData: any = {
        productids: proid.id,
        productqty: proid.quantity,
        city: city ? city : localStorage.getItem("globalcity"),
    }
    var cartdata: any = getCart();
    var preprocount = cartdata.products.filter((element: any) => element.pre_order == 1).length
    if (preprocount == 1) {
        return [];
    }
    var EXdata: never[] = [];
    const express = await getExpressRegional(setData)
    EXdata = express?.expressData
    return EXdata;
}

const unsetExpressDelivery = () => {
    var cartdata: any = getCart();
    cartdata.fees.express = {} as fees;
    for (let index = 0; index < cartdata.products.length; index++) {
        cartdata.products[index].express = false
    }
    setCart(cartdata)
    return cartdata;
}

const setExpressDelivery = (data: any = false) => {
    var cartdata: any = getCart();
    var feesdata: any = {
        id: data?.data?.id,
        title: data?.data?.title,
        title_arabic: data?.data?.title_arabic,
        num_of_days: data?.data?.num_of_days,
        amount: data?.data?.price,
    }
    cartdata.fees.express = feesdata
    for (let index = 0; index < cartdata.products.length; index++) {
        const element = cartdata.products[index];
        // free gift
        for (let g = 0; g < element?.gift?.length; g++) {
            const elementgift = element?.gift[g];
            if (data?.data?.applied_id?.includes(elementgift.id)) {
                cartdata.products[index].gift[g].express = true
                var qty = 0;
                var totalQty = 0;
                for (let i = 0; i < data?.data.applied_id?.length; i++) {
                    const elm = data?.data.applied_id[i];
                    if (elementgift?.id == elm) {
                        totalQty = data?.quantities[i]
                        if (data?.data?.applied_qtys[i] >= data?.quantities[i]) {
                            qty = data?.quantities[i]
                        }
                        else {
                            qty = data?.data?.applied_qtys[i]
                        }
                    }
                }
                cartdata.products[index].gift[g].express_qty = qty
                cartdata.products[index].gift[g].express_total_qty = totalQty
            }
        }

        // fbt
        for (let f = 0; f < element?.fbt?.length; f++) {
            const elementfbt = element?.fbt[f];
            if (data?.data?.applied_id?.includes(elementfbt.id)) {
                cartdata.products[index].fbt[f].express = true
                var qty = 0;
                var totalQty = 0;
                for (let i = 0; i < data?.data.applied_id?.length; i++) {
                    const elm = data?.data.applied_id[i];
                    if (elementfbt?.id == elm) {
                        totalQty = data?.quantities[i]
                        if (data?.data?.applied_qtys[i] >= data?.quantities[i]) {
                            qty = data?.quantities[i]
                        }
                        else {
                            qty = data?.data?.applied_qtys[i]
                        }
                    }
                }
                cartdata.products[index].fbt[f].express_qty = qty
                cartdata.products[index].fbt[f].express_total_qty = totalQty
            }
        }

        if (data?.data?.applied_id?.includes(element.id)) {
            cartdata.products[index].express = true
            var qty = 0;
            var totalQty = 0;
            for (let i = 0; i < data?.data.applied_id?.length; i++) {
                const elm = data?.data.applied_id[i];
                if (element?.id == elm) {
                    totalQty = data?.quantities[i]
                    if (data?.data?.applied_qtys[i] >= data?.quantities[i]) {
                        qty = data?.quantities[i]
                    }
                    else {
                        qty = data?.data?.applied_qtys[i]
                    }
                }
            }
            cartdata.products[index].express_qty = qty
            cartdata.products[index].express_total_qty = totalQty
        }
    }
    setCart(cartdata)
    return true;
}


const getDoorStep = () => {
    var cartdata: any = getCart();
    var amountData = {} as fees;
    if (cartdata?.fees?.doorstep) {
        amountData = cartdata?.fees?.doorstep;
    }
    return amountData;
}

const getDoorStepData = async () => {
    var proid = getProductids(true)
    var setData: any = {
        productids: proid.id,
    }
    var EXdata: never[] = [];
    const doorstep = await getDoorstepCart(setData)
    EXdata = doorstep?.doorstepData?.data
    return EXdata;
}

const unsetDoorStep = () => {
    var cartdata: any = getCart();
    cartdata.fees.doorstep = {} as fees;
    setCart(cartdata)
    return cartdata;
}

const setDoorStep = (data: any = false) => {
    var cartdata: any = getCart();
    var feesdata: any = {
        id: data?.id,
        title: data?.title,
        title_arabic: data?.title_arabic,
        num_of_days: data?.num_of_days,
        amount: data?.price,
    }
    cartdata.fees.doorstep = feesdata
    setCart(cartdata)
    return true;
}

const getCoupon = () => {
    var cartdata: any = getCart();
    var amountData = {} as discount;
    if (cartdata?.discounts?.coupon) {
        amountData = cartdata?.discounts?.coupon;
    }
    return amountData;
}

const unsetcoupon = () => {
    var cartdata: any = getCart();
    cartdata.discounts.coupon = {} as discount;
    cartdata.extradata = [];
    setCart(cartdata)
    return cartdata;
}

const setCoupon = async (city: any = false, code: any = false) => {
    var cartdata: any = getCart();
    var proid = getProductids(true)
    var setData: any = {
        userid: localStorage.getItem("userid"),
        city: city ? city : localStorage.getItem("globalcity"),
        productids: proid.id,
        productprice: proid.price,
        productqty: proid.quantity,
        coupon_code: code ? code : false,
        paymentmethod: cartdata?.paymentMethod ? cartdata?.paymentMethod : false,
        // subtotal: getSubtotal(),
        // subtotal: getSubtotalSale(),
        subtotal: getTotal(),
        cartdata: cartdata,
        device: "desktop",
    }
    var success = false
    const coupon = await getCouponData(setData)
    const responseJson = coupon?.couponData;
    if (responseJson.success) {
        cartdata = getCart();
        var feesdata: any = {
            id: responseJson?.data?.id,
            title: responseJson?.data?.title,
            title_arabic: responseJson?.data?.title_arabic,
            amount: responseJson?.data?.amount,
        }
        cartdata.discounts.coupon = feesdata as discount
        if (responseJson?.data?.extradata)
            cartdata.extradata = responseJson?.data?.extradata
        setCart(cartdata)
        success = true
    }

    return success;
}
const setDiscountRule = async (city: any = false) => {
    var cartdata: any = getCart();
    var proid = getProductids(true)
    if (cartdata?.products?.length >= 1) {
        var setData: any = {
            userid: localStorage.getItem("userid"),
            city: city ? city : localStorage.getItem("globalcity"),
            productids: proid.id,
            productprice: proid.price,
            productqty: proid.quantity,
            coupon: cartdata?.discounts?.coupon ? cartdata?.discounts?.coupon?.id : false,
            paymentmethod: cartdata?.paymentMethod ? cartdata?.paymentMethod : false,
            store_id: localStorage.getItem("globalStore"),
            subtotal: getTotal(),
            extradata: cartdata?.extradata ? cartdata?.extradata : null,
            // discountType: 0,
            device: "desktop",
        }
        const discountrule = await applyDiscountRule(setData)
        const responseJson = discountrule?.discountData;
        if (responseJson.success) {
            cartdata = getCart();
            var discounts: any = []
            if (responseJson.data.cart.length)
                discounts = discounts.concat(responseJson.data.cart)
            if (responseJson.data.bulk.length)
                discounts = discounts.concat(responseJson.data.bulk)
            cartdata.discounts.discuountRules = discounts

            cartdata.products = cartdata.products.filter((e: any) => !e?.bogo)
            if (responseJson.data.bogo.length) {
                cartdata.products = cartdata.products.concat(responseJson.data.bogo)
            }
            setCart(cartdata)
            return false;
        }
    }
    return cartdata;
}

const setDiscountRuleBogo = async (city: any = false) => {
    return false
    // var cartdata: any = getCart();
    // var proid = getProductids(true)
    // if (cartdata?.products?.length >= 1) {
    //     var setData: any = {
    //         userid: localStorage.getItem("userid"),
    //         city: city ? city : localStorage.getItem("globalcity"),
    //         productids: proid.id,
    //         productprice: proid.price,
    //         productqty: proid.quantity,
    //         coupon: cartdata?.discounts?.coupon ? cartdata?.discounts?.coupon?.id : false,
    //         paymentmethod: cartdata?.paymentMethod ? cartdata?.paymentMethod : false,
    //         //subtotal: getSubtotal(),
    //         // subtotal: getSubtotalSale(),
    //         subtotal: getTotal(),
    //         extradata: cartdata?.extradata ? cartdata?.extradata : null,
    //         discountType: 1,
    //         device: "desktop",
    //     }
    //     await post('discountRule', setData).then(async (responseJson: any) => {
    //         if (responseJson.success) {
    //             cartdata = getCart();

    //             cartdata.products = cartdata.products.filter((e: any) => !e?.bogo)
    //             if (responseJson.data.bogo.length) {
    //                 cartdata.products = cartdata.products.concat(responseJson.data.bogo)
    //             }
    //             setCart(cartdata)
    //             return false;
    //         }
    //     })
    // }
    // return cartdata;
}

function calculateTimeLeft(endTime: any) {
    const now: any = new Date();
    const end: any = new Date(endTime);
    const difference: any = end - now;

    if (difference <= 0) {
        return { expired: true };
    }

    return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
    };
}

const recheckcartdata = async (lang: any = 'ar', city: any = false) => {
    var cartdata = getCart();
    var proid = getProductids()
    var response: any = {
        success: true,
        messages: [],
    }
    var removeids: any = []
    if (proid.id.length) {
        var setData: any = {
            productids: proid.id,
            city: city ? city : localStorage.getItem("globalcity")
        }
        const recheck = await recheckCartRegionalData(setData)
        const responseJson = recheck?.recheckData;
        for (let index = 0; index < cartdata.products.length; index++) {
            const element: any = cartdata.products[index];
            var checkdata = responseJson?.data?.filter((e: any) => e.id == element.id)
            if (checkdata?.length) {
                cartdata.products[index].total_quantity = checkdata[0].quantity
                if (checkdata[0].quantity < cartdata.products[index].quantity) {
                    response.success = false
                    var me: any = element.name + ' quantity has been changed'
                    response.messages.push(me)
                    cartdata.products[index].quantity = checkdata[0].quantity
                }
                if (cartdata.products[index].quantity <= 0) {
                    removeids.push(index)
                    response.success = false
                }
                var newprice = checkdata[0].sale_price ? checkdata[0].sale_price : checkdata[0].price
                // if(checkdata[0].promotional_price){
                //     newprice -= checkdata[0].promotional_price
                // }
                if (checkdata[0]?.flash_sale_expiry && checkdata[0]?.flash_sale_price) {
                    var timer = calculateTimeLeft(checkdata[0]?.flash_sale_expiry);
                    if (!timer?.expired) {
                        newprice = checkdata[0]?.flash_sale_price
                    }
                }
                if (cartdata.products[index].price != newprice) {
                    cartdata.products[index].price = newprice
                    response.success = false
                    var me: any = element.name + ' price has been changed'
                    response.messages.push(me)
                }
                cartdata.products[index].regular_price = checkdata[0].price

                if (element?.gift?.length) {
                    if (!responseJson?.extraData[element.id]?.freegiftData) {
                        cartdata.products[index].gift = []
                        response.success = false
                        var me: any = element.name + ' gifts has been changed'
                        response.messages.push(me)
                    }
                    else if (responseJson?.extraData[element.id]?.freegiftData?.allowed_gifts < element?.gift?.length) {
                        cartdata.products[index].gift = []
                        response.success = false
                        var me: any = element.name + ' gifts has been changed'
                        response.messages.push(me)
                    }
                }

                if (element?.fbt?.length) {
                    if (!responseJson?.extraData[element.id]?.fbtdata) {
                        cartdata.products[index].fbt = []
                        response.success = false
                        var me: any = element.name + ' fbt has been changed'
                        response.messages.push(me)
                    } else {
                        const elementfbt = responseJson?.extraData[element.id]?.fbtdata?.fbtlist[0];
                        const currentfbt = element?.fbt[0]
                        var fbtprice: number = elementfbt.productdetail.sale_price ? elementfbt.productdetail.sale_price : elementfbt.productdetail.price
                        if (responseJson?.extraData[element.id]?.fbtdata?.discount_type == 1) {
                            fbtprice -= (elementfbt?.discount * fbtprice) / 100;
                        } else {
                            // fbtprice = elementfbt?.discount;
                            // amount type
                            if (responseJson?.extraData[element.id]?.fbtdata?.amount_type == 1) {
                                fbtprice = fbtprice - elementfbt?.discount;
                            }
                            else {
                                fbtprice = elementfbt?.discount;
                            }
                        }

                        if (currentfbt?.discounted_amount != fbtprice || currentfbt?.id != elementfbt.product_id) {
                            cartdata.products[index].fbt = []
                            response.success = false
                            var me: any = element.name + ' fbt has been changed'
                            response.messages.push(me)
                        }
                    }
                }
            }
        }
        setCart(cartdata)
        if (removeids?.length) {
            for (let index = 0; index < removeids.length; index++) {
                const element = removeids[index];
                removeCartItem(element)
            }
        }
    }
    return response
}

const getProductidsDuplicate = (extra: boolean = false) => {
    var cartData = getCart();
    var productids: any = [];
    var productprice: any = [];
    var productqty: any = [];
    var productData: any = false;

    for (let index = 0; index < cartData.products.length; index++) {

        const element = cartData.products[index];
        // productids.push(element.id)
        // productprice.push(element.price)
        // productqty.push(element.quantity)

        // if (!element.bogo) {
        productids.push(element.id)
        productprice.push(element.price)
        productqty.push(element.quantity)
        if (element?.gift) {
            productids = productids.concat(element?.gift.map(function (g: any) { return g.id; }))
            productprice = productprice.concat(element?.gift.map(function (g: any) { return g.discounted_amount; }))
            productqty = productqty.concat(element?.gift.map(function (g: any) { return g.quantity; }))
        }
        if (element?.fbt) {
            productids = productids.concat(element?.fbt.map(function (f: any) { return f.id; }))
            productprice = productprice.concat(element?.fbt.map(function (f: any) { return f.discounted_amount; }))
            productqty = productqty.concat(element?.fbt.map(function (f: any) { return f.quantity; }))
        }
        // }
    }
    if (extra) {
        productData = {
            id: productids,
            quantity: productqty,
            price: productprice
        };
    } else {
        productData = {
            id: productids
        }
    }
    return productData;
}

const getProductids = (extra: boolean = false) => {
    var cartData = getCart();
    var productids: any = [];
    var productprice: any = [];
    var productqty: any = [];
    var productData: any = false;

    for (let index = 0; index < cartData.products.length; index++) {

        const element = cartData.products[index];
        if (!element.bogo) {
            productids.push(element.id)
            productprice.push(element.price)
            productqty.push(element.quantity)
            if (element?.fbt) {
                productids = productids.concat(element?.fbt.map(function (f: any) { return f.id; }))
                productprice = productprice.concat(element?.fbt.map(function (f: any) { return f.discounted_amount; }))
                productqty = productqty.concat(element?.fbt.map(function (f: any) { return f.quantity; }))
            }
        }
    }
    if (extra) {
        productData = {
            id: productids,
            quantity: productqty,
            price: productprice
        };
    } else {
        productData = {
            id: productids
        }
    }
    return productData;
}

const proceedToCheckout = async (city = false, lang: any, userDevice: any) => {
    var cartdata: any = getCart();
    var proid = getProductids(true)
    var setData: any = {
        userid: localStorage.getItem("userid"),
        city: city ? city : localStorage.getItem("globalcity"),
        cartdata: cartdata,
        subtotal: getSubtotal(),
        saveamounttotal: getSaveAmount(),
        cashback_amount: getCashBackDiscount(),
        vatonus_amount: getVatOnUsDiscount(),
        total: getTotal(),
        lang: lang,
        userDevice: userDevice,
        extradata: cartdata?.extradata ? cartdata?.extradata : null,
        affiliationCode: localStorage.getItem("affiliationCode")
    }
    var response: any = {}
    const orderData = await submitOrderCart(setData)
    const responseJson = orderData?.orderData;
    cartdata = getCart()
    cartdata.orderId = responseJson.order_id
    response = responseJson.redirection
    if (!localStorage?.getItem('orderId')) {
        localStorage?.setItem('orderId', responseJson.order_id)
    }
    setCart(cartdata)
    if (cartdata.paymentMethod == 'cod' || cartdata.paymentMethod == 'loyalty')
        removeCart()
    return response;
}

const getOrderId = () => {
    var cartdata = getCart()
    return cartdata.orderId;
}


const setExtraFees = async (paymentMethod: any = false) => {
    var cartdata: any = getCart();
    var setData: any = {
        paymentmethod: paymentMethod ? paymentMethod : false,
        //amount: getSubtotal(),
        amount: getSubtotalSale(),
    }
    const feesData = await getFeesCart(setData)
    const responseJson = feesData?.feesData;
    cartdata.fees.fee = responseJson?.data
    setCart(cartdata)
    return cartdata;
}

export {
    setCartExpiry, getCartItems, getSubtotalSale, setCartItems, recheckcartdata, getCart, getCartCount, getSummary, removeCartItem, removeCartItemFbt, removeCartItemGift, increaseQty, setShipping, getProductids, setDiscountRule, setDiscountRuleBogo, getShippingAddress, setShippingAddress, setPaymentMethod, getPaymentMethod, getPaymentMethodStatus, getWrapper, unsetWrapper, setWrapper, getInstallation, unsetInstallation, setInstallation, getCoupon, setCoupon, unsetcoupon, proceedToCheckout, getOrderId, removeCart, getExpressDelivery, setExpressDelivery, unsetExpressDelivery, getExpressDeliveryData, getDoorStep, setDoorStep, unsetDoorStep, getDoorStepData, setExtraFees, getExtraFees, removecheckoutdata, setCart, addfbtextraitem, updateCartItemFbtQty, getExpressDeliveryCart, getPickupStoreCart, setPickupStoreCart, getFGCart, addgifttextraitem
    , getLoyalty, getLoyaltyData, setLoyalty, removeLoyalty, getDeliveryDate, getdeliveryDateData, setDeliveryDate
}