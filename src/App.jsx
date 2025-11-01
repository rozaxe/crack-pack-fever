import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Link, } from 'react-router-dom'

import { HomePage } from './pages/home'
import { CrackPage } from './pages/crack'
import { NavBar } from './components/NavBar'
import { CollectionPage } from './pages/collection'
import { NotFoundPage } from './pages/notFound'
import { AboutPage } from './pages/about'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            networkMode: 'always'
        }
    }
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Routes>
                    <Route element={<NavBar />}>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/collection/:code' element={<CollectionPage />} />
                        <Route path='/crack/:code' element={<CrackPage />} />
                        <Route path='/about' element={<AboutPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
