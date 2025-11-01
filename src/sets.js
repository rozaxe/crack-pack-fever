import { merge, reverse, sortBy, values } from 'lodash-es'
import sets from './sets.json'
import { isMobile } from './lib/mobile'

const customs = {
    'SPM': {
        mtg: '/mtg_white.png',
        rune: '#c42c2b',
        cover: '/cover/SPM.png',
        width: '120px',
        bot: '50px',
        strip: '#c42c2b',
        background: 'linear-gradient(#273d6f, #346ca9)',
        bottom: '#346ca9',
    },
    'EOE': {
        mtg: '/mtg_white.png',
        rune: '#b6c90b',
        cover: '/cover/EOE.webp',
        width: '120px',
        bot: '40px',
        strip: '#acc215',
        text: '#39203e',
        background: 'linear-gradient(#984d85, #32182c)',
        bottom: '#32182c',
    },
    'FIN': {
        mtg: '/mtg_black.png',
        rune: '#282529',
        cover: '/cover/FIN.png',
        bot: '40px',
        strip: '#282529',
        background: '#e7e6e6',
        bottom: '#e7e6e6',
    },
    'TDM': {
        mtg: '/mtg_default.png',
        rune: '#b8c3cb',
        cover: '/cover/TDM.webp',
        width: '130px',
        bot: '50px',
        strip: '#b8c3cb',
        text: '#1a1a24',
        background: '#3b4153',
        bottom: '#3b4153',
    },
    'DFT': {
        mtg: '/mtg_default.png',
        rune: '#8c1b1e',
        cover: '/cover/DFT.webp',
        width: '140px',
        bot: '50px',
        strip: '#eab100',
        background: '#7dc6d7',
        bottom: '#7dc6d7',
        
    },
    'BLB': {
        mtg: '/mtg_default.png',
        rune: '#a2281a',
        cover: '/cover/BLB.webp',
        bot: '18px',
        strip: '#237043',
        background: 'linear-gradient(#83b2d3 60%, #9d9557 85%, #83b2d3 90%)',
        bottom: '#83b2d3',
    },
}

export const SETS = merge(sets, customs)

export const SET_ORDER = reverse(sortBy(values(SETS), 'releasedDate')).map(c => c.code)
