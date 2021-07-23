import {
    TransactionQuery,
    TransactionsState,
} from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { ICollisionMap } from '@/js/IAsset'
import { PlatformState } from './modules/platform/models'
import { BlocksState } from './modules/blocks/models'
import { Price } from '@/services/price'
import { SourcesState } from './modules/sources'

export interface IRootState {
    assets: {
        [key: string]: Asset
    }
    assetsLoaded: boolean
    assetAggregatesLoaded: boolean
    chainId: string
    recentTxRes: TransactionQuery
    known_addresses: {
        [key: string]: string
    }
    assetsSubsetForAggregations: {
        [key: string]: boolean
    }
    collisionMap: ICollisionMap
    pricesLoaded: boolean
    prices: Price | null
    Transactions: TransactionsState
    Platform: PlatformState
    Blocks: BlocksState
    Sources: SourcesState
}
