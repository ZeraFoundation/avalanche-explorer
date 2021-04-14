import store from '@/store'
import { AVALANCHE_SUBNET_ID } from './platform'
import Big from 'big.js'

/**
 * @returns Count of active validators in Primary Network
 */
export function getTotalValidators(): number {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID]
    return !defaultSubnet ? 0 : defaultSubnet.validators.length
}

/**
 * @returns Count of pending validators in Primary Network
 */
export function getTotalPendingValidators(): number {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID]
    return !defaultSubnet ? 0 : defaultSubnet.pendingValidators.length
}

/**
 * @returns Total $AVAX active stake on Primary Network
 */
export function getTotalStake(): Big {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID]
    let total = Big(0)
    return !defaultSubnet
        ? total
        : (total = defaultSubnet.validators.reduce(
              (a, v) => a.add(Big(v.totalStakeAmount as number)),
              total
          ))
}

/**
 * @returns Total $AVAX pending stake on Primary Network
 */
export function getTotalPendingStake(): Big {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID]
    let total = Big(0)
    return !defaultSubnet
        ? total
        : (total = defaultSubnet.pendingValidators.reduce(
              (a, v) => a.add(Big(v.stakeAmount as number)),
              total
          ))
}

/**
 * @returns Accumulative distribution of active stakes
 */
export function getCumulativeStake(): number[] {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID]
    const res: number[] = []
    let total = 0
    if (defaultSubnet) {
        defaultSubnet.validators.forEach((v) => {
            total += v.totalStakeAmount as number
            res.push(total)
        })
    }
    return res
}

/**
 * @returns Accumulative distribution of pending stakes
 */
export function getCumulativePendingStake(): number[] {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID]
    const res: number[] = []
    let total = 0
    if (defaultSubnet) {
        defaultSubnet.pendingValidators.forEach((v) => {
            total += v.stakeAmount as number
            res.push(total)
        })
    }
    return res
}

/**
 * @returns Count of blockchains across all subnets
 */
export function getTotalBlockchains(): number {
    let total = 0
    for (const subnetID of Object.keys(store.state.Platform.subnets)) {
        total += store.state.Platform.subnets[subnetID].blockchains.length
    }
    return total
}