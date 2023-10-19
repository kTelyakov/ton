import { mnemonicToWalletKey } from "ton-crypto"
import { fromNano, internal, TonClient, WalletContractV4} from "ton"
import { getHttpEndpoint } from "@orbs-network/ton-access"

async function main () {
  const mnemonik = "cry crazy debris shaft history husband obscure found crouch divide boss garlic access reward feature obey wait rural enforce giggle hollow exit ocean jealous"
  const key = await mnemonicToWalletKey(mnemonik.split(" "))

  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 })
  const endpoint = await getHttpEndpoint({ network: "testnet" })
  const client = new TonClient({ endpoint })

  if (!await client.isContractDeployed(wallet.address)) {
    console.log("Contract not deployed")
  }

  console.log("Walled is deployed : ", wallet.address)

  const balance = await client.getBalance(wallet.address)

  console.log("balance : ", fromNano(balance))

  // EQBn8cBUDMRvyKXteceaA5RWRItVL3g7t-RzfbqA71ABAdCR

  const walletContract = client.open(wallet)
  const segno = await walletContract.getSeqno()

  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: segno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05",
        body: "hello",
        bounce: false,
      })
    ]
  })

  let currentSeqno = segno
  while (currentSeqno==segno) {
    console.log("waiting for transaction to confirm...")
    await sleep(1500)
    currentSeqno = await walletContract.getSeqno()
  }
  console.log("transaction confirmed")
}

main()

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}