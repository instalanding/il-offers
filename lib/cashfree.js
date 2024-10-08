import { load } from '@cashfreepayments/cashfree-js';



const initilizeSdk = async () => {
	return cashfree = await load({
		mode: "sandbox"
	});
}