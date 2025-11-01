import clsx from 'clsx'
import { Link, Outlet, useMatch, useParams } from 'react-router-dom'
import { Background } from './Background'
import { SETS } from '../sets'
import { useListCollectedCard, usePackCount, useSetQuery } from '../../store/collection'
import { keys } from 'lodash-es'

export function NavBar() {

    const isCollectionPage = useMatch('/collection/:code')
    const isCrackPage = useMatch('/crack/:code')
    const params = useParams()

    return (
        <Background>
            <div className='flex flex-col min-h-screen'>
                <div className={clsx('navbar bg-primary text-primary-content', !isCollectionPage || !isCrackPage && 'shadow-sm')}>
                    <div className='flex-1'>
                        <Link to='/'>
                            <button className='btn btn-ghost btn-primary text-xl'>Crack Pack Fever</button>
                        </Link>
                    </div>
                    <div className='flex-none'>
                        <Link to='/about'>
                            <button className="btn btn-square btn-primary btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className='flex flex-col sticky top-0 z-1'>
                    {(isCollectionPage || isCrackPage) && (
                        <>
                            <div className='navbar bg-base-100'>
                                <Link to='/'>
                                    <button className='btn btn-ghost'>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </button>
                                </Link>
                                <div className='flex-1 flex flex-row justify-center items-center gap-4'>
                                    <i className={clsx("self-center ss ss-fw ss-2x", SETS[params.code].keyrune)} />
                                    <p className='pt-serif-bold text-center text-xl font-bold'>{SETS[params.code].name}</p>
                                    <PackStats />
                                    <SetStats />
                                </div>
                                <button className='invisible'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </button>
                            </div>

                            {isCollectionPage && (
                                <Link to={`/crack/${params.code}`}>
                                    <div className={'text-right md:text-center bg-emerald-300 text-emerald-800 shadow-md px-3 py-1 hover:bg-emerald-400 hover:text-emerald-900 font-medium'}>
                                        crack a pack <svg class="inline h-6 w-6 fill-current rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>
                                    </div>
                                </Link>
                            )}

                            {isCrackPage && (
                                <Link to={`/collection/${params.code}`}>
                                    <div className={'text-right md:text-center bg-emerald-300 text-emerald-800 shadow-md px-3 py-1 hover:bg-emerald-400 hover:text-emerald-900 font-medium'}>
                                        see collection <svg class="inline h-6 w-6 fill-current rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>
                                    </div>
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <Outlet />
            </div>
        </Background>
    )
}

function PackStats() {
    const { code } = useParams()

    const packCount = usePackCount(code)

    if (!packCount.isSuccess) {
        return <></>
    }

    return (
        <div className="tooltip" data-tip="Packs open">
            <div className={"pt-serif-regular text-xs rounded-full text-slate-800 bg-slate-200 px-2 py-0.5"}>{packCount.data}</div>
        </div>
    )
    return 
}

function SetStats() {
    const { code } = useParams()

    const setQuery = useSetQuery(code)
    const collection = useListCollectedCard(code)
    
    if (!setQuery.isSuccess || !collection.isSuccess) {
        return <></>
    }

    const setCount = setQuery.data.length
    const collectionCount = keys(collection.data).length

    return (
        <div className="flex flex-row gap-2">
            <div className="pt-serif-regular px-2 py-0.5 text-sm whitespace-nowrap text-base-100 bg-base-content rounded-[1.3333em/4em]">
                {collectionCount} / {setCount}
            </div>
            {collectionCount >= setCount && (
                <div className="pt-serif-bold px-2 py-0.5 text-sm whitespace-nowrap text-primary-content bg-primary rounded-[1.3333em/4em]">
                    Complete
                </div>
            )}
        </div>
    )
}
