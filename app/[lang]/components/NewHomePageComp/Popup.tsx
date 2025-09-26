'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function Popup(props: any, request: any) {
    const isMobileOrTablet = props?.isMobileOrTablet;
    const lang = props?.lang;
    const [imgSrc, setImgSrc] = useState(
        '/images/TM50-mob-27July.webp'
    )
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        const hasShown = localStorage.getItem('hasShown');
        const isAuthenticated = localStorage.getItem("userid");
        // Show popup if the user has never seen it or if they are logged in for the first time
        if (hasShown !== 'true' || (isAuthenticated && hasShown !== 'true')) {
            setIsOpen(true);
            localStorage.setItem('hasShown', 'true');
        }
    }, []);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black bg-white relative">
                                <button type="button" className="focus-visible:outline-none text-white hover:text-white fill-white absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                                    <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                </button>
                                <Link href={`${props?.lang ? 'ar' : 'en'}/login`} aria-label={`${props?.lang ? 'ar' : 'en'}/login`} target='_blank' onClick={() => setIsOpen(false)}>
                                    <Image
                                        src={imgSrc}
                                        alt="popup"
                                        title="popup-discount"
                                        height={0}
                                        width={0}
                                        sizes='100vw'
                                        className='rounded-lg h-auto w-full'
                                        onClick={() => setIsOpen(false)}
                                    />
                                </Link>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}