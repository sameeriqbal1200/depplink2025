"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Lottie from "lottie-react"
import dynamic from 'next/dynamic'
import { getDictionary } from "../dictionaries"
import { useRouter, usePathname } from 'next/navigation'
import shoppingCart from "../../../public/json/NoProductsFound.json"
import { useApp } from '@/app/_ctx/AppContext';

const Products = dynamic(() => import('../components/Products'), { ssr: true })
const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })
export const fetchCache = 'force-no-store'

export default function Category({ params, searchParams }: { params: { data: any}, searchParams: any }) {
  const [filterHide, setFilterHide] = useState<any>(false);
  const router = useRouter()
  const { lang, slug } = useApp();
  const NewMedia = process.env.NEXT_PUBLIC_MEDIA;
  const isArabic = lang === 'ar' ? true : false;
  const pathname = usePathname()
  const [BrandfilterHide, setBrandfilterHide] = useState<any>(false);
  const [RatingfilterHide, setRatingfilterHide] = useState<any>(false);
  const [PricefilterHide, setPricefilterHide] = useState<any>(false);
  const [dict, setDict] = useState<any>([]);
  const [itemsToShowTag, setitemsToShowTag] = useState<any>({});
  const [CatData, setCatData] = useState<any>(params.data);
  const [currentPage, setcurrentPage] = useState<any>(params.data?.productData?.products?.current_page);
  const [min, setmin] = useState<any>('');
  const [max, setmax] = useState<any>('');
  const [selectedcats, setselectedcats] = useState<any>({})
  const [selectedbrands, setselectedbrands] = useState<any>({})
  const [selectedtags, setselectedtags] = useState<any>({})
  const [selectedrating, setselectedrating] = useState<any>({})
  const [sort, setsort] = useState<any>(false);
  useEffect(() => {
    (async () => {
      const translationdata = await getDictionary(lang);
      setDict(translationdata);
      if (searchParams?.brand) {
        setBrandfilterHide(true)
        var br = searchParams?.brand.split(',')
        var brandnames = selectedbrands;
        for (var b = 0; b < br.length; b++) {
          if (!brandnames[br[b]]) {
            brandnames[br[b]] = true;
          }
        }
        setselectedbrands(brandnames)
      }

      if (searchParams?.cats) {
        setFilterHide(true)
        var cats = searchParams?.cats.split(',')
        var scats = selectedcats
        for (var c = 0; c < cats.length; c++) {
          if (!scats[cats[c]]) {
            scats[cats[c]] = true;
          }
        }
        setselectedcats(scats)
      }

      if (searchParams?.rating) {
        setRatingfilterHide(true)
        var rates = searchParams?.rating.split(',')
        var srate = selectedrating
        for (var r = 0; r < rates.length; r++) {
          if (!srate[rates[r]]) {
            srate[rates[r]] = true;
          }
        }
        setselectedrating(srate)
      }

      if (searchParams?.min) {
        setPricefilterHide(true)
        setmin(searchParams?.min)
      }
      if (searchParams?.max) {
        setPricefilterHide(true)
        setmax(searchParams?.max)
      }

      if (searchParams?.tags) {
        var tagdata = searchParams?.tags.split(',')
        var shitems = selectedtags
        var maintag = itemsToShowTag
        for (var t = 0; t < tagdata.length; t++) {
          if (!shitems[tagdata[t]]) shitems[tagdata[t]] = true;
          for (let index = 0; index < CatData?.productData?.tags?.length; index++) {
            const element = CatData?.productData?.tags[index];
            const relatetype = element?.childs?.filter((item: any) => item?.name == tagdata[t]);
            if (relatetype.length) {
              maintag[element.id] = true;
            }
          }
        }
        setselectedtags({ ...shitems })
        setitemsToShowTag({ ...maintag })
      }
      setCatData(params.data)
      setmin(params.data?.productData?.min)
      setmax(params.data?.productData?.max)
      if (currentPage != params.data?.productData?.products?.current_page)
        setcurrentPage(params.data?.productData?.products?.current_page)
    })();
  }, [params])

  const listToTree = (arr: any = []) => {
    let map: any = {}, node, res = [], i;
    for (i = 0; i < arr.length; i += 1) {
      map[arr[i].tag_id] = [];
    };
    for (i = 0; i < arr.length; i += 1) {
      node = arr[i];
      map[node.tag_id].push(node)
    }
    return map
  };

  const openTag = (t: string | number) => {
    var shitems = itemsToShowTag;
    if (!shitems[t]) shitems[t] = true;
    else shitems[t] = false;
    setitemsToShowTag({ ...shitems })
  }

  const filter = () => {
    var filterdata: any = {}
    if (currentPage)
      filterdata['page'] = currentPage
    if (min)
      filterdata['min'] = min
    if (max)
      filterdata['max'] = max
    if (Object.keys(selectedcats).length)
      filterdata['cats'] = Object.keys(selectedcats).join(',')
    if (Object.keys(selectedbrands).length)
      filterdata['brand'] = Object.keys(selectedbrands).join(',')
    if (Object.keys(selectedrating).length)
      filterdata['rating'] = Object.keys(selectedrating).join(',')
    if (Object.keys(selectedtags).length)
      filterdata['tags'] = Object.keys(selectedtags).join(',')
    if (sort)
      filterdata['sort'] = sort
    const result = '?' + new URLSearchParams(filterdata).toString();
    if (Object.keys(filterdata).length >= 1) {
      router.push(`/${lang}/newly-arrived${result}`, { scroll: false })
      router.refresh();
    }
  }

  useEffect(() => {
    if (min != searchParams?.min && min)
      filter()
  }, [min])

  useEffect(() => {
    if (sort != searchParams?.sort && sort)
      filter()
  }, [sort])

  useEffect(() => {
    if (max != searchParams?.max && max)
      filter()
  }, [max])

  useEffect(() => {
    if (currentPage != params.data?.productData?.products?.current_page)
      filter()
  }, [currentPage])

  const SortingProduct = [
    { value: '', label: lang == 'ar' ? 'الأكثر تطابقاً' : 'Relevance' },
    { value: 'price-asc', label: lang == 'ar' ? 'السعر (من الأقل إلى الأعلى)' : 'Price (Low to High)' },
    { value: 'price-desc', label: lang == 'ar' ? 'السعر (من الأعلى إلى الأقل)' : 'Price (Hight to Low)' },
  ];

  return (
    <>
        <MobileHeader type="Secondary" lang={lang} dict={dict} pageTitle={lang === 'ar' ? CatData?.category?.name_arabic : CatData?.category?.name} />
      <div className='container py-4 max-md:pt-20'>

        <div className='py-8 max-md:py-0'>
          
          <div className="flex xl:flex-row flex-col gap-4 mt-5 max-md:mt-0">
            

            {CatData?.productData?.products?.data?.length ?
              <div className="px-0 flex-1 py-0 ltr:xl:mr-1 rtl:xl:ml-1">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold">{params.data?.productData?.products?.total} {lang == 'ar' ? 'منتجات' : 'Products'}</h2>
                  <Select
                    styles={{
                      control: (provided: any, state: any) => ({
                        ...provided,
                        background: '#fff',
                        borderColor: '#004B7A',
                        minHeight: '30px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: state.isFocused ? null : null,
                      }),

                      valueContainer: (provided, state) => ({
                        ...provided,
                        height: '32px',
                        overflow: 'visible',
                      }),
                      indicatorSeparator: state => ({
                        display: 'none',
                      }),
                      indicatorsContainer: (provided, state) => ({
                        ...provided,
                        height: '32px',
                      }),
                    }}
                    defaultValue={SortingProduct[0]}
                    options={SortingProduct}
                    isSearchable={false}
                    onChange={(e: any) => setsort(e.value)}
                    className="w-44 max-md:w-36 text-primary font-medium text-xs focus-visible:outline-none"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {/* SORTING */}
                  <Products NewMedia={NewMedia} isArabic={isArabic} lang={lang} dict={dict?.products} products={CatData?.productData?.products?.data} />
                </div>
                <ul className="flex items-center justify-center space-x-0.5 rtl:space-x-reverse m-auto mt-6">
                  {CatData?.productData?.products?.current_page != 1 ?
                    <li>
                      <button
                        type="button"
                        onClick={() => { setcurrentPage(CatData?.productData?.products?.current_page - 1); }}
                        className="focus-visible:outline-none flex justify-center font-medium text-sm px-3.5 py-1.5 rounded transition text-primary bg-white hover:text-[#219EBC] border border-[#DFE3E8] hover:border-[#219EBC]"
                      >
                        {lang == 'ar' ? 'سابق' : 'Prev'}
                      </button>
                    </li>
                    : null}
                  {[...Array(CatData?.productData?.products?.last_page)].map((_, i) => {
                    var cname = (i + 1) == CatData?.productData?.products?.current_page ? "[#219EBC]" : 'primary'
                    var bname = (i + 1) == CatData?.productData?.products?.current_page ? "[#219EBC]" : '[#DFE3E8]'
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => { setcurrentPage(i + 1); }}
                          className={"focus-visible:outline-none flex justify-center font-medium text-sm px-3.5 py-1.5 rounded transition bg-white hover:text-[#219EBC] border border-" + bname + " hover:border-[#219EBC] text-" + cname}
                        >
                          {i + 1}
                        </button>
                      </li>
                    )
                  })
                  }
                  {CatData?.productData?.products?.current_page != CatData?.productData?.products?.last_page ?
                    <li>
                      <button
                        type="button"
                        onClick={() => { setcurrentPage(CatData?.productData?.products?.current_page + 1); }}
                        className="focus-visible:outline-none flex justify-center font-medium text-sm px-3.5 py-1.5 rounded transition text-primary bg-white hover:text-[#219EBC] border border-[#DFE3E8] hover:border-[#219EBC]"
                      >
                        {lang == 'ar' ? 'التالي' : 'Next'}
                      </button>
                    </li>
                    : null}
                </ul>
              </div>
              :
              <div className="container my-10 flex items-center justify-center py-8">
                <div className='text-center'>
                  <Lottie animationData={shoppingCart} loop={true} className="h-80 my-[-50px]" />
                  <p className="text-center text-base text-[#5D686F] w-1/2 m-auto mt-14">{lang == 'ar' ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق الخاصة بك بعد، تصفح المنتجات وأضفها إلى سلة التسوق الخاصة بك لعملية دفع سريعة تصفح المنتجات وقم باضافتها الي العربة الان.' : 'You have not added any products to your shopping cart yet. Browse the products and add them to your shopping cart for a quick checkout process. Browse the products and add them to the cart now.'}</p>
                  <button className="focus-visible:outline-none btn bg-[#004B7A] w-72 p-2.5 rounded-md text-sm 2xl:text-base text-white mt-6" onClick={() => router.push('/')}>{lang == 'ar' ? 'تسوق المنتجات' : 'Shop products'}</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div >
    </>
  )
}
