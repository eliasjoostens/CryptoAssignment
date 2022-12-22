import fetch from 'node-fetch'
import _sodium from 'libsodium-wrappers'

fetch('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/decrypt',{
    method:'post'
})
    .then((response) => response.json())
    .then((data) => {
        _sodium?.ready.then(() => {
            const sodium = _sodium;
            try {
                let nonce = sodium?.from_base64(data.nonce, sodium?.base64_variants.ORIGINAL)
                let cijfertekst = sodium?.from_base64(data.ciphertext, sodium?.base64_variants.ORIGINAL)
                let sleutel = sodium?.from_base64(data.key, sodium?.base64_variants.ORIGINAL)
                const klaartekst = sodium?.crypto_secretbox_open_easy(cijfertekst, nonce, sleutel)
                const base64Klaartekst = sodium.to_base64(klaartekst, sodium?.base64_variants.ORIGINAL)
    //console.log('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/decrypt/' + data.challengeId)
                fetch('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/decrypt/' + data.challengeId, {
                    method:'delete',
                    body: JSON.stringify({plaintext: base64Klaartekst})
                }).then(response => {
                    console.log(response.status)
                })
            } catch (error){
            console.log(error)
            }
        }
        )
    }
    )

