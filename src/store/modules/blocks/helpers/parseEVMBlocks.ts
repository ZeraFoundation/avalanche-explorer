import { EVMBlockQueryResponse, EVMBlockTransaction } from '../models'
import web3 from 'web3'
import { Buffer } from 'avalanche/dist'
import { Serialization } from 'avalanche/dist/utils'
import createHash from 'create-hash'
import { getTransaction } from '@/services/transactions'
import { Transaction } from '@/js/Transaction'
import { parseLogs } from './parseEVMLogs'
import { toAVAX } from '@/helper'
import Big from 'big.js'

export function parseEVMBlockTxs(txs: EVMBlockTransaction[] | null) {
    // console.log('txs                ', txs)
    if (!txs) return []
    const parsedTxs = txs.map((tx) => {
        console.log('tx           ', tx)

        // TODO: ecrecover https://ethereum.stackexchange.com/questions/12571/getting-an-address-from-ethereumjs-utils-ecrecover
        return {
            hash: tx.hash,
            type: tx.type,
            // SENDER (v,r,s resolves to fromAddr)
            v: '',
            r: '',
            s: '',
            nonce: '',

            // PAYLOAD
            value: new Big(web3.utils.hexToNumberString(tx.value)).div(
                Math.pow(10, 18)
            ),
            input: tx.input,
            gasPrice: new Big(web3.utils.hexToNumberString(tx.gasPrice)),
            gas: parseInt(web3.utils.hexToNumberString(tx.gas)),

            // RECIPIENT
            to: tx.to,
        }
    })
    // console.log('parsedTxs          ', parsedTxs)
    return parsedTxs
}

export async function parseAtomicTxs(
    blockExtraData: string
): Promise<Transaction[] | null> {
    if (blockExtraData === '') {
        return []
    } else {
        // Decode id
        const serialization: Serialization = Serialization.getInstance()
        const buf = Buffer.from(
            createHash('sha256').update(blockExtraData, 'base64').digest()
                .buffer
        )
        const hash = serialization.bufferToType(buf, 'cb58')
        // Get atomic tx data
        const txRes = await getTransaction(hash)
        const tx = new Transaction(txRes)
        return [tx]
    }
}

export async function parseEVMBlocks(block: EVMBlockQueryResponse) {
    const parsedBlock = {
        number: parseInt(web3.utils.hexToNumberString(block.header.number)),
        timestamp:
            parseInt(web3.utils.hexToNumberString(block.header.timestamp)) *
            1000,

        // MODIFIED MERKLE PATRICIA TREE
        hash: block.header.hash,
        parentHash: block.header.parentHash,
        stateRoot: block.header.stateRoot,
        transactionsRoot: block.header.stateRoot,
        atomicTransactionsRoot: block.header.extDataHash,
        receiptsRoot: block.header.receiptsRoot,

        // BLOCK SIZE
        gasLimit: parseInt(web3.utils.hexToNumberString(block.header.gasLimit)),
        gasUsed: parseInt(web3.utils.hexToNumberString(block.header.gasUsed)),

        // EXECUTIONS
        transactions: parseEVMBlockTxs(block.transactions),
        atomicTransactions: await parseAtomicTxs(block.blockExtraData),
        logs: parseLogs(block.logs),
    }
    return parsedBlock
}
