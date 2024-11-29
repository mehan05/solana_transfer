import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
export async function SendSol(receiverPubKey, amount, publicKey, signTransaction){
    try {
       
        const connection  = new  Connection(clusterApiUrl("devnet"),"confirmed");

        const ReceiverPubKey = new PublicKey(receiverPubKey);
        const transaction = new Transaction();

        const {blockhash} = await connection.getLatestBlockhash();

        transaction.recentBlockhash   = blockhash;
        transaction.feePayer = publicKey;

        transaction.add(
            SystemProgram.transfer({
                fromPubkey:publicKey,
                toPubkey:ReceiverPubKey,
                lamports:amount*LAMPORTS_PER_SOL
            })
        )

        const signedTransaction = await signTransaction(transaction);

        const signature = await connection.sendRawTransaction(signedTransaction.serialize());

        await connection.confirmTransaction (signature);


        alert("Transaction Sent");
    } catch (error) {
            alert("error");
            console.log(error);
            return;
    }
}