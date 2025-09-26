"use client"; // This is a client component 👈🏽

import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import Lottie from "lottie-react"
import dynamic from 'next/dynamic'
import { getDictionary } from "../../../dictionaries"
import { useRouter, usePathname } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { post } from "../../../api/ApiCalls"
import shoppingCart from "../../../../../public/json/NoProductsFound.json"

const Products = dynamic(() => import('../../../components/Products'), { ssr: true })
const MobileHeader = dynamic(() => import('../../../components/MobileHeader'), { ssr: true })
const BrandSliderOther = dynamic(() => import('../../../components/BrandSliderOther'), { ssr: true })
export const fetchCache = 'force-no-store'

export default function BrandCategory({ params, searchParams }: { params: { lang: string, categorySlug: string, data: any, devicetype: any }, searchParams: any }) {
  const [filterHide, setFilterHide] = useState<any>(false);
  const router = useRouter()
  const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
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
  const [pricefilter, setpricefilter] = useState<any>(false);
  const [selectedcats, setselectedcats] = useState<any>({})
  const [selectedbrands, setselectedbrands] = useState<any>({})
  const [selectedtags, setselectedtags] = useState<any>({})
  const [selectedrating, setselectedrating] = useState<any>({})
  const [sort, setsort] = useState<any>(false)
  const [filterMobile, setFilterMobile] = useState<boolean>(false)
  const [termsandCondition, setTermsandCondition] = useState<boolean>(true)
  const [products, setproducts] = useState<any>([])
  const path = usePathname();

  useEffect(() => {
    (async () => {
      const translationdata = await getDictionary(params.lang);
      setDict(translationdata);
      if (searchParams?.brand) {
        setBrandfilterHide(true)
        var br = searchParams?.brand.split(',')
        var brandnames: any = {};
        for (var b = 0; b < br.length; b++) {
          if (!brandnames[br[b]]) {
            brandnames[br[b]] = true;
          }
        }
        setselectedbrands(brandnames)
        if (params?.devicetype == 'mobile') {
          window.scrollTo(0, 250)
        }
        else {
          window.scrollTo(0, 350)
        }
      }

      if (searchParams?.cats) {
        setFilterHide(true)
        var cats = searchParams?.cats.split(',')
        var scats: any = {}
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
        var srate: any = {}
        for (var r = 0; r < rates.length; r++) {
          if (!srate[rates[r]]) {
            srate[rates[r]] = true;
          }
        }
        setselectedrating(srate)
        if (params?.devicetype == 'mobile') {
          window.scrollTo(0, 250)
        }
        else {
          window.scrollTo(0, 350)
        }
      }
      if (searchParams?.tags) {
        var tagdata = searchParams?.tags.split(',')
        var shitems: any = {}
        //var maintag = itemsToShowTag
        for (var t = 0; t < tagdata.length; t++) {
          if (!shitems[tagdata[t]]) shitems[tagdata[t]] = true;
          for (let index = 0; index < CatData?.productData?.tags?.length; index++) {
            const element = CatData?.productData?.tags[index];
            const relatetype = element?.childs?.filter((item: any) => item?.name == tagdata[t]);
          }
        }
        setselectedtags({ ...shitems })
        if (params?.devicetype == 'mobile') {
          window.scrollTo(0, 250)
        }
        else {
          window.scrollTo(0, 350)
        }
        //setitemsToShowTag({ ...maintag })
      }
      // setCatData(params.data)
    })();
    var prodata = products
    if (params.data?.productData?.products?.current_page == 1)
      prodata = []
    prodata = prodata.concat(params.data?.productData?.products?.data)
    setproducts([...prodata])
    if (typeof window !== 'undefined') {
      var load = true
      window.onscroll = function () {
        var elem: any = document.getElementById('loadmore');
        if ((elem?.offsetTop - 700) <= window?.pageYOffset && load) {
          load = false
          // console.log('load')
          elem.click()
          setTimeout(function () {
            load = true
          }, 1500)
        }

      };
    }
    if(searchParams?.notifications?.length){
      notificationCount()
  }
  }, [params])

  const notificationCount = () => {
    if(searchParams?.notifications?.length){
        var data = {
            id: searchParams?.notifications,
            mobileapp: true,
        }
        post('notificationsCounts', data).then((responseJson: any) => {
            if (responseJson?.success) {
                // console.log("responseJsonCount",responseJson?.success)
            }
        })
    }
}

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
    if (currentPage && currentPage != params.data?.productData?.products?.current_page)
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
      if (Object.keys(filterdata).length == 3 && Object.keys(searchParams).length <= 3 && filterdata['page'] && currentPage == params.data?.productData?.products?.current_page && min == params.data?.productData?.min && max == params.data?.productData?.max)
        return false
      router.push(`${path}${result}`, { scroll: false })
      router.refresh();
    }
  }

  useEffect(() => {
    if (sort != searchParams?.sort && sort)
      filter()
  }, [sort])

  useEffect(() => {
    if (pricefilter)
      filter()
  }, [pricefilter])

  useEffect(() => {
    if(currentPage != params.data?.productData?.products?.current_page)
    filter()
  }, [currentPage])

  const SortingProduct = [
    { value: '', label: params.lang == 'ar' ? 'الأكثر تطابقاً' : 'Relevance' },
    { value: 'price-asc', label: params.lang == 'ar' ? 'السعر (من الأقل إلى الأعلى)' : 'Price (Low to High)' },
    { value: 'price-desc', label: params.lang == 'ar' ? 'السعر (من الأعلى إلى الأقل)' : 'Price (Hight to Low)' },
  ];

  return (
    <>
      <MobileHeader type="Secondary" lang={params.lang} dict={dict} pageTitle={params.lang === 'ar' ? CatData?.category?.name_arabic_app : CatData?.category?.name_app} onClick={() => setFilterMobile(true)} notifications={searchParams?.notifications} />
      <div className='container py-4 max-md:pt-20'>
        <div className='py-8 max-md:py-0'>
          <h2 className="text-sm font-bold pt-3 max-md:pt-0">{params.lang == 'ar' ? 'تصفية حسب العلامات التجارية' : `Filter's by Brands`}</h2>
          <BrandSliderOther NewMedia={NewMedia} devicetype={params.devicetype} lang={params.lang} dict={dict?.products} data={CatData?.productData?.brands} BrandData={selectedbrands} setBrandData={(id: number, name: string) => {
            var bdata = selectedbrands
            if (!bdata[name]) {
              bdata[name] = true;
            } else {
              delete bdata[name];
            }
            setselectedbrands({ ...bdata })
            filter();
          }} />
          {Object.values(listToTree(CatData?.category?.filtercategory)).map((d: any, z: any) => {
            return (
              <>
                <h3 className="text-sm font-bold mt-4 mb-2" key={d}>{params.lang == 'ar' ? 'التصفية حسب' : `Filter's by`} {params.lang == 'ar' ? d[z]?.parent_data?.name_arabic : d[z]?.parent_data?.name}</h3>
                <div className="flex flex-col m-auto p-auto" key={z + d}>
                  <div className="flex overflow-x-scroll hide-scroll-bar pb-1">
                    <div className="flex flex-nowrap items-center">
                      {d?.map((a: any, i: any) => {
                        return (
                          <button
                            key={i}
                            className={`focus-visible:outline-none ltr:mr-2.5 rtl:ml-2.5 w-24 py-2 md:mr-3.5 md:w-36 h-full md:py-4 md:px-2 max-w-xs overflow-hidden rounded-lg shadow-md transition-shadow duration-300 ease-in-out text-primary border hover:border-[#004B7A] hover:text-[#004B7A] hover:bg-[#004B7A05] ${selectedtags[a?.name] ? 'border-[#004B7A] bg-[#004B7A05] font-mdium' : 'border-white bg-white '}`}
                            onClick={() => {
                              var tagnames = selectedtags;
                              if (!tagnames[a?.name]) {
                                tagnames[a?.name] = true;
                              } else {
                                delete tagnames[a?.name];
                              }
                              setselectedtags({ ...tagnames })
                              filter();
                            }}
                          >
                            <div className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: a.icon }}></div>
                            <p className="mt-2 text-xs font-medium line-clamp-2 max-md:text-xs">{params.lang == 'ar' ? a.name_arabic : a.name}</p>
                          </button>
                        )
                      })
                      }
                    </div>
                  </div>
                </div>
              </>
            )
          })}
          <div className="flex xl:flex-row flex-col gap-4 mt-5">
            {CatData?.productData?.products?.data?.length ?
              <div className="px-0 flex-1 py-0 ltr:xl:mr-1 rtl:xl:ml-1">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold">{params.data?.productData?.products?.total} {params.lang == 'ar' ? 'منتج' : 'Products'}</h2>
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
                {products?.length ?
                <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {/* SORTING */}
                  <Products className="!min-w-40" devicetype={params.devicetype} lang={params.lang} dict={dict?.products} products={products} />
                </div>
                :null}
                {params?.data?.productData?.products?.current_page != params?.data?.productData?.products?.last_page ?
                  <button id="loadmore" className='opacity-0 pb-28' onClick={() => { setcurrentPage(params?.data?.productData?.products?.current_page + 1); }}>loadmore</button>
                  : null}
              </div>
              :
              <div className="container my-10 flex items-center justify-center py-8">
                <div className='text-center'>
                  <Lottie animationData={shoppingCart} loop={true} className="h-80 my-[-50px]" />
                  <p className="text-center text-base text-[#5D686F] md:w-1/2 m-auto mt-14">{params.lang == 'ar' ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق الخاصة بك بعد، تصفح المنتجات وأضفها إلى سلة التسوق الخاصة بك لعملية دفع سريعة تصفح المنتجات وقم باضافتها الي العربة الان.' : 'You have not added any products to your shopping cart yet. Browse the products and add them to your shopping cart for a quick checkout process. Browse the products and add them to the cart now.'}</p>
                  <button className="focus-visible:outline-none btn bg-[#004B7A] w-full md:w-72 p-2.5 rounded-md text-xs md:text-sm text-white mt-6" onClick={() => router.push('/')}>{params.lang == 'ar' ? 'تسوق المنتجات' : 'Shop products'}</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <>
        <Transition appear show={filterMobile} as={Fragment}>
          <Dialog as="div" className="relative z-30" onClose={() => setFilterMobile(false)}>
            <div className="fixed inset-0 bg-dark/40" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom={params.lang === 'ar' ? "translate-x-full" : "-translate-x-full"}
                enterTo={params.lang === 'ar' ? "-translate-x-0" : "translate-x-0"}
                leave="transition ease-in-out duration-300 transform"
                leaveFrom={params.lang === 'ar' ? "-translate-x-0" : "translate-x-0"}
                leaveTo={params.lang === 'ar' ? "translate-x-full" : "-translate-x-full"}
              >
                <Dialog.Panel className="w-full h-[-webkit-fill-available] mr-auto transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                  <div className="py-3.5 border-b mb-3 border-[#9CA4AB50]">
                    <div className="container flex items-center justify-between ">
                      <Dialog.Title
                        as="h4"
                        className="text-lg font-bold leading-6 text-gray-900"
                      >
                        {params.lang == 'ar' ? "الفلتر" : "Filter's"}
                      </Dialog.Title>
                      <button onClick={() => setFilterMobile(false)} className="focus-visible:outline-none">
                        <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-y-auto h-[-webkit-fill-available] pb-60 mt-4 container">
                    <div>
                      <label className="font-semibold text-base">{params.lang === 'ar' ? 'التقييم' : 'Rating'}</label>
                      <div className="mt-3 gap-1.5 flex flex-wrap items-center">
                        <button onClick={(e: any) => {
                          var rating = selectedrating;

                          if (!rating[1]) {
                            rating[1] = true;
                          } else {
                            delete rating[1];
                          }
                          setselectedrating({ ...rating })
                        }} className={selectedrating[1] ? 'bg-[#004B7A] text-white py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm' : 'bg-[#F0F5FA] text-primary py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm'}>{params.lang === 'ar' ? 'نجمة واحدة' : 'Single Rated'}</button>
                        <button onClick={(e: any) => {
                          var rating = selectedrating;

                          if (!rating[2]) {
                            rating[2] = true;
                          } else {
                            delete rating[2];
                          }
                          setselectedrating({ ...rating })
                        }} className={selectedrating[2] ? 'bg-[#004B7A] text-white py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm' : 'bg-[#F0F5FA] text-primary py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm'}>{params.lang === 'ar' ? 'نجمتين' : '2 Star'}</button>
                        <button onClick={(e: any) => {
                          var rating = selectedrating;

                          if (!rating[3]) {
                            rating[3] = true;
                          } else {
                            delete rating[3];
                          }
                          setselectedrating({ ...rating })
                        }} className={selectedrating[3] ? 'bg-[#004B7A] text-white py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm' : 'bg-[#F0F5FA] text-primary py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm'}>{params.lang === 'ar' ? '3 نجوم' : '3 Star'}</button>
                        <button onClick={(e: any) => {
                          var rating = selectedrating;

                          if (!rating[4]) {
                            rating[4] = true;
                          } else {
                            delete rating[4];
                          }
                          setselectedrating({ ...rating })
                        }} className={selectedrating[4] ? 'bg-[#004B7A] text-white py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm' : 'bg-[#F0F5FA] text-primary py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm'}>{params.lang === 'ar' ? '4 نجوم' : '4 Star'}</button>
                        <button onClick={(e: any) => {
                          var rating = selectedrating;

                          if (!rating[5]) {
                            rating[5] = true;
                          } else {
                            delete rating[5];
                          }
                          setselectedrating({ ...rating })
                        }} className={selectedrating[5] ? 'bg-[#004B7A] text-white py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm' : 'bg-[#F0F5FA] text-primary py-3 px-4 focus-visible:overflow-hidden rounded-full text-sm'}>{params.lang === 'ar' ? '5 نجوم' : '5 Star'}</button>
                      </div>
                    </div>
                    <hr className="opacity-10 my-4" />
                    <div>
                      {CatData?.productData?.tags?.map((tagdata: any, t: any, lineD: any) => {
                        return (
                          <>
                            <div key={t}>
                              <button className="focus-visible:outline-none flex items-center justify-between my-4 w-full" onClick={() => { openTag(tagdata.id) }}>
                                <label className="font-semibold text-sm">{params?.lang == 'ar' ? tagdata?.name_arabic : tagdata?.name}</label>
                                {itemsToShowTag[tagdata.id] === true ?
                                  <svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg" id="fi_12184291"><path d="m20 11h-16c-.26522 0-.51957.1054-.70711.2929-.18753.1875-.29289.4419-.29289.7071s.10536.5196.29289.7071c.18754.1875.44189.2929.70711.2929h16c.2652 0 .5196-.1054.7071-.2929s.2929-.4419.2929-.7071-.1054-.5196-.2929-.7071-.4419-.2929-.7071-.2929z" fill="#000"></path></svg>
                                  :
                                  <svg height="14" viewBox="0 0 426.66667 426.66667" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_1828925"><path d="m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031 9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 11.777344 9.558594 21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 21.335938 11.777344 0 21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 21.335938-21.335938 0-11.773437-9.558594-21.332031-21.335938-21.332031zm0 0"></path></svg>
                                }
                              </button>
                              <div className={`mt-3 ${itemsToShowTag[tagdata.id] == true ? 'block' : 'hidden'}`}>
                                {tagdata?.childs.map((tagchild: any, tc: React.Key | null | undefined) => {
                                  return (
                                    <label className="inline-flex gap-x-2 items-center justify-between w-full my-2.5" key={tc}>
                                      <span className={`text-sm ${selectedtags[tagchild.name] ? 'text-[#219EBC]' : 'text-[#5D686F] '} font-semibold`}>{params?.lang == 'ar' ? tagchild?.name_arabic : tagchild?.name}</span>
                                      <input type="checkbox" className="rounded outline-none focus-visible:outline-none focus:outline-none checked:bg-[#20831E] h-5 w-5 hidden"
                                        checked={selectedtags[tagchild.name] ? true : false}
                                        onChange={(e: any) => {
                                          var tagnames = selectedtags;

                                          if (!tagnames[tagchild.name]) {
                                            tagnames[tagchild.name] = true;
                                          } else {
                                            delete tagnames[tagchild.name];
                                          }
                                          setselectedtags({ ...tagnames })
                                          // filter();
                                        }}
                                      />
                                      {selectedtags[tagchild.name] ?
                                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                          <circle cx={12} cy={12} r={12} fill="#219EBC" opacity="0.2" />
                                          <path
                                            d="M7 13l3 3 7-7"
                                            stroke="#219EBC"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                        :
                                        <svg viewBox="0 0 24 24" fill="#F0F5FA" className="h-6 w-6">
                                          <circle cx={12} cy={12} r={12} fill="#219EBC60" opacity={0.2} />
                                        </svg>
                                      }
                                    </label>
                                  )
                                })
                                }
                              </div>
                              {t + 1 === lineD.length ? null :
                                <hr className="my-3 opacity-10" />
                              }
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </div>
                  <div className="fixed bottom-0 w-full px-4 py-3 bg-white shadow-md border-t border-[#5D686F26]">
                    <button onClick={() => { setFilterMobile(false); filter(); }} className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white font-medium">
                      {params.lang === 'ar' ? 'تطبيق' : 'Apply Selected Filter'}
                    </button>
                    <button onClick={async () => {
                      await setselectedbrands({})
                      await setselectedrating({})
                      await setselectedtags({})
                      setFilterMobile(false)
                      router.push(`/${params.lang}/category/${params.categorySlug}`, { scroll: false })
                      router.refresh();
                    }} className="text-[#DC4E4E] font-semibold text-sm underline mt-4 text-center mx-auto w-full">
                      {params.lang === 'ar' ? 'اعادة تعيين' : 'Reset Filter'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {path.indexOf('/category/ac-replacement') === -1 ?
          null
          :
          <Transition appear show={termsandCondition} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={() => setTermsandCondition(true)}>
              <div className="fixed inset-0 bg-dark/40" aria-hidden="true" />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-sm md:text-base font-semibold text-[#004B7A] mb-4 ltr:text-left rtl:text-right"
                      >
                        {params.lang === 'ar' ? 'عرض تمكين لاستبدال المكيفات | الشروط و الاحكام' : 'Tamkeen Ac Exchange offer | Terms & Conditions'}
                      </Dialog.Title>
                      <ul className="text-xs font-normal ltr:text-left rtl:text-right">
                        <li className="my-2">- {params.lang === 'ar' ? 'يتيح لك العرض استبدال المكيف القديم بمكيف جديد على مكيفات مختارة من الاسبليت والشباك' : '⁠The offer allows you to replace the old air conditioner with a new one on selected split and window air conditioners.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'لا يشترط أن يكون المكيف القديم يعمل ولكن يشترط أن يكون بحالة جيدة وبكامل محتوياته.' : '⁠The old air conditioner is not required to be working, but it is required to be in good condition and with all its contents.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'لا يشترط أن يكون المكيف القديم لعلامة تجارية معينة.' : 'The old air conditioner does not have to be of a specific brand.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'لا يشترط أن يكون المكيف القديم قد تم شراؤه من شركة تمكين.' : 'The old air conditioner is not required to have been purchased from Tamkeen Company.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'لا يمكن استرداد قيمة المكيف القديم نقدا.' : '⁠The value of the old air conditioner cannot be refunded in cash.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'يخضع عرض الاستبدال لتقييم شركة تمكين ويحق لشركة تمكين رفض المكيف القديم في حالة عدم مطابقته للشروط.' : 'The replacement offer is subject to Tamkeen’s evaluation, and Tamkeen has the right to reject the old air conditioner, If it does not comply with the conditions.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'بمجرد استبدال المكيف وإتمام المعاملة لا يسمح بإرجاع المكيفات سواء المكيفات القديمة أو الجديدة.' : 'Once the air conditioner is replaced and the transaction is completed, the air conditioners are not allowed to be returned, whether old or new.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'تطبق الشروط والأحكام الخاصة باستمارة التركيب.' : 'Terms and conditions for the installation form apply.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'يخضع هذا العرض للشروط والأحكام العامة٫ الخاصة بشركة تمكين.' : 'This offer is subject to Tamkeen’s general terms and conditions.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'يتم الاستفادة من القسائم الشرائية على جميع منتجات شركة تمكين ( جنرال سوبريم - جولد تيك - كريازي ) المتوفرة داخل المعرض.' : 'Purchase vouchers can be used on all Tamkeen products (General Supreme - Gold Tech - Kiriazi) available inside the exhibition.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'لا يمكن استبدال أو استرداد قيمة القسائم الشرائية نقدا.' : '⁠Purchase vouchers cannot be exchanged or refunded for cash.'}</li>
                        <li className="my-2">- {params.lang === 'ar' ? 'لا يسري عرض الإستبدال على مكيفات التصفية.' : 'The replacement offer does not apply to filter air conditioners.'}</li>
                      </ul>
                      <p className="mt-6 font-bold text-xs ltr:text-left rtl:text-right">{params.lang === 'ar' ? 'لا يتم تطبيق عرض الاستبدال مع أي عرض آخر داخل المعرض ( الضريبة علينا - الاسترداد النقدي ).  العرض ساري حتى 30 يونيو 2024.' : 'The exchange offer is not applied with any other offer within the exhibition (tax on us - cash back). The offer is valid until June 30, 2024.'}</p>
                      <div className="mt-6 flex items-center justify-start">
                        <button
                          type="button"
                          className="border border-[#004B7A] bg-[#004B7A] text-white text-xs p-3 rounded-md shadow-md focus-visible:outline-none"
                          onClick={() => setTermsandCondition(false)}
                        >
                          {params.lang === 'ar' ? 'قبول الشروط والأحكام' : 'Accept Terms and Conditions'}
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        }
      </>
    </>
  )
}
