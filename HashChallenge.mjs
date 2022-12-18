import fetch from 'node-fetch'
import _sodium from "libsodium-wrappers";

function concat(array1, array2){
    return new Uint8Array([...array1, ...array2])
}

fetch('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/hash',{
    method:'post'
})
    .then((response) => response.json())
    .then((data) => {
        _sodium?.ready.then(() => {
            const sodium = _sodium;
            let message = sodium?.from_base64(data.message, sodium?.base64_variants.ORIGINAL)
            let candidate, byteArray
            let teller = 0
            let result;
            do{
                candidate = sodium.randombytes_buf(3)
                byteArray = concat(candidate,message)
                teller++
                result = sodium.crypto_generichash(_sodium.crypto_generichash_BYTES, byteArray)
                console.log("Poging" + teller)
            } while (!(result[0] === 0 && result[1] === 0))
            candidate = _sodium?.to_base64(candidate, _sodium?.base64_variants.ORIGINAL)
            try {
                fetch('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/hash/' + data.challengeId,
                    {
                        method: 'delete',
                        body: JSON.stringify({prefix: candidate})
                    }).then(response => {
                    console.log(response.status)
                })
            } catch (error){
                console.log(error)
            }
        })
        })