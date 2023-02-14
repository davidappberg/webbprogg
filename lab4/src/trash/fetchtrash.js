const fetchValuesForKey = async (typeUrl, key) => {
	let url = typeUrl + key;
	if (key === "Avocado") {
		url = typeUrl + "avogadro";
	}
	try {
		const resp = await fetch(url);
		// if (!resp.ok) {
		// 	console.log(`${url} returned status ${resp.status}`);
		// 	throw new Error(`${url} returned status ${resp.status}`);
		// }
		const values = await resp.json();
		return { [key]: values };
	} catch (err) {
		console.log("fetchValuesForKey error:", err);
		return {};
	}
	const resp = await fetch(url);
	if (!resp.ok) {
		console.log(`${url} returned status ${resp.status}`);
		throw new Error(`${url} returned status ${resp.status}`);
		//return {};
	}

	const values = await resp.json();
	return { [key]: values };
};

const fetchInventory = async (url) => {
	const resp = await fetch(url);
	const keys = await resp.json();
	// console.log("resp: ", resp);
	// console.log("json obj: ", jsonObj);
	const partialInventory = {};
	if (resp.ok && keys) {
		const promises = keys.reduce(async (total, key) => {
			const values = await fetch(url + key);
			if (values.ok) {
				console.log("set key");
				total[key] = await values.json();
				console.log("partialInventory: ", partialInventory);
				// return { [key]: await values.json() };
			}
			// return {};
		}, {});
		console.log("promises1: ", promises);
		Promise.all(Object.values(partialInventory)).then((inv) => {
			console.log("inv", inv);
		});
		console.log("promises: ", partialInventory);
	}
};

const fetchAllKeys = (baseUrl, types) => {
	const promises = types.map(async (type) => {
		const url = baseUrl + type;
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`${url} returned status ${resp.status}`);
		}
		// return await resp.json();
		const keys = (await resp.json()).reduce((obj, key) => {
			const typeStr = type.substring(0, type.length - 2);
			// console.log("obj: ", obj, "   key: ", key, "   typeStr: ", typeStr);
			// obj[key] = { typeStr: true };
			// const values = await fetchValuesForKey(baseUrl + type + key);
			const values = {};
			console.log("obj: ", obj, "   key:", key, "   values: ", values);
			return { ...obj, [key]: fetchValuesForKey(baseUrl + type + key) };
			// return { ...obj, [key]: { [typeStr]: true } };
		}, {});
		console.log("keys obj: ", keys);
		return keys;
	});
	console.log("promises: ", promises);
	return Promise.all(promises).then((res) => {
		console.log("promise res: ", res);
		const valueRes = res.map((obj) => Promise.all(Object.values(obj)));
		console.log("value res", valueRes);
		return res;
	});
	// const res = Promise.all(promises.flat())
	// 	.then((allKeys) => {
	// 		console.log("all keys in promise", allKeys);
	// 		console.log("all keys in promise flat", allKeys.flat());
	// 		return allKeys.flat();
	// 	})
	// 	.catch((err) => {
	// 		console.error("Promise all in fetchKeys error:", err);
	// 		throw new Error(`fetching keys error`);
	// 	});
	// console.log("res_", res);
	// return res;
};

const fetchValues = (baseUrl, keys) => {
	const promises = keys.map(async (key) => {
		const url = baseUrl + key;
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`${url} returned status ${resp.status}`);
		}
		return await resp.json();
	});
	return Promise.all(promises);
};
