import { clearStore, test, assert, beforeAll, afterAll, describe, createMockedFunction, log } from 'matchstick-as'
import { createICRTokenWithCall, createICRTokenID } from '../src/utils/Token'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { ICRProjectToken } from '../generated/ICRCarbonContractRegistry/ICRProjectToken'

test(
  'Should throw an error. Confirm test is working',
  () => {
    throw new Error()
  },
  true
)

const tokenAddress = Address.fromString('0xaE63fBD056512fC4B1D15B58A98F9Aaea44b18a9')

const tokenContract = ICRProjectToken.bind(tokenAddress)

const topTokenId = 52

const exPostTokenId = 6

const exAnteTokenId = 51

describe('Token Creation Tests', () => {
  beforeAll(() => {
    // Mocking necessary contract methods. Need to mock for all potential tokenIds

    for (let i = 1; i < topTokenId; i++) {
      createMockedFunction(tokenAddress, 'topTokenId', 'topTokenId():(uint256)').returns([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(topTokenId)),
      ])

      createMockedFunction(tokenAddress, 'projectName', 'projectName():(string)').returns([
        ethereum.Value.fromString('Skógálfar, Álfabrekka'),
      ])

      createMockedFunction(tokenAddress, 'isExPostToken', 'isExPostToken(uint256):(bool)')
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(i))])
        .returns([ethereum.Value.fromBoolean(true)])

      createMockedFunction(tokenAddress, 'exAnteToExPostTokenId', 'exAnteToExPostTokenId(uint256):(uint256)')
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(i))])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(i))])

      createMockedFunction(
        tokenAddress,
        'exPostVintageMapping',
        'exPostVintageMapping(uint256):(string,uint256,uint256,uint256,uint256)'
      )
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(i))])
        .returns([
          ethereum.Value.fromString('FCC-ISL-354-57-14-R-0-2027'),
          ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(398)),
          ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1798761600)),
          ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1830211200)),
          ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)),
        ])
    }
  })

  afterAll(() => {
    clearStore()
  })

  test('Create ICR Token entities', () => {
    const topTokenId = tokenContract.topTokenId()

    const isExPostToken = tokenContract.isExPostToken(BigInt.fromI32(exPostTokenId))
    const exAnteToExPostTokenId = tokenContract.exAnteToExPostTokenId(BigInt.fromI32(exAnteTokenId))
    const exPostVintageMapping = tokenContract.exPostVintageMapping(BigInt.fromI32(exPostTokenId))
    const projectName = tokenContract.projectName()

    log.info('Top Token ID: {}', [topTokenId.toString()])
    log.info('Is Ex Post Token: {}', [isExPostToken.toString()])
    log.info('Ex Ante to Ex Post Token ID: {}', [exAnteToExPostTokenId.toString()])
    log.info('Ex Post Vintage Mapping: {}', [exPostVintageMapping.value0.toString()])
    log.info('Project Name: {}', [projectName.toString()])

    createICRTokenWithCall(tokenAddress)
    const id = createICRTokenID(tokenAddress, BigInt.fromI32(exPostTokenId))

    assert.fieldEquals('Token', id.toHexString(), 'name', 'Skógálfar, Álfabrekka')
    assert.fieldEquals('Token', id.toHexString(), 'symbol', 'ICR-57-2027')
    assert.fieldEquals('Token', id.toHexString(), 'decimals', '18')
    assert.fieldEquals('Token', id.toHexString(), 'id', id.toHexString())
  })
})
