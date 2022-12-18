import fetch from 'node-fetch'
import _sodium from "libsodium-wrappers";

function voegSamen(array1, array2){
    return new Uint8Array([...array1, ...array2])
}

function maakRandomPrefix() {
    var randomArray = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
        randomArray[i] = Math.floor(Math.random() * 255);
    }
    return randomArray;
}

fetch('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/hash',{
    method:'post'
})
    .then((response) => response.json())
    .then((data) => {
        _sodium?.ready.then(() => {
            const sodium = _sodium;
            let message = sodium?.from_base64(data.message, sodium?.base64_variants.ORIGINAL)
            let nieuwePrefix, byteArray
            let teller = 0
            let hash, base64NieuwePrefix;
            do{
                nieuwePrefix = maakRandomPrefix()
                    //sodium.randombytes_buf(3)
                byteArray = voegSamen(nieuwePrefix,message)
                teller++
                hash = sodium.crypto_generichash(_sodium.crypto_generichash_BYTES, byteArray)
                console.log("Poging" + teller)
            } while (!(hash[0] === 0 && hash[1] === 0))
            base64NieuwePrefix = _sodium?.to_base64(nieuwePrefix, _sodium?.base64_variants.ORIGINAL)
            try {
                fetch('https://g5qrhxi4ni.execute-api.eu-west-1.amazonaws.com/Prod/hash/' + data.challengeId,
                    {
                        method: 'delete',
                        body: JSON.stringify({prefix: base64NieuwePrefix})
                    }).then(response => {
                    console.log(response.status)
                })
            } catch (error){
                console.log(error)
            }
        })
        })