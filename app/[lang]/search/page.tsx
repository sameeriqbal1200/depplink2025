"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Select from 'react-select'
import Lottie from "lottie-react"
import dynamic from 'next/dynamic'
import { getDictionary } from "../dictionaries"
import { useRouter, usePathname } from 'next/navigation'
import shoppingCart from "../../../public/json/NoProductsFound.json"
import Pagination from '../components/Pagination';
import { useApp } from '@/app/_ctx/AppContext';

const Products = dynamic(() => import('../components/Products'), { ssr: true })
const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })
const BrandSliderOther = dynamic(() => import('../components/BrandSliderOther'), { ssr: true })
export const fetchCache = 'force-no-store'

export default function Category({ params, searchParams }: { params: { data: any, devicetype: any }, searchParams: any }) {
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
  const [loaderStatus, setLoaderStatus] = useState<any>(false)

  const isMobileOrTablet = params?.devicetype === 'mobile' || params?.devicetype === 'tablet' ? true : false;
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
    if (searchParams?.text)
      filterdata['text'] = searchParams?.text
    const result = '?' + new URLSearchParams(filterdata).toString();
    if (Object.keys(filterdata).length >= 1) {
      router.push(`/${lang}/search${result}`, { scroll: false })
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

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  return (
    <>
        <MobileHeader type="Third" lang={lang} dict={dict} pageTitle={`"${searchParams?.text}"`} />
      <div className='tpb_308mainDiv'>
        <div className='srh__302mainDiv'>
          {CatData?.brands?.length ?
          <>
          <h2 className="srh__302mainInnerSmHeading">{lang == 'ar' ? 'تصفية حسب العلامات التجارية' : `Filter's by Brands`}</h2>
          <BrandSliderOther NewMedia={NewMedia} devicetype={params.devicetype} lang={lang} dict={dict?.products} data={CatData?.brands} BrandData={selectedbrands} setBrandData={(id: number, name: string) => {
            var bdata = selectedbrands
            if (!bdata[name]) {
              bdata[name] = true;
            } else {
              delete bdata[name];
            }
            setselectedbrands({ ...bdata })
            filter();
          }} />
          </>
          :null}
          {CatData?.cats?.length ?
          <>
          <h2 className="srh__302mainInnerSmHeading">{lang == 'ar' ? 'فلتر حسب الفئة' : `Filter's by Category`}</h2>
          <BrandSliderOther NewMedia={NewMedia} devicetype={params.devicetype} lang={lang} dict={dict?.products} data={CatData?.cats} BrandData={selectedcats} setBrandData={(id: number, name: string) => {
            var bdata = selectedcats
            if (!bdata[name]) {
              bdata[name] = true;
            } else {
              delete bdata[name];
            }
            // bdata[name] = true; 
            setselectedcats({ ...bdata })
            filter();
          }} />
          </>
          :null}
          {CatData?.productData?.products?.data?.length ?
            <div className="mt-5">
              <div className="srh__302mainInnerSecDiv">
                <h2 className="h__312BaseHeading">{params.data?.productData?.products?.total} {lang == 'ar' ? 'منتجات' : 'Products'}</h2>
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
                  className="srh__302mainInnerSelect"
                  classNamePrefix="react-select"
                />
              </div>
              {/* <div className="srh__302mainInnerThirdDiv"> */}
                {/* <Products grid={!isMobileOrTablet ? '4' : '2'} className="!min-w-44" devicetype={params?.devicetype} lang={params?.lang} dict={dict?.products} products={CatData?.productData?.products?.data} /> */}
                <Products NewMedia={NewMedia} isArabic={isArabic} grid={!isMobileOrTablet ? '6' : '2'} className="!min-w-40" devicetype={isMobileOrTablet} lang={params?.lang} dict={dict?.products} products={CatData?.productData?.products?.data} />
              {/* </div> */}
              {/* <ul className="srh__302mainInnerUL">
                {CatData?.productData?.products?.current_page != 1 ?
                  <li>
                    <button
                      type="button"
                      onClick={() => { setcurrentPage(CatData?.productData?.products?.current_page - 1); }}
                      className="srh__302mainActionBtn"
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
                        className={"srh__302mainPagBtn border-" + bname + " text-" + cname}
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
                      className="srh__302mainActionBtn"
                    >
                      {lang == 'ar' ? 'التالي' : 'Next'}
                    </button>
                  </li>
                  : null}
              </ul> */}
              {params?.data?.productData?.products?.last_page > 1 && (
                <Pagination 
                  setCurrentPage={(newpage:any) => {
                    setLoaderStatus(true)
                    window.scrollTo(0, 0)
                    setcurrentPage(newpage);
                  }} 
                  currentPage={params?.data?.productData?.products?.current_page} 
                  lastPage={params?.data?.productData?.products?.last_page}
                />
              )}
            </div>
            :
            <div className="srh__302mainInnerFourthDiv">
              <div className='text-center'>
                <Lottie animationData={shoppingCart} loop={true} className="srh__302mainInnerLottie" />
                <p className="srh__302mainInnerBasePara">{lang == 'ar' ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق الخاصة بك بعد، تصفح المنتجات وأضفها إلى سلة التسوق الخاصة بك لعملية دفع سريعة تصفح المنتجات وقم باضافتها الي العربة الان.' : 'You have not added any products to your shopping cart yet. Browse the products and add them to your shopping cart for a quick checkout process. Browse the products and add them to the cart now.'}</p>
                <button className="btn srh__302mainShopProdBtn" onClick={() => router.push('/')}>{lang == 'ar' ? 'تسوق المنتجات' : 'Shop products'}</button>
              </div>
            </div>
          }
        </div>
      </div >
    </>
  )
}