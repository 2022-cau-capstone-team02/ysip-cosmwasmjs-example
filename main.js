const { SigningCosmWasmClient, Secp256k1HdWallet } = require("cosmwasm");

var openUrl = window.open('http://google.com');


window.onload = async() => {
    console.log("test");

    if (!window.keplr) {
        alert("Please install keplr extension");
    } 
    else {
        const chainId = "cosmoshub-4";
        await window.keplr.enable(chainId);
    
        const offlineSigner = window.keplr.getOfflineSigner(chainId);

        const accounts = await offlineSigner.getAccounts();
        console.log(accounts);
    
        const cosmJS = new SigningCosmosClient(
            "https://lcd-cosmoshub.keplr.app",
            accounts[0].address,
            offlineSigner,
        );
    }
}

async function test() {
    await window.keplr.enable(chainId);

    // 로컬 rpc 엔드포인트
    const rpcEndPoint = "http://localhost:26657/";
    // 니모닉키인데, 나중에 keplr 연동 시 필요 없어지는 부분
    const mnemonic = "wedding voyage since debate chaos pulse cricket carpet west weird goat wish subject aware flavor inherit thrive enter tomorrow bird decrease dismiss swear network";

    // wallet의 prefix를 ysip로 설정
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: "ysip"});
    const client = await SigningCosmWasmClient.connectWithSigner(rpcEndPoint, wallet);
    // wallet에서 account 정보를 받아옴
    const [firstAccout] = await wallet.getAccounts();
    // wallet 주소 보여주는 부분
    console.log(firstAccout.address);

    // tx 실행 시 필요한 gas 설정
    const feeMsg = {
        amount: [
            {
                denom: "ukrw",
                amount: "1"
            }
        ],
        // gas는 항상 이만큼 사용되는 것이 아니라 상한선임
        gas: "450000"
    };

    // ysip-contract/contracts/token/schema/instantiate_msg.json확인
    // 각 필드들을 타입에 맞춰 입력
    // required 부분에는 필요한 파라미터들의 이름
    // properties에는 각 파라미터들의 타입이 정의됨
    // Uint128은 string처럼 입력하면 됨
    const token_instantiate_msg = {
        name: "channel",
        symbol: "CHANNEL",
        decimals: 6,
        initial_balances: [],
        mint: {
            minter: firstAccout.address.toString(),
            cap: null
        }
    };

    // client으로 instantiate 시키는 부분
    let token_instantiate_result = await client.instantiate(
        firstAccout.address,
        1,
        token_instantiate_msg,
        "channal",
        fee=feeMsg
    );

    console.log(token_instantiate_result);

    let token_contract_address = token_instantiate_result['contractAddress'];
    
    // ysip-contract/contracts/token/schema/cw20_execute_msg.json에서 mint 항목 참고
    const token_mint_msg = {
        mint: {
            amount: "1000",
            recipient: firstAccout.address
        }
    }

    let token_mint_result = await client.execute(
        firstAccout.address,
        token_contract_address,
        token_mint_msg,
        feeMsg,
        null,
        []
    );

    console.log(token_mint_result);


    // ysip-contract/contracts/token/schema/query_msg.json에서 balance 항목 참고
    let token_balance_query_msg = {
        balance: {
            address: firstAccout.address
        }
    }

    // ysip-contract/contracts/token/schema/balance_response.json 항목 참고
    let balance = await client.queryContractSmart(
        token_contract_address,
        token_balance_query_msg
    );

    console.log(balance);
}

test();